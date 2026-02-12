# Roadmap: Videos, Photos, Client Booking & Portal

**Your goals:** Add real media, own the booking experience (no Fresha), client profiles + homescreen app, confirmations, cancel/reschedule, voice assistant.

---

## ✅ ALREADY BUILT (You’re Set)

### Booking
- **Native first-party booking** — `/book` and `/portal/book` (no Fresha)
- **Single source of truth** — All new bookings in Supabase; no external integrations
- **Availability** — Driven by provider schedules and existing appointments

### Client Profile & Portal
- **Profile creation** — When a client books, user + client record are created
- **Portal access** — After booking, a magic link is emailed via Resend so they can log in
- **Client portal** — `/portal` with: Appointments, Book, Rewards, Referrals, Journey, History, Intake, Membership
- **Login** — Magic link (email) only for clients (no passwords)

### Add to Homescreen (Like Fresha App)
- **PWA ready** — `manifest.json` and `client-manifest.json`
- **Portal as app** — `client-manifest.json` uses `start_url: /portal`
- **Get-app page** — `/get-app` with install instructions for iPhone (Safari) and Android (Chrome)
- **Shortcuts** — Book, Appointments, Rewards, Refer in the manifest

### Confirmations & Care
- **SMS confirmation** — Sent via Telnyx right after booking
- **Owner notification** — Email to you via Resend
- **Consent forms** — Auto-sent after booking
- **Portal invite** — Magic link email sent after each booking

### Cancel & Reschedule
- **Cancel API** — `POST /api/booking/cancel`
- **Reschedule API** — `POST /api/booking/reschedule`
- **Portal UI** — Appointments page has Cancel and Reschedule modals

### Chat Assistant
- **Mascot chat** — Widget on site; answers questions and links to booking
- **Book CTA** — “Book now” button opens your booking page (does not book inside chat)

### Provider Media (Videos & Photos)
- **Admin** — Admin → Content → Providers
- **Per provider** — Upload videos, before/after photos, titles, descriptions, service tags
- **Public pages** — `/providers` and `/providers/danielle`, `/providers/ryan` show the media
- **Consent** — Checkbox required before publishing before/after

---

## 🔧 THINGS TO VERIFY / CONFIGURE

| Item | Status | Action |
|------|--------|--------|
| Resend | Needed for portal invite + owner emails | Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Telnyx SMS | Needed for client confirmations | Verify Telnyx env vars |
| `NEXT_PUBLIC_APP_URL` | For consent + portal invite callbacks | Set to your production URL |
| Portal invite | Sends after each booking | Test a booking and check email |
| Get-app page | Clients add to homescreen | Share `hellogorgeousmedspa.com/get-app` |

---

## 📋 TO-DO: PRIORITY ORDER

### 1. Add Videos & Photos (Immediate)
- Go to **Admin → Content → Providers**
- Add videos (MP4) and before/after photos for Danielle & Ryan
- Tag by service (Botox, lip filler, etc.)
- Check “Client consent confirmed” for before/afters
- Publish; they show on `/providers` and profile pages

### 2. Voice Assistant (Phone Booking)
- **Current:** Chat widget only; no phone AI yet
- **To go live:** You need:
  1. Telnyx Voice enabled on a number
  2. Voice AI stack (e.g. Vapi, Retell) or custom STT + LLM + TTS
  3. Integration with your booking APIs
- **Docs:** `WHATS_BUILT_AND_VOICE_STEPS.md`, `AI_RECEPTIONIST_INITIATIVE.md`

### 3. Optional Enhancements
- **In-chat booking** — Embed booking flow in the chat widget (currently links out)
- **Email confirmations** — Add Resend email in addition to SMS
- **Reminder automation** — Use existing `/api/reminders/send` in automations

---

## 📱 Client Journey (Current Flow)

1. Client visits site → sees Book CTA
2. Books at `/book` or `/portal/book` (portal requires login)
3. **Guest booking** — No account needed; they enter name, email, phone
4. **After booking:**
   - SMS confirmation (Telnyx)
   - Magic link email (Resend) → “Access My Client Space”
   - Consent forms (if applicable)
5. Client clicks magic link → lands in `/portal`
6. In portal: view appointments, cancel/reschedule, book again, rewards, referrals
7. **Add to homescreen** — From `/portal` or `/get-app`, follow browser install prompt

---

## 🔒 Compliance Notes

- **HIPAA** — Trust badges, no PHI in emails, magic link is time-limited
- **Consent** — Required for before/after; checkbox in admin before publish
- **RLS** — Row Level Security on provider media and concern/mascot tables

---

## Quick Links

| What | URL |
|------|-----|
| Book (public) | `/book` |
| Client portal | `/portal` |
| Get the app | `/get-app` |
| Admin providers media | `/admin/content/providers` |
| Providers public page | `/providers` |
