# GLP-1 Monitoring, Adverse Events, and Off-Ramps

**Hello Gorgeous Med Spa**  
**Location:** 74 W. Washington St, Oswego, IL 60543  
**Document type:** Clinical protocol / quality  
**Service line:** Hello Gorgeous RX™ medical weight loss  
**Review date:** _____________  
**Effective date:** _____________  
**Approved by (APRN / Authorized Prescriber):** _____________  
**Reviewed by (Collaborating / Supervising Physician, if applicable):** _____________

---

## Purpose

To define ongoing monitoring after a GLP-1 start, how staff escalate adverse events, and **written criteria to stop, taper, or convert to maintenance**. A program with no stopping rules has decided that everyone continues indefinitely. That is not a clinical position.

Pairs with documents 09 (good faith exam) and 10 (compounded semaglutide / tirzepatide).

---

## 1. Visit cadence

| Time | What happens | Who |
|---|---|---|
| Before first ship | Labs reviewed; consent signed; patient-specific Rx | NP |
| Titration (first 8–16 weeks) | Tolerance, weight trend, hydration, protein/resistance counseling, hold vs escalate | NP (in person or synchronous telehealth) |
| Every refill request | Continuation screen on `/glp1-refill` (pregnancy, breastfeeding, red-flag pain, new diagnosis, new insulin/SU, side effects, dose/health changes) | Patient completes; **NP reviews before ship** |
| At least every 90 days (or per current telehealth policy after a completed 90-day / 3-month cycle) | Live check-in with Ryan | NP |
| When dose changes or side effects = Yes | Do not treat prepay as a waiver — NP contact before ship | NP |

90-day prepaid supply and 3-month auto-pay waive a **scheduled telehealth fee for that shipment only**. They do **not** waive review of the continuation questionnaire or ship-hold for red flags.

If the patient will not complete monitoring, **do not continue** the prescription. Document non-participation and the stop.

---

## 2. Each reassessment must include

- [ ] GI tolerance, hydration, whether the patient is eating adequately (not only eating less)
- [ ] Red-flag symptoms (see §3) — asked, not left to volunteering
- [ ] Weight and rate of loss (too fast raises gallstone and lean-mass concern)
- [ ] New medications and new diagnoses since last visit
- [ ] Reproductive status
- [ ] Protein intake and resistance training counseling delivered
- [ ] Continuation decision **with a reason** — not “continue current dose” as the only line

---

## 3. Adverse event escalation

| Finding | Action |
|---|---|
| Mild–moderate nausea, constipation, diarrhea | Hold titration; supportive care; document. Antiemetic only if ordered. |
| Persistent vomiting / cannot keep fluids | Same-day NP. Consider ED for dehydration. Hold or stop GLP-1. |
| Severe abdominal pain ± radiation to back | **Stop.** Urgent/ED evaluation for pancreatitis. Notify NP immediately. |
| RUQ pain, fever, jaundice | **Stop or hold.** Urgent evaluation for biliary disease. |
| Hypoglycemia symptoms on insulin/SU | Coordinate with diabetes prescriber; do not adjust their insulin without that loop documented. |
| Anaphylaxis / angioedema | 911. Do not rechallenge. Document. |
| Pregnancy | Stop GLP-1. Counsel. Document. |
| Suicidal ideation / severe mood change | Urgent safety pathway. Do not refill pending NP. |
| Rapid loss with weakness / suspected sarcopenia | Hold escalation; nutrition/resistance plan; consider DEXA if in program. |

Staff who take the phone or refill form flag these for Ryan the same day. Do not tell the patient to “push through” red-flag pain.

Document: onset, symptoms, vitals if in clinic, actions, time of NP/physician/EMS notification, and follow-up.

---

## 4. Follow-up labs (after baseline)

No single mandated panel. Default at this practice:

- Repeat CMP and HbA1c when clinically indicated (symptoms, diabetes/prediabetes, GI losses, or at least with the 6-month program labs when that package applies)
- Lipids as an outcome beyond the scale
- Pregnancy test when indicated
- DEXA per current program inclusions when body-comp tracking is part of the plan

Review results in the chart. “Labs ordered” without “labs reviewed” fails audit.

---

## 5. Off-ramp criteria (write the decision)

Stop, taper, or convert to maintenance when **any** of the following apply. Chart the reason, counseling (including regain), and the plan.

1. **Non-response.** Inadequate weight reduction after an adequate trial at a therapeutic dose. The NP states the threshold used for this patient (example: little meaningful loss after ≥12 weeks at a tolerated therapeutic dose, absent another benefit such as glycemic control that justifies continuation).
2. **Intolerable adverse effects** that persist despite dose reduction and supportive management.
3. **New absolute contraindication**, including pregnancy or MTC/MEN2 discovered later.
4. **Goal attained.** Explicit choice: maintenance dose, spacing, or stop — with consent appropriate to that choice.
5. **Non-participation** in required check-ins or labs.
6. **Patient election**, after counseling on regain and a documented follow-up plan.

Taper vs abrupt stop is individualized (GI rebound, supply left in vial, pregnancy = stop now). There is no “everyone stays on max dose forever” default.

---

## 6. Special situations

- **GLP-1 started elsewhere:** complete HG good faith exam (document 09) before refilling. Inherited care does not inherit a defensible chart.
- **Upcoming procedure / anesthesia:** disclose therapy; NP documents peri-procedure guidance.
- **Below typical BMI:** only with off-label rationale and consent; do not treat aesthetic “I just want to lose 8 pounds” as indication by default.
- **Primary care unaware:** offer coordination; record the offer.

---

## 7. Refunds and communications

Patients who screen out before a prescription is issued are handled under current front-desk refund policy. Do not keep medication payment for an Rx that will not be written. Declines include a next step so the encounter reads as care, not a rejected sale.

---

## 8. Quality review

Quarterly (or per QA policy), sample charts for:

- Continuation notes that contain a reason
- At least some documented stops or declines in the program
- AE notes with time, action, and NP notification
- Consent product matching shipped product
- 90-day refill files that still contain a completed continuation screen

---

## Related live systems

- Refill continuation fields: `lib/glp1-refill-intake.ts`
- Telehealth fee / 90-day cycle: `lib/glp1-telehealth-policy.ts`
- Staff alerts: `lib/glp1-form-alert.ts`
- Clinic: (630) 636-6193

---

## Emergency Contact

- **Prescriber:** _______________________  
- **Collaborating / supervising physician:** _______________________  
- **Back-up / on-call:** _______________________  
- **EMS:** 911

---

**Prescriber signature:** _______________________ **Date:** _____________

**Physician signature (if required):** _______________________ **Date:** _____________

*This protocol does not replace clinical judgment or emergency medical care. Revise when program cadence or pharmacy partners change. Not legal advice.*
