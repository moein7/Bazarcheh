from __future__ import annotations
from datetime import datetime
import pandas as pd
from .sla import business_minutes_between

def is_urgent(severity_hint: str, received_at: datetime, answered_at: datetime | None, now: datetime, sla_hours: float) -> bool:
    if str(severity_hint).lower() != "high": return False
    # Any recorded answer means the conversation is handled, even if it was late.
    if answered_at is not None and not pd.isna(answered_at): return False
    return business_minutes_between(received_at, now) >= sla_hours * 60
