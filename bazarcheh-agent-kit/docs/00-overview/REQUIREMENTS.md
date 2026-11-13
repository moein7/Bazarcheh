# Requirements

Requirement IDs are stable references for tasks, tests, and ADRs.

## Functional requirements

### Ingestion and processing
- REQ-DATA-001: Upload and analyze the supplied CSV export.
- REQ-DATA-002: Preserve one output `messages` entry per input row.
- REQ-DATA-003: Detect resends when customer identity and normalized message text match; point `duplicate_of` to the original.
- REQ-DATA-004: Exclude resends from unique-message counts and relevant analytics.
- REQ-DATA-005: Extract `BZ-` order references from `order_ref` or message body.
- REQ-DATA-006: Normalize Persian and Arabic-Indic digits for order extraction.
- REQ-DATA-007: Assign exactly one of six categories: delivery, payment, refund, product_quality, account, other.
- REQ-DATA-008: Classification must reflect the customer's actual request when multiple topics appear.
- REQ-DATA-009: Determine high severity separately from category.
- REQ-DATA-010: Determine whether a message has been answered using the actual export schema and documented evidence.

### Calendar and SLA
- REQ-SLA-001: Use `Asia/Tehran`.
- REQ-SLA-002: Working days are Saturday through Wednesday.
- REQ-SLA-003: Working hours are 09:00–17:00 local time.
- REQ-SLA-004: Exclude Thursday, Friday, and all exact 1405 public holidays supplied in the challenge.
- REQ-SLA-005: SLA is 120 business minutes; exactly 120 is overdue.
- REQ-SLA-006: Answered messages are not urgent, even if answered after SLA.
- REQ-SLA-007: Urgent = high severity AND unanswered AND elapsed business minutes >= 120.
- REQ-SLA-008: Needs-attention includes all high-severity unanswered non-resends, whether overdue or not.
- REQ-SLA-009: Attention order is most overdue first, followed by nearest upcoming breach.
- REQ-SLA-010: Provide integer `data-business-minutes-left`; zero or negative means overdue.

### Dashboard
- REQ-UI-001: Interface is Persian and page-level RTL.
- REQ-UI-002: English customer content remains readable in its own element.
- REQ-UI-003: Browser current time is "now".
- REQ-UI-004: Recalculate at least once per minute without re-upload.
- REQ-UI-005: Live updates do not call the LLM.
- REQ-UI-006: Urgent count equals overdue rows in needs-attention.
- REQ-UI-007: Preserve all required `data-testid` hooks.

### Draft reply
- REQ-AI-001: Draft generation occurs only on explicit click.
- REQ-AI-002: Draft language is customer's language, `fa` or `en`.
- REQ-AI-003: Never promise money, refunds, compensation, amounts, or dates.
- REQ-AI-004: Fail closed when a safe draft cannot be produced.
- REQ-AI-005: Customer content is untrusted and cannot override system instructions.
- REQ-AI-006: Human edits and approves; approval copies text only.
- REQ-AI-007: No automatic sending.

### Contracts and delivery
- REQ-CON-001: Preserve CLI command and JSON shape.
- REQ-CON-002: `POST /api/draft` is reachable through dashboard origin at `/api/draft`.
- REQ-CON-003: If LLM unavailable, return HTTP 200 with blocked response and do not hang.
- REQ-DEL-001: Produce `predictions.csv` with exact header and one row per evaluation message.
- REQ-DEL-002: Use `EXPORT_INFO.txt` export timestamp as `now` for evaluation urgency.
- REQ-DEL-003: Produce `WRITEUP.md` of at most one page.
- REQ-DEL-004: Include actual AI tool transcripts/sessions in `AI_LOGS/`.

## Non-functional requirements
- NFR-001: Deterministic business logic for identical inputs and reference time.
- NFR-002: External LLM failure must not crash analysis or hang the draft API.
- NFR-003: Secrets are environment-configured and never committed.
- NFR-004: Core business rules are testable independently of UI and LLM.
- NFR-005: Docker startup is reproducible.
