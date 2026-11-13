# Start Bazarcheh

## Before starting

- Ollama must be running on your Mac and `ollama list` should show `qwen3-coder:30b`.
- The project root already includes `.env` with the Ollama endpoint, model, placeholder key, and 180-second draft timeout.
- If Ollama listens only on `127.0.0.1`, run `./scripts/configure-ollama-macos.sh` once. See `docs/OLLAMA_LOCAL_SETUP.md` for the reason and firewall note.

## Start

From this directory, run only:

```bash
docker compose up
```

Open http://localhost:5173. API health: http://localhost:8000/api/health.

## How AI works

CSV analysis is deterministic and does not call the LLM. Ollama is called only when you click **تهیه پیش‌نویس پاسخ** in the attention queue. Open the **دستیار هوشمند** sidebar item to use the dedicated chat-style reply workspace. Generated text is editable; approval copies it and never sends it.

## Useful documents

- `docs/OLLAMA_LOCAL_SETUP.md` — host networking, model and one-time macOS listener setup.
- `docs/LOCAL_CONFIGURATION.md` — environment variable reference and why classification avoids LLM calls.
- `docs/AI_REPLY_WORKSPACE.md` — chat workflow, safety behavior and human approval.
- `FINAL_REQUIREMENTS_AUDIT.md` — requirement-by-requirement implementation status and remaining runtime checks.
- `WRITEUP.md` — assignment write-up.

## New: activity history and SLA accuracy

- Open **تاریخچه فعالیت‌ها** in the sidebar to inspect user, AI and system events.
- When a support agent approves and copies an edited AI reply, a redacted version is retained as a style-only example for future local Ollama drafts. This is not model fine-tuning.
- Activity history and style memory persist in `data/bazarcheh.db` across Docker restarts. Delete that file only if you intentionally want to clear the history and learned style examples.
- SLA countdowns are recalculated by the backend every minute using the browser's current time and the official Tehran business calendar. Old export messages may correctly show hundreds of hours **overdue**.
- The all-messages page now supports category filtering, sorting and search.

See `docs/ACTIVITY_HISTORY_AND_LEARNING.md` for details and privacy behavior.

## Agent-assisted development and governance

Before asking a coding agent to change this project, start with `AGENTS.md` and `docs/agent-governance/GETTING_STARTED.md`. Every task must be planned and approved on `docs/agent-governance/TASK_BOARD.md` before implementation. Agent roles, workflows, reusable skills and templates are in `.agents/`. Every change must update its task record and `AI_LOGS/`; user-visible changes also update `CHANGELOG.md`.
