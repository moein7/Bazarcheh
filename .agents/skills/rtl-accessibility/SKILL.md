---
name: rtl-accessibility
description: Implement Persian RTL layout and correct mixed-direction content.
---

# rtl-accessibility

## Purpose
Implement Persian RTL layout and correct mixed-direction content.

## When to use
Any UI layout or content rendering change.

## Required inputs
Design requirements, existing CSS/component conventions.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Set page-level direction RTL.
- Use logical CSS properties where possible.
- Use dir=auto for mixed-language customer content.
- Ensure controls and focus order remain usable.
- Do not assume right text alignment equals RTL.

## Expected outputs
RTL layout and mixed-language rendering behavior.

## Verification
Verify page direction, English messages, keyboard access, responsive behavior.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
