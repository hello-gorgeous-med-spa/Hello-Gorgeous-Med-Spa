/**
 * Client-facing RE GEN prices for landing-page products.
 *
 * Sheet column = Formulation CSV `patient_price` (their published cost).
 * Retail = sheet × 2.5, plus $30 pharmacy shipping at checkout.
 * Do not import the full CSV into the client bundle — keep this list curated.
 *
 * Public pages brand RE GEN / Hello Gorgeous. The compounding pharmacy stays
 * the fulfillment underdog (staff/ops only).
 */

import { REGEN_MARKUP, REGEN_SHIPPING_USD } from "@/lib/regen/pricing-sync";

export const FORMULATION_SHEET_SHIPPING_USD = REGEN_SHIPPING_USD;

export type FormulationHub = "peptides" | "sexual-health" | "dermatology";

export type FormulationShopItem = {
  id: string;
  name: string;
  sku: string;
  /** Formulation sheet `patient_price`. */
  sheetUsd: number;
  pack: string;
  hub: FormulationHub;
  goal: string;
  /** True for chair-side compounds (BLT) — still requestable, not a home vial. */
  inOffice?: boolean;
};

function retailFromSheet(sheetUsd: number): number {
  return Math.round(sheetUsd * REGEN_MARKUP * 100) / 100;
}

