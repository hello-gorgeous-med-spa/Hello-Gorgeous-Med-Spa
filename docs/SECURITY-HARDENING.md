# Security Hardening – Final Confirmation

**Project:** hellogorgeousmedspa.com  
**Date:** Post-implementation

---

## Confirmation in writing

- **`/api/dashboard` secured** — Owner-only. Uses `getOwnerSession()`; returns 401 Unauthorized if not authenticated or role is not `owner`. Rate limited 20 requests per IP per hour (Supabase `api_rate_limit_inc`).

- **All public APIs validated** — Request bodies are validated with Zod before use:
  - **`/api/journey/roadmap`** — `journeyIntakeSchema` (enums, string lengths, `.strict()`). Body size limit 100KB. Returns 400 on invalid input.
  - **`/api/hormone/blueprint`** — `hormoneBlueprintSchema` (same). Returns 400 on invalid input.
  - **`/api/chat`** — `chatBodySchema` (personaId enum, messages array length/content, `.strict()`). Body size limit 200KB. Returns 400 on invalid input.
  No AI or business logic runs before validation passes.

- **All public APIs rate-limited** —
  - **Journey** — 5 per IP per hour (existing `journey_rate_limit_inc`).
  - **Hormone** — 5 per IP per hour (existing `hormone_rate_limit_inc`).
  - **Dashboard** — 20 per IP per hour (`api_rate_limit_inc`, bucket `dashboard:{ip}`).
  - **Chat** — 10 per IP per hour (`api_rate_limit_inc`, bucket `chat:{ip}`).
  All return 429 when exceeded; abuse is logged (truncated IP + count).

- **Security headers active** — Set in `next.config.js` for `/(.*)`:
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy` (default-src 'self'; script/style/img/font/connect/frame rules; frame-ancestors 'none').

- **No secrets exposed** — No API keys or secrets in source; all use `process.env.*`. `.gitignore` excludes `.env` (only `.env.example` with placeholders is committed).

- **Duplicate Apple Pay files removed** — Verification route now serves only from `public/.well-known/apple-developer-merchantid-domain-association`. No fallback to `public/SQUARE_APPLE_PAY` or other paths. Ensure that URL returns 200 in production.

- **Runtime vulnerabilities** — `npm audit fix` was run. Remaining high findings are in **dev-only** dependencies (eslint, minimatch, glob). No runtime-critical fixes were skipped; no blind major upgrades.

- **AI prompts server-side only** — All AI prompts and calls live in API routes (`/api/hormone/blueprint`, `/api/journey/roadmap`, `/api/chat`). Frontend only sends validated input and displays API responses.

---

## Bot mitigation (Turnstile)

- **`lib/turnstile.ts`** — Verifies token via Cloudflare `siteverify`. When `TURNSTILE_SECRET_KEY` is **not** set, verification is skipped (backward compatible).
- When `TURNSTILE_SECRET_KEY` **is** set, a valid `turnstile_token` must be sent in the request body; otherwise the request is rejected with 400 before any AI call.
- Optional `turnstile_token` added to:
  - `journeyRoadmapSchema` / journey intake
  - `hormoneBlueprintSchema` / hormone intake
  - `chatSchema` / chat body

To enable bot protection: set `TURNSTILE_SECRET_KEY` in Vercel and add the Turnstile widget to the Hormone, Roadmap, and Chat UIs; send the token as `turnstile_token` in the same payload.

---

## New/updated assets

| Item | Location |
|------|----------|
| Dashboard auth | `app/api/dashboard/route.ts` — `getOwnerSession()`, 401, rate limit |
| Zod schemas + helpers | `lib/api-validation.ts` — parseBodyWithLimit, invalidInputResponse, journey/hormone/chat schemas |
| Security headers | `next.config.js` — headers for `/(.*)` |
| Generic rate limit | `supabase/migrations/20250225000000_api_rate_limit.sql` — `api_rate_limit` table + `api_rate_limit_inc` |
| Dashboard rate limit | `app/api/dashboard/route.ts` — 20/hour per IP |
| Chat rate limit | `app/api/chat/route.ts` — 10/hour per IP |
| Apple Pay single path | `app/api/apple-pay-verification/route.ts` — only `.well-known` file |
| Turnstile verify | `lib/turnstile.ts`; used in journey, hormone, chat routes |

---

## Platform status

The site is configured for production hardening: dashboard is owner-only and rate-limited, public AI and chat endpoints are validated with Zod and rate-limited, security headers are applied, Apple Pay verification uses a single canonical file, and optional Turnstile verification is in place for AI routes. No critical logic or secrets run on the client.
