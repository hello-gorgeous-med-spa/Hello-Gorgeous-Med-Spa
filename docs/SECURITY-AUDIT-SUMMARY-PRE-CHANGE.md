# Security Audit Summary — Full Website Hardening (Pre-Change)

**Project:** hellogorgeousmedspa.com  
**Scope:** Entire codebase  
**Date:** Pre-implementation audit  
**Objective:** Baseline against DEV TICKET "Full Website Security Hardening & Production Lockdown"

---

## SECTION 1 — SECRET & ENVIRONMENT SECURITY

### 1.1 Secrets in repo

| Check | Result | Notes |
|-------|--------|--------|
| `sk-` / API keys in source | **PASS** | No hardcoded keys. All use `process.env.OPENAI_API_KEY`, `process.env.SQUARE_ACCESS_TOKEN`, etc. |
| `.env` in repo | **PASS** | `.gitignore` excludes `.env`, `.env.*`; only `.env.example` allowed (contains placeholders only). |
| Fallback secrets in code | **PASS** | No fallback secrets; missing env results in null/empty or safe fallback behavior. |

**Locations verified:**  
- `app/api/hormone/blueprint/route.ts` — `process.env.OPENAI_API_KEY`, `OPENAI_MODEL`  
- `app/api/journey/roadmap/route.ts` — same  
- `app/api/chat/route.ts`, `app/api/analyze-lab/route.ts`, `app/api/memberships/wellness/labs/upload/route.ts` — OpenAI  
- `lib/square/client.ts`, `app/api/square/devices/route.ts` — `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`  
- `lib/square/webhook.ts` — `SQUARE_WEBHOOK_SIGNATURE_KEY`  
- `.env.example` — placeholder values only (e.g. `sk_live_...`, `STRIPE_SECRET_KEY=sk_live_...`)

**Action:** Confirm all production secrets exist only in Vercel (not in any committed `.env`). Rotate if any were ever committed.

---

## SECTION 2 — SERVER-SIDE INTELLIGENCE ONLY

| Check | Result | Notes |
|-------|--------|--------|
| AI prompts in frontend | **PASS** | `SYSTEM_PROMPT` and AI calls only in API routes: `app/api/hormone/blueprint/route.ts`, `app/api/journey/roadmap/route.ts`. |
| Pricing logic client-side | **PASS** | Pricing from `service_pricing` table and AI output is server-side; frontend only displays API response. |
| Hormone/roadmap logic client-side | **PASS** | HarmonyAI and journey flows call `/api/hormone/blueprint` and `/api/journey/roadmap`; all logic server-side. |
| Payment decision logic client-side | **PASS** | Square/Stripe usage is server-side (webhook, terminal, payment creation). |

**Gap:** None identified for “intelligence only on server.”

---

## SECTION 3 — RATE LIMITING (GLOBAL)

| Route / area | Implemented | Storage | Limit | 429 |
|--------------|-------------|---------|-------|-----|
| `/api/hormone/*` (blueprint) | **Yes** | Supabase RPC `hormone_rate_limit_inc` | 5/IP/hour | Yes |
| `/api/journey/*` (roadmap) | **Yes** | Supabase RPC `journey_rate_limit_inc` | 5/IP/hour | Yes |
| `/api/analyze-lab` | **Yes** | In-memory | 5/IP/day | Yes |
| `/api/dashboard` | **No** | — | — | — |
| `/api/square/*` (public POST) | **No** | — | — | — |
| `/api/chat` | **No** | — | — | — |
| `/api/face-*` | **N/A** | No `face-*` routes found in codebase. | — | — |

**Gaps:**  
- No Redis; hormone/journey use **Supabase-backed** rate limit (persistent, not in-memory).  
- Dashboard, Square public endpoints, chat have **no rate limiting**.  
- Ticket asks for Redis-based persistence; current design is DB (Supabase), not Redis.

---

## SECTION 4 — REQUEST VALIDATION

| Check | Result | Notes |
|-------|--------|--------|
| Zod or schema validation on API routes | **FAIL** | No Zod (or similar) found in app API routes. Request bodies used via `request.json()` and ad-hoc checks. |
| Reject unknown fields | **No** | Not enforced. |
| Enum values enforced | **Partial** | Some routes validate shape; no central schema. |
| Payload size limits | **No** | Not enforced. |
| Image size limits (5MB) | **Unknown** | Upload routes not audited in detail. |

