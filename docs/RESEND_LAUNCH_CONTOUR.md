# Resend — production checklist (Contour Lift + staff email)

`POST /api/public/contour-lift-inquiry` sends staff notification via [Resend](https://resend.com). The response includes `emailSent: true` only when Resend returns HTTP 2xx.

## Vercel environment variables (Production)

| Variable | Required | Notes |
|----------|----------|--------|
| `RESEND_API_KEY` | **Yes** | From [Resend → API Keys](https://resend.com/api-keys). Value starts with `re_`. **No** quotes, **no** spaces in the Vercel value. |
| `RESEND_FROM_EMAIL` *or* `RESEND_FROM` | **Yes** (for reliable delivery) | Format: `Display Name <address@domain.com>`. The **domain** must be **added and verified** in Resend → **Domains** (SPF + DKIM as Resend shows). The app uses `RESEND_FROM_EMAIL` first, then `RESEND_FROM`. |
| `CONTACT_FORM_TO_EMAIL` | Recommended | Inbox that receives lead notifications. If unset, `SITE.email` in `lib/seo.ts` is used. Must be a real mailbox you can open. Resend can deliver to any address **once the sending domain is verified** (unlike `onboarding@resend.dev` test limits). |

## Resend dashboard

1. **Domains** — Add e.g. `hellogorgeousmedspa.com` (or a subdomain you send from, e.g. `mail.hellogorgeousmedspa.com`), complete DNS records, wait for **Verified**.
2. **From** — Set `RESEND_FROM_EMAIL` to an address on that verified domain, e.g. `Hello Gorgeous <leads@mail.hellogorgeousmedspa.com>`.
3. **API key** — Full access key for the same Resend project as the domain.

## Local verification (no deploy)

From the repo root (uses `.env.local` the same as dev):

```bash
node --env-file=.env.local scripts/verify-resend-launch.mjs
```

- Exit `0` + Resend `id` → check **CONTACT_FORM_TO_EMAIL** (or yahoo default in script) for the test.
- Non-zero → read the JSON error (invalid API key, unverified domain, invalid `from`/`to`).

## Production smoke test (after Vercel env is correct and redeployed)

```bash
curl -sS -X POST "https://www.hellogorgeousmedspa.com/api/public/contour-lift-inquiry" \
  -H "Content-Type: application/json" \
  -d '{"name":"Resend Test","email":"you+test@yourowndomain.com","phone":"6305550100","area_of_concern":"verify","contact_method":"text"}'
```

Expect: `{"success":true,"emailSent":true}` and staff copy in the inbox.

If `emailSent` is false, the JSON includes **`resendHttpStatus`**, **`resendMessage`** (Resend’s validation text), and sometimes **`resendKeyMissing: true`** if the API key is not set in that environment. Use a single `curl` to see the exact mismatch (no Vercel log hunt).

Also read **Vercel → your deployment → Logs** for: `[contour-lift-inquiry] Resend failed:`

## Supabase backup

Leads are written **before** Resend. If `emailSent` is false, check the `leads` table for the row; fix Resend using the log message above.

## Typical Resend 403 in production

If you see:

> You can only send testing emails to your own email address (…@…). To send emails to other recipients, please verify a domain … and change the `from` address to an email using this domain.

That means the API is still using **test**-style sending (`onboarding@resend.dev` or an unverified From). **Fix:** complete **Domains** in Resend, set `RESEND_FROM_EMAIL` to that domain, and keep `CONTACT_FORM_TO_EMAIL` as your real staff address.
