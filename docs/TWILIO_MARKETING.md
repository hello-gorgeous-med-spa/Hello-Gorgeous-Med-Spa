# Twilio SMS Marketing – Hello Gorgeous Med Spa

SMS campaigns (Admin → **SMS** page) are sent via **Twilio**. Configure these environment variables so the app can send messages.

## Required environment variables

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | From [Twilio Console](https://console.twilio.com) → Account Info |
| `TWILIO_AUTH_TOKEN` | From Twilio Console → Account Info |
| `TWILIO_PHONE_NUMBER` | Your Twilio phone number in E.164 (e.g. `+16306366193`) |

Add them in your hosting provider (e.g. Vercel → Project → Settings → Environment Variables).

## A2P 10DLC (US compliance)

For US marketing SMS, Twilio requires an approved A2P 10DLC campaign. If your campaign was rejected for CTA verification:

- Use **Privacy Policy URL**: `https://www.hellogorgeousmedspa.com/privacy`
- Use **Terms and Conditions URL**: `https://www.hellogorgeousmedspa.com/terms`

Full steps: see [TWILIO_A2P_CAMPAIGN_FIX.md](./TWILIO_A2P_CAMPAIGN_FIX.md).

## Where Twilio is used

- **Admin → SMS**: campaign “Send to all” and “Custom list”, plus “Send test”.
- Other flows (e.g. review requests, reminders) may still use Telnyx; marketing is Twilio.

## Opt-out

Messages sent through the SMS campaign API automatically get “Reply STOP to unsubscribe” appended if not already present (see `lib/hgos/sms-marketing.ts`). Ensure your Twilio number is set up to handle STOP/HELP keywords (Twilio does this when you use Messaging Services).
