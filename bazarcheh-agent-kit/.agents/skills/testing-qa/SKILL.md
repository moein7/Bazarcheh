---
name: testing-qa
description: Design and execute unit, integration, regression, and browser acceptance tests.
---

# testing-qa

## Purpose
Design and execute unit, integration, regression, and browser acceptance tests.

## When to use
Every task and final release.

## Required inputs
Requirements, acceptance matrix, current code, test commands.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Test business boundaries and failure modes.
- Verify contracts exactly.
- Review actual diff.
- Report not-run separately.
- Do not approve based on compilation alone.

## Expected outputs
Tests, test report, blocking findings.

## Verification
Evidence exists for every critical acceptance criterion.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
