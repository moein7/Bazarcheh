# ADR-0011: Testing and evaluation strategy

- Status: Proposed
- Related requirements: NFR-001, NFR-004, REQ-DEL-001..004

## Decision
Prioritize deterministic unit tests for normalization, duplicate detection, order extraction, business calendar, urgency, and output validation. Add API/CLI contract tests and a small browser smoke test for required hooks and live timer behavior. Use available labeled evaluation data; otherwise report a clearly identified manually reviewed sample and limitations.

## Verification
Record exact commands and results. Do not manufacture labels, accuracy metrics, or test pass claims.
