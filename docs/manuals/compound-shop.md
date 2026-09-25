# Compound shop — how it works

**Internal · Owner / Ryan / Damara / desk**

This is the Formulation SKU shop + medical screening. It is **not a cart**. Nobody pays on the website. Ryan reviews first. If he says yes, the clinic invoice goes out (Charm + Bluefin). Then the pharmacy fills.

Live doors:

- **REGEN door:** [https://tryregenrx.com/refill](https://tryregenrx.com/refill)
- **Hello Gorgeous door:** [https://hellogorgeousmedspa.com/regen/refill](https://hellogorgeousmedspa.com/regen/refill)
- hellogorgeousmedspa.com/refill redirects to the REGEN door so there is one public shop URL to text.

GLP-1 refills stay on `/glp1-refill`. Do not mix those into this form.

Ops login: [https://tryregenrx.com/ops](https://tryregenrx.com/ops)

---

## What the client does

1. They land on the shop (nav, homepage card, or a text with the link).
2. They pick **refill** or **I would like to add**.
3. They tap a protocol card (or use the SKU dropdown). Patient price shows on the card.
4. They complete the same medical screening we already use (identity, how they have been using it, benefit, safety stop-lights, conditions, signature).
5. They submit. They see **Screening Received** — or **Red Flags — Requires Review** if any stop-light is yes / high-risk condition / pregnant-TTC.

They are **not** charged. A request is not a prescription.

Textable line (already on the page):

`REGEN RX — refill or add a protocol. Pick your medication, see patient pricing, and complete screening so Ryan can review: https://tryregenrx.com/refill`

You can append `?sku=sermorelin&intent=refill` (or `intent=add`) so the card is preselected.

---

## What happens the second they submit

The site POSTs `/api/regen/refill-screening`. Three things persist, then staff is pinged.

### 1. Patient chart row — `regen_patients`

Match on email. Update name / phone / DOB, or create a new Illinois patient.

### 2. Marketing / form queue — `vip_waitlist`

- Campaign: `regen_refill_request`
- Status: `pending`
- CRM tag: `REGEN_REFILL_REQUEST` or `REGEN_ADD_REQUEST`
- Full screening JSON lives in `qualification_data`
- Red flags live in `concerns`

This is what the **staff board on the bottom of the shop page** reads (staff PIN or marketing login). You can download CSV from there.

### 3. Clinical ops queue — `regen_intakes`

This is what **tryregenrx.com/ops** reads.

| Field | What we write |
|---|---|
| `goal` | `refill` or `add-on` |
| `status` | `pending` |
| `amount_paid` | `0` |
| `state` / `verified_illinois` | `IL` / true |
| `current_medications` | whatever they typed under new meds |
| `medical_history` | source `regen_refill_request`, SKU, pack, patient price, and the full screening |

On the Today queue the card shows **name · email · phone · `refill` or `add-on` · pending**. Open **Chart** or **Review** to see the SKU and answers inside `medical_history`.

---

## Who gets pinged (same minute)

| Channel | Who | What |
|---|---|---|
| Email | `provider@hellogorgeousmedspa.com` | Subject like `Refill — Sermorelin · Jane Doe` or `Add-on — …`. Adds `· RED FLAGS` when held. Reply-to is the patient. Body includes protocol, SKU, price, phone, improvement, adherence, flags, and `Queue: /regen/ops`. |
| SMS | Owner cell (`FORM_ALERT_PHONE`, else Danielle’s alert number) | Short: name, refill/add-on + SKU, price, flag count, phone. |

If Resend or Twilio is down, the row is still in `/ops`. Do not wait on the ping.

---

## How you work it in /ops

1. Log in at **tryregenrx.com/ops**.
2. **Today** list — look for goal `refill` or `add-on`, status `pending`.
3. Open **Chart** for the email (patient + every intake).
4. Ryan hits **Review**. Four boxes: history, contraindications, telehealth appropriate, “I am Ryan and this is my decision.”
5. Then one of:
   - **Approve** — attested. An orders row is created. This does **not** send Formulation by itself.
   - **Need labs / Need video / Need info** — stays in queue.
   - **Decline** — no medication invoice. Do not send the pharmacy.

Red flags do **not** auto-decline. They hold the request for Ryan. The client already saw that on the thank-you screen.

### Money after a yes

- There is **no card on the shop**.
- After Approve, staff send the **Charm clinic invoice** (medication + **$30** shipping; GORGEOUS20 is 20% off medication only; $49 consult credit only if they already paid a consult).
- Patient pays **Bluefin**.
- **Then** Damara pastes / sends Formulation (FormuConnect). BLT is in-office — no ship.

The shop already stored `sku`, `productName`, `retailUsd`, and `priceLabel` on the intake. Use that when you type the Charm amount. BPC-157 is tagged investigational (`sku: review`) — Ryan picks the actual fill; do not treat the listed price as an automatic invoice.

If they decline an unpaid request: **$0**. A completed $49 consult is a paid visit and is not refunded.

---

## Pricing (so you can check the card)

Formulation sheet `patient_price` × **2.5** = client medication. Plus **$30** shipping on the invoice (not on BLT).

Example — Sermorelin SKU 2884: sheet $38 → retail **$95** → **$57** gross on the vial before Bluefin fees. Shipping is pass-through.

GORGEOUS20 never discounts shipping.

---

## What this is not

- Not Squarespace. Not a Charm storefront. Not Square checkout.
- Not an automatic monthly fill. Every refill is another review.
- Not the GLP-1 refill form.
- Not a diagnosis, dose, or outcome promise.

Illinois adults 21+ only. Compounded medication is not FDA-approved. Say that.

---

## Files (if something breaks)

| Piece | Where |
|---|---|
| Shop + form | `components/regen/RegenCompoundShop.tsx`, `Bpc157RefillScreening.tsx` |
| SKUs / prices | `lib/regen/formulation-client-pricing.ts`, `lib/regen/refill-request-catalog.ts` |
| Submit API | `app/api/regen/refill-screening/route.ts` |
| Ops today | `app/regen/ops/TodayQueue.tsx` ← `regen_intakes` |
| Invoice after approve | `app/api/regen/ops/intakes/route.ts` → Charm/Bluefin quote |

Phone if a client is stuck: **(630) 636-6193**.
