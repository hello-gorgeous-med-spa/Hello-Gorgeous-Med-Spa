# Fresha + Hello Gorgeous — Hybrid operations

**Last updated:** April 2026 · **Model B (Fresha hybrid) — confirmed**

Use this when **Fresha** is the system of record for **scheduling / online booking**, and **Hello Gorgeous (HGOS)** is the system for **charting, consents, compliance workflows, internal ops, and Square** (as configured). **HG-first-party public booking is not enabled** until a formal cutover; `BOOKING_URL` in `lib/flows.ts` points at **Fresha** (via `NEXT_PUBLIC_FRESHA_BOOKING_URL` on Vercel).

There is **no Fresha API**. The bridge is **CSV export → import** plus **client match by phone** at the front desk.

---

## What is already wired in the codebase

| Item | Where |
|------|--------|
| Public “Book” / `/book` | **`lib/flows.ts`** — `BOOKING_URL` defaults to **Fresha** (`FRESHA_BOOKING_URL`). **`app/book/page.tsx`** **redirects** and **merges** allowlisted marketing params (`utm_*`, `gclid`, …). Details: [TICKET-book-redirect-query-params.md](./tickets/TICKET-book-redirect-query-params.md). |
| Override URL | **Vercel / `.env.local`:** `NEXT_PUBLIC_FRESHA_BOOKING_URL` or `NEXT_PUBLIC_BOOKING_URL` (see `lib/flows.ts`). |
| Appointments in HG from Fresha | **`npm run import-fresha-appointments`** — `scripts/import-fresha-appointments.mjs` — dedupes by `Appt. ref.` via `booking_source: fresha:<ref>`. |
| Limit import to near-term rows | Add **`--min-date=YYYY-MM-DD`** to avoid importing full history every time. |
| Clients from Fresha | **`scripts/import-fresha-clients.mjs`** — run periodically so `clients` has **phone** and **`fresha_client_id`** when available. |
| Kiosk / check-in | Needs **today’s** `appointments` in Supabase **or** client lookup by phone; see *Daily flow* below. |

---

## Weekly checklist (owner or lead)

- [ ] **Client export** (if new clients were added in Fresha): re-run **client import** so HG has phone + `fresha_client_id`.
- [ ] **Appointment export** from Fresha (CSV/Excel): save as **CSV UTF-8**, then run:
  ```bash
  npm run import-fresha-appointments -- /path/to/appointments.csv --min-date=YYYY-MM-DD
  ```
  Use **today’s date** in `--min-date` to only import from today forward (optional but recommended for large files).
- [ ] **Spot-check:** number of **today** on Fresha’s calendar ≈ number of **today** in **Admin → Calendar** (ignore timing if you import once daily).
- [ ] **Money rule:** note whether **Square** is source of truth for in-spa card; use Fresha totals only for **reconciliation** if you use both.

---

## Daily flow (suggested)

1. **Before doors open (or last night):** import **appointments** so HG shows **who is on column** for today.  
2. **Visit:** open **Charting** for the **client**; use the **calendar appointment** when it imported (links to `appointment_id` / consent flows as designed).  
3. If a visit is **not** in the import yet: look up the **client by phone**; chart anyway; you can add **Fresha appt ref** in a note until the next import.  
4. **Kiosk / consents:** use **`/kiosk`** on the iPad; **Kiosk link** in **Admin → Calendar** when the appointment exists in HG.  
5. **Do not** also run a **public HG-only** booking channel that takes **new** online books without a plan—**double booking** risk with Fresha.

---

## One-line rules for the team

- **Book online:** use **Fresha** (and any site CTA to **`/book`**, which redirects to Fresha).  
- **Chart, consent, internal:** **Hello Gorgeous**.  
- **Today’s board in HG:** from **import**, not magic sync.

---

## Related docs

- [BOOKING.md](./BOOKING.md) — first-party booking model (when you fully cut over off Fresha)  
- `scripts/import-fresha-appointments.mjs` — column expectations and `--min-date`  
- [BOOKING_READY.md](./BOOKING_READY.md) — HG booking APIs when HG is the only booker
