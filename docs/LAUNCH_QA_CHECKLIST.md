# Launch QA Checklist — Pass/Fail

**Date:** 2026-02-07  
**Scope:** Launch validation + Google readiness (no new features).

---

## 1. Final QA / Verification

| Check | Result | Notes |
|-------|--------|--------|
| All service + city pages return 200 | **PASS** | Verified: `/`, `/botox-oswego-il`, `/med-spa-naperville-il`, `/weight-loss-plainfield-il`, `/med-spa-yorkville-il` (and build lists 19 `[localSlug]` paths). |
| Canonical URLs correct per page | **PASS** | `pageMetadata({ path: \`/${slug}\` })` → canonical `https://hellogorgeousmedspa.com/{slug}`. Checked `/botox-oswego-il` → `https://hellogorgeousmedspa.com/botox-oswego-il`. |
| No duplicate JSON-LD | **PASS** | Each page has distinct types: layout = Organization + WebSite; local service page = + LocalBusiness (siteJsonLd), MedicalProcedure (serviceJsonLd), FAQPage (faqJsonLd). No identical duplicate blocks. |
| Sitemap includes all GBP + med-spa URLs | **PASS** | `sitemap.ts` uses `GBP_SERVICE_SLUGS` + `MED_SPA_LOCATION_SLUGS` for `gbpRoutes`. Sitemap contains e.g. `botox-oswego-il`, `med-spa-oswego-il`, `med-spa-yorkville-il`. 104 URLs total. |

---

## 2. Analytics Sanity Check

| Check | Result | Notes |
|-------|--------|--------|
| GA4 + GTM load only once | **PASS** | Single `<GoogleAnalytics />` in root `layout.tsx`; one GTM script, one GA4 config when env vars set. |
| phone_click, email_click, sms_click, book_now_click fire correctly | **PASS** | Delegated click listener in `GoogleAnalytics.tsx` (tel:, mailto:, sms:, book or data-book-now) → `trackEvent()` → dataLayer + gtag. |
| No tracking on /admin, /portal, /login | **PASS** | **Fixed.** `GoogleAnalytics` now uses `usePathname()`; when path starts with `/admin`, `/portal`, or `/login`, component returns `null` (no scripts) and conversion listener is disabled. |

---

## 3. Performance Pass

| Item | Finding |
|------|--------|
| **LCP (Largest Contentful Paint)** | On local pages (`/[localSlug]`), the main content is the hero **Section** with gradient background and **H1** (e.g. “Botox, Dysport & Jeuveau in Oswego”). No hero image; **LCP element is the H1 / hero text block**. Ensure font is ready (Inter with `display: "swap"` is in use). |
| **CLS risks** | **Fonts:** Inter loaded via `next/font` with `display: "swap"` — low CLS risk. **Hero images:** Local GBP pages have no hero image — low risk. **Popup:** `LeadCapturePopup` appears after 3s; can cause layout shift when it opens. Consider reserving space or using a non-layout-shifting placement. |
| **Core Web Vitals** | No automated run in this pass. Recommend post-deploy check in PageSpeed Insights / Search Console for LCP, INP, CLS on key URLs (e.g. `/`, `/botox-oswego-il`, `/contact`). |

---

## 4. Launch Checklist

| Check | Result | Notes |
|-------|--------|--------|
| robots.txt is indexable | **PASS** | `Allow: /` present. **Updated** `public/robots.txt` to add `Sitemap: https://hellogorgeousmedspa.com/sitemap.xml` so Search Console can discover sitemap. |
| noindex NOT applied to local pages | **PASS** | Local pages emit `<meta name="robots" content="index, follow"/>`. Only (auth) layout and provider layout set noindex (login/portal). |
| Ready for Search Console sitemap submission | **PASS** | Sitemap at `https://hellogorgeousmedspa.com/sitemap.xml`; listed in robots.txt. Submit this URL in GSC. |

---

## Required Fixes Applied (No Refactors)

1. **Analytics: no tracking on /admin, /portal, /login**  
   - **File:** `components/GoogleAnalytics.tsx`  
   - **Change:** Path-aware component using `usePathname()`. If path starts with `/admin`, `/portal`, or `/login`, render `null` and do not attach conversion listener.  
   - **Result:** GTM/GA4 scripts and conversion events do not load or fire on these routes.

2. **robots.txt: Sitemap URL for Search Console**  
   - **File:** `public/robots.txt`  
   - **Change:** Added `Sitemap: https://hellogorgeousmedspa.com/sitemap.xml`. Kept `Allow: /` and existing `Disallow: /api/`, `Disallow: /private/`.  
   - **Result:** Crawlers can discover sitemap; ready for GSC sitemap submission.

---

## Deployment Readiness

**Ready to deploy** for launch validation and Google readiness:

- All listed QA and launch checks pass.
- Only the two targeted fixes above were made (analytics path exclusion, robots.txt sitemap).
- No refactors; no new features.

After deploy, recommended next steps:

1. Submit `https://hellogorgeousmedspa.com/sitemap.xml` in Google Search Console.
2. Run PageSpeed Insights (or CWV in GSC) on a few key URLs.
3. Optionally run a quick smoke test: confirm GA4/GTM and conversion events on a public page, and confirm they do not load on `/login`, `/admin`, `/portal`.
