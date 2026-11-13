---
name: frontend-api-integration
description: Integrate React with backend APIs while preserving same-origin contracts.
---

# frontend-api-integration

## Purpose
Integrate React with backend APIs while preserving same-origin contracts.

## When to use
Upload, analysis, and draft API work.

## Required inputs
API_CONTRACTS.md, Vite config, backend service ports.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Use same-origin `/api/draft`.
- Configure proxy without changing public path.
- Handle blocked responses distinctly from transport errors.
- Never auto-send draft.
- Preserve test hooks.

## Expected outputs
API client/proxy and UI request states.

## Verification
Test through dashboard origin, including backend unavailable and blocked responses.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
