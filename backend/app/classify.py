"""Deterministic multilingual category classification; never calls an LLM."""
from __future__ import annotations

import pandas as pd

from .config import Settings

KEYWORDS: dict[str, tuple[str, ...]] = {
    "refund": (
        "refund", "money back", "bargasht", "pas bedid",
        "مرجوع", "بازگشت وجه", "برگشت پول", "پول برنگشته", "استرداد", "عودت",
    ),
    "payment": (
        "payment", "paid", "charged", "card", "wallet", "invoice", "factor", "pardakht",
        "پرداخت", "برداشت", "کارت", "کیف پول", "فاکتور", "تراکنش", "درگاه",
    ),
    "delivery": (
        "delivery", "deliver", "arrive", "arrived", "shipping", "courier", "tracking", "package", "parcel",
        "tahvil", "ersal", "post",
        "ارسال", "تحویل", "مرسوله", "پیک", "بسته", "پست", "کد رهگیری",
    ),
    "product_quality": (
        "broken", "damaged", "defective", "quality", "fake", "not working", "wrong item",
        "different item", "manual", "install", "colour", "color", "kharab", "rang", "taviz",
        "خراب", "شکسته", "کیفیت", "معیوب", "تقلبی", "کار نمی", "رنگ", "لک", "راهنما",
        "نصب", "مشخصات", "تعویض", "بو ",
    ),
    "account": (
        "account", "password", "login", "log in", "sign in", "otp", "hesab", "ramz",
        "حساب", "رمز", "ورود", "پسورد", "کد تایید", "شماره موبایل",
    ),
}

CATEGORY_ORDER: tuple[str, ...] = ("refund", "payment", "account", "product_quality", "delivery")


def classify_keywords(subject: str, body: str) -> str:
    text = f"{subject} {body}".lower().replace("ي", "ی").replace("ى", "ی").replace("ك", "ک")
    for category in CATEGORY_ORDER:
        if any(word in text for word in KEYWORDS[category]):
            return category
    return "other"


def classify_messages(df: pd.DataFrame, settings: Settings) -> pd.Series:
    """Classify synchronously with deterministic rules.

    LLM classification is deliberately not part of CSV analysis: one local
    inference per message made uploads slow and caused reverse-proxy 504s.
    Ollama is reserved for explicit, user-initiated reply drafting.
    """
    return pd.Series(
        [classify_keywords(subject, body) for subject, body in zip(df["subject"], df["body"])],
        index=df.index,
        dtype=object,
    )
