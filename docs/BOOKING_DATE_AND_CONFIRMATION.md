# Booking: Date/Timezone & Confirmations (Blocker Fix)

**Business timezone:** `America/Chicago` (single source of truth for all booking and calendar display).

---

## Date handling (no more wrong-day)

- **Input:** Client sends `date` as **YYYY-MM-DD** and `time` as e.g. **"10:00 AM"**. API rejects non–YYYY-MM-DD date with 400.
- **Storage:** `starts_at` / `ends_at` are built in **business timezone** via `lib/business-timezone.ts` and stored as ISO. So "Feb 15, 10:00 AM" (Chicago) is stored as the correct UTC instant; calendar and filters use the same logic.
- **Calendar:** Admin calendar filters by **business-day bounds** (start/end of that day in Chicago) and displays times in America/Chicago. So the day the client selects is the day shown on the provider calendar.
- **Availability:** Slot generation and conflict checks use the same business-day bounds and business-timezone logic.

No silent UTC conversion; no off-by-one day. If anything is ambiguous, the API returns a visible error.

---

## API guarantees (`/api/booking/create`)

- Accepts `date` as **YYYY-MM-DD** (or ISO string; date part is extracted).
- Combines date + time in **America/Chicago**, then persists `starts_at` / `ends_at` as ISO.
- Response includes **`starts_at`** and **`ends_at`** (exact values saved) for frontend/confirmation use.

---

## Client confirmation (mandatory)

After a successful booking:

- **SMS** is sent to the client (Telnyx) with:
  - Service name  
  - Date and time (formatted in business timezone — same as calendar)  
  - Provider name  
- Uses existing `sendAppointmentConfirmationSms`. If SMS fails, the booking is still created; failure is logged.

(Email confirmation can be added later; portal invite is still sent separately.)

---

## Owner / provider notification (mandatory)

After a successful booking:

- **Email** is sent to owner/provider via Resend:
  - To: `BOOKING_NOTIFY_EMAIL` or `OWNER_EMAIL` or fallback `hello.gorgeous@hellogorgeousmedspa.com`
  - Subject: New booking + service + date/time
  - Body: Client, service, provider, date & time (business TZ), location
- Requires **RESEND_API_KEY** and **RESEND_FROM_EMAIL**. If Resend is not configured, the booking still succeeds; failure is logged.

---

## Env / config

- **Business timezone:** `America/Chicago` (in code; no env).
- **Owner notification:** `BOOKING_NOTIFY_EMAIL` or `OWNER_EMAIL` (comma-separated for multiple).
- **Location string** in confirmations: `NEXT_PUBLIC_BUSINESS_LOCATION` or default `Oswego, IL`.

---

## Test checklist (date + confirmation)

Before sign-off, verify:

1. **Same day:** Book for "tomorrow" 10:00 AM → provider calendar shows that date and 10:00 AM (Chicago).
2. **No off-by-one:** Book late evening (e.g. 8 PM) and early morning (e.g. 8 AM); both show on the correct calendar day.
3. **Client SMS:** Client receives confirmation SMS with correct date, time, service, provider.
4. **Owner email:** Owner receives Resend email with same details (when Resend is configured).
5. **Website and Google booking link:** Run at least one test from each; same behavior.

---

## References

- `lib/business-timezone.ts` — `businessDateTimeToUTC`, `businessDayToISOBounds`, `formatInBusinessTZ`, `getBusinessDayOfWeek`
- [BOOKING_READY.md](./BOOKING_READY.md) — Production readiness and test checklist
- [BOOKING.md](./BOOKING.md) — Single source of truth
