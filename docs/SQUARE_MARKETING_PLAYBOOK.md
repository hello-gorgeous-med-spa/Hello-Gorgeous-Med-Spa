# Hello Gorgeous — Square Marketing playbook

The four campaigns below are designed to run on **Square Marketing** with audiences kept fresh by the **Square Customer-Group sync** (`/admin/marketing/square-segments`). Build them once in Square; the audiences refresh themselves whenever the sync runs.

> **Setup once:** open `/admin/marketing/square-segments` and click **Run sync now**. That creates four named groups in your Square Customer Directory: `HG First-Time Clients`, `HG Lapsed (90+ Days)`, `HG Birthday Month`, `HG All Opt-In`. Use these names as the **Audience** when creating campaigns in Square Marketing.

---

## Campaign 1 — First-time welcome (highest ROI)

- **Audience:** `HG First-Time Clients`
- **Channel:** Email + SMS (split test if you want)
- **Schedule:** Automated · sends 24 hours after first appointment marked complete
- **Goal:** Lock in the second visit. Industry data: 35% of new med-spa clients never return without a nudge.

**Subject (email):** ✨ Welcome to the Hello Gorgeous family

**Email body:**
```
Hi {{first_name}},

Thank you for trusting us with your skin. It was so good to meet you!

To say welcome to the family, we'd like to gift you $25 off your next visit
— valid for 60 days from today.

→ Book online: https://www.hellogorgeousmedspa.com/book?ref=welcome
→ Reply to this email with any questions; we read every one.

xo,
Danielle & the Hello Gorgeous team
Oswego, IL · (630) 636-6193
```

**SMS variant (160 chars):**
```
Hello Gorgeous: Welcome {{first_name}}! Enjoy $25 off your next visit (60 days). Book: hellogorgeousmedspa.com/book Reply STOP to opt out.
```

---

## Campaign 2 — 90-day win-back

- **Audience:** `HG Lapsed (90+ Days)`
- **Channel:** Email
- **Schedule:** Send weekly batch (Tuesdays 10 AM CT) — Square Marketing handles deduping if you set "max 1 per 30 days."
- **Goal:** Reactivate before they re-bond with a competitor.

**Subject:** {{first_name}}, we miss you 💕

**Body:**
```
Hi {{first_name}},

It's been a minute! As a thank-you for your loyalty, here's 15% off any
single service when you book by Friday — our way of saying we'd love to
see you back.

→ Book by Friday: https://www.hellogorgeousmedspa.com/book?ref=winback
→ Use code GORGEOUS15 at checkout (online or in-spa)

If life has changed and we're no longer the right fit, you can update your
preferences here: {{unsubscribe_link}}

xo, Danielle
```

---

## Campaign 3 — Birthday month

- **Audience:** `HG Birthday Month`
- **Channel:** Email + SMS
- **Schedule:** Send 1st of every month, 9 AM CT
- **Goal:** Birthday emails routinely have the highest open rate of any med-spa campaign type.

**Subject:** Happy birthday {{first_name}} 🎂 Treat yourself.

**Email body:**
```
Hi {{first_name}},

It's your birthday month! Pick something gorgeous on us:

  · Free $50 product/add-on with any service this month
  · Or 20% off any single treatment booked + paid by month end

→ Book your birthday treat: https://www.hellogorgeousmedspa.com/book?ref=birthday
→ Mention "BDAY2026" if booking by phone

Cheers to another beautiful year.

xo,
Danielle & team
```

**SMS:**
```
Hello Gorgeous: 🎂 Happy bday {{first_name}}! Free $50 add-on or 20% off any service this month. Book: hellogorgeousmedspa.com/book Reply STOP to opt out.
```

---

## Campaign 4 — Newsletter / value drops

- **Audience:** `HG All Opt-In`
- **Channel:** Email (monthly), SMS (weekly tip — ~3 lines, no offer 80% of the time)
- **Goal:** Top-of-mind. Med spas running weekly value-only SMS see ~23% higher annual visit frequency.

**Monthly email (1st Wednesday, 11 AM CT) — subject ideas:**
- "Your skin changes by season. Here's the May playlist."
- "What I'm doing on my own face this month — Danielle"
- "Three Botox myths I bust at every consult"

**Weekly tip SMS (Tuesdays, 10 AM CT — no offer):**
```
Hello Gorgeous tip: SPF works better when you reapply at lunch — even indoors near a window. UVA goes through glass. (Reply STOP to opt out.)
```

```
Hello Gorgeous tip: If your filler "looks weird" in selfies but fine in mirror, that's lens distortion not your face. Front-camera + close = funhouse mirror.
```

```
Hello Gorgeous tip: Retinol burns? Try a sandwich — moisturizer first, retinol on top, moisturizer again. Ramps you up without irritation.
```

