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
    description: "3× Morpheus8 treatments + 1× Solaria CO2 Full Face.",
    bullets: ["3 Morpheus8 sessions", "1 Solaria CO2 full face", "Package price $2,400"],
  },
  {
    id: "pkg-ultimate",
    name: "Ultimate Package",
    category: "Packages",
    price: 3000,
    unit: "per package",
    description: "3× Morpheus8 treatments on 2 body parts (series for two areas).",
    bullets: ["3 Morpheus8 × body area 1", "3 Morpheus8 × body area 2", "Package price $3,000"],
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
