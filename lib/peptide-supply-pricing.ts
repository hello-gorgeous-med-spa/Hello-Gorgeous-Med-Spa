/**
 * Peptide protocol pricing — 30-day & 90-day supply (same model as GLP-1).
 */

import { PEPTIDE_REQUEST_ITEMS } from "@/lib/peptide-request-menu";
import {
  getPeptideRetailMonthlyUsd,
  PEPTIDE_PHARMACY_SHIPPING_USD,
} from "@/lib/peptide-retail-pricing";
import { pickPeptideBoomRxPack } from "@/lib/peptide-boomrx-catalog";
import {
  computeRxSupplyQuote,
  parseRxSupplyCycle,
  type RxSupplyCycleId,
} from "@/lib/rx-supply-cycle";

export type PeptideSupplyQuoteLine = {
  peptideMenuId: string;
  peptideName: string;
  monthlyRetailUsd: number;
  supplyCycle: RxSupplyCycleId;
  medicationSubtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  lineLabel: string;
  priceLabel: string;
  invoiceTemplateId: string;
  boomrxWholesaleUsd: number | null;
  savingsNote?: string;
};

export type PeptideCombinedSupplyQuote = {
  supplyCycle: RxSupplyCycleId;
  lines: PeptideSupplyQuoteLine[];
  medicationSubtotalUsd: number;
  shippingUsd: number;
  totalUsd: number;
  priceLabel: string;
  lineLabel: string;
  savingsNote?: string;
};

/** Default monthly retail when not on published menu (NP confirms at visit). */
export const PEPTIDE_DEFAULT_MONTHLY_RETAIL_USD = 169;

export function peptideMenuIdFromDisplayName(name: string): string | null {
  const n = name.trim();
  const item = PEPTIDE_REQUEST_ITEMS.find((p) => p.name === n || p.id === n);
  return item?.id ?? null;
}

export function peptideMonthlyRetailUsd(menuId: string): number {
  return getPeptideRetailMonthlyUsd(menuId) ?? PEPTIDE_DEFAULT_MONTHLY_RETAIL_USD;
}

export function peptideInvoiceTemplateId(menuId: string, supplyCycle: RxSupplyCycleId): string {
  return supplyCycle === "90-day" ? `peptide-${menuId}-90day` : `peptide-${menuId}`;
}

export function computePeptideSupplyQuote(
  menuId: string,
  supplyCycleRaw?: unknown,
): PeptideSupplyQuoteLine | null {
  const id = menuId.trim();
  if (!id) return null;

  const item = PEPTIDE_REQUEST_ITEMS.find((p) => p.id === id);
  if (!item) return null;

  if (item.id === "tirzepatide" || item.id === "retatrutide") {
    return null;
  }

  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const monthlyRetailUsd = peptideMonthlyRetailUsd(id);
  const supply = computeRxSupplyQuote({
    monthlyMedUsd: monthlyRetailUsd,
    supplyCycle,
    lineBase: item.name,
    shippingUsd: PEPTIDE_PHARMACY_SHIPPING_USD,
  });

  const boomrx = pickPeptideBoomRxPack(id, supplyCycle);

  return {
    peptideMenuId: id,
    peptideName: item.name,
    monthlyRetailUsd,
    supplyCycle,
    medicationSubtotalUsd: supply.medicationSubtotalUsd,
    shippingUsd: supply.shippingUsd,
    totalUsd: supply.totalUsd,
    lineLabel: supply.lineLabel,
    priceLabel: supply.priceLabel,
    invoiceTemplateId: peptideInvoiceTemplateId(id, supplyCycle),
    boomrxWholesaleUsd: boomrx?.wholesaleUsd ?? null,
    savingsNote: supply.savingsNote,
  };
}

export function computePeptideCombinedQuote(
  peptideNamesOrIds: string[],
  supplyCycleRaw?: unknown,
): PeptideCombinedSupplyQuote | null {
  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const lines: PeptideSupplyQuoteLine[] = [];

  for (const raw of peptideNamesOrIds) {
    const menuId = peptideMenuIdFromDisplayName(raw) ?? raw.trim();
    if (!menuId) continue;
    const quote = computePeptideSupplyQuote(menuId, supplyCycle);
    if (quote) lines.push(quote);
  }

  if (lines.length === 0) return null;

  const medicationSubtotalUsd = lines.reduce((s, l) => s + l.medicationSubtotalUsd, 0);
  const shippingUsd = PEPTIDE_PHARMACY_SHIPPING_USD;
  const totalUsd = medicationSubtotalUsd + shippingUsd;
  const months = supplyCycle === "90-day" ? 3 : 1;
  const periodLabel = months === 1 ? "1 mo" : `${months} mo`;

  const monthlyAltShipping = PEPTIDE_PHARMACY_SHIPPING_USD * months;
  const savingsNote =
    supplyCycle === "90-day" && monthlyAltShipping > shippingUsd
      ? `Save $${monthlyAltShipping - shippingUsd} on shipping vs three monthly shipments`
      : undefined;

  return {
    supplyCycle,
    lines,
    medicationSubtotalUsd,
    shippingUsd,
    totalUsd,
    priceLabel:
      months === 1 ? `$${totalUsd}/mo` : `$${totalUsd} / ${months} mo`,
    lineLabel: `${lines.map((l) => l.peptideName).join(" + ")} (${periodLabel} + shipping)`,
    savingsNote,
  };
}

export function formatPeptidePriceUsd(amountUsd: number): string {
  return `$${amountUsd.toFixed(0)}`;
}
