# Current project state and verified baseline

Last documentation baseline: 2026-11-13. This is a snapshot, not a guarantee that every check was rerun during the documentation-governance update. Agents must rerun checks before relying on them.

## Product capabilities present in the supplied latest archive

- Persian RTL React + Vite dashboard with upload, KPI/category overview, attention queue and all-messages table.
- Deterministic CSV analysis and category/severity/duplicate/order extraction; LLM is not used for bulk classification.
- Tehran business-hour SLA calculation and attention queue refresh based on browser current time.
- On-demand Ollama draft generation, including an action for messages in the all-messages table; editable text and copy-only approval. No automatic send capability.
- Persistent SQLite activity history for user, AI and system events.
- Sanitized approved-reply style examples, bounded and used as style context only; this is not fine-tuning or factual memory.
- Live Persian date/time display (HH:MM:SS) and clickable category breakdown in the overview; all-messages filters/search/sorting.
- Docker Compose services for frontend and backend; Ollama remains on the Mac host and is reached via `host.docker.internal`.

## Architecture map

| Area | Location | Responsibilities |
|---|---|---|
| API and CLI | `backend/app/api.py`, `cli.py` | HTTP contracts, upload/analysis, draft, SLA refresh, activity, CLI |
| Domain logic | `analysis.py`, `classify.py`, `dedup.py`, `orders.py`, `sla.py`, `urgency.py` | Deterministic analysis and business rules |
| AI | `drafts.py`, `llm.py` | Explicit draft requests, provider calls, safety checks |
| Persistence | `activity.py`, `data/` | SQLite activity and style memory; mounted persistent data |
| UI | `frontend/src/App.tsx`, `components/` | RTL dashboard, views, filters, reply workflow, history |
| UI contracts | `frontend/src/api.ts`, `types.ts` | API client and shared TS types |
| Deployment | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf` | Build, service wiring, same-origin proxy |
| Governance | `AGENTS.md`, `.agents/`, `bazarcheh-agent-kit/`, `docs/agent-governance/` | Agent rules, skills, tasks, decisions, architecture |

## Known verification gaps (must remain visible until closed)

- Frontend dependency installation, Vitest suite and production build were previously blocked by npm registry connectivity. A TypeScript/TSX syntax check is not equivalent to these checks.
- Docker Compose build/start/health checks were not run because Docker was unavailable in the implementation environment.
- Browser-level verification of the live clock, category interactions, clipboard behavior, filters, RTL/bidi and timer network behavior remains outstanding.
- Live Ollama draft behavior and adversarial safety evaluation require a reachable configured model. Static prompt/code review is not proof of model safety.
- Category classification is deterministic keyword logic; no labeled ground-truth dataset was supplied to certify accuracy.
- AI activity logs intentionally omit full customer content. No external agent transcript is claimed unless an actual transcript is exported.

## Environment contract

- Copy `.env.example` to `.env` locally; never commit `.env`.
- Ollama runs on the host Mac, not in Compose. Default URL: `http://host.docker.internal:11434/v1`; default model: `qwen3-coder:30b`; API key is a local placeholder for Ollama-compatible clients.
- `BAZARCHEH_DB_PATH=/data/bazarcheh.db`; Compose mounts `./data:/data`. Do not commit runtime DB files.
- Start command is `docker compose up --build`; open `http://localhost:5173`; backend health endpoint is `http://localhost:8000/api/health` (confirm exact response during runtime QA).

## Baseline verification commands

From repository root (after local setup):

```bash
# Backend
cd backend && python -m pytest -q

# Frontend
cd frontend && npm ci && npm test && npm run build

# Compose validation and runtime
cd .. && docker compose config
docker compose up --build -d
docker compose ps

# API health and browser checks should be run against the started stack.
```

Record actual output in the task completion report. If a command is unavailable, mark it `Not run` or `Blocked`, never `Passed`.
