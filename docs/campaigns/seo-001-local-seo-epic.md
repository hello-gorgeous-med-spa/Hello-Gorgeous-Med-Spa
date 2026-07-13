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
| 2 | Technical SEO foundation | **PARTIAL** | Schema, sitemap, robots, depth CI done. CWV not CI-gated. |
| 3 | Service × city landers | **PARTIAL → improved** | SEO-001 gap batch added 16 Phase 9 landers (lip Plainfield, peptides ×6, HRT ×4, IV ×5). Quantum/Solaria remain soft device routes / Oswego-first by design pending owner decision. |
| 4 | On-page metadata | **DONE** | `pageMetadata` / `gbpLocationMetadata` |
| 5 | Review funnel | **DONE** | Square → queue → SMS/email → Google review |
| 6 | RE GEN /rx SEO | **DONE** | Hub + city weight-loss; peptides/HRT city graph expanded in this epic |
| 7 | Content & internal linking | **DONE** | LocationsServed chips extended for peptides/hormones/IV |
| 8 | Tracking / rank | **PARTIAL** | GSC/GA4/rank tooling present; monthly cadence is ops |

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
1. Owner decision: promote Quantum RF / Solaria CO₂ to Phase 9 GBP for all 6 cities **or** keep Oswego-flagship + soft city-seo routes.
2. Publish ≥6 cluster articles only if gaps remain after lander push.

## Gap closed in this batch

- `lip-filler-plainfield-il`
- `peptide-therapy-{oswego,naperville,aurora,plainfield,yorkville,montgomery}-il`
- `hormone-therapy-{aurora,plainfield,yorkville,montgomery}-il`
- `iv-therapy-{naperville,aurora,plainfield,yorkville,montgomery}-il`
- Removed 301s that blocked aurora HRT and oswego peptide `-il` URLs
- Footer chips: Peptides / Hormones / IV Therapy

## Remaining (ops / decisions)

- [ ] GBP Dashboard: categories, service areas, card-hold, fee, policy paste
- [ ] Owner copy review of SEO-001 generated blocks
- [ ] Quantum RF + Solaria city strategy
- [ ] CWV measurement on flagship templates (mobile ≥90)
- [ ] Monthly rank report cadence

## Implementation refs

- Pattern: `app/[slug]/page.tsx` → `GbpLocationPage` + `LOCATION_PAGE_CONTENT`
- Registry: `lib/gbp-urls.ts`
- Content: `lib/local-seo-content-seo001-gap.ts`
- Depth gate: `scripts/check-seo-content-depth.ts` (prebuild)
- NAP: `lib/seo.ts` `SITE`
