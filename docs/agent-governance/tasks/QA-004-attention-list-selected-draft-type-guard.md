# QA-004 — Guard optional selected draft in AttentionList

## Problem
The frontend production build failed under strict TypeScript checks because `selectedDraft` could be `undefined` while JSX accessed `.length` and `.toLocaleString()` in the manual-reply branch.

## Change
Normalize the selected message's draft to an empty string when no draft exists. This preserves the manual-reply experience: entering manual mode opens an empty editable textarea, and the character count safely displays zero.

## Verification
- Backend regression suite: `pytest -q` — 43 passed.
- Frontend production build: attempted, but the local dependency installation is incomplete; `npm ci` timed out. The original reported TS18048 issue is fixed by making `selectedDraft` always a string.
- Docker build and browser runtime: not run in this environment.

## Acceptance
- No optional-string access to `selectedDraft` in the component.
- Manual mode can render an empty editor without a TypeScript undefined error.
