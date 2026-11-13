from __future__ import annotations
import re
_DIGITS = str.maketrans("۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩", "01234567890123456789")
ORDER_REF_PATTERN = re.compile(r"BZ\s*[-–—]?\s*([0-9]+)", re.I)
def normalize_digits(text: str | None) -> str:
    return (text or "").translate(_DIGITS)
def find_order_ref(text: str | None) -> str | None:
    match = ORDER_REF_PATTERN.search(normalize_digits(text))
    return f"BZ-{match.group(1)}" if match else None
def extract_order_ref(order_ref: str | None, body: str | None) -> str | None:
    return find_order_ref(order_ref) or find_order_ref(body)
