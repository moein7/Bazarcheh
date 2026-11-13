---
name: business-sla-engine
description: Implement timezone-aware working-calendar and two-business-hour SLA semantics.
---

# business-sla-engine

## Purpose
Implement timezone-aware working-calendar and two-business-hour SLA semantics.

## When to use
Any work involving elapsed business time, urgency, countdown, or attention ordering.

## Required inputs
Asia/Tehran, workweek, hours, exact holiday list, timestamp semantics.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Use timezone-aware instants.
- Working days Saturday–Wednesday, 09:00–17:00.
- Exclude Thursday/Friday and supplied 1405 holidays.
- Exactly 120 business minutes is overdue.
- Answered messages are not urgent.
- Attention list includes all high-severity unanswered non-resends.
- Do not guess Jalali conversions.

## Expected outputs
Calendar utility, SLA calculation, urgency and sorting functions, test fixtures.

## Verification
Test 119/120/121 minutes, boundaries, nights, weekends, every holiday, answered-late, and ordering.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
