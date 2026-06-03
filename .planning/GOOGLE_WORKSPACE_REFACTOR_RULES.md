# Google Workspace / Apps Script Refactor Rules

Last reviewed: 2026-04-28

This document defines the rules for refactoring the Gmail, Drive, Contacts, and daily-summary parts of the application. It is based on official Google documentation and on the current production failure mode:

```text
חריגה במכסת רוחב הפס ... gmail/v1/users/me/messages/{id}?format=metadata ...
יש להאט את קצב העברת הנתונים.
```

## Executive Decision

The current design must be refactored. The failure is architectural, not a small bug.

The app currently performs a foreground `messages.list` followed by many `messages.get(format=metadata)` calls in one Apps Script web request. Even when the requests use `fields`, each message still requires an API call, consumes Gmail quota, transfers metadata, and can trigger Gmail/Apps Script bandwidth throttling.

Recommended direction:

1. Move the Apps Script project to a standard Google Cloud project now.
2. Stop trying to return all daily-summary data directly from Gmail in one web request.
3. Build a Gmail sync/index layer:
   - Minimum viable path: Apps Script time-sliced background jobs plus persistent storage.
   - Preferred path for reliability: Google Cloud backend, for example Cloud Run + Firestore + Cloud Tasks / Scheduler, with Gmail API OAuth.

Important: moving to Google Cloud Console / a standard Cloud project improves OAuth control, API enablement, and logging. It does not remove Gmail API per-user limits by itself.

## Official Constraints We Must Design Around

### Apps Script limits

From Google Apps Script quotas:

- Apps Script services throw exceptions and stop execution when quotas or limitations are exceeded.
- Quotas are per user and reset 24 hours after the first request.
- Gmail read/write through Apps Script has daily limits: 20,000/day for consumer accounts and 50,000/day for Workspace accounts.
- URL Fetch calls are limited: 20,000/day for consumer accounts and 100,000/day for Workspace accounts.
- Script runtime is 6 minutes per execution.
- Simultaneous executions per user are limited to 30.
- Properties are not a database: 9 KB per value and 500 KB total per property store.

Source: https://developers.google.com/apps-script/guides/services/quotas

### Gmail API limits

From Gmail API usage limits:

- Gmail enforces both per-project and per-user rate limits.
- Per-project rate limit: 1,200,000 quota units/minute.
- Per-user rate limit: 15,000 quota units/minute.
- `messages.list` costs 5 units.
- `messages.get` costs 5 units.
- `messages.attachments.get` costs 5 units.
- `messages.send` costs 100 units.
- `history.list` costs 2 units.

Source: https://developers.google.com/workspace/gmail/api/reference/quota

Implication: the theoretical quota-unit number is not the only limiter. The current error is a bandwidth/rate throttle, so a burst of many `messages.get` calls can fail even before the quota math looks exhausted.

### Gmail batch requests

Gmail batch requests reduce HTTP connection overhead, but they do not reduce quota cost.

Rules from Google:

- A single batch can contain up to 100 inner calls.
- Google explicitly warns that larger batch sizes are likely to trigger rate limiting.
- Batches larger than 50 requests are not recommended.
- A batch of `n` requests counts as `n` requests for usage limits.

Source: https://developers.google.com/workspace/gmail/api/guides/batch

Implication: batching is not a fix for daily summary. It can make transport cleaner, but it cannot be used as a license to fetch hundreds of messages synchronously.

### Gmail sync model

Google's sync guide describes the correct pattern:

- Full sync: call `messages.list`, then fetch/cache message data.
- Store the latest `historyId`.
- Partial sync: use `history.list` with the previous `historyId`.
- If history is unavailable or expired, perform a new full sync.

Source: https://developers.google.com/workspace/gmail/api/guides/sync

Implication: our daily summary should read from a local index/cache most of the time, not repeatedly rebuild Gmail metadata from scratch.

### Gmail performance rules

Google's performance guidance:

- Use gzip to reduce bandwidth.
- Use partial responses with `fields`.
- Use pagination to keep results manageable.

Source: https://developers.google.com/workspace/gmail/api/guides/performance

