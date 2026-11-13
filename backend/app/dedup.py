"""Duplicate detection: the same customer resending the same text."""
from __future__ import annotations

import re
import unicodedata

import pandas as pd

_WHITESPACE = re.compile(r"\s+")


def normalize_body(text: str) -> str:
    """Canonical form of a message body used for duplicate comparison.

    Applies Unicode NFC composition, collapses runs of whitespace (spaces,
    tabs, newlines) to a single space, trims, and lower-cases.
    """
    text = unicodedata.normalize("NFKC", text or "").translate(str.maketrans({"ي": "ی", "ى": "ی", "ك": "ک", "ـ": ""}))
    # Treat Arabic vowel marks and Persian ZWNJ/ordinary spaces consistently.
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    text = text.replace("\u200c", " ").replace("\u200e", "").replace("\u200f", "")
    text = _WHITESPACE.sub(" ", text)
    return text.strip().lower()


def dedup_key(customer_id: str, body: str) -> str:
    return f"{(customer_id or '').strip()}|{normalize_body(body)}"


def mark_duplicates(df: pd.DataFrame) -> pd.Series:
    """Return a Series (aligned to ``df``) with the canonical message_id for
    duplicates and ``None`` for canonical messages.

    The earliest received message in each group is canonical; ties keep file
    order.
    """
    keys = [dedup_key(c, b) if str(c).strip() and normalize_body(b) else f"__unique__{i}" for i, (c, b) in enumerate(zip(df["customer_id"], df["body"]))]
    order = df.assign(_key=keys, _pos=range(len(df))).sort_values(
        ["received_at", "_pos"], kind="stable"
    )

    canonical_for_key: dict[str, str] = {}
    duplicate_of: dict[int, str | None] = {}
    for idx, key, message_id in zip(order.index, order["_key"], order["message_id"]):
        if key in canonical_for_key:
            duplicate_of[idx] = canonical_for_key[key]
        else:
            canonical_for_key[key] = message_id
            duplicate_of[idx] = None

    return pd.Series([duplicate_of[i] for i in df.index], index=df.index, dtype=object)
