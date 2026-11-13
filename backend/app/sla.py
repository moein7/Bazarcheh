"""Tehran business-calendar arithmetic (Saturday-Wednesday, 09:00-17:00)."""
from __future__ import annotations
from datetime import datetime, time, timedelta, date
from zoneinfo import ZoneInfo

TEHRAN = ZoneInfo("Asia/Tehran")
BUSINESS_START, BUSINESS_END = time(9), time(17)
HOLIDAYS_JALALI = [(1405,1,d) for d in (1,2,3,4,12,13,25)] + [(1405,3,d) for d in (7,14,15)] + [(1405,4,d) for d in (5,6)] + [(1405,5,d) for d in (15,23,25)] + [(1405,6, d) for d in (1,10)] + [(1405,8,24)] + [(1405,10,d) for d in (3,17)] + [(1405,11,d) for d in (5,22)] + [(1405,12,d) for d in (10,20,21,29)]
def jalali_to_gregorian(jy: int, jm: int, jd: int) -> date:
    # Integer-calendar conversion (Borkowski/Jalaali break-year algorithm).
    breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178]
    gy = jy + 621; leap_j = -14; jp = breaks[0]
    for jm_break in breaks[1:]:
        jump = jm_break - jp
        if jy < jm_break: break
        leap_j += (jump // 33) * 8 + (jump % 33) // 4
        jp = jm_break
    n = jy - jp
    leap_j += (n // 33) * 8 + ((n % 33) + 3) // 4
    if jump % 33 == 4 and jump - n == 4: leap_j += 1
    leap_g = gy // 4 - ((gy // 100 + 1) * 3) // 4 - 150
    march = 20 + leap_j - leap_g
    if jm <= 6: days = (jm - 1) * 31 + jd - 1
    else: days = 186 + (jm - 7) * 30 + jd - 1
    return date(gy, 3, march) + timedelta(days=days)

HOLIDAYS = {jalali_to_gregorian(*x) for x in HOLIDAYS_JALALI}

def is_business_day(day: datetime | date) -> bool:
    local_date = day.date() if isinstance(day, datetime) else day
    return local_date.weekday() in {5,6,0,1,2} and local_date not in HOLIDAYS

def business_minutes_between(start: datetime, end: datetime) -> float:
    if end <= start: return 0.0
    start, end = start.astimezone(TEHRAN), end.astimezone(TEHRAN)
    total = 0.0; day = start.date()
    while day <= end.date():
        if is_business_day(day):
            lo = datetime.combine(day, BUSINESS_START, TEHRAN); hi = datetime.combine(day, BUSINESS_END, TEHRAN)
            a, b = max(lo,start), min(hi,end)
            if b > a: total += (b-a).total_seconds()/60
        day += timedelta(days=1)
    return total

def business_hours_between(start: datetime, end: datetime) -> float:
    return business_minutes_between(start,end)/60
