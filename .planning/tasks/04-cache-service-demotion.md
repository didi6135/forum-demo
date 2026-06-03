# Task 04 - CacheService Demotion

Priority: P1

## Problem

`CacheService` is currently used for Gmail metadata, contacts, and rate-state caching. It is useful, but it is not durable and can evict data early.

The code sometimes behaves as if cache hits are enough to make repeated Gmail loads safe.

## Current Evidence

Relevant files:

- `apps_script_unified/02_gmail_gateway.gs`
- `apps_script_unified/10_inbox.gs`
- `apps_script_unified/20_search.gs`

Examples:

- Gmail response cache.
- Inbox metadata cache.
- Search metadata cache.
- Contacts connections cache.

## Why This Violates The Rules

The rules explicitly say CacheService must not be the source of truth for Gmail metadata or job state.

## Fix Plan

1. Audit every `CacheService.getScriptCache()` usage.

2. Classify each cache usage:
   - safe optimization
   - unsafe source of truth
   - rate coordination only

3. Move unsafe source-of-truth usage to durable job/index storage.

4. Keep CacheService only for:
   - short-lived response acceleration
   - duplicate request suppression
   - optional contact list acceleration
   - lightweight rate coordination

5. Rename cache keys and comments to make their role obvious:
   - `opt_cache_*` for optimization only
   - avoid names that imply durable state

## Edge Cases

- Cache is empty.
- Cache returns stale metadata.
- Cache entry is evicted mid-job.
- Cache contains malformed JSON.
- Cache write fails due to size.
- More than 1,000 cache items are attempted.

## User Test Plan

1. Clear or bypass cache in test mode.
   - Expected: daily/search still complete through durable job/index.

2. Run the same daily/search twice.
   - Expected: second run may be faster, but correctness does not depend on CacheService.

3. Simulate malformed cache value.
   - Expected: app ignores cache and uses durable/indexed source.

4. Test more than 1,000 potential messages.
   - Expected: no correctness dependency on CacheService item retention.

## Done Criteria

- CacheService is not needed to resume or complete Gmail jobs.
- Cache misses do not cause data loss.
- Cache corruption does not break a feature.
