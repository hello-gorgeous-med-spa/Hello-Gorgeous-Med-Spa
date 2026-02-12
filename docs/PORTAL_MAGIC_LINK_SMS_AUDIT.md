# Portal Magic Link + SMS Confirmation Audit

**Priority:** HIGH  
**Goal:** Booking → notifications → portal access fully reliable in production

---

## 1️⃣ Magic Link Flow – Code Audit

### A. Is a magic login link triggered after every successful booking?

**YES.** The flow uses a different (but equivalent) approach than `signInWithOtp`:

| Ticket asked for | Actual implementation |
|------------------|------------------------|
| `signInWithOtp` | `auth.admin.generateLink({ type: 'magiclink', email })` |
| Supabase sends email | **Resend** sends branded email with the magic link |

**Flow:**
1. `POST /api/booking/create` creates the appointment
2. After insert, it calls `POST /api/auth/send-portal-invite` with `{ email }`
3. `send-portal-invite` uses Supabase Admin `generateLink` to create a one-time magic link
4. The link is emailed to the client via **Resend** (custom HTML, branded, includes get-app promo)
5. Client clicks link → lands on `/auth/callback` → session set → redirect to `/portal`

**Both new and existing clients** receive the magic link invite (no conditional).

### B. Supabase Auth Settings (Manual Check)

In **Supabase Dashboard → Authentication**:

| Setting | Required |
|---------|----------|
| Magic Link provider | Enabled (Email provider) |
| Password signup | Disabled (magic link only for clients) |
| Redirect URLs | Must include: |
| | `https://hellogorgeousmedspa.com/auth/callback` |
| | `https://hellogorgeousmedspa.com/**` (wildcard) |

**Note:** The magic link email is sent via **Resend**, not Supabase’s built-in email. Supabase Email Templates apply only when Supabase sends the email (e.g. `signInWithOtp`). Our flow uses `generateLink` + Resend, so Supabase templates do not affect our invite.

### C. Redirect URL

`send-portal-invite` uses `NEXT_PUBLIC_APP_URL` for `redirectTo` when available, so the magic link points to `{NEXT_PUBLIC_APP_URL}/auth/callback` → then to `/portal`. Ensure `NEXT_PUBLIC_APP_URL=https://hellogorgeousmedspa.com` in Vercel.

---

## 2️⃣ Telnyx SMS Activation Check

### Code

- `lib/notifications/telnyx.ts` sends SMS via Telnyx API
- Required env vars: `TELNYX_API_KEY`, `TELNYX_MESSAGING_PROFILE_ID`, `TELNYX_FROM_NUMBER` (or `TELNYX_PHONE_NUMBER`)

### Manual Verification (Vercel)

In **Vercel → Project → Settings → Environment Variables** (Production):

| Variable | Status |
|----------|--------|
| `TELNYX_API_KEY` | Must be set |
| `TELNYX_MESSAGING_PROFILE_ID` | Must be set (10DLC) |
| `TELNYX_PHONE_NUMBER` or `TELNYX_FROM_NUMBER` | E.164, e.g. `+16306366193` |

### Telnyx Portal Checks

1. **Messaging Profile** – Not in sandbox/pending; outbound enabled
2. **Phone number** – Fully registered and approved
3. **10DLC** – Campaign and brand approved if using 10DLC

### Health Check

`GET /api/admin/health` reports Telnyx configuration (API key + phone). Use this to confirm env vars in production.

---

## 3️⃣ Expected Confirmation Flow

| Recipient | Channel | Trigger | Content |
|-----------|---------|---------|---------|
| **Client** | SMS (Telnyx) | After booking insert | Confirmation + get-app link |
| **Client** | Email (Resend) | After booking insert | Magic link to portal + get-app |
| **Owner** | Email (Resend) | After booking insert | New booking summary |

**Optional:** Consent SMS may also be sent via `api/consents/auto-send` (Telnyx).

---

## 4️⃣ Logging Verification

After changes, the booking flow logs:

| Event | Log |
|-------|-----|
| Booking created | `[booking/create] Success` |
| SMS sent | `[booking/create] Client confirmation SMS sent successfully to {phone}` |
| SMS failed | `[booking/create] Client confirmation SMS failed` |
| Owner email sent | `[booking/create] Owner notification email sent to {emails}` |
| Owner email failed | `[booking/create] Owner notification email failed` |
| Portal invite sent | `[booking/create] Portal magic link invite sent to {email}` |
| Portal invite failed | `[booking/create] Portal invite failed or not sent` |
| send-portal-invite | `[send-portal-invite] Magic link email sent via Resend to {email}` |
| send-portal-invite Resend error | `[send-portal-invite] Resend error:` |

Telnyx success: `📱 SMS sent via Telnyx to {to}, messageId: {id}` (in `lib/notifications/telnyx.ts`).

---

## 5️⃣ QA Test Checklist

| Step | Action | Expected |
|------|--------|----------|
| 1 | Book test appointment (new client) | Appointment created, success response |
| 2 | Check phone | SMS received with correct date/time + get-app link |
| 3 | Check client email | Magic link email received (subject: "Access your secure client space") |
| 4 | Click magic link | Redirect to `/auth/callback` → `/portal` |
| 5 | In portal | See appointments, profile, etc. |
| 6 | Check owner email | New booking notification received |
| 7 | Cancel appointment | Cancel works, status updated |
| 8 | Reschedule | Reschedule works |
| 9 | Portal after cancel | Portal still accessible, cancelled appointment visible |

---

## 6️⃣ Troubleshooting

| Symptom | Check |
|---------|-------|
| No SMS | Telnyx env vars, phone format, Telnyx portal status |
| No magic link email | RESEND_API_KEY, Resend logs, spam folder |
| Magic link invalid/expired | Supabase Auth settings, redirect URLs |
| Portal shows error after click | `/auth/callback` → client-session API; Supabase auth_id ↔ users mapping |
| Wrong redirect | `NEXT_PUBLIC_APP_URL` in Vercel |

---

## Summary

- **Magic link:** Sent via Resend after every booking (new and existing clients).
- **SMS:** Sent via Telnyx; env vars must be set in Vercel.
- **Logging:** Booking create and send-portal-invite now log success/failure for each step.
- **Redirect:** Uses `NEXT_PUBLIC_APP_URL` so redirect works when called server-side.
