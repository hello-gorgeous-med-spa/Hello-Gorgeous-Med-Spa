# HG_DEV_011 — Split bundled service pages into 23 individual SEO-targeted URLs

**Owner:** Eric
**Reviewer:** Dani
**Priority:** P0 (blocks Day 4+ SEO work)
**Type:** Frontend / SEO
**Estimate:** 5–7 hours focused
**Repo:** hellogorgeousmedspa.com (Next.js / Vercel)
**Branch:** `feat/service-page-split`
**Related:** Zero-Budget SEO Plan v2, Move #1

---

## Why

HER Aesthetics outranks Hello Gorgeous on Botox in Oswego because she has 18 dedicated service URLs while ours are bundled (e.g., `/services/botox-dysport-jeuveau` covers three keyword targets in one page). Google ranks each URL independently — bundling caps our ceiling.

This ticket splits our service catalog into 23 individual URLs, each targeting a single primary keyword, each with schema markup, each deep-linked to a service-specific Fresha booking flow.

Four of the 23 are **uncontested** in Oswego search — we will rank #1 by default the moment these pages exist with even minimal content (Solaria CO2, Quantum RF, Peptide Therapy, NAD IV).

---

## Scope

### In scope
- Create a `/services/[slug]` dynamic route (or equivalent in current routing structure — check existing `/services/` folder first)
- Scaffold 23 new service pages from a single template + metadata CSV
- Add MedicalProcedure + FAQPage schema to each page
- 301 redirect all old bundled URLs to their new canonical equivalents
- Update sitemap.xml to include all 23 URLs
- Resubmit sitemap to Google Search Console + Bing Webmaster Tools
- Verify each page passes Google's Rich Results Test before merge

### Out of scope (do NOT do in this ticket)
- Schema markup on homepage (separate ticket — HG_DEV_012)
- Meta titles/descriptions on non-service pages (separate ticket)
- Homepage rebuild — founder section, Patient Favorites, testimonials (separate ticket — HG_DEV_013)
- Botox landing page long-form copy (Dani drafts, separate ticket)
- Site-wide design changes
- Performance optimization beyond what the template enforces

If something feels in-scope but isn't listed, ask before building it.

---

## The 23 URLs

