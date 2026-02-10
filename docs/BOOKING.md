# Booking: Single Source of Truth

## Canonical calendar

**The Hello Gorgeous calendar and appointments table are the single source of truth for all new bookings.**

- All **new** client appointments are created and managed in this system only.
- **Availability** is computed from our Supabase data (provider schedules, existing appointments). No external system is queried when checking availability or creating/cancelling/rescheduling appointments.
- **AI receptionist** (chat and future voice) books, cancels, and reschedules via our APIs only. That prevents double booking and keeps one place to look.

## Why Fresha is not live-integrated

- There is **no real-time two-way integration** with Fresha. Fresha cannot see our availability, and we do not push bookings to Fresha.
- Using both systems for **new** bookings would allow double booking (same slot taken on Fresha and in our calendar).
- To support AI booking, voice booking, and owner-controlled operations with **zero double-book risk**, all new bookings must flow through this system only.

## Fresha: legacy / historical only

- Fresha may still be used **internally** for viewing historical appointments or staff familiarity during transition.
- **Fresha is not advertised** as a booking entry point. All public “Book” / “Book Now” links point to our `/book` flow (or `NEXT_PUBLIC_BOOKING_URL` if set).
- The **Fresha CSV import script** (`scripts/import-fresha-appointments.mjs`) is for **historical / reference only**. Imported rows are not used for availability enforcement; they are for history and reporting. New bookings are never taken on Fresha as the source of truth.

## How double books are prevented

- **One system for new bookings:** Website `/book`, AI receptionist, and admin calendar all read and write only our Supabase `appointments` table (and provider schedules). No code path checks Fresha during booking.
- **Optional:** If you ever point `NEXT_PUBLIC_BOOKING_URL` to an external URL, you would be opting out of this model; by default it is `/book` (first-party).

## AI receptionist and voice

- The AI receptionist (and future voice booking) **rely on this model**. They call `POST /api/booking/create`, `POST /api/booking/cancel`, `POST /api/booking/reschedule`, and `GET /api/availability`. Those APIs use only our database. The AI can safely book without risk of double booking as long as all new bookings go through this system.

## Production readiness

- See **[BOOKING_READY.md](./BOOKING_READY.md)** for verification summary, emergency test checklist, known limitations, and escalation path.

## References

- [AI Receptionist Initiative](./AI_RECEPTIONIST_INITIATIVE.md) — booking/cancel/reschedule APIs and flows
- [Pre-Deploy Audit](./PRE_DEPLOY_AUDIT.md) — first-party booking and reviews
- [Appointment Booking Flows](./APPOINTMENT_BOOKING_FLOWS.md) — calendar vs new-appointment date behavior
