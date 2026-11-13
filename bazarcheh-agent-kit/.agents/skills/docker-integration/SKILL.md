---
name: docker-integration
description: Ensure reproducible one-command startup and correct container networking/configuration.
---

# docker-integration

## Purpose
Ensure reproducible one-command startup and correct container networking/configuration.

## When to use
Docker Compose or runtime integration work.

## Required inputs
Compose file, Dockerfiles, env example, service ports.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Preserve expected startup command.
- Do not commit secrets.
- Ensure frontend-to-backend proxy works in container context.
- Keep changes minimal.

## Expected outputs
Working compose configuration and README instructions.

## Verification
Run `docker compose up --build` and verify dashboard and API.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
