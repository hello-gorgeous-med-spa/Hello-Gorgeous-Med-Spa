# Campaign — Booking has moved off Fresha → Square

**Goal:** Tell every client online booking is no longer on Fresha. Book at Hello Gorgeous via Square (our site `/book`).

**Primary channel:** Square Marketing **email** → audience `HG All Opt-In`  
**Optional:** Opt-in SMS only (clients with `accepts_sms_marketing = true`) — never `/admin/sms` “Send to all”

**Booking link (use this everywhere):**  
https://www.hellogorgeousmedspa.com/book?ref=booking_migrate

**HTML file to paste / attach:** `emails/booking-moved-to-square.html`

---

## Before you send (checklist)

1. [ ] Sync Square segments: `/admin/marketing/square-segments` → **Run sync now**
2. [ ] Confirm `/book` redirects to Square (`L3QDRS4DX9ZE4`) — already live
3. [ ] Enable Laura for Appointments if FlowWave should show her online
4. [ ] Decide: pure announcement, or announcement + small thank-you offer (recommended: `$25 off` next visit, code `SQUARE25`, 30 days)
5. [ ] Send yourself a test from Square Marketing first
6. [ ] Send Tue–Thu **10am–12pm CT** (best open window)

> **Accuracy note:** If NP telehealth or VIP deposits are still booked on Fresha, say “**spa & injectables booking** has moved” — not “we never use Fresha.” Update this copy once those are 100% Square.

---

## Recommended send plan

| Step | Channel | Audience | When |
|------|---------|----------|------|
| 1 | Email | `HG All Opt-In` | Day 0 |
| 2 | SMS (opt-in only) | Clients with SMS consent | Day 1–2 (short reminder) |
| 3 | Email reminder | Anyone who didn’t open #1 (Square “resend to non-openers” if available) | Day 5–7 |
| 4 | Google Business / IG / FB story | Public | Same day as email |

---

## Email — Square Marketing

**Audience:** `HG All Opt-In`  
**From:** Hello Gorgeous Med Spa (Danielle)  
**Subject A:** Important: We’re no longer booking on Fresha  
**Subject B (A/B):** Book Hello Gorgeous the new way →  
**Preview text:** Online booking moved to Square — same spa, same team, easier link.

### Plain-text body (paste into Square)

```
Hi {{first_name}},

Quick update from Hello Gorgeous Med Spa 💕

We’re no longer using Fresha for online booking.

Going forward, book your appointments through our Square booking page
(or hellogorgeousmedspa.com/book — same place).

→ Book now: https://www.hellogorgeousmedspa.com/book?ref=booking_migrate

Same Oswego spa. Same team. Same services you love —
just a smoother booking experience.

Already have a future appointment on Fresha?
You’re still on our calendar — no action needed for that visit.
For your next booking after that, use the new link above.

Questions? Reply to this email or call (630) 636-6193.

xo,
Danielle & the Hello Gorgeous team
74 W Washington St, Oswego IL
```

### With thank-you offer (optional add-on)

After the “Book now” line, insert:

```
As a thank-you for updating with us, enjoy $25 off your next visit
with code SQUARE25 — valid 30 days. Online or in-spa.
```

Create the `SQUARE25` discount in Square Catalog → Discounts before sending.

---

## SMS — opt-in only

**Do not** blast every phone number. Use opt-in list only.

```
Hello Gorgeous: We’re no longer booking on Fresha. Book online here: hellogorgeousmedspa.com/book?ref=sms_migrate Reply STOP to opt out.
```

Alt with offer:

```
Hello Gorgeous: Booking moved off Fresha → Square. Book + $25 off (SQUARE25): hellogorgeousmedspa.com/book?ref=sms_migrate Reply STOP to opt out.
```

---

## Social / Google Business (short)

```
💕 Booking update: Hello Gorgeous is no longer using Fresha for online appointments.

Book anytime at hellogorgeousmedspa.com/book

Same spa · Same team · Easier booking ✨
Oswego · (630) 636-6193
```

---

## Front-desk script (if someone calls confused)

> “Yes — we switched our online booking from Fresha to Square. Your past visits and any appointments already on the books are fine. For anything new, go to hellogorgeousmedspa.com/book or I can book you right now.”

---

## After send

1. Pin the booking link in IG bio / Google Business “Book”
2. Remove Fresha booking buttons from remaining site pages / emails when you can
3. Watch Square Appointments for a 7-day booking spike from `ref=booking_migrate`
