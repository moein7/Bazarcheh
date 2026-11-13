# Security Model

## Threats
- Prompt injection embedded in customer message.
- Model hallucinating refund, compensation, monetary amount, or date promises.
- Malformed or adversarial model output.
- API key leakage.
- Oversized or malformed CSV input.
- HTML/script injection when rendering customer content.
- LLM timeout or provider outage.

## Controls
- Treat message content as data, not instructions.
- Delimit and label untrusted content in the prompt.
- Use explicit system policy and constrained output schema.
- Validate output server-side; reject unsafe or malformed drafts.
- Fail closed when safety is uncertain.
- Escape/render customer content as text; do not inject raw HTML.
- Keep API keys in environment variables.
- Set request size/time limits appropriate to the challenge.
- Do not log secrets or unnecessary customer data.
- Do not automatically send drafts.

## Safety validation
Prompt instructions are not sufficient. Combine:
1. Prompt-level policy.
2. Structured output validation.
3. Deterministic checks for explicit money/amount/date/refund/compensation promises.
4. Block-on-uncertainty behavior.
5. Adversarial tests.

A deterministic text checker is imperfect, especially across Persian, English, and Finglish. Document limitations and prefer blocking uncertain output over displaying a potentially unsafe draft.
