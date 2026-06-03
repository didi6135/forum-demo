# Task 10 - Legacy Source Cleanup

Priority: P2

## Problem

The repo contains legacy Apps Script files in addition to the unified Apps Script deployment files. This increases the risk of editing or deploying the wrong file.

## Current Evidence

Legacy files:

- `Code.gs`
- `app/apps_script_search_emails.js`
- `app/apps_script_yeda_phone.js`

Runtime target:

- `apps_script_unified/*.gs`

## Why This Matters

The mapping says duplicate source files are P2, but they become dangerous during a large refactor because fixes can be applied to stale files.

## Fix Plan

1. Confirm which files are deployed to Apps Script.

2. Add a clear header to legacy files:

```text
LEGACY REFERENCE ONLY - DO NOT EDIT FOR PRODUCTION
Runtime source is apps_script_unified/
```

3. Optionally move legacy files to:

- `legacy/`
- or `.planning/archive/`

4. Update README/deployment docs to identify `apps_script_unified` as the source of truth.

5. Add a deployment checklist:
   - copy/deploy only unified files
   - verify `appsscript.json`
   - verify web app URL in frontend config

## Edge Cases

- User still manually copies from legacy files.
- Old deployment points to non-unified project.
- README still references old files.
- A function exists only in legacy source.

## User Test Plan

1. Search for a known handler name in the repo.
   - Expected: unified file is clearly the production source.

2. Follow deployment README.
   - Expected: instructions only deploy unified project files.

3. Open legacy file.
   - Expected: header clearly warns not to edit for production.

## Done Criteria

- It is obvious which files are production source.
- Legacy files cannot be mistaken for active deployment files.
- Deployment docs match actual source of truth.
