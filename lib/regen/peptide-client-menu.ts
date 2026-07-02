/**
 * RE GEN client-facing peptide menu — sourced from BoomRx tailored pricing (6/22)
 * and Hello Gorgeous internal planner (2.5× retail). Educational; NP review required.
 */

import { REGEN_MARKUP } from "@/lib/regen/pricing-sync";

export type PeptideMenuItem = {
  id: string;
  name: string;
  detail: string;
  /** BoomRx supplier cost (internal — used to derive retail only). */
  boomRxCost: number;
};

export type PeptideMenuSection = {
  id: string;
  title: string;
  hook: string;
  items: PeptideMenuItem[];
};

export const REGEN_PEPTIDE_PRICE_TIERS = [
  { price: "$150", label: "NAD+ wellness", sub: "100 mg/mL · 10 mL vial" },
  { price: "$175", label: "Single peptides", sub: "5 mL injectables" },
  { price: "$200", label: "Specialty blends", sub: "Multi-peptide stacks" },
] as const;

/** Client retail at 2.5× BoomRx cost (matches storefront formula). */
export function peptideRetailFromBoomRx(boomRxCost: number): number {
  return Math.round(boomRxCost * REGEN_MARKUP * 100) / 100;
}

export function formatPeptideRetail(boomRxCost: number): string {
  const n = peptideRetailFromBoomRx(boomRxCost);
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
}

/**
 * BoomRx peptide & wellness injectables — client menu sections
 * (aligned with hello_gorgeous_internal_peptide_pricing_planner.pdf)
 */
export const REGEN_PEPTIDE_MENU_SECTIONS: PeptideMenuSection[] = [
  {
    id: "recovery",
    title: "Recovery + Tissue Support",
    hook: "Gut, mobility & tissue-repair discussions",
    items: [
      { id: "bpc-157", name: "BPC-157", detail: "3 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "tb-500", name: "TB-500", detail: "3 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "bpc-tb-500", name: "BPC-157 / TB-500", detail: "3 mg / 3 mg/mL · 5 mL vial", boomRxCost: 80 },
      {
        id: "bpc-ghk-kpv-tb",
        name: "BPC-157 / GHK-Cu / KPV / TB-500",
        detail: "3 mg / 10 mg / 3 mg / 3 mg/mL · 5 mL vial",
        boomRxCost: 80,
      },
      { id: "bpc-kpv-tb", name: "BPC-157 / KPV / TB-500", detail: "3 mg / 3 mg/mL · 5 mL vial", boomRxCost: 80 },
      { id: "bpc-tb-ghk", name: "BPC-157 / TB-500 / GHK-Cu", detail: "3 mg / 3 mg / 10 mg/mL · 5 mL vial", boomRxCost: 80 },
    ],
  },
  {
    id: "skin-glow",
    title: "Skin, Hair + Glow",
    hook: "Radiance, collagen & antioxidant support",
    items: [
      { id: "ghk-cu-inj", name: "GHK-Cu", detail: "10 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "nad-100", name: "NAD+", detail: "100 mg/mL · 10 mL vial", boomRxCost: 60 },
    ],
  },
  {
    id: "performance",
    title: "Energy, Performance + Healthy Aging",
    hook: "GH-axis, mitochondrial & immune education",
    items: [
      { id: "cjc-ipa", name: "CJC-1295 / Ipamorelin", detail: "1.2 mg / 2 mg · 5 mL vial", boomRxCost: 80 },
      { id: "tesa-ipa", name: "Tesamorelin / Ipamorelin", detail: "3 mg / 2 mg/mL · 5 mL vial", boomRxCost: 80 },
      { id: "mots-tesa-blend", name: "MOTS-c / Tesamorelin", detail: "4 mg / 3 mg/mL · 5 mL vial", boomRxCost: 80 },
      { id: "tesamorelin", name: "Tesamorelin", detail: "3 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "mots-c", name: "MOTS-c", detail: "20 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "ss-31", name: "SS-31 (Elamipretide)", detail: "4 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "thymosin-a1", name: "Thymosin A-1", detail: "5 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "igf-lr3", name: "IGF-LR3", detail: "200 mcg/mL · 5 mL vial", boomRxCost: 70 },
    ],
  },
  {
    id: "body-comp",
    title: "Weight Loss + Body Composition",
    hook: "Metabolic & body-composition support",
    items: [
      { id: "aod-9604", name: "AOD-9604", detail: "2 mg/mL · 5 mL vial", boomRxCost: 70 },
      { id: "pt-141", name: "PT-141", detail: "2 mg/mL · 5 mL vial", boomRxCost: 70 },
    ],
  },
];

/** Flat list for checkout / API validation lookups. */
export const REGEN_BOOMRX_PEPTIDE_ITEMS = REGEN_PEPTIDE_MENU_SECTIONS.flatMap((s) =>
  s.items.map((item) => ({
    ...item,
    section: s.id,
    retail30: peptideRetailFromBoomRx(item.boomRxCost),
  })),
);
