# Business Calendar Reference

Fixed policy:
- Timezone: Asia/Tehran
- Working days: Saturday, Sunday, Monday, Tuesday, Wednesday
- Working hours: 09:00 inclusive to 17:00 exclusive
- Thursday and Friday: closed
- Holidays: exact Jalali dates in original challenge:
  1405/01/01, 1405/01/02, 1405/01/03, 1405/01/04, 1405/01/12,
  1405/01/13, 1405/01/25, 1405/03/07, 1405/03/14, 1405/03/15,
  1405/04/05, 1405/04/06, 1405/05/15, 1405/05/23, 1405/05/25,
  1405/06/01, 1405/06/10, 1405/08/24, 1405/10/03, 1405/10/17,
  1405/11/05, 1405/11/22, 1405/12/10, 1405/12/20, 1405/12/21,
  1405/12/29.

Implementation notes:
- Do not use naive datetime arithmetic.
- Represent work sessions as local timezone-aware intervals.
- Business elapsed time is the sum of interval overlap between [start, end].
- If a message arrives outside work hours, accumulation begins at the next working interval.
- If now precedes creation time, define safe behavior and test it; do not return a misleading negative elapsed duration.
- Convert Jalali dates with a verified library or independently validated mapping. Keep original dates in config/comments for traceability.
- 120 business minutes exactly means overdue.
