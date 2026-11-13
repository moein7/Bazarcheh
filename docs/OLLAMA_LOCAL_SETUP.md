# Local Ollama setup (macOS + Docker Desktop)

This project keeps Ollama on the Mac host. Only the Bazarcheh frontend and backend run in Docker Compose. The backend reaches Ollama through Docker Desktop's `host.docker.internal` hostname.

## Included defaults

The repository includes a root `.env` and the same defaults in `docker-compose.yml`:

```dotenv
LLM_BASE_URL=http://host.docker.internal:11434/v1
LLM_API_KEY=ollama
LLM_MODEL=qwen3-coder:30b
LLM_TIMEOUT_SECONDS=35
URGENT_SLA_BUSINESS_HOURS=2
```

No Ollama container, extra Compose service, port mapping, or custom Docker command is needed. Start the application from the repository root with:

```bash
docker compose up
```

## One-time macOS host-listener setup

Ollama on macOS often listens only on `127.0.0.1`. The Mac itself can call that address, but a container cannot reach a loopback-only listener through `host.docker.internal`. The Ollama listener must accept connections on the Mac host interface.

Check the current listener:

```bash
lsof -nP -iTCP:11434 -sTCP:LISTEN
```

If the output shows `127.0.0.1:11434`, run the included one-time helper:

```bash
./scripts/configure-ollama-macos.sh
```

The helper sets `OLLAMA_HOST=0.0.0.0:11434` in the macOS launch environment, quits and reopens the Ollama app. It does not run Docker commands or install Ollama. After the app restarts, check again; the listener should show `*:11434` or `0.0.0.0:11434`.

Binding to `0.0.0.0` makes the Ollama API reachable on host network interfaces. Keep macOS firewall enabled and do not expose port 11434 through your router or a public network. Use this only on a trusted development machine/network.

If you run Ollama as a shell process rather than the macOS app, start it with the environment variable set for that process:

```bash
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

Do not start a second `ollama serve` when the Ollama app/service is already running; the `address already in use` error means the port is already occupied.

## Model check

The configured model must already be present in Ollama:

```bash
ollama list
```

This project defaults to `qwen3-coder:30b`, matching the local model in the development environment. If you choose another installed model, change only `LLM_MODEL` in `.env`.

## How the application uses the model

- CSV upload, deduplication, category rules, SLA calculations and live countdowns do not call Ollama.
- The dashboard never calls the model in the background.
- Ollama is called only when Sara clicks **تهیه پیش‌نویس پاسخ** for a selected message.
- Draft generation can take up to `LLM_TIMEOUT_SECONDS` (35 seconds by default). Nginx allows 240 seconds for this explicit request.
- Provider/model/network failures return HTTP 200 with `source: "fallback"`, a generic editable draft and an explanation. The fallback is never sent automatically and still requires human review.

The backend sends requests to Ollama's OpenAI-compatible endpoint at `/v1/chat/completions`.

The backend also writes a small persistent SQLite history to `/data/bazarcheh.db` (host path `./data/bazarcheh.db`). This is independent of Ollama. See `docs/ACTIVITY_HISTORY_AND_LEARNING.md` for what is retained and how approved replies influence future prompts.
