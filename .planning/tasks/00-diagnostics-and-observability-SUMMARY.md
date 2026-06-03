# Task 00 Summary - Diagnostics And Observability

Status: Implemented

## What Changed

Added a Google Workspace diagnostics action for the unified Apps Script backend.

Files changed:

- `apps_script_unified/96_diagnose_workspace.gs`
- `apps_script_unified/00_main.gs`
- `app/js/api.js`

## Backend Diagnostics

Created `handleDiagnoseWorkspace(data)` in `apps_script_unified/96_diagnose_workspace.gs`.

The handler returns structured JSON with:

- `success`
- `version`
- `totalMs`
- `checks`
- `summary`

Each check includes:

- `name`
- `ok`
- `warning`
- `ms`
- `details` or `error`

## Checks Implemented

Implemented diagnostics for:

- Deployment config:
  - diagnostic version
  - script timezone
  - effective user email
  - active user email
  - locale
- OAuth scopes:
  - tokeninfo lookup
  - granted scope count
  - missing required scopes
- Gmail:
  - one live `messages.list` call using `maxResults=1`
  - one live `messages.get(format=metadata)` call if a message exists
  - no bulk Gmail metadata fetch
- Drive:
  - read-only root folder access by default
  - configured folder access if `driveFolderId` is passed
- People:
  - advanced service loaded check
  - `People.People.searchContacts`
  - `People.People.Connections.list`
  - `People.OtherContacts.search`
- Apps Script services:
  - `CacheService` write/read
  - `PropertiesService` read

## Routing

Added this action route in `apps_script_unified/00_main.gs`:

```js
if (action === 'diagnoseWorkspace') return handleDiagnoseWorkspace(data);
```

## Frontend API

Added `Api.diagnoseWorkspace(opts)` in `app/js/api.js`.

Also marked `diagnoseWorkspace` as read-safe/idempotent so the existing transient retry policy applies.

Example browser-console usage after redeploying Apps Script:

```js
await Api.diagnoseWorkspace()
```

Optional targeted usage:

```js
await Api.diagnoseWorkspace({
  peopleQuery: 'a',
  gmailQuery: 'newer_than:1d',
  driveFolderId: 'optional-folder-id'
})
```

## Verification

Syntax checks passed:

```bash
node --check app/js/api.js
Get-Content apps_script_unified/96_diagnose_workspace.gs | node --check -
```

## Notes

This task does not refactor Gmail loading, daily summary, or search behavior.

It completes the Phase 0 observability slice: production failures can now be classified as scope, deployment, Gmail, Drive, People, CacheService, PropertiesService, or code-level errors before larger Gmail architecture changes are made.

## Remaining Follow-Up

- Redeploy the Apps Script web app so the new route is active.
- Run `await Api.diagnoseWorkspace()` from the browser console.
- If People scopes fail, reauthorize and deploy a new Apps Script web app version.
- Use the diagnostics output before starting the Gmail job/index foundation work.
