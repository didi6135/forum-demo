# Refactor Task Index

Last updated: 2026-04-28

This folder breaks the Google Workspace refactor into one task file per problem. Each task explains:

- what is broken
- where it appears in the current code
- why it violates the refactor rules
- how to fix it
- edge cases to cover
- how the user should test it

Source documents:

- `.planning/GOOGLE_WORKSPACE_REFACTOR_RULES.md`
- `.planning/CURRENT_CODEBASE_MAP.md`

## Execution Order

Do not implement all tasks at once. The correct order is:

1. `00-diagnostics-and-observability.md`
2. `01-gmail-job-index-foundation.md`
3. `02-daily-summary-refactor.md`
4. `03-gmail-search-refactor.md`
5. `04-cache-service-demotion.md`
6. `05-gmail-rate-limit-policy.md`
7. `06-ui-partial-complete-states.md`
8. `07-sensitive-key-cleanup.md`
9. `08-single-endpoint-routing-hardening.md`
10. `09-gmail-access-layer-unification.md`
11. `10-legacy-source-cleanup.md`

## Task List

| Priority | Task | Main outcome |
| --- | --- | --- |
| P0 | `00-diagnostics-and-observability.md` | Know exactly whether failures are scopes, Gmail throttle, Drive, deployment, or code. |
| P0 | `01-gmail-job-index-foundation.md` | Stop large Gmail metadata fanout inside one Apps Script request. |
| P0 | `02-daily-summary-refactor.md` | Daily summary loads complete data through resumable jobs. |
| P0 | `03-gmail-search-refactor.md` | Gmail search returns complete indexed results over time without dropping rows. |
| P1 | `04-cache-service-demotion.md` | CacheService becomes optimization only, never source of truth. |
| P1 | `05-gmail-rate-limit-policy.md` | Replace false confidence from `GmailGateway.spend()` with small chunks and retryable jobs. |
| P1 | `06-ui-partial-complete-states.md` | UI shows running/partial/complete/error truthfully. |
| P1 | `07-sensitive-key-cleanup.md` | Remove exposed Anthropic/OpenAI keys from browser code and constants. |
| P2 | `08-single-endpoint-routing-hardening.md` | Make action routing observable, safer, and ready for splitting. |
| P2 | `09-gmail-access-layer-unification.md` | Reduce mixed Gmail REST / GmailApp behavior. |
| P2 | `10-legacy-source-cleanup.md` | Prevent edits to old duplicate Apps Script files. |

## Completion Rule

A task is not done until:

1. Code is changed only within that task's scope.
2. The user acceptance tests in the task file pass.
3. Debug output confirms the expected behavior.
4. No unrelated feature is refactored in the same step.
