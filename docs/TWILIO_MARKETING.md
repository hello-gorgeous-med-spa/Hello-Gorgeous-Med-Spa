# Twilio SMS Marketing – Hello Gorgeous Med Spa

SMS campaigns (Admin → **SMS** page) are sent via **Twilio**. Configure these environment variables so the app can send messages.

## Required environment variables

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | From [Twilio Console](https://console.twilio.com) → Account Info |
| `TWILIO_AUTH_TOKEN` | From Twilio Console → Account Info |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number in E.164 (e.g. `+16306366193`) |

Add them in your hosting provider (e.g. Vercel → Project → Settings → Environment Variables).

If the API returns **error 20003** (authentication failed), see **[TWILIO_ERROR_20003_VERCEL.md](./TWILIO_ERROR_20003_VERCEL.md)** — usually wrong/missing Vercel env vars, `SK` vs `AC` mix-up, stale auth token, or no redeploy after changes.

## A2P 10DLC (US compliance)

For US marketing SMS, Twilio requires an approved A2P 10DLC campaign. If your campaign was rejected for CTA verification:

- Use **Privacy Policy URL**: `https://www.hellogorgeousmedspa.com/privacy`
- Use **Terms and Conditions URL**: `https://www.hellogorgeousmedspa.com/terms`

Full steps: see [TWILIO_A2P_CAMPAIGN_FIX.md](./TWILIO_A2P_CAMPAIGN_FIX.md).

## Where Twilio is used

- **Admin → SMS**: campaign “Send to all” and “Custom list”, plus “Send test”.
- Transactional SMS (review requests, reminders, consents, booking confirmations, etc.) also use Twilio via `lib/notifications/sms-outbound.ts` and `lib/hgos/twilio-config.ts`.

---

## How to run SMS campaigns (production)

You **do not** need separate files like `app/api/send-sms/route.ts` or `/sms-campaigns` from external prototypes. This repo already ships:

| What | Where |
|------|--------|
| **Campaign UI** | **`/admin/sms`** (sign in with your admin auth) |
| **Single test SMS** | Same page → **Send test** → calls **`POST /api/sms/send`** |
| **Bulk campaign** | Same page → compose message → **Send to all** or **Custom list** → **`POST /api/sms/campaign`** |

**Env var name:** use **`TWILIO_PHONE_NUMBER`** (E.164). Some external snippets use `TWILIO_FROM_NUMBER` — that is **not** read by this app; align with the table above.

### Steps

1. **Deploy / local:** Ensure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set (Vercel + redeploy, or `.env.local` for dev).
2. Open **`https://www.hellogorgeousmedspa.com/admin/sms`** (or `/admin/sms` on your preview URL).
3. **Send test** — enter your cell; confirm delivery before a blast.
4. **Message** — type copy or pick a template from `SMS_TEMPLATES` in the UI.
5. **Audience**
   - **Send to all** — pulls phone numbers from Supabase **`clients`** and **`users`** (deduped). Requires `SUPABASE_SERVICE_ROLE_KEY` on the server for the campaign route.
   - **Custom list** — paste one phone per line (any common US format). You can copy a column from a Fresha CSV export and paste here (same idea as a CSV upload, without a separate uploader).
6. **Send** — confirm cost estimate, then run the campaign. Opt-out text is appended automatically if missing.

### Prototype / Downloads folder vs this repo

If you have a **`send-sms_route.ts`** + **`sms-campaigns_page.tsx`** kit that uses **`/api/send-sms`** and **`TWILIO_FROM_NUMBER`**, treat it as a **reference only**. Merging it would duplicate logic and wrong env names. Prefer **`/admin/sms`** + **`/api/sms/send`** + **`/api/sms/campaign`** above.

If you later want a **CSV file upload** on `/admin/sms` (like that prototype), that would be a new feature on top of the existing page—not a second parallel route.

---

## Opt-out

Messages sent through the SMS campaign API automatically get “Reply STOP to unsubscribe” appended if not already present (see `lib/hgos/sms-marketing.ts`). Ensure your Twilio number is set up to handle STOP/HELP keywords (Twilio does this when you use Messaging Services).
