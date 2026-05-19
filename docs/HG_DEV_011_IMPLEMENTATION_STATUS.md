# HG_DEV_011 — Implementation status (production)

**Deployed:** `e42b9270` on `main` (May 2026)  
**Spec:** `docs/HG_DEV_011_Service_Page_Split.md`

## Done in code

| Criterion | Status |
|-----------|--------|
| 23 URLs return HTTP 200 | ✅ e.g. `/botox-oswego`, `/solaria-co2-oswego` |
| Unique title, meta, H1 per page | ✅ `lib/service-pages-oswego/entries.ts` |
| MedicalProcedure + FAQPage JSON-LD | ✅ `components/marketing/ServiceOswegoLanding.tsx` |
| Minimum 5 FAQs per page | ✅ |
| Internal links (2+ related services) | ✅ |
| 301/308 redirects from bundled URLs | ✅ `next.config.js` (Vercel serves **308** for `permanent: true`) |
| Sitemap includes all 23 at priority 0.8 | ✅ `app/sitemap.ts` |
| Single template + data file (not 23 hand pages) | ✅ |

## Gaps vs acceptance criteria

| Criterion | Status | Notes |
|-----------|--------|--------|
| 600+ words (uncontested) | ✅ | Phase 1 Dani copy deployed (`phase1-uncontested.ts`) — ~680–720 words each |
| 1,000+ words (contested) | ⚠️ | Starter copy ~370–500 words; Botox 1,500+ is separate Dani ticket |
| Fresha `serviceId` deep links | ⚠️ | Book buttons use **Square** `BOOKING_URL` until Dani provides Fresha IDs |
| GSC + Bing sitemap resubmit | 🔲 | Manual (Dani/Eric) |
| Rich Results Test all pages | 🔲 | Manual spot-check |
| PageSpeed 80+ mobile (4 uncontested) | 🔲 | Manual check |
| PR screenshots | 🔲 | Skipped (merged direct to `main`) |

## Redirect map (live)

| Old URL | New canonical |
|---------|----------------|
| `/services/botox-dysport-jeuveau` | `/botox-oswego` |
| `/botox-oswego-il` | `/botox-oswego` |
| `/services/morpheus8`, `/services/morpheus8-burst` | `/morpheus8-burst-oswego` |
| `/services/solaria-co2` | `/solaria-co2-oswego` |
| `/services/quantum-rf` | `/quantum-rf-oswego` |
| `/services/weight-loss`, `/services/weight-loss-therapy` | `/glp-1-weight-loss-oswego` |
| `/services/hormone-therapy`, `/services/biote-hormone-therapy` | `/biote-hormone-therapy-oswego` |

## Code locations

- Data: `lib/service-pages-oswego/`
- Template: `components/marketing/ServiceOswegoLanding.tsx`
- Routing: `app/[slug]/page.tsx` (Oswego service slugs)

## Waiting on Dani

1. Fresha service IDs CSV → add as `freshaServiceId` per entry in `entries.ts`
2. Approved differentiator bullets per service (optional polish)
3. Long-form Botox copy (separate ticket)
