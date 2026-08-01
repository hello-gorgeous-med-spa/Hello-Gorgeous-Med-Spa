import {
  GLP1_INSURANCE_OVERSIGHT,
  GLP1_SEMAGLUTIDE_DOSE_TIERS,
  GLP1_TIRZEPATIDE_DOSE_TIERS,
} from "@/lib/glp1-dose-tiers";
import { GLP1_PROGRAM, GLP1_PROGRAM_CONSULT_USD } from "@/lib/glp1-program-pricing";
import { PEPTIDE_RETAIL_MENU } from "@/lib/peptide-retail-pricing";
import {
  FORMULATION_COLD_SHIP_USD,
  FORMULATION_GHK_CU_MED_USD,
  FORMULATION_GHK_CU_TOTAL_USD,
  PROPOSAL_PACKAGES,
} from "@/lib/proposals/packages";
import {
  EXOSOME_HEALING_ADDON,
  vitaminRetailSeedServices,
  vitaminTreatmentPlanSeedServices,
} from "@/lib/proposals/vitamin-injections";

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
    id: "peptide-consult",
    name: "Peptide Therapy Consult",
    category: "Peptides",
    price: 49,
    unit: "one-time",
    description: "NP consult to map goals, labs, and protocol — credits toward first month when you continue.",
  },
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
  {
    id: "peptide-shipping",
    name: "Peptide cold-chain shipping",
    category: "Peptides",
    price: 35,
    unit: "per shipment",
    description: "Typical pharmacy cold-chain / shipping line when meds ship to patient.",
  },
  // Full retail menu (exclude GLP-1 rows — those live under Weight Loss Programs).
  ...PEPTIDE_RETAIL_MENU.filter((row) => row.category !== "Medical Weight Loss").map((row) => ({
    id: `peptide-${row.id}`,
    name: row.name,
    category: "Peptides",
    price: row.fromMonthlyUsd,
    unit: "per month",
    description: row.note
      ? `${row.note} · From $${row.fromMonthlyUsd}/mo after NP evaluation (labs/shipping may be separate).`
      : `From $${row.fromMonthlyUsd}/mo after NP evaluation — shipping/labs may be separate.`,
  })),
];

const INMODE_SERVICES: SeedService[] = [
  {
    id: "morpheus8-face",
    name: "Morpheus8 Burst - Face",
    category: "InMode Trifecta",
    price: 800,
    unit: "per session",
    description: "Deep RF microneedling (Burst + Deep, up to 8mm) to tighten, smooth texture, and rebuild collagen.",
  },
  {
    id: "morpheus8-neck",
    name: "Morpheus8 Burst - Neck",
    category: "InMode Trifecta",
    price: 600,
    unit: "per session",
    description: "Morpheus8 Burst for neck laxity and crepey skin — multi-depth RF under NP oversight.",
  },
  {
    id: "morpheus8-body",
    name: "Morpheus8 Burst - Body",
    category: "InMode Trifecta",
    price: 1200,
    unit: "per session",
    description: "Body-area Burst + Deep RF for abdomen, arms, thighs & more.",
  },
  {
    id: "morpheus8-3pack",
    name: "Morpheus8 Burst — 3 Session Package",
    category: "InMode Trifecta",
    price: 1999,
    unit: "per package",
    description: "Series pricing for face/body RF microneedling — results build over 3–6 months.",
  },
  {
    id: "quantum-rf",
    name: "Quantum RF — custom area",
    category: "InMode Trifecta",
    price: 900,
    unit: "per session",
    description: "Subdermal fat reduction + skin tightening — custom zones quoted at consult.",
  },
  {
    id: "quantum-rf-neck-pkg",
    name: "Quantum RF Neck Package (+ free M8)",
    category: "InMode Trifecta",
    price: 2499,
    unit: "per package",
    description: "Neck Quantum RF with complimentary Morpheus8 Burst.",
  },
  {
    id: "quantum-rf-abdomen-pkg",
    name: "Quantum RF Abdomen Package (+ free M8)",
    category: "InMode Trifecta",
    price: 3999,
    unit: "per package",
    description: "Abdomen Quantum RF with complimentary Morpheus8 Burst — great post-GLP-1 skin plan.",
  },
  {
    id: "solaria-co2-full",
    name: "Solaria CO2 - Full Face",
    category: "InMode Trifecta",
    price: 899,
    unit: "per session",
    description: "Fractional ablative CO₂ resurfacing — buy one area, get a second half off when offered.",
  },
  {
    id: "solaria-co2-partial",
    name: "Solaria CO2 - Partial Face",
    category: "InMode Trifecta",
    price: 899,
    unit: "per session",
    description: "Targeted Solaria CO₂ fractional resurfacing for a mapped facial zone.",
  },
];