Implication: `fields` is necessary but not sufficient. A partial response still has to be fetched per message unless the data is already indexed.

### Apps Script CacheService is not persistent storage

CacheService constraints:

- Key max length: 250 characters.
- Value max size: 100 KB.
- Default expiration: 10 minutes.
- Max expiration: 6 hours.
- Item cap: 1,000 cached items, with eviction behavior when exceeded.
- Expiration is a suggestion; data can be removed earlier.

Source: https://developers.google.com/apps-script/reference/cache/cache

Implication: CacheService may speed up repeated clicks, but it must not be the source of truth for Gmail metadata or daily-summary state.

### Standard Google Cloud project

Every Apps Script project already has an associated Cloud project. Google recommends a standard Cloud project for complex, commercial-quality, publishable, or manually managed applications.

Benefits:

- Direct access to Cloud Console settings.
- Manual API enablement.
- OAuth client verification/control.
- Better logs and error reporting.
- Required for several advanced integration scenarios.

Source: https://developers.google.com/apps-script/guides/cloud-platform-projects

Implication: we should use a standard Cloud project even if we keep Apps Script, but we should not expect it to solve Gmail API throttling by itself.

### Gmail push notifications

If we move to a backend, Gmail can notify a Cloud Pub/Sub topic when the mailbox changes.

Important rules:

- `watch` must be renewed at least every 7 days; Google recommends daily renewal.
- Notifications contain a history ID; use `history.list` to fetch changes.
- Max notification rate is one event per second per watched user.
- Notifications can be delayed or dropped, so fallback polling/history sync is still required.

Source: https://developers.google.com/workspace/gmail/api/guides/push

Implication: Pub/Sub is useful for a Cloud backend, but it does not remove the need for durable sync state.

## Hard Architecture Rules

### Rule 1: No foreground bulk Gmail metadata fetch

A web request must not fetch metadata for hundreds of Gmail messages.

Forbidden:

- `messages.list` for 500 IDs followed by `fetchAll`/loop over `messages.get`.
- fallback that sequentially retries every failed message in the same request.
- returning partial daily-summary data as if it is complete.

Allowed:

- Return a first page quickly.
- Start or resume a background sync job.
- Return `jobId`, `loadedCount`, `totalEstimate`, `partial: true`, and a clear status.

### Rule 2: Gmail data must have a persistent index

Daily summary and search must read from an app-owned index first.

Minimum indexed fields:

- Gmail message ID
- thread ID
- history ID
- internal date or parsed date
- label IDs
- subject
- from / fromEmail
- to / cc
- snippet
- hasAttachments
- lastSyncedAt

Do not use CacheService as this index.

Acceptable storage options:

- Short-term Apps Script refactor: Google Sheet or Drive JSON shards, only if volume remains small and jobs are chunked.
- Preferred: Firestore or another backend datastore.

### Rule 3: Background jobs must be resumable

Any operation over many Gmail messages must be split into chunks.

Each job needs:

- stable `jobId`
- query/date range
- `pageToken`
- pending message IDs
- completed count
- failed message IDs
- current backoff state
- `startedAt`, `updatedAt`, `doneAt`
- terminal state: `done`, `partial`, `failed`, `cancelled`

Apps Script implementation:

- Use time-sliced executions.
- Use `LockService` per job/user.
- Persist job state outside CacheService.
- Stop before 6 minutes.
- Resume with a trigger or explicit frontend poll action.

Cloud implementation:

- Use Cloud Tasks / Scheduler / Pub/Sub.
- Store state in Firestore.
- Workers enforce per-user Gmail rate limits.

### Rule 4: Rate limiting must be real, not cosmetic

Current `GmailGateway.spend()` is not enough because it only approximates Gmail quota units. It does not measure actual transfer bandwidth throttling.

New limiter rules:

- One Gmail metadata worker per user/mailbox.
- Conservative initial limit for `messages.get`: 2-5 requests/sec per user.
- No `fetchAll` bursts against Gmail metadata until proven safe.
- On 403/429/bandwidth/rate errors:
  - stop the current chunk;
  - persist state;
  - back off exponentially;
  - let the next job resume later.
- Do not retry hundreds of messages immediately inside the same HTTP request.

