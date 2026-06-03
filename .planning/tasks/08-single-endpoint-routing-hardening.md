# Task 08 - Single Endpoint Routing Hardening

Priority: P2

## Problem

All major actions go through one Apps Script `doPost`. This is convenient, but it makes heavy actions compete in the same deployment and makes diagnostics/routing harder.

## Current Evidence

Relevant file:

- `apps_script_unified/00_main.gs`

The route map includes:

- inbox
- daily summary
- search
- Drive upload
- inquiries
- AI calls
- send/forward email

## Why This Matters

The rules recommend stabilizing Apps Script first, then considering a standard Cloud project or Cloud backend. A safer route layer helps before any split.

## Fix Plan

1. Add a structured action registry object instead of long `if` chain, if Apps Script compatibility allows it.

2. Add action metadata:
   - category
   - read/write
   - expected timeout class
   - idempotent or not

3. Centralize response wrapping:
   - timing
   - action
   - category
   - server version
   - error classification

4. Do not retry non-idempotent write actions automatically.

5. Later, use metadata to split endpoints or move heavy jobs to Cloud.

## Edge Cases

- Unknown action.
- Handler throws before returning JSON.
- Long-running action.
- Non-idempotent send action fails after partial success.
- Frontend calls old action name.

## User Test Plan

1. Call a known read action.
   - Expected: response includes action/timing metadata.

2. Call an unknown action.
   - Expected: structured error with action name.

3. Trigger a backend exception.
   - Expected: structured error, not malformed response.

4. Send email action.
   - Expected: no automatic duplicate send retry.

## Done Criteria

- Action routing is easier to inspect.
- Every response has consistent metadata.
- Write actions are clearly classified.