---

## Cadence (don't over-blast)

| Campaign | Cap |
|----------|-----|
| First-time welcome | 1× per client, 24h after appt |
| Win-back | Max 1 per 30 days per client |
| Birthday | 1× per client per year |
| Newsletter | Monthly email · weekly value SMS |

**Combined ceiling:** no client should receive more than ~2 emails or ~5 SMS in any 30-day window. Square Marketing's "max sends" feature enforces this; turn it on.

---

## Tracking what worked

- All campaign URLs include a `?ref=` query string (welcome / winback / birthday / newsletter / etc.).
- Square Marketing reports clicks; the `/book` route already preserves `ref` onto the Square scheduler so attribution flows through.
- Quarterly: open `/admin/marketing/square-segments` → check that segment counts are growing in expected directions (First-Time should churn out as they age past 30 days; Lapsed should shrink as Win-back works).

---

## When to refresh the playbook

- Open rates < 18% for two months running on the same campaign → new subject line.
- SMS opt-out rate > 0.5% per send → reduce frequency, more value content vs offers.
- Booking conversion from welcome flow < 25% → stronger first-visit offer (e.g. free brow wax with any service).

---

## Square Automations setup checklist (all 4)

Dashboard: https://app.squareup.com/dashboard/customers/marketing/automations

### Before you start (5 min)

1. Open https://www.hellogorgeousmedspa.com/admin/marketing/square-segments → **Run sync now**
2. Confirm these Customer Groups exist in Square Directory:
   - `HG First-Time Clients`
   - `HG Lapsed (90+ Days)`
   - `HG Birthday Month`
   - `HG All Opt-In`
3. In Square Marketing settings, turn on **max sends / frequency caps** if available (target: ≤2 emails + ≤5 SMS per client per 30 days).

### Automation A — Welcome (new clients)

| Field | Value |
|-------|--------|
| Name | `HG Welcome — First Visit` |
| Type | Automated email (+ optional SMS) |
| Audience | `HG First-Time Clients` |
| Trigger | New customer / first visit complete · wait **24 hours** |
| Cap | 1× per customer forever |

**Subject:** ✨ Welcome to the Hello Gorgeous family

**Body:** use Campaign 1 email body above.

Optional SMS: Campaign 1 SMS variant.

### Automation B — Win-back (90+ days)

| Field | Value |
|-------|--------|
| Name | `HG Win-back — 90 Days` |
| Type | Automated or recurring email |
| Audience | `HG Lapsed (90+ Days)` |
| Trigger / schedule | Weekly batch · **Tuesdays 10:00 AM America/Chicago** |
| Cap | Max **1 per 30 days** per customer |

**Subject:** {{first_name}}, we miss you 💕

**Body:** use Campaign 2 body above. Code: `GORGEOUS15`.

### Automation C — Birthday month

| Field | Value |
|-------|--------|
| Name | `HG Birthday Month` |
| Type | Automated / monthly recurring |
| Audience | `HG Birthday Month` |
| Schedule | **1st of month · 9:00 AM America/Chicago** |
| Cap | 1× per customer per year |

**Subject:** Happy birthday {{first_name}} 🎂 Treat yourself.

**Body:** use Campaign 3 email (mention **BDAY2026**). Optional SMS: Campaign 3 SMS.

> Re-run segment sync on the 1st (or keep nightly cron) so `HG Birthday Month` refreshes each month.

### Automation D — Monthly newsletter

| Field | Value |
|-------|--------|
| Name | `HG Monthly Glow Notes` |
| Type | Recurring email blast (automation or scheduled campaign) |
| Audience | `HG All Opt-In` |
| Schedule | **1st Wednesday · 11:00 AM America/Chicago** |
| Cap | 1× per month |

**Subject (rotate):**
- Your skin changes by season — here's this month's playlist
- What I'm doing on my own face this month — Danielle
- Three Botox myths I bust at every consult

**Body skeleton:**
```
Hi {{first_name}},

[2–3 short education paragraphs — no hard sell]

This month at Hello Gorgeous:
· Book online: https://www.hellogorgeousmedspa.com/book?ref=newsletter
· MD oversight · FNP-BC on site · Come in — we're friendly
· Oswego · (630) 636-6193

xo, Danielle & team
```

Optional: add a separate **weekly tip SMS** later (value-only, Tuesdays 10 AM) — not required for day-one.

### After activate

- [ ] Send yourself a test for A, B, C, D
- [ ] Confirm unsubscribe / STOP language present on SMS
- [ ] Spot-check that coupon codes work at desk (`GORGEOUS15`, birthday offer)
- [ ] Leave automations **Active** — don't re-create duplicates next month
