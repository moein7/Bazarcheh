# Agent handoff and review protocol

## Orchestrator to implementer

Handoff must include task ID, approved plan path, owner, reviewer, branch/worktree if applicable, allowed files, dependencies and expected verification. The implementer must acknowledge the scope before editing.

## Implementer to reviewer

Provide: summary, changed files, requirement mapping, tests run with exact outputs, tests not run, known risks, migration/rollback notes, docs/log links and any deviations. Do not say “ready” if a required check was skipped; say “ready for review with gates outstanding”.

## Reviewer checklist

- Does the diff match the approved plan?
- Are business rules and API/CLI/QA contracts preserved?
- Are edge cases and regression tests adequate?
- Are untrusted inputs handled safely? Are secrets/customer data absent from logs?
- Are failures/timeouts/empty/loading states handled?
- Are docs, changelog, ADR and logs updated where applicable?
- Are verification claims supported by actual output?
- Can the change be rolled back safely?

## Parallel work

Parallelize only independent tasks. Assign exclusive file/module ownership. Shared files (App, API contracts, config, task board, changelog) have a single designated editor at a time. The orchestrator integrates and resolves conflicts; agents must not force-push, reset or discard another agent's work.
