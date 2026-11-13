# ADR-0003: Business calendar and SLA calculation

- Status: Proposed
- Related requirements: REQ-SLA-001..010

## Context
The response promise is two business hours, not two elapsed wall-clock hours.

## Decision
Use `Asia/Tehran`, Saturday–Wednesday, 09:00–17:00 local time, excluding Thursday, Friday, and the exact supplied 1405 holiday dates. Convert timestamps to timezone-aware instants before computing overlap with working intervals. SLA threshold is 120 business minutes; equality is overdue.

Store holiday dates in one canonical, testable configuration. Convert Jalali holiday inputs using a verified date conversion approach or explicit validated Gregorian equivalents. Do not guess conversions.

## Alternatives
- Wall-clock subtraction — rejected.
- Hard-coded elapsed-hour approximation — rejected.
- Interval-overlap business calendar — preferred.

## Verification
Test opening/closing boundaries, overnight spans, weekends, every holiday, multiple workdays, DST/timezone handling as applicable, and exactly 119/120/121 business minutes.
