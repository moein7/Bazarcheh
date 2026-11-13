# Task Board

Statuses: Backlog | Ready | In Progress | Review | Blocked | Done

| ID | Task | Priority | Status | Verification |
|---|---|---|---|---|
| DISC-01/02/03 | Repository, dataset, requirements discovery | P0 | Done | README, source, tests, export metadata inspected |
| ADR-01 | Processing architecture | P0 | Done | Existing architecture decisions reviewed; deterministic rules retained |
| CORE-01..05 | Normalization, deduplication, orders, categories, severity/answered state | P0 | Done | Backend regression suite |
| SLA-01..03 | Tehran calendar, business minutes, attention ordering | P0 | Done | Backend calendar/boundary tests |
| API-01/02 | CLI and draft API contracts | P0 | Done | CLI and API tests |
| FE-01..05 | Upload, KPIs, attention list, RTL, live countdown, editable drafts | P0 | Review | Source implemented; production build not run (npm registry unavailable) |
| AI-01/02 | On-demand language-aware safe drafts | P0 | Done | Fail-closed behavior and code-path review; model red-team pending |
| QA-01 | Unit/boundary tests | P0 | Done | `pytest -q`: 17 passed |
| QA-02 | Browser/API/CLI regression | P0 | Review | API + CLI tested; browser unavailable |
| REL-01 | Docker one-command startup | P0 | Review | Compose inspected; Docker unavailable for build/run |
| REL-02 | Evaluation predictions | P0 | Done | 332 rows generated using export timestamp |
| REL-03 | Write-up and AI logs | P0 | Done | `WRITEUP.md`, `AI_LOGS/` |
