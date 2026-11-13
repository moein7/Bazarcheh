# Agent-ready onboarding

This repository is prepared for agent-assisted development with explicit governance. The project is not a blank-slate scaffold: agents must first understand the current implementation and its known verification gaps.

## First session (mandatory)

1. Read root `AGENTS.md` (canonical rules) and this guide.
2. Read `PROJECT_STATE.md`, `TASK_BOARD.md`, `bazarcheh-agent-kit/docs/00-overview/REQUIREMENTS.md`, `bazarcheh-agent-kit/docs/02-architecture/API_CONTRACTS.md`, `bazarcheh-agent-kit/docs/02-architecture/SECURITY_MODEL.md`, and `bazarcheh-agent-kit/docs/03-decisions/ADR_INDEX.md`.
3. Inspect the current git status and diff. Do not reset, clean, checkout over, or overwrite user work.
4. Run the baseline checks available in the current environment. Record results exactly; do not use historical test counts as current evidence.
5. Choose the next task from `TASK_BOARD.md`. If no task exists, propose one using `.agents/templates/TASK_TEMPLATE.md`.
6. Ask the orchestrator/user to approve the plan. Only then implement.

## Recommended agent setup

- **Orchestrator:** `.agents/agents/ORCHESTRATOR.md` — only role allowed to approve plans, resolve requirement conflicts and close/release tasks.
- **Repository auditor:** `.agents/agents/REPOSITORY_AUDITOR.md` — read-only discovery and evidence gathering.
- **Business logic:** `.agents/agents/BUSINESS_LOGIC_AGENT.md` — normalization, deduplication, categories, order extraction and SLA.
- **Backend:** `.agents/agents/BACKEND_AGENT.md` — API, persistence, CLI and backend implementation.
- **Frontend:** `.agents/agents/FRONTEND_AGENT.md` — React/TypeScript, RTL and accessibility.
- **AI/LLM:** `.agents/agents/AI_LLM_AGENT.md` — provider integration, prompts, output validation and privacy.
- **QA/security:** `.agents/agents/QA_SECURITY_AGENT.md` — test strategy, adversarial cases, security and regression review.
- **Release:** `.agents/agents/RELEASE_AGENT.md` — reproducible builds, Compose and delivery checks.

Agents are roles and instruction sets, not evidence that a multi-agent runtime is installed. A single agent may perform multiple roles sequentially; retain the same approval and review gates.

## Mandatory task states

`Backlog → Planned → Ready → In Progress → Review → Done`

Alternative states: `Blocked`, `Cancelled`, `Partial`. `Ready` requires an approved task plan. `Done` requires the Definition of Done and completion report.

## Start prompt

Use this as the first instruction to a coding agent:

> Read `AGENTS.md` and `docs/agent-governance/GETTING_STARTED.md` first. Perform discovery only: inspect the repository, current git diff, tests, runtime configuration and documentation. Do not modify files. Report the current state, discrepancies between docs and code, available verification commands, risks, and the highest-priority next tasks. Wait for approval before implementation.

## Implementation prompt

> Implement only task `<TASK-ID>` after confirming it is `Ready`. Re-read its plan and all relevant contracts. Do not expand scope. Add/update tests, docs and logs. Run the exact verification commands. Update the task status and provide a completion report. Do not claim unrun checks passed.

## Tool-specific entry points

- Claude Code: read `CLAUDE.md`; it points to canonical `AGENTS.md`.
- Other coding agents: use root `AGENTS.md` as the project instruction file; import `.agents/` roles/skills/workflows as supported by the tool.
- IDE copilots: paste the Start prompt and include `AGENTS.md` in workspace context.
