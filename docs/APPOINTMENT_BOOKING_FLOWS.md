# How appointment dates are set (and why one showed on the wrong day)

## Two ways to book in the POS

### 1. **Calendar Quick Book** (click an empty time slot)

- The appointment date is **whatever day is currently selected** in the calendar (the date shown at the top when you use Prev/Today/Next).
- Example: If the calendar is showing **tomorrow** and you quick-book a phone call for “Thursday the 18th” without changing the calendar back to the 18th, the appointment is saved for **tomorrow**, not the 18th.
- The Quick Book modal shows the date in small text (e.g. “Thursday, February 18”) — always confirm that date before clicking to book.

### 2. **New Appointment** (Admin → Appointments → New, or “Book Appointment” on a client)

- The form **defaults to today’s date** when you open it. It does **not** auto-set the date from the calendar or from “Book Appointment” (only the client is pre-filled).
- So if you want a specific day (e.g. Thursday the 18th), you must **choose that date** in the “Select Date” field in Step 4. If you skip changing it, the appointment is saved for whatever date is selected (often today).

## Why Amanda Wilson’s might have shown on “tomorrow’s” calendar

- **If booked via Calendar Quick Book:** The calendar was likely on **tomorrow** when the slot was clicked. The appointment was then saved for that day, so it showed on “tomorrow’s” calendar instead of Thursday the 18th.
- **If booked via New Appointment:** The date might have been left as the default (e.g. “today” the 19th) instead of being changed to the 18th.

## “Client not found” when saving client (separate issue)

- That alert usually means the client profile save failed: the app couldn’t find the client by ID (or by email/slug in the URL). Common causes:
  - Client record or user was deleted or changed.
  - URL uses an email/slug that no longer matches (e.g. `danielleglazi`).
- It does **not** by itself move appointments to another day; it only blocks saving the client profile. If an appointment was already created with that client, the appointment date was set when the appointment was **created** (via one of the two flows above).

## What we changed to reduce wrong-date bookings

1. **Calendar Quick Book:** The modal now clearly shows **“Booking for: [full date]”** so staff can confirm the day before saving.
2. **New Appointment:** If you open the full booking form from the calendar (e.g. “Full booking form” in Quick Book), the **date, time, and provider** from the calendar are now pre-filled from the URL, so the appointment is created for the correct day unless you change it.

## Best practice for phone-ups

- **From calendar:** Before quick-booking, use the calendar’s date navigator to select the **exact day** the client asked for (e.g. Thursday the 18th), then click the time slot. Confirm “Booking for: Thursday, February 18” in the modal.
- **From New Appointment:** In Step 4, set “Select Date” to the appointment day (e.g. the 18th) before choosing a time and confirming.
