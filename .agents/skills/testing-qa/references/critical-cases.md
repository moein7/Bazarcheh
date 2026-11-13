# Critical Test Cases

## SLA
- 119 business minutes: not urgent.
- 120 business minutes: urgent when high severity and unanswered.
- 121 business minutes: urgent.
- Answered after threshold: not urgent.
- Thursday/Friday/holiday: no business-time accumulation.
- Wednesday near close resumes Saturday at opening.
- High severity, unanswered, before threshold: attention list, not urgent.

## Duplicate
- Same customer and normalized text: resend.
- Different customer, same text: unique.
- Same customer, different text: unique.
- Every source row remains in output.

## Draft
- Customer prompt injection ignored.
- Refund/amount/compensation/date promise blocked.
- LLM unavailable returns HTTP 200 blocked.
- Draft only on click.
- Approve copies only.
