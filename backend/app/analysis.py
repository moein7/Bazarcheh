"""End-to-end analysis pipeline shared by the API and the CLI."""
from __future__ import annotations

from datetime import datetime, timezone
from math import ceil
from pathlib import Path
from typing import IO, Any

import pandas as pd

from .classify import classify_messages
from .config import CATEGORIES, Settings, get_settings
from .dedup import mark_duplicates
from .ingest import load_messages
from .orders import extract_order_ref
from .urgency import is_urgent
from .sla import business_minutes_between


def parse_now(value: str | None) -> datetime:
    if not value:
        return datetime.now(timezone.utc)
    ts = pd.Timestamp(value)
    if ts.tzinfo is None:
        ts = ts.tz_localize("UTC")
    return ts.tz_convert("UTC").to_pydatetime()


def _iso(value: Any) -> str | None:
    if value is None or pd.isna(value):
        return None
    return pd.Timestamp(value).tz_convert("UTC").strftime("%Y-%m-%dT%H:%M:%SZ")


def enrich(df: pd.DataFrame, now: datetime, settings: Settings) -> pd.DataFrame:
    """Add order_ref, duplicate_of, category and is_urgent columns."""
    df = df.copy()
    df["order_ref"] = [extract_order_ref(o, b) for o, b in zip(df["order_ref"], df["body"])]
    df["duplicate_of"] = mark_duplicates(df)

    canonical = df["duplicate_of"].isna()
    categories = classify_messages(df[canonical], settings)
    by_id = dict(zip(df.loc[canonical, "message_id"], categories))
    df["category"] = [
        by_id[dup if dup is not None else mid]
        for mid, dup in zip(df["message_id"], df["duplicate_of"])
    ]

    df["is_urgent"] = [
        bool(is_canonical)
        and is_urgent(hint, received, answered, now, settings.urgent_sla_business_hours)
        for is_canonical, hint, received, answered in zip(
            canonical, df["severity_hint"], df["received_at"], df["answered_at"]
        )
    ]
    return df


def build_report(df: pd.DataFrame, include_details: bool = False, settings: Settings | None = None, now: datetime | None = None) -> dict[str, Any]:
    settings = settings or get_settings()
    now = now or datetime.now(timezone.utc)
    unique = df[df["duplicate_of"].isna()]
    counts = unique["category"].value_counts()

    messages: list[dict[str, Any]] = []
    for row in df.itertuples(index=False):
        item: dict[str, Any] = {
            "message_id": row.message_id,
            "category": row.category,
            "is_urgent": bool(row.is_urgent),
            "order_ref": row.order_ref,
            "duplicate_of": row.duplicate_of,
        }
        if include_details:
            item.update(
                {
                    "customer_id": row.customer_id,
                    "channel": row.channel,
                    "received_at": _iso(row.received_at),
                    "answered_at": _iso(row.answered_at),
                    "subject": row.subject,
                    "body": row.body,
                    "severity": row.severity_hint,
                    "severity_hint": row.severity_hint,
                    "business_minutes_left": int(ceil(settings.urgent_sla_business_hours * 60 - business_minutes_between(row.received_at, now))),
                }
            )
        messages.append(item)

    return {
        "total_unique_messages": int(len(unique)),
        "category_counts": {category: int(counts.get(category, 0)) for category in CATEGORIES},
        "urgent_message_ids": sorted(unique.loc[unique["is_urgent"], "message_id"].tolist()),
        "messages": messages,
    }


def analyze(
    source: str | Path | IO[bytes] | IO[str],
    now: datetime | None = None,
    settings: Settings | None = None,
    include_details: bool = False,
) -> dict[str, Any]:
    settings = settings or get_settings()
    now = now or datetime.now(timezone.utc)
    df = load_messages(source)
    df = enrich(df, now, settings)
    report = build_report(df, include_details=include_details, settings=settings, now=now)
    if include_details:
        attention = [m for m in report["messages"] if not m["duplicate_of"] and m["severity_hint"] == "high" and not m["answered_at"]]
        attention.sort(key=lambda m: (m["business_minutes_left"], m["received_at"]))
        report["attention_message_ids"] = [m["message_id"] for m in attention]
    return report
