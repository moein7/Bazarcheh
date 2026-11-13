# Acceptance Test Matrix

## Data
- Same customer + same normalized text => resend.
- Different customer + same text => not resend.
- Same customer + different text => not resend.
- Resend remains in row-level output but not unique count.
- Order ID extracted from column and body.
- Persian/Arabic-Indic digits normalized.
- Category is exactly one allowed enum.

## SLA
- 119 business minutes => not urgent.
- Exactly 120 business minutes => urgent if high severity and unanswered.
- 121 business minutes => urgent if high severity and unanswered.
- Answered after 120 minutes => not urgent.
- Low severity => not urgent.
- High severity, unanswered, 30 minutes remaining => in attention list.
- Thursday, Friday, and official holidays add zero business minutes.
- Attention sort puts most overdue first, then nearest upcoming breach.
- `data-business-minutes-left` is integer; <= 0 means overdue.

## Dashboard
- `urgent-count` equals overdue rows in attention list.
- One `attention-row` per qualifying non-resend message.
- Required row attributes exist.
- Live clock changes countdown without file re-upload.
- Timer tick does not invoke LLM.
- Page root direction is RTL.
- English message is readable LTR/auto.

## Draft
- Draft only generated after click.
- Persian input gets `fa`; English input gets `en`.
- Unsafe financial/date promises are blocked.
- Prompt injection in body is treated as untrusted.
- LLM unavailable => HTTP 200 blocked response.
- Sara can edit and copy final text.
- No send request/action exists.

## Delivery
- Exact CLI command works.
- JSON contract is preserved.
- Docker Compose starts app.
- `predictions.csv` header exact and one row per evaluation input.
- Evaluation uses export timestamp from `EXPORT_INFO.txt`.
- `WRITEUP.md` <= one page.
- AI logs are real exported sessions/transcripts.
