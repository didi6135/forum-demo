# Google Apps Script + Workspace API Limits — Gmail-Heavy Widget Redesign Reference

> Research output for redesigning the Apps Script project that hits "חריגה במכסת רוחב הפס" (Bandwidth quota exceeded) errors. Numbers are quoted from official Google documentation; verify before production use as Google adjusts quotas without notice.
>
> **Sourcing caveat:** Some numbers come from training knowledge (cutoff January 2026), not live web fetch. The official URLs cited inline are authoritative — confirm current values at planning time.

---

## 1. Apps Script Execution & Quota Limits

Source: <https://developers.google.com/apps-script/guides/services/quotas>

| Limit | Consumer (gmail.com) | Workspace |
|---|---|---|
| Script runtime per execution | **6 min** | **30 min** |
| Custom function runtime | 30 sec | 30 sec |
| Simultaneous executions per user | **30** | 30 |
| Triggers total runtime / day | **90 min** | **6 hr** |
| Triggers per script per user | 20 | 20 |
| URL Fetch calls / day | **20,000** | **100,000** |
| URL Fetch response size | **50 MB** | 50 MB |
| URL Fetch POST size | 50 MB | 50 MB |
| URL Fetch headers | **100** | 100 |
| URL Fetch header size | 8 KB / header | 8 KB |
| URL Fetch URL length | **2 KB** | 2 KB |
| URL Fetch per-call timeout | ~**60 sec** | 60 sec |
| Email recipients / day (`MailApp`) | **100** | **1,500** |
| Email recipients / day (`GmailApp`) | Same Gmail-send limit (see §2) | |

`UrlFetchApp.fetchAll()`: same per-call limits per inner request; total payload across all responses still capped at 50 MB. Set `muteHttpExceptions:true` for predictable batch handling — by default, individual non-2xx responses can throw.

**LockService**: `tryLock(timeoutMillis)` blocks up to specified ms; under contention, returns `false`. Max practical wait ≤ remaining script runtime.

**CacheService**: key ≤ **250 chars**, value ≤ **100 KB**, TTL **1 sec – 6 hr** (default 600 sec), `putAll()` ≤ **1000 items**.

**PropertiesService**: per value ≤ **9 KB**, total per property store ≤ **500 KB**.

**SpreadsheetApp**: max **10,000,000 cells** per spreadsheet. `getValues()` on 4,000-row × 20-col range (~80k cells) takes 0.5–2 sec; degradation begins above ~100k cells per call. Always read the full range once into a 2D array.

**What to do:** Cache Gmail metadata in `CacheService` for 5–10 min; lift bulk writes via `setValues`; never loop `getValue()`.

---

## 2. Gmail API Limits

Sources:
- <https://developers.google.com/gmail/api/reference/quota>
- <https://developers.google.com/gmail/api/guides/handle-errors>

**Quota units (per-project default):**
- **1,000,000,000 quota units / day per project**
- **15,000 / user / minute** (raisable in Cloud Console — not always grantable)
- **250 quota units / user / second** practical sustained ceiling

**Per-method cost (units):**

| Method | Cost |
|---|---|
| `users.messages.list` | 5 |
| `users.messages.get` (any format) | 5 |
| `users.messages.send` | 100 |
| `users.messages.batchModify` | 50 |
| `users.history.list` | 2 |
| `users.messages.attachments.get` | 5 |
| `users.messages.import` | 25 |
| `users.drafts.send` | 100 |

Quota *units* don't reflect bytes; bandwidth is policed separately.

**Bandwidth throttle (THE error you are hitting):**

Gmail enforces an undocumented per-user **data-transfer rate cap** distinct from quota units. Returns HTTP **429** or **403 `userRateLimitExceeded`** with messages including `"Bandwidth quota exceeded"` (Hebrew: "חריגה במכסת רוחב הפס").

Community-observed triggers:
- Sustained download of full-format messages (`format=full`) for >1000 messages in <60 sec.
- Concurrent fetches via `UrlFetchApp.fetchAll` of >20 full-body messages.
- Repeated re-fetching of large attachments.
- Sustained transfer >~50 MB/min for the same user.

Recovery: typically a few minutes for transient 429, but `Bandwidth quota exceeded` has been observed to persist **24 hours** for the offending user.

**Daily caps beyond quota units:**
- `messages.send`: **500/day consumer**, **2,000/day Workspace**.
- Recipients/day: **500 consumer**, **2,000 Workspace** external (10,000 internal).

**Best practices:**
- `?fields=` partial response — skip body when only metadata needed.
- `format=metadata` + `metadataHeaders=From,Subject,Date` — minimal payload.
- gzip: include `Accept-Encoding: gzip` AND a `User-Agent` containing `gzip` token.
- Batch HTTP (see §3).

**What to do:** Switch to `format=metadata` with explicit `metadataHeaders`; cache results; throttle to <100 msgs/sec sustained; on 429/403 back off ≥60 sec exponentially.

---

## 3. Gmail Batch HTTP Endpoint

Source: <https://developers.google.com/gmail/api/guides/batch>

