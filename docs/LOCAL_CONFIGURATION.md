# Local configuration reference

| Variable | Default | Purpose |
|---|---|---|
| `LLM_BASE_URL` | `http://host.docker.internal:11434/v1` | OpenAI-compatible Ollama endpoint on the Mac host |
| `LLM_API_KEY` | `ollama` | Placeholder bearer token; local Ollama does not require a real API key by default |
| `LLM_MODEL` | `qwen3-coder:30b` | Installed Ollama model used for on-demand drafts |
| `LLM_TIMEOUT_SECONDS` | `35` | Maximum wait for a local draft completion |
| `URGENT_SLA_BUSINESS_HOURS` | `2` | Customer-facing response promise |
| `BAZARCHEH_DB_PATH` | `/data/bazarcheh.db` | Persistent SQLite activity history and approved reply style memory |

Compose reads the root `.env` automatically. Compose also contains matching defaults, so the application still has local Ollama configuration if `.env` is absent. Do not set the backend URL to `http://localhost:11434`: inside the backend container, localhost is the container itself. Use `host.docker.internal` on Docker Desktop for Mac.

## Why classification does not call the model

The evaluation export contains hundreds of rows. A sequential LLM request per message made analysis depend on model latency and caused the reverse proxy to time out. Classification is now deterministic and local to the backend; it uses multilingual keyword rules and does not consume Ollama inference. The local model is reserved for the interactive reply-drafting feature, where one explicit user action creates one model request.

