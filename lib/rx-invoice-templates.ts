/**
 * Hello Gorgeous RX™ — premade invoice / payment-link templates
 * for staff to send GLP-1 weight loss & peptide protocol fees quickly.
 */

import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import {
  PEPTIDE_PHARMACY_SHIPPING_USD,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_RETAIL_MENU,
  peptidePrepayTotal,
  type PeptideRetailCategory,
} from "@/lib/peptide-retail-pricing";

export type RxInvoiceTrack = "weight-loss" | "peptides" | "fees";

export type RxInvoiceTemplate = {
  id: string;
  track: RxInvoiceTrack;
  group: string;
  name: string;
  lineLabel: string;
  amountUsd: number;
  /** Square Payment Link quickPay title */
  squareName: string;
  sku?: string;
  squareSlug?: string;
  note?: string;
  /** Staff can override price (variable catalog items) */
  allowCustomAmount?: boolean;
};

function glp1Templates(): RxInvoiceTemplate[] {
  const p = GLP1_PROGRAM;
  return [
    {
      id: "glp1-consult",
      track: "weight-loss",
      group: "Consult & intake",
      name: "GLP-1 NP consult",
      lineLabel: "Medical weight loss consult (NP)",
      amountUsd: p.consultUsd,
      squareName: "Hello Gorgeous — GLP-1 Weight Loss Consult (NP)",
      sku: "HG-RX-CONSULT-49",
      squareSlug: "peptide-consult",
      note: "Credited to month 1 injectables if they start the program",
    },
    {
      id: "glp1-sema-monthly",
      track: "weight-loss",
      group: "Injectable — monthly",
      name: "Semaglutide — monthly",
      lineLabel: "Semaglutide injectable program (1 mo)",
      amountUsd: p.injectable.semaglutideFromUsd,
      squareName: "Hello Gorgeous RX™ — Semaglutide Program (1 mo)",
      allowCustomAmount: true,
    },
    {
      id: "glp1-tirz-starter",
      track: "weight-loss",
      group: "Injectable — monthly",
      name: "Tirzepatide — starter",
      lineLabel: "Tirzepatide injectable — starter tier (1 mo)",
      amountUsd: p.injectable.tirzepatideStarterUsd,
      squareName: "Hello Gorgeous RX™ — Tirzepatide Starter (1 mo)",
      squareSlug: "tirzepatide",
      allowCustomAmount: true,
    },
    {
      id: "glp1-tirz-standard",
      track: "weight-loss",
      group: "Injectable — monthly",
      name: "Tirzepatide — standard",
      lineLabel: "Tirzepatide injectable — standard tier (1 mo)",
      amountUsd: p.injectable.tirzepatideStandardUsd,
      squareName: "Hello Gorgeous RX™ — Tirzepatide Standard (1 mo)",
      allowCustomAmount: true,
    },
    {
      id: "glp1-tirz-advanced",
      track: "weight-loss",
      group: "Injectable — monthly",
      name: "Tirzepatide — advanced",
      lineLabel: "Tirzepatide injectable — advanced tier (1 mo)",
      amountUsd: p.injectable.tirzepatideAdvancedUsd,
      squareName: "Hello Gorgeous RX™ — Tirzepatide Advanced (1 mo)",
      allowCustomAmount: true,
    },
    {
      id: "glp1-3mo-bundle",
      track: "weight-loss",
      group: "Prepay bundles",
      name: "3-month injectable bundle",
      lineLabel: "GLP-1 injectable — 3-month prepay",
      amountUsd: p.injectable.threeMonthFromUsd,
      squareName: "Hello Gorgeous RX™ — GLP-1 3-Month Prepay",
      allowCustomAmount: true,
    },
    {
      id: "glp1-3mo-high-dose",
      track: "weight-loss",
      group: "Prepay bundles",
      name: "3-month high-dose bundle",
      lineLabel: "GLP-1 high-dose — 3-month prepay",
      amountUsd: p.injectable.threeMonthHighDoseFromUsd,
      squareName: "Hello Gorgeous RX™ — GLP-1 High-Dose 3-Month Prepay",
      allowCustomAmount: true,
    },
    {
      id: "glp1-oral-low",
      track: "weight-loss",
      group: "Oral (home delivery)",
      name: "Oral GLP-1 — low tier",
      lineLabel: "Sublingual GLP-1 — monthly (lower dose tier)",
      amountUsd: p.oral.monthlyFromUsd,
      squareName: "Hello Gorgeous RX™ — Oral GLP-1 Program (1 mo)",
      allowCustomAmount: true,
    },
    {
      id: "glp1-oral-high",
      track: "weight-loss",
      group: "Oral (home delivery)",
      name: "Oral GLP-1 — high tier",
      lineLabel: "Sublingual GLP-1 — monthly (higher dose tier)",
      amountUsd: p.oral.monthlyToUsd,
      squareName: "Hello Gorgeous RX™ — Oral GLP-1 Program (1 mo)",
      allowCustomAmount: true,
    },
    {
      id: "glp1-pharmacy-rx",
      track: "weight-loss",
      group: "Pharmacy Rx path",
      name: "Pharmacy Rx evaluation",
      lineLabel: "Monthly Rx evaluation (med at pharmacy separate)",
      amountUsd: p.pharmacyRx.monthlyEvalUsd,
      squareName: "Hello Gorgeous — GLP-1 Pharmacy Rx Evaluation",
    },
  ];
}

