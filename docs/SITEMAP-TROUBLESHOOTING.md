# Sitemap Troubleshooting — Google Search Console

**Issue:** "Sitemap could not be read" or "Couldn't fetch" in Google Search Console.

---

## What We Fixed

1. **Middleware exclusion** — `sitemap.xml`, `robots.txt`, and the Google verification file are now excluded from the middleware matcher. Googlebot can fetch them without going through auth/session logic.

2. **Correct URL** — Submit `https://www.hellogorgeousmedspa.com/sitemap.xml` (not a page URL like `/services/weight-loss-therapy`).

---

## If It Still Fails After Deploy

1. **Wait 24–48 hours** — Google caches failed fetches. After deploying the fix, wait before re-verifying.

2. **Try with trailing slash** — Submit `https://www.hellogorgeousmedspa.com/sitemap.xml/` to force a fresh fetch (bypasses cache).

3. **Check live** — Open `https://www.hellogorgeousmedspa.com/sitemap.xml` in a browser. You should see valid XML.

4. **Validate** — Use [xml-sitemaps.com](https://www.xml-sitemaps.com/validate-xml-sitemap.html) to confirm the sitemap is valid.

---

## Submit in Search Console

1. Go to **Sitemaps**
2. Remove any incorrect entries (e.g. `/services/weight-loss-therapy`)
3. Enter: `sitemap.xml`
4. Click **Submit**

---

*Reference: docs/GOOGLE-MAPS-ACTION-PLAN.md*
