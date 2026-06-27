/**
 * Hello Gorgeous GLP-1 medical weight loss — program copy & published pricing.
 * Dose tiers defined in lib/glp1-dose-tiers.ts (single source of truth).
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import {
  GLP1_INSURANCE_OVERSIGHT,
  GLP1_PROGRAM_INCLUDES,
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
  glp1HighestSemaglutideUsd,
  glp1HighestTirzepatideUsd,
  glp1LowestInjectableUsd,
  glp1LowestSemaglutideUsd,
  glp1LowestTirzepatideUsd,
} from "@/lib/glp1-dose-tiers";

export const GLP1_PROGRAM_CONSULT_USD = PROGRAM_CONSULT_FEE_USD;

const semaLow = glp1LowestSemaglutideUsd();
const semaHigh = glp1HighestSemaglutideUsd();
const tirzLow = glp1LowestTirzepatideUsd();
const tirzHigh = glp1HighestTirzepatideUsd();

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
    includes: "Medication included at every dose tier",
    /** Public anchor — lowest semaglutide dose tier */
    monthlyFromUsd: glp1LowestInjectableUsd(),
    semaglutideFromUsd: semaLow,
    semaglutideToUsd: semaHigh,
    tirzepatideFromUsd: tirzLow,
    tirzepatideToUsd: tirzHigh,
    /** Legacy tier names — map to lowest / mid / highest tirzepatide dose tiers */
    tirzepatideStarterUsd: tirzLow,
    tirzepatideStandardUsd: GLP1_TIRZEPATIDE_DOSE_TIERS[3]?.priceUsd ?? 355,
    tirzepatideAdvancedUsd: tirzHigh,
    threeMonthFromUsd: 825,
    threeMonthHighDoseFromUsd: 999,
    pendingNote: "Price based on weekly dose — see dose tier table",
    programIncludes: GLP1_PROGRAM_INCLUDES,
  },
  insuranceOversight: {
    monthlyUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
    note: GLP1_INSURANCE_OVERSIGHT.note,
    includes: [
      "Prescription sent to your pharmacy of choice",
      "Medical oversight & provider access",
      "2 DEXA scans per year",
      "Comprehensive blood panels every 6 months",
      "1 vitamin shot per month",
      "Dosing guidance",
    ],
  },
  oral: {
    monthlyFromUsd: 165,
    monthlyToUsd: 279,
    note: "Sublingual semaglutide or tirzepatide — delivered to your home",
  },
  pharmacyRx: {
    monthlyEvalUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
    note: "Medical oversight when insurance covers your GLP-1 at pharmacy",
    disclaimer:
      "This fee covers medical oversight, labs, and dose management. It does not include medication cost at your pharmacy.",
  },
} as const;

/** Used by peptide hub, clubs, and SEO snippets */
export const GLP1_RETAIL_PROGRAM = {
  semaglutideFromUsd: GLP1_PROGRAM.injectable.semaglutideFromUsd,
  tirzepatideFromUsd: GLP1_PROGRAM.injectable.tirzepatideFromUsd,
} as const;

export {
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
  GLP1_PROGRAM_INCLUDES,
};

export const GLP1_PROGRAM_DISCLAIMER =
  "Published pricing reflects weekly dose tiers after NP evaluation. Medication is included at each tier. Compounded GLP-1 medications are not FDA-approved drug products for all uses described.";

export const GLP1_PROGRAM_PRICING_BULLETS = [
  `${GLP1_PROGRAM.injectable.heading}: ${GLP1_PROGRAM.injectable.includes}`,
  `GLP-1 weight loss from $${GLP1_PROGRAM.injectable.monthlyFromUsd}/month — price scales with weekly dose`,
  ...GLP1_SEMAGLUTIDE_DOSE_TIERS.map(
    (t) => `Semaglutide ${t.doseLabel}: $${t.priceUsd}/mo`,
  ),
  ...GLP1_TIRZEPATIDE_DOSE_TIERS.map(
    (t) => `Tirzepatide ${t.doseLabel}: $${t.priceUsd}/mo`,
  ),
  `Insurance oversight (med via your plan): $${GLP1_PROGRAM.insuranceOversight.monthlyUsd}/mo`,
  `Oral medications: $${GLP1_PROGRAM.oral.monthlyFromUsd}–$${GLP1_PROGRAM.oral.monthlyToUsd}/month ${GLP1_PROGRAM.oral.note}`,
] as const;
