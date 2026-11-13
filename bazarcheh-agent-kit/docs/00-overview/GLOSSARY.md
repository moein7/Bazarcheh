# Glossary

- **Message**: One row in the supplied export.
- **Resend / duplicate**: Same customer resending the same normalized text; retained in row-level output but counted once for unique analytics.
- **Unique message**: A message that is not a resend.
- **Category**: One of the six support topics.
- **Severity**: Impact level; high severity is independent of category.
- **Answered**: A message for which the export provides evidence that support has replied. Exact source field must be established during discovery.
- **Business minute**: A minute within Saturday–Wednesday, 09:00–17:00 Asia/Tehran, excluding listed public holidays.
- **SLA**: Two business hours (120 business minutes).
- **Urgent**: High-severity, unanswered, non-resend message at or beyond 120 elapsed business minutes.
- **Needs attention**: Every high-severity, unanswered, non-resend message, including not-yet-overdue messages.
- **Draft**: AI-generated suggested reply, editable by Sara, never automatically sent.
- **Export time**: Timestamp in `EXPORT_INFO.txt`, used as reference `now` when generating evaluation predictions.
