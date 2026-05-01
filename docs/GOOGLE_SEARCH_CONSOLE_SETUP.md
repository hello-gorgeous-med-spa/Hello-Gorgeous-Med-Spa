# Google Search Console — API setup

We use the Search Console API to submit our sitemap automatically and
inspect index status for the premium landing pages. Authentication
piggybacks on the same OAuth client that powers the Google Business
Profile integration, so there's no second client to manage.

## What you do once (≤2 minutes)

### 1. Add the redirect URI in Google Cloud Console

The Search Console OAuth flow lands on a different callback than the
GBP one, so we need to whitelist its URL exactly.

1. Open <https://console.cloud.google.com/apis/credentials> with the
   Google account that owns the OAuth 2.0 Client (the same one used
   for `GOOGLE_CLIENT_ID`).
2. Click the OAuth 2.0 Client ID matching the value in
   `GOOGLE_CLIENT_ID`.
3. Under **Authorized redirect URIs**, click **Add URI** and paste:
   ```
   https://www.hellogorgeousmedspa.com/api/seo/google-callback
   ```
4. Click **Save**. Propagation takes <60 seconds.

### 2. Verify the property in Search Console (skip if already verified)

The OAuth token can only manage properties verified under the same
Google account.

1. Visit <https://search.google.com/search-console>.
2. Add a **URL prefix** property: `https://www.hellogorgeousmedspa.com/`
3. Pick the **HTML tag** verification method, copy the meta tag
   contents into `lib/seo.ts` (`SITE.googleSiteVerification`), redeploy,
   then click **Verify**.
   - If a `google.../site-verification` meta tag is already in place
     and Search Console accepted it before, this is already done.

### 3. Authorize the Search Console scope

Once the redirect URI is saved, sign-in to your Google account that
owns the property, then visit:

```
https://www.hellogorgeousmedspa.com/api/seo/google-connect
```

Approve the **Search Console** scope. You'll land on a confirmation
page that:

- Lists the verified properties this token can manage
- Submits `https://www.hellogorgeousmedspa.com/sitemap.xml`
- Inspects the three premium landing pages
- Displays the **refresh token** in a copy-friendly text box

### 4. Save the refresh token in Vercel

1. Open the Vercel project → Settings → Environment Variables.
2. Add a new variable:
   - **Name:** `GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN`
   - **Value:** the token from step 3
   - **Environments:** Production, Preview, Development
3. Redeploy (or trigger a new deploy by merging anything to main).

The token never expires unless you manually revoke it.

## What you do every time you need to re-submit

Once the refresh token is in place, no more manual UI clicks:

- Visit `/admin/seo/google-search-console` (owner / admin / staff role)
- Click **Submit sitemap now**
- Watch the index verdict for each premium URL

The same admin page also exposes a **Refresh status** button to re-pull
the latest crawl/index timestamps without re-submitting.

## Files involved

| File | Purpose |
|------|---------|
| `app/api/seo/google-connect/route.ts` | Starts OAuth flow with `webmasters` scope |
| `app/api/seo/google-callback/route.ts` | Exchanges code, runs first sitemap submission, displays refresh token |
| `app/api/seo/sitemap-submit/route.ts` | Admin POST/GET — re-submit sitemap or read status |
| `lib/seo/search-console.ts` | OAuth refresh + Search Console API helper |
| `app/admin/seo/google-search-console/page.tsx` | Admin UI |

## Things the API can't do (Google policy)

- The Indexing API is **only** for `JobPosting` and `BroadcastEvent`
  schema types. We can submit sitemaps in bulk, but cannot
  programmatically request indexing of `/services/botox`,
  `/services/microneedling-rf`, or `/services/weight-loss-therapy`.
- The fastest way to get those three URLs into the index is:
  1. Submit the sitemap (this admin page) — Google fetches within 24h
  2. Manually paste each URL into the Search Console URL Inspection
     bar and click **Request Indexing** — usually crawls within 6h.
- After bulk submission, the URL Inspection step is optional but
  shaves ~12-18h off discovery.

## Troubleshooting

- **`No verified Search Console property matched`** → the property
  isn't verified under the Google account you authorized with. Go
  back to step 2.
- **`redirect_uri_mismatch`** → step 1 wasn't completed, or the URL
  was pasted with a trailing slash / typo. The URI in Google Cloud
  Console must be **byte-identical** to
  `https://www.hellogorgeousmedspa.com/api/seo/google-callback`.
- **`invalid_grant` on resubmit** → the refresh token was revoked.
  Re-run `/api/seo/google-connect` and replace
  `GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN` in Vercel.
