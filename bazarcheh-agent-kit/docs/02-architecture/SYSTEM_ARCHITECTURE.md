# Target System Architecture

## Principles
- Keep deterministic business rules separate from LLM behavior.
- Keep SLA calculation independent of React components.
- Keep API and CLI contracts stable.
- Use LLM only for tasks where it adds value.
- Make failure behavior explicit and safe.

## Logical components

1. **CSV ingestion**: parse and validate input.
2. **Normalization**: normalize text for comparison and Persian/Arabic-Indic digits for order extraction.
3. **Duplicate detection**: same customer + same normalized text; preserve all rows and link resends to original.
4. **Order extraction**: prefer a valid supplied `order_ref` where appropriate; otherwise extract from body. Define precedence during discovery.
5. **Classification**: rules and/or LLM; validate category enum.
6. **Severity and answered state**: derive from verified schema and explicit policy.
7. **Business calendar/SLA**: deterministic, timezone-aware engine.
8. **Analysis result**: one shared result model for dashboard and CLI.
9. **Draft service**: on-demand LLM call, safety validation, fail-closed response.
10. **Frontend**: RTL display, browser-clock recalculation, editable draft and copy approval.

## Suggested data flow

CSV -> parse -> normalize -> duplicate links -> extract order -> category/severity/answered -> SLA evaluation at reference time -> analysis result -> CLI JSON / dashboard API.

Draft flow:
User click -> same-origin POST /api/draft -> validate request -> LLM with untrusted customer content -> validate output -> safe response or blocked response -> editor -> Sara approves -> copy only.

## Important separation
- Analysis at a supplied `now` must be deterministic.
- Browser countdown can recompute SLA from stable message timestamps and calendar rules without re-running LLM classification.
- If analysis classifications are cached in browser state, only time-derived fields should change on each clock tick.
