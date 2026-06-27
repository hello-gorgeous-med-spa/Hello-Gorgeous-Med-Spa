/**
 * Hello Gorgeous GLP-1 — dose-based monthly pricing (medication included).
 * Canonical tier table for refill form, RX invoices, menus, and price list.
 */

export type Glp1MedicationType = "Semaglutide" | "Tirzepatide";

export type Glp1DoseTier = {
  id: string;
  medication: Glp1MedicationType;
  doseLabel: string;
  priceUsd: number;
  invoiceTemplateId: string;
  /** Vials to order from pharmacy per 30-day (4-week) supply at this dose */
  vialsPer30Day: number;
  /** Your wholesale cost per vial from compounding pharmacy */
  wholesaleCostPerVialUsd: number;
};

export const GLP1_SEMAGLUTIDE_DOSE_TIERS: Glp1DoseTier[] = [
  {
    id: "sema-0.25-0.5",
    medication: "Semaglutide",
    doseLabel: "0.25–0.5 mg/week",
    priceUsd: 195,
    invoiceTemplateId: "glp1-sema-0.25-0.5",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 30,
  },
  {
    id: "sema-1.0",
    medication: "Semaglutide",
    doseLabel: "1.0 mg/week",
    priceUsd: 235,
    invoiceTemplateId: "glp1-sema-1.0",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 50,
  },
  {
    id: "sema-1.7",
    medication: "Semaglutide",
    doseLabel: "1.7 mg/week",
    priceUsd: 265,
    invoiceTemplateId: "glp1-sema-1.7",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 60,
  },
  {
    id: "sema-2.4",
    medication: "Semaglutide",
    doseLabel: "2.4 mg/week",
    priceUsd: 295,
    invoiceTemplateId: "glp1-sema-2.4",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 68,
  },
];

export const GLP1_TIRZEPATIDE_DOSE_TIERS: Glp1DoseTier[] = [
  {
    id: "tirz-2.5",
    medication: "Tirzepatide",
    doseLabel: "2.5 mg/week",
    priceUsd: 235,
    invoiceTemplateId: "glp1-tirz-2.5",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 50,
  },
  {
    id: "tirz-5",
    medication: "Tirzepatide",
    doseLabel: "5 mg/week",
    priceUsd: 275,
    invoiceTemplateId: "glp1-tirz-5",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 90,
  },
  {
    id: "tirz-7.5",
    medication: "Tirzepatide",
    doseLabel: "7.5 mg/week",
    priceUsd: 315,
    invoiceTemplateId: "glp1-tirz-7.5",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 115,
  },
  {
    id: "tirz-10",
    medication: "Tirzepatide",
    doseLabel: "10 mg/week",
    priceUsd: 350,
    invoiceTemplateId: "glp1-tirz-10",
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 130,
  },
  {
    id: "tirz-12.5",
    medication: "Tirzepatide",
    doseLabel: "12.5 mg/week",
    priceUsd: 395,
    invoiceTemplateId: "glp1-tirz-12.5",
    /** Max dose — BoomRx 3mL 60mg ($150/mo) or Formulation SKU 2498/2500 */
    vialsPer30Day: 1,
    wholesaleCostPerVialUsd: 150,
  },
];

/** Highest tirzepatide dose we offer in-clinic and online (12.5 mg/week). */
export const GLP1_MAX_TIRZEPATIDE_DOSE_LABEL = "12.5 mg/week";

export const GLP1_ALL_DOSE_TIERS: Glp1DoseTier[] = [
  ...GLP1_SEMAGLUTIDE_DOSE_TIERS,
  ...GLP1_TIRZEPATIDE_DOSE_TIERS,
];

export const GLP1_INSURANCE_OVERSIGHT = {
  id: "insurance-oversight",
  label: "Insurance oversight (med via my plan)",
  monthlyUsd: 150,
  invoiceTemplateId: "glp1-insurance-oversight",
  lineLabel: "GLP-1 medical oversight — insurance pharmacy fill (1 mo)",
  note:
    "Prescription sent to your pharmacy of choice. Medical oversight, labs, DEXA, and dose management — medication billed through your insurance.",
} as const;

export const GLP1_PROGRAM_INCLUDES = [
  "Medication included at every dose tier",
  "Medical oversight & provider access",
  "Initial and ongoing lab work",
  "Monthly nutrition coaching",
  "DEXA scans for body comp tracking",
] as const;

export const GLP1_INSURANCE_INCLUDES = [
  "Prescription sent to your pharmacy of choice",
  "Medical oversight & provider access",
  "2 DEXA scans per year",
  "Comprehensive blood panels every 6 months",
  "1 vitamin shot per month",
  "Dosing guidance",
] as const;

export function glp1DoseTiersForMedication(medication: string): Glp1DoseTier[] {
  if (medication === "Semaglutide") return GLP1_SEMAGLUTIDE_DOSE_TIERS;
  if (medication === "Tirzepatide") return GLP1_TIRZEPATIDE_DOSE_TIERS;
  return [];
}

export function glp1DoseTierById(tierId: string): Glp1DoseTier | undefined {
  return GLP1_ALL_DOSE_TIERS.find((t) => t.id === tierId);
}

export function glp1LowestSemaglutideUsd(): number {
  return GLP1_SEMAGLUTIDE_DOSE_TIERS[0]?.priceUsd ?? 195;
}

export function glp1LowestTirzepatideUsd(): number {
  return GLP1_TIRZEPATIDE_DOSE_TIERS[0]?.priceUsd ?? 235;
}

export function glp1LowestInjectableUsd(): number {
  return Math.min(glp1LowestSemaglutideUsd(), glp1LowestTirzepatideUsd());
}

export function glp1HighestSemaglutideUsd(): number {
  return GLP1_SEMAGLUTIDE_DOSE_TIERS.at(-1)?.priceUsd ?? 295;
}

export function glp1HighestTirzepatideUsd(): number {
  return GLP1_TIRZEPATIDE_DOSE_TIERS.at(-1)?.priceUsd ?? 395;
}
