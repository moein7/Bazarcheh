# Activity history and reply-style memory

## What is recorded

The application stores a compact SQLite history in `data/bazarcheh.db` (mounted into the backend as `/data/bazarcheh.db`). The database survives container rebuilds and restarts as long as the `./data` directory is kept.

- **User events:** CSV analysis, selecting a message, changing category filters or sort order, requesting a draft, and approving/copying a draft.
- **AI events:** draft generated or blocked, selected model, language, duration, and safety warnings.
- **System events:** application startup and analysis failures.

Customer message bodies, full prompts, API keys, and raw model conversations are deliberately not stored in the activity log.

## How the system learns from previous actions

When Sara edits a generated draft and presses **Approve & Copy**, the final approved reply is saved as a small style example. Before storage, order references, email addresses, phone-like strings, and numeric values are redacted. The application keeps at most 50 examples and retrieves up to three recent examples in the same language.

These examples are injected into the next local Ollama request as **style-only guidance**. They are not used as factual context, are not used to answer questions about previous customers, and do not fine-tune or modify model weights. The system's safety rules still take precedence. This is lightweight in-context adaptation, not model training.

## API

- `GET /api/logs?limit=100&event_type=user|ai|system` — recent events and memory counts.
- `POST /api/activity` — record an allow-listed user interaction.
- `POST /api/draft/feedback` — record an approved final reply and add a sanitized style example.
- `POST /api/sla/refresh` — recalculate a batch of SLA countdowns using the browser's supplied current timestamp and the backend's official Tehran calendar.

## Time accuracy

The browser sends its current time as an ISO-8601 timestamp. The backend calculates business minutes using `Asia/Tehran`, Saturday–Wednesday, 09:00–17:00, and the supplied 1405 holidays. The dashboard refreshes this calculation once per minute without calling Ollama. Message timestamps are displayed in Tehran local time. Negative remaining minutes are always labelled as overdue, never as time left.

The data export may be months old. In that case a large overdue duration is expected; it must be displayed as **overdue**, not as time remaining.

## Persistence and privacy

Keep `data/bazarcheh.db` to retain history. Removing this file clears activity history and approved style memory. The activity log is intended for a single local support workspace; authentication and per-user attribution should be added before exposing the dashboard to a shared or public network.

## Draft replies from all messages
The «همه پیام‌ها» table provides a per-row reply action. It calls the same on-demand `/api/draft` endpoint and safety validation as the attention queue. The generated text can be edited and copied after human review; no message is sent. Approved text is submitted to the existing sanitized feedback endpoint, and the action is recorded in activity history. Drafts are never generated automatically while browsing or filtering the table.
