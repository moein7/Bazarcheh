---
name: adr-governance
description: Create concise Architecture Decision Records for consequential engineering choices.
---

# adr-governance

## Purpose
Create concise Architecture Decision Records for consequential engineering choices.

## When to use
When a decision affects architecture, business semantics, security, reliability, contracts, or major trade-offs.

## Required inputs
Decision context, evidence, constraints, alternatives.

## Workflow
1. Read root `AGENTS.md` and relevant requirements.
2. Inspect current code/data before proposing changes.
3. Confirm scope, dependencies, and file ownership.
4. Implement or analyze only the assigned scope.
5. Add evidence, tests, and documentation.
6. Submit a completion report.

## Rules
- Search ADR index first.
- Status starts Proposed.
- Only orchestrator accepts decisions.
- Record consequences and verification.
- Avoid ADRs for trivial choices.

## Expected outputs
ADR markdown and updated ADR_INDEX.md.

## Verification
Decision has clear rationale, alternatives, impact, and verification.

## Completion standard
Do not report completion until the required outputs exist and verification results are truthful.
