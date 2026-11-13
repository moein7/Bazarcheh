# Workflow: Final Release Check

1. Read delivery checklist and regression checklist.
2. Start from a clean repository state where possible.
3. Run Docker Compose startup.
4. Run exact supplied CLI command against supplied input.
5. Verify output schema and per-row cardinality.
6. Verify draft API through dashboard origin.
7. Run SLA boundary and holiday tests.
8. Verify browser QA hooks and live timer.
9. Confirm no LLM call occurs on timer tick.
10. Generate predictions using export timestamp.
11. Review WRITEUP length and factual claims.
12. Verify AI_LOGS are real and scrubbed of secrets.
13. Report pass/fail/not-run/blocked for every item.
14. Do not claim delivery readiness if a critical check is unverified.
