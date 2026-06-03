# Task 05 - Gmail Rate Limit Policy

Priority: P1

## Problem

`GmailGateway.spend()` tracks estimated Gmail quota units, but the current production failure is Gmail bandwidth/rate throttling. Quota-unit pacing alone does not prevent it.

## Current Evidence

Relevant files:

- `apps_script_unified/02_gmail_gateway.gs`
- `apps_script_unified/10_inbox.gs`
- `apps_script_unified/20_search.gs`

The code spends quota before fetches, but Gmail still returns:

```text
חריגה במכסת רוחב הפס ... יש להאט את קצב העברת הנתונים.
```

## Why This Violates The Rules

The rules say current `GmailGateway.spend()` is not enough because it approximates quota units and does not measure actual bandwidth throttling.

## Fix Plan

1. Keep `GmailGateway.spend()` as a guard, not a correctness mechanism.

2. Add a Gmail fetch policy used by the job layer:
   - small chunk size
   - low concurrency
   - stop processing on throttle
   - persist pending IDs
   - retry later, not immediately in a long loop

3. Treat these as retryable throttle signals:
   - HTTP 429
   - HTTP 403 with quota/rate/bandwidth text
   - HTTP 503
   - Hebrew bandwidth exception text

4. On throttle:
   - mark job `partial` or `throttled`
   - store `retryAfterMs` if available
   - return control to frontend

5. Do not fallback from `fetchAll` burst to a long sequential loop in the same request for large result sets.

## Edge Cases

- Gmail throttles after 1 item.
- Gmail throttles after 50 successful items.
- A single message repeatedly fails.
- Apps Script execution is near timeout.
- Retry-After header is missing.
- Error text is Hebrew.

## User Test Plan

1. Run a large daily job.
   - Expected: if Gmail throttles, the job pauses and can resume.

2. Confirm no frontend request stays blocked for 60+ seconds due to repeated fallback loops.

3. Confirm debug output includes:
   - processed count
   - throttle count
   - last Gmail error
   - next retry suggestion

4. Resume after throttle.
   - Expected: already completed metadata rows are not fetched again.

## Done Criteria

- Gmail throttle does not cause dropped rows.
- Gmail throttle does not cause a long blocking request that eventually fails.
- Retry behavior is persisted through the job layer.
