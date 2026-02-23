# Journey Roadmap Emails with Resend

When a visitor uses **"Email my results"** on the [Your Journey](/your-journey) page, the app sends the roadmap by email using **Resend**. The client gets the email, and **hellogorgeousskin@yahoo.com** always receives a copy.

---

## What you need to do

### 1. Install Resend

In your project root:

```bash
npm install resend
```

### 2. Get a Resend API key

1. Go to [resend.com](https://resend.com) and sign up or log in.
2. Open [API Keys](https://resend.com/api-keys).
3. Create an API key (e.g. "Hello Gorgeous Journey").
4. Copy the key (it starts with `re_`).

### 3. Add environment variables

In `.env.local` (or your hosting env vars, e.g. Vercel):

```env
# Required for journey "Email my results" to work
RESEND_API_KEY=re_xxxxxxxxxxxx

# Who the email is "from" (required by Resend)
# Option A – Testing: use Resend’s test address (you’ll get a copy to hellogorgeousskin@yahoo.com too)
RESEND_FROM="Hello Gorgeous Med Spa <onboarding@resend.dev>"

# Option B – Production: use your own domain after verifying it in Resend
# Add your domain in Resend Dashboard → Domains, then use an address on that domain
RESEND_FROM="Hello Gorgeous Med Spa <hello@yourdomain.com>"
```

- **Testing:** Use `onboarding@resend.dev` as above. The app will send one email to the visitor and a **second** email to hellogorgeousskin@yahoo.com so you still get every roadmap.
- **Production:** Verify your domain in Resend and set `RESEND_FROM` to an address on that domain (e.g. `hello@hellogorgeousmedspa.com`). Then the visitor email is sent with **BCC: hellogorgeousskin@yahoo.com**, so you get one copy per request without a second email.

### 4. Deploy

Redeploy so the new env vars and the `resend` package are used. After that, "Email my results" will send via Resend and hellogorgeousskin@yahoo.com will get the results every time.

---

## Summary

| Step | Action |
|------|--------|
| 1 | `npm install resend` |
| 2 | Create API key at [resend.com/api-keys](https://resend.com/api-keys) |
| 3 | Add `RESEND_API_KEY` and `RESEND_FROM` to `.env.local` (and production env) |
| 4 | (Optional) Add and verify your domain in Resend for production “from” address |
| 5 | Redeploy |

No webhook or extra service is required; the Next.js API route sends the emails directly with Resend.
