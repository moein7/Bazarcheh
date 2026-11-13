# Bazarcheh — Engineering Write-up

## 1. Problem Understanding

I understood the core problem as building a reliable support-triage workflow, not simply classifying messages. The system must identify the customer's primary issue, surface urgent unanswered messages using the correct business-hours SLA, preserve the original export data, and help Sara prepare safe responses without allowing AI to communicate with customers autonomously.

## 2. Assumptions

- `severity_hint` is the source system's severity signal; it is not a substitute for message category.
- A populated `answered_at` means the message has been handled, even if the response was late.
- Resends are identified using the same customer and normalized, non-empty message body. Incomplete identities are not automatically merged.
- SLA calculations use Tehran business hours, Saturday–Wednesday, 09:00–17:00, excluding configured holidays.
- Evaluation urgency uses the export timestamp `2026-04-15T07:00:00Z` from `EXPORT_INFO.txt`, rather than the current machine time.

## 3. Existing Problems and How I Found Them

I started by comparing the starter implementation against the CLI contract, SLA requirements, supplied CSV schema, and expected dashboard behavior. I then traced the relevant code paths and used regression tests and sample records to verify the findings.

- **Incorrect SLA configuration:** The Compose configuration used a 24-hour threshold instead of the required two business hours. I compared the configuration with the stated SLA requirement.
- **Incorrect business-time calculations:** Weekday and timezone handling did not correctly represent Tehran working hours and holidays. I checked messages around opening, closing, weekends, and timezone boundaries.
- **Incomplete urgency detection:** The attention queue could omit high-severity messages that needed attention before becoming overdue. I traced the urgency filtering and compared it with the intended queue behavior.
- **Incorrect answered-message handling:** An answer recorded after the reference time was initially treated as unanswered. I reproduced this with a message whose `answered_at` was populated and corrected the rule.
- **Duplicate and localization issues:** I inspected repeated CSV records and messages containing Persian digits and timestamps to identify inconsistent normalization.
- **Unsafe and unreliable draft generation:** I traced the draft endpoint and UI interaction to ensure generation happens only on an explicit operator action and that provider failures do not stop the workflow.

## 4. What I Cut and Why

I did not use an LLM to classify every imported message. Sequential model calls across hundreds of records introduced unnecessary latency and could cause request timeouts. Instead, classification uses deterministic, auditable rules, while Ollama is reserved for on-demand reply suggestions.

I also excluded automatic customer messaging and pre-generated replies. These features increase operational and safety risk without being necessary for the core triage workflow.

## 5. Where AI Misled Me

An early urgency implementation treated a response recorded after the evaluation reference time as if no response existed. This contradicted the requirement that any populated `answered_at` means handled. I corrected the logic after checking the requirement against concrete records.

I also learned not to treat plausible AI-generated explanations as proof of correctness: implementation decisions must be checked against the data, requirements, and executable tests.

## 6. Classification Quality

The classifier uses deterministic multilingual keyword rules and the supplied `severity_hint` signal. It produces one of the supported categories and an urgency boolean for each exported message.

The CLI successfully processed the supplied evaluation export, and the generated predictions were checked for the required header, row count, unique message IDs, valid categories, and boolean values. The predictions were also compared with a fresh CLI run.

However, no labeled ground-truth category dataset was supplied. Therefore, I cannot honestly claim a measured accuracy, precision, recall, or F1 score. The current implementation is a predictable baseline, not a statistically validated classifier. A labeled review set and per-category evaluation would be the next step.

## 7. AI Reply Safety for Sara

AI replies are generated only when an operator explicitly requests them. Customer messages are treated as untrusted input, not instructions. The prompt prohibits invented actions, unsupported promises, and unauthorized commitments.

The backend checks generated text for potentially unsafe commitments and language mismatches. Provider errors, timeouts, and rejected drafts fall back to editable responses rather than blocking the operator.

Sara remains in control: she can edit, clear, or replace a draft with a completely manual response. Replies are not automatically sent to customers. These safeguards reduce risk but cannot guarantee that every generated sentence is safe; human review is required before use.

## 8. Verification and Limitations

The CLI was run against the supplied evaluation export. The resulting `predictions.csv` contains the required columns and one prediction per input row. Backend regression tests passed in the latest reported test run.

The frontend production build and full Docker/browser startup must be verified in the target environment before claiming the one-command deployment requirement is complete. Classification accuracy also remains unmeasured without labeled ground truth.
