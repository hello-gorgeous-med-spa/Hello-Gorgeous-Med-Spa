# Journey → Booking conversion_status = 'booked'

When a user clicks **"Book My Consultation"** after generating a roadmap, we set a cookie and send them to **hellogorgeousmedspa.com/book**. When they **complete booking** on your site, we set `journey_sessions.conversion_status = 'booked'`.

## Flow (booking on your site: /book)

1. User clicks **Book My Consultation** (with a roadmap session).
2. They are sent to **`/api/journey/redirect-to-booking?session_id=xxx`**, which:
   - Sets a cookie `hg_roadmap_session=xxx` (1 hour, httpOnly).
   - Redirects to **https://www.hellogorgeousmedspa.com/book** (or `NEXT_PUBLIC_BOOKING_URL` if set).
3. User completes booking on **/book** (your in-house booking form).
4. When the booking form shows success (step `confirm`), it calls **POST /api/journey/confirm-booking** with credentials so the cookie is sent.
5. The API reads the cookie, updates `journey_sessions.conversion_status` to **`booked`**, clears the cookie, and returns 200. The user stays on the booking confirmation screen.

No redirect URL configuration is needed: your **BookingForm** already calls the API when booking succeeds.

## If you use an external booking system

If you later switch to an external system (e.g. Square) and that system redirects the user after booking:

- Set the **"Confirmation page URL"** / **"Redirect after booking"** to:
  - **`https://www.hellogorgeousmedspa.com/api/journey/confirm-booking`**
- Then the **GET** handler will run: it reads the cookie, marks the session **booked**, and redirects the user to **/book/thank-you**.

## Verification

- Before booking: in Supabase, `journey_sessions.conversion_status` = `generated` or `emailed`.
- After the user completes booking on /book: same row should have `conversion_status` = **`booked`**.
