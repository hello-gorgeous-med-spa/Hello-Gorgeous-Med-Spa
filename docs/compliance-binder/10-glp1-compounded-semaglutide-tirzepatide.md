# Compounded Semaglutide & Tirzepatide Protocol

**Hello Gorgeous Med Spa**  
**Location:** 74 W. Washington St, Oswego, IL 60543  
**Document type:** Prescription medication protocol  
**Service line:** Hello Gorgeous RX™  
**Review date:** _____________  
**Effective date:** _____________  
**Approved by (APRN / Authorized Prescriber):** _____________  
**Reviewed by (Collaborating / Supervising Physician, if applicable):** _____________

---

## Purpose

To standardize **patient-specific** prescribing, patient education, injection teaching, storage, and GI side-effect management for compounded **semaglutide** and compounded **tirzepatide** used in this practice.

This is **not** a standing order. Staff may not start, escalate, or switch molecule without an NP order. Patients do not self-select strength from a website cart; the NP matches dose to pharmacy SKU.

---

## 1. Product identity (chart and consent)

| What we prescribe | How to document | Do not document as |
|---|---|---|
| Compounded semaglutide (licensed US compounding pharmacy) | “Compounded semaglutide [strength], subcutaneous weekly, pharmacy [name], Rx #” | Ozempic® or Wegovy® unless that branded pen is what was dispensed |
| Compounded tirzepatide | “Compounded tirzepatide [strength], subcutaneous weekly, pharmacy [name], Rx #” | Mounjaro® or Zepbound® unless that branded pen is what was dispensed |

Current compounding partners used by this practice include **Formulation (FCCRx)** and other licensed pharmacies on the current formulary (e.g. BoomRx when used). Record the **actual** pharmacy and lot/BUD on fulfillment.

Compounded GLP-1 is **not FDA-approved**. That fact belongs in consent and in patient education. Off-label use of a diabetes-indicated product for weight loss, when it occurs, also belongs in the consent conversation and the rationale note.

Insurance-oversight path: prescription to the patient’s pharmacy of choice; HG provides medical oversight only. Document that medication is not billed through HG.

---

## 2. Who may prescribe and who may inject

- **Prescribe / change dose / discontinue:** Ryan Kent, FNP-BC, or covering APRN with Illinois authority and a current collaborative agreement that covers this service line.
- **Patient self-injection:** After NP or trained RN teaching; document that teach-back occurred (site, units or mg, needle disposal, when to call).
- **In-clinic injection:** Licensed nurse or APRN only, after the patient-specific order exists.

Unlicensed staff do not draw up or inject GLP-1.

---

## 3. Typical titration windows used at Hello Gorgeous

These tables are **starting windows**, not automatic escalations. Hold or reduce for intolerance. Do not jump to the top dose at week one.

Canonical menu tiers live in `lib/glp1-dose-tiers.ts` (prices change; **doses** below are the clinical ladder).

### Semaglutide (weekly subcutaneous)

| Typical window | Dose | Notes |
|---|---|---|
| Weeks 1–4 | 0.25–0.5 mg weekly | GI check; do not escalate through nausea that prevents adequate intake |
| Next step | 1.0 mg weekly | Side-effect assessment |
| Next step | 1.7 mg weekly | Weight and tolerance |
| Maintenance ceiling at HG | 2.4 mg weekly | Further increase only with documented rationale |

### Tirzepatide (weekly subcutaneous)

| Typical window | Dose | Notes |
|---|---|---|
| Weeks 1–4 | 2.5 mg weekly | GI check; baseline weight |
| Next step | 5 mg weekly | Tolerance |
| Next step | 7.5 mg weekly | Progress vs side effects |
| Next step | 10 mg weekly | Maintenance assessment |
| HG ceiling | 12.5 mg weekly | **Do not use 15 mg as a default.** Higher dose only if the NP documents why and the pharmacy SKU exists |

