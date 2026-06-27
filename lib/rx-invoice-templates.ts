/**
 * Hello Gorgeous RX™ — premade invoice / payment-link templates
 * for staff to send GLP-1 weight loss & peptide protocol fees quickly.
 */

import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import {
  GLP1_ALL_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
} from "@/lib/glp1-dose-tiers";
import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import {
  PEPTIDE_PHARMACY_SHIPPING_USD,
  PEPTIDE_PREPAY_DISCOUNT_PERCENT,
  PEPTIDE_PREPAY_MONTHS,
  PEPTIDE_RETAIL_MENU,
  peptidePrepayTotal,
  type PeptideRetailCategory,
} from "@/lib/peptide-retail-pricing";
import { computeRxSupplyQuote } from "@/lib/rx-supply-cycle";

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

function glp1DoseTierTemplates(): RxInvoiceTemplate[] {
  return GLP1_ALL_DOSE_TIERS.map((tier) => ({
    id: tier.invoiceTemplateId,
    track: "weight-loss" as const,
    group: `${tier.medication} — dose tiers`,
    name: `${tier.medication} ${tier.doseLabel}`,
    lineLabel: `${tier.medication} ${tier.doseLabel} (1 mo)`,
    amountUsd: tier.priceUsd,
    squareName: `Hello Gorgeous RX™ — ${tier.medication} ${tier.doseLabel}`,
    allowCustomAmount: true,
  }));
}

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
    ...glp1DoseTierTemplates(),
    {
      id: GLP1_INSURANCE_OVERSIGHT.invoiceTemplateId,
      track: "weight-loss",
      group: "Insurance oversight",
      name: "GLP-1 insurance oversight",
      lineLabel: GLP1_INSURANCE_OVERSIGHT.lineLabel,
      amountUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
      squareName: "Hello Gorgeous RX™ — GLP-1 Insurance Oversight (1 mo)",
      allowCustomAmount: true,
      note: GLP1_INSURANCE_OVERSIGHT.note,
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
      group: "Insurance oversight",
      name: "Insurance oversight (legacy alias)",
      lineLabel: "GLP-1 medical oversight — insurance pharmacy fill (1 mo)",
      amountUsd: p.insuranceOversight.monthlyUsd,
      squareName: "Hello Gorgeous — GLP-1 Insurance Oversight",
      note: "Same as Insurance oversight template",
    },
  ];
}

function peptideCategoryGroup(cat: PeptideRetailCategory): string {
  return cat;
}

function peptideTemplates(): RxInvoiceTemplate[] {
  const monthly: RxInvoiceTemplate[] = PEPTIDE_RETAIL_MENU.filter(
    (r) => r.category !== "Medical Weight Loss",
  ).map((row) => ({
    id: `peptide-${row.id}`,
    track: "peptides" as const,
    group: peptideCategoryGroup(row.category),
    name: `${row.name} — 30-day`,
    lineLabel: `${row.name} — 30-day supply + shipping`,
    amountUsd: row.fromMonthlyUsd + PEPTIDE_PHARMACY_SHIPPING_USD,
    squareName: `Hello Gorgeous RX™ — ${row.name} (30-day)`,
    squareSlug: row.id,
    note: row.note,
    allowCustomAmount: true,
  }));

  const ninetyDay: RxInvoiceTemplate[] = PEPTIDE_RETAIL_MENU.filter(
    (r) => r.category !== "Medical Weight Loss",
  ).map((row) => {
    const supply = computeRxSupplyQuote({
      monthlyMedUsd: row.fromMonthlyUsd,
      supplyCycle: "90-day",
      lineBase: row.name,
      shippingUsd: PEPTIDE_PHARMACY_SHIPPING_USD,
    });
    return {
      id: `peptide-${row.id}-90day`,
      track: "peptides" as const,
      group: "90-day supply",
      name: `${row.name} — 90-day`,
      lineLabel: supply.lineLabel,
      amountUsd: supply.totalUsd,
      squareName: `Hello Gorgeous RX™ — ${row.name} (90-day)`,
      squareSlug: row.id,
      note: row.note,
      allowCustomAmount: true,
    };
  });

  /** @deprecated Legacy 10% prepay — use 90-day supply templates */
  const prepay: RxInvoiceTemplate[] = PEPTIDE_RETAIL_MENU.filter(
    (r) => r.category !== "Medical Weight Loss",
  ).map((row) => ({
    id: `peptide-${row.id}-prepay`,
    track: "peptides" as const,
    group: "Legacy 3-mo prepay (10% off)",
    name: `${row.name} — 3-mo prepay (legacy)`,
    lineLabel: `${row.name} — ${PEPTIDE_PREPAY_MONTHS}-month prepay`,
    amountUsd: peptidePrepayTotal(row.fromMonthlyUsd),
    squareName: `Hello Gorgeous RX™ — ${row.name} (${PEPTIDE_PREPAY_MONTHS}-mo prepay)`,
    squareSlug: row.id,
    note: `${PEPTIDE_PREPAY_DISCOUNT_PERCENT}% prepay discount — prefer 90-day supply template`,
    allowCustomAmount: true,
  }));

  return [...monthly, ...ninetyDay, ...prepay];
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
      amountUsd: PROGRAM_CONSULT_FEE_USD,
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

/** Default premade invoice when staff resend from command center / dispatch. */
export function defaultInvoiceTemplateForTrack(
  track: "peptide" | "glp1" | "unknown",
): string {
  if (track === "glp1") return "glp1-consult";
  return "rx-consult";
}
