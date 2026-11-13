# Definition of Done

A task can be marked Done only when all applicable conditions are satisfied.

## Before implementation
- [ ] Requirements and scope understood.
- [ ] Dependencies and file ownership clear.
- [ ] Relevant ADR accepted or decision documented.
- [ ] Acceptance criteria are testable.

## Implementation
- [ ] Focused changes only.
- [ ] Existing contracts preserved.
- [ ] Input/output validation added where needed.
- [ ] Errors handled intentionally.
- [ ] No secrets or customer data accidentally committed.
- [ ] No unapproved dependency or scope expansion.

## Verification
- [ ] Relevant tests added/updated.
- [ ] Required test commands executed.
- [ ] Results accurately recorded.
- [ ] Boundary and failure cases considered.
- [ ] No known critical regression.

## Documentation
- [ ] ADR updated if decision changed.
- [ ] API/data docs updated if contract changed.
- [ ] Task board updated.
- [ ] Known limitations recorded.
- [ ] Completion report submitted.

## Status semantics
- Done: all mandatory criteria verified.
- Partial: implementation exists but some criteria/tests remain.
- Blocked: cannot proceed due external dependency or unresolved decision.
- Not run: verification was not executed; never represent as passed.
