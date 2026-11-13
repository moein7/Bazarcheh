from __future__ import annotations

import json
from pathlib import Path

from app.analysis import analyze, parse_now
from app.cli import main


def test_category_counts_use_unique_messages(sample_csv: Path) -> None:
    report = analyze(sample_csv, now=parse_now("2026-10-26T10:00:00Z"))
    assert report["total_unique_messages"] == 3
    assert sum(report["category_counts"].values()) == 3
    assert report["category_counts"]["delivery"] == 1
    assert report["category_counts"]["account"] == 1


def test_cli_writes_output_schema(sample_csv: Path, tmp_path: Path) -> None:
    out = tmp_path / "out.json"
    assert main(["analyze", "--input", str(sample_csv), "--output", str(out),
                 "--now", "2026-10-26T12:00:00Z"]) == 0

    report = json.loads(out.read_text(encoding="utf-8"))
    assert set(report) == {"total_unique_messages", "category_counts",
                           "urgent_message_ids", "messages"}
    assert len(report["messages"]) == 4
    first = report["messages"][0]
    assert set(first) == {"message_id", "category", "is_urgent", "order_ref", "duplicate_of"}
    assert first["order_ref"] == "BZ-10234"
    assert report["messages"][2]["duplicate_of"] == "M001"
    assert report["urgent_message_ids"] == ["M002"]


def test_category_counts_always_include_all_six_categories(sample_csv: Path) -> None:
    report = analyze(sample_csv, now=parse_now("2026-10-26T10:00:00Z"))
    assert set(report["category_counts"]) == {"delivery", "payment", "refund", "product_quality", "account", "other"}
    assert all(isinstance(value, int) for value in report["category_counts"].values())


def test_any_recorded_answer_is_handled_even_when_answer_was_late(sample_csv: Path) -> None:
    report = analyze(sample_csv, now=parse_now("2026-10-26T10:00:00Z"), include_details=True)
    answered = next(message for message in report["messages"] if message["answered_at"] is not None)
    assert answered["is_urgent"] is False
    assert answered["message_id"] not in report["attention_message_ids"]


def test_csv_classification_never_waits_for_llm_even_when_ollama_is_configured(sample_csv: Path) -> None:
    from app.config import Settings

    settings = Settings(
        urgent_sla_business_hours=2,
        llm_base_url="http://host.docker.internal:11434/v1",
        llm_api_key="ollama",
        llm_model="qwen3-coder:30b",
        llm_timeout_seconds=180,
    )
    report = analyze(sample_csv, now=parse_now("2026-10-26T10:00:00Z"), settings=settings)
    assert report["total_unique_messages"] == 3
    assert sum(report["category_counts"].values()) == 3
