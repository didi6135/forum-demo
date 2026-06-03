# Current Codebase Map

Last reviewed: 2026-04-28

This map is the working baseline before the Google Workspace refactor. It is intentionally focused on runtime flows, Google API usage, failure modes, and refactor order. It is not a line-by-line inventory.

Primary rule document: `.planning/GOOGLE_WORKSPACE_REFACTOR_RULES.md`

## Main Conclusion

We do need this mapping before implementation.

The current Gmail failures are not isolated to one function. The same architectural pattern appears in daily summary and Gmail search:

1. The frontend asks for a large result set.
2. Apps Script calls `messages.list`.
3. Apps Script then calls `messages.get(format=metadata)` for many message IDs in the same foreground request.
4. `fetchAll`, small batches, `fields`, and `CacheService` reduce some overhead but still transfer many Gmail metadata responses in a burst.
5. Gmail eventually returns bandwidth/rate throttling, so the UI gets partial data.

Therefore, the refactor should start from a shared Gmail data/index/job layer, not by separately patching daily summary and search again.

## Runtime Surfaces

| Surface | Files | Role |
| --- | --- | --- |
| Frontend widget | `app/widget.html`, `app/js/*.js`, `app/style.css` | Browser UI, tab orchestration, API wrappers, local UI state |
| Unified Apps Script web app | `apps_script_unified/*.gs` | Main backend endpoint, Gmail/Drive/Docs/People handlers |
| Zoho CRM / Deluge | `app/js/api.js` | Fetches inquiry records and updates CRM module state |
| Google Workspace APIs | Gmail, Drive, Docs, Sheets, People | Mail, files, summaries, contacts, templates |
| AI APIs | Anthropic, OpenAI | Drafts, summaries, grouping, prompt-driven text work |
| Legacy Apps Script sources | `Code.gs`, `app/apps_script_search_emails.js`, `app/apps_script_yeda_phone.js` | Historical source copies; not the runtime target if unified deployment is used |

## Frontend Modules

| File | Main responsibility | Notes |
| --- | --- | --- |
| `app/js/config.js` | URLs, prompt doc IDs, API keys, CRM constants | Contains sensitive keys and deployment URLs. This should be cleaned up later. |
| `app/js/app.js` | App boot, tab switching, lazy tab initialization | Inbox loads on boot. Daily, inquiries, and search load lazily. |
| `app/js/api.js` | All backend calls, timing logs, transient retry, contact query expansion | Central place to change API contracts. Also has read/write retry classification. |
| `app/js/tab-inbox.js` | Inbox list, draft generation, attachment analysis, sending, forwarding | AI-heavy, message-detail-heavy, but usually works on selected messages. |
| `app/js/tab-daily.js` | Daily summary list and progressive rendering | Currently calls `Api.listDailyEmails`, which still depends on foreground Gmail metadata fanout. |
| `app/js/tab-search.js` | Gmail search, contact expansion, Drive upload/resume | Currently calls `Api.searchGmail`, which has the same Gmail metadata fanout issue. |
| `app/js/tab-inquiries.js` | Zoho inquiry records, AI grouping, Drive/email inquiry flows | Uses localStorage cache and Drive/email actions. |
| `app/js/ui-shared.js` | Shared UI helpers and prompt modal | Prompt modal uses localStorage cache. |

## Apps Script Entry Point

`apps_script_unified/00_main.gs` routes all actions through one `doPost`.

### Inbox Actions

| Action | Handler | Notes |
| --- | --- | --- |
| `listInboxEmails` | `handleListInboxEmails` | Used by inbox and daily summary. Current Gmail hotspot. |
| `generateDraft` | `handleGenerateDraft` | Fetches full message and calls Anthropic. |
| `analyzeWithAttachments` | `handleAnalyzeWithAttachments` | Fetches full message and attachment data. Potentially expensive by design. |
| `sendDraft` | `handleSendDraft` | Sends raw Gmail message. |
| `forwardEmail` | `handleForwardEmail` | Fetches full message and sends via `GmailApp`. |
| `getAttachment` | `handleGetAttachment` | Reads one Gmail attachment on demand. |
| `markAsRead` | `handleMarkAsReadAction` | Modifies Gmail labels. |
| `searchContacts` | `handleSearchContacts` | Uses People API and fallback diagnostics. Requires scopes and People advanced service. |
| `listTemplates`, `getTemplateContent` | Template sheet handlers | Reads template spreadsheet and rich text links. |
| `getSystemPrompt`, `callClaude`, `callOpenAI` | Prompt and AI helpers | AI calls currently go through Apps Script. |

