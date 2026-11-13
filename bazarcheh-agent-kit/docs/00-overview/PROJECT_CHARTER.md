# Project Charter

## Product
Bazarcheh Support Dashboard: a Persian RTL dashboard that helps the support lead analyze daily customer-support exports, identify high-severity unanswered messages, monitor the two-business-hour response promise, and prepare safe AI-assisted replies.

## Problem
Support messages arrive from multiple channels and in Persian, English, and Finglish. The existing dashboard is incomplete and its numbers are not fully trusted. The system must provide dependable analytics and surface risks before or after SLA breach.

## Users
- Primary: Sara, support lead.
- Secondary: support agents and QA automation.
- External system: nightly CLI job.

## Outcomes
1. Trustworthy unique-message and category analytics.
2. Correct severity, answered, duplicate, and urgency semantics.
3. A single prioritized needs-attention list.
4. Live business-time countdown based on browser time.
5. Safe, on-demand AI draft replies with human editing and copy approval.
6. Reproducible CLI output and evaluation predictions.

## Non-goals
- Sending customer messages.
- Building a full ticketing or agent-assignment platform.
- Persisting customer data in a production database unless existing architecture requires it.
- Rebuilding unrelated product functionality.
- Adding elaborate observability/infrastructure beyond what is needed for the challenge.

## Success criteria
- One-command Docker startup works within the challenge's expected setup.
- Existing CLI contract remains compatible.
- Draft API contract and same-origin route work.
- Required QA attributes remain available.
- Core business logic is tested at boundaries.
- `predictions.csv`, `WRITEUP.md`, and real `AI_LOGS/` are delivered.