**Action:** Introduce Zod (or equivalent) for all public POST/PUT API routes; enforce payload size and enums.

---

## SECTION 5 — ADMIN PROTECTION

| Check | Result | Notes |
|-------|--------|--------|
| `/admin/*` auth | **PASS** | `middleware.ts` protects `/admin`, `/provider`, `/portal`, `/pos`; redirects to `/login` or `/portal/login` if no valid session. |
| Role-based access | **PASS** | Roles: owner, admin, staff, provider, client, readonly. Owner-only paths (e.g. `/admin/audit-logs`, `/admin/vendors`). |
| `/api/dashboard` | **GAP** | **No auth check** in `app/api/dashboard/route.ts`. Any client can GET and receive aggregated stats. Middleware does not run on API routes. |
| Payment/settings API | **Partial** | Some routes use `getOwnerSession()` or `getSessionFromRequest()` (e.g. export, ai/admin-commands, clients). Many others not audited. |

**Action:** Add server-side auth (e.g. session/cookie check or API auth) to `/api/dashboard` and any other admin/sensitive API routes.

---

## SECTION 6 — PAYMENT SECURITY

| Check | Result | Notes |
|-------|--------|--------|
| Square tokens server-only | **PASS** | `SQUARE_ACCESS_TOKEN` etc. only in server code (`lib/square/*`, API routes). |
| Server-only transaction creation | **PASS** | Terminal/checkout creation in server routes. |
| Webhook signature verification | **PASS** | `lib/square/webhook.ts` — `verifyWebhookSignature()`; used in `app/api/square/webhook/route.ts`. If `SQUARE_WEBHOOK_SIGNATURE_KEY` and signature header present, verification is required. |
| Idempotency | **PASS** | `claimWebhookEvent()` by `event_id`; secondary checks for checkout/payment/refund. |
| Apple Pay domain verification | **Partial** | Single API route `app/api/apple-pay-verification/route.ts` serves file; also `next.config.js` header for `/.well-known/apple-developer-merchantid-domain-association`. **Duplicate/alternate files:** Worktree had `public/SQUARE_APPLE_PAY`, `public/apple-developer-merchantid-domain-association`, `public/apple-developer-merchantid-domain-association (1)` — ensure **only one** canonical file in `public/.well-known/` and 200 response confirmed. |

---

## SECTION 7 — HTTP SECURITY HEADERS

| Header | Result | Notes |
|--------|--------|--------|
| Content-Security-Policy | **Missing** | Not set in `next.config.js` or middleware. |
| X-Frame-Options: DENY | **Missing** | Not set. |
| X-Content-Type-Options: nosniff | **Missing** | Not set. |
| Referrer-Policy: strict-origin | **Missing** | Not set. |
| Permissions-Policy | **Missing** | Not set. |

**Action:** Add security headers in `next.config.js` or middleware for all responses.

---

## SECTION 8 — BRANCH GOVERNANCE ENFORCEMENT

| Check | Result | Notes |
|-------|--------|--------|
| main protected / no direct pushes | **Not in repo** | Branch protection is configured in GitHub (or Git host), not in codebase. |
| PR required / build pass | **Not in repo** | Same. |
| Worktrees removed | **Not in repo** | Operational choice; worktree usage was noted in prior context. |

**Action:** Confirm in GitHub: main branch protection, PR required, status checks (build) required before merge.

---

## SECTION 9 — DEPENDENCY & VULNERABILITY AUDIT

**npm audit (run in project):**  
- **18 vulnerabilities** (1 moderate, 17 high).  
- Mainly **minimatch** (ReDoS) and **ajv** (ReDoS with `$data`), pulled in via **eslint** and related tooling.  
- Fix: `npm audit fix` (and optionally `npm audit fix --force` for minimatch — may bump ESLint major).

**Action:** Run `npm audit`, fix high/critical where possible, document resolved and accepted risks.

---

## SECTION 10 — LOGGING & MONITORING

| Check | Result | Notes |
|-------|--------|--------|
| Error logging server-side | **Partial** | `console.error` / `console.log` in API routes and webhook. No structured logging service observed. |
| Abuse/rate-limit logging | **Partial** | Hormone/journey rate limit logs with truncated IP. |
| Payment error logs | **Partial** | Webhook and Square code log errors. |
| AI failure logs | **Partial** | Blueprint/roadmap routes log on OpenAI failure. |
| PII in logs | **Review** | Ensure no PII (e.g. full email, names) in logs. |

