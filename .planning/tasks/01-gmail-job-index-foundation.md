# Task 01 - Gmail Job / Index Foundation

Priority: P0

## Problem

Daily summary and Gmail search both fetch Gmail metadata in large foreground bursts. This causes Gmail bandwidth/rate throttling and partial results.

The missing foundation is a shared resumable Gmail job/index layer.

## Current Evidence

Current hotspots:

- `apps_script_unified/10_inbox.gs`
  - `handleListInboxEmails`
  - `UrlFetchApp.fetchAll(requests)`
  - direct fallback metadata fetches

- `apps_script_unified/20_search.gs`
  - `handleSearchGmail`
  - `fetchGmailMetadataPage_`
  - `UrlFetchApp.fetchAll(requests)`

Frontend callers:

- `app/js/api.js`
  - `listDailyEmails`
  - `searchGmail`

## Why This Violates The Rules

The rules say not to return all daily-summary/search data directly from Gmail in one web request. Gmail sync should use local indexed data, resumable jobs, and persistent state outside CacheService.

## Fix Plan

Create a shared Apps Script module, for example:

- `apps_script_unified/40_gmail_jobs.gs`

Core actions:

1. `startGmailMetadataJob`
   - inputs:
     - `jobType`: `daily` or `search`
     - `query`
     - `pageSize`
     - optional `existingJobId`
   - creates a durable job record
   - lists message IDs in small controlled pages
   - stores message IDs and job state

2. `processGmailMetadataJob`
   - inputs:
     - `jobId`
     - `maxItems`
   - fetches metadata for a small number of pending IDs
   - stores each metadata result
   - records errors without dropping rows
   - returns progress

3. `getGmailMetadataJobStatus`
   - returns:
     - total IDs
     - fetched count
     - error count
     - pending count
     - status: `queued`, `running`, `partial`, `complete`, `failed`

4. `readGmailMetadataJobPage`
   - inputs:
     - `jobId`
     - `offset`
     - `limit`
   - returns indexed metadata rows plus row statuses

## Storage Decision

For Apps Script MVP, use a durable store, not CacheService:

Preferred MVP options:

1. Spreadsheet-backed index:
   - simplest to inspect manually
   - okay for MVP and debugging
   - slower than a real DB

2. Drive JSON shards:
   - fewer spreadsheet row operations
   - easier to store larger job payloads
   - harder to inspect

Do not use:

- CacheService as the source of truth
- PropertiesService for message metadata

Preferred long-term option:

- Cloud Run + Firestore + Cloud Tasks

## Metadata Row Shape

Each indexed message should store:

- `messageId`
- `threadId`
- `subject`
- `from`
- `fromEmail`
- `to`
- `cc`
- `date`
- `rfcMessageId`
- `snippet`
- `labelIds`
- `sizeEstimate`
- `sourceQuery`
- `status`: `pending`, `ok`, `error`
- `errorCode`
- `errorMessage`
- `updatedAt`

## Edge Cases

- 0 message IDs.
- 1 message ID.
- 600+ message IDs.
- Gmail throttles after some successful metadata fetches.
- Apps Script execution stops before job is complete.
- User reloads page while job is running.
- Same query is started twice.
- A message is deleted between list and metadata fetch.
- Message metadata JSON is malformed.
- Date header is missing or invalid.

## User Test Plan

1. Start a job with a query that returns no results.
   - Expected: status becomes `complete`, total `0`.

2. Start a job with a query that returns 1 result.
   - Expected: one row becomes `ok`.

3. Start a daily query with hundreds of results.
   - Expected: job progresses in chunks, never claims complete until all IDs are processed.

4. Reload the browser while a job is running.
   - Expected: the job can be resumed/polled using `jobId`.

5. Trigger processing repeatedly.
   - Expected: already completed rows are not duplicated.

6. Force a Gmail throttle if possible by lowering chunk size/retry settings in test mode.
   - Expected: rows are marked `error` or `pending`, not silently dropped.

## Done Criteria

- No large Gmail metadata fanout occurs in one web request.
- Job state survives CacheService eviction and browser reload.
- Missing/error messages are counted and visible.
- Daily summary can be migrated to this layer without changing search yet.
