# Your Booking System — Fully Under Your Control

You’re **no longer on Fresha**. Your website (Hello Gorgeous Med Spa) is your **only** booking channel. This doc explains what you own, how to keep it reliable, and what to do when something breaks so you never lose a day of bookings again.

---

## What You Actually Control

| You own / control | Where | Why it matters |
|-------------------|--------|----------------|
| **Code & content** | This repo (GitHub) | Fixes, new features, copy. You (or your dev) push to `main`; Vercel deploys. |
| **Hosting & deploys** | Vercel | Your site and APIs run here. You control env vars and domains. |
| **Database** | Supabase | All appointments, clients, services, providers, schedules. You control the project and keys. |
| **SMS (confirmations/reminders)** | Telnyx | Booking confirmations and reminders. You control the number and API keys. |
| **Email (confirmations)** | Resend | Client confirmation emails. You control the API key and “from” address. |
| **Domain** | Your registrar (e.g. hellogorgeousmedspa.com) | Points to Vercel. You control DNS. |

Nothing is “inside Fresha” anymore. If booking is down, the cause is in one of the above.

---

## How to Prevent Another “No Bookings Today”

### 1. **Env vars (most common cause of “booking broken”)**

If these are missing or wrong in **Vercel → Project → Settings → Environment Variables**, booking or confirmations can fail:

- **`SUPABASE_SERVICE_ROLE_KEY`** — Required for creating appointments. Without it, “Confirm Booking” returns an error.
- **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** — Required for the site and booking pages to load data.
- **`RESEND_API_KEY`** and **`RESEND_FROM_EMAIL`** — Required for client confirmation emails.
- **`TELNYX_API_KEY`**, **`TELNYX_MESSAGING_PROFILE_ID`**, **`TELNYX_PHONE_NUMBER`** — Required for SMS confirmations (optional if you’re fine with email-only).
- **`NEXT_PUBLIC_APP_URL`** — Set to `https://www.hellogorgeousmedspa.com` so links in emails/SMS are correct.

**Action:** In Vercel, open your project → Settings → Environment Variables. Confirm every variable above exists for **Production** and has no typos or placeholders. Redeploy after changing.

### 2. **Supabase (database)**

- **Project:** You own the Supabase project linked to this app.
- **Tables:** `services`, `providers`, `provider_schedules`, `appointments`, `clients`, `users` are the core for booking.
- **If Supabase is down or restricted:** The site can show errors or “no providers.” Check status at [status.supabase.com](https://status.supabase.com). If you hit limits, upgrade or fix restrictions.

**Action:** Once a month, log into Supabase → Table Editor. Spot-check that `services` and `providers` have the rows you expect and that `provider_schedules` has schedules for Ryan and Danielle.

### 3. **Provider names in the database**

Booking matches providers by name. **Danielle** must appear in the DB as a provider whose linked user has first name “Danielle” and last name containing “Alcala” (e.g. “Alcala” or “Glazier-Alcala”). If she’s missing or named differently, she won’t show or won’t resolve.

**Action:** In Supabase, check `providers` and the related `users` (or `user_profiles`). Ensure both Ryan and Danielle exist and names match what the app expects.

### 4. **Give clients a backup: your phone number**

Even when online booking fails, you can still take bookings by phone. The app already shows “Call us at (630) 636-6193” on error screens and when no times are available. Make sure your Google Business Profile and any other listings use the same number so clients can always call.

**Action:** Use one primary number everywhere (website, GBP, social). If booking is down, answer or use a simple voicemail that says you’ll call back to book.

---

## When Booking Is Broken — Quick Checklist

1. **Open your live site**  
   Go to `https://www.hellogorgeousmedspa.com/book`. Does the page load or do you see “Something went wrong”?

2. **If the page doesn’t load**  
   - Check [vercel.com](https://vercel.com) → your project → Deployments. Is the latest deploy successful?  
   - Check Vercel env vars (see above). Fix and redeploy.

3. **If the page loads but you see “No providers” or no dates**  
   - Check Supabase: `providers`, `provider_schedules`, `services` (and that services have `allow_online_booking = true`).  
   - Check that both providers have schedules for the days you expect.

4. **If clients can pick a time but get an error on “Confirm Booking”**  
   - Usually missing or wrong **`SUPABASE_SERVICE_ROLE_KEY`** in Vercel. Add/fix it and redeploy.  
   - Check Vercel → Logs (or Supabase logs) for the exact error.

5. **If booking works but no confirmation email/SMS**  
   - Confirm **Resend** and **Telnyx** env vars in Vercel.  
   - Check Resend and Telnyx dashboards for bounces or errors.

---

## Pausing Booking Without Taking the Site Down

You can turn off online booking without breaking the rest of the site:

- **Admin / CMS:** If you have a “booking enabled” or “booking paused” setting in your admin or CMS, use that. The `/book` page can show “Booking is temporarily paused — call us at (630) 636-6193” instead of the form.
- **Supabase:** Set `allow_online_booking` to `false` for all services (or for specific ones). The booking page will then show no (or fewer) bookable services and the call-to-action can stay “Call to book.”

That way you stay in control: you decide when booking is on or off, and the site still works and shows your number.

---

## One-Page “Control Summary”

- **Code:** GitHub repo → push to `main` → Vercel auto-deploys.  
- **Live site & API:** Vercel. Env vars and deploy status are under Project Settings.  
- **Data:** Supabase. You control project, tables, and keys.  
- **SMS:** Telnyx. You control number and API keys.  
- **Email:** Resend. You control API key and sender.  
- **Backup for clients:** Always show “Call (630) 636-6193 to book” when booking is unavailable.

Keeping env vars correct, Supabase healthy, and provider/schedule data up to date gives you a **single, owned booking system** and avoids another day with zero bookings.

---

## Quick health check (optional)

You can verify booking is ready anytime by opening this URL (while logged into your site’s host, or from a tool that can hit your domain):

**`https://www.hellogorgeousmedspa.com/api/health/booking`**

- **200 + `"ok": true`** — Booking system looks ready.
- **200 + `"ok": true` but with `"warn"` in `checks`** — Booking may work; fix the warnings when you can (e.g. add Resend/Telnyx for confirmations).
- **503 or `"ok": false`** — Something critical is wrong (e.g. missing `SUPABASE_SERVICE_ROLE_KEY` or DB error). Use the “When booking is broken” checklist above.

You can bookmark this URL and open it before a busy day, or use a free uptime monitor (e.g. UptimeRobot, Cronitor) to hit it every 5–10 minutes and email you if it returns 503.
