# Change control, task planning and engineering logs

## Required planning record

Every task gets a stable ID and a file in `docs/agent-governance/tasks/`. The plan must define: problem, desired outcome, related requirement/ADR, priority, owner, reviewer, dependencies, included/excluded scope, files/modules, acceptance criteria, test commands, risks, rollback/compatibility concerns and approval. An implementation plan is not a retrospective description; it must exist before code changes.

## Change classification

| Class | Examples | Required governance |
|---|---|---|
| C0 documentation | Typo, wording, link correction | Task + doc/log update; no ADR |
| C1 local implementation | Isolated UI or helper behavior | Task + tests + review + log |
| C2 contract/business | SLA, categories, dedup, API/CLI schema | Task + tests + API/requirement docs + ADR if semantics change + review |
| C3 architecture/security/data | DB schema, provider, privacy, auth, deployment topology | Task + proposed/accepted ADR + threat/impact review + migration/rollback + tests + release approval |

## Mandatory records after a change

- `docs/agent-governance/TASK_BOARD.md`: task status and evidence.
- `docs/agent-governance/tasks/<ID>.md`: final status, changed files, test evidence and limitations.
- `CHANGELOG.md`: user-visible behavior or meaningful operational changes.
- Relevant docs/API contracts/requirements/ADRs: keep aligned with code.
- `AI_LOGS/YYYY-MM-DD_<TASK-ID>.md`: factual record of work, agent roles, files, decisions, exact commands/results and unresolved risks.
- `AI_LOGS/README.md`: explain log format and privacy policy.

## Log entry schema

```markdown
# <TASK-ID> — <title>
- Date/time (timezone):
- Status: Done | Partial | Blocked
- Owner / reviewer:
- Approved plan: <path>
- Related requirements / ADRs:

## Plan
## Changes made (files and reason)
## Decisions / deviations (with approval)
## Verification (exact command, result, count)
## Not run / blocked checks and why
## Security/privacy impact
## Follow-ups
```

## Rules for logs

- Logs are append-only history. Correct errors by adding a dated correction; do not rewrite history to make it look as if a later decision was made earlier.
- Do not include customer text, personal data, secrets, tokens, API keys, raw prompts or complete model responses. Use message IDs only when necessary and permitted.
- Do not fabricate tool output, model usage, test counts, durations, approvals or agent transcripts.
- Mark tests as `Passed`, `Failed`, `Not run`, or `Blocked`; include environment and exact command.
- Store architectural rationale in ADRs, not only in chat transcripts.
