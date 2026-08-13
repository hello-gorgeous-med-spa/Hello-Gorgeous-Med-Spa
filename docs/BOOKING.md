# Booking: Single Source of Truth

## Current model (August 2026)

**Public booking is Square Appointments.** `BOOKING_URL` in `lib/flows.ts` resolves to the
Square org booking site, and `/book` is the canonical branded entry that merges attribution
params before redirecting there. Hello Gorgeous (HGOS) remains the system for **charting,
consents, imports, and ops**.

`resolvePublicBookingUrl()` **rejects any non-Square scheduler URL**, so a stale env var
cannot take over public CTAs. Per-provider overrides are `NEXT_PUBLIC_SQUARE_BOOKING_URL_DANIELLE`
and `NEXT_PUBLIC_SQUARE_BOOKING_URL_RYAN`; unset falls back to the org URL.

**Fresha was discontinued** and all of its URLs have been removed from the codebase. The old
hybrid runbook is archived at [OPERATIONS_FRESHA_HG_HYBRID.md](./OPERATIONS_FRESHA_HG_HYBRID.md) —
do not follow it.

The first-party HG-only booking model (calendar + `appointments` table as the only place new
bookings are created) is described below and in [BOOKING_READY.md](./BOOKING_READY.md). It is
the target model for AI/voice booking; Square is the live consumer scheduler today.

## Canonical calendar (Model A — HG only)

**The Hello Gorgeous calendar and appointments table are the single source of truth for all new bookings.**

- All **new** client appointments are created and managed in this system only.
- **Availability** is computed from our Supabase data (provider schedules, existing appointments). No external system is queried when checking availability or creating/cancelling/rescheduling appointments.
- **AI receptionist** (chat and future voice) books, cancels, and reschedules via our APIs only. That prevents double booking and keeps one place to look.

## Why external schedulers are not live-integrated

- There is **no real-time two-way integration** with an external scheduler. It cannot see our availability, and we do not push bookings to it.
- Using two systems for **new** bookings would allow double booking (same slot taken in both calendars).
- To support AI booking, voice booking, and owner-controlled operations with **zero double-book risk**, all new bookings must flow through this system only.

## Fresha: historical data only

- Fresha was **discontinued**. The partner portal is no longer accessible and no Fresha URL appears anywhere on the site.
- The **CSV import scripts** (`scripts/import-fresha-appointments.mjs`, `scripts/import-fresha-clients.mjs`) only read **historical** exports already on disk, for history and reporting. They are not used for availability enforcement.
- The 1,931 post-appointment reviews earned on Fresha are still cited on the site, but **unbranded** — see `lib/review-trust.ts`.

## How double books are prevented

- **One system for new bookings:** Website `/book`, AI receptionist, and admin calendar all read and write only our Supabase `appointments` table (and provider schedules). No code path checks an external scheduler during booking.
- **Note:** `NEXT_PUBLIC_BOOKING_URL` currently points `/book` at Square Appointments. Only Square URLs are accepted.

## AI receptionist and voice

- The AI receptionist (and future voice booking) **rely on this model**. They call `POST /api/booking/create`, `POST /api/booking/cancel`, `POST /api/booking/reschedule`, and `GET /api/availability`. Those APIs use only our database. The AI can safely book without risk of double booking as long as all new bookings go through this system.

## Production readiness

- See **[BOOKING_READY.md](./BOOKING_READY.md)** for verification summary, emergency test checklist, known limitations, and escalation path.

## References

- [AI Receptionist Initiative](./AI_RECEPTIONIST_INITIATIVE.md) — booking/cancel/reschedule APIs and flows
- [Pre-Deploy Audit](./PRE_DEPLOY_AUDIT.md) — first-party booking and reviews
- [Appointment Booking Flows](./APPOINTMENT_BOOKING_FLOWS.md) — calendar vs new-appointment date behavior
- [Fresha + HG hybrid (operations)](./OPERATIONS_FRESHA_HG_HYBRID.md) — **archived**, superseded by Square
