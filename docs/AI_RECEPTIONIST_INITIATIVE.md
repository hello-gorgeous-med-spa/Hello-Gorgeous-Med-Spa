# Hello Gorgeous AI Receptionist (“Mini-Me” Mascot) — Initiative Spec

**Purpose:** Elevate the Hello Gorgeous AI Mascot into the primary voice and front-desk operator — a reliable, efficient, non-annoying AI receptionist that mirrors Danielle’s decision-making and brand voice.

**She is not a chatbot.** She is the digital front desk, concierge, and operator for Hello Gorgeous Med Spa.

**Related:** [AI Admin Commands](./AI_ADMIN_COMMANDS.md) — owner-only, approval-gated commands for website/site content (Insights → Admin Commands tab). Does not affect receptionist or client AI.

---

## Core Identity (Non-Negotiable)

| Attribute | Value |
|-----------|--------|
| **Name (working)** | Hello Gorgeous Assistant (Mini-Me) |
| **Role** | AI Voice Agent + Chat Receptionist |
| **Tone** | Confident, warm, efficient, polished, medical-professional |
| **Personality** | Not salesy, not repetitive, not robotic. Calm, smart, helpful. Knows when to act vs escalate. Think: Danielle’s brain + front desk superpowers + perfect memory. |

---

## Primary Responsibilities

### 1. Act as the Voice Behind the Company

- Website chat  
- Voice receptionist (phone)  
- Booking assistant  
- Intake coordinator  
- Knowledge authority  

**All public-facing AI routes through her unless explicitly overridden.**

### 2. Live Appointment Control (CRITICAL)

| Action | Capability | API / Implementation |
|--------|------------|----------------------|
| **Book** | Service, provider (Ryan/Danielle), date & time, confirm, trigger confirmations/reminders | `POST /api/booking/create`, `GET /api/availability`, `GET /api/booking/services`, `GET /api/booking/providers` |
| **Cancel** | Cancel appointment, explain policies | `POST /api/booking/cancel` (wraps `PUT /api/appointments/[id]` with `status: cancelled`) |
| **Reschedule** | Change date/time | `POST /api/booking/reschedule` (wraps `PUT /api/appointments/[id]` with new `starts_at`/`ends_at`) |

She should be able to do everything a front-desk UI allows, programmatically.

### 3. Forms & Consents (Front Desk Power)

- Send intake forms  
- Send consent forms  
- Re-send on request  
- Know which services require which forms  
- Confirm completion status  

*Implementation: use existing `/api/consents/request`, `/api/pretreatment/send`; Business Memory for “which service needs which form”.*

### 4. Knowledge Authority (Business Brain)

Sources: **Business Memory** + structured knowledge (services, pricing logic, hours, policies, supplements, providers, first-visit expectations, post-care, booking rules).

- If she doesn’t know: ask a smart clarifying question OR escalate cleanly (“I can connect you to Danielle”).

### 5. Mascot Command System

- She is the **boss of all other mascots**.  
- She can answer as herself or route internally to Peppi (peptides/hormones), Harmony (wellness), etc., or summarize their expertise.  
- The user never needs to know which mascot answered — she orchestrates.  

*Current: single widget; routing to other personas is Phase 2.*

---

## Reliability & UX Rules (Non-Negotiable)

**She MUST:**  
Avoid repeating the same sentence; give specific answers; remember context within a session; offer clear next steps; be fast and decisive.

**She MUST NOT:**  
Sound like a generic AI; loop on “book online or call”; over-talk; guess medical advice; override business rules.

---

## Technical Implementation Map

### A. Role Definition

- **Role:** `hello_gorgeous_ai_receptionist`  
- **Authority:** `primary`  
- **Location:** `lib/ai-receptionist.ts` — constants and shared helpers. All AI tools that represent “the front desk” use this role.

### B. Booking API Surface (for Chat + Voice)

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `GET /api/booking/services` | List bookable services | ✅ Exists |
| `GET /api/booking/providers` | Providers for a service | ✅ Exists |
| `GET /api/availability` | Slots for provider + date | ✅ Exists |
| `POST /api/booking/create` | Create appointment | ✅ Exists |
| `POST /api/booking/cancel` | Cancel by appointment id (+ reason) | ✅ Added (initiative) |
| `POST /api/booking/reschedule` | Reschedule (new date/time) | ✅ Added (initiative) |

She (chat + future voice) calls these directly; no duplicate logic.

**Single source of truth:** All booking APIs use only our Supabase appointments and provider schedules. Fresha is not live-integrated; no code path checks Fresha during booking. This prevents double booking and is required for reliable AI and voice booking. See [Booking: Single Source of Truth](./BOOKING.md).

### C. Voice Agent (Phase 2 — Planned Now)

- Answer phone calls; understand intent; book/cancel/reschedule verbally; log every call to AI Watchdog.  
- Voice stack: Vapi / Retell (fast path) or custom Telnyx (future).  
- **Her logic must be reusable across chat + voice** (same APIs, same intents, same watchdog shape).

### D. Watchdog Logging (MANDATORY)

Every action logs to `ai_watchdog_logs` with:

- `source`: `hello_gorgeous_ai`
- `channel`: `chat` | `voice`
- `metadata.action`: `booking` | `cancel` | `reschedule` | `info` | `escalation` | `feedback`
- `metadata.confidence`: `high` | `medium` | `low`

Implemented in: chat widget API (and future voice webhook) calling a shared logger that writes to `ai_watchdog_logs`.

### E. Admin Controls (Owner Confidence)

- **Feature flags** (e.g. in `feature_flags` or config):  
  - Enable/disable **booking via AI**  
  - Enable/disable **cancel via AI**  
  - Enable/disable **reschedule via AI**  
  - (Optional) Which services AI can book  
- **Script / copy:** Update her script and answers via **Business Memory** (no code).  
- **Metrics (future):** Bookings made by AI, cancellations handled, calls answered, escalations to humans (from watchdog + analytics).

---

## Success Definition

- Clients say: “I didn’t even need to call — she handled everything.”  
- Staff interruptions drop; bookings increase.  
- No one asks “is this a bot?”  
- Danielle doesn’t have to babysit it.

---

## Positioning (Dev Mindset)

This is **not** a chatbot feature, a widget tweak, or a marketing add-on.  
This is **the AI front desk of Hello Gorgeous** and the foundation for future clinics, brands, and licensing.

---

## File / Code References

| Concern | Location |
|---------|----------|
| Role + watchdog helper | `lib/ai-receptionist.ts` |
| Chat receptionist API | `app/api/chat/widget/route.ts` |
| Booking create | `app/api/booking/create/route.ts` |
| Booking cancel | `app/api/booking/cancel/route.ts` |
| Booking reschedule | `app/api/booking/reschedule/route.ts` |
| Availability | `app/api/availability/route.ts` |
| Appointments CRUD | `app/api/appointments/[id]/route.ts` |
| Feature flags | `app/api/config/flags/route.ts` |
| Watchdog API | `app/api/ai/watchdog/route.ts` |
| Mascot script / copy | `lib/mascot.ts`, Business Memory (Admin → AI → Business Memory) |
