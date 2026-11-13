# ADR-0007: Local Ollama integration and on-demand drafting

- Status: Accepted
- Related requirements: REQ-AI-001/002/003/004/005, REQ-CON-003

## Context
Sequential LLM classification made CSV uploads wait on one inference per message and triggered reverse-proxy 504 timeouts. The challenge also limits LLM quota and requires drafts to be generated only when Sara clicks.

## Decision
Use the OpenAI-compatible Ollama endpoint configured by `LLM_BASE_URL`, `LLM_API_KEY`, and `LLM_MODEL`. The local Mac host is addressed from Docker Desktop using `host.docker.internal`. Default model: `qwen3-coder:30b`.

CSV classification is deterministic and never invokes the LLM. The model is reserved for explicit reply-draft requests. Draft calls use a 180-second client timeout; Nginx allows 240 seconds. Customer text is untrusted, prompts prohibit commitments and invented actions, and deterministic output checks fail closed. The UI requires human editing/approval and copies the approved text; it never sends it.

## Failure behavior
Provider errors, timeout, malformed/empty output, language mismatch, and detected unsafe content return HTTP 200 with `blocked: true`, an empty draft, and a warning. No background retries or draft pre-generation are used.

## Verification
Backend tests cover unavailable provider behavior, prompt-injection framing, safe output, unsafe output and analysis independence from model configuration. Live Ollama and adversarial model tests remain a target-machine release gate.
