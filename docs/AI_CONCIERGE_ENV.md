# AI Concierge — environment variables

Variables used by Phase 1 (Twilio Voice webhooks → Next.js → Supabase) and future phases (Claude, Resend). Set in **Vercel** (Production + Preview as needed) and in **`.env.local`** for local dev.

## Required for Phase 1 (incoming call + DB log)

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `TWILIO_ACCOUNT_SID` | [Twilio Console](https://console.twilio.com/) → Account → **Account Info** | Starts with `AC` |
| `TWILIO_AUTH_TOKEN` | Same page (keep secret) | Used for `X-Twilio-Signature` validation **and** REST (SMS later) |
| `NEXT_PUBLIC_SUPABASE_URL` | [Supabase](https://supabase.com/dashboard) → Project **Settings → API** | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → **Settings → API** → `service_role` **secret** | **Server only.** Used by API routes to insert/upsert into `ai_concierge_calls`. Never expose to the browser. |

## Twilio webhooks (optional dev convenience)

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `TWILIO_WEBHOOK_SKIP_SIGNATURE` | (local only) | Set to `1` to **skip** `X-Twilio-Signature` checks (e.g. curl tests). **Never** enable in production. |

## Voice number (used elsewhere in repo; not read by the new route directly)

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `TWILIO_PHONE_NUMBER` | Twilio → **Phone Numbers → Manage** → your voice-capable number in E.164, e.g. `+16306366193` | Required for **outbound** SMS in existing flows; for inbound voice, the number is whatever you configure in the Twilio console to hit this webhook. |

## Public site URL (SEO / links; webhooks use request host)

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL` | Vercel project settings / automatic | Optional; Twilio `Gather` `action` URL is built from the **incoming request** `Host` + path so it matches the deployment URL. |

## Future phases (not required for Phase 1)

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com/) | Claude for conversation + tool calls |
| `RESEND_API_KEY` | [Resend](https://resend.com/) | Email summaries to staff |
| `AI_CONCIERGE_STAFF_SMS_TO` or reuse staff phone | N/A (business) | E.164 for Dani’s cell, e.g. `+16308813398` — wire in Phase 2 when sending booking SMS from API |

## Twilio Console fields (not env vars, but must match your deployment)

- **Voice webhook (HTTP POST):** `https://<your-domain>/api/ai-concierge/voice/incoming`  
- **Status callback (optional, Phase 2+):** can point to a future `call-status` route.  
- Webhook must be **HTTPS** in production. Twilio signs the request body using the **public URL** that was requested; the signing URL must match `https://<host>/api/ai-concierge/voice/incoming` (see `lib/twilio-webhook.ts`).

## Health checks

- `GET https://<host>/api/ai-concierge/voice/incoming` — returns JSON `ok: true` (no Twilio signature).  
- `GET https://<host>/api/ai-concierge/voice/gather` — same for the gather callback stub.
