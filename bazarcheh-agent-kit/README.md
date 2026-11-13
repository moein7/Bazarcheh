# Bazarcheh Agent Engineering Kit

The active, portable agent instructions are installed at repository root: `AGENTS.md`, `CLAUDE.md`, and `.agents/`. This folder remains the detailed knowledge base for project requirements, architecture, ADRs, risk register, quality strategy and delivery.

## Start here

1. Read root `AGENTS.md`.
2. Read `docs/agent-governance/GETTING_STARTED.md` and `PROJECT_STATE.md`.
3. Read the requirements, API contracts, security model and ADR index in this kit.
4. Follow `.agents/workflows/01-discovery.md`; discovery is read-only.
5. Plan and approve a task on `docs/agent-governance/TASK_BOARD.md` before implementation.
6. Use the role definitions, skills, workflows and templates under root `.agents/`.
7. Update task records, docs, changelog and `AI_LOGS/` for every change.

## Scope and limitations

- Agent roles are reusable instructions, not a claim that an agent orchestration runtime is installed.
- Existing docs are reference material; reconcile them with current code and test evidence before treating old status fields as current.
- Do not fabricate evaluation labels, test results, model traces or approvals.
