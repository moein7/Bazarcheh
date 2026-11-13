# ADR-0010: CLI and API contract preservation

- Status: Proposed
- Related requirements: REQ-CON-001..003

## Decision
Preserve the CLI invocation and required JSON shape. Preserve `POST /api/draft` path, request/response fields, language enum, blocked semantics, and HTTP 200 fallback on LLM unavailability. Expose draft API through dashboard same origin using the existing proxy or a minimal Vite proxy configuration.

## Verification
Run the exact supplied CLI command. Contract-test API success and blocked response. Test from browser origin rather than directly against backend port.
