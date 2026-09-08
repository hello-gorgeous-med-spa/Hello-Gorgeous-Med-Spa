/**
 * Cash-pay language for Hello Gorgeous + REGEN RX.
 * Position: personalized elective medical care + transparent pricing.
 * Never: “we are cash-pay because we use compounding pharmacies.”
 * Never name Formulation or BoomRx to a client.
 */

import {
  REGEN_TELEHEALTH_CREDIT_LINE,
  REGEN_TELEHEALTH_FEE_USD,
  REGEN_TELEHEALTH_PATH,
  REGEN_TELEHEALTH_PROVIDER,
  regenTelehealthPriceLabel,
} from "@/lib/regen/telehealth-consult";

export const CASH_PAY_NEVER_SAY = [
  "We don't take insurance because we use compounding pharmacies.",
  "Formulation",
  "FormuConnect",
  "BoomRx",
  "503A",
  "503B",
  "This is the same as Ozempic / Wegovy / Mounjaro / Zepbound.",
  "You're guaranteed a prescription.",
] as const;

/** Phone / in-spa. Use this, then book tryregenrx.com/consult. */
export const CASH_PAY_PHONE_SCRIPT = `Hi! Hello Gorgeous Med Spa and REGEN RX are cash-pay medical practices — we don't bill insurance directly. A lot of our metabolic, wellness, longevity, and personalized programs are elective or not routinely covered, and cash-pay lets us quote you a clear price without waiting on a prior authorization.

Before any prescription can be considered, you'll meet ${REGEN_TELEHEALTH_PROVIDER} for a medical consultation. He reviews your history, medications, goals, and whether treatment is appropriate. The ${regenTelehealthPriceLabel()} consultation fee covers that evaluation and a personalized plan. It does not guarantee a prescription.

If treatment is appropriate, Ryan may send a prescription to a licensed compounding pharmacy we work with. Medication, labs, shipping, and follow-up are quoted separately before anything is ordered. ${REGEN_TELEHEALTH_CREDIT_LINE}

Would you like me to book that visit? It's at tryregenrx.com${REGEN_TELEHEALTH_PATH}.`;

/** Texts and Instagram DMs. */
export const CASH_PAY_SMS_SCRIPT = `Hi! Hello Gorgeous + REGEN RX are cash-pay — we don't bill insurance directly. Programs are personalized; many wellness, weight-management, and longevity services aren't routinely covered.

First step is a ${regenTelehealthPriceLabel()} visit with ${REGEN_TELEHEALTH_PROVIDER}. He reviews your history and goals. The fee covers his evaluation, not a guaranteed Rx. ${REGEN_TELEHEALTH_CREDIT_LINE} If he prescribes, we review medication, follow-up, and the full cost before anything is ordered.

Book: tryregenrx.com${REGEN_TELEHEALTH_PATH} · (630) 636-6193`;

export const CASH_PAY_FAQ_WHY_NO_INSURANCE = `Hello Gorgeous Med Spa and REGEN RX are cash-pay practices. We do not bill Medicare, Medicaid, or commercial insurance for these services. Many metabolic, wellness, longevity, and personalized programs are elective or not routinely covered. Cash-pay lets us give you a clear price and start care without waiting for insurance authorization. We do not guarantee reimbursement. An itemized receipt can be provided on request when appropriate. HSA and FSA cards may be used when your plan allows.`;

export const CASH_PAY_FAQ_WHY_CONSULT = `These are medical programs. ${REGEN_TELEHEALTH_PROVIDER} has to see you before any prescription can be considered. The ${regenTelehealthPriceLabel()} consultation covers his evaluation of your history, medications, goals, lab needs, risks, and options. ${REGEN_TELEHEALTH_CREDIT_LINE} A consultation does not guarantee that medication will be prescribed.`;

export const CASH_PAY_FAQ_IF_PRESCRIBED = `When clinically appropriate, a prescription may be sent to a licensed compounding pharmacy. Some patients need a customized compounded medication when an available FDA-approved product does not meet their individual needs. Compounded medications are not FDA-approved, and the FDA does not evaluate them for safety, effectiveness, or quality before marketing. Ryan will discuss options, risks, benefits, and alternatives before anything is ordered. Medication, labs, and shipping are separate from the consultation fee and quoted in writing first.`;

export const CASH_PAY_DESK_SAY = `We're cash-pay — we don't bill insurance. Ryan has to see you first. The ${regenTelehealthPriceLabel()} visit is his evaluation, not a guaranteed Rx, and it credits toward therapy if he prescribes. I can book you at tryregenrx.com/consult.`;

/** Staff-only money notes. Not client copy. */
export const CASH_PAY_PROFIT_NOTES = `
Today (live): ${regenTelehealthPriceLabel()} Square visit, credited toward the first therapy order if Ryan prescribes. Product + shipping are separate. That door stops the decline-refund dance.

Protect Ryan's time: no-show / late cancel fee on the Square visit. Do not give the visit away.

Do not sell the pharmacy. Clients hear "licensed compounding pharmacy." Default shop is Formulation via FormuConnect. BoomRx is staff-only backup for blends Formulation does not carry. Never say 503A/503B on the phone.

Next profitable layer (do not launch until Danielle says so + attorney review):
- Keep a paid consult that is NOT fully credited (credit $25–$50 toward the first management month if they enroll the same day).
- Charge a monthly clinical-management fee for oversight, messaging, and scheduled follow-up — separate from the vial.
- Labs = lab cost + a small coordination fee.
- Medication quoted after Ryan decides. Patient pays current before a refill. Ryan still approves every refill.

Do not split fees with a pharmacy or pay a partner for a named Rx.
`.trim();
