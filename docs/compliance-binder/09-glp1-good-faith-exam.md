# GLP-1 Good Faith Exam Protocol

**Hello Gorgeous Med Spa**  
**Location:** 74 W. Washington St, Oswego, IL 60543  
**Document type:** Clinical protocol / prescribing  
**Service line:** Hello Gorgeous RX™ medical weight loss (compounded GLP-1)  
**Review date:** _____________  
**Effective date:** _____________  
**Approved by (APRN / Authorized Prescriber):** _____________  
**Reviewed by (Collaborating / Supervising Physician, if applicable):** _____________

---

## Purpose

To define the **good faith examination** required before a first GLP-1 prescription, and at each continuation decision. The start decision is the discretionary clinical act. The chart must show that a licensed prescriber evaluated a specific person, could have said no, and recorded why this drug, this dose, and this patient now.

This protocol matches live intake at `/glp1-intake`, refill health update at `/glp1-refill`, consult screening in the treatment consult room, and RE GEN post-payment weight-loss intake.

**GLP-1 prescribing is not covered by aesthetic injectable standing orders** (binder document 06). Each prescription is patient-specific.

---

## 1. Who May Do What

| Role | Allowed | Not allowed |
|---|---|---|
| Front desk / unlicensed staff | Collect contact info, height/weight as **self-reported**, hand the patient the intake, flag hard-stop answers for the NP | Interpret contraindications, decide candidacy, issue or “approve” a prescription |
| RN / MA (within training) | Measure height, weight, BP, HR in clinic; document method | Substitute for the NP evaluation |
| Ryan Kent, FNP-BC (or covering APRN with authority) | Clinical evaluation, contraindication screen, medical necessity, prescription, decline | Delegate the prescribing decision to staff |
| Collaborating / supervising physician | Per current Illinois agreement; must **name weight management / GLP-1** if an agreement is required | Aesthetic-only collaborative language does not authorize this service line |

The failure mode to avoid: staff complete the form, the NP signs later without independent inquiry. That is prescribing without an adequate evaluation.

---

## 2. Encounter Standard

A first prescription requires a **live** encounter — in person at Oswego, or **synchronous** telehealth (audio + video preferred).

Document:

- [ ] Date, start/end time (or duration), and modality (in-person / video / phone)
- [ ] Where the **patient** was physically located (Illinois license governs the patient’s state, not the clinic’s)
- [ ] Prescriber name and credentials
- [ ] That the prescriber had authority to **decline**

Asynchronous “form in → Rx out” is not an adequate evaluation. Payment-first refill checkout is a **request**, not a prescription, until the NP reviews.

---

## 3. Anthropometrics

- Web intake height/weight are **self-reported**. Label them as such in the chart (`anthropometrics_source: self-reported`).
- At the first in-person visit, **measure** height and weight, calculate BMI, and record method and date.
- Do not present self-reported values as measured.
- BMI informs counseling. **BMI is not an automatic web-form rejection.** Off-label use below typical indication requires a free-text rationale in the chart.

**Typical labeled indication (counseling floor, not a sales gate):** BMI ≥ 30, or BMI ≥ 27 with at least one **established** weight-related comorbidity (e.g. type 2 diabetes, hypertension, dyslipidemia, obstructive sleep apnea, established cardiovascular disease). Patient-checked boxes on intake are not a diagnosis until the NP confirms the basis (prior diagnosis, medication, labs, or measured values).

---

## 4. Absolute contraindications (hard stops)

Ask by **direct question**, with Yes/No recorded. A blank field is not a negative finding.

- Personal or **family** history of medullary thyroid carcinoma (MTC) — ask in those words
- Multiple endocrine neoplasia type 2 (MEN 2)
- Serious hypersensitivity (anaphylaxis or angioedema) to a GLP-1 agent
- Pregnancy or trying to conceive
- Type 1 diabetes (route to endocrinology / primary care; not managed as a med-spa weight-loss start)

**Decline** if any hard stop is yes. Document the specific reason, explain it to the patient, offer a next step (PCP/endocrinology, non-drug program, or reassessment), and apply the current refund policy for screened-out patients. Do not let a declined patient re-enter through a different intake door without NP review of the prior decline.

Breastfeeding is **not** an automatic hard stop. It requires an explicit, documented NP decision with the patient.

---

## 5. Relative findings (provider flags — judgment required)

Notice, weigh, record reasoning, adjust plan or monitoring. Do not auto-reject on the website.

