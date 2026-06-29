# Hello Gorgeous Med Spa — Engineering Guide (CLAUDE.md)

Production med-spa platform for **hellogorgeousmedspa.com** (Oswego, IL).
**Next.js 15 (App Router) · React 18 · TypeScript · Tailwind · Supabase · Vercel.**

## ⚠️ Where to work (read first)

This Next.js app lives in the **`hello-gorgeous-med-spa/` git submodule**, which is
its own repo (remote: `github.com/hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa`).
The parent folder is just a wrapper that pins the submodule.

- **Do all dev, commits, and pushes from inside `hello-gorgeous-med-spa/`** — that is
  the folder with the real `.git` and the GitHub remote.
- After pushing the submodule, the parent repo needs a `chore: update submodule` commit
  to point at the new SHA (this is what the recent parent commits do).
- Never edit in a `.cursor/worktrees/` mirror — those are read-only copies.

## Run & quality gates

```bash
npm run dev            # local dev (localhost:3000)
npm run lint           # eslint (CI gate; `npm test` is an alias)
npm run build          # next build — prebuild runs mascot/mediapipe sync + SEO depth check
```

CI (`.github/workflows/ci.yml`) on push to `main`: pushes Supabase migrations, then
`npm ci → lint → build → test`. **A green build requires lint + build to pass** — run
both before pushing. Build uses placeholder Supabase env vars, so build-time code must
not require real secrets at module load.

## Architecture

Everything is at the repo root (there is **no `src/` dir** — older docs were wrong):

```
app/        281 route folders — App Router pages + 114 API routes (app/api/**)
components/  ~185 dirs of React components
lib/         ~289 modules — business logic, integrations, auth, content
data/        TS/JSON content (blog posts, menus, SEO city data, peptides)
supabase/    116 SQL migrations (supabase/migrations/**)
scripts/     ~81 one-off + sync scripts (tsx / node), many *:local variants
emails/      transactional email templates (Resend)
public/      static assets
middleware.ts  auth/routing edge middleware
```

Three surfaces share this codebase:
1. **Marketing site** — home, services, and heavy **local-SEO landing pages**
   (`botox-aurora-il`, `dermal-fillers-naperville-il`, `*-oswego-il`, etc.).
2. **Client app** — installable PWA under `/app` (deals, memberships, push, wellness).
3. **Admin / clinical** — `/admin`, `/charting`, `/consents`, `/checkin`; EHR-style
   charting, consents, compliance, campaigns.

## Data & auth

- **Supabase** is the database. Clients: `lib/supabase/{client,server}.ts` (browser vs
  server via `@supabase/ssr`) and `lib/supabase-server.ts`. Use the **server** client +
  RLS in API routes; the browser client is anon-key only.
- **Never use the `service_role` key client-side** — it bypasses Row Level Security.
  Service-role usage belongs only in trusted server code / scripts.
- Auth is mixed: NextAuth + Supabase + custom session helpers
  (`lib/api-auth.ts`, `lib/portal-auth.ts`, `lib/hub-*-auth.ts`, `lib/get-owner-session.ts`).
  Match the helper an adjacent route already uses rather than inventing a new pattern.
- Schema changes = **a new timestamped file in `supabase/migrations/`** (e.g.
  `20260628120000_thing.sql`). CI applies them on merge to `main`. Don't hand-edit prod.

## Integrations (all keyed via env vars; names in `.env.example`)

Payments **Square** + **Stripe** · Booking **Fresha** (webhooks) + Square · SMS/voice
**Twilio** + **Telnyx** · Email **Resend** · Finance **Plaid** · AI **Anthropic** +
**OpenAI** + **ElevenLabs** · Web **push** (VAPID) · **Google Business Profile** + Search
Console · **Meta/Facebook** social posting. Cron jobs are defined in `vercel.json`.

## Conventions

- **TypeScript + Tailwind**, App Router server components by default; add `"use client"`
  only when needed. Mirror the structure/naming of neighboring files.
- Brand colors: hotPink `#E91E8C`, pink `#FF69B4`, gold accents (`tailwind.config.ts`).
  Premium marketing pages also use HG stamp-card tokens (`#E6007E`, `#FF2D8E`, thick black
  borders) — see `.cursor/rules/hg-premium-page-template.mdc` and `components/faq/FaqPageContent.tsx`.
