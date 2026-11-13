# ADR-0006: Order reference extraction

- Status: Proposed
- Related requirements: REQ-DATA-005/006

## Decision
Normalize Persian and Arabic-Indic digits to ASCII before matching `BZ-` followed by digits. Inspect both `order_ref` and message body. Define precedence when both exist and disagree; prefer the validated explicit column unless repository/data evidence indicates another policy. Return null if no valid reference exists.

## Verification
Test ASCII, Persian digits, Arabic-Indic digits, mixed digits, case variants, punctuation boundaries, missing values, and conflicting column/body values.
