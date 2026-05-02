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

### Step 4 — Live data (already wired, requires Places API enabled)

We pull these from the **Places API (New)** and cache for 24 hours:

- **Live AggregateRating** — schema rating + review count auto-update every day so Google never sees a stale number (was hardcoded 4.9/47, now matches your real GBP listing). Wired in `app/layout.tsx` via `getLiveAggregateRating()`.
- **Live "Open now" badge + today's hours** on `/contact` (`<LiveGooglePlaceCard />`)
- **Live business hours** also surfaced on the contact card

If your existing `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` is unrestricted (or restricted to both Maps Embed + Places APIs), the live integration works automatically — no extra env var needed.

#### Best-practice: separate server-side key (recommended)

For tightest security, create a **second** API key:

1. https://console.cloud.google.com/apis/credentials?project=644903218595 → +Create → API key
2. Application restrictions: **None** (called server-side; Vercel doesn't expose static IPs)
3. API restrictions: select only **Places API (New)**
4. Add to Vercel as `GOOGLE_PLACES_API_KEY` (server-side, no `NEXT_PUBLIC_` prefix)
5. Then go back to your `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` and restrict it to **Maps Embed API only** (it's exposed to browsers)

This isolates blast radius if either key ever leaks.

## Cost expectations

- **Maps Embed API**: $0. Truly free, unlimited requests, exempt from credits.
- **Places API (New) — Place Details (Atmosphere)**: $5 / 1,000 calls. Cached daily = ~30 calls/month total. Even without the $200/mo credit, you'd pay $0.15.
- **Place Photos**: $7 / 1,000 calls. Currently not pulled (we serve your own photos). Available via `getGooglePhotoUrl()` if needed.
- **Realistic monthly bill**: $0. The $200/month Maps Platform credit covers ~40,000 atmosphere calls. You'll use ~30.

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
