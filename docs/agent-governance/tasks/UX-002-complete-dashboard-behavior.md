# UX-002 — Restore and complete dashboard behaviors

## Goal
Deliver one integrated build retaining the previously implemented operator workflow while ensuring the live Tehran clock, per-message replies, multilingual AI prompting, and single-active-category filtering are present.

## Acceptance criteria
- [x] Header clock displays Persian date and live Tehran hours/minutes, updating every second.
- [x] Every row in All Messages has an independent reply action (no 500-row rendering cap).
- [x] AI prompt asks the model to detect and respond in any language it can understand; Finglish remains Persian.
- [x] Remove the hard-coded Persian/English output-language mismatch rejection.
- [x] A category selection replaces the previous selected category; it does not toggle or accumulate filters.
- [x] Existing AI fallback, manual reply, human review, activity history and no-auto-send behavior remain intact.
- [x] Backend regression suite passes and ZIP archive integrity is verified.

## Verification
- `pytest -q`: 42 passed.
- `python -m compileall -q backend/app backend/tests`: passed.
- TypeScript/TSX transpile syntax check: see release log.
- Frontend clean install/build and Docker/browser runtime checks: not verified; npm clean install timed out in this environment.

## Limitations
The AI can respond in languages supported by the configured local model; this is model capability, not a guarantee of perfect coverage for every language. Offline generic fallback templates remain Persian/English. Operators can replace any fallback manually.
