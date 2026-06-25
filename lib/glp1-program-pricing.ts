/**
 * Hello Gorgeous GLP-1 medical weight loss — program copy & published pricing.
 * Competitive with local Oswego providers; aligned to pharmacy COGS tiers.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";

export const GLP1_PROGRAM_CONSULT_USD = PROGRAM_CONSULT_FEE_USD;

export const GLP1_PROGRAM = {
  consultUsd: GLP1_PROGRAM_CONSULT_USD,
  consultCredit:
    `The $${GLP1_PROGRAM_CONSULT_USD} consultation fee is applied to your first month of injectable medication if you decide to move forward with the plan.`,
  newPatientIntro:
    "This in-person visit is your personalized introduction to our medical weight loss program. We'll review your health history, discuss your goals, and create a custom plan designed to help you achieve lasting results — with Ryan Kent, FNP-BC on site in Oswego.",
  telehealthIntro:
    "This secured Charm EHR video visit is your personalized introduction to our medical weight loss program when an in-person slot isn't convenient. Same medical team, same candidacy review — from home.",
  followUpIncluded:
    "Active GLP-1 members: one 30-minute check-in per month included ($0) — in-person or Charm telehealth.",
  injectable: {
    heading: "Injectable compounded medications",
    includes: "Includes medication and supplies",
    /** Public anchor — matches tirzepatide starter tier */
    monthlyFromUsd: 299,
    semaglutideFromUsd: 249,
    tirzepatideStarterUsd: 299,
    tirzepatideStandardUsd: 449,
    tirzepatideAdvancedUsd: 499,
    threeMonthFromUsd: 825,
    threeMonthHighDoseFromUsd: 999,
    pendingNote: "Pending medication chosen and dose needed",
  },
  oral: {
    monthlyFromUsd: 165,
    monthlyToUsd: 279,
    note: "Sublingual semaglutide or tirzepatide — delivered to your home",
  },
  pharmacyRx: {
    monthlyEvalUsd: 99,
    note: "Evaluation and prescription sent to your preferred pharmacy",
    disclaimer:
      "This fee covers the evaluation and prescription. It does not include the cost of the medication at your pharmacy.",
  },
} as const;

/** Used by peptide hub, clubs, and SEO snippets */
export const GLP1_RETAIL_PROGRAM = {
  semaglutideFromUsd: GLP1_PROGRAM.injectable.semaglutideFromUsd,
  tirzepatideFromUsd: GLP1_PROGRAM.injectable.tirzepatideStarterUsd,
} as const;

export const GLP1_PROGRAM_DISCLAIMER =
  "Published pricing reflects common starter protocols after NP evaluation. Dose, medication (semaglutide vs tirzepatide), format (injectable vs oral), and labs may change your quote. Compounded GLP-1 medications are not FDA-approved drug products for all uses described.";

export const GLP1_PROGRAM_PRICING_BULLETS = [
  `${GLP1_PROGRAM.injectable.heading}: ${GLP1_PROGRAM.injectable.includes}`,
  `Monthly subscriptions from $${GLP1_PROGRAM.injectable.monthlyFromUsd}/month (${GLP1_PROGRAM.injectable.pendingNote})`,
  `Semaglutide injectable from $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/month`,
  `Tirzepatide injectable from $${GLP1_PROGRAM.injectable.tirzepatideStarterUsd}/month · standard $${GLP1_PROGRAM.injectable.tirzepatideStandardUsd}/mo · advanced $${GLP1_PROGRAM.injectable.tirzepatideAdvancedUsd}/mo`,
  `3-month subscription from $${GLP1_PROGRAM.injectable.threeMonthFromUsd} (${GLP1_PROGRAM.injectable.pendingNote})`,
  `High-dose 3-month protocol from $${GLP1_PROGRAM.injectable.threeMonthHighDoseFromUsd}`,
  `Oral medications: $${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/month ${GLP1_PROGRAM.oral.note}`,
  `Pharmacy Rx option: $${GLP1_PROGRAM.pharmacyRx.monthlyEvalUsd}/month — ${GLP1_PROGRAM.pharmacyRx.disclaimer}`,
] as const;