const INJECTABLE_SERVICES: SeedService[] = [
  { id: "botox", name: "Botox", category: "Injectables", price: 10, unit: "per unit", description: "First-time client published rate — exact units mapped at visit." },
  { id: "dysport", name: "Dysport", category: "Injectables", price: 14, unit: "per unit", description: "Often 2–3× Botox unit count — great for larger areas." },
  { id: "jeuveau", name: "Jeuveau", category: "Injectables", price: 11, unit: "per unit", description: "Modern neurotoxin — precise and popular for first-timers." },
  { id: "xeomin", name: "Xeomin", category: "Injectables", price: 12, unit: "per unit", description: "Pure toxin option — final quote at consult." },
  { id: "daxxify", name: "Daxxify (long-lasting)", category: "Injectables", price: 15, unit: "per unit", description: "Longest-lasting neurotoxin option — priced at consult; estimate for planning." },
  { id: "lip-flip", name: "Lip Flip (neurotoxin)", category: "Injectables", price: 99, unit: "per treatment", description: "Subtle upper-lip eversion with micro-dose toxin." },
  { id: "filler-half-syringe", name: "Dermal Filler — half syringe", category: "Injectables", price: 300, unit: "per half syringe" },
  { id: "dermal-filler", name: "Dermal Filler — 1 syringe", category: "Injectables", price: 599, unit: "per syringe" },
  { id: "filler-2-syringe", name: "Dermal Filler — 2 syringes", category: "Injectables", price: 1098, unit: "per package", description: "Save $100 vs two singles." },
  { id: "lip-filler", name: "Lip Filler — 1 syringe", category: "Injectables", price: 599, unit: "per syringe" },
  { id: "hyaluronidase", name: "Hyaluronidase (dissolver)", category: "Injectables", price: 250, unit: "per treatment", description: "When medically appropriate to dissolve HA filler." },
  { id: "sculptra", name: "Sculptra (biostimulator)", category: "Injectables", price: 850, unit: "per vial", description: "Collagen biostimulator — vials confirmed at consult." },
  { id: "kybella", name: "Kybella (submental fat)", category: "Injectables", price: 600, unit: "per treatment", description: "Double-chin contouring — series often recommended." },
];

const SKIN_SERVICES: SeedService[] = [
  { id: "hydrafacial-glow-special", name: "HydraFacial Glow Special (Hydra + dermaplaning)", category: "Skin & Face", price: 129, unit: "per session", description: "HydraFacial + dermaplaning + O2 + 2 premium add-ons." },
  { id: "hydrafacial", name: "Standard HydraFacial", category: "Skin & Face", price: 199, unit: "per session" },
  { id: "glass-glow-facial", name: "Glass Glow Facial", category: "Skin & Face", price: 349, unit: "per session", description: "HydraFacial + dermaplaning + BabyTox." },
  { id: "microneedling-ha", name: "Microneedling + HA", category: "Skin & Face", price: 249, unit: "per session" },
  { id: "microneedling-growth-factors", name: "Microneedling + Stem Cell Growth Factors", category: "Skin & Face", price: 399, unit: "per session" },
  { id: "baby-tox-luxe", name: "Baby Tox Luxe + AnteAGE BioSomes", category: "Skin & Face", price: 499, unit: "per session" },
  { id: "microneedling-exosomes", name: "Microneedling + AnteAGE Exosomes", category: "Skin & Face", price: 499, unit: "per session" },
  { id: "microneedling-3pack", name: "Microneedling Series (3 sessions)", category: "Skin & Face", price: 750, unit: "per package" },
  { id: "ipl-photofacial", name: "IPL Photofacial", category: "Skin & Face", price: 300, unit: "per session" },
];