### Search Actions

| Action | Handler | Notes |
| --- | --- | --- |
| `searchGmail` | `handleSearchGmail` | Current Gmail hotspot. Uses `messages.list` plus many metadata fetches. |
| `getMessageDetails` | `handleGetMessageDetails` | Fetches full message on demand. |
| `getMessageContent` | `handleGetMessageContent` | Fetches body on demand. |
| `searchDriveFolders` | `handleSearchDriveFolders` | Drive folder search. |
| `createFolder`, `uploadMessage`, `createSummary`, `appendSummaryToExistingDoc`, `sendEmail` | Search-to-Drive/email flow | Uses Drive, Docs, Gmail, and AI. |

### Yeda / Inquiry Actions

| Action | Handler | Notes |
| --- | --- | --- |
| `createDriveFolder` | `handleCreateDriveFolder` | Recently improved with reuse/retry diagnostics. |
| `uploadRecording` | `handleUploadRecording` | Drive upload flow. |
| `createSummaryDoc` | `handleCreateSummaryDoc` | Creates Docs summary. |
| `sendInquiryEmail` | `handleSendInquiryEmail` | Sends inquiry emails. |

## Feature Flow Map

### Inbox

1. `app.js` boots the inbox tab.
2. `tab-inbox.js` loads prompt instructions and eligible inbox emails.
3. `api.js` calls `listInboxEmails`.
4. Apps Script lists Gmail messages and fetches metadata.
5. For selected messages, inbox calls detail actions such as `generateDraft`, `analyzeWithAttachments`, `getAttachment`, `sendDraft`, and `forwardEmail`.

Risk: list loading uses the same metadata fanout pattern, but inbox can usually be constrained to small unread windows. It should be refactored after daily/search unless it blocks users.

### Daily Summary

1. `tab-daily.js` calls `Api.listDailyEmails`.
2. `api.js` paginates `listInboxEmails` with daily mode.
3. `handleListInboxEmails` builds the daily Gmail query and lists many IDs.
4. The handler fetches metadata for all pending IDs in foreground batches.
5. The frontend progressively renders partial pages.

Current failure: Gmail metadata fetches trigger bandwidth throttling. Progressive frontend rendering does not solve backend data loss.

Target model: daily summary should read from a persistent Gmail index or resumable background job, and only fetch missing data in small time-sliced units.

### Gmail Search

1. `tab-search.js` builds the query from scope/mode/date/text inputs.
2. `api.js` optionally expands people/contact queries with `buildGmailQueryWithContacts`.
3. `api.js` calls `searchGmail` across pages.
4. `handleSearchGmail` lists message IDs and fetches metadata for each page.
5. Detail is fetched later through `getMessageDetails` or `getMessageContent`.

Current failure: same foreground metadata fanout as daily summary.

Target model: search should return IDs and cached/indexed metadata quickly, then enrich missing rows asynchronously or on demand.

### Contacts Search

1. `api.js` calls `searchContacts`.
2. `handleSearchContacts` checks:
   - `People.People.searchContacts`
   - `People.People.Connections.list`
   - optional `ContactsApp` if available
   - `People.OtherContacts.search`
3. It returns debug source counts and scope errors.

Known edge case: this requires People API scopes and service enablement. Without them, Gmail search by contact cannot be trusted.

### Search To Drive

1. `tab-search.js` lets the user select search results and a Drive folder.
2. Upload state is stored in localStorage so the flow can resume.
3. Apps Script uploads message content/attachments and can create or append summary docs.

Risk: this flow depends on reliable Gmail search results. Refactor it after search returns stable indexed rows.

### Inquiries