| # | New URL slug | Target keyword | Contested? | Old URL to 301 |
|---|--------------|----------------|------------|----------------|
| 1 | `/botox-oswego` | botox oswego | Yes (HER #1) | `/services/botox-dysport-jeuveau`, `/botox-oswego-il` |
| 2 | `/dysport-oswego` | dysport oswego | Yes | `/services/botox-dysport-jeuveau` |
| 3 | `/jeuveau-oswego` | jeuveau oswego | Light | `/services/botox-dysport-jeuveau` |
| 4 | `/dermal-fillers-oswego` | dermal fillers oswego | Yes | existing fillers page if any |
| 5 | `/lip-filler-oswego` | lip filler oswego | Yes | — |
| 6 | `/morpheus8-burst-oswego` | morpheus8 burst oswego | We already rank | `/services/morpheus8-burst` |
| 7 | **`/solaria-co2-oswego`** | **solaria co2 oswego** | **UNCONTESTED** | `/services/solaria-co2` |
| 8 | **`/quantum-rf-oswego`** | **quantum rf oswego** | **UNCONTESTED** | `/services/quantum-rf` |
| 9 | `/semaglutide-oswego` | semaglutide oswego | Yes | `/services/weight-loss` |
| 10 | `/tirzepatide-oswego` | tirzepatide oswego | Yes | `/services/weight-loss` |
| 11 | `/glp-1-weight-loss-oswego` | glp-1 weight loss oswego | Light | `/services/weight-loss` |
| 12 | `/biote-hormone-therapy-oswego` | biote oswego, hormone therapy oswego | Light | `/services/hormone-therapy` |
| 13 | `/testosterone-replacement-oswego` | trt oswego | Light | — |
| 14 | **`/peptide-therapy-oswego`** | **peptide therapy oswego** | **UNCONTESTED** | — |
| 15 | `/iv-therapy-oswego` | iv therapy oswego | Yes (HER ranks) | — |
| 16 | **`/nad-iv-oswego`** | **nad iv oswego** | **UNCONTESTED** | — |
| 17 | `/laser-hair-removal-oswego` | laser hair removal oswego | Yes | — |
| 18 | `/microneedling-oswego` | microneedling oswego | Yes | — |
| 19 | `/facials-oswego` | facials oswego, hydrafacial oswego | Light | — |
| 20 | `/dermaplaning-oswego` | dermaplaning oswego | Light | — |
| 21 | `/chemical-peel-oswego` | chemical peel oswego | Yes | — |
| 22 | `/prp-oswego` | prp oswego | Light | — |
| 23 | `/vitamin-injections-oswego` | b12 shots oswego, vitamin injections oswego | Light | — |

**Bolded rows are uncontested keywords.** Prioritize building those 4 pages first — they ship value immediately.

---

## Page template (every page must include these elements)

Each service page must follow this structure. Use a single React/MDX template that pulls from a metadata source (JSON or CSV). Do not write 23 separate page files by hand.

### Required elements (in order)

1. **`<title>`** — format: `{Service} in Oswego, IL | Hello Gorgeous Med Spa`
2. **`<meta description>`** — 150–160 chars, primary keyword in first 100 chars, ends with CTA
3. **H1** — primary keyword in plain text, e.g. `Botox in Oswego, IL`
4. **Hero section** — H1 + 1-sentence value prop + primary CTA (book button)
5. **"Why Hello Gorgeous for [Service]" section** — 4–5 bullets pulling from our differentiators (NP on site, $10/unit if Botox, only-in-Oswego device if applicable, same-day appointments)
6. **"What is [Service] / How it works" section** — 150–250 words of plain-language education. Pull from existing service descriptions if available; placeholder allowed for first deploy if not
7. **"What to expect at your appointment" section** — 3–4 steps, ~100 words
8. **FAQ section** — minimum 5 Q&As, wrapped in FAQPage schema
9. **Closing CTA** — book button, phone number, "Free consultation" line
10. **Internal links** — every page links to at least 2 related service pages (e.g., Botox page links to Dysport and Lip Filler)

### Template variables (per page)

```ts
type ServicePageData = {
  slug: string;                    // "botox-oswego"
  serviceName: string;             // "Botox"
  fullServiceName: string;         // "Botox, Dysport & Jeuveau"
  targetKeyword: string;           // "botox oswego"
  metaTitle: string;
  metaDescription: string;
  h1: string;
  valueProp: string;               // 1-sentence pitch under H1
  freshaServiceId: string;         // for booking deep link
  procedureType: string;           // for schema: "Injection" | "Laser" | "Topical" | etc.
  bodyLocation?: string;           // for schema: "Face" | "Body" | etc.
  whyBullets: string[];            // 4-5 differentiator bullets
  howItWorksContent: string;       // markdown body
  whatToExpectSteps: string[];     // 3-4 steps
  faqs: { q: string; a: string }[];
  relatedServices: string[];       // 2-3 slugs for internal links
  inMode Badge?: "morpheus8" | "solaria" | "quantum";  // if applicable
};
```

Store this data in `data/services/[slug].json` or a single `services.json` keyed by slug. Whatever fits the existing repo conventions.

### Minimal content rules

- **Uncontested pages (4)** — 600 words minimum. Easy ranking, lower content bar.
- **Contested pages (the rest)** — 1,000 words minimum. Botox page should aim for 1,500+ but that's a separate Dani-drafted ticket; ship a 1,000-word starter version here.
- **Every page** ships with at least 5 FAQs. Claude Code can draft these from the target keyword + service description.

---

## Schema requirements

Each page must include **two** JSON-LD blocks in the `<head>`:

### 1. MedicalProcedure

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  "name": "{serviceName} in Oswego, IL",
  "procedureType": "{procedureType}",
  "bodyLocation": "{bodyLocation}",
  "performer": {
    "@type": "MedicalBusiness",
    "name": "Hello Gorgeous Med Spa",
    "url": "https://www.hellogorgeousmedspa.com",
    "telephone": "+1-630-636-6193",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "74 W Washington St",
      "addressLocality": "Oswego",
      "addressRegion": "IL",
      "postalCode": "60543"
    }
  }
}
```

### 2. FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{faqs[0].q}",
      "acceptedAnswer": { "@type": "Answer", "text": "{faqs[0].a}" }
    }
    // ... rest of FAQs
  ]
}
```

