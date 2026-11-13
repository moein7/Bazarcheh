# UX-001 — Operator-authored manual replies

## Goal
Allow an operator who dislikes an AI-generated or fallback draft to discard it and write an independent reply without leaving the review workflow.

## Scope
- Add a clear-and-write-manually action to the attention queue and all-messages reply dialog.
- Clear all generated text and generated-example association before entering manual mode.
- Keep the editor visible while empty in manual mode; enable copy only after text is entered.
- Save copied manual replies to the existing sanitized style-example memory.
- Log manual clear/copy events separately without logging reply content.
- Preserve copy-only human review; never send to customers.

## Acceptance criteria
- Both reply surfaces expose the manual action after a draft is available.
- Clicking it empties the editor and changes its identity to operator-authored.
- The operator can write, edit and copy a manual reply.
- Empty manual replies cannot be copied.
- Manual and AI actions are distinguishable in activity history.
- Backend tests prove reply text is not stored in activity metadata.

## Verification
- `cd backend && pytest -q`
- Frontend TypeScript syntax check; run Vitest/build if dependencies are available.
- Inspect final ZIP integrity and ensure secrets/runtime DB are excluded.

## Risks and safeguards
- Manual replies may become style examples only after explicit copy/approval.
- The complete reply text is not written to activity logs.
- No customer-facing send API is introduced.
