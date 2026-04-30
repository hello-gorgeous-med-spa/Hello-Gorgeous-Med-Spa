# AI Concierge (Sarah) — single-page setup

Sarah is the Twilio Voice + Claude pipeline that answers calls, answers questions from your knowledge base, and saves a `booking_requests` row that staff can convert in Square. **Three things turn it on**, and they are all paste‑and‑click.

> Verify any time at **`/admin/ai-concierge/health`** — env, DB, webhook URL, and a one-click signed self-test.

---

## 1. Twilio Console — voice webhook

Console → **Phone Numbers → Manage → Active numbers** → click your voice number → **Voice configuration**:

- **A call comes in:** `Webhook` · **HTTP POST**
- **URL:** `https://<your-production-host>/api/ai-concierge/voice/incoming`  
  (use the value the Health page shows — it is computed from the live deployment)

Save. That is the entire Twilio side.

> If your published business number lives on **Xfinity Business** (or any other carrier) and **not** on Twilio, set **unconditional call forwarding** from that line to your Twilio number. The Twilio webhook is what answers — anything that does not reach Twilio cannot run Sarah.

## 2. Vercel — environment variables (Production + Preview)

| Variable | Required | Notes |
|----------|----------|-------|
| `TWILIO_ACCOUNT_SID` | Yes | From [Twilio Console](https://console.twilio.com/) |
| `TWILIO_AUTH_TOKEN` | Yes | Validates `X-Twilio-Signature` and signs the diagnostics self-test |
| `TWILIO_PHONE_NUMBER` | Yes | E.164, the inbound caller-facing number |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only; lets routes upsert `ai_concierge_calls` |
| `ANTHROPIC_API_KEY` | Yes | Required for Sarah's brain. Without this, gather falls back to a stub. |
| `ANTHROPIC_MODEL` | No | Defaults to `claude-sonnet-4-20250514` |
| `AI_CONCIERGE_TRANSFER_E164` | No | E.164 transfer target. Admin > Settings overrides this at runtime. |
| `AI_CONCIERGE_STAFF_PHONE_E164` | No | Booking-summary SMS recipient (alias: `AI_CONCIERGE_NOTIFY_SMS`) |
| `AI_CONCIERGE_STAFF_EMAIL` | No | Overrides Resend `to`; defaults to `SITE.email` |
| `RESEND_API_KEY` | No | Required for booking emails to staff |
| `TWILIO_WEBHOOK_SKIP_SIGNATURE` | **Never in prod** | Local-only flag for `curl` testing |

After changing env vars, redeploy (or push any commit to `main`).

## 3. Database — confirm the migration ran

Tables: `ai_concierge_calls`, `booking_requests`, `ai_concierge_knowledge`, `ai_concierge_settings` (see `supabase/migrations/20260427140000_ai_concierge_tables.sql`). Rerun via Supabase SQL Editor or `supabase db push` if any are missing — the **Health** page reports counts for all four.

---

## Verifying it works (no real call)

1. Sign in to `/admin` as **owner / admin / staff**.
2. Open **`/admin/ai-concierge/health`**.
3. Top section shows the **canonical Twilio webhook URL** with a Copy button — paste it into Twilio.
4. **Run self-test (auto-clean)** posts a signed synthetic webhook to `/api/ai-concierge/voice/incoming`, asserts the TwiML contains `<Say>` + `<Gather>`, and checks that an `ai_concierge_calls` row was inserted (then deletes it). A failure here means env, signature, or DB is wrong **before** you take a real call.
5. Also exposed at `/api/ai-concierge/voice/incoming` (GET) — returns `{ ok: true, ... }` for sanity checks.

Place a real test call once Health is green. Watch in **Calls** tab + Twilio Console **Debugger** if anything is silent.

---

## Day-to-day

- **Calls** — full transcript and what Sarah did per call.
- **Bookings** — every `booking_requests` row Sarah collected; staff confirms in Square.
- **Knowledge** — FAQ entries Sarah cites from. Edit anytime; changes are live without redeploy.
- **Settings** — change the transfer number live (writes to `ai_concierge_settings.transfer_e164`; the gather route reads it before any env fallback).
- **Analytics** — call volume / booking conversion.

---

## Where things live in the repo

| Concern | File |
|---------|------|
| Inbound TwiML | `app/api/ai-concierge/voice/incoming/route.ts` |
| Claude conversation | `app/api/ai-concierge/voice/gather/route.ts` |
| Diagnostics summary | `app/api/ai-concierge/diagnostics/route.ts` |
| Self-test runner | `app/api/ai-concierge/diagnostics/selftest/route.ts` |
| Sarah prompt | `lib/ai-concierge/prompt.ts` |
| Tools (transfer, collect_booking_info) | `lib/ai-concierge/tools.ts` |
| Transfer number resolution | `lib/ai-concierge/constants.ts` (DB → env → hardcoded fallback) |
| DB helpers (transcripts, bookings, KB) | `lib/ai-concierge/db.ts` |
| Twilio signature verification | `lib/twilio-webhook.ts` |
| Migration | `supabase/migrations/20260427140000_ai_concierge_tables.sql` |
| Admin pages | `app/admin/ai-concierge/{calls,bookings,knowledge,analytics,settings,health}` |

---

## If something fails

| Symptom | Likely cause |
|---------|--------------|
| Twilio Debugger shows **403** on `/api/ai-concierge/voice/incoming` | `TWILIO_AUTH_TOKEN` mismatch with the deployed environment, or the webhook URL is on a different host than the request actually lands on. |
| TwiML returns but **no Supabase row** | `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_URL` missing, or migration not applied. |
| Sarah just says “our team will call you back” and hangs up | `ANTHROPIC_API_KEY` is unset — the gather route stubs out without it. |
| Caller never hears Sarah | The number that rang is **not Twilio**. Confirm forwarding is set on the carrier the caller dials. |
| Self-test passes locally, fails in prod | Local has `TWILIO_WEBHOOK_SKIP_SIGNATURE=1`; prod must not. |

---

## Reference

- `docs/AI_CONCIERGE_PHASE1_CHECKLIST.md` — original phase-1 walkthrough
- `docs/AI_CONCIERGE_ENV.md` — full env-var reference
- `docs/AI_RECEPTIONIST_INITIATIVE.md` — initiative spec / brand voice
