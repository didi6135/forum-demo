# Task 09 - Gmail Access Layer Unification

Priority: P2

## Problem

The code mixes Gmail REST API, `GmailGateway`, and `GmailApp`. This makes quota behavior, error handling, and retries inconsistent.

## Current Evidence

Relevant files:

- `apps_script_unified/02_gmail_gateway.gs`
- `apps_script_unified/10_inbox.gs`
- `apps_script_unified/20_search.gs`
- `apps_script_unified/21_search_drive.gs`
- `apps_script_unified/30_yeda_phone.gs`

Examples:

- Metadata through Gmail REST.
- Full message through `GmailGateway`.
- Send/forward sometimes through raw Gmail REST, sometimes `GmailApp.sendEmail`.
- Search Drive upload uses `GmailApp.getMessageById`.

## Why This Matters

Mixed access paths hide which quota/rate behavior applies and make retry semantics inconsistent.

## Fix Plan

1. Define a Gmail access policy:
   - REST/GmailGateway for read/index operations.
   - Explicit send layer for send/forward.
   - Avoid `GmailApp` in new Gmail-heavy flows unless there is a clear reason.

2. Wrap each operation:
   - list IDs
   - get metadata
   - get full message
   - get attachment
   - send raw
   - send simple
   - modify labels

3. Standardize error shape:
   - provider
   - operation
   - code
   - retryable
   - raw message

4. Migrate one feature at a time.

## Edge Cases

- Gmail REST error with JSON body.
- Apps Script `GmailApp` exception in Hebrew.
- Message not found.
- Permission denied.
- Send succeeds but response lookup fails.

## User Test Plan

1. Fetch metadata for one known message.
2. Fetch full content for one known message.
3. Fetch one attachment.
4. Mark one message read.
5. Send one test draft.
6. Forward one test message.

Expected: all operations return consistent success/error shape and logs show which Gmail access method was used.

## Done Criteria

- New daily/search job layer uses one Gmail read path.
- Error handling is consistent.
- Existing send/forward behavior remains correct.
