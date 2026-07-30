/**
 * Vitamin Bar injections for treatment proposals.
 * Retail prices sync from lib/vitamin-bar.ts.
 * Treatment-support plans: weekly shots between procedures (~6 weeks apart)
 * with Buy 4 Get 2 Free on $25 Vitamin Bar injections.
 */

import { VITAMIN_SHOTS, type VitaminShot } from "@/lib/vitamin-bar";

type ProposalSeedLine = {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description?: string;
};

/** Standard Vitamin Bar draw price used for treatment-support plans. */
export const VITAMIN_INJECTION_UNIT_USD = 25;

/** Procedures (Morpheus8, etc.) are typically spaced ~6 weeks apart. */
export const VITAMIN_WEEKS_PER_CYCLE = 6;

/**
 * Buy 4 Get 2 Free — pay for 4 shots @ $25, receive 6 (a full 6-week draw).
 * Retail 6×$25 = $150 · promo = $100.
 */
export const VITAMIN_B4G2 = {
  paidShots: 4,
  freeShots: 2,
  packShots: 6,
  packRetailUsd: VITAMIN_WEEKS_PER_CYCLE * VITAMIN_INJECTION_UNIT_USD,
  packPromoUsd: 4 * VITAMIN_INJECTION_UNIT_USD,
} as const;

export type VitaminTreatmentPlanMonths = 1 | 2 | 3;

export type VitaminTreatmentPlan = {
  id: string;
  months: VitaminTreatmentPlanMonths;
  packs: number;
  shots: number;
  /** Promo total (B4G2 applied per 6-week pack). */
  priceUsd: number;
  /** List if paying $25 × shots with no promo. */
  retailUsd: number;
  unit: string;
  name: string;
  description: string;
};

function buildTreatmentPlan(months: VitaminTreatmentPlanMonths): VitaminTreatmentPlan {
  const packs = months;
  const shots = packs * VITAMIN_B4G2.packShots;
  const priceUsd = packs * VITAMIN_B4G2.packPromoUsd;
  const retailUsd = packs * VITAMIN_B4G2.packRetailUsd;
  const monthLabel = months === 1 ? "1-month" : `${months}-month`;
  return {
    id: `vitamin-plan-${months}mo`,
    months,
    packs,
    shots,
    priceUsd,
    retailUsd,
    unit: `per ${monthLabel} plan`,
    name: `Vitamin Injections — ${monthLabel} while treating (B4G2)`,
    description:
      `Weekly IM shots while treating · ${shots} shots (${VITAMIN_WEEKS_PER_CYCLE} weeks × ${months}) · ` +
      `Buy 4 Get 2 Free (save $${retailUsd - priceUsd} vs $${VITAMIN_INJECTION_UNIT_USD}/shot). ` +
      `Mix & match Vitamin Bar standards; premium shots may upgrade at retail difference.`,
  };
}

export const VITAMIN_TREATMENT_PLANS: VitaminTreatmentPlan[] = [
  buildTreatmentPlan(1),
  buildTreatmentPlan(2),
  buildTreatmentPlan(3),
];

/** AnteAGE exosomes as advanced healing add-on on procedures (M8, microneedling, CO₂, etc.). */
export const EXOSOME_HEALING_ADDON_USD = 250;

export const EXOSOME_HEALING_ADDON: ProposalSeedLine = {
  id: "exosomes-healing-addon",
  name: "AnteAGE Exosomes — Advanced Healing Add-on",
  category: "Advanced Healing",
  price: EXOSOME_HEALING_ADDON_USD,
  unit: "per session",
  description:
    "Stem-cell signaling vesicles layered onto your procedure for advanced healing, collagen support, and recovery. Ideal with Morpheus8, microneedling, or laser resurfacing.",
};

/** Client/staff cheat sheet — what each injection does. */
export type VitaminCheatSheetRow = {
  id: string;
  name: string;
  benefit: string;
  priceUsd: number;
  memberPriceUsd?: number;
  category: string;
  offerLine: string;
};

const CATEGORY_OFFER: Record<string, string> = {
  energy: "Great between body-contour / weight-support visits",
  beauty: "Pairs with skin procedures for glow & recovery",
  immune: "Support while healing or during busy seasons",
  recovery: "Post-procedure stamina & bounce-back",
  longevity: "Cellular energy — consult first for NAD+",
  rx: "Provider-directed only",
};

export function vitaminCheatSheetRows(
  shots: VitaminShot[] = VITAMIN_SHOTS.filter((s) => s.category !== "rx")
): VitaminCheatSheetRow[] {
  return shots.map((shot) => ({
    id: shot.id,
    name: shot.name,
    benefit: shot.benefit,
    priceUsd: shot.price,
    memberPriceUsd: shot.memberPrice,
    category: shot.category,
    offerLine: CATEGORY_OFFER[shot.category] || "Ask your provider which fit your goals",
  }));
}

export const VITAMIN_B4G2_OFFER_BLURB =
  `Buy 4 Get 2 Free on Vitamin Bar injections while treating — procedures are ~${VITAMIN_WEEKS_PER_CYCLE} weeks apart, so we draw up ${VITAMIN_WEEKS_PER_CYCLE} weekly shots at $${VITAMIN_INJECTION_UNIT_USD} each. Pay for 4 ($${VITAMIN_B4G2.packPromoUsd}), get ${VITAMIN_B4G2.packShots} (save $${VITAMIN_B4G2.packRetailUsd - VITAMIN_B4G2.packPromoUsd} per cycle). Choose a 1-, 2-, or 3-month plan.`;

/** À la carte retail shots for the proposal catalog (exclude Rx-only). */
export function vitaminRetailSeedServices(): ProposalSeedLine[] {
  return VITAMIN_SHOTS.filter((shot) => shot.category !== "rx").map((shot) => ({
    id: `vitamin-${shot.id}`,
    name: shot.name,
    category: "Vitamin Injections",
    price: shot.price,
    unit: "per shot",
    description: shot.benefit,
  }));
}

export function vitaminTreatmentPlanSeedServices(): ProposalSeedLine[] {
  return VITAMIN_TREATMENT_PLANS.map((plan) => ({
    id: plan.id,
    name: plan.name,
    category: "Vitamin Injections",
    price: plan.priceUsd,
    unit: plan.unit,
    description: plan.description,
  }));
}

export function isVitaminProposalServiceId(id: string): boolean {
  return id.startsWith("vitamin-") || id === "vitamin-bar-shot";
}

export function isExosomeHealingAddonId(id: string): boolean {
  return id === EXOSOME_HEALING_ADDON.id;
}

/** Procedure IDs that benefit from exosome advanced-healing add-on. */
export const EXOSOME_ADDON_PROCEDURE_PREFIXES = [
  "morpheus8",
  "microneedling",
  "solaria",
  "quantum-rf",
  "prp",
  "prf",
  "pkg-",
] as const;

export function serviceSuggestsExosomeAddon(serviceId: string): boolean {
  return EXOSOME_ADDON_PROCEDURE_PREFIXES.some((prefix) => serviceId.startsWith(prefix));
}
