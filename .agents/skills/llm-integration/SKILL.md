---
name: llm-integration
description: Integrate OpenAI-compatible LLM endpoints with bounded latency and predictable fallback.
---

# llm-integration

## Purpose
Integrate OpenAI-compatible LLM endpoints with bounded latency and predictable fallback.

## When to use
Classification or on-demand draft generation requires an LLM.

## Required inputs
LLM_BASE_URL, LLM_API_KEY, LLM_MODEL, request/response schema.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Read credentials only from environment.
- Set explicit timeout.
- Bound retries.
- Validate structured outputs.
- Never hang on provider failure.
- No LLM call during live countdown.
- Draft call only on user action.

## Expected outputs
Provider adapter, configuration validation, timeout/error handling.

## Verification
Test missing config, success, malformed response, timeout, rate limit, and connection failure.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