1. `tab-inquiries.js` fetches Zoho inquiry records through `api.js`.
2. It caches recent inquiry state in localStorage.
3. It can group records with AI and upload/send inquiry-related files.
4. Drive folder creation now supports reuse diagnostics.

Risk: Drive quotas and file retries matter here, but this is not the source of the current Gmail bandwidth failure.

## State And Persistence

| Store | Current use | Reliability concern |
| --- | --- | --- |
| Browser memory | Active emails, selections, draft/analysis state | Lost on reload. Fine for UI state. |
| `localStorage` | Prompt cache, search upload resume, inquiry cache | Per-browser only. Not shared and not authoritative. |
| `CacheService` | Gmail metadata cache, contacts cache, GmailGateway response cache/rate state | Not durable, limited size, evictable, max practical TTL only short term. Not a source of truth. |
| `PropertiesService` | Claude API key and small script config | 9 KB/value and 500 KB total. Not a database. |
| Google Drive/Docs/Sheets | Templates, generated docs, uploaded files | Durable, but not suitable for high-volume Gmail metadata indexing unless carefully designed. |
| Durable Gmail index | Not implemented | This is the major missing piece. |
| Resumable Gmail job state | Not implemented | This is why large daily/search requests either time out or return partial data. |

## Google API Usage Inventory

| API/service | Current usage | Refactor implication |
| --- | --- | --- |
| Gmail API REST | `messages.list`, `messages.get`, attachments, raw send, label modify | Must be moved away from large foreground metadata fetches. |
| `GmailApp` | Forward/send/search in some helper flows | Mixed Gmail API + GmailApp behavior makes quota/debugging harder. Prefer one controlled layer per feature. |
| Drive REST / `DriveApp` | Folder creation, file upload, summaries, recordings | Needs retry and idempotency, but not the first bottleneck. |
| Docs API / `DocumentApp` | Summary docs and prompt docs | Fine for low volume. |
| Sheets API / `SpreadsheetApp` | Templates | Fine for low volume. |
| People API | Contact search and other contacts | Needs scopes and diagnostics before relying on it in Gmail query expansion. |
| `UrlFetchApp` | All external API calls | Apps Script daily URL Fetch limits and runtime apply. |

## Highest-Risk Hotspots

| Priority | Area | Why it matters | Current files |
| --- | --- | --- | --- |
| P0 | Daily summary Gmail loading | User needs complete daily data; current foreground fetch causes Gmail bandwidth errors | `app/js/tab-daily.js`, `app/js/api.js`, `apps_script_unified/10_inbox.gs` |
| P0 | Gmail search loading | Same failure mode as daily summary; returns partial data | `app/js/tab-search.js`, `app/js/api.js`, `apps_script_unified/20_search.gs` |
| P0 | Missing durable Gmail index/job layer | Without this, every large view rebuilds Gmail metadata from scratch | Not implemented |
| P1 | CacheService used as metadata cache | Helps repeated clicks but cannot guarantee completeness | `02_gmail_gateway.gs`, `10_inbox.gs`, `20_search.gs` |
| P1 | Contact scope dependency | Search expansion silently weakens without People scopes | `10_inbox.gs`, `97_diagnose_contacts.gs`, `appsscript.json` |
| P1 | Hardcoded frontend secrets | API keys in browser code are exposed | `app/js/config.js` |
| P1 | Single Apps Script endpoint for all heavy work | Long requests and concurrent executions compete for the same Apps Script limits | `00_main.gs` |
| P2 | Legacy duplicate source files | Easy to patch the wrong file | `Code.gs`, `app/apps_script_search_emails.js`, `app/apps_script_yeda_phone.js` |
| P2 | Mixed `GmailApp` and Gmail REST access | Harder quota accounting and inconsistent error handling | Multiple Apps Script files |

## Refactor Order

### Phase 0 - Stabilize Visibility

Goal: make failures observable before changing behavior.

Tasks:

1. Add or finish diagnostic functions for Gmail, Drive, People scopes, and deployment config.
2. Make partial Gmail results explicit in the UI and logs.
3. Record per-action timing and returned/missing counts consistently.

Success criteria:

