---
name: task-governance
description: Plan, approve, execute, review and log Bazarcheh changes with traceable governance.
---

# Task governance skill

## Trigger
Use whenever a user asks to change code, behavior, architecture, configuration, documentation or tests in this repository.

## Procedure
1. Read root `AGENTS.md`, `docs/agent-governance/GETTING_STARTED.md`, project state and task board.
2. Inspect current code, data contracts, tests, git status and relevant existing docs.
3. Create or update a task plan from `.agents/templates/TASK_TEMPLATE.md`.
4. Obtain orchestrator/user approval before modifying application code.
5. Implement only approved scope. Use focused changes and add regression tests.
6. Run verification commands; capture actual output and classify unrun checks honestly.
7. Update task board, task file, relevant docs, changelog and `AI_LOGS/` entry.
8. Submit completion report using `.agents/templates/COMPLETION_REPORT.md`.

## Guardrails
- Never start coding from an unapproved plan.
- Never invent test results, model output, approvals or log records.
- Never commit `.env`, DBs, customer exports or sensitive data.
- Do not silently change contracts or business semantics; propose an ADR.
- Keep one accountable owner and independent reviewer per task.
- Do not mark Done while required acceptance criteria or verification are outstanding.
