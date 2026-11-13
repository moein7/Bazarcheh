# ADR-0004: Severity, answered state, and urgency semantics

- Status: Proposed
- Related requirements: REQ-DATA-009/010, REQ-SLA-006/007/008

## Context
Category and severity are separate. The attention list includes upcoming breaches, while the urgent count includes overdue messages only.

## Decision
`is_urgent = is_high_severity AND is_unanswered AND elapsed_business_minutes >= 120 AND NOT is_resend`.

Needs-attention membership is `is_high_severity AND is_unanswered AND NOT is_resend`, regardless of whether 120 minutes have elapsed.

Answered status must map to the actual export field(s), verified during discovery. An answered message is never urgent, even if it was answered late.

## Verification
Test answered-late, exactly-threshold, before-threshold, resend, and low-severity combinations. Assert urgent count equals overdue attention rows.
