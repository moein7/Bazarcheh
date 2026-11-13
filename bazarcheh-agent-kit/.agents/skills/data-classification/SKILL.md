---
name: data-classification
description: Normalize multilingual support data, identify resends/order references, and classify message categories.
---

# data-classification

## Purpose
Normalize multilingual support data, identify resends/order references, and classify message categories.

## When to use
CSV processing and category/duplicate/order logic.

## Required inputs
Actual CSV schema, sample messages, allowed category list.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Keep duplicate and category semantics separate.
- Duplicate requires same customer and normalized text.
- Preserve all input rows.
- Normalize Persian and Arabic-Indic digits.
- Extract BZ- plus digits from column/body.
- Return only allowed categories.
- Prefer primary customer request when multiple topics appear.

## Expected outputs
Normalization utilities, duplicate links, order extraction, classification output.

## Verification
Test language variants, same/different customers, whitespace, digits, missing fields, ambiguous categories.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
