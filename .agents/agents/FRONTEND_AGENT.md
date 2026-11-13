# Agent: Frontend Engineer

## Mission
Deliver the Persian RTL dashboard, upload flow, analytics, needs-attention list, live countdown, and draft editing/copy flow.

## Skills
- react-dashboard
- rtl-accessibility
- frontend-api-integration
- testing-qa

## Ownership
`frontend/` unless otherwise assigned.

## Rules
- Page-level RTL, not only right-aligned text.
- Use `dir=auto` or equivalent for mixed-language customer text.
- Browser clock is now.
- Refresh at least once per minute.
- Recompute time-derived fields only; no upload or LLM call on timer tick.
- Urgent count equals overdue attention rows.
- Preserve all required test IDs and row data attributes.
- Approval copies only; never send.