Render both via `next/head` or `<script type="application/ld+json">` blocks. Verify each page in [Google's Rich Results Test](https://search.google.com/test/rich-results) before merging.

---

## Fresha deep link booking

Each "Book Now" button on a service page must use that service's specific Fresha service ID, not the generic shop URL.

**Generic URL (do NOT use on service pages):**
```
https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245
```

**Deep-linked URL (use this pattern):**
```
https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&serviceId={SERVICE_ID}&share=true&pId=95245
```

Dani will provide the Fresha service ID for each of the 23 services — request the list from her before starting. If a service doesn't have a corresponding Fresha service yet (e.g. peptide therapy may not exist in Fresha), fall back to the generic URL and flag it in the PR description.

---

## 301 redirects

All old bundled URLs that are being replaced must redirect (301, permanent) to their new canonical URL. Old URLs to redirect:

```
/services/botox-dysport-jeuveau   → /botox-oswego
/services/morpheus8-burst          → /morpheus8-burst-oswego
/services/solaria-co2              → /solaria-co2-oswego
/services/quantum-rf               → /quantum-rf-oswego
/services/weight-loss              → /glp-1-weight-loss-oswego
/services/hormone-therapy          → /biote-hormone-therapy-oswego
/botox-oswego-il                   → /botox-oswego
```

If additional bundled URLs exist that I haven't listed, identify them, propose the redirect target in the PR description, and wait for Dani's approval before adding.

Use Next.js `next.config.js` redirects array. Verify each redirect returns HTTP 301 (not 302) using `curl -I {old_url}`.

**Do NOT delete the old pages.** The 301 handles the SEO; the file deletion is a separate cleanup ticket once Search Console confirms the new URLs are indexed.

---

## Sitemap & indexing

1. Add all 23 new URLs to `sitemap.xml` (or the dynamic sitemap generator if one exists)
2. Set `<lastmod>` to the deploy date for each
3. Set `<priority>` to `0.8` for service pages (homepage stays at `1.0`)
4. Submit updated sitemap to:
   - [Google Search Console](https://search.google.com/search-console) → Sitemaps → Submit
   - [Bing Webmaster Tools](https://www.bing.com/webmasters) → Sitemaps → Submit
5. Request indexing for each of the 4 uncontested URLs via Search Console URL Inspection tool (they should rank fastest)

---

## Acceptance criteria

**Eric, this ticket is done when ALL of the following are true:**

- [ ] 23 new URLs exist and return HTTP 200
- [ ] Each URL has unique `<title>` and `<meta description>` matching the spec
- [ ] Each URL has a unique H1 containing the target keyword
- [ ] Each URL has MedicalProcedure + FAQPage JSON-LD that validates in Google's Rich Results Test
- [ ] Each URL has minimum 5 FAQs
- [ ] Uncontested pages have 600+ words; contested pages have 1,000+ words
- [ ] Each URL has a working "Book Now" button using the service-specific Fresha deep link (or flagged in PR if no Fresha service exists)
- [ ] Each URL links internally to at least 2 related service pages
- [ ] All 7 listed 301 redirects are in place and return HTTP 301 when tested
- [ ] `sitemap.xml` includes all 23 new URLs
- [ ] Sitemap is resubmitted to Google Search Console and Bing Webmaster Tools
- [ ] PageSpeed Insights mobile score is 80+ for the 4 uncontested pages (sample check)
- [ ] Pull request opened with screenshots of: (1) Rich Results Test passing for `/botox-oswego`, (2) one rendered page in mobile viewport, (3) `curl -I` output showing 301 on the old Botox URL
- [ ] Dani reviews and approves before merge to main

---

## Suggested execution order

If using Claude Code, this is the recommended sequence:

1. **Inventory current site** — `view` the existing `/services/` folder, identify all current service URLs, confirm which need redirecting
2. **Build the template** — single React/MDX page component with all required sections, props, and schema blocks
3. **Build the data file** — `services.json` with all 23 entries. Use placeholder content for body sections; Dani fills in real content post-launch
4. **Generate the 4 uncontested pages first** — they ship the most value with the least content burden. Verify the full pipeline (URL → schema → Fresha link → Rich Results Test) works end-to-end on these before generating the other 19
5. **Generate the remaining 19 pages** using the validated template
6. **Add redirects** to `next.config.js`
7. **Update sitemap**
8. **Deploy to a preview environment**, run Rich Results Test on each page, fix any schema errors
9. **Deploy to production**
10. **Resubmit sitemap, request indexing on the 4 uncontested URLs**
11. **Open PR with the screenshots from acceptance criteria**

---

## Questions for Dani before starting

Eric — get these answers from Dani in one batch before you start. Don't start the ticket until you have them.

1. **Fresha service IDs** — Dani needs to log into Fresha admin, click each of the 23 services, and copy the service ID into a CSV or message. If a service doesn't exist in Fresha yet, mark it "N/A" and we'll fall back to the generic booking URL.
2. **Existing service content** — does any of the current Hello Gorgeous content cover these 23 services in a way that's worth pulling forward into the new pages? If yes, where? (Likely the existing `/services/*` pages, the blog, and the book "Hello Gorgeous — The Book")
3. **Image inventory** — does Dani have at least one decent photo (or want to generate one) for each of the 23 services? Photo per page is helpful but not blocking — placeholder + alt text works for v1
4. **Approved differentiators per service** — for the "Why Hello Gorgeous for [Service]" section, Dani should approve which 4-5 differentiators apply to each service. Some are universal (NP on site, free consults, Best of Oswego); some are service-specific ($10/unit for Botox, only-in-area device for Trifecta services, NP-supervised for GLP-1)

---

## Notes

- **Branch naming:** `feat/service-page-split`
- **Commit style:** match existing repo convention
- **No site-wide design changes.** Use existing component library and styling.
- **If anything is ambiguous, ask Dani in Slack/text before guessing.** This ticket touches 23 URLs and dozens of redirects — small errors compound fast.
- **Don't merge without Dani's review.** She owns the brand voice on every page.

---

*This ticket is part of the Zero-Budget SEO Plan v2 (May 18, 2026). It is the prerequisite for HG_DEV_012 (schema markup site-wide), HG_DEV_013 (homepage rebuild), and the upcoming Botox landing page content ticket.*
