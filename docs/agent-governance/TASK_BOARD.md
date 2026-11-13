# Governed task board

This is the active execution board. Every implementation task must have a detailed plan under `docs/agent-governance/tasks/` before it enters `Ready`. Keep task IDs stable. Update this board in the same change as implementation status.

## Status definitions

- **Backlog:** identified, not yet planned.
- **Planned:** task file exists; awaiting approval.
- **Ready:** plan approved; may start.
- **In Progress:** one accountable owner is implementing.
- **Review:** implementation complete; independent review/verification pending.
- **Blocked:** cannot proceed; blocker and owner recorded.
- **Partial:** some acceptance criteria met, but release/quality evidence is incomplete.
- **Done:** all acceptance criteria and Definition of Done met with evidence.
- **Cancelled:** explicitly abandoned with rationale.

## Active baseline tasks

| ID | Priority | Task | Status | Owner | Evidence / exit condition |
|---|---|---|---|---|---|
| GOV-001 | P0 | Install root agent instructions, task lifecycle, roles/skills entry points and governance docs | Done | Orchestrator | This governance package; documentation-only update recorded in `AI_LOGS/` |
| GOV-002 | P0 | Remove local `.env` from deliverable and establish secret/runtime-data ignore rules | Done | Release | `.env.example` retained; `.env` excluded from package; `.gitignore` added |
| QA-001 | P0 | Run frontend clean install, Vitest and production build | Backlog | Frontend + QA | `npm ci`, `npm test`, `npm run build` all pass in target environment |
| QA-002 | P0 | Build and run Compose stack; verify health and host Ollama connectivity | Backlog | Release + Backend | Docker build/start, health checks and one explicit draft request verified |
| QA-003 | P0 | Browser E2E for upload, RTL/bidi, live clock, category filters, search/sort, attention SLA, all-message reply and clipboard | Backlog | QA + Frontend | Automated/manual evidence with frozen clock and network assertions |
| QA-004 | P0 | Fix optional selected-draft TypeScript error in AttentionList | Review | Frontend | `selectedDraft` normalized to an empty string; TS18048 access fixed; backend 43 tests pass; full frontend build awaits clean dependency install |
| AI-001 | P0 | Adversarial review of local model drafts and output validation | Backlog | AI + QA/Security | Persian/English/Finglish injection and unsafe promise test report; model output discarded on safety failure |
| AI-002 | P0 | Multilingual draft generation and non-blocking AI fallback | Review | Backend + Frontend | Mixed Unicode support, AI fallback and browser fallback implemented; 42 backend tests pass; frontend runtime verification pending |
| UX-001 | P1 | Operator-authored manual replies alongside AI drafts | Review | Frontend + Backend | Clear AI draft into a blank manual editor in both reply surfaces; manual copy and clear events logged separately; backend regression tests added |
| UX-002 | P1 | Restore live clock, all-message replies, multilingual prompting and latest-category filtering | Review | Frontend + Backend | Header HH:MM clock, reply action on every message, model-directed multilingual output, one active category; 42 backend tests pass |
| DATA-001 | P1 | Evaluate deterministic category quality against human-labeled sample | Backlog | Business Logic + QA | Labeled sample, confusion matrix and limitations documented; no fabricated labels |
| OPS-001 | P1 | Validate persistence, backup/restore and activity retention behavior | Backlog | Backend + Release | Restore exercise and retention/privacy decision recorded |
| DOC-001 | P1 | Reconcile detailed agent-kit docs and ADRs against current implementation after runtime QA | Planned | Auditor + Orchestrator | Discrepancy report and accepted doc updates |

## Execution rules

1. Pick highest-priority unblocked task whose dependencies are complete.
2. Create `tasks/<TASK-ID>.md` from `.agents/templates/TASK_TEMPLATE.md`.
3. Do not mark Ready until scope, owner, reviewer, acceptance criteria, commands, risks and dependencies are explicit and approved.
4. Update status at task start, when blocked, when entering review and at close.
5. Add a log entry to `AI_LOGS/` for every implementation task, including docs-only changes.
6. Close with `.agents/templates/COMPLETION_REPORT.md`.

## Planned future improvements (not approved for implementation)

- Authentication/role-based access if the dashboard becomes a multi-user production tool.
- Data retention controls and admin export/delete flows.
- Formal evaluation and human review workflow for classification/draft quality.
- Production-grade observability, backup and deployment automation.

These are proposals only. Do not build them until separately scoped and approved.
