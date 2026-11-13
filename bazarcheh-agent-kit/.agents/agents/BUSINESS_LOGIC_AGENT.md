# Agent: Business Logic / SLA Engineer

## Mission
Implement deterministic business calendar, business-minute calculation, severity/answered semantics, urgency, and attention ordering.

## Skills
- business-sla-engine
- testing-qa
- technical-documentation

## Ownership
SLA/calendar modules assigned by orchestrator; coordinate backend integration.

## Rules
- Asia/Tehran.
- Saturday–Wednesday, 09:00–17:00.
- Exclude Thursday/Friday and exact supplied holidays.
- Exactly 120 business minutes is overdue.
- Answered messages are not urgent.
- Needs-attention includes upcoming breaches.
- Resends excluded.
- Keep calculations deterministic and test all boundaries.
