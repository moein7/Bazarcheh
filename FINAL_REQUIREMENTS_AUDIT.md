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
| REQ-DATA-008 | Implemented / quality unverified | Category classification is deterministic multilingual keyword logic and always includes the six allowed categories. Analysis never calls Ollama. No labeled ground-truth evaluation set was supplied, so category accuracy cannot be certified. |
| REQ-DATA-009 | Implemented | Severity is sourced separately from `severity_hint`; category does not determine urgency. |
| REQ-DATA-010 | Implemented / tested | `answered_at` is the export's answered-state field; any populated value means handled. |
| REQ-SLA-001–004 | Implemented / tested | `Asia/Tehran`, Saturday–Wednesday, 09:00–17:00, all supplied 1405 holidays. |
| REQ-SLA-005–007 | Implemented / tested | 120 business-minute threshold; equality is urgent; any answered message is handled. |
| REQ-SLA-008–010 | Implemented / code-reviewed | Attention queue includes unanswered high-severity canonical messages and sorts by integer business minutes remaining. Browser QA remains unrun. |
| REQ-UI-001–002 | Implemented / not runtime-verified | Persian document language and page-level RTL; customer content uses `dir="auto"`. |
| REQ-UI-003–005 | Implemented / code-reviewed | Browser supplies current ISO time; backend refreshes SLA calculations once per minute through one batch API call, with no LLM calls. Browser fake-clock test remains unrun. |
| REQ-UI-006–007 | Implemented / code-reviewed | Persistent urgent-count QA hook and required attention/draft hooks retained. Browser QA remains unrun. |
| REQ-AI-001 | Implemented / code-reviewed | Ollama is called only from the explicit draft button; CSV analysis and the live clock do not call the model. |
| REQ-AI-002 | Partial | Persian, English and common Finglish detection implemented; actual configured-provider output still needs live model validation. |
| REQ-AI-003–005 | Partial | System policy, untrusted-content delimiting, deterministic rejection checks and fail-closed behavior implemented; regex screening is not a formal guarantee and needs model-specific adversarial review. |
| REQ-AI-006–007 | Implemented / code-reviewed | Editable textarea; approval copies text only; no send operation exists. Clipboard behavior needs browser verification. |
| REQ-CON-001 | Implemented / tested | Exact CLI arguments and JSON top-level shape preserved; local CLI run succeeded. |
| REQ-CON-002 | Implemented / not runtime-verified | Nginx proxies same-origin `/api/` to FastAPI; Docker/browser request not run. |
| REQ-CON-003 | Implemented / tested | Provider errors and timeouts return HTTP 200 with `blocked: true`; model is called only for explicit draft requests. |
| REQ-DEL-001–002 | Implemented / verified | `predictions.csv` has exact header and 332 rows; generated using `2026-04-15T07:00:00Z` from `EXPORT_INFO.txt`. |
| REQ-DEL-003 | Implemented | `WRITEUP.md` documents problem, assumptions, defects, cuts, AI misstep, classification limitations and draft safety; concise one-page format. |
| REQ-DEL-004 | Partial | `AI_LOGS/` contains a factual implementation-session record. A verbatim external-agent export was not available and is not fabricated. |
| NFR-001 | Implemented | SLA, deduplication, order extraction and category rules are deterministic for fixed inputs/reference time; CSV analysis is independent of Ollama. |
| NFR-002 | Implemented / tested | Deterministic classification is independent of provider availability; draft generation fails closed; 180-second model timeout is configured. |
| NFR-003 | Implemented / checked | Ollama endpoint/model are environment-configured; packaged `.env` contains only a local endpoint and placeholder key, not a real secret. |
| NFR-004 | Implemented / tested | Core backend logic has independent unit tests. |
| NFR-005 | Not verified | Compose/Dockerfiles are present, but Docker is not installed in the implementation environment. A clean Docker build/start remains a release gate. |

## Ollama and AI workspace implementation update

- Root `.env` and Compose defaults now point to the Mac-host Ollama endpoint `http://host.docker.internal:11434/v1`, placeholder key `ollama`, and model `qwen3-coder:30b`.
- `docs/OLLAMA_LOCAL_SETUP.md` documents the macOS listener requirement. The included `scripts/configure-ollama-macos.sh` sets `OLLAMA_HOST=0.0.0.0:11434` and restarts the Ollama app when needed. This is a one-time host setup, not a Docker command.
- CSV classification no longer makes sequential LLM calls. This removes the previous 504 bottleneck; only an explicit reply-draft action invokes Ollama.
- Nginx allows 240 seconds for an explicit draft request; the model client timeout is 180 seconds.
- The dashboard now has a dedicated **دستیار هوشمند** navigation item and conversation-style workspace with selected customer message, model draft state, editable response, safety warning, and copy-only approval.
- The model prompt treats customer content as untrusted and the API fails closed on provider errors or rejected output.

## Remaining release gates

1. Run `docker compose up` on a Docker-enabled machine and verify both services become available.
2. Run frontend `npm ci`, `npm test`, and `npm run build`; this environment lacks cached npm dependencies and cannot reach the registry.
3. Run the provided browser smoke suite with a frozen clock, especially RTL, attention ordering, data attributes, draft copy and timer/no-network behavior.
4. Evaluate category quality against a human-labeled sample before claiming classifier accuracy; no labels were supplied.
5. Run provider-specific adversarial draft tests before enabling a real LLM endpoint for Sara.

## Follow-up enhancements (activity history, SLA accuracy, message filters)

| Enhancement | Implementation | Verification |
|---|---|---|
| Persistent user activity history | SQLite `activity_logs`, mounted at `/data/bazarcheh.db` | Backend API tests |
| AI generation/blocked history | Records model, language, duration and warnings without storing customer prompts | Backend API tests |
| System history | Startup and analysis-failure events | Backend API tests / startup path |
| Learn from approved actions | Sanitized approved replies retained as style-only prompt examples (max 50; latest 3 per language used) | Backend memory/prompt test |
| Accurate live SLA | Browser sends current ISO timestamp; backend applies Asia/Tehran business calendar and refreshes every 60 seconds | Boundary, weekend and holiday API tests |
| Correct overdue wording | Negative SLA time is displayed as overdue, not time remaining | Backend SLA response test and frontend implementation |
| Category filtering | Category selector in all-messages view plus clickable category breakdown in «نمای کلی»; selecting a category reveals its matching messages inline and can be cleared | Existing messages-filter test plus overview category-selection test added; browser execution pending |
| Message sorting | Newest, oldest, urgent-first and category sort | Frontend component test added |
| Search | Search by message/customer/order/subject/body | Implemented in MessagesTable |
| Tehran timestamp display | Dates use Asia/Tehran consistently; live Persian date + HH:MM:SS clock updates every second without API/LLM requests | TypeScript/TSX syntax check; browser timer verification pending |

The backend suite currently passes 36 tests. The updated frontend includes an overview-category interaction test, but frontend tests and production build could not be executed in this environment because npm dependencies could not be downloaded from the registry.


## Follow-up: AI replies for all messages
- Added a reply action to each row in «همه پیام‌ها»; draft generation is on-demand and uses the existing safety-checked API.
- Added an editable draft dialog with copy/approval and sanitized learning feedback.
- No automatic LLM calls and no customer message sending.
- Backend regression suite: 36 passed. Frontend TypeScript/TSX syntax: checked. Production build/browser runtime/Docker runtime remain environment-dependent and were not executed here.
