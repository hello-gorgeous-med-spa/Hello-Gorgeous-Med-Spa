# DEV MASTER TICKET – Stabilize, Optimize, Authority Positioning

**Project:** HelloGorgeousMedSpa.com  
**Phase:** Stabilize, Optimize, Authority Positioning  
**Priority:** HIGH

---

## ✅ Completed in Codebase

### 1️⃣ Security Lockdown
- **Admin route protection:** Middleware enforces role checks:
  - `/admin/*` — owner, admin, staff only (clients & providers → redirect to `/`)
  - `/pos/*` — owner, admin, staff only
  - `/provider/*` — owner, admin, staff, provider (clients → redirect to `/`)
  - `/portal/*` — clients and admin roles (providers → redirect to `/`)
- **RLS:** Enabled on `provider_media`, `providers`, `concern_submissions`, `mascot_feedback`
- **Supabase Auth:** Email/password signup disabled, magic link only — configure in Supabase Dashboard → Auth → Providers
- **Signup form:** No open signup form; clients are created on first booking

### 2️⃣ Calendar Timezone
- `lib/business-timezone.ts` uses America/Chicago
- Booking APIs use `businessDateTimeToUTC` and `formatInBusinessTZ` for storage and display
- Timestamps stored as UTC in `appointments.starts_at` / `ends_at`

### 3️⃣ Provider Media / Ryan Photo
- Ryan headshot override via `PROVIDER_HEADSHOT_OVERRIDES` in `lib/providers/fallback.ts`
- To replace with `ryanandmyson.jpeg`: upload to Supabase `provider-media`, update override path

### 4️⃣ Hero Section
- Dark gradient overlay and constrained text layout implemented
- Responsive scaling and padding for mobile/tablet/desktop

### 5️⃣ Authority Intro
- Full-screen intro with REAL CLINIC / PROVIDERS / etc.
- Subtext: "Oswego's Trusted Aesthetic Team"
- `localStorage` flag (`hgos_authority_intro_seen`) — shows only on first visit
- Auto-dismiss ~4 seconds, no replay

### 6️⃣ Get-App Promotion
- **Booking confirmation page:** Banner with “Add Hello Gorgeous to your home screen” + link to `/get-app`
- **SMS confirmation:** Includes get-app URL via `sendAppointmentConfirmationSms`
- **Email (portal invite):** Includes get-app link in Resend template

### 7️⃣ SEO
- `/providers` and `/providers/danielle`, `/providers/ryan` in sitemap
- JSON-LD: `providerPersonJsonLd`, `providerVideoJsonLd`, `providerBeforeAfterJsonLd` on provider pages
- Default title: `Hello Gorgeous Med Spa | Botox, Fillers & Weight Loss in Oswego, IL`

---

## ⏳ Manual Verification (No Code)

### Environment Variables (Vercel)
Confirm in Vercel → Project → Settings → Environment Variables:
- `RESEND_API_KEY`
- `TELNYX_API_KEY`
- `TELNYX_MESSAGING_PROFILE_ID`
- `TELNYX_PHONE_NUMBER` or `TELNYX_FROM_NUMBER`
- `NEXT_PUBLIC_APP_URL=https://hellogorgeousmedspa.com`

### Supabase Auth
- **Auth → Providers:** Email enabled, Password disabled (magic link only)
- **Auth → Policies / RLS:** Confirm RLS on `appointments`, `clients`, `providers`, `provider_media`, `payments`
- **Auth → Notifications:** Optional — enable security-sensitive notification toggles (password change, email change, etc.)

### Booking Flow QA
| Test | Action |
|------|--------|
| New client booking | Book as new client → confirm record created |
| SMS confirmation | Verify SMS received with correct date/time and get-app link |
| Email confirmation | Check owner inbox for new booking email |
| Portal invite | Client receives magic-link email → clicks → lands in `/portal` |
| Cancel appointment | Cancel via portal or admin → confirm status update |
| Reschedule | Reschedule → confirm new time reflected |
| Provider parameter | Book with Danielle vs Ryan → correct provider on appointment |
| Calendar | Admin calendar shows correct day/time (America/Chicago) |

### Date Drift QA
- Desktop booking → confirm date/time in SMS, email, admin calendar
- iPhone booking → same
- Google Maps booking (if integrated) → same
- Manual admin booking → same

---

## 📋 Final Deliverable Checklist

| Item | Status |
|------|--------|
| Admin locked down | ✅ Middleware role check |
| No public signup | ⏳ Verify Supabase Auth settings |
| RLS verified | ⏳ Confirm in Supabase for PHI tables |
| Calendar timezone fixed | ✅ UTC storage, Chicago display |
| Ryan photo updated | ⏳ Override in place; replace file when ready |
| Hero overlap fixed | ✅ |
| Authority intro live | ✅ + localStorage |
| /get-app promoted | ✅ Booking, SMS, email |
| Env vars verified | ⏳ Manual check in Vercel |
| Booking flow tested | ⏳ Full QA run |
