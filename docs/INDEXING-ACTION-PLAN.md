# Indexing Action Plan — 9 Indexed, 88 Can't Be Found

**Problem:** Only 9 pages indexed. 88 pages "can't be found" in Google Search Console.

---

## Root Cause: Broken Sitemap

Until we fixed it, **the sitemap returned 500** when Google tried to fetch it. Google discovers most of your pages via the sitemap. Without it, Google could only find pages by:
- Following links from the homepage (and the few pages already indexed)
- External links

That's why only ~9 pages got indexed — the rest were never discovered.

**Fix applied:** Sitemap and robots.txt are now excluded from middleware so Googlebot can fetch them reliably.

---

## What to Do Now

### 1. Confirm Sitemap Works (After Deploy)

Open in a browser:
- `https://www.hellogorgeousmedspa.com/sitemap.xml`

You should see valid XML with 90+ URLs. If you see an error, the fix didn't deploy yet.

### 2. Re-Submit Sitemap in Search Console

1. Go to **Search Console** → **Sitemaps**
2. Remove any old/broken entries
3. Enter: `sitemap.xml`
4. Click **Submit**

### 3. Request Indexing for Priority Pages

Use **URL Inspection** to request indexing for your most important pages:

1. Search Console → **URL Inspection** (top search bar)
2. Paste each URL
3. Click **Request indexing**

**Priority URLs to request (do 10–20 per day — Google limits requests):**

| Page | URL |
|------|-----|
| Homepage | https://www.hellogorgeousmedspa.com |
| Services | https://www.hellogorgeousmedspa.com/services |
| Morpheus8 Burst | https://www.hellogorgeousmedspa.com/morpheus8-burst-oswego-il |
| Quantum RF | https://www.hellogorgeousmedspa.com/quantum-rf-oswego-il |
| Botox Oswego | https://www.hellogorgeousmedspa.com/botox-oswego-il |
| Weight Loss | https://www.hellogorgeousmedspa.com/services/weight-loss-therapy |
| Best Med Spa | https://www.hellogorgeousmedspa.com/best-med-spa-oswego-il |
| Morpheus8 Service | https://www.hellogorgeousmedspa.com/services/morpheus8 |
| Solaria CO2 | https://www.hellogorgeousmedspa.com/solaria-co2-laser-oswego-il |
| Laser Hair | https://www.hellogorgeousmedspa.com/laser-hair-memberships |

### 4. Check "Why Pages Aren't Indexed"

In Search Console → **Pages** (or **Indexing** → **Pages**):
- Look at the dropdown: **Why pages aren't indexed**
- Common reasons:
  - **Crawled - currently not indexed** — Google found them but hasn't indexed yet (give it time)
  - **Discovered - currently not indexed** — In queue; sitemap fix should help
  - **Crawl anomaly** — 404, 500, or blocked; check the URL list

### 5. Give It Time

- Sitemap re-crawl: 1–7 days
- Full indexing of 90+ pages: 1–4 weeks
- Don't over-request indexing — 10–20 URLs/day max

---

## Pages That Should Stay Noindex (Intentional)

These are correctly excluded from indexing:
- `/review` — Redirect page
- `/login`, `/portal/login` — Auth pages
- `/admin/*`, `/portal/*`, `/pos/*`, `/provider/*` — Private areas
- `/forms/sms-consent`, `/sms-opt-in` — Form/opt-in pages

---

## Summary

| Action | When |
|--------|------|
| Verify sitemap loads | After deploy |
| Re-submit sitemap in GSC | Today |
| Request indexing for 10–20 priority URLs | Over next few days |
| Check "Why pages aren't indexed" | This week |
| Wait for full indexing | 1–4 weeks |

---

*Reference: docs/SITEMAP-TROUBLESHOOTING.md, docs/GOOGLE-MAPS-ACTION-PLAN.md*
