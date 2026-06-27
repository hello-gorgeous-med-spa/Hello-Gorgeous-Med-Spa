/**
 * Peptide protocol pricing — BoomRx wholesale × 2.5 + shipping, 10% off 90-day product.
 */

import {
  boomrx90DaySavingsNote,
  boomrxConsumerMonthlyUsd,
  boomrxConsumerPriceLabel,
  boomrxConsumerProductUsd,
  boomrxConsumerShippingUsd,
} from "@/lib/boomrx-consumer-pricing";
import { pickPeptideBoomRxPack } from "@/lib/peptide-boomrx-catalog";
import { PEPTIDE_REQUEST_ITEMS } from "@/lib/peptide-request-menu";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type PeptideSupplyQuoteLine = {
  peptideMenuId: string;
  peptideName: string;
  monthlyRetailUsd: number;
  supplyCycle: RxSupplyCycleId;
  productUsd: number;
  shippingUsd: number;
  boomrxWholesaleUsd: number;
  totalUsd: number;
  lineLabel: string;
  priceLabel: string;
  invoiceTemplateId: string;
  savingsNote?: string;
};

export type PeptideCombinedSupplyQuote = {
  supplyCycle: RxSupplyCycleId;
  lines: PeptideSupplyQuoteLine[];
  productSubtotalUsd: number;
  shippingUsd: number;
  totalWholesaleUsd: number;
  totalUsd: number;
  priceLabel: string;
  lineLabel: string;
  savingsNote?: string;
};

export function peptideMenuIdFromDisplayName(name: string): string | null {
  const n = name.trim();
  const item = PEPTIDE_REQUEST_ITEMS.find((p) => p.name === n || p.id === n);
  return item?.id ?? null;
}

export function peptideMonthlyRetailUsd(menuId: string): number | null {
  const pack30 = pickPeptideBoomRxPack(menuId, "30-day");
  if (!pack30) return null;
  return boomrxConsumerMonthlyUsd(pack30.wholesaleUsd);
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
  const pack = pickPeptideBoomRxPack(id, supplyCycle);
  const pack30 = pickPeptideBoomRxPack(id, "30-day");
  if (!pack || !pack30) return null;

  const productUsd = boomrxConsumerProductUsd(pack.wholesaleUsd, supplyCycle);
  const shippingUsd = boomrxConsumerShippingUsd();
  const totalUsd = productUsd + shippingUsd;
  const months = supplyCycle === "90-day" ? 3 : 1;
  const periodLabel = months === 1 ? "1 mo" : `${months} mo`;

  return {
    peptideMenuId: id,
    peptideName: item.name,
    monthlyRetailUsd: boomrxConsumerMonthlyUsd(pack30.wholesaleUsd),
    supplyCycle,
    productUsd,
    shippingUsd,
    boomrxWholesaleUsd: pack.wholesaleUsd,
    totalUsd,
    lineLabel: `${item.name} (${periodLabel} + shipping)`,
    priceLabel: boomrxConsumerPriceLabel(totalUsd, supplyCycle),
    invoiceTemplateId: peptideInvoiceTemplateId(id, supplyCycle),
    savingsNote:
      supplyCycle === "90-day"
        ? boomrx90DaySavingsNote(pack30.wholesaleUsd, pack.wholesaleUsd)
        : undefined,
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

  const productSubtotalUsd = lines.reduce((s, l) => s + l.productUsd, 0);
  const shippingUsd = boomrxConsumerShippingUsd();
  const totalUsd = productSubtotalUsd + shippingUsd;
  const totalWholesaleUsd = lines.reduce((s, l) => s + l.boomrxWholesaleUsd, 0);
  const months = supplyCycle === "90-day" ? 3 : 1;
  const periodLabel = months === 1 ? "1 mo" : `${months} mo`;

  const savingsNote =
    supplyCycle === "90-day" && lines.length === 1 && lines[0]?.savingsNote
      ? lines[0].savingsNote
      : supplyCycle === "90-day"
        ? `${lines.length} protocol(s) · 10% off 90-day product + $${shippingUsd} shipping`
        : undefined;

  return {
    supplyCycle,
    lines,
    productSubtotalUsd,
    shippingUsd,
    totalWholesaleUsd,
    totalUsd,
    priceLabel: boomrxConsumerPriceLabel(totalUsd, supplyCycle),
    lineLabel: `${lines.map((l) => l.peptideName).join(" + ")} (${periodLabel} + shipping)`,
    savingsNote,
  };
}

export function formatPeptidePriceUsd(amountUsd: number): string {
  return `$${amountUsd.toFixed(0)}`;
}
