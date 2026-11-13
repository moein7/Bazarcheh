"""Small persistent activity log and privacy-conscious approved-reply memory."""
from __future__ import annotations

import json
import os
import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


def _db_path() -> Path:
    return Path(os.environ.get("BAZARCHEH_DB_PATH", "/data/bazarcheh.db"))


def _connect() -> sqlite3.Connection:
    path = _db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=10000")
    return conn


@contextmanager
def _db():
    conn = _connect()
    try:
        with conn:
            yield conn
    finally:
        conn.close()


def init_db() -> None:
    with _db() as conn:
        conn.execute("""CREATE TABLE IF NOT EXISTS activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            action TEXT NOT NULL,
            message_id TEXT,
            details_json TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL
        )""")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC)")
        conn.execute("""CREATE TABLE IF NOT EXISTS approved_reply_memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            language TEXT NOT NULL,
            approved_reply TEXT NOT NULL,
            created_at TEXT NOT NULL
        )""")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_reply_memory_language ON approved_reply_memory(language, created_at DESC)")


def log_event(event_type: str, action: str, message_id: str | None = None, details: dict[str, Any] | None = None) -> None:
    init_db()
    safe_details = details or {}
    with _db() as conn:
        conn.execute(
            "INSERT INTO activity_logs(event_type, action, message_id, details_json, created_at) VALUES (?, ?, ?, ?, ?)",
            (event_type, action, message_id, json.dumps(safe_details, ensure_ascii=False, default=str), datetime.now(timezone.utc).isoformat()),
        )
        conn.execute("DELETE FROM activity_logs WHERE id NOT IN (SELECT id FROM activity_logs ORDER BY id DESC LIMIT 10000)")


def list_events(limit: int = 100, event_type: str | None = None) -> list[dict[str, Any]]:
    init_db()
    limit = max(1, min(int(limit), 500))
    with _db() as conn:
        if event_type in {"user", "ai", "system"}:
            rows = conn.execute("SELECT * FROM activity_logs WHERE event_type=? ORDER BY id DESC LIMIT ?", (event_type, limit)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM activity_logs ORDER BY id DESC LIMIT ?", (limit,)).fetchall()
    return [{"id": r["id"], "event_type": r["event_type"], "action": r["action"], "message_id": r["message_id"], "details": json.loads(r["details_json"] or "{}"), "created_at": r["created_at"]} for r in rows]


def _sanitize_reply(text: str) -> str:
    """Keep style examples, not customer/order identifiers or numeric commitments."""
    value = (text or "").strip().translate(str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789"))
    value = re.sub(r"\bBZ[-\s]?\d+\b", "[ORDER]", value, flags=re.I)
    value = re.sub(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", "[EMAIL]", value)
    value = re.sub(r"(?<!\w)(?:\+?\d[\d\s()-]{7,}\d)(?!\w)", "[PHONE]", value)
    value = re.sub(r"\b\d+(?:[.,]\d+)?\b", "[NUMBER]", value)
    return value[:1600]


def save_approved_reply(language: str, approved_reply: str) -> bool:
    sanitized = _sanitize_reply(approved_reply)
    if len(sanitized) < 8:
        return False
    init_db()
    with _db() as conn:
        conn.execute("INSERT INTO approved_reply_memory(language, approved_reply, created_at) VALUES (?, ?, ?)", (language, sanitized, datetime.now(timezone.utc).isoformat()))
        # Keep a small, bounded memory; this is a style memory, not model training.
        conn.execute("DELETE FROM approved_reply_memory WHERE id NOT IN (SELECT id FROM approved_reply_memory ORDER BY id DESC LIMIT 50)")
    return True


def recent_approved_replies(language: str, limit: int = 3) -> list[str]:
    init_db()
    with _db() as conn:
        rows = conn.execute("SELECT approved_reply FROM approved_reply_memory WHERE language=? ORDER BY id DESC LIMIT ?", (language, limit)).fetchall()
    return [r["approved_reply"] for r in rows]


def memory_summary() -> dict[str, Any]:
    init_db()
    with _db() as conn:
        count = conn.execute("SELECT COUNT(*) FROM approved_reply_memory").fetchone()[0]
        fa = conn.execute("SELECT COUNT(*) FROM approved_reply_memory WHERE language='fa'").fetchone()[0]
        en = conn.execute("SELECT COUNT(*) FROM approved_reply_memory WHERE language='en'").fetchone()[0]
    return {"approved_examples": count, "fa_examples": fa, "en_examples": en, "max_examples": 50}
