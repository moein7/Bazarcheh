"""Loading the support-system CSV export into a DataFrame."""
from __future__ import annotations

from pathlib import Path
from typing import IO

import pandas as pd
import re

COLUMNS: list[str] = [
    "message_id",
    "customer_id",
    "channel",
    "received_at",
    "answered_at",
    "subject",
    "body",
    "order_ref",
    "severity_hint",
]


_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
def _parse_one(value: str):
    value = str(value or "").strip().translate(_DIGITS)
    if not value: return pd.NaT
    try:
        if re.match(r"^\d{4}/\d{1,2}/\d{1,2}", value):
            from .sla import jalali_to_gregorian
            match = re.match(r"^(\d{4})/(\d{1,2})/(\d{1,2})\s+(\d{1,2}):(\d{2})$", value)
            if not match: return pd.NaT
            y, mo, d, hour, minute = map(int, match.groups())
            local = pd.Timestamp(jalali_to_gregorian(y, mo, d)).replace(hour=hour, minute=minute).tz_localize("Asia/Tehran")
            return local.tz_convert("UTC")
        return pd.to_datetime(value, errors="coerce", utc=True)
    except (ValueError, TypeError): return pd.NaT
def parse_timestamps(values: pd.Series) -> pd.Series:
    return pd.Series([_parse_one(v) for v in values], index=values.index, dtype="datetime64[ns, UTC]")


def load_messages(source: str | Path | IO[bytes] | IO[str]) -> pd.DataFrame:
    """Read a support export and return one row per message, in file order."""
    df = pd.read_csv(source, dtype=str, keep_default_na=False)

    missing = [c for c in COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"export is missing columns: {', '.join(missing)}")

    df = df[COLUMNS].fillna("")
    for col in ("message_id", "customer_id", "channel", "order_ref", "severity_hint"):
        df[col] = df[col].str.strip()
    df["severity_hint"] = df["severity_hint"].str.lower()

    df = df[df["message_id"] != ""]

    df["received_at"] = parse_timestamps(df["received_at"])
    df["answered_at"] = parse_timestamps(df["answered_at"])

    # discard malformed rows
    df = df.dropna(subset=["received_at"])

    return df.reset_index(drop=True)
