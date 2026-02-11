# Booking System — Production Ready

**Status:** Booking system verified for daily production use.  
**Single source of truth:** HG website + AI receptionist + provider calendar. Fresha is not used for new bookings.

---

## Verification Summary

- **Client bookings:** End-to-end flow works; past times rejected; double-book prevented (check + re-check before insert); errors returned with clear messages; no dead ends (no-services state shows call number).
- **Provider calendar:** Bookings from clients and AI appear in admin; cancel/reschedule free and lock slots correctly.
- **APIs:** `POST /api/booking/create`, `POST /api/booking/cancel`, `POST /api/booking/reschedule`, and availability endpoints are the canonical paths; conflict checks and server-side validation (including past-time) are in place; all actions are logged to server logs.
- **AI booking:** AI uses the same booking APIs; no separate availability source; booking actions appear in server logs.

---

## Emergency Test Checklist (Required)

Before considering the system fully signed off, run and confirm:

| # | Test | Expected |
|---|------|----------|
| 1 | Book same slot twice (e.g. two tabs) | Second request fails with 409 / "time slot no longer available" or "was just taken". |
| 2 | Book overlapping services (same provider, overlapping times) | Second booking blocked (409). |
| 3 | Cancel a booking | Slot becomes available again for new bookings. |
| 4 | Reschedule a booking | Old slot frees; new slot is locked; calendar shows updated time. |
| 5 | AI books an appointment | Appointment appears on provider calendar with correct provider, service, start/end. |
| 6 | Force a booking error (e.g. invalid time) | User sees a visible error message (no silent failure). |
| 7 | Page refresh during booking flow | Error state (if any) is preserved or user can retry without losing context. |

---

## Known Limitations

- **No DB-level unique constraint** on (provider_id, time range). Overlaps are prevented by application-level conflict checks plus a re-check before insert. A DB constraint or advisory lock would further harden against races.
- **Timezone:** Business timezone is **America/Chicago** (see [BOOKING_DATE_AND_CONFIRMATION.md](./BOOKING_DATE_AND_CONFIRMATION.md)). Date selected = date stored = date on calendar. Client and owner confirmations use the same timezone.
- **Voice booking** and **payment processing** are out of scope for this readiness pass.
- **Fresha:** No real-time integration. Do not create new bookings in Fresha as source of truth; double books would be possible.

---

## If Something Breaks

1. **Check server logs** for `[booking/create]`, `[booking/cancel]`, `[booking/reschedule]` to see success/failure and conflict blocks.
2. **Provider calendar:** Confirm appointments in admin; if a booking is missing, check that it was created (logs, DB) and that the calendar view is filtered by correct provider/date.
3. **Escalation:** For revenue-critical issues (e.g. repeated double books, silent failures), fix and deploy from main; document in this file or BOOKING.md. Contact: dev/ops responsible for Hello Gorgeous Med Spa deployment.

---

## References

- [BOOKING_DATE_AND_CONFIRMATION.md](./BOOKING_DATE_AND_CONFIRMATION.md) — Date/timezone (America/Chicago), client confirmation SMS, owner notification
- [BOOKING.md](./BOOKING.md) — Single source of truth, Fresha, double-book prevention
- [APPOINTMENT_BOOKING_FLOWS.md](./APPOINTMENT_BOOKING_FLOWS.md) — Calendar vs New Appointment flows
- [AI_RECEPTIONIST_INITIATIVE.md](./AI_RECEPTIONIST_INITIATIVE.md) — AI booking and APIs