const REGENERATIVE_SERVICES: SeedService[] = [
  { id: "prp-facial", name: "PRP Facial — Full (Vampire Facial)", category: "Regenerative", price: 400, unit: "per session" },
  { id: "prp-express", name: "PRP Express Facial", category: "Regenerative", price: 299, unit: "per session" },
  { id: "microneedling-prp-combo", name: "Microneedling + PRP", category: "Regenerative", price: 500, unit: "per session" },
  { id: "ez-prf-gel", name: "EZ PRF Gel", category: "Regenerative", price: 500, unit: "per session" },
  { id: "prf-under-eye", name: "PRF Under-Eye", category: "Regenerative", price: 500, unit: "per session" },
  { id: "prf-hair-restoration", name: "PRF Hair Restoration", category: "Regenerative", price: 600, unit: "per session" },
];

const LASER_SERVICES: SeedService[] = [
  { id: "laser-hair-listed-area", name: "Laser Hair Removal — listed area", category: "Laser", price: 59, unit: "per session", description: "Seasonal special pricing on listed areas when offered." },
  { id: "laser-brazilian-3mo", name: "Laser Brazilian — 3-Month Package", category: "Laser", price: 499, unit: "per package" },
];

const WELLNESS_SERVICES: SeedService[] = [
  { id: "hormone-therapy", name: "Hormone Therapy (BHRT/TRT) — from", category: "Body & Wellness", price: 250, unit: "per month", description: "Ongoing hormone support — pellets/injections quoted after labs." },
  { id: "biote-women-pellet", name: "BioTE Women's Pellet Insertion — from", category: "Body & Wellness", price: 400, unit: "per insertion" },
  { id: "biote-men-pellet", name: "BioTE Men's Pellet Insertion — from", category: "Body & Wellness", price: 750, unit: "per insertion" },
  { id: "trt-injections", name: "TRT Weekly Injections — from", category: "Body & Wellness", price: 200, unit: "per month" },
  { id: "flowwave-intro", name: "FlowWave FOCUS — intro session", category: "Body & Wellness", price: 49, unit: "per session", description: "Shockwave intro for performance / recovery goals." },
  { id: "flowwave-6pack", name: "FlowWave 6-Session Package", category: "Body & Wellness", price: 870, unit: "per package" },
  { id: "iv-new-client-intro", name: "New Client IV Intro", category: "Body & Wellness", price: 99, unit: "per session" },
  { id: "iv-dehydration", name: "Dehydration IV Drip", category: "Body & Wellness", price: 150, unit: "per session" },
  { id: "iv-recovery", name: "Recovery IV Drip", category: "Body & Wellness", price: 175, unit: "per session" },
  { id: "iv-beauty", name: "Beauty / Inner Beauty IV", category: "Body & Wellness", price: 175, unit: "per session" },
  { id: "iv-nad", name: "NAD+ IV", category: "Body & Wellness", price: 350, unit: "per session" },
];

const VITAMIN_INJECTION_SERVICES: SeedService[] = [
  ...vitaminTreatmentPlanSeedServices(),
  ...vitaminRetailSeedServices(),
];

const ADVANCED_HEALING_SERVICES: SeedService[] = [EXOSOME_HEALING_ADDON];

/** Retail add-ons — skincare kit paused (not offered on proposals for now). */
const RETAIL_SERVICES: SeedService[] = [];

export const HELLO_GORGEOUS_SERVICES: SeedService[] = [
  ...PROPOSAL_PACKAGES.map(({ bullets: _bullets, ...pkg }) => pkg),
  ...INMODE_SERVICES,
  ...INJECTABLE_SERVICES,
  ...WEIGHT_LOSS_SERVICES,
  ...PEPTIDE_SERVICES,
  ...VITAMIN_INJECTION_SERVICES,
  ...ADVANCED_HEALING_SERVICES,
  ...WELLNESS_SERVICES,
  ...REGENERATIVE_SERVICES,
  ...SKIN_SERVICES,
  ...LASER_SERVICES,
  ...RETAIL_SERVICES,
];
