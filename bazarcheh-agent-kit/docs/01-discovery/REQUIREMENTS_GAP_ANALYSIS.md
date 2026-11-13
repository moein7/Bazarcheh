# Final requirements gap analysis

Statuses distinguish implementation from runtime verification. `Implemented / tested` means covered by executed backend tests or deterministic data checks. `Implemented / not runtime-verified` means the code/configuration is present but browser or Docker execution was unavailable. `Partial` means the requirement cannot honestly be certified with the supplied evidence.

| Requirement | Final status | Evidence / remaining limitation |
|---|---|---|
| REQ-DATA-001 | Implemented / not runtime-verified | FastAPI CSV upload and React upload form; browser build unavailable. |
| REQ-DATA-002 | Implemented for supplied export | CLI output has 332 messages for the 332 non-empty message records; the export also contains one empty record, which is not a message. |
| REQ-DATA-003 | Implemented / tested | Customer ID + normalized body, earliest received row is canonical. |
| REQ-DATA-004 | Implemented / tested | Duplicates remain in row-level output but are excluded from unique counts and urgency. |
| REQ-DATA-005 | Implemented / tested | `order_ref` column then body extraction. |
| REQ-DATA-006 | Implemented / tested | Persian and Arabic-Indic digit translation. |
| REQ-DATA-007 | Implemented / tested | Six-category enum and fixed six-key counts, including zeroes. |
| REQ-DATA-008 | Partial | Deterministic multilingual keyword classification is used for fast, reproducible CSV analysis; Ollama is reserved for explicit reply drafts. No labeled ground-truth evaluation set was supplied, so category accuracy cannot be certified. |
| REQ-DATA-009 | Implemented | Severity is sourced separately from `severity_hint`; category does not determine urgency. |
| REQ-DATA-010 | Implemented / tested | `answered_at` is the export's answered-state field; any populated value means handled. |
| REQ-SLA-001–004 | Implemented / tested | `Asia/Tehran`, Saturday–Wednesday, 09:00–17:00, all supplied 1405 holidays. |
| REQ-SLA-005–007 | Implemented / tested | 120 business-minute threshold; equality is urgent; any answered message is handled. |
| REQ-SLA-008–010 | Implemented / code-reviewed | Attention queue includes unanswered high-severity canonical messages and sorts by integer business minutes remaining. Browser QA remains unrun. |
| REQ-UI-001–002 | Implemented / not runtime-verified | Persian document language and page-level RTL; customer content uses `dir="auto"`. |
| REQ-UI-003–005 | Implemented / code-reviewed | Browser clock, 10-second refresh, no timer-triggered API/LLM call. Browser fake-clock test remains unrun. |
| REQ-UI-006–007 | Implemented / code-reviewed | Persistent urgent-count QA hook and required attention/draft hooks retained. Browser QA remains unrun. |
| REQ-AI-001 | Implemented / code-reviewed | Draft endpoint is called only from the explicit draft button. |
| REQ-AI-002 | Partial | Persian, English and common Finglish detection implemented; actual configured-provider output still needs live model validation. |
| REQ-AI-003–005 | Partial | System policy, untrusted-content delimiting, deterministic rejection checks and fail-closed behavior implemented; regex screening is not a formal guarantee and needs model-specific adversarial review. |
| REQ-AI-006–007 | Implemented / code-reviewed | Editable textarea; approval copies text only; no send operation exists. Clipboard behavior needs browser verification. |
| REQ-CON-001 | Implemented / tested | Exact CLI arguments and JSON top-level shape preserved; local CLI run succeeded. |
| REQ-CON-002 | Implemented / not runtime-verified | Nginx proxies same-origin `/api/` to FastAPI; Docker/browser request not run. |
| REQ-CON-003 | Implemented / tested | No configured LLM returns HTTP 200 with `blocked: true`; provider errors are caught and timeout is configured. |
| REQ-DEL-001–002 | Implemented / verified | `predictions.csv` has exact header and 332 rows; generated using `2026-04-15T07:00:00Z` from `EXPORT_INFO.txt`. |
| REQ-DEL-003 | Implemented | `WRITEUP.md` documents problem, assumptions, defects, cuts, AI misstep, classification limitations and draft safety; concise one-page format. |
| REQ-DEL-004 | Partial | `AI_LOGS/` contains a factual implementation-session record. A verbatim external-agent export was not available and is not fabricated. |
| NFR-001 | Implemented | SLA, deduplication, order extraction and category rules are deterministic for fixed inputs/reference time; CSV analysis does not depend on Ollama. |
| NFR-002 | Implemented / tested | Classification falls back on provider failure; draft generation fails closed; client timeout is configured. |
| NFR-003 | Implemented / checked | LLM credentials are environment variables; no `.env` or credentials are included in the package. |
| NFR-004 | Implemented / tested | Core backend logic has independent unit tests. |
| NFR-005 | Not verified | Compose/Dockerfiles are present, but Docker is not installed in the implementation environment. A clean Docker build/start remains a release gate. |

## Remaining release gates

1. Run `docker compose up` on a Docker-enabled machine and verify both services become available.
2. Run frontend `npm ci`, `npm test`, and `npm run build`; this environment lacks cached npm dependencies and cannot reach the registry.
3. Run the provided browser smoke suite with a frozen clock, especially RTL, attention ordering, data attributes, draft copy and timer/no-network behavior.
4. Evaluate category quality against a human-labeled sample before claiming classifier accuracy; no labels were supplied.
5. Run provider-specific adversarial draft tests before enabling a real LLM endpoint for Sara.
