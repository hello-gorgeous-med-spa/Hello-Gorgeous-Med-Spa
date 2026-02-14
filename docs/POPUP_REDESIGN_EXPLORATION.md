# Popup Redesign — Santé-Style Exploration

## Goal
Replace/adjust Hello Gorgeous lead capture popups with a cleaner, more organized flow inspired by [Santé Medspa](https://santembb.com/) — focused, to-the-point, and easy to complete.

---

## Current State

| Component | Trigger | Purpose | Location |
|-----------|---------|---------|----------|
| **LeadCapturePopup** | 4s or 35% scroll, 1x/7 days | "New Client Offer" → link to /subscribe | `layout.tsx` (global) |
| **EmailCapture** | 6s or 40% scroll, 1x/session | 10% off + email + concern + timeframe | `ConditionalLayout` (public pages) |

**Issues:**
- Two different popups with overlapping purposes
- LeadCapturePopup is minimal (just a link); EmailCapture has the real form
- No "New vs Existing" qualifier
- No clear "Book Now" path — both push toward email capture

---

## Santé-Inspired Flow

### Structure (What We're Adopting)
1. **Single, focused question:** "How can we help you?"
2. **Patient type:** New | Existing (quick qualifier)
3. **Area of interest:** Dropdown (Injectables, Weight Loss, Skin, Hormones, IV, etc.)
4. **Dual CTA:**
   - Primary: **Book a consultation** → `/book` (for ready-to-book users)
   - Secondary: **Tell us more** → expand form (name, email, phone) for researchers
5. **Organized layout** — clear sections, minimal copy, one clear path per user type

### Flow Diagram
```
Popup opens
    │
    ├─ "New patient" or "Existing patient"
    ├─ "Area of interest" (dropdown)
    │
    ├─ [Book a consultation] ──→ /book
    │
    └─ [Tell us more] ──→ Expand form
                            ├─ Name, Email, Phone
                            ├─ [Request consultation]
                            └─ → /api/subscribe (source: popup-consult)
```

---

## API Fit

**`/api/subscribe`** already supports:
- `email`, `name`, `phone`
- `source` (e.g. `popup-consult`)
- `concern`, `timeframe`

**Add** (optional, for Brevo attributes):
- `patientType`: "new" | "existing"
- `referralSource`: "google" | "social" | "referral" | "other"

These can be passed in the body; we extend the subscribe API to forward them to Brevo attributes.

---

## Component Plan

| File | Role |
|------|------|
| `ConsultationRequestPopup.tsx` | New Santé-style popup (replaces LeadCapturePopup) |
| `LeadCapturePopup.tsx` | Keep for fallback; or remove once ConsultationRequestPopup is proven |
| `EmailCapture.tsx` | Keep as-is for now (used in ConditionalLayout). Consider consolidating later. |

---

## Rollout

1. **Phase 1 (exploration):** Replace `LeadCapturePopup` with `ConsultationRequestPopup`
2. **Phase 2:** Monitor conversions (book clicks vs form submits)
3. **Phase 3:** Consider removing or merging `EmailCapture` if the new popup performs well and captures similar data

---

## Consent & Compliance

- TCPA-friendly: 1x per 7 days (localStorage), same as current LeadCapturePopup
- Consent line: "By submitting, you agree to receive marketing. Reply STOP to opt out. [Privacy]"
- No pre-checked boxes; explicit submit = consent
