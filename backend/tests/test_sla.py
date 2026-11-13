from __future__ import annotations

from datetime import datetime, timezone

from app.sla import business_hours_between


def _utc(*args: int) -> datetime:
    return datetime(*args, tzinfo=timezone.utc)


def test_business_hours_within_one_day() -> None:
    # Monday 2026-10-26, 10:00 -> 13:30
    assert business_hours_between(_utc(2026, 10, 26, 10, 0), _utc(2026, 10, 26, 13, 30)) == 3.5


def test_business_hours_skip_weekend() -> None:
    # Friday evening UTC is Saturday in Tehran; Saturday and Sunday are working days.
    start = _utc(2026, 10, 23, 16, 0)
    end = _utc(2026, 10, 26, 10, 0)
    assert business_hours_between(start, end) == 20.5


def test_business_hours_empty_interval() -> None:
    t = _utc(2026, 10, 26, 10, 0)
    assert business_hours_between(t, t) == 0.0


def test_tehran_weekend_and_holiday_are_excluded() -> None:
    # Friday in Tehran is closed; Saturday is open. 1405/01/01 is a holiday.
    from app.sla import business_minutes_between, TEHRAN
    from datetime import datetime
    friday = datetime(2026, 3, 20, 9, 0, tzinfo=TEHRAN)
    saturday = datetime(2026, 3, 21, 17, 0, tzinfo=TEHRAN)
    assert business_minutes_between(friday, saturday) == 0
    holiday_start = datetime(2026, 3, 21, 9, 0, tzinfo=TEHRAN)
    holiday_end = datetime(2026, 3, 22, 9, 0, tzinfo=TEHRAN)
    assert business_minutes_between(holiday_start, holiday_end) == 0


def test_answered_message_is_never_urgent_even_when_answer_is_after_reference_time():
    from datetime import datetime, timezone
    from app.urgency import is_urgent
    received = datetime.fromisoformat("2026-10-24T06:00:00+00:00")
    answered = datetime.fromisoformat("2026-10-26T08:00:00+00:00")
    now = datetime.fromisoformat("2026-10-26T07:00:00+00:00")
    assert is_urgent("high", received, answered, now, 2) is False


def test_urgent_threshold_is_119_120_121_business_minutes() -> None:
    from datetime import datetime, timedelta
    from app.sla import TEHRAN
    from app.urgency import is_urgent

    received = datetime(2026, 10, 26, 9, 0, tzinfo=TEHRAN)
    for elapsed, expected in ((119, False), (120, True), (121, True)):
        now = received + timedelta(minutes=elapsed)
        assert is_urgent("high", received, None, now, 2) is expected


def test_thursday_is_not_a_business_day() -> None:
    from datetime import datetime
    from app.sla import TEHRAN, business_minutes_between

    thursday = datetime(2026, 10, 22, 9, 0, tzinfo=TEHRAN)
    friday = datetime(2026, 10, 23, 17, 0, tzinfo=TEHRAN)
    assert business_minutes_between(thursday, friday) == 0