- New API route → `app/api/<name>/route.ts`; validate input (zod is available) and reuse
  the existing auth + Supabase server helpers.
- New SEO landing page → copy an existing `*-il` route; keep per-page metadata + JSON-LD
  (`MedicalBusiness`/`LocalBusiness`/`FAQPage`). Don't disable indexing.

## Site architecture (2026 audit — Phases 1–7)

Canonical config lives in `lib/` — extend these modules instead of one-off nav/footer copies.

| Phase | What | Key files |
|-------|------|-----------|
| **1** | Unified review proof, one booking CTA, leaner footer/meta | `lib/primary-cta.ts`, footer components |
| **2** | Primary nav → **5 hubs**: Services · Shop RX · Specials · About · Book | `lib/site-primary-nav.ts` |
| **3** | **Two doors** sitewide: Med Spa vs Hello Gorgeous RX | `lib/site-two-doors.ts`, `components/TwoDoorsForkBand.tsx` |
| **4** | City SEO tiers: primary Fox Valley hubs, deindex + 301 far-flung cities | `lib/city-seo-tier.ts`, `lib/city-hub-content.ts`, `next.config.js` redirects |
| **5** | **RX Request Portal** — Hims-style goal + form-factor catalog at `/rx/request` | `lib/rx-request-portal.ts`, `components/rx/RxRequestPortal.tsx`, `app/rx/request/page.tsx` |
| **6** | **Illinois excellence** — conversion hierarchy, NP trust band, provider faces on key hubs | `lib/illinois-excellence.ts`, `lib/medical-trust.ts`, `components/MedicalTrustBand.tsx`, `components/IllinoisExcellenceBand.tsx` |
| **7** | **Service + local dominance + RX funnel** — service CTAs, city Google actions, catalog→portal journey | `lib/local-dominance.ts`, `lib/rx-patient-journey.ts`, `components/rx/RxPatientJourneyBand.tsx`, `ServiceMenuPageLayout`, `CityHubLocalBlock` |

**RX Request Portal:** goal cards (weight loss, hormones, peptides, sexual health, hair & skin,
vitamins & IV) + injectable/capsule/troche/patch/topical filters. **Pricing must come from
existing libs** (`peptide-retail-pricing`, `glp1-program-pricing`, `hrt-formulation-catalog`,
`iv-drip-menu`) — never hardcode placeholder prices. Wired from `/rx` hero, medical mega menu,
patient portal dashboard, and sitemap.

**City SEO:** primary slugs = `oswego`, `naperville`, `aurora`, `plainfield`, `yorkville`,
`montgomery`. Far-flung cities in `DEINDEXED_CITY_REDIRECT_TARGETS` 301 to nearest primary hub —
keep `city-seo-tier.ts` and `next.config.js` in sync when adding/removing cities.

**Phase 6 conversion:** one primary action sitewide (`lib/primary-cta.ts` → `/book`). Secondary:
RX portal, app, catalog (`lib/illinois-excellence.ts` `CONVERSION_HIERARCHY`). Reuse
`MedicalTrustBand` on RX, club, and services hubs — do not duplicate provider copy.

**Phase 7 funnel:** `RxPatientJourneyBand` on `/rx` and `/rx/request`; city hubs use
`LOCAL_DOMINANCE_ACTIONS` in `CityHubLocalBlock` (book, directions, Google review). Service
menu pages default booking to `PRIMARY_BOOKING_CTA`.

## Content & legal guardrails (medical / advertising)

- **Never disparage or make comparative claims about competitors** (defamation / Lanham
  Act risk). Sell Hello Gorgeous on its own strengths.
- This is a **medical** business: no diagnosis, dosing, or outcome guarantees in marketing
  copy; keep medical claims defensible. Treat client/patient data as PHI-adjacent — don't
  log it, don't expose it in client bundles, don't paste it into prompts.

## Secrets hygiene

`.env.local` and `.claude/settings.local.json` are gitignored — keep them that way and
**never paste live secrets (service-role JWTs, DB passwords, access tokens) into committed
files, CLAUDE.md, or chat**. Rotate anything that leaks. Production env lives in Vercel.

## Deploy

Vercel auto-deploys `main` to hellogorgeousmedspa.com. Verify with
`vercel ls` / `vercel logs <url>`. Commit/push only when asked; branch off `main` first.
