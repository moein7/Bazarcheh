# AI-002 — Multilingual draft generation and non-blocking fallback

- **Status:** In Progress
- **Priority:** P0
- **Owner:** Backend + Frontend
- **Reviewer:** QA / Security

## Outcome

Draft creation must accept mixed/non-Persian Unicode customer messages without failing solely because the message contains Latin text, emoji, punctuation or other scripts. When Ollama is unavailable, times out, errors, returns empty/unsafe output or returns an unexpected language, the support workflow must still provide an editable, clearly labelled generic fallback reply. The dashboard and API process must remain available.

## Scope

- Improve language detection using script/letter balance and Finglish markers.
- Use safe generic Persian/English fallback drafts when AI is unavailable or output is rejected.
- Keep HTTP response stable and non-error for expected provider failures.
- Add bounded model timeout and connection timeout.
- Add frontend local fallback if the draft API itself cannot be reached.
- Show a warning/source label while keeping fallback text editable and copyable.
- Add regression tests and update docs, task board, changelog and AI logs.

## Exclusions

- No automatic sending to customers.
- No relaxation of unsafe-commitment checks.
- No new AI provider or dependency.
- No fine-tuning or customer-content retention changes.

## Acceptance criteria

1. Persian, English, Finglish, mixed Persian/Latin, emoji and non-Persian Unicode inputs are accepted by `/api/draft`.
2. AI-generated output is returned only after safety validation.
3. Provider timeout/unavailability/exception, empty output, unsafe output or language mismatch returns an editable fallback draft and warning, not a blank blocked result.
4. If the API request itself fails in the browser, the user still receives an editable local fallback draft.
5. Fallback contains no promises, dates, prices, refunds or claims that work has already been done.
6. The request is on-demand only; CSV analysis, clocks, filters and SLA remain independent of Ollama.
7. Logs record AI vs fallback outcome and reason without storing customer message text or raw prompts.
8. Backend tests cover each fallback and multilingual case; frontend syntax/tests are run where dependencies permit.

## Risks and mitigations

- Generic fallback may be less contextual: label it clearly and require human editing/review.
- Script detection is heuristic: support fa/en/Finglish and default unsupported/ambiguous content to English fallback; do not block message creation.
- Regex safety checks can miss nuanced promises: keep human review mandatory and do not send messages automatically.

## Verification

- `cd backend && pytest -q`
- Python compile check for backend modules.
- Frontend `npm test` and `npm run build` when dependencies are available.
- Manual/API checks with Persian, English, mixed-script, emoji, unavailable Ollama and forced timeout.