**Action:** Formalize logging (e.g. structured logs, optional external service) and ensure no PII.

---

## SECTION 11 — SCRAPE & BOT MITIGATION

| Check | Result | Notes |
|-------|--------|--------|
| reCAPTCHA / Turnstile on AI routes | **No** | Not implemented. |
| Bot protection in middleware | **No** | Middleware handles auth and subdomain; no bot/scrape layer. |
| Block automation patterns | **No** | Not implemented. |

**Action:** Add CAPTCHA/Turnstile on `/api/hormone/blueprint`, `/api/journey/roadmap`, and optionally other public POST endpoints.

---

## SECTION 12 — REMOVE DUPLICATES & DEAD FILES

| Check | Result | Notes |
|-------|--------|--------|
| Duplicate Apple Pay files | **Review** | Multiple paths reference Apple Pay file; ensure single canonical `public/.well-known/apple-developer-merchantid-domain-association` and remove duplicates (e.g. root `public/` copies). |
| Orphaned routes | **Not audited** | Full route audit not done. |
| Unused admin pages | **Not audited** | Not done. |

**Action:** Remove duplicate Apple Pay files; optionally audit orphaned/unused routes and admin pages.

---

## SECTION 13 — ARCHITECTURE REVIEW

| Item | Status |
|------|--------|
| Business logic client-side | **None found.** AI, pricing, roadmap, hormone logic are server-side; frontend only calls APIs and displays responses. |
| Architectural debt | Rate limits are DB-backed (good) but not Redis; dashboard and several APIs lack auth and rate limits. |
| Performance / scaling | Not assessed in this audit. |

---

## SECTION 14 — PERFORMANCE CHECK

| Check | Result | Notes |
|-------|--------|--------|
| Lighthouse (Homepage, Hormone, Roadmap, Admin) | **Not run** | To be run locally or in CI; target Performance 85+, Best Practices 95+, security headers passing. |

**Action:** Run Lighthouse for listed pages and record results.

---

## SUMMARY TABLE

| Section | Status | Priority |
|---------|--------|----------|
| 1. Secrets & env | **PASS** (verify Vercel only) | High |
| 2. Server-side only | **PASS** | — |
| 3. Rate limiting | **Partial** (hormone/journey yes; dashboard/square/chat no) | High |
| 4. Request validation | **FAIL** (no Zod/schema) | High |
| 5. Admin protection | **GAP** (/api/dashboard no auth) | Critical |
| 6. Payment security | **PASS** (Square/webhook/Apple Pay partial) | Medium |
| 7. Security headers | **Missing** | High |
| 8. Branch governance | **Confirm in GitHub** | High |
| 9. Dependencies | **18 vulns** (npm audit) | High |
| 10. Logging | **Partial** | Medium |
| 11. Bot mitigation | **No** | Medium |
| 12. Duplicates/dead | **Review Apple Pay** | Low |
| 13. Architecture | **No client-side logic** | — |
| 14. Lighthouse | **Not run** | Medium |

---

## CRITICAL ACTIONS BEFORE “PRODUCTION LOCKDOWN”

1. **Protect `/api/dashboard`** — require valid admin session (or equivalent) and return 401/403 if unauthenticated.  
2. **Add security headers** — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.  
3. **Add request validation** — Zod (or similar) for public POST/PUT APIs; payload size and enums.  
4. **Rate limit** — dashboard, chat, and public Square-related POST endpoints (and any other sensitive public APIs).  
5. **Fix npm audit** — address high/critical where possible and document.  
6. **Confirm** — no secrets in Git history; all secrets in Vercel only; branch protection and worktree policy.

---

## FINAL CONFIRMATION (PRE-CHANGE)

**Cannot yet confirm:**  
*“The website is production-hardened, secrets secured, rate-limited, and no critical logic exists client-side.”*

**Can confirm:**  
- No API keys or secrets in source; env only.  
- No AI, pricing, or roadmap logic client-side; all in API routes.  
- Hormone and journey APIs are rate-limited (Supabase-backed) and return 429.  
- Square webhook verified; idempotency in place; admin UI protected by middleware.

**Remaining for full confirmation:**  
- Auth on `/api/dashboard` (and other admin APIs as needed).  
- Global security headers.  
- Request validation (Zod/schema) on public APIs.  
- Rate limiting on dashboard, chat, and relevant Square endpoints.  
- npm audit remediation and Lighthouse runs.

---

*End of pre-change security audit summary.*
