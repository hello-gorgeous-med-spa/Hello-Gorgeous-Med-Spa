# Google Maps integration — setup guide

## What's already wired (no action needed)

| Surface | Status | Source |
|---|---|---|
| `Place ID` baked into `SITE.placeId` | ✅ Live | `lib/seo.ts` |
| One-click Google review link (`GOOGLE_REVIEW_URL`) | ✅ Live | `lib/local-seo.ts` |
| Directions URL anchored to Place ID (more accurate than text search) | ✅ Live | `lib/local-seo.ts` |
| `LocalBusiness` + `MedicalBusiness` schema with `identifier`, `hasMap`, `geo`, correct hours | ✅ Live | `lib/seo.ts` |
| Interactive map on every city service page (33 pages) | ✅ Live (with fallback) | `components/LocationServicePage.tsx` |
| Map on `/contact`, footer, `/about`-style pages | ✅ Live (with fallback) | existing `LocationMap` + `GoogleMapEmbed` |
| Hours synced from Google Business Profile (Mon–Fri 10–8, Sat 10–5) | ✅ Live | `lib/seo.ts` |

## What needs an API key for the iframe map to actually render

Without an API key, every map slot shows a styled **"View on Google Maps"** card-link instead of an interactive iframe. That fallback works and looks clean — but if you want the actual embedded map, do this **5-minute, one-time setup**:

### Step 1 — Enable the Maps Embed API

Open: https://console.cloud.google.com/apis/library/maps-embed-backend.googleapis.com?project=644903218595

Click **Enable**. (Same project as Search Console.)

### Step 2 — Create a Maps API key

Open: https://console.cloud.google.com/apis/credentials?project=644903218595

1. Click **+ Create Credentials → API key**
2. Copy the new key
3. Click **Edit API key** on the row that just appeared
4. Under **Application restrictions**:
   - Choose **Websites**
   - Add: `https://*.hellogorgeousmedspa.com/*`, `https://*.vercel.app/*`, `http://localhost:3000/*`
5. Under **API restrictions**:
   - Choose **Restrict key**
   - Select **Maps Embed API** (and only that)
6. **Save**

### Step 3 — Add the env var to Vercel

Vercel dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environments |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` | _(paste the API key)_ | Production, Preview, Development |

Then redeploy (or just push any commit — Vercel auto-deploys).

### Step 4 — Optional: also enable Places API

If you want to programmatically pull live business hours, photos, or review counts:

1. Enable: https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=644903218595
2. The same key (or a separate restricted key) works
3. Set `GOOGLE_PLACES_API_KEY` (server-side, not `NEXT_PUBLIC_`) in `.env.local` and Vercel

The Places API isn't required for the map embed itself.

## Cost expectations

- **Maps Embed API**: $0. Truly free, unlimited requests, no card required for that endpoint.
- **Places API**: First 200K requests/month free per the Google Maps platform $200/month credit. A small business won't sniff that limit.

## How to verify it's working after setup

1. Visit any city page, e.g. `https://www.hellogorgeousmedspa.com/botox-naperville-il`
2. Scroll to the "Driving from Naperville" section
3. You should see an actual Google Map (not the fallback link card)

If still showing the fallback after a Vercel redeploy, hard-refresh the browser (Cmd+Shift+R) — Vercel CDN may serve cached HTML for ~1 hour after deploy.

## Files involved

```
lib/seo.ts                          # SITE.placeId, SITE.cid, SITE.openingHours, schema
lib/local-seo.ts                    # MAPS_DIRECTIONS_URL, getMapsEmbedUrl, GOOGLE_REVIEW_URL
components/GoogleMapEmbed.tsx       # The iframe component (with fallback)
components/LocationMap.tsx          # The full "Visit us" section (contact page, footer)
components/LocationServicePage.tsx  # Used by all 33 city service pages — embeds the map
```
