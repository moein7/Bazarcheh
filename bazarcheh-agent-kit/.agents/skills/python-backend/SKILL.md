---
name: python-backend
description: Implement reliable Python processing, FastAPI endpoints, schemas, and CLI compatibility.
---

# python-backend

## Purpose
Implement reliable Python processing, FastAPI endpoints, schemas, and CLI compatibility.

## When to use
Backend feature work and integration.

## Required inputs
Existing backend structure, CSV schema, API/CLI contracts, accepted ADRs.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Preserve CLI invocation and JSON contract.
- Validate inputs and outputs.
- Keep deterministic logic separate from transport.
- Use bounded external calls and explicit errors.
- Keep one output row per input message.

## Expected outputs
Focused Python modules, tests, contract-compatible API/CLI.

## Verification
Run backend tests and exact CLI command; verify output keys and row cardinality.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
