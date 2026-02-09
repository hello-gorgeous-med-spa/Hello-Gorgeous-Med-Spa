# What to do inside Vercel

Quick checklist for deploying and running Hello Gorgeous on Vercel.

---

## For Hello Gorgeous (Square + hellogorgeousmedspa.com)

**Domain:** `hellogorgeousmedspa.com`  
**Payments:** Square

### 1. Environment variables to set in Vercel (Production)

**App URL (use these exact values for your domain):**
```
BASE_URL=https://hellogorgeousmedspa.com
NEXT_PUBLIC_BASE_URL=https://hellogorgeousmedspa.com
NEXT_PUBLIC_APP_URL=https://hellogorgeousmedspa.com
```

**Supabase** (from Supabase → Project Settings → API):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

**Square** (from [Square Developer Dashboard](https://developer.squareup.com/apps)):
```
SQUARE_APPLICATION_ID=sq0idp-...
SQUARE_OAUTH_CLIENT_ID=...
SQUARE_OAUTH_CLIENT_SECRET=...
SQUARE_ENCRYPTION_KEY=<64 hex chars from: openssl rand -hex 32>
SQUARE_WEBHOOK_SIGNATURE_KEY=<from Square App → Webhooks → Signature Key>
SQUARE_ENVIRONMENT=production
```

**Optional (SMS, email, admin login):** Add Telnyx, Resend, and auth vars if you use them (see full list below).

### 2. Domains in Vercel

- **Settings → Domains** → Add: `hellogorgeousmedspa.com` (and `www.hellogorgeousmedspa.com` if you use www).
- Point your DNS for `hellogorgeousmedspa.com` to Vercel (CNAME or A as Vercel shows).

### 3. Square webhook

- In Square: Your App → Webhooks → Add subscription.
- **Endpoint URL:** `https://hellogorgeousmedspa.com/api/square/webhook`
- Copy the **Signature Key** into Vercel as `SQUARE_WEBHOOK_SIGNATURE_KEY`.

### 4. After changing env vars

Redeploy: **Deployments** → ⋮ on latest deployment → **Redeploy**.

---

## 1. Connect the repo and deploy

- In [Vercel](https://vercel.com): **Add New Project** → Import your Git repo (e.g. GitHub).
- **Root Directory:** If the app lives in a subfolder (e.g. `hello-gorgeous-med-spa`), set it in Project Settings → General → Root Directory.
- **Framework:** Next.js (auto-detected).
- Deploy. Every push to the main branch will trigger a new production deploy.

---

## 2. Set environment variables

In Vercel: **Project → Settings → Environment Variables.** Add these for **Production** (and optionally Preview if you use staging).

### Required

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Use production project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same | Safe for client |
| `SUPABASE_SERVICE_ROLE_KEY` | Same | **Secret** – server only |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys | Use live key for production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same | Use live key for production |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → Signing secret | For your production webhook URL |
| `TELNYX_API_KEY` | Telnyx Portal | For SMS |
| `TELNYX_PHONE_NUMBER` | Telnyx | E.164, e.g. +1XXXXXXXXXX |
| `TELNYX_MESSAGING_PROFILE_ID` | Telnyx | Messaging profile ID |
| `BASE_URL` | Your live URL | e.g. `https://hellogorgeousmedspa.com` |
| `NEXT_PUBLIC_BASE_URL` | Same | e.g. `https://hellogorgeousmedspa.com` |
| `NEXT_PUBLIC_APP_URL` | Same | e.g. `https://hellogorgeousmedspa.com` |

### Square (for POS / terminal)

| Variable | Where to get it |
|----------|-----------------|
| `SQUARE_APPLICATION_ID` | Square Developer Dashboard |
| `SQUARE_OAUTH_CLIENT_ID` | Same |
| `SQUARE_OAUTH_CLIENT_SECRET` | Same |
| `SQUARE_ENCRYPTION_KEY` | Generate: `openssl rand -hex 32` |
| `SQUARE_WEBHOOK_SIGNATURE_KEY` | Square App → Webhooks |
| `SQUARE_ENVIRONMENT` | `production` for live |

### Optional but useful

| Variable | Use |
|----------|-----|
| `RESEND_API_KEY` | Contact form + transactional email |
| `RESEND_FROM_EMAIL` | e.g. `Hello Gorgeous <hello@yourdomain.com>` |
| `CONTACT_FORM_TO_EMAIL` | Where contact form submissions go |
| `AUTH_CREDENTIALS` or `ADMIN_ACCESS_KEY` / `OWNER_LOGIN_SECRET` | Admin login |
| `OWNER_EMAIL` | Owner login fallback |

### After changing env vars

- **Redeploy** (Deployments → ⋮ on latest → Redeploy) so new variables are applied.

---

## 3. Domains

- In **Project → Settings → Domains**, add:
  - `hellogorgeousmedspa.com` (and `www` if you use it).
  - `book.hellogorgeousmedspa.com` — the app is already set up to serve `/book` on this host (see `vercel.json`).
- At your DNS provider, point the domains to Vercel (CNAME or A record as Vercel instructs).

---

## 4. Cron jobs (already configured)

`vercel.json` defines:

- **Gift cards sync:** `/api/gift-cards/sync?full=true` — daily at 6:00 UTC.
- **Sales reconcile:** `/api/sales/reconcile` — daily at 7:00 UTC.

No extra setup in the Vercel UI is required for these; they use Vercel Cron.

---

## 5. Webhooks (configure elsewhere, point to Vercel URL)

Your **production** app URL is the base for webhooks:

- **Stripe:** Dashboard → Webhooks → Add endpoint → URL e.g. `https://hellogorgeousmedspa.com/api/stripe/webhook` (or the path your app uses). Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
- **Square:** App → Webhooks → add URL e.g. `https://hellogorgeousmedspa.com/api/square/webhook`. Use the signature key in `SQUARE_WEBHOOK_SIGNATURE_KEY`.
- **Telnyx (SMS):** In Telnyx, set the webhook URL to your app’s SMS webhook route (e.g. `https://hellogorgeousmedspa.com/api/sms/webhook`).

Use `BASE_URL` / `NEXT_PUBLIC_APP_URL` as the base when configuring these.

---

## 6. Database migrations (Supabase, not Vercel)

New tables (e.g. AI Hub, marketing) are created via **Supabase migrations**, not in Vercel:

- Run your migrations in the Supabase project that production uses (SQL Editor or `supabase db push` / your usual process).
- For the AI Hub you added: ensure `20240101000020_ai_hub.sql` (or equivalent) has been applied so `ai_business_memory` and `ai_watchdog_logs` exist.

---

## 7. Quick checklist

- [ ] Repo connected; production deploys on push.
- [ ] All required env vars set for Production (and Preview if used).
- [ ] `BASE_URL` / `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_BASE_URL` = production URL.
- [ ] Domains added in Vercel and DNS pointed to Vercel.
- [ ] Stripe, Square, Telnyx webhooks use production URL and secrets in env.
- [ ] Redeployed after any env change.
- [ ] Supabase migrations run on production DB.

That’s what you need to do inside Vercel (and a bit in DNS + Supabase) to run Hello Gorgeous in production.
