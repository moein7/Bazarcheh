# AI reply workspace

The dashboard offers on-demand reply drafting from both the attention queue and **همه پیام‌ها**. A user explicitly clicks the reply action; no draft is generated during CSV analysis or in the background.

## Draft behavior

1. The backend detects the dominant customer language: Persian, English or Finglish (Finglish receives Persian). Mixed Persian/Latin messages are supported; URLs, product codes, emoji, punctuation and other Unicode characters do not cause the request to fail.
2. If Ollama is configured and available, the backend requests a draft and validates it before returning it.
3. If Ollama is missing, times out, errors, returns empty/unsafe text or replies in a mismatched language, the backend returns a generic editable fallback in the detected language with `source: "fallback"` and a warning. It does not return a blank draft.
4. If the browser cannot reach the draft API at all, it creates the same kind of local generic fallback so the support agent can continue editing.
5. The UI clearly shows the fallback warning; the text remains editable and can be copied after human review.
6. Approval copies the edited text and records sanitized style feedback only. No message is sent to a customer.

## Safety and privacy

- Customer text is untrusted data and delimited in the model prompt. Prompt-injection content is not followed.
- Model output is screened for refund, money, compensation, amount, price, date and timeline commitments. Unsafe model output is discarded; the generic fallback is used instead.
- The generic fallback makes no promises, does not claim work has been performed and asks for additional details where appropriate. It is intentionally generic and must be reviewed/edited by the support agent.
- The model timeout defaults to 35 seconds (configurable with `LLM_TIMEOUT_SECONDS`); provider connection timeout is bounded separately. A slow or failed model request does not crash the API process.
- Activity logs record whether the result came from AI or fallback and a short warning, but never store the full customer message, prompt or raw model transcript.
- The workflow remains human-in-the-loop. Nothing is sent automatically.

Language detection is heuristic and supports Persian, English and common Finglish markers. Unsupported/ambiguous scripts default to an English fallback rather than blocking the support workflow. Safety screening is a risk-reduction layer, not a mathematical guarantee; human review remains mandatory.


## Operator-authored manual replies

Operators can discard an AI or fallback draft using **پاک کردن و نوشتن دستی** and continue in a blank editor. The manual editor is independent of the discarded suggestion. Copy remains an explicit human action; it does not send a message to the customer. Copied manual replies are sanitized before being retained as style examples, and the activity log records the manual action without storing reply text.
