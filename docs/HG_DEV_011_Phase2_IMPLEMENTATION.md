# HG_DEV_011 Phase 2 — Implementation

**Status:** Wired in repo (not yet deployed unless `main` includes the Phase 2 commit).

## Data

- **Source:** `docs/HG_DEV_011_Phase2_Content.md` (19 JSON blocks)
- **Runtime:** `lib/service-pages-oswego/phase2-pages.ts` (generated)
- **Catalog:** `lib/service-pages-oswego/index.ts` → `PHASE2_PAGES` (19) + `PHASE1_UNCONTESTED_PAGES` (4) = **23 URLs**

## Regenerate after copy edits

```bash
node scripts/generate-phase2-pages.mjs docs/HG_DEV_011_Phase2_Content.md
```

Maps `howItWorksContent` → `howItWorksParagraphs`, strips duplicate brand from `metaTitle`, maps procedure types to `ServicePageData`, sets `tier: contested` for the 11 Tier-1 slugs.

## Voice review

Dani checklist is in the content doc (pricing, clinical claims, differentiators). Approve copy before marketing push.
