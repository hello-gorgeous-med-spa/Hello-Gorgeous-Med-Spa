/**
 * Peptide master price list — retail, website checkout, BoomRx wholesale, margin.
 */

import { pickPeptideBoomRxPack } from "@/lib/peptide-boomrx-catalog";
import { PEPTIDE_BOOMRX_CATALOG } from "@/lib/peptide-boomrx-catalog";
import { PEPTIDE_REQUEST_ITEMS } from "@/lib/peptide-request-menu";
import {
  computePeptideSupplyQuote,
  peptideMonthlyRetailUsd,
} from "@/lib/peptide-supply-pricing";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type PeptidePriceListRow = {
  peptideMenuId: string;
  peptideName: string;
  category: string;
  supplyCycle: RxSupplyCycleId;
  retailMonthlyUsd: number;
  websiteChargeUsd: number;
  shippingUsd: number;
  boomrxSku: string | null;
  boomrxProduct: string | null;
  boomrxWholesaleUsd: number | null;
  grossProfitUsd: number | null;
  marginPct: number | null;
  inPdf: boolean;
};

export function buildPeptideMasterPriceList(): PeptidePriceListRow[] {
  const cycles: RxSupplyCycleId[] = ["30-day", "90-day"];
  const rows: PeptidePriceListRow[] = [];

  for (const entry of PEPTIDE_BOOMRX_CATALOG) {
    const item = PEPTIDE_REQUEST_ITEMS.find((p) => p.id === entry.peptideMenuId);
    if (!item || item.id === "tirzepatide") continue;

    for (const cycle of cycles) {
      const quote = computePeptideSupplyQuote(entry.peptideMenuId, cycle);
      const pack = pickPeptideBoomRxPack(entry.peptideMenuId, cycle);
      if (!quote) continue;

      const wholesale = pack?.wholesaleUsd ?? null;
      let grossProfitUsd: number | null = null;
      let marginPct: number | null = null;
      if (wholesale != null && quote.totalUsd > 0) {
        grossProfitUsd = quote.totalUsd - wholesale;
        marginPct = Math.round((grossProfitUsd / quote.totalUsd) * 1000) / 10;
      }

      rows.push({
        peptideMenuId: entry.peptideMenuId,
        peptideName: item.name,
        category: item.category,
        supplyCycle: cycle,
        retailMonthlyUsd: peptideMonthlyRetailUsd(entry.peptideMenuId),
        websiteChargeUsd: quote.totalUsd,
        shippingUsd: quote.shippingUsd,
        boomrxSku: pack?.id ?? null,
        boomrxProduct: pack?.productName ?? null,
        boomrxWholesaleUsd: wholesale,
        grossProfitUsd,
        marginPct,
        inPdf: entry.inPdf,
      });
    }
  }

  return rows.sort(
    (a, b) =>
      a.category.localeCompare(b.category) ||
      a.peptideName.localeCompare(b.peptideName) ||
      a.supplyCycle.localeCompare(b.supplyCycle),
  );
}

export function peptidePriceListToCsv(rows: PeptidePriceListRow[]): string {
  const header = [
    "Peptide",
    "Category",
    "Supply",
    "Retail/mo",
    "Website charge",
    "Shipping",
    "BoomRx SKU",
    "BoomRx wholesale",
    "Profit",
    "Margin %",
    "In PDF",
  ].join(",");

  const lines = rows.map((r) =>
    [
      `"${r.peptideName}"`,
      `"${r.category}"`,
      r.supplyCycle,
      r.retailMonthlyUsd,
      r.websiteChargeUsd,
      r.shippingUsd,
      r.boomrxSku ?? "",
      r.boomrxWholesaleUsd ?? "",
      r.grossProfitUsd ?? "",
      r.marginPct ?? "",
      r.inPdf ? "yes" : "est",
    ].join(","),
  );

  return [header, ...lines].join("\n");
}

export const PEPTIDE_PHARMACY_POLICY = {
  onlineDefault: "boomrx" as const,
  preferred90Day: "boomrx" as const,
  shippingUsd: PEPTIDE_PHARMACY_SHIPPING_USD,
};
