# AI Concierge — Phase 1 setup checklist (Anthony)

This checklist gets **inbound voice → TwiML (Sarah) → `Gather` → stub reply** working and **one row per `CallSid` in `ai_concierge_calls`**.

## Prerequisites

- [ ] Supabase migration applied: `supabase/migrations/20260427140000_ai_concierge_tables.sql`  
  - **Remote:** `supabase db push` or run SQL in Supabase **SQL Editor** (production carefully).  
  - Confirms four tables exist: `booking_requests`, `ai_concierge_calls`, `ai_concierge_knowledge`, `ai_concierge_settings`.
- [ ] Env vars on Vercel (see `docs/AI_CONCIERGE_ENV.md`): at minimum `TWILIO_*`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

## Twilio: phone number + Voice webhook

1. [ ] In [Twilio Console](https://console.twilio.com/) open **Phone Numbers → Manage → Active numbers** and select the number that will answer AI concierge calls (dedicated or existing).
2. [ ] Under **Voice Configuration**:
   - **A call comes in:** `Webhook`, HTTP **POST**
   - **URL:** `https://www.hellogorgeousmedspa.com/api/ai-concierge/voice/incoming`  
     (or your Vercel production domain; no trailing slash issues—Twilio posts to exact path)
3. [ ] **Save** configuration.

> Twilio must hit **HTTPS** on the same host your users will use. The `X-Twilio-Signature` validation in code rebuilds the URL as `x-forwarded-proto` + `x-forwarded-host` + pathname — Vercel sets these by default.

## Vercel: deploy

- [ ] Merge/push to `main` and wait for a **green** production deployment.
- [ ] **Redeploy** after any env var change (or let auto-deploy pick it up).

## Test with a real phone call

1. [ ] From your cell, **dial** the Twilio number configured above.
2. [ ] You should hear **Polly.Joanna** (Sarah) say: *“Hello! Thank you for calling Hello Gorgeous Med Spa. This is Sarah…”* then a listening prompt (Gather), then the stub or timeout message.
3. [ ] In **Supabase → Table Editor → `ai_concierge_calls`**: confirm a **new row** with:
   - `call_sid` = Twilio `CallSid`
   - `from_number` / `to_number` populated
   - `status` set (e.g. `in_progress` / `ringing` depending on payload)

## Test without a phone (optional, dev only)

- [ ] Set `TWILIO_WEBHOOK_SKIP_SIGNATURE=1` locally.
- [ ] `curl -X POST http://localhost:3000/api/ai-concierge/voice/incoming` with `application/x-www-form-urlencoded` body:  
  `CallSid=CAtest123&From=%2B15551234567&To=%2B16301234567&CallStatus=ringing`  
- [ ] Expect **200** and **XML** starting with `<?xml` and containing `<Say>`.
- [ ] **Unset** the skip flag before any production use.

## Success criteria (Phase 1)

- [ ] **403** on POST if signature is invalid (valid Twilio request succeeds).
- [ ] **TwiML** includes `<Say voice="Polly.Joanna">` with the Sarah greeting and a `<Gather speech="...">` pointing at `/api/ai-concierge/voice/gather` on the **same origin** as the request.
- [ ] **Supabase** `ai_concierge_calls` receives an upserted row keyed by `call_sid` on each new call.
- [ ] `GET` on `/api/ai-concierge/voice/incoming` returns a small JSON health payload (for sanity checks, not for Twilio).

## RLS / dashboard note

- [ ] **Server** routes use the **service role** key and bypass RLS.
- [ ] **Staff** with `user_profiles.role` in `owner | admin | staff | provider` can **read/update** these tables with a normal **authenticated** Supabase client (JWT) for a future admin UI — not required for this webhook test.

## If something fails

| Symptom | Things to check |
|--------|-------------------|
| **403 Invalid signature** | Host/proto mismatch: Twilio URL must match deployed URL. Token wrong copy/paste. No `Twilio-Attribution` blockers. |
| **200 but no Supabase row** | `SUPABASE_SERVICE_ROLE_KEY` / `NEXT_PUBLIC_SUPABASE_URL` on Vercel; migration not applied. |
| **Gather step errors** | Ensure `/api/ai-concierge/voice/gather` is deployed; signature validation same as incoming. |
| **No audio** | Twilio number set to use **Webhook** (not forward-only to a carrier). Check Twilio [Debugger](https://console.twilio.com/monitor/debugger). |

## Next (Phase 2+)

- Wire **Claude** to `SpeechResult` on gather, `booking_requests` + SMS/Resend, **status** callbacks, recordings/transcript storage, staff dashboard.
