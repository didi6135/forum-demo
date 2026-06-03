# Task 06 - UI Partial / Complete States

Priority: P1

## Problem

The frontend progressively renders daily/search results, but progressive rendering is not the same as a truthful completeness model.

Users can see 44 results and assume that is all, even when Gmail reported 600+ possible matches.

## Current Evidence

Relevant files:

- `app/js/api.js`
- `app/js/tab-daily.js`
- `app/js/tab-search.js`

Current backend responses include some partial/debug fields, but the UI does not consistently enforce a complete/partial/running/failed state across Gmail-heavy views.

## Why This Violates The Rules

The rules require the app to stop presenting partial Gmail data as complete. Any partial result must be explicit.

## Fix Plan

1. Define a shared Gmail result status shape:

```js
{
  status: 'queued' | 'running' | 'partial' | 'complete' | 'failed',
  totalIds: 0,
  loaded: 0,
  pending: 0,
  errors: 0,
  message: ''
}
```

2. Update daily UI:
   - show job progress
   - show partial state until complete
   - show missing/error count

3. Update search UI:
   - show contact expansion warnings
   - show indexed/loaded/pending counts
   - rows can be `pending`, `ok`, or `error`

4. Disable or warn on actions that require complete metadata when metadata is pending.

5. Keep old debug logs for developer use, but add user-facing state for important failures.

## Edge Cases

- Backend reports `partial=true`.
- Backend returns `success=true` with missing rows.
- Job is complete with errors.
- User switches tabs mid-job.
- User reloads page.
- Network request fails while job is still running.

## User Test Plan

1. Start daily summary on a large day.
   - Expected: UI says it is still loading/indexing until complete.

2. Interrupt the process by refreshing.
   - Expected: UI resumes or clearly says it is resuming.

3. Trigger a partial backend result.
   - Expected: UI shows partial/missing count, not just a normal completed list.

4. Run a search with contact scope failure.
   - Expected: UI warns about contact expansion, not silent zero results.

## Done Criteria

- Daily/search cannot visually look complete while backend status is partial/running.
- Missing and error counts are visible.
- User can distinguish "no results" from "not done yet".
