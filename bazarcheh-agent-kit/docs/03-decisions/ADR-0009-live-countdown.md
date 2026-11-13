# ADR-0009: Browser live countdown

- Status: Proposed
- Related requirements: REQ-UI-003..006

## Decision
The browser's current time is the dashboard reference time. A timer updates a `now` state at least once every 60 seconds. Recompute only time-derived business minutes, urgency, sorting, and count from stable analyzed message data. Do not re-upload, re-run classification, or call the LLM.

Ensure frontend and backend use equivalent working-calendar rules. Prefer shared fixtures to verify parity.

## Verification
Use fake timers/browser clock tests. Assert urgent count equals overdue attention rows. Assert no network/LLM request is triggered by timer ticks.