function money(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

const SHOP = {
  sermorelin: {
    id: "sermorelin",
    name: "Sermorelin",
    sku: "2884",
    sheetUsd: 38,
    pack: "6 mL vial · 1 mg/mL",
    hub: "peptides",
    goal: "energy",
  },
  tesamorelin: {
    id: "tesamorelin",
    name: "Tesamorelin",
    sku: "2896",
    sheetUsd: 150,
    pack: "3 mL vial · 5 mg/mL",
    hub: "peptides",
    goal: "energy",
  },
  "pt-141": {
    id: "pt-141",
    name: "PT-141 (Bremelanotide)",
    sku: "3502",
    sheetUsd: 95,
    pack: "10 mL · 2 mg/mL",
    hub: "peptides",
    goal: "sexual-health",
  },
  oxytocin: {
    id: "oxytocin",
    name: "Oxytocin",
    sku: "3078",
    sheetUsd: 39,
    pack: "30 troches",
    hub: "peptides",
    goal: "sexual-health",
  },
  glutathione: {
    id: "glutathione",
    name: "Glutathione",
    sku: "4032",
    sheetUsd: 27,
    pack: "5 mL · 200 mg/mL",
    hub: "peptides",
    goal: "energy",
  },
  "ghk-cu": {
    id: "ghk-cu",
    name: "GHK-Cu topical",
    sku: "3763",
    sheetUsd: 45,
    pack: "30 mL · 0.25%",
    hub: "peptides",
    goal: "skincare",
  },
  ed: {
    id: "ed",
    name: "Men's Performance",
    sku: "3855",
    sheetUsd: 38,
    pack: "15 capsules · sildenafil 25 mg / tadalafil 5 mg",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  "sildenafil-apo": {
    id: "sildenafil-apo",
    name: "Sildenafil / apomorphine",
    sku: "2957",
    sheetUsd: 54,
    pack: "15 troches · 25 mg / 3 mg",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  ici: {
    id: "ici",
    name: "Injectable (ICI)",
    sku: "3978",
    sheetUsd: 58,
    pack: "2.5 mL sterile vial · starting strength",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  "scream-cream": {
    id: "scream-cream",
    name: "Arousal cream",
    sku: "2903",
    sheetUsd: 90,
    pack: "30 g · sildenafil / arginine / papaverine",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  estriol: {
    id: "estriol",
    name: "Estriol vaginal gel",
    sku: "2631",
    sheetUsd: 80,
    pack: "30 g · 0.5 mg/mL",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  "libido-women": {
    id: "libido-women",
    name: "Women's Desire",
    sku: "3078",
    sheetUsd: 39,
    pack: "starting with oxytocin troches (30ct)",
    hub: "sexual-health",
    goal: "sexual-health",
  },
  cleartone: {
    id: "cleartone",
    name: "Brightening cream",
    sku: "3719",
    sheetUsd: 88,
    pack: "30 g pump · HQ / tretinoin / azelaic blend",
    hub: "dermatology",
    goal: "skincare",
  },
  hydroquinone: {
    id: "hydroquinone",
    name: "Hydroquinone Brightening",
    sku: "3720",
    sheetUsd: 72,
    pack: "30 g pump · 13%",
    hub: "dermatology",
    goal: "skincare",
  },
  clarity: {
    id: "clarity",
    name: "Clarity Acne Cream",
    sku: "3722",
    sheetUsd: 60,
    pack: "30 g pump · azelaic / tretinoin / niacinamide",
    hub: "dermatology",
    goal: "skincare",
  },
  "fin-minox-solution": {
    id: "fin-minox-solution",
    name: "Minoxidil / finasteride solution",
    sku: "3102",
    sheetUsd: 60,
    pack: "30 mL · 7% / 0.25% / 2% arginine",
    hub: "dermatology",
    goal: "hair",
  },
  blt: {
    id: "blt",
    name: "BLT numbing cream",
    sku: "2510",
    sheetUsd: 150,
    pack: "100 g · 20 / 6 / 4 — in-office",
    hub: "dermatology",
    goal: "skincare",
    inOffice: true,
  },
} as const satisfies Record<string, FormulationShopItem>;

export type FormulationShopId = keyof typeof SHOP;

const ALIASES: Record<string, FormulationShopId> = {
  sermorelin: "sermorelin",
  tesamorelin: "tesamorelin",
  "pt-141": "pt-141",
  pt141: "pt-141",
  bremelanotide: "pt-141",
  oxytocin: "oxytocin",
  glutathione: "glutathione",
  "ghk-cu": "ghk-cu",
  ghkcu: "ghk-cu",
  ghk: "ghk-cu",
  ed: "ed",
  sildenafil: "ed",
  tadalafil: "ed",
  "sildenafil-apo": "sildenafil-apo",
  apomorphine: "sildenafil-apo",
  ici: "ici",
  trimix: "ici",
  bimix: "ici",
  quadmix: "ici",
  "scream-cream": "scream-cream",
  screamcream: "scream-cream",
  scream: "scream-cream",
  estriol: "estriol",
  "libido-women": "libido-women",
  cleartone: "cleartone",
  brightening: "cleartone",
  hydroquinone: "hydroquinone",
  clarity: "clarity",
  acne: "clarity",
  "fin-minox-solution": "fin-minox-solution",
  minoxidil: "fin-minox-solution",
  blt: "blt",
};

export function formulationShop(id: FormulationShopId): FormulationShopItem {
  return SHOP[id];
}

export function formulationShopRetail(id: FormulationShopId): number {
  return retailFromSheet(SHOP[id].sheetUsd);
}

export function isFormulationSheetProgram(programId?: string | null): boolean {
  if (!programId) return false;
  return programId in SHOP;
}

export function formulationSheetShippingUsd(): number {
  return FORMULATION_SHEET_SHIPPING_USD;
}

export function formulationStartHref(id: FormulationShopId): string {
  const item = SHOP[id];
  return `/start?goal=${item.goal}&program=${item.id}`;
}

export function formulationFromLabel(id: FormulationShopId): string {
  return `from ${money(formulationShopRetail(id))}`;
}

export function formulationShippingLabel(): string {
  return `+ ${money(FORMULATION_SHEET_SHIPPING_USD)} shipping`;
}

/** Map ?program= or ?peptide= onto a shop / start program id. Unknown values pass through. */
export function resolveFormulationProgramParam(raw?: string | null): string {
  const key = (raw || "").trim().toLowerCase();
  if (!key) return "";
  return ALIASES[key] || key;
}

export function formulationShopIdsForHub(hub: FormulationHub): FormulationShopId[] {
  return (Object.keys(SHOP) as FormulationShopId[]).filter((id) => SHOP[id].hub === hub);
}
