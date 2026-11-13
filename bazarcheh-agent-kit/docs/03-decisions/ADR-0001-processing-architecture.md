# ADR-0001: Overall processing architecture

- Status: Proposed
- Related requirements: REQ-DATA-001..010, REQ-SLA-001..010, REQ-CON-001

## Context
The dashboard and nightly CLI need consistent analysis semantics. UI-specific business calculations would risk inconsistent numbers, while LLM-dependent time updates would consume quota and introduce nondeterminism.

## Decision
Use a shared backend analysis pipeline for ingestion, normalization, duplicate detection, order extraction, classification, severity/answered state, and initial SLA evaluation. Keep deterministic calendar/SLA utilities independent of the LLM. The frontend may recompute only time-derived SLA fields from stable analysis data and browser time.

## Alternatives considered
1. Duplicate business logic in frontend and backend — rejected due drift risk.
2. Re-run complete backend/LLM analysis on each timer tick — rejected due quota and latency.
3. Shared backend analysis plus deterministic frontend clock calculation — preferred, subject to ensuring the frontend uses equivalent calendar semantics.

## Consequences
- Shared concepts and schemas need tests.
- Frontend calendar implementation must match backend behavior.
- Keep classification and draft generation out of the live timer path.

## Verification
- Compare frontend and backend SLA results for fixed timestamps and calendar fixtures.
- Verify timer updates do not issue network/LLM requests.