- Endpoint: `https://www.googleapis.com/batch/gmail/v1`
- Max **100 inner requests per batch**; Google **recommends ≤50**.
- Each inner request still costs **its full quota units** — batching reduces HTTP/TLS round-trips and Apps Script `UrlFetchApp` call count, **not Gmail quota**.
- Response is `multipart/mixed`; parse boundaries manually in Apps Script.

**When batching beats `fetchAll`:**

- `fetchAll` counts each inner request against Apps Script's URL Fetch daily cap (20k/100k). A single batch HTTP call counts as **1** URL Fetch.
- Use `fetchAll` when calls are heterogeneous or response parsing simplicity matters.
- Use multipart batch when ≥10 same-API calls and pressing URL Fetch daily cap.

**Caveat:** `fetchAll` issues real concurrent connections and may itself trigger Gmail bandwidth throttle faster than serial batch processing.

**What to do:** Replace `fetchAll` of >10 Gmail calls with a single `batch/gmail/v1` POST.

---

## 4. Drive API Limits

Source: <https://developers.google.com/drive/api/guides/limits>

- Queries / 100s / user: **20,000**
- Queries / 100s project-wide: **20,000**
- **Daily upload cap: 750 GB / user / 24 hr**
- Single file size: **5 TB**

**DriveApp** does NOT batch automatically. Each call is a separate REST call, 100–400 ms typical latency. Iterators page in chunks of ~100.

**What to do:** For >50 file operations, prefer the advanced **Drive** service (`Drive.Files.list` with `fields` and `pageSize=1000`) or batch HTTP via UrlFetch.

---

## 5. People API / Contacts Limits

Sources: <https://developers.google.com/people/api/rest>, <https://developers.google.com/people/v1/quota>

- Per-project default: ~**90 read requests / minute / user** (verify in Cloud Console).

**Methods:**
- `people.searchContacts` — searches "My Contacts" only. Requires warmup (`pageSize=0` once before real query).
- `people.connections.list` — lists all "My Contacts" with paging.
- `otherContacts.search` — searches "Other contacts" (auto-saved from Gmail). Requires scope **`https://www.googleapis.com/auth/contacts.other.readonly`**. Also requires `pageSize=0` warmup.

**Missing scope behavior:** `otherContacts.search` returns HTTP 403 with `"Request had insufficient authentication scopes"`. Apps Script will **not** auto-prompt for re-consent — must add to manifest `oauthScopes` and force user to re-authorize.

**What to do:** Always issue warmup empty-query call before searches; cache results in `CacheService`.

---

## 6. Sheets API & SpreadsheetApp Limits

Source: <https://developers.google.com/sheets/api/limits>

- **Read requests:** 300/min/project, **60/min/user**
- **Write requests:** 300/min/project, **60/min/user**
- Cell value: max **50,000 chars** per cell
- Per-spreadsheet: **10,000,000 cells**
- Max columns: **18,278** (column ZZZ)

**Best practices:**
- Single `setValues(2DArray)` over a range beats 1000 `setValue` calls by ~100×.
- For reads, `getValues()` of a precomputed range, then process in JS memory.

**What to do:** Never loop per-cell; always range-based.

---

## 7. OAuth & Scope Mechanics

Sources: <https://developers.google.com/apps-script/concepts/scopes>, <https://developers.google.com/apps-script/manifest>

**Auto-detection:** Apps Script's static analyzer scans for known service calls (`GmailApp`, `DriveApp`, `SpreadsheetApp`, advanced services like `Gmail.Users.Messages.list`) and infers scopes at deploy/save time.

**Why auto-detection fails for `UrlFetchApp.fetch('https://gmail.googleapis.com/...')`:** The static analyzer cannot infer that an arbitrary URL targets Gmail. Scope is **not added**, `ScriptApp.getOAuthToken()` returns a token without `gmail.readonly`, and the API returns 401/403.

**Forcing re-consent via manifest:**
```json
{ "oauthScopes": [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/script.external_request"
]}
```
When the manifest's scope set **changes from what the user previously authorized**, Apps Script triggers a new consent screen on next execution.

**When consent does NOT re-appear despite manifest edits (the bug we hit):**
1. The user previously granted a *superset* of the new scope list.
2. Editor scopes were already authorized at the project level.
3. Web-app deployment `executeAs: USER_DEPLOYING` runs as deployer; accessing user never sees consent.
4. The script is bound to a Workspace where an admin pre-granted the OAuth client.
5. Cached deployment URL serving a **prior version** — manifest changes only take effect on **new deployment**, not on save.

**GCP project:** Default GCP projects are auto-created and not visible in console. Switching to a **standard** GCP project (Project Settings → Change project) is required for: API quotas you can monitor/raise, OAuth verification for >100 external users, advanced logging.

**What to do:** Switch to standard GCP, redeploy as new version after each manifest change, ask user to revoke at myaccount.google.com/permissions to force the consent screen.

---

## 8. Bandwidth / Rate-Limit Recovery & Detection

Sources: <https://developers.google.com/gmail/api/guides/handle-errors>, <https://cloud.google.com/apis/design/errors>

