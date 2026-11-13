# Constraints and fixed policies

## Fixed by challenge
- Python backend: FastAPI + Pandas.
- Frontend: React + Vite.
- Docker Compose startup.
- CLI command and output format preserved.
- Draft API path and schema preserved.
- Browser QA selectors preserved.
- Business timezone and weekly calendar fixed.
- Public holiday dates fixed to supplied 1405 list.
- 120 business-minute threshold; equality is overdue.
- Drafts are on-demand, safe, human-approved, copy-only.

## Must be discovered from repository/data
- Exact CSV columns and timestamp formats.
- Exact field(s) that indicate answered/replied status.
- Existing message IDs and customer IDs formats.
- Whether severity labels exist or must be inferred.
- Existing backend/frontend route structure.
- Current test framework and commands.
- Whether any supplied labeled data exists for model evaluation.

## Engineering constraints
- Four-hour approximate time budget.
- LLM free-tier quotas may be low.
- Live countdown must not consume LLM quota.
- No public deployment required.
- Avoid broad rewrites unless audit evidence justifies them.
