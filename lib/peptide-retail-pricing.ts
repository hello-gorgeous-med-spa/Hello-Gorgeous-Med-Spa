/**
 * Hello Gorgeous RX™ — client-facing retail pricing (approved aggressive + 15%).
 * Internal COGS / pharmacy routing is not stored here.
 */

export const PEPTIDE_PRICING_DISCLAIMER =
  "Educational overview only. “From” pricing reflects common protocol supplies after NP-led evaluation; your individual plan may differ. Labs, cold-chain shipping, supplies, and add-on stacks may be quoted separately.";

export const PEPTIDE_PREPAY_MONTHS = 3;
export const PEPTIDE_PREPAY_DISCOUNT_PERCENT = 10;

/** Typical cold-chain / pharmacy shipping line (aggressive + 15%). */
export const PEPTIDE_PHARMACY_SHIPPING_USD = 35;

import { GLP1_RETAIL_PROGRAM } from "@/lib/glp1-program-pricing";

export { GLP1_RETAIL_PROGRAM };

/** Lowest published monthly protocol (sermorelin injectable). */
export const PEPTIDE_RETAIL_FROM_MONTHLY_USD = 149;

export type PeptideRetailCategory =
  | "Recovery & Healing"
  | "Hormone & GH Support"
  | "Energy & Longevity"
  | "Skin & Aesthetics"
  | "Intimacy & Vitality"
  | "Blends & Support"
  | "Medical Weight Loss";

export type PeptideRetailRow = {
  /** Matches peptide-request-menu id or glp1-* keys */
  id: string;
  name: string;
  category: PeptideRetailCategory;
  fromMonthlyUsd: number;
  note?: string;
};

/** Approved retail menu — aggressive base × 1.15, rounded to clean dollars. */
export const PEPTIDE_RETAIL_MENU: PeptideRetailRow[] = [
  {
    id: "sermorelin",
    name: "Sermorelin (injectable)",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 149,
    note: "Sleep, recovery & natural GH support",
  },
  {
    id: "sermorelin-troche",
    name: "Sermorelin (sublingual troche)",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 160,
    note: "No needles · daily troche",
  },
  {
    id: "bpc-157",
    name: "BPC-157 (injectable)",
    category: "Recovery & Healing",
    fromMonthlyUsd: 169,
    note: "Recovery, gut & tissue support",
  },
  {
    id: "bpc-157-caps",
    name: "BPC-157 (oral capsules)",
    category: "Recovery & Healing",
    fromMonthlyUsd: 115,
    note: "Needle-free recovery support",
  },
  {
    id: "tb-500",
    name: "TB-500",
    category: "Recovery & Healing",
    fromMonthlyUsd: 169,
    note: "Mobility & systemic repair",
  },
  {
    id: "recovery-blend",
    name: "Recovery Blend",
    category: "Blends & Support",
    fromMonthlyUsd: 229,
    note: "BPC-157, GHK-Cu, KPV & TB-500",
  },
  {
    id: "heal-blend",
    name: "HEAL Blend",
    category: "Blends & Support",
    fromMonthlyUsd: 229,
    note: "Multi-peptide restorative support",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    category: "Skin & Aesthetics",
    fromMonthlyUsd: 169,
    note: "Skin, hair & collagen",
  },
  {
    id: "pt-141",
    name: "PT-141",
    category: "Intimacy & Vitality",
    fromMonthlyUsd: 209,
    note: "Libido & arousal (men & women)",
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 229,
    note: "Body composition & GH axis",
  },
  {
    id: "nad-plus",
    name: "NAD+ (injectable protocol)",
    category: "Energy & Longevity",
    fromMonthlyUsd: 169,
    note: "Cellular energy & clarity",
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 249,
    note: "GH-axis support",
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 249,
    note: "Selective GH release",
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin (blend)",
    category: "Hormone & GH Support",
    fromMonthlyUsd: 249,
    note: "GH stack · recovery & composition",
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide program",
    category: "Medical Weight Loss",
    fromMonthlyUsd: GLP1_RETAIL_PROGRAM.tirzepatideFromUsd,
    note: "Provider oversight · titration · Rx",
  },
  {
    id: "glp1-semaglutide",
    name: "Semaglutide program",
    category: "Medical Weight Loss",
    fromMonthlyUsd: GLP1_RETAIL_PROGRAM.semaglutideFromUsd,
    note: "Provider oversight · titration · Rx",
  },
];

/** Hub / featured card slug → request-menu id */
const HUB_SLUG_TO_RETAIL_ID: Record<string, string> = {
  "ghk-cu-injectable": "ghk-cu",
};

const RETAIL_BY_ID = new Map(PEPTIDE_RETAIL_MENU.map((r) => [r.id, r]));

export function formatFromMonthly(usd: number): string {
  return `From $${usd}/mo`;
}

export function getPeptideRetailRow(id: string): PeptideRetailRow | undefined {
  return RETAIL_BY_ID.get(id);
}

export function getPeptideRetailMonthlyUsd(id: string): number | undefined {
  return RETAIL_BY_ID.get(id)?.fromMonthlyUsd;
}

export function getPeptideRetailByHubSlug(hubSlug: string): PeptideRetailRow | undefined {
  const id = HUB_SLUG_TO_RETAIL_ID[hubSlug] ?? hubSlug;
  return RETAIL_BY_ID.get(id);
}

export function getPeptideRetailPriceCents(id: string): number {
  const usd = RETAIL_BY_ID.get(id)?.fromMonthlyUsd;
  return usd != null ? usd * 100 : 0;
}

export function peptideRetailMenuByCategory(): Array<{
  category: PeptideRetailCategory;
  rows: PeptideRetailRow[];
}> {
  const order: PeptideRetailCategory[] = [
    "Recovery & Healing",
    "Hormone & GH Support",
    "Blends & Support",
    "Skin & Aesthetics",
    "Intimacy & Vitality",
    "Energy & Longevity",
    "Medical Weight Loss",
  ];
  return order
    .map((category) => ({
      category,
      rows: PEPTIDE_RETAIL_MENU.filter((r) => r.category === category),
    }))
    .filter((g) => g.rows.length > 0);
}

export function peptidePrepayTotal(monthlyUsd: number): number {
  const gross = monthlyUsd * PEPTIDE_PREPAY_MONTHS;
  return Math.round(gross * (1 - PEPTIDE_PREPAY_DISCOUNT_PERCENT / 100));
}

export function peptidePrepaySavings(monthlyUsd: number): number {
  return monthlyUsd * PEPTIDE_PREPAY_MONTHS - peptidePrepayTotal(monthlyUsd);
}

export function formatPrepayLine(monthlyUsd: number): string {
  const total = peptidePrepayTotal(monthlyUsd);
  const save = peptidePrepaySavings(monthlyUsd);
  return `${PEPTIDE_PREPAY_MONTHS}-mo protocol: $${total} (save $${save})`;
}

export const PEPTIDE_RETAIL_PRICING_SUMMARY =
  `Protocols from $${PEPTIDE_RETAIL_FROM_MONTHLY_USD}/mo after your $49 NP consult — transparent quote before you commit.`;
