# SEO-001 — Rank #1 in Oswego & surrounding areas (Local SEO Epic)

**Ticket:** SEO-001 · P0 Epic  
**Requested by:** Dani (Owner)  
**Product:** hellogorgeousmedspa.com (Next.js)  
**Surfaces:** Marketing site · GBP · RE GEN `/rx`  
**Canonical path:** work from main clone only

## Objective

Map pack (top 3) + page-1 organic for every service we offer across the Fox Valley primary cities, with click-through to fast, conversion-optimized landers.

## Scorecard (2026-07-12)

| # | Sub-task | Status | Notes |
|---|---|---|---|
| 1 | GBP complete + NAP + map/reviews | **PARTIAL** | Site NAP/schema + contact map/reviews done. Live GBP categories/card-hold/fee amounts = Dashboard ops. See `gbp-optimization-checklist.md`. |
| 2 | Technical SEO foundation | **PARTIAL** | Schema, sitemap, robots, depth CI done. CWV baseline 2026-07-13: mobile 68–76 (LCP-bound); target ≥90 — see `docs/LIGHTHOUSE_BASELINE.md`. |
| 3 | Service × city landers | **PARTIAL → improved** | SEO-001 gap + Phase D: 16 RX/aesthetic landers + 10 QuantumRF/Solaria ring-city Phase 9 pages (soft templates upgrade when GBP content exists). |
| 4 | On-page metadata | **DONE** | `pageMetadata` / `gbpLocationMetadata` |
| 5 | Review funnel | **DONE** | Square → queue → SMS/email → Google review |
| 6 | RE GEN /rx SEO | **DONE** | Hub + city weight-loss; peptides/HRT city graph expanded in this epic |
| 7 | Content & internal linking | **DONE** | LocationsServed chips: peptides/hormones/IV + QuantumRF/Solaria CO₂ |
| 8 | Tracking / rank | **PARTIAL** | GSC/GA4 live. Monthly cadence: `/admin/local-dominance-sprint` City Rank Scoreboard (28-day GSC) + snapshot notes first Monday each month. |

## Phased sequence (execute in order)

### Phase A — Foundation (Sub-tasks 1, 2, 8)
1. Complete GBP Dashboard checklist (`docs/campaigns/gbp-optimization-checklist.md`).
2. Paste final cancellation policy into Square Appointments → Payments & cancellations (API cannot set policy text).
3. Enable **Hold card for no-show** + fee model closest to site policy ($50/50% late; $100/100% no-show).
4. Confirm GSC property + sitemap + baseline rank snapshot in admin local-dominance.

### Phase B — Matrix landers (Sub-tasks 3, 4)
1. Phase 9 only: `lib/gbp-urls.ts` + 850+ word `LOCATION_PAGE_CONTENT` — **no** thin `app/*-il/page.tsx`.
2. Owner human-review pass on generated suburb copy (especially peptides).
3. Request indexing for new URLs in GSC.

### Phase C — Reviews + RX (Sub-tasks 5, 6)
1. Keep review cron enabled (`REVIEW_REQUESTS_ENABLED`).
2. Link city peptide/HRT/IV pages into RX patient journey where compliant.

### Phase D — Ring devices + content hub (Sub-tasks 3 remainder, 7)
1. ~~Owner decision: promote Quantum RF / Solaria CO₂~~ → **done** for 5 ring cities (Naperville–Montgomery); Oswego keeps dedicated flagship pages.
2. Publish ≥6 cluster articles only if gaps remain after lander push.

## Gap closed in this batch

- `lip-filler-plainfield-il`
- `peptide-therapy-{oswego,naperville,aurora,plainfield,yorkville,montgomery}-il`
- `hormone-therapy-{aurora,plainfield,yorkville,montgomery}-il`
- `iv-therapy-{naperville,aurora,plainfield,yorkville,montgomery}-il`
- `quantum-rf-{naperville,aurora,plainfield,yorkville,montgomery}-il`
- `solaria-co2-{naperville,aurora,plainfield,yorkville,montgomery}-il`
- Removed 301s that blocked aurora HRT and oswego peptide `-il` URLs
- Footer chips: Peptides / Hormones / IV Therapy / QuantumRF / Solaria CO₂
- `[slug]` render order: Phase 9 GBP content beats soft city-device template when both exist

## Remaining (ops / decisions)

- [ ] GBP Dashboard: categories, service areas, card-hold, fee, policy paste
- [ ] Owner copy review of SEO-001 generated blocks (peptides + devices)
- [ ] GSC “Request indexing” in UI for new URLs (API inspect-only)
- [x] CWV measurement on flagship templates — baseline logged (`docs/LIGHTHOUSE_BASELINE.md`); **fix pass** still needed (mobile 68–76 vs ≥90)
- [x] Monthly rank report cadence — defined: first Monday → `/admin/local-dominance-sprint` scoreboard + GSC CWV glance

## Next engineering (perf)

- Hero/LCP pass on `/`, `/faq`, flagship `-il` landers, `/rx` to close CWV gap (see Lighthouse levers doc).

## Implementation refs

- Pattern: `app/[slug]/page.tsx` → `GbpLocationPage` + `LOCATION_PAGE_CONTENT`
- Registry: `lib/gbp-urls.ts`
- Content: `lib/local-seo-content-seo001-gap.ts`, `lib/local-seo-content-devices-gap.ts`
- Depth gate: `scripts/check-seo-content-depth.ts` (prebuild)
- NAP: `lib/seo.ts` `SITE`