function peptideCategoryGroup(cat: PeptideRetailCategory): string {
  return cat;
}

function peptideTemplates(): RxInvoiceTemplate[] {
  const monthly: RxInvoiceTemplate[] = PEPTIDE_RETAIL_MENU.map((row) => ({
    id: `peptide-${row.id}`,
    track: row.category === "Medical Weight Loss" ? ("weight-loss" as const) : ("peptides" as const),
    group: peptideCategoryGroup(row.category),
    name: row.name,
    lineLabel: `${row.name} — 1-month protocol`,
    amountUsd: row.fromMonthlyUsd,
    squareName: `Hello Gorgeous RX™ — ${row.name} (1 mo)`,
    squareSlug: row.id,
    note: row.note,
    allowCustomAmount: true,
  }));

  const prepay: RxInvoiceTemplate[] = PEPTIDE_RETAIL_MENU.filter(
    (r) => r.category !== "Medical Weight Loss",
  ).map((row) => ({
    id: `peptide-${row.id}-prepay`,
    track: "peptides" as const,
    group: "3-month prepay (10% off)",
    name: `${row.name} — 3-mo prepay`,
    lineLabel: `${row.name} — ${PEPTIDE_PREPAY_MONTHS}-month prepay`,
    amountUsd: peptidePrepayTotal(row.fromMonthlyUsd),
    squareName: `Hello Gorgeous RX™ — ${row.name} (${PEPTIDE_PREPAY_MONTHS}-mo prepay)`,
    squareSlug: row.id,
    note: `${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% prepay discount applied`,
    allowCustomAmount: true,
  }));

  return [...monthly, ...prepay];
}

function feeTemplates(): RxInvoiceTemplate[] {
  return [
    {
      id: "rx-consult",
      track: "fees",
      group: "Consult fees",
      name: "Peptide / RX NP consult",
      lineLabel: "Hello Gorgeous RX™ NP consult",
      amountUsd: PROGRAM_CONSULT_FEE_USD,
      squareName: "Hello Gorgeous RX™ — Peptide Consult (NP)",
      sku: "HG-RX-CONSULT-49",
      squareSlug: "peptide-consult",
    },
    {
      id: "rx-shipping",
      track: "fees",
      group: "Fees & shipping",
      name: "Pharmacy / cold-chain shipping",
      lineLabel: "Pharmacy & cold-chain shipping",
      amountUsd: PEPTIDE_PHARMACY_SHIPPING_USD,
      squareName: "Hello Gorgeous RX™ — Pharmacy / Shipping",
      sku: "HG-RX-SHIP",
      squareSlug: "pharmacy-shipping",
      allowCustomAmount: true,
    },
    {
      id: "rx-telehealth-refill",
      track: "fees",
      group: "Fees & shipping",
      name: "Telehealth refill review",
      lineLabel: "Telehealth refill review (NP)",
      amountUsd: 0,
      squareName: "Hello Gorgeous RX™ — Telehealth Refill Review",
      sku: "HG-RX-REFILL-TH",
      squareSlug: "telehealth-refill-review",
      allowCustomAmount: true,
      note: "Enter custom amount if you charge for refill telehealth",
    },
  ];
}

const ALL_TEMPLATES: RxInvoiceTemplate[] = [
  ...glp1Templates(),
  ...peptideTemplates(),
  ...feeTemplates(),
];

const BY_ID = new Map(ALL_TEMPLATES.map((t) => [t.id, t]));

export function getRxInvoiceTemplate(id: string): RxInvoiceTemplate | undefined {
  return BY_ID.get(id);
}

export function listRxInvoiceTemplates(track?: RxInvoiceTrack): RxInvoiceTemplate[] {
  if (!track) return ALL_TEMPLATES;
  return ALL_TEMPLATES.filter((t) => t.track === track);
}

export function rxInvoiceTracks(): { id: RxInvoiceTrack; label: string; count: number }[] {
  return [
    { id: "weight-loss", label: "Weight loss (GLP-1)", count: listRxInvoiceTemplates("weight-loss").length },
    { id: "peptides", label: "Peptides", count: listRxInvoiceTemplates("peptides").length },
    { id: "fees", label: "Fees & shipping", count: listRxInvoiceTemplates("fees").length },
  ];
}

export function resolveTemplateAmountUsd(
  template: RxInvoiceTemplate,
  customAmountUsd?: number,
): number | null {
  const custom = customAmountUsd != null && Number.isFinite(customAmountUsd) ? customAmountUsd : null;
  if (custom != null && custom > 0) {
    if (!template.allowCustomAmount && custom !== template.amountUsd) {
      return null;
    }
    return Math.round(custom * 100) / 100;
  }
  if (template.amountUsd <= 0) return null;
  return template.amountUsd;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
