# Existing Issues Register

| Issue ID | Requirement | Description | Evidence / reproduction | Severity | Correction | Status |
|---|---|---|---|---|---|---|
| AUD-001 | REQ-SLA-001..007 | SLA implementation counted Monday-Friday in UTC and ignored Tehran holidays. | `backend/app/sla.py` used UTC weekdays; the challenge defines Saturday-Wednesday in Tehran. | Critical | Replaced with Asia/Tehran business-minute arithmetic and the supplied Jalali holiday set; added calendar boundary tests. | Fixed |
| AUD-002 | REQ-SLA-008..010, REQ-UI-004..006 | Attention list showed only overdue messages and used elapsed wall-clock minutes. | `frontend/src/components/AttentionList.tsx` accepted only urgent IDs and subtracted timestamps directly. | High | Include all unanswered high-severity canonical rows, sort by business minutes left, and recalculate in-browser. | Fixed |
| AUD-003 | REQ-AI-001, REQ-AI-004 | Analysis prefetched AI drafts, spending quota before the user clicked. | `backend/app/analysis.py` called `prefetch_drafts`; API enabled it. | High | Removed prefetch; generation is click-only. | Fixed |
| AUD-004 | REQ-AI-002..005 | Draft generation had no system-role safety boundary, always returned English, and did not fail closed. | `backend/app/drafts.py` sent one user prompt and hard-coded `language: en`. | Critical | Added system/user role separation, language detection, timeout/error blocking, and conservative unsafe-output checks. | Fixed |
| AUD-005 | REQ-DATA-005..006 | Persian digits in order references were not normalized. | `backend/app/orders.py` matched ASCII digits only. | Medium | Normalize Persian/Arabic-Indic digits before extraction; added regression test. | Fixed |
| AUD-006 | REQ-DATA-010 | Jalali-formatted `answered_at` values were parsed as missing. | Sample export includes values such as `۱۴۰۵/۰۵/۲۳ ۱۱:۵۲`; ISO-only parser coerced them to NaT. | High | Added Jalali timestamp conversion to UTC; added regression test. | Fixed |
| AUD-007 | REQ-UI-002, NFR-003 | Message body was rendered using `dangerouslySetInnerHTML`. | `frontend/src/components/MessagesTable.tsx` injected customer-controlled text as HTML. | Critical | Render message body as escaped React text with `dir=auto`. | Fixed |
| AUD-008 | REQ-SLA-005 | Compose overrode the SLA with 24 business hours. | `docker-compose.yml` set `URGENT_SLA_BUSINESS_HOURS: "24"`. | Critical | Removed the override; default is the required two hours. | Fixed |

## Remaining verification limitation

The backend test suite and CLI were run successfully. Docker is unavailable in the implementation environment and npm package installation could not complete because package registry access was unavailable; therefore the container build and frontend production bundle remain unverified here.
