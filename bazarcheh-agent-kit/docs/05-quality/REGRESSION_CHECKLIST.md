# Regression Checklist

Run after integration:
- [ ] Backend starts.
- [ ] Frontend starts.
- [ ] Docker Compose starts from clean state.
- [ ] CSV upload still works.
- [ ] Existing dashboard features still work or documented removals are approved.
- [ ] Exact CLI command works.
- [ ] CLI output contains required keys and all input rows.
- [ ] Duplicate semantics correct.
- [ ] Category counts correct for unique messages.
- [ ] SLA threshold equality correct.
- [ ] Answered-late messages excluded from urgency.
- [ ] Attention list includes upcoming breaches.
- [ ] Attention ordering correct.
- [ ] Urgent count equals overdue attention rows.
- [ ] Browser timer refreshes at least once per minute.
- [ ] No LLM request on timer tick.
- [ ] Draft API same-origin path works.
- [ ] LLM failure returns blocked HTTP 200.
- [ ] Draft safety tests pass.
- [ ] Copy approval does not send.
- [ ] All required data-testid hooks present.
