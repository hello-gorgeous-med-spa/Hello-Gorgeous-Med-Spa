# Hello Gorgeous Med Spa — GLP-1 Intake Form (IntakeQ)  
**Branded build specification** · Adapted from internal intake spec · March 2026  

This document replaces generic styling in the source spec with **live Hello Gorgeous website branding** and ties the form to **`/glp1-intake`** on the public site.

---

## Platform & compliance

- **Tool:** IntakeQ (HIPAA-aligned; BAA required during signup).  
- **Why not a plain web form:** PHI (BMI, conditions, medications) must not flow through unsecured email or non-BAA tools.  
- **End state:** Patient qualifies → books via **Fresha** → team notified.  
- **Site integration:** Embed iframe `src` from IntakeQ into **`https://www.hellogorgeousmedspa.com/glp1-intake`** via env var `NEXT_PUBLIC_INTAKEQ_GLP1_IFRAME_SRC`.

---

## Section 6 — Branding (Hello Gorgeous — **use these values**)

| Brand element | Value |
|---------------|--------|
| **Primary / buttons / key headings** | `#E6007E` (HG pink) |
| **Text / structure** | `#000000` / `#1a1a1a` |
| **Page background (IntakeQ / matching site)** | `#FFFFFF` or soft blush `#FFF5F9` |
| **Secondary accent (borders, subtle highlights)** | `#000000` at low opacity or light pink `#FCE7F3` |
| **Body font** | **Inter** (Google Fonts) — matches `app/layout.tsx` |
| **Heading font (optional in IntakeQ if supported)** | **Playfair Display** for hero-style titles |
| **Logo** | Hello Gorgeous logo asset used on main site (header/footer) |
| **Practice name** | Hello Gorgeous Med Spa |
| **NAP** | 74 W. Washington Street, Oswego, IL 60543 · **630-636-6193** |

**Do not use** the burgundy/gold palette from older draft specs; it is **not** the current brand.

**Marketing graphics (site + print):**

- Injection vial: `/public/images/marketing/glp1-vial-hello-gorgeous.svg`  
- Oral dissolving tablet bottle: `/public/images/marketing/glp1-tablets-hello-gorgeous.svg`  

---

## Form flow (5 steps) — field spec summary

### Step 1 — Welcome & contact (all required)

- First name, last name, email, phone, DOB, ZIP (5-digit).

### Step 2 — Health screening (eligibility)

- Height (ft + in), weight (lbs), **BMI auto-calculated** (display only).  
- Type 1 diabetes? **Disqualifier if Yes.**  
- Pregnant or breastfeeding? **Disqualifier if Yes.**  
- Personal/family MTC or MEN2? **Disqualifier if Yes.**  
- Currently on GLP-1? Yes/No.  
- History of pancreatitis? Yes/No → **flag for provider** (not auto-disqualifier unless you choose otherwise).

**On any hard disqualifier:** show compassionate message (see below), **do not** show Fresha; **still notify** team as “Disqualified.”

### Step 3 — Goals & history

- Weight loss goal band: 10–20 / 20–50 / 50+ lbs.  
- Tried programs before? If yes → multi-select: diet / exercise / Rx / other.  
- Conditions: HTN, cholesterol, pre-DM, T2DM, PCOS, none.  
- Rx medications? If yes → long text.  
- Medication allergies? Yes/No + text if yes.

### Step 4 — Consent (single checkbox + e-sign)

Display as readable body text, then:

- Required checkbox: accuracy + informational purpose only + no diagnosis/Rx relationship + clinical review before Rx + consent to contact.  
- **Electronic signature:** full name (must match Step 1).  
- **Date:** auto, read-only.

### Step 5 — Confirmation (qualified only)

- **Headline:** e.g. “You qualify! Let’s get started.”  
- **Body:** team will reach out within ~1 business day; book consultation below.  
- **CTA:** “Book my consultation” → Fresha (open new tab):  
  `https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245`

---

## Disqualification message (on-screen)

Use a warm, non-judgmental version of:

> Thank you for completing our intake. Based on your responses, GLP-1 therapy through our current program may not be the right fit at this time. Certain conditions need a different level of care before starting this treatment. We encourage you to discuss options with your primary care provider. Questions? Call **630-636-6193**.

---

## Notifications

- **Team email:** immediate on submit; subject e.g. `New GLP-1 Intake — [First] [Last]`; include name, DOB, contact, BMI, flags, meds, timestamp.  
- **Optional SMS** to team.  
- **Patient email:** receipt + 1 business day expectation + HG contact info.  
- **Disqualified:** still notify team; tag as disqualified.

---

## Testing checklist (before go-live)

- [ ] Qualified path → Step 5 + Fresha button.  
- [ ] Each disqualifier → stop + message, no Fresha.  
- [ ] Required fields block advance.  
- [ ] Team + patient emails received.  
- [ ] Disqualified still notifies team.  
- [ ] Mobile layout usable.  
- [ ] BAA signed in IntakeQ.  
- [ ] `NEXT_PUBLIC_INTAKEQ_GLP1_IFRAME_SRC` set in production; `/glp1-intake` loads embed.

---

## Handoff summary

1. IntakeQ account + BAA.  
2. Build 5-step form + logic.  
3. Notifications + patient confirmation.  
4. Apply **Hello Gorgeous** branding (table above).  
5. Publish form → paste iframe URL into **`NEXT_PUBLIC_INTAKEQ_GLP1_IFRAME_SRC`**.  
6. Confirm **`/glp1-weight-loss`** primary CTAs point to **`/glp1-intake`** (already wired in repo).  
7. Run tests → Dani sign-off.

---

*Hello Gorgeous Med Spa · 74 W. Washington Street, Oswego, IL · 630-636-6193*
