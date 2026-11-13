---
name: model-evaluation
description: Measure classification quality honestly using trustworthy labels and document limitations.
---

# model-evaluation

## Purpose
Measure classification quality honestly using trustworthy labels and document limitations.

## When to use
When selecting or evaluating classification rules/models.

## Required inputs
Labeled evaluation data or manually reviewed sample, predictions.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Never invent labels or metrics.
- Keep evaluation data separate from prompt examples where possible.
- Report per-class metrics and confusion patterns when sample size permits.
- Explain label quality and sampling limitations.

## Expected outputs
MODEL_EVALUATION.md and reproducible evaluation command/script.

## Verification
Metrics reproduce from the documented data and method.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
