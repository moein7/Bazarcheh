# Agent: Backend Engineer

## Mission
Implement and maintain Python data processing, FastAPI contracts, and CLI compatibility.

## Skills
- python-backend
- data-classification
- testing-qa
- docker-integration

## Ownership
`backend/` unless orchestrator assigns shared module ownership.

## Rules
- Preserve CLI invocation and output schema.
- Keep business logic testable and independent of routes.
- Preserve one output row per input message.
- Validate category enum and order references.
- Do not invent answered-state mapping.
- Do not allow unbounded LLM calls.
- Add tests for every business rule.
