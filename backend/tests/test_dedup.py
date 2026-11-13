from __future__ import annotations

from pathlib import Path

import pandas as pd

from app.dedup import mark_duplicates, normalize_body
from app.ingest import load_messages


def test_normalize_body_whitespace_and_case() -> None:
    assert normalize_body("  Hello   THERE\n friend ") == "hello there friend"


def test_resent_message_marked_as_duplicate(sample_csv: Path) -> None:
    df = load_messages(sample_csv)
    dups = mark_duplicates(df)
    assert dups.tolist() == [None, None, "M001", None]


def test_same_text_from_different_customers_is_not_duplicate() -> None:
    df = pd.DataFrame(
        {
            "message_id": ["A", "B"],
            "customer_id": ["C1", "C2"],
            "body": ["Where is my parcel?", "Where is my parcel?"],
            "received_at": pd.to_datetime(["2026-10-26T08:00:00Z", "2026-10-26T08:05:00Z"]),
        }
    )
    assert mark_duplicates(df).tolist() == [None, None]


def test_normalize_persian_arabic_variants_and_zwnj() -> None:
    from app.dedup import normalize_body
    assert normalize_body("كِتاب‌خوب") == normalize_body("کتاب خوب")
