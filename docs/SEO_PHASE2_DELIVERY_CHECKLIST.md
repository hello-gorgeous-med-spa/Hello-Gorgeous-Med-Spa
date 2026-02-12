# Phase 2 Local SEO – Delivery Checklist

## Required Proof (No “done” without validation)

### 1. Structured Data
- [ ] **Rich Results Test**: https://search.google.com/test/rich-results  
  - Test: `https://www.hellogorgeousmedspa.com/`
  - Test: `https://www.hellogorgeousmedspa.com/botox-oswego-il`
  - Expect: MedicalBusiness, Service, FAQPage (where applicable)
- [ ] **Schema validation**: https://validator.schema.org/
- [ ] Screenshot of passing tests

### 2. Sitemap
- [ ] Sitemap URL: `https://www.hellogorgeousmedspa.com/sitemap.xml`
- [ ] Verify `/community` is included
- [ ] Verify location pages (`/botox-oswego-il`, etc.) are included
- [ ] Submit in Search Console

### 3. PageSpeed
- [ ] Homepage: https://pagespeed.web.dev/  
  - Target: LCP < 2.5s, CLS < 0.1, mobile score > 85
- [ ] Botox page: `/botox-oswego-il`  
- Screenshots of reports

### 4. Review Delay Cron
- [ ] Vercel Cron runs hourly: `0 * * * *` → `/api/cron/review-requests`
- [ ] Test: Mark appointment complete → check `review_requests_pending` → wait 24h (or manually set `scheduled_for` in past) → cron processes
- [ ] Logs: Vercel Dashboard → Cron Jobs → review-requests

### 5. NAP Consistency
- [ ] Match across: website footer, schema, GBP, meta
- [ ] Address: 74 W. Washington Street, Oswego, IL 60503
- [ ] Phone: 630-636-6193
- [ ] URL: https://www.hellogorgeousmedspa.com

### 6. Indexing
- [ ] Search Console: Coverage report
- [ ] Request indexing for key location pages
- [ ] Screenshot of indexing status

---

## Implementation Summary

| Item | Status |
|------|--------|
| Structured data: MedicalBusiness, Service schema | ✓ |
| 24h review delay: pending table + cron | ✓ |
| Image SEO: rename, WebP, alt, <150kb | ✓ |
| GeoContextBlock component | ✓ |
| Footer “Serving” block | ✓ |
| Community page: partnerships, outbound links | ✓ |
| Sitemap: community included | ✓ |
| Event schema (future-ready) | ✓ |
| Map embed: geo from SITE | ✓ |
| Preconnect for Maps | ✓ |
