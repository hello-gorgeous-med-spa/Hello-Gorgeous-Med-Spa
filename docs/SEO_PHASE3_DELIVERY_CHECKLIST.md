# Phase 3 Local Authority – Delivery Checklist

## Required Proof

### 1. Rich Results Test
- Homepage: https://search.google.com/test/rich-results?url=https://www.hellogorgeousmedspa.com/
- Botox page: https://search.google.com/test/rich-results?url=https://www.hellogorgeousmedspa.com/botox-oswego-il
- Expect: MedicalBusiness, AggregateRating, BreadcrumbList, FAQPage, Review (testimonials)
- Screenshot of passing tests

### 2. Breadcrumb Validation
- Breadcrumb test: https://validator.schema.org/
- Confirm BreadcrumbList on all location/treatment pages

### 3. PageSpeed
- Target: Mobile > 85, LCP < 2.5s, CLS < 0.1
- Test: https://pagespeed.web.dev/
- Homepage and /botox-oswego-il
- Screenshot of reports

### 4. Schema & CLS
- No schema duplication warnings in Search Console
- No CLS shift (check layout stability)
- Confirm sitemap auto-updated

### 5. GBP Review Link
- Set `NEXT_PUBLIC_GOOGLE_PLACE_ID` for one-click review URL
- Test review link: https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
- UTM params present for tracking

### 6. Maps Directions
- "Get Directions" button on map embed
- UTM: utm_source=website&utm_medium=local&utm_campaign=maps_click
- GA4 event tracking on click (if configured)

---

## Implementation Summary

| Item | Status |
|------|--------|
| AggregateRating from SITE.reviewRating/reviewCount | ✓ |
| Breadcrumb schema on location + treatment pages | ✓ |
| Treatment-level FAQs (3–5 localized) | ✓ |
| Content depth 900+ words (lib/local-seo-content) | ✓ (expand if needed) |
| Build warning for content < 900 words | ✓ |
| Review schema for homepage testimonials | ✓ |
| Homepage contextual internal links | ✓ |
| Map Get Directions + UTM | ✓ |
| GBP review link with placeid | ✓ |
