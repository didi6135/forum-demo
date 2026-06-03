# Task 00 - Diagnostics And Observability

Priority: P0

## Problem

The app currently reports user-facing failures like Gmail bandwidth throttling or Drive service errors, but the backend does not provide a consistent diagnostic layer across Gmail, Drive, People, deployment config, and scopes.

Without diagnostics, each production issue looks like a code bug even when it is actually:

- missing OAuth scope
- Apps Script deployment mismatch
- Gmail bandwidth throttle
- Drive service quota
- People API disabled
- stale frontend URL
- partial Gmail data masked as complete data

## Current Evidence

Related files:

- `apps_script_unified/00_main.gs`
- `apps_script_unified/10_inbox.gs`
- `apps_script_unified/20_search.gs`
- `apps_script_unified/30_yeda_phone.gs`
- `apps_script_unified/97_diagnose_contacts.gs`
- `app/js/api.js`

Existing diagnostics are partial. Contact diagnostics exist, but there is no single "Google Workspace health check" action that verifies the real dependencies used by the app.

## Why This Violates The Rules

The rules document says Phase 0 must make failures observable before behavior changes. Refactoring Gmail loading without reliable diagnostics will make it hard to distinguish a new code regression from a Google quota/scope/deployment issue.

## Fix Plan

Add a new Apps Script diagnostics module, for example:

- `apps_script_unified/96_diagnose_workspace.gs`

Add a route in `00_main.gs`:

- `diagnoseWorkspace`

The handler should return structured JSON with these checks:

1. Deployment check:
   - script timezone
   - effective user email
   - current action map version string

2. Gmail checks:
   - `messages.list` for `newer_than:1d` with `maxResults=1`
   - one `messages.get(format=metadata)` only if a message exists
   - report Gmail error code/message directly

3. Drive checks:
   - create/reuse a test folder or check configured folder access
   - do not create duplicate folders by default

4. People checks:
   - `people:searchContacts` with a small harmless query if provided
   - `connections.list` with `pageSize=1`
   - `otherContacts.search` if scope is available

5. Apps Script service checks:
   - `CacheService` write/read small value
   - `PropertiesService` read permitted

6. Timing:
   - total duration
   - per-check duration

The response shape should be explicit:

```json
{
  "success": true,
  "checks": [
    {
      "name": "gmail.list",
      "ok": true,
      "ms": 123,
      "details": {}
    }
  ],
  "summary": {
    "ok": 5,
    "failed": 1,
    "warnings": 2
  }
}
```

## Edge Cases

- No Gmail messages match the test query.
- Gmail list works but metadata fetch fails.
- People advanced service is missing.
- People scopes are missing.
- Drive is temporarily unavailable.
- CacheService write succeeds but read returns empty.
- User is logged into the wrong Google account.

## User Test Plan

1. Deploy the Apps Script web app.
2. In the browser console, call the new API action through `Api` or a temporary debug button.
3. Confirm that the result includes checks for Gmail, Drive, People, CacheService, and PropertiesService.
4. Confirm each failed check includes a readable error message and source name.
5. Run it once with the current account that fails contacts and verify it reports missing People scopes clearly.
6. Run it after reauthorization and confirm People checks pass.

## Done Criteria

- The diagnostic action works without modifying data except for an explicitly safe test folder/cache key.
- Every check has `ok`, `name`, `ms`, and `details` or `error`.
- The frontend can display or log the diagnostics without guessing from raw stack traces.
