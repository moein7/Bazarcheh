from __future__ import annotations

from app.orders import extract_order_ref


def test_order_ref_from_field() -> None:
    assert extract_order_ref("BZ-48219", "") == "BZ-48219"


def test_order_ref_from_body_when_field_empty() -> None:
    assert extract_order_ref("", "my order bz-77310 is late") == "BZ-77310"
    assert extract_order_ref("", "no order mentioned") is None


def test_order_ref_normalizes_persian_digits() -> None:
    assert extract_order_ref("", "سفارش BZ-۴۹۵۴۷۴") == "BZ-495474"
