# Data Model (logical)

The actual CSV schema must be discovered before mapping these fields.

## Normalized message
- message_id: stable source ID
- customer_id: stable customer ID
- subject: optional text
- body: customer text
- created_at: timezone-aware instant
- answered_at / answered indicator: derived from verified export field(s)
- category: one allowed category
- severity: at least high vs non-high
- order_ref: normalized `BZ-` reference or null
- duplicate_of: original message ID or null
- is_resend: boolean
- source/channel: optional
- language: fa/en/unknown as useful internally

## Analysis result
- total_unique_messages
- category_counts
- urgent_message_ids
- messages: one entry per input row

## Important
Do not invent a source field or assume an answer status. Record the actual mapping from CSV fields in DATASET_ANALYSIS.md. Keep internal models richer if needed, but serialize the required external contract.
