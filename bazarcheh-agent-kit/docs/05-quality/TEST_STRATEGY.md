# Test Strategy

## 1. Unit tests
- Unicode/text normalization.
- Persian and Arabic-Indic digit conversion.
- Duplicate matching and original selection.
- Order reference extraction.
- Category enum validation.
- Severity and answered-state mapping.
- Business calendar intervals.
- Business-minute calculations.
- Urgency and attention sorting.
- Draft output safety validation.

## 2. Boundary tests
- 119, 120, and 121 business minutes.
- Start at 09:00 and close at 17:00.
- Message received outside working hours.
- Thursday/Friday and each supplied holiday.
- Work interval spanning multiple closed days.
- Answered before and after SLA breach.
- Duplicate high-severity message.

## 3. Contract tests
- Exact CLI invocation and output keys.
- One `messages` entry per input row.
- `duplicate_of` references original ID.
- Draft API success and blocked response.
- HTTP 200 when LLM unavailable.
- Same-origin browser request path.

## 4. Frontend tests
- Upload and analysis state.
- RTL document direction.
- English message `dir=auto` behavior.
- Required data-testid attributes.
- Attention list order and data attributes.
- Urgent count equals overdue attention rows.
- Fake clock advances and updates every <= 60 seconds.
- Timer ticks trigger no LLM/network request.
- Draft click only, edit, copy-only approval, blocked warning.

## 5. Evaluation
Use labeled evaluation data if supplied. If not, do not fabricate ground truth. A small manually labeled sample can help detect obvious failures, but report its size, sampling method, reviewer, and limitations. Report per-class metrics only when labels are trustworthy.

## 6. Test report format
| Command | Environment | Result | Notes |
|---|---|---|---|
| | | Passed/Failed/Not run/Blocked | |
