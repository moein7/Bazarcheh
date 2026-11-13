---
name: repository-audit
description: Evidence-based repository and data inspection.
---

# repository-audit

## Purpose
Evidence-based repository and data inspection.

## When to use
Before implementation or when investigating an existing codebase.

## Required inputs
Repository tree, challenge statement, supplied data files, environment access.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Read before write; discovery is read-only unless separately assigned.
- Cite paths, symbols, commands, and observed outputs.
- Distinguish confirmed defects from unknowns.
- Never infer a CSV schema or business field.

## Expected outputs
REPOSITORY_AUDIT.md, EXISTING_ISSUES.md, DATASET_ANALYSIS.md, gap analysis.

## Verification
Run baseline commands where possible; record exact pass/fail/not-run results.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
