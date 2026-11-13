# API and CLI Contracts

## Draft API — fixed

`POST /api/draft`
`Content-Type: application/json`

Request:
```json
{
  "message_id": "M1a2b3c4d",
  "customer_id": "C123",
  "subject": "...",
  "body": "..."
}
```

Success:
```json
{
  "message_id": "M1a2b3c4d",
  "draft": "...",
  "language": "fa",
  "blocked": false,
  "warnings": []
}
```

Blocked:
```json
{
  "message_id": "M1a2b3c4d",
  "draft": "",
  "language": "fa",
  "blocked": true,
  "warnings": ["Reason"]
}
```

Rules:
- Same-origin dashboard route `/api/draft`.
- `language` is exactly `fa` or `en`.
- LLM unavailable: HTTP 200, `blocked: true`, empty draft, warning; bounded timeout.
- Never send the message.
- Never return unsafe partial content as a draft.

## CLI — fixed

```bash
docker compose run --rm backend python -m app.cli analyze \
  --input /data/input.csv --output /data/out.json \
  --now 2026-10-26T10:30:00Z
```

Top-level output:
```json
{
  "total_unique_messages": 0,
  "category_counts": {
    "delivery": 0,
    "payment": 0,
    "refund": 0,
    "product_quality": 0,
    "account": 0,
    "other": 0
  },
  "urgent_message_ids": [],
  "messages": [
    {
      "message_id": "...",
      "category": "other",
      "is_urgent": false,
      "order_ref": null,
      "duplicate_of": null
    }
  ]
}
```

The challenge's exact schema takes precedence if additional fields already exist, but required fields and semantics must remain. `messages` contains one row per input message. `duplicate_of` identifies the original or is null.

## Vite proxy
Use the existing app configuration if possible. Ensure `/api/draft` reaches the backend while browser requests remain same-origin. Document actual port/service mapping.