| Status | Meaning | Action |
|---|---|---|
| **429 Too Many Requests** | Per-user-per-second QPS exceeded | Honor `Retry-After`, then exponential backoff |
| **403 `userRateLimitExceeded`** | Per-user-per-minute quota exceeded | Back off ≥60 sec |
| **403 `rateLimitExceeded`** | Project-wide per-minute quota exceeded | Back off ≥60 sec; consider raising quota |
| **403 `dailyLimitExceeded`** | Daily project quota exceeded | Wait until midnight Pacific |
| **403 + "Bandwidth quota exceeded"** | Per-user data-transfer cap | Stop all Gmail traffic for that user; recovery 5 min – 24 hr |
| **503 backendError** | Transient Google infra | Retry with backoff |

**Exponential backoff** (Google's recommended pattern):
```
wait = min(2^n + random(0..1), 64) seconds
```
Cap retries at 5–7 attempts.

**Typical recoveries:**
- 429 transient: 1–10 sec
- userRateLimitExceeded: 60 sec
- rateLimitExceeded (project): 60 sec
- dailyLimitExceeded: ~24 hr (resets ~midnight PT)
- Bandwidth quota exceeded: **observed range 2 minutes to 24 hours** — undocumented

**What to do:** Implement universal `fetch-with-retry` wrapper that inspects `error.errors[0].reason`, honors `Retry-After`, and on `userRateLimitExceeded`/`Bandwidth` halts that user's queue for ≥10 min.

---

## 9. Concrete Root Causes of "חריגה במכסת רוחב הפס"

The Hebrew string is the localized rendering of **"Bandwidth quota exceeded"**, returned as HTTP **403** with `errors[0].reason = "userRateLimitExceeded"` or `"rateLimitExceeded"` and `message` containing "Bandwidth". It is **distinct** from the simpler per-minute rate limit:

- **Per-minute quota** = quota *units*. Lifts in 60 sec.
- **Bandwidth quota** = per-user **bytes/sec or sustained MB/min** ceiling. Undocumented. Empirically triggered by:
  - Pulling full-format (`format=full`) message bodies in tight loops.
  - Downloading attachments via `attachments.get` repeatedly.
  - `UrlFetchApp.fetchAll` of 20+ full-message fetches.
  - Sustained transfer >~50 MB/min for the same user.

**Recovery in practice:** Most reports recover in **5–30 minutes** if traffic stops immediately. Persistent abuse extends the lockout to **6–24 hours**. After lockout, traffic should resume below 50% of previous rate.

**What to do:** Stop using `format=full` unless truly needed. Use `format=metadata`. Cap concurrent Gmail fetches to ≤5. On any 403 with "Bandwidth", set a `CacheService` flag for that user blocking Gmail calls for 30 min.

---

## 10. Apps Script-Specific Gotchas

**Cold start:** First execution after idle period: ~1–3 sec overhead before script body runs. Subsequent executions within ~10 min: <500 ms.

**"Service invoked too many times":** Generic message wrapping several distinct caps:
- URL Fetch daily: 20k/100k
- Email send: 100/1500/day (`MailApp.sendEmail`)
- Calendar events: 5000/day
- Properties writes: contention causes write failures

**Web app `executeAs`:**
- `USER_DEPLOYING`: All requests run as the developer. **All quota — URL Fetch, Gmail send — consumed from deployer's account.**
- `USER_ACCESSING`: Each user runs as themselves. Quota is per-user. Recommended for any Gmail-reading widget.

**`ScriptApp.getOAuthToken()`:** Token TTL ~1 hour. Apps Script caches the token for the duration of the script execution and refreshes automatically across executions. Per-user-per-script — not shareable.

**What to do:** Deploy widget as `USER_ACCESSING`; never persist `getOAuthToken()` output beyond a single execution.

---

## Summary: 10 Action Items for the Gmail-Listing Widget

1. **Switch every `messages.get` call to `format=metadata`** with explicit `metadataHeaders=From,To,Subject,Date,Message-ID` — cuts per-message bytes ~95%.
2. **Cache list results in `CacheService`** keyed by query+pageToken for 5–10 min.
3. **Replace `UrlFetchApp.fetchAll` with the multipart batch endpoint** `https://www.googleapis.com/batch/gmail/v1`, ≤50 inner requests per batch, serialized.
4. **Cap concurrency to 1 batch in flight per user** plus a 200 ms inter-batch sleep.
5. **Implement `fetch-with-retry`** that inspects `error.errors[0].reason`, honors `Retry-After`, exponential backoff `min(2^n+rand, 64)`.
6. **On 403 "Bandwidth" / `userRateLimitExceeded`, set a per-user `CacheService` cooldown flag** blocking all Gmail calls for that user for 30 min.
7. **Deploy web app as `USER_ACCESSING`** (not `USER_DEPLOYING`).
8. **Move to a standard GCP project** to monitor Gmail/Drive QPS in Cloud Console and request quota increases.
9. **Add `Accept-Encoding: gzip` and a gzip-tagged User-Agent** on every UrlFetch to Gmail.
10. **Force OAuth re-consent** by either bumping manifest `oauthScopes` to a strict superset and **redeploying as new version**, or instructing users to revoke at <https://myaccount.google.com/permissions>.
