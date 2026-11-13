# AI-assisted implementation session

This is a factual implementation-session record (not a verbatim model transcript). The supplied assignment and the repository requirement, acceptance-test, architecture, security, and delivery Markdown documents were reviewed before changing code.

## Changes completed
- Standardized API/CLI `category_counts` to always include all six allowed categories, including zero-count categories.
- Enforced the challenge rule that any populated `answered_at` means handled; such messages are excluded from urgency and the attention queue even when the answer was late.
- Reworked the frontend into a responsive Persian RTL support dashboard with a fixed desktop side navigation, active navigation states, operational status, upload panel, KPI cards, category breakdown, SLA insight panel, attention queue, and messages table.
- Kept the required QA hooks and on-demand draft flow; urgent count remains visible across dashboard views and the hidden attention component keeps its live timer mounted while browsing the messages table.
- Expanded draft-output screening for English, Persian and common Finglish money/date/timeline promises; added tests for prompt injection and blocked/allowed model outputs.
- Expanded duplicate normalization for Arabic/Persian character variants, diacritics and ZWNJ/space differences.
- Regenerated `predictions.csv` using the evaluation export timestamp `2026-04-15T07:00:00Z`.

## Verification
- Initial backend regression suite before the Ollama integration follow-up: 28 tests passed. Current suite after follow-up: 29 tests passed.
- CLI output and predictions row count checked against the evaluation CSV.
- Docker build/runtime and frontend production build were not executable in this environment: Docker is absent and npm registry dependencies are unavailable offline. These remain explicit release checks, not claimed passes.


## Ollama integration and AI workspace follow-up
- Added a populated root `.env` and Compose defaults for the Mac-host Ollama endpoint, `qwen3-coder:30b`, placeholder API key, 180-second model timeout, and two-business-hour SLA. No Ollama container or extra Docker CLI flags are required.
- Added a macOS helper and setup guide for the case where Ollama listens only on loopback; Docker Desktop needs a host-reachable listener at `host.docker.internal:11434`.
- Removed LLM inference from CSV classification. The prior one-request-per-message sequential classification path was the direct cause of analysis latency/504 risk. Classification is now deterministic; Ollama is called only on an explicit draft click.
- Increased the draft request timeout to 180 seconds and Nginx's same-origin API proxy timeout to 240 seconds. Added output cleanup for Qwen `<think>` blocks and a stricter untrusted-input prompt.
- Reworked the AI section into a dedicated conversation-style workspace with a message queue, customer-message bubble, AI draft editor, explicit copy-only approval, generation state and safety warnings. Added a sidebar route named `دستیار هوشمند`; required assignment test IDs remain in place.
- Added local Ollama, configuration and AI workspace documentation.

## Follow-up verification
- Backend regression suite after these changes: 29 passed.
- Frontend dependency installation was attempted but timed out because package registry access was unavailable; frontend production build and browser interaction tests remain unverified.
- Docker is not installed in this environment, so host-to-container Ollama connectivity and Compose startup remain target-machine verification steps.

## Follow-up implementation: activity memory, SLA source of truth and filters

- Added SQLite-backed user, AI and system activity history.
- Added sanitized approved-reply style memory (bounded to 50 examples; three same-language examples may guide later prompts).
- Added batch SLA refresh endpoint; browser time is passed to backend and Tehran business calendar calculations remain server-side.
- Removed duplicate browser-side SLA calendar arithmetic to avoid date/time drift.
- Added category filtering, sorting and message search.
- Added a dedicated activity-history screen and documentation.
- Backend regression suite: 35 passing tests. Frontend dependency installation was blocked by npm registry connectivity, so browser/build verification remains outstanding.

## QA-004 — 2026-11-13

- Fixed strict TypeScript error in `frontend/src/components/AttentionList.tsx`: `selectedDraft` now resolves to `''` when no draft exists, so JSX length/count accesses are safe even when manual mode opens an empty editor.
- Backend tests: 43 passed.
- Frontend build attempt was blocked by incomplete local dependencies (`@testing-library/jest-dom` and `vitest/globals` type definitions unavailable); `npm ci` timed out. Do not treat this as a successful production build.
