# Implementation Roadmap

The interview time budget is approximately four hours. This roadmap is deliberately prioritized.

## Phase 0 — Discovery (0–25 min)
- Audit repository and baseline tests.
- Inspect all CSVs and export metadata.
- Map requirements to current implementation.
- Identify confirmed defects and unknowns.
- Propose essential ADRs.

Exit: audit, data schema, gap analysis, and top risks are recorded.

## Phase 1 — Backend core (25–75 min)
- Normalize text/digits.
- Detect resends.
- Extract order references.
- Implement category/severity/answered semantics.
- Preserve CLI output contract.

Exit: unit tests for core data behavior pass.

## Phase 2 — SLA engine (75–110 min)
- Implement timezone-aware business calendar.
- Include exact supplied holidays.
- Calculate business minutes.
- Compute urgent and needs-attention sets.
- Sort deterministically.

Exit: boundary/calendar tests pass, including exactly 120 minutes.

## Phase 3 — Dashboard (110–155 min)
- Upload workflow and KPI cards.
- Needs-attention list and message table.
- Persian RTL and mixed-language rendering.
- Browser clock updates at least once per minute.
- Required QA hooks.

Exit: browser smoke test passes and timer causes no LLM call.

## Phase 4 — Draft AI (155–185 min)
- Same-origin draft API.
- On-demand generation.
- Language selection.
- Prompt-injection resistance and output guardrails.
- Fail-closed provider handling.
- Edit and copy-only approval.

Exit: safety and API contract tests pass.

## Phase 5 — Integration and delivery (185–240 min)
- Docker Compose one-command startup.
- Exact CLI regression.
- Evaluation predictions using export timestamp.
- WRITEUP <= one page.
- Real AI logs.
- Final smoke/regression tests.

Exit: delivery checklist complete.

## Cut line
If time is short, prioritize: CLI and data correctness, SLA/urgency, required dashboard list/count, draft API safe failure, Docker startup, predictions and writeup. Defer decorative charts, elaborate filtering, advanced model optimization, and broad refactors.
