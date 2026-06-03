# Task 07 - Sensitive Key Cleanup

Priority: P1

## Problem

API keys are currently present in browser-accessible JavaScript and Apps Script constants.

## Current Evidence

Relevant files:

- `app/js/config.js`
- `apps_script_unified/01_constants.gs`
- `apps_script_unified/10_inbox.gs`
- `apps_script_unified/30_yeda_phone.gs`

Current exposed examples:

- Anthropic key in frontend config.
- OpenAI key in frontend config.
- Anthropic key in Apps Script constants.

## Why This Violates The Rules

The mapping identifies hardcoded frontend secrets as P1. Browser-side keys are not secrets. Anyone with access to the app can extract them.

## Fix Plan

1. Rotate exposed keys before or during cleanup.

2. Remove AI provider keys from `app/js/config.js`.

3. Store provider keys server-side:
   - Apps Script `PropertiesService` for short-term MVP.
   - Secret Manager if moving to Google Cloud backend.

4. Ensure frontend calls AI only through backend actions:
   - `callClaude`
   - `callOpenAI`
   - feature-specific backend handlers

5. Replace hardcoded Apps Script constants with `PropertiesService` reads:
   - `ANTHROPIC_API_KEY`
   - optional OpenAI key

6. Add diagnostics for missing keys that does not expose key values.

## Edge Cases

- Key is missing.
- Key is invalid.
- Frontend still tries direct OpenAI fetch.
- Apps Script PropertiesService lacks permission or value.
- A deployment has old config cached.

## User Test Plan

1. Rotate Anthropic/OpenAI keys.
2. Deploy new Apps Script with keys stored in Script Properties.
3. Open browser devtools and inspect loaded JS.
   - Expected: no provider secret key appears.
4. Generate draft.
   - Expected: backend AI call works.
5. Test missing key in a dev deployment.
   - Expected: clear backend error, no secret printed.

## Done Criteria

- No AI provider key is present in browser-delivered JS.
- No secret value is returned in API responses or debug logs.
- AI features still work through backend actions.
