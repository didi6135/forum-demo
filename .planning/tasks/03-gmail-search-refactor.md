# Task 03 - Gmail Search Refactor

Priority: P0

## Problem

Gmail search is still slow and incomplete because it repeats the same metadata fanout pattern as daily summary.

## Current Evidence

Relevant files:

- `app/js/tab-search.js`
- `app/js/api.js`
- `apps_script_unified/20_search.gs`
- `apps_script_unified/10_inbox.gs` for contact expansion

Current flow:

1. User searches in `tab-search.js`.
2. `Api.buildGmailQueryWithContacts` may expand the query.
3. `Api.searchGmail` calls Apps Script.
4. `handleSearchGmail` lists IDs and fetches metadata immediately.

## Why This Violates The Rules

Search can return hundreds of results. Fetching metadata for all returned IDs in foreground requests triggers the same Gmail bandwidth throttle.

## Fix Plan

After daily summary is stable on the job/index layer, migrate search.

Backend:

1. Keep `handleSearchGmail` only as a compatibility wrapper at first.
2. Add search job actions:
   - `startGmailSearchJob`
   - `processGmailSearchJob`
   - `getGmailSearchJobStatus`
   - `readGmailSearchPage`

3. Store query, expanded query, contact expansion debug, and message ID list in the job state.

4. Metadata rows should be read from shared Gmail index when available and fetched only for missing rows in chunks.

Frontend:

1. `tab-search.js` starts a job and renders available indexed rows.
2. Rows with missing metadata show `pending`.
3. Contact expansion errors should appear as a warning, not as a silent search miss.
4. Existing Drive upload flow must only allow selected rows with usable message IDs.

## Edge Cases

- Search query returns 0 results.
- Search query returns 600+ results.
- Query is invalid Gmail syntax.
- Contact search fails due to missing People scope.
- Contact expansion returns many emails.
- Hebrew name search.
- Exact email search.
- User starts a second search while first job is running.
- User uploads selected search results before all metadata is complete.
- Message is deleted after search ID listing.

## User Test Plan

1. Search for an exact email address.
   - Expected: query runs and rows eventually become complete.

2. Search for a Hebrew contact name.
   - Expected: contact expansion appears in debug/warning info and Gmail query uses matching emails.

3. Search a broad term that returns hundreds of messages.
   - Expected: UI shows progress and does not drop rows silently.

4. Disable or remove People scope in a test deployment.
   - Expected: UI warns that contact expansion failed, but Gmail search still runs with the original query.

5. Start a new search while old one is still processing.
   - Expected: UI binds to the new job and does not mix rows from both jobs.

6. Select completed rows and upload to Drive.
   - Expected: upload flow receives valid message IDs.

## Done Criteria

- `handleSearchGmail` no longer performs full metadata fanout for large result sets.
- Search result completeness is trackable by job status.
- Contact expansion failure is visible.
- Search-to-Drive flow still works.