**Titration decision (each step):** escalate if GI is manageable and intake/hydration are adequate; **hold** 4 more weeks if nausea, constipation, or poor intake; **reduce** if persistent vomiting, signs of dehydration, or the patient cannot eat protein; **stop** per monitoring protocol (document 11).

---

## 4. Injection technique (education standard)

- Route: subcutaneous. Common sites: abdomen (avoid 2 inches around umbilicus), thigh, back of upper arm.
- Rotate sites. Do not inject into tender, bruised, or scarred skin.
- Weekly, same weekday when possible. If a dose is missed, follow the pharmacy/NP instruction in the chart — do not double-dose.
- Sharps in an approved container; do not recap as a habit that risks stick injury.
- Teach delayed gastric emptying: smaller meals, protein-forward, limit greasy/large meals early; this is coaching, not a dietitian meal plan unless separately arranged.

---

## 5. Storage and fulfillment

- Refrigerate per pharmacy label (typically 36–46°F / 2–8°C). Do not freeze. Protect from light as labeled.
- Cold-chain home delivery is the default; clinic pick-up only if documented.
- Do not ship if the continuation screen or NP review is incomplete when required.
- Record pharmacy, SKU, quantity, BUD/expiration, and ship vs pick-up in the order/chart.

---

## 6. Common adverse effects (expected vs escalate)

**Expected / manage in clinic:** nausea, decreased appetite, constipation or diarrhea, injection-site reaction, fatigue, reflux. Support: slower titration, hydration, protein, fiber as tolerated, antiemetic only if the NP orders it.

**Escalate same day to NP; consider ED:**

- Severe abdominal pain, especially radiating to the back (pancreatitis)
- Right-upper-quadrant pain, jaundice, fever (biliary)
- Persistent vomiting, inability to keep fluids (dehydration / AKI risk)
- Signs of anaphylaxis or angioedema → **911**, then NP/physician
- Symptoms of hypoglycemia in patients on insulin or sulfonylurea
- Pregnancy discovered → stop GLP-1; document counseling
- Suicidal ideation or severe mood change → urgent clinical pathway, not a refill

Aspiration / anesthesia: delayed emptying has procedural implications. Patients must disclose GLP-1 use to any surgeon or anesthetist. Hold/timing around procedures is an NP decision documented in the chart.

---

## 7. Patient education that must be delivered at start

Document that the patient was told, in plain language:

- Mechanism: appetite and slower stomach emptying
- Compounded vs brand, if compounded
- Boxed warning (MTC / MEN 2)
- Likely GI course in the first weeks
- Lean mass can fall with fat mass — protein and resistance training matter
- **A substantial share of weight often returns if the medication is stopped** without a maintenance plan
- No particular result is guaranteed
- Cost, refill, and that payment is not a prescription until NP approval

---

## 8. What this protocol does not authorize

- Prescribing for patients physically located in a state where the prescriber is not licensed
- Gray-market or patient-sourced vials
- Combining with unregulated online peptides without reconciliation
- Using aesthetic standing orders to cover GLP-1
- Adolescent prescribing as a med-spa default (outside HG’s program unless a separate, signed protocol exists)

---

## Related documents

- 09 — GLP-1 Good Faith Exam  
- 11 — GLP-1 Monitoring, Adverse Events, and Off-Ramps  
- 05 — Patient Consent Requirements  
- Live dose menu: `lib/glp1-dose-tiers.ts`  
- Staff cheat sheets: `/staff/protocols/cheat-sheets/glp1-titration-cheat-sheet.pdf` and `glp1-clinical-cheat-sheet.pdf`

---

## Emergency Contact

- **Prescriber:** _______________________  
- **Collaborating / supervising physician:** _______________________  
- **Pharmacy (Formulation / current partner):** _______________________  
- **EMS:** 911 · Clinic: (630) 636-6193

---

**Prescriber signature:** _______________________ **Date:** _____________

**Physician signature (if required):** _______________________ **Date:** _____________

*This protocol does not replace clinical judgment, the pharmacy’s labeling, or Illinois law. Doses are typical windows used at this practice and must be individualized. Not legal advice.*