- Pancreatitis history
- Gallbladder disease, stones, or cholecystectomy
- Gastroparesis or severe GI motility disorder
- Eating-disorder history or current restriction / binge / purge
- Currently on a GLP-1 obtained elsewhere (establish our own chart before assuming care)
- Insulin or sulfonylurea (hypoglycemia; coordinate with the clinician who manages that therapy)
- Other weight-loss agents or peptides obtained online (do not stack blindly)
- Oral contraceptives (counsel delayed gastric emptying / absorption)
- Bariatric surgery, diabetic retinopathy, kidney or liver disease, thyroid nodules

---

## 6. Medication reconciliation

Collecting a list is not reconciliation. The NP compares what the patient reports to what they take, resolves gaps, and acts on interactions (insulin/SU, narrow-therapeutic-index orals, other incretins, supplements by category). Record the review, not only the list.

---

## 7. Labs before first ship

Order or obtain, then **document review before the first prescription ships**. Ordering labs and starting before anyone reads them is worse than a documented reason to use recent outside labs.

Typical baseline (protocol default; NP may document a deviation):

- CMP (renal, hepatic, electrolytes, glucose)
- HbA1c
- Lipid panel
- TSH
- CBC
- Pregnancy test when clinically indicated
- Lipase/amylase when pancreatitis history makes a baseline useful

“Labs from [date] obtained from PCP and reviewed today” is an acceptable entry. Silence is not.

---

## 8. Medical necessity note (free text)

Do **not** auto-populate identical rationale language across charts. Prompt the elements; the reasoning must be the NP’s words.

A defensible note includes:

1. Measured or self-reported BMI and the qualifying basis (or off-label rationale)
2. Weight history and prior attempts
3. Absolute contraindications asked and absent (or why declined)
4. Medication reconciliation result
5. Labs reviewed (or why not)
6. Risks discussed: GI effects, boxed warning (MTC/MEN2), pancreatitis/gallbladder, regain after stop, lean-mass loss, pregnancy
7. Product to be prescribed **by actual name** (compounded semaglutide or compounded tirzepatide from the named pharmacy — not a brand pen unless that is what will be dispensed)
8. Start dose, titration intent, and reassessment date
9. Prescriber signature and date

---

## 9. Informed consent

Use the **Medical Weight Loss Consent** (`weight_loss_consent`) — distinct from aesthetic consent. Signed after the discussion, not bundled only with checkout.

The signed product must match what is dispensed. If the patient will receive a **compounded** preparation, the consent and chart must say so. Listing Ozempic® / Wegovy® / Mounjaro® / Zepbound® when a compounded vial is shipped is a documentation failure.

Re-consent at least every 180 days (current form expiry) or sooner if the molecule or material risk changes.

---

## 10. Continuation is a new decision

Eligibility is not one-time. Re-screen when:

- Pregnancy or trying to conceive
- New insulin/sulfonylurea or other new meds
- New diagnosis (pancreatitis, gallbladder, thyroid nodule, MTC/MEN2)
- Red-flag GI symptoms
- BMI / goals shift to maintenance
- Patient will not participate in monitoring

`/glp1-refill` collects a continuation screen (pregnancy, breastfeeding, abdominal red flags, new diagnosis, new insulin/SU) on **every** refill request, including 90-day prepaid supply. Prepay does not replace NP review of those answers. A live telehealth visit is required on the cadence in the current telehealth policy, and immediately if dose changes or side effects are reported.

---

## 11. Chart audit sample (quarterly)

Pull a sample of new starts and refills. Fail the chart if:

- [ ] BMI only from a web form and never corroborated in clinic
- [ ] MTC/MEN2 not asked in those words
- [ ] Identical rationale text as other charts
- [ ] Zero documented declines in the program file set
- [ ] Consent names a different product than what shipped
- [ ] Labs ordered but not reviewed before first ship
- [ ] Evaluation performed by unlicensed staff and countersigned later

---

## Related live systems

- Intake: `/glp1-intake` · slug `glp1-weight-loss-intake`
- Refill: `/glp1-refill` · slug `glp1-refill-request`
- Consult screening: treatment consult room, weight-loss vertical
- Patient packet: `public/handouts/patient-packet/HG-Patient-Packet-Weight-Loss.html`

---

## Emergency Contact

- **Prescriber (Ryan Kent, FNP-BC or covering APRN):** _______________________  
- **Collaborating / supervising physician:** _______________________  
- **Back-up / on-call:** _______________________  
- **EMS:** 911 · Clinic: (630) 636-6193

---

**Prescriber signature:** _______________________ **Date:** _____________

**Physician signature (if required by current agreement):** _______________________ **Date:** _____________

*This protocol does not replace clinical judgment, Illinois scope-of-practice rules, or pharmacy requirements. Revise when the collaborative agreement, compounding partner, or state rules change. Not legal advice.*
