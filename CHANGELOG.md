# Changelog

## Activity history, learning memory and SLA accuracy

- Added persistent SQLite activity history for user actions, AI draft outcomes and system lifecycle/errors.
- Added a history screen with filters by actor type and details for model, language, duration and safety warnings.
- Added privacy-conscious approved-reply memory: approved/copy actions save a redacted style example; up to three recent same-language examples guide future Ollama drafts. This is prompt-context adaptation, not model fine-tuning.
- Added a batch SLA refresh API. The browser sends its current ISO timestamp and the backend applies the Tehran business calendar once per minute.
- Removed browser-side duplicate SLA arithmetic and standardized all dashboard timestamps to Asia/Tehran.
- Negative SLA values are rendered as overdue, never as time remaining.
- Added category filter, newest/oldest/urgent/category sorting, and search to the all-messages table.
- Added backend and frontend regression tests for the new behavior.

## 2026-11-13 — Live clock and overview category filters

- Added a live Tehran clock (HH:MM:SS) beside the Persian calendar date; it updates every second without API or LLM requests.
- Made the overview category breakdown interactive. Selecting a category highlights it and reveals the matching messages directly in the overview; selecting it again or using “حذف فیلتر” clears the filter.
- Kept the existing full messages page and its category/search/sort controls unchanged.

## All-message AI replies
- Added a per-message "پاسخ" action to the «همه پیام‌ها» table, so agents can request a draft for any message rather than only high-severity items in the attention queue.
- Added a focused reply dialog showing the customer message and an editable AI draft, with safe-generation warnings, copy/approval, and feedback logging.
- Draft generation remains click-to-request; it does not run automatically and does not send messages to customers.

## 2026-11-13 — Agent governance and project readiness

- Added root-level `AGENTS.md` and `CLAUDE.md` entry points with mandatory plan-before-code rules, source-of-truth hierarchy, protected business/API contracts, AI safety, privacy, testing and Definition of Done.
- Activated reusable agent roles, workflows and templates under `.agents/`; added a task-governance skill.
- Added project onboarding/state docs, governed task board, change-control/logging schema and agent handoff protocol.
- Added explicit follow-up tasks for frontend build/tests, Docker runtime, browser E2E, adversarial LLM review, classifier evaluation and persistence recovery.
- Removed local `.env` from the distributable package and added ignore rules for secrets and runtime data. `.env.example` remains the setup template.
- No application behavior or business logic changed in this governance-only update.


## 2026-11-13 — Multilingual and resilient AI reply generation

- Improved dominant-language detection for Persian, English, Finglish and mixed Persian/Latin messages; emoji, URLs, product codes and non-Persian Unicode no longer cause language detection to default incorrectly.
- Added safe generic editable fallback drafts when Ollama is not configured, unavailable, times out, errors, returns empty/unsafe output or responds in the wrong language.
- Added browser-side fallback when the draft API itself cannot be reached, so agents can continue editing and copying a response instead of losing the workflow.
- Reduced the default model timeout from 180 to 35 seconds (configurable); bounded provider connection timeout.
- Added explicit AI-vs-fallback activity logging without recording customer message content.
- Kept human approval, copy-only behavior and unsafe-commitment checks; no automatic customer messaging.


## 2026-11-13 — Human-reviewed manual replies

- Added **پاک کردن و نوشتن دستی** to both the attention queue reply workspace and the all-messages reply dialog.
- Clearing an AI/fallback draft switches the editor to an empty operator-authored reply; it never reuses or sends the discarded AI text.
- Manual replies can be edited, copied and saved as sanitized style examples for future draft context.
- Manual reply copy and draft-clear actions are logged separately from AI draft approval; reply text is not included in activity metadata.
- Copy is disabled until the operator enters non-empty text. No automatic sending was added.


## 2026-11-13 — Integrated dashboard behavior and multilingual AI

- Kept the live Tehran clock in the top header and simplified its display to hours and minutes (HH:MM), refreshed every second alongside the Persian date.
- Ensured the All Messages table renders every filtered message row with its own reply action; removed the previous 500-row rendering cap.
- Updated AI instructions to identify the customer's language and reply in that language for any language supported by the configured model; Finglish still receives Persian. Removed the Persian/English-only output mismatch rejection.
- Changed overview category selection to latest-selection-wins: selecting another category replaces the prior category instead of toggling/accumulating selections.
- Preserved AI fallback, editable manual replies, human review, activity history and copy-only/no-auto-send behavior.
- Verification: 42 backend tests pass; Python compile check passes. Frontend dependency installation timed out, so production build/browser runtime are not claimed as verified.

## 2026-11-13 — Dashboard integration correction
- Rebuilt the deliverable from the user's uploaded Human Review + Manual Replies source, rather than from the earlier incomplete integrated archive.
- Kept the live Tehran clock in the top bar at hour-and-minute precision.
- Category clicks now replace the active category directly instead of toggling a prior selection back to all.
- Added explicit Docker no-cache rebuild and browser hard-refresh instructions to prevent an older frontend image from continuing to serve the previous dashboard.
- Confirmed the latest UI source includes per-message reply actions, multilingual model-directed drafting, AI fallback, and manual human-reviewed replies.

## 2026-11-13 — Attention List strict TypeScript build fix

- Fixed `selectedDraft` to normalize missing per-message draft state to an empty string, preventing TS18048 errors in the manual-reply textarea and character counter.
- Manual reply behavior remains unchanged: clearing an AI draft opens an empty editor and copy remains disabled until text is entered.
- Backend regression suite: 43 passed. Full frontend build could not be rerun because `npm ci` timed out and the local `node_modules` is incomplete; Docker/browser runtime remains unverified.
