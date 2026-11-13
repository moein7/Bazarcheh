---
name: react-dashboard
description: Build the support dashboard with reliable state, analytics, attention list, and draft workflow.
---

# react-dashboard

## Purpose
Build the support dashboard with reliable state, analytics, attention list, and draft workflow.

## When to use
Frontend implementation.

## Required inputs
Existing React/Vite code, agreed API contracts, requirements.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Preserve required test IDs.
- Avoid duplicating backend classification rules.
- Keep loading/error/empty/blocked states.
- Use stable message identity.
- Timer updates only time-derived state.

## Expected outputs
React components, state/hooks, accessible interactions.

## Verification
Browser smoke tests cover upload, list/count, draft, and required hooks.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
