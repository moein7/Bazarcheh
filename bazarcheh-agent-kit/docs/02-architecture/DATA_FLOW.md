# Data Flow

## Analysis
1. User selects CSV.
2. Frontend uploads file to analysis endpoint (discover existing route; do not invent contract without documenting it).
3. Backend validates and parses CSV.
4. Backend normalizes relevant fields.
5. Backend identifies resends while retaining all input rows.
6. Backend extracts order references.
7. Backend classifies category and severity and determines answered status.
8. Backend calculates business-time elapsed/remaining at supplied analysis time.
9. Backend returns result; CLI serializes the required JSON contract.
10. Frontend displays metrics and attention rows.

## Live update
1. Frontend stores stable analysis results and message timestamps.
2. Browser clock updates at least every 60 seconds.
3. Frontend recalculates business minutes left and urgency using deterministic calendar logic.
4. Frontend re-sorts attention list and updates urgent count.
5. No upload, backend analysis, or LLM call is triggered.

## Draft
1. Sara clicks Draft reply on an attention row.
2. Frontend sends required request to same-origin `/api/draft`.
3. Backend makes one bounded LLM request.
4. Backend validates language and safety constraints.
5. Backend returns a safe draft or blocked result.
6. Sara edits draft.
7. Approval copies the final text; it does not send it.
