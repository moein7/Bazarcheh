"""HTTP API used by the dashboard frontend."""
from __future__ import annotations

import io
import time
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from math import ceil
from typing import Any

from pydantic import BaseModel, Field
from fastapi import FastAPI, File, HTTPException, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .analysis import analyze, parse_now
from .drafts import generate
from .activity import init_db, log_event, list_events, save_approved_reply, memory_summary
from .config import get_settings
from .sla import business_minutes_between

@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    log_event("system", "app_started", details={"version": "0.4.0"})
    yield


app = FastAPI(title="Bazarcheh Support Triage", version="0.4.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze_upload(
    file: UploadFile = File(...),
    now: str | None = Query(default=None, description="ISO-8601 UTC timestamp"),
) -> dict[str, Any]:
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="uploaded file is empty")
    try:
        reference_time = parse_now(now)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"invalid 'now': {exc}") from exc
    try:
        report = analyze(io.BytesIO(content), now=reference_time, include_details=True)
        log_event("user", "csv_analyzed", details={"filename": file.filename or "upload.csv", "messages": len(report.get("messages", [])), "unique_messages": report.get("total_unique_messages", 0), "urgent_messages": len(report.get("urgent_message_ids", []))})
        return report
    except ValueError as exc:
        log_event("system", "analysis_failed", details={"reason": str(exc)[:300]})
        raise HTTPException(status_code=400, detail=str(exc)) from exc


class DraftRequest(BaseModel):
    message_id: str
    customer_id: str | None = None
    subject: str = ""
    body: str = ""


@app.post("/api/draft")
def draft_reply(req: DraftRequest) -> dict[str, Any]:
    started = time.monotonic()
    result = generate(req.message_id, req.subject, req.body)
    elapsed_ms = round((time.monotonic() - started) * 1000)
    log_event("ai", "draft_fallback" if result.get("source") == "fallback" else ("draft_blocked" if result.get("blocked") else "draft_generated"), req.message_id, {
        "language": result.get("language"), "model": get_settings().llm_model,
        "source": result.get("source", "unknown"), "duration_ms": elapsed_ms, "warnings": result.get("warnings", []),
    })
    return result


class ActivityRequest(BaseModel):
    action: str
    message_id: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)


@app.post("/api/activity", status_code=202)
def record_activity(req: ActivityRequest) -> dict[str, bool]:
    allowed = {"message_selected", "category_filter_changed", "sort_changed", "draft_requested", "draft_copied", "view_opened", "draft_cleared_for_manual_reply", "manual_reply_copied", "draft_approved_and_copied_from_all_messages"}
    if req.action not in allowed:
        raise HTTPException(status_code=400, detail="unsupported activity action")
    # Do not accept free-form customer message text in activity metadata.
    safe_details = {k: v for k, v in req.details.items() if k in {"category", "sort", "view", "message_count"} and isinstance(v, (str, int, float, bool))}
    log_event("user", req.action, req.message_id, safe_details)
    return {"ok": True}


class DraftFeedbackRequest(BaseModel):
    message_id: str
    language: str
    generated_draft: str = ""
    approved_text: str
    source: str = "ai"


@app.post("/api/draft/feedback")
def draft_feedback(req: DraftFeedbackRequest) -> dict[str, bool]:
    if req.language not in {"fa", "en", "auto"}:
        raise HTTPException(status_code=400, detail="language must be fa, en or auto")
    if req.source not in {"ai", "manual", "fallback"}:
        raise HTTPException(status_code=400, detail="source must be ai, manual or fallback")
    if not req.approved_text.strip() or len(req.approved_text) > 5000:
        raise HTTPException(status_code=400, detail="approved_text must contain 1..5000 characters")
    saved = save_approved_reply(req.language, req.approved_text)
    action = "manual_reply_copied" if req.source == "manual" else "draft_approved_and_copied"
    log_event("user", action, req.message_id, {
        "language": req.language, "source": req.source, "edited": req.approved_text.strip() != req.generated_draft.strip(),
        "saved_as_style_example": saved,
    })
    return {"ok": True, "saved_as_style_example": saved}


@app.get("/api/logs")
def get_logs(limit: int = Query(default=100, ge=1, le=500), event_type: str | None = None) -> dict[str, Any]:
    if event_type not in {None, "user", "ai", "system"}:
        raise HTTPException(status_code=400, detail="invalid event_type")
    return {"items": list_events(limit, event_type), "memory": memory_summary()}


class SLARefreshRequest(BaseModel):
    received_at: list[str]
    now: str


@app.post("/api/sla/refresh")
def refresh_sla(req: SLARefreshRequest) -> dict[str, Any]:
    if len(req.received_at) > 2000:
        raise HTTPException(status_code=400, detail="too many timestamps")
    try:
        now = datetime.fromisoformat(req.now.replace("Z", "+00:00"))
        if now.tzinfo is None:
            raise ValueError("now must include a timezone")
        now = now.astimezone(timezone.utc)
        sla_minutes = get_settings().urgent_sla_business_hours * 60
        result = []
        for raw in req.received_at:
            received = datetime.fromisoformat(raw.replace("Z", "+00:00"))
            if received.tzinfo is None:
                raise ValueError("received_at must include a timezone")
            elapsed = business_minutes_between(received, now)
            remaining = sla_minutes - elapsed
            result.append({"received_at": raw, "business_minutes_left": int(ceil(remaining)), "is_urgent": elapsed >= sla_minutes})
        return {"items": result, "server_now": datetime.now(timezone.utc).isoformat()}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"invalid timestamp: {exc}") from exc
