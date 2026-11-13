# ADR-0008: Draft safety and prompt injection controls

- Status: Proposed
- Related requirements: REQ-AI-003..007

## Decision
Customer content is untrusted data. The system prompt defines strict role and policy; customer content is clearly delimited as data. The backend validates model output before returning it. Block any output that makes or implies a prohibited money/refund/compensation/amount/date promise, or whose safety cannot be established.

A simple keyword detector is only a defense-in-depth heuristic and is not a proof of safety, especially for Persian/Finglish paraphrases. Use conservative blocking and document residual risk. Approval copies edited text only; no send integration exists.

## Verification
Adversarial prompt injection, explicit and paraphrased refund promises, amounts, compensation, dates, mixed-language output, empty output, and malformed output.