### Rule 5: Pagination is mandatory everywhere

Every endpoint that can return many items must support:

- `pageSize`
- `cursor` or `pageToken`
- `hasMore`
- `totalEstimate` when available
- `partial`
- progress/debug metadata

No endpoint should promise "all data" unless it is reading from a completed local index.

### Rule 6: Daily summary must become a job

Daily summary flow should be:

1. `startDailySummaryJob(dateRange)`
   - builds Gmail query
   - lists IDs in pages
   - stores job state
   - returns `jobId`
2. `processDailySummaryJob(jobId)`
   - fetches metadata in small chunks
   - persists each message
   - pauses on throttling
3. `getDailySummaryJob(jobId)`
   - returns progress and currently loaded rows
4. `finalizeDailySummary(jobId)`
   - only runs AI/doc generation after the data is complete or explicitly marked partial by the user.

The UI must show progress and should not hide partial failures.

### Rule 7: Search must not rebuild metadata repeatedly

Search flow should be:

1. Build Gmail query.
2. Search contacts only when the query is recipient/person-oriented.
3. Use indexed metadata for display.
4. For missing IDs, enqueue enrichment.
5. Show partial results immediately and continue loading.

### Rule 8: Error handling must preserve data integrity

Every Gmail response must include:

- `success`
- `partial`
- `returned`
- `requested`
- `failed`
- `retryAfterMs` when known
- `jobId` when work continues in background
- `debug.timings`

Frontend rule:

- Never display "loaded all" unless `partial === false` and the backend says the job is complete.

### Rule 9: Scope and deployment are explicit

Apps Script must use a manifest (`appsscript.json`) with explicit scopes.

Required current scopes:

- Gmail read/modify/send/settings
- Drive
- Docs
- Sheets
- Contacts / Other Contacts
- UrlFetch external request

After scope changes:

- run a trigger/test function manually;
- approve OAuth;
- deploy a new Web App version.

### Rule 10: Test endpoints are required

Before relying on a deployment, Apps Script must expose manual test functions for:

- Gmail metadata single-message fetch
- Gmail list + small metadata chunk
- Drive folder create/read/write
- People contacts scopes
- daily-summary job creation
- daily-summary job resume

Test endpoints must return JSON diagnostics and must not mutate production data unless explicitly named `writeTest`.

## Should We Move To Google Cloud?

### Short answer

Yes for project management immediately; yes for Gmail sync if the product requirement is reliable "all data" for hundreds of messages.

### What "Google Cloud Console" solves

Moving Apps Script to a standard Cloud project solves:

- OAuth clarity
- API enablement
- logs and error reporting
- long-term project control
- easier migration to Cloud Run later

It does not solve:

- Gmail per-user limits
- Gmail bandwidth/rate throttling
- Apps Script 6-minute execution limit
- lack of durable job queue/database inside Apps Script

### Recommended migration path

Phase 1: Stabilize Apps Script.

- Add explicit test functions.
- Remove foreground bulk Gmail metadata fetch.
- Convert daily summary into a resumable job.
- Store job/index state persistently.

Phase 2: Attach a standard Cloud project.

- Enable Gmail, Drive, People, Docs, Sheets APIs.
- Configure OAuth consent.
- Use Cloud Logging/Error Reporting.

Phase 3: Move Gmail sync/index to Cloud.

- Cloud Run API service.
- Firestore metadata index.
- Cloud Tasks queue for Gmail message enrichment.
- Cloud Scheduler for daily sync.
- Optional Gmail watch + Pub/Sub for near-real-time updates.
- Apps Script remains only for Docs/Drive actions if that is simpler, or is retired completely.

## Refactor Acceptance Criteria

The refactor is not complete until:

- Daily summary can process 600+ matching messages without foreground timeout.
- Quota/rate errors pause and resume instead of dropping data.
- The UI shows exact loaded/failed/remaining counts.
- Re-clicking daily summary does not re-fetch already indexed metadata.
- Search and daily summary share the same Gmail metadata index.
- CacheService is used only as an optimization.
- A single source of truth exists for Gmail sync state.
- Every Google API action has a diagnostic test function.

