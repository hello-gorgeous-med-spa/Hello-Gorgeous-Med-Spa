# What’s in Place — Cross-Reference Summary

**Hello Gorgeous Med Spa**  
Use this to cross-reference features, URLs, env vars, and docs.  
*Last updated for main branch.*

---

## 1. Compliance Binder (Inspections & Legal)

| What | Where |
|------|--------|
| **Admin entry** | **Admin → Clinical → Compliance Binder** |
| **URL** | `/admin/compliance/binder` |
| **Docs (source)** | `docs/compliance-binder/` |
| **PDFs (optional)** | `public/compliance-binder/` — add e.g. `ryan_2026_medical_director_agreement.pdf` (export from Word) |

**Documents in binder (view / print / download .md):**

| # | Document |
|---|----------|
| 00 | Binder index (README) |
| 01 | Botox Complication Protocol |
| 02 | Vascular Occlusion Emergency Protocol |
| 03 | Hyaluronidase Emergency Protocol |
| 04 | Laser Safety Protocol |
| 05 | Patient Consent Requirements |
| 06 | Standing Orders for Injectables |
| 07 | Chart Audit Checklist |
| 08 | Illinois IDFPR Inspection Readiness Checklist |
| — | Medical Director Agreement (Ryan 2026) — *PDF in `public/compliance-binder/`* |

**App routes:**

- List: `app/admin/compliance/binder/page.tsx`
- Printable doc: `app/admin/compliance/binder/[slug]/page.tsx`
- API (serve/download .md): `app/api/compliance-binder/[slug]/route.ts`

---

## 2. AI Voice Receptionist (Telnyx — Incoming Calls & Booking)

| What | Where |
|------|--------|
| **Admin entry** | **Admin → AI → Voice Receptionist** |
| **URL** | `/admin/ai/voice` |
| **Webhook URL** | `https://yoursite.com/api/voice/telnyx` (set in Telnyx Portal → number → Voice) |

**Env vars:**

- `TELNYX_API_KEY` — required (same as SMS).
- `TELNYX_WEBHOOK_PUBLIC_KEY` — optional; Telnyx webhook public key (Mission Control → API Keys → Public Key) for signature verification.
- `TELNYX_VOICE_TRANSFER_NUMBER` — optional; E.164 for transfer when booking fails (e.g. `+16306366193`).

**Flow:** Incoming call → answer → Telnyx “Gather Using AI” (name, email, phone, service, date/time) → `call.ai_gather.ended` → resolve slot → `POST /api/booking/create` → speak confirmation or transfer.

**App/API:**

- Webhook: `app/api/voice/telnyx/route.ts`
- Helpers: `lib/hgos/voice-telnyx.ts` (answer, speak, gather_using_ai, transfer; date/time resolution; pickBestSlot).
- Verify: `lib/hgos/voice-telnyx-verify.ts` (Ed25519 webhook verification).

---

## 3. Post to Social (Facebook, Instagram, Google)

| What | Where |
|------|--------|
| **Admin entry** | **Admin → Marketing Hub** → “Post to social” or card |
| **URL** | `/admin/marketing/post-social` |
| **Connect Google (get tokens)** | Button/link on Post to social page → `/api/social/google-connect` |

**Google env vars (all five):**

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_BUSINESS_ACCOUNT_ID`
- `GOOGLE_BUSINESS_LOCATION_ID`

**Redirect URI for Google OAuth:**  
`https://www.hellogorgeousmedspa.com/api/social/google-callback` (or your site domain).

**APIs:**

- Post (immediate or schedule): `app/api/social/post/route.ts`
- Status (which channels configured): `app/api/social/status/route.ts`
- Scheduled list: `app/api/social/scheduled/route.ts`
- Cron (publish scheduled): `app/api/cron/scheduled-social-posts/route.ts`
- Google Connect: `app/api/social/google-connect/route.ts`
- Google Callback: `app/api/social/google-callback/route.ts`

**Docs:** `docs/SOCIAL_POSTING_SETUP.md`, `docs/GOOGLE_SOCIAL_SETUP_STEP_BY_STEP.md`

---

## 4. Marketing & Automation (Already in place)

- **5 Agents Runbook:** `docs/FIVE_AGENTS_RUNBOOK.md`; Admin → Marketing → 5 Agents Runbook.
- **Crons (e.g. in vercel.json):** reminders, review-requests, scheduled-social-posts, gift-cards, sales reconcile.
- **Booking:** `POST /api/booking/create` (canonical); availability: `GET /api/availability?provider_id=&date=&duration=`.

---

## 5. Admin Nav Quick Reference

| Section | Items relevant to this summary |
|--------|---------------------------------|
| **Clinical** | Consent Forms, **Compliance Binder**, Medications, Inventory |
| **AI** | AI Hub, Insights, Business Memory, Watchdog, **Voice Receptionist** |
| **Marketing** | Marketing Hub, **Post to social**, Contacts, Campaigns, 5 Agents |

---

## 6. Env Vars Checklist (for what we added)

| Var | Purpose |
|-----|---------|
| `TELNYX_API_KEY` | SMS + Voice (required for voice webhook) |
| `TELNYX_WEBHOOK_PUBLIC_KEY` | Voice webhook signature verification (optional) |
| `TELNYX_VOICE_TRANSFER_NUMBER` | Transfer number for voice fallback (optional) |
| `GOOGLE_CLIENT_ID` | Post to Google (Connect Google flow) |
| `GOOGLE_CLIENT_SECRET` | Post to Google |
| `GOOGLE_REFRESH_TOKEN` | Post to Google (from Connect Google or Playground) |
| `GOOGLE_BUSINESS_ACCOUNT_ID` | Post to Google |
| `GOOGLE_BUSINESS_LOCATION_ID` | Post to Google |

---

## 7. Repo Paths at a Glance

```
docs/
  compliance-binder/          # Binder markdown (01–08, 00-README)
  FIVE_AGENTS_RUNBOOK.md
  SOCIAL_POSTING_SETUP.md
  GOOGLE_SOCIAL_SETUP_STEP_BY_STEP.md
  WHATS-IN-PLACE-CROSS-REFERENCE.md   # this file

public/
  compliance-binder/          # Add PDFs here (e.g. ryan_2026_medical_director_agreement.pdf)
    README.txt

app/admin/
  compliance/binder/         # Binder list + printable doc page
  ai/voice/                  # Voice receptionist setup page
  marketing/post-social/      # Post to social UI

app/api/
  compliance-binder/[slug]/   # Serve/download binder .md
  voice/telnyx/               # Telnyx voice webhook
  social/                     # post, status, scheduled, google-connect, google-callback
  cron/scheduled-social-posts/

lib/hgos/
  voice-telnyx.ts            # Telnyx answer, speak, gather, transfer; date/time helpers
  voice-telnyx-verify.ts     # Webhook signature verification
  social-posting.ts          # postToFacebook, postToInstagram, postToGoogle
```

---

*Use this file to confirm URLs, env vars, and doc locations when configuring or inspecting the system.*
