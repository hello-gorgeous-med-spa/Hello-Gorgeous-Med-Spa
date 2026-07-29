import {
  GLP1_INSURANCE_OVERSIGHT,
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
} from "@/lib/glp1-dose-tiers";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";
import {
  FORMULATION_COLD_SHIP_USD,
  FORMULATION_GHK_CU_MED_USD,
  FORMULATION_GHK_CU_TOTAL_USD,
  PROPOSAL_PACKAGES,
} from "@/lib/proposals/packages";

export type SeedService = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
};

const WEIGHT_LOSS_SERVICES: SeedService[] = [
  {
    id: "glp1-consult",
    name: "GLP-1 Medical Weight Loss Consult",
    category: "Weight Loss Programs",
    price: GLP1_PROGRAM_CONSULT_USD,
    unit: "one-time",
    description: "NP evaluation — consult fee credits toward first month of injectable if you continue.",
  },
  ...GLP1_SEMAGLUTIDE_DOSE_TIERS.map((tier) => ({
    id: `glp1-${tier.id}`,
    name: `Semaglutide ${tier.doseLabel}`,
    category: "Weight Loss Programs",
    price: tier.priceUsd,
    unit: "per month",
    description: "Compounded injectable — medication included at this dose tier.",
  })),
  ...GLP1_TIRZEPATIDE_DOSE_TIERS.map((tier) => ({
    id: `glp1-${tier.id}`,
    name: `Tirzepatide ${tier.doseLabel}`,
    category: "Weight Loss Programs",
    price: tier.priceUsd,
    unit: "per month",
    description: "Compounded injectable — medication included at this dose tier.",
  })),
  {
    id: "glp1-3month-from",
    name: "GLP-1 3-Month Supply (from)",
    category: "Weight Loss Programs",
    price: GLP1_PROGRAM.injectable.threeMonthFromUsd,
    unit: "per 3 months",
    description: "Multi-month supply option — exact dose confirmed after NP evaluation.",
  },
  {
    id: "glp1-3month-high",
    name: "GLP-1 3-Month High-Dose Supply (from)",
    category: "Weight Loss Programs",
    price: GLP1_PROGRAM.injectable.threeMonthHighDoseFromUsd,
    unit: "per 3 months",
    description: "Higher-dose multi-month option — quoted after evaluation.",
  },
  {
    id: "glp1-insurance-oversight",
    name: "Insurance Oversight (med via your plan)",
    category: "Weight Loss Programs",
    price: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
    unit: "per month",
    description: GLP1_INSURANCE_OVERSIGHT.note,
  },
  {
    id: "glp1-oral-from",
    name: "Oral GLP-1 (sublingual) — from",
    category: "Weight Loss Programs",
    price: GLP1_PROGRAM.oral.monthlyFromUsd,
    unit: "per month",
    description: GLP1_PROGRAM.oral.note,
  },
];

const PEPTIDE_SERVICES: SeedService[] = [
  {
    id: "ghk-cu-formulation-30",
    name: "GHK-Cu 30-Day Supply (Formulation)",
    category: "Peptides",
    price: FORMULATION_GHK_CU_TOTAL_USD,
    unit: "per 30 days",
    description: `Formulation Rx — $${FORMULATION_GHK_CU_MED_USD} medication + $${FORMULATION_COLD_SHIP_USD} cold ship.`,
  },
  {
    id: "ghk-cu-formulation-90",
    name: "GHK-Cu 90-Day Supply (Formulation)",
    category: "Peptides",
    price: FORMULATION_GHK_CU_TOTAL_USD,
    unit: "per 90 days",
    description: `Formulation Rx — $${FORMULATION_GHK_CU_MED_USD} medication + $${FORMULATION_COLD_SHIP_USD} cold ship.`,
  },
];

export const HELLO_GORGEOUS_SERVICES: SeedService[] = [
  ...PROPOSAL_PACKAGES.map(({ bullets: _bullets, ...pkg }) => pkg),
  { id: "morpheus8-face", name: "Morpheus8 Burst - Face", category: "InMode Trifecta", price: 800, unit: "per session", description: "Deep RF microneedling (Burst + Deep, up to 8mm) to tighten, smooth texture, and rebuild collagen on the face." },
  { id: "morpheus8-neck", name: "Morpheus8 Burst - Neck", category: "InMode Trifecta", price: 600, unit: "per session", description: "Morpheus8 Burst for neck laxity and crepey skin — multi-depth RF remodeling under NP oversight." },
  { id: "morpheus8-body", name: "Morpheus8 Burst - Body", category: "InMode Trifecta", price: 1200, unit: "per session", description: "Body-area Burst + Deep RF for abdomen, arms, thighs & more — tightening and collagen rebuild." },
  { id: "quantum-rf", name: "Quantum RF Lipo", category: "InMode Trifecta", price: 900, unit: "per session", description: "Body contouring and skin tightening." },
  { id: "solaria-co2-full", name: "Solaria CO2 - Full Face", category: "InMode Trifecta", price: 1200, unit: "per session", description: "Fractional ablative CO₂ resurfacing for fine lines, sun damage, acne scars, and texture." },
  { id: "solaria-co2-partial", name: "Solaria CO2 - Partial Face", category: "InMode Trifecta", price: 800, unit: "per session", description: "Targeted Solaria CO₂ fractional resurfacing for a mapped facial zone." },
  { id: "botox", name: "Botox", category: "Injectables", price: 12, unit: "per unit" },
  { id: "dysport", name: "Dysport", category: "Injectables", price: 10, unit: "per unit" },
  { id: "dermal-filler", name: "Dermal Filler", category: "Injectables", price: 650, unit: "per syringe" },
  { id: "lip-filler", name: "Lip Filler", category: "Injectables", price: 650, unit: "per syringe" },
  ...WEIGHT_LOSS_SERVICES,
  ...PEPTIDE_SERVICES,
  { id: "hormone-therapy", name: "Hormone Therapy (BHRT/TRT)", category: "Body & Wellness", price: 250, unit: "per month" },
  { id: "prp-facial", name: "PRP / PRF Facial", category: "Regenerative", price: 400, unit: "per session" },
  { id: "ez-prf-gel", name: "EZ PRF Gel", category: "Regenerative", price: 500, unit: "per session" },
  { id: "hydrafacial", name: "HydraFacial", category: "Skin & Face", price: 200, unit: "per session" },
  { id: "ipl-photofacial", name: "IPL Photofacial", category: "Skin & Face", price: 300, unit: "per session" },
];
