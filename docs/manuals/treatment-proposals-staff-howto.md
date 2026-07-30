# Treatment Proposals — Staff How-To

**Hello Gorgeous Med Spa · Oswego**  
**For:** Front desk, injectors, providers, ownership  
**Updated:** July 30, 2026

**Live tool:** [hellogorgeousmedspa.com/admin/proposals](https://www.hellogorgeousmedspa.com/admin/proposals)  
**Printable guide:** [/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html](/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html)  
**How to sell packages (Morpheus8 + Solaria):** [/staff/protocols/guides/InMode-Packages-How-To-Sell.html](/staff/protocols/guides/InMode-Packages-How-To-Sell.html)

---

## What this is

A **treatment proposal** is a branded consult plan you build for a client — packages, injectables, Morpheus8, vitamins, peptides, etc. — then share as a live link, PDF, email, or text. Clients can accept/decline, pay a Square deposit or pay in full, and get pre/post care guides.

Clients can also start their own estimate at [/build-your-proposal](https://www.hellogorgeousmedspa.com/build-your-proposal) (staff still reviews and closes).

---

## 60-second flow

1. **Admin → Proposals → + New proposal**
2. Enter client name (+ email/phone if you have them)
3. Tap a **package** and/or check services
4. Click **Auto-generate options** (Essential / Recommended / VIP)
5. Adjust discounts or custom totals if needed
6. **Save** → lands on **Preview**
7. **Send** email or SMS, create **Square pay** link, optional **care guides**
8. Watch status chips: Sent → Viewed → Accepted / Declined → Deposit paid / Paid

---

## Step-by-step

### 1. Open the builder

| Action | URL |
|--------|-----|
| List all proposals | `/admin/proposals` |
| New proposal | `/admin/proposals/new` |
| Edit existing | row → **Edit** |
| Preview / send / pay | row → **Preview** |

Status chips next to each row: Draft, Sent, Viewed, Accepted, Declined, Paid, etc.

### 2. Client + concerns

- **Name** required
- Email / phone — needed to send the plan or payment link
- Check concern chips (laxity, scars, weight loss, etc.) — helps frame the consult story
- Optional **before/after photos** (upload on the builder)

### 3. Build the plan

**Quick-add packages** (top of builder)

- Transformation / Ultimate-style package cards — one tap adds the fixed package price

**Service selection**

| Section | Use for |
|---------|---------|
| Weight loss dropdown | Consult, dose tiers, 3-month, oral, insurance oversight |
| Peptides grid | Retail “from” monthly protocols + Formulation GHK-Cu |
| **Vitamin injections** | 1 / 2 / 3-month B4G2 plans + à la carte shots + cheat sheet |
| **Exosomes add-on** | Advanced healing on procedures (+$250/session) |
| Injectables / InMode / skin / laser | Checkboxes; **Botox-style units** use unit presets (20–60) |

Then click **Auto-generate options**.

**Tip:** Auto-generate on Morpheus8 / microneedling / Solaria / packages often suggests **exosomes** and a **vitamin while-treating plan** on Recommended / VIP. You can remove anything you don’t want.

### 4. Tune the three options

Each option has:

- Line items + quantities
- Discount mode: none / package / % off / $ off / **custom total**
- Timeline months (auto from quantities)

Edit freely, then **Save**.

### 5. Preview → share → get paid

On **Preview** (`/admin/proposals/[id]/preview`):

| Button / block | What it does |
|----------------|--------------|
| Copy public link | Client page `/proposals/{publicId}` |
| Email / SMS | Sends the live proposal |
| PDF | Download / email PDF |
| **Square payment** | Deposit % (default 50%) or pay in full → Square Payment Link |
| Cherry / CareCredit | Financing apply links for the client |
| Send care guides | Email/SMS mapped pre & post care for treatments on the plan |

**Square note:** Checkout line shows **Payment type: Proposal** (e.g. `Proposal · Deposit · Recommended Plan`). Payment also lands on the RX payment ledger under source **treatment proposal**.

When the client pays, webhooks move the proposal to **deposit_paid** or **paid**.

### 6. Client side (what they see)

- Live plan with Essential / Recommended / VIP
- Accept or decline (staff get alerted)
- Pay via your Square link
- Care guides when mapped
- Vitamin cheat sheet if vitamins are on the proposal

---

## Vitamin injections while treating (script)

Procedures like Morpheus8 are often **~6 weeks apart**. Offer weekly Vitamin Bar shots between visits.

**Buy 4 Get 2 Free** on $25 Vitamin Bar injections:

| Plan | Shots | List | Client pays |
|------|-------|------|-------------|
| 1-month | 6 | $150 | **$100** |
| 2-month | 12 | $300 | **$200** |
| 3-month | 18 | $450 | **$300** |

**Say this:**

> “While you’re healing between visits, we draw up 6 weeks of vitamin injections at $25 each. Buy 4, get 2 free — so one cycle is $100 instead of $150. Most people doing a series pick the 2- or 3-month plan.”

Open the **Quick cheat sheet** in the builder (or on the client proposal) to explain B12, Biotin, Glutathione, NAD+, etc.

**À la carte:** Any Vitamin Bar shot at published retail if they’re not doing a plan.

---

## Exosomes — advanced healing add-on

- **AnteAGE Exosomes — Advanced Healing Add-on · $250 per session**
- Offer with Morpheus8, microneedling, Solaria CO₂, Quantum RF, PRP/PRF
- Position as: better recovery, collagen signaling, pairs with the procedure — not a substitute for the procedure

**Say this:**

> “We can layer AnteAGE exosomes on your treatment day for advanced healing — $250 add-on. It’s the upgrade a lot of clients choose on Recommended and VIP plans.”

---

## Alternate: RX Invoices → Proposals track

If you only need a **quick Square pay link** (deposit / balance / custom) without a full multi-option proposal:

1. Go to **Admin → RX Invoices** (`/admin/rx-invoices`)
2. Filter track **Proposals**
3. Pick template (deposit / balance / pay in full / custom)
4. Enter client + amount → send

Square still labels these **Payment type: Proposal**.

---

## Status meanings (quick)

| Status | Meaning |
|--------|---------|
| Draft | Saved, not shared yet |
| Sent | Email/SMS went out |
| Viewed | Client opened the link |
| Accepted | Client chose a plan |
| Declined | Client declined (staff alerted) |
| Deposit paid / Paid | Square payment reconciled |
| Expired | Past expiration date |

---

## Do / don’t

**Do**

- Capture phone + email before send
- Confirm which **option** you’re charging before creating Square deposit
- Offer Cherry when total is large
- Stack vitamins + exosomes on series plans
- Re-open **Edit** if the consult changes — then re-send the link

**Don’t**

- Promise medical outcomes or guaranteed results in notes
- Hardcode random prices — use catalog / packages / vitamin plans
- Create a second Square link without checking the active link on Preview
- Skip care guides on lasers / Morpheus8 / microneedling when they’re mapped

---

## Common questions

**Client didn’t get the text?** Confirm phone format; resend from Preview.  
**Wrong amount charged?** Create a new link with custom amount; note the old one internally.  
**Public Build Your Proposal lead?** Review in Admin → Proposals, edit, then send your polished version + pay link.  
**Where’s the vitamin cheat sheet?** Builder (expand “Quick cheat sheet”) · client proposal when vitamins are included · this how-to.

---

## Links cheat sheet

| Tool | Path |
|------|------|
| Proposals list | `/admin/proposals` |
| New proposal | `/admin/proposals/new` |
| Public self-serve builder | `/build-your-proposal` |
| RX invoice (Proposals track) | `/admin/rx-invoices` |
| This how-to (HTML) | `/staff/protocols/guides/Treatment-Proposals-Staff-How-To.html` |
| How to sell packages | `/staff/protocols/guides/InMode-Packages-How-To-Sell.html` |
| Vitamin Bar (client) | `/vitamin-bar` |
