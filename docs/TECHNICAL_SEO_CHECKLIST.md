# Technical SEO Checklist

## Before / after notes (implementation summary)

### Canonicals, meta, OG/Twitter

- **Before:** Default metadata in layout; some pages had custom titles/descriptions.
- **After:** 
  - `lib/seo.ts` `pageMetadata()` used on key pages for unique title, description, canonical, Open Graph, Twitter.
  - Root layout sets `metadataBase`, default title template, OG/Twitter images.
  - All new GBP and med-spa pages use `generateMetadata` with unique titles and descriptions.

### Sitemap & robots

- **Before:** `app/sitemap.ts` and `app/robots.ts` existed; sitemap included services and city hubs.
- **After:** 
  - Sitemap includes all GBP-style URLs and med-spa location URLs.
  - `/reviews` and `/vip` added to static routes.
  - Robots: allow all, sitemap URL and host set.

### Redirects (www / non-www, http → https)

- **Before:** Not enforced in code (handled by Vercel/hosting).
- **After:** No app-level redirects added. Confirm in Vercel (or hosting) that:
  - HTTPS is enforced.
  - Preferred domain (www vs non-www) is set and the other redirects to it.

### Schema (JSON-LD)

- **Before:** Organization in layout; LocalBusiness/MedicalBusiness and others in `lib/seo.ts`; some pages injected `siteJsonLd()`.
- **After:** 
  - **WebSite + SearchAction** added in root layout (`websiteJsonLd()` in `lib/seo.ts`) for sitelinks search box.
  - **Organization** still in layout.
  - **LocalBusiness/MedicalBusiness** via `siteJsonLd()` on contact and key pages.
  - **Service** (MedicalProcedure) and **FAQPage** on service and GBP pages.
  - **BreadcrumbList** helper available; use on templates as needed.
  - Review markup: `siteJsonLd()` includes `aggregateRating` and `review`; ensure it matches Google’s review guidelines and is backed by real reviews.

### Indexation

- No duplicate title/meta intended; each route uses its own metadata.
- Canonicals set via `pageMetadata()` and layout.
- No indexation blockers in robots.

### Core Web Vitals

- Not changed in this pass. Recommend running Lighthouse (mobile) and fixing LCP, CLS, INP as needed (images, fonts, layout shifts).

### H1 / H2 structure

- GBP and med-spa pages: single H1, clear H2s for sections and FAQs.
- Contact, reviews, VIP: clear H1 and section headings.

---

## Quick checklist (run before launch)

- [ ] Vercel: HTTPS enforced, www vs non-www decided and redirects set.
- [ ] Set `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in production.
- [ ] Set `NEXT_PUBLIC_GOOGLE_PLACE_ID` for `/reviews` QR and review link.
- [ ] Validate schema: [Google Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Submit sitemap in Google Search Console: `https://hellogorgeousmedspa.com/sitemap.xml`.
- [ ] Run mobile Core Web Vitals and fix critical issues.