1. We can tell whether a failure is scope, quota, deployment, Drive, Gmail bandwidth, or code error.
2. The UI never presents partial daily/search results as complete.

### Phase 1 - Shared Gmail Index / Job Foundation

Goal: stop doing large metadata fanout inside one web request.

Tasks:

1. Create a persistent Gmail metadata store.
2. Create job actions:
   - start job
   - process next chunk
   - get job status
   - read indexed result page
3. Keep chunks small enough for Apps Script runtime and Gmail bandwidth limits.
4. Track missing/error IDs explicitly.

Success criteria:

1. A large daily/search request can complete over multiple small executions.
2. Re-opening the same result reads from index/cache instead of re-fetching all metadata.
3. Failed chunks can be retried without duplicating all work.

### Phase 2 - Daily Summary Refactor

Goal: daily summary becomes complete and resumable.

Tasks:

1. Change frontend daily flow from "load all now" to "start/load job, poll, render available pages".
2. Use the shared Gmail index/job layer.
3. Add edge cases:
   - 0 messages
   - 1 message
   - 600+ messages
   - Gmail throttling mid-run
   - page reload while job is running
   - cache eviction
   - malformed date headers
   - sent-only or inbox-only days

Success criteria:

1. Daily summary never loses known IDs silently.
2. The UI can show running/partial/complete/error states.
3. Final complete state includes all indexed daily messages or a clear list/count of unrecoverable failures.

### Phase 3 - Gmail Search Refactor

Goal: search uses the same stable job/index mechanics.

Tasks:

1. Return search IDs quickly.
2. Enrich metadata through the job layer.
3. Keep contact expansion but degrade clearly when People scopes fail.
4. Add edge cases:
   - exact email search
   - Hebrew name search
   - partial phone/name text
   - query with 600+ results
   - no People scope
   - invalid Gmail query
   - repeated search while previous job is running

Success criteria:

1. Search can return all pages over time without Gmail bandwidth errors killing the whole request.
2. Rows missing metadata are marked pending/error, not dropped.

### Phase 4 - Inbox Detail And AI Actions

Goal: keep heavy full-message and attachment operations on demand.

Tasks:

1. Ensure inbox list loads only the minimal window needed.
2. Keep `generateDraft`, `analyzeWithAttachments`, and attachments on selected-message demand.
3. Add idempotency and clear retry rules for send/forward actions.

Success criteria:

1. Inbox load does not trigger large metadata bursts.
2. Send/forward actions are never retried in a way that can duplicate user-visible emails.

### Phase 5 - Drive / Inquiries Hardening

Goal: apply the same idempotent/retry style to Drive and inquiry flows.

Tasks:

1. Normalize Drive create/upload retry behavior.
2. Keep reuse/idempotency for folders.
3. Add resume and failure reporting for large uploads.

Success criteria:

1. Drive errors report stage and recovery path.
2. Retrying does not create duplicate folder/file trees unless explicitly requested.

### Phase 6 - Cloud Project / Backend Decision

Goal: decide whether Apps Script remains the backend or becomes a thin UI bridge.

Recommended direction:

1. Move the Apps Script project to a standard Google Cloud project immediately for scopes, logs, and API control.
2. If Gmail index/jobs are still unreliable in Apps Script, move the Gmail sync layer to Cloud Run plus Firestore/Cloud Tasks.

Decision point:

If Apps Script jobs still hit runtime, concurrency, or storage limits with real daily/search volume, stop investing in more Apps Script rate-limit tricks and move the Gmail sync/index backend to Google Cloud.

## First Implementation Slice

Start with Phase 0, then Phase 1 for daily summary.

Recommended first concrete work item:

1. Add a Google Workspace diagnostics action that verifies:
   - Gmail list works.
   - Gmail single metadata fetch works.
   - People contacts scopes work.
   - Drive folder create/reuse works.
   - current Apps Script deployment sees the expected manifest scopes.
2. Add a shared Gmail job/index module skeleton.
3. Switch only daily summary to the new job/index path.

Do not refactor search, inbox, and inquiries at the same time. Daily summary is the best first feature because it is failing in production and has a clear success definition: complete daily data without foreground Gmail metadata bursts.
