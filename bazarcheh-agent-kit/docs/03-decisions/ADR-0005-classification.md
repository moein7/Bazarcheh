# ADR-0005: Category classification strategy

- Status: Proposed
- Related requirements: REQ-DATA-007/008

## Context
Messages are Persian, English, and Finglish. Six categories are required and one message may mention multiple topics.

## Decision
Use a measurable hybrid strategy if it improves results within the time-box: deterministic rules for high-confidence obvious patterns and an LLM for ambiguous messages. Validate every result against the exact category enum. Define fallback behavior when the model is unavailable. Do not assume rules are better or worse without evaluating against available labels.

The selected category must reflect the customer's primary request, not simply the first keyword encountered.

## Verification
Evaluate on labeled data if available. Report per-category precision/recall or confusion matrix where possible. If no trustworthy labels exist, create a manually reviewed representative sample and state its size and limitations. Never claim unsupported accuracy.
