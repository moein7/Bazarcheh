# Workflow: Independent Change Review

Review the diff, not just the author's summary.

Check:
- Requirements and acceptance criteria satisfied.
- Business semantics match the challenge.
- Existing contracts preserved.
- Correctness at boundaries.
- Error handling and failure behavior.
- Security and prompt-injection exposure.
- Tests actually executed and relevant.
- No unrelated refactor or dependency.
- Documentation and ADR consistency.
- No secrets or sensitive logs.

Classify findings as Blocking, Major, Minor, or Nit. A review must cite file paths and explain impact. Do not approve based on visual polish or successful compilation alone.
