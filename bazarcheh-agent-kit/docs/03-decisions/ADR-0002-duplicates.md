# ADR-0002: Duplicate detection and normalization

- Status: Proposed
- Related requirements: REQ-DATA-003, REQ-DATA-004

## Context
A customer may resend the same text. Resends count once for unique analytics but all source rows remain in the CLI messages array.

## Decision
Identify a resend only when customer identity and normalized text match. Preserve the earliest/original occurrence according to export order unless discovery establishes a better reliable timestamp ordering. Later matching rows reference the original `message_id` in `duplicate_of`.

Normalization should be conservative: normalize Unicode consistently, trim and collapse whitespace, and define handling for Arabic/Persian character variants only where evidence supports equivalence. Do not aggressively remove punctuation or alter words if that could merge distinct requests.

## Alternatives
- Exact raw text only.
- Conservative normalized text.
- Semantic similarity (rejected for this time-box due false-positive risk and nondeterminism).

## Verification
Test same customer/same text, different customer/same text, same customer/different text, whitespace differences, Unicode variants, and repeated resends.
