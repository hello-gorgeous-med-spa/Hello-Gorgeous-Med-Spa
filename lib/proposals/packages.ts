/**
 * Named consult packages for the treatment proposal builder.
 * Fixed package price is what the client sees; includes describe the clinical series.
 */

import type { SeedService } from "@/lib/proposals/seed-services";

export type ProposalPackage = SeedService & {
  /** Short bullets for the builder UI */
  bullets: string[];
};

/** Formulation Rx GHK-Cu — proposal special (med + cold ship). */
export const FORMULATION_GHK_CU_MED_USD = 150;
export const FORMULATION_COLD_SHIP_USD = 30;
export const FORMULATION_GHK_CU_TOTAL_USD = FORMULATION_GHK_CU_MED_USD + FORMULATION_COLD_SHIP_USD;

export const PROPOSAL_PACKAGES: ProposalPackage[] = [
  {
    id: "pkg-transformation",
    name: "Transformation Package",
    category: "Packages",
    price: 2400,
    unit: "per package",
    description:
      "3× Morpheus8 Burst (deep RF microneedling up to 8mm for tightening & collagen) + 1× Solaria CO₂ full-face resurfacing.",
    bullets: [
      "3 Morpheus8 Burst sessions — multi-depth RF for laxity, scars & texture",
      "1 Solaria CO₂ full face — fractional laser for tone & surface renewal",
      "InMode verified · NP-directed · package $2,400",
    ],
  },
  {
    id: "pkg-ultimate",
    name: "Ultimate Package",
    category: "Packages",
    price: 3000,
    unit: "per package",
    description:
      "3× Morpheus8 Burst on 2 body areas — Burst + Deep RF remodeling for tightening and contour under NP oversight.",
    bullets: [
      "3 Morpheus8 × body area 1 (abdomen, arms, thighs, etc.)",
      "3 Morpheus8 × body area 2",
      "Deepest RF microneedling (to 8mm) · package $3,000",
    ],
  },
];

export function getProposalPackage(id: string): ProposalPackage | undefined {
  return PROPOSAL_PACKAGES.find((pkg) => pkg.id === id);
}

export function packageToProposalService(pkg: ProposalPackage) {
  return {
    id: pkg.id,
    name: pkg.name,
    category: pkg.category,
    price: pkg.price,
    unit: pkg.unit,
    description: pkg.description,
    quantity: 1,
  };
}
