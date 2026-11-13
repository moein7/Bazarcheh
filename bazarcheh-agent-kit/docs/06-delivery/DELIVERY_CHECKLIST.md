# Delivery Checklist

## Repository
- [ ] GitHub repository or ZIP prepared.
- [ ] No secrets committed.
- [ ] README includes startup instructions and environment variables.
- [ ] `docker compose up` works.

## Compatibility
- [ ] CLI command unchanged and verified.
- [ ] CLI JSON structure unchanged and verified.
- [ ] Draft API available at same-origin `/api/draft`.
- [ ] Required QA hooks preserved.

## Evaluation
- [ ] `predictions.csv` generated from `eval_messages.csv`.
- [ ] Header exactly `message_id,category,is_urgent`.
- [ ] One row per input message.
- [ ] Urgency uses export timestamp in `EXPORT_INFO.txt`.
- [ ] No fabricated labels or metrics.

## Documentation
- [ ] `WRITEUP.md` at most one page.
- [ ] Explains real problem and assumptions.
- [ ] Explains existing issues and how each was found.
- [ ] Explains cuts and rationale.
- [ ] Explains where AI misled the developer.
- [ ] Explains classification evaluation and limitations.
- [ ] Explains draft safety controls.

## AI logs
- [ ] `AI_LOGS/` contains actual exported sessions/transcripts.
- [ ] Logs do not expose API keys or secrets.
- [ ] Logs do not include unnecessary sensitive data.
