/**
 * Peptide pharmacy fulfillment — BoomRx vials per paid refill.
 */

import {
  boomRxPeptideOrderLine,
  pickPeptideBoomRxPack,
  type PeptideBoomRxPack,
} from "@/lib/peptide-boomrx-catalog";
import {
  computePeptideCombinedQuote,
  peptideMenuIdFromDisplayName,
} from "@/lib/peptide-supply-pricing";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type PeptideVialFulfillment = {
  peptideMenuId: string;
  peptideName: string;
  supplyCycle: RxSupplyCycleId;
  vialsToOrder: number;
  totalWholesaleUsd: number;
  pharmacySku: string | null;
  pharmacyProduct: string | null;
  orderLine: string;
};

export type PeptideRefillFulfillment = {
  supplyCycle: RxSupplyCycleId;
  lines: PeptideVialFulfillment[];
  totalVials: number;
  totalWholesaleUsd: number;
  orderSummary: string;
};

function fulfillmentFromPack(
  menuId: string,
  name: string,
  supplyCycle: RxSupplyCycleId,
  pack: PeptideBoomRxPack,
): PeptideVialFulfillment {
  return {
    peptideMenuId: menuId,
    peptideName: name,
    supplyCycle,
    vialsToOrder: pack.vialCount,
    totalWholesaleUsd: pack.wholesaleUsd,
    pharmacySku: pack.id,
    pharmacyProduct: pack.productName,
    orderLine: boomRxPeptideOrderLine(pack),
  };
}

export function computePeptideRefillFulfillment(
  peptideNames: string[],
  supplyCycleRaw?: unknown,
): PeptideRefillFulfillment | null {
  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const quote = computePeptideCombinedQuote(peptideNames, supplyCycle);
  if (!quote) return null;

  const lines: PeptideVialFulfillment[] = [];
  for (const q of quote.lines) {
    const pack = pickPeptideBoomRxPack(q.peptideMenuId, supplyCycle);
    if (!pack) continue;
    lines.push(fulfillmentFromPack(q.peptideMenuId, q.peptideName, supplyCycle, pack));
  }

  if (lines.length === 0) return null;

  const totalVials = lines.reduce((s, l) => s + l.vialsToOrder, 0);
  const totalWholesaleUsd = lines.reduce((s, l) => s + l.totalWholesaleUsd, 0);

  return {
    supplyCycle,
    lines,
    totalVials,
    totalWholesaleUsd,
    orderSummary: lines.map((l) => l.orderLine).join("\n"),
  };
}

export function fulfillmentFromPeptideIntakeResponses(
  responses: Record<string, unknown>,
): PeptideRefillFulfillment | null {
  const peptides = Array.isArray(responses.selected_peptides)
    ? (responses.selected_peptides as string[])
    : [];
  const names = peptides.length
    ? peptides
    : String(responses.current_peptide || "")
        .split(/[,+]/)
        .map((s) => s.trim())
        .filter(Boolean);

  return computePeptideRefillFulfillment(names, responses.supply_cycle);
}

export function peptideNamesToMenuIds(names: string[]): string[] {
  return names
    .map((n) => peptideMenuIdFromDisplayName(n) ?? n.trim())
    .filter(Boolean);
}
