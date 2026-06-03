# Task 02 - Daily Summary Refactor

Priority: P0

## Problem

Daily summary is slow and incomplete because it uses `handleListInboxEmails`, which performs Gmail metadata fanout in the foreground.

## Current Evidence

Relevant files:

- `app/js/tab-daily.js`
- `app/js/api.js`
- `apps_script_unified/10_inbox.gs`

Current flow:

1. `tab-daily.js` calls `Api.listDailyEmails`.
2. `api.js` pages through `listInboxEmails`.
3. `handleListInboxEmails` builds a daily Gmail query.
4. It lists many message IDs.
5. It fetches metadata for those IDs immediately.

## Why This Violates The Rules

The rules explicitly say the daily summary must not rebuild Gmail metadata from scratch in one Apps Script web request. It must use a resumable job/index layer.

## Fix Plan

After Task 01 exists, change daily summary to use it.

Backend:

1. Add daily-specific wrapper actions:
   - `startDailySummaryJob`
   - `processDailySummaryJob`
   - `getDailySummaryJobStatus`
   - `readDailySummaryPage`

2. Use `buildDailyGmailQuery_()` only to define the query.

3. Do not call `handleListInboxEmails` for daily summary anymore.

Frontend:

1. Replace `Api.listDailyEmails` internals with job flow:
   - start or resume job
   - poll/process chunks
   - read available indexed pages
   - render progress

2. UI states:
   - `loading IDs`
   - `indexing metadata`
   - `partial`
   - `complete`
   - `failed`

3. Keep existing progressive rendering, but attach it to job progress rather than partial backend pages.

## Edge Cases

- No messages today.
- Only sent messages today.
- Only inbox messages today.
- 600+ messages today.
- Gmail throttling during metadata processing.
- Browser refresh during processing.
- User switches tabs while processing.
- Duplicate message IDs across inbox/sent query.
- Messages missing `Date`.
- Messages deleted after listing.
- Apps Script execution timeout during a chunk.

## User Test Plan

1. Open Daily Summary on a normal day.
   - Expected: progress appears and rows start filling.

2. Wait until status is complete.
   - Expected: final count equals the backend `totalIds` minus explicit unrecoverable errors.

3. Reload the browser mid-run.
   - Expected: the same job resumes or the UI can recover without starting from zero unnecessarily.

4. Test a day/query with no messages.
   - Expected: clean empty state, no error.

5. Test a heavy day with hundreds of messages.
   - Expected: no Gmail bandwidth exception kills the whole result.

6. Compare counts:
   - Gmail web search for the daily query.
   - App backend `totalIds`.
   - UI final displayed count.

## Done Criteria

- `tab-daily.js` no longer depends on foreground `listInboxEmails` for full daily data.
- Daily summary exposes complete/partial/error truthfully.
- Missing Gmail rows are visible as counts/status, not silently omitted.
