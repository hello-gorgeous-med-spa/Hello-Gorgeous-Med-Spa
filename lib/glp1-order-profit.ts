/**
 * GLP-1 order profit — revenue vs pharmacy COGS for paid clinic + website orders.
 */

import { computeGlp1RefillQuote } from "@/lib/glp1-refill-pricing";
import type { PharmacyOrderLine } from "@/lib/glp1-vial-fulfillment";
import { listPharmacyOrderLines } from "@/lib/rx-pharmacy-orders";

export type Glp1OrderProfitRow = {
  id: string;
  source: "online" | "clinic";
  orderedAt: string;
  patientName: string;
  intakeRef: string;
  medication: string;
  doseLabel: string | null;
  doseTierId: string | null;
  supplyCycle: string;
  pharmacy: string | null;
  dispatchStatus: string;
  revenueUsd: number | null;
  expectedQuoteUsd: number | null;
  wholesaleUsd: number | null;
  grossProfitUsd: number | null;
  marginPct: number | null;
  pharmacySku: string | null;
  fulfillmentError?: string;
};

export type Glp1OrderProfitTotals = {
  orderCount: number;
  revenueUsd: number;
  wholesaleUsd: number;
  grossProfitUsd: number;
  avgMarginPct: number | null;
  onlineCount: number;
  clinicCount: number;
};

function computeProfitRow(line: PharmacyOrderLine): Glp1OrderProfitRow {
  const revenueUsd = line.paymentAmountUsd;
  const wholesaleUsd = line.fulfillment?.totalWholesaleUsd ?? null;

  let expectedQuoteUsd: number | null = null;
  if (line.doseTierId && line.medication) {
    const quote = computeGlp1RefillQuote(line.medication, line.doseTierId, line.supplyCycle);
    expectedQuoteUsd = quote?.priceUsd ?? null;
  }

  let grossProfitUsd: number | null = null;
  let marginPct: number | null = null;
  if (revenueUsd != null && wholesaleUsd != null) {
    grossProfitUsd = revenueUsd - wholesaleUsd;
    if (revenueUsd > 0) {
      marginPct = Math.round((grossProfitUsd / revenueUsd) * 1000) / 10;
    }
  }

  return {
    id: line.id,
    source: line.source,
    orderedAt: line.orderedAt,
    patientName: line.patientName,
    intakeRef: line.intakeRef,
    medication: line.medication,
    doseLabel: line.doseLabel ?? line.fulfillment?.doseLabel ?? null,
    doseTierId: line.doseTierId,
    supplyCycle: line.supplyCycle,
    pharmacy: line.pharmacy,
    dispatchStatus: line.dispatchStatus,
    revenueUsd,
    expectedQuoteUsd,
    wholesaleUsd,
    grossProfitUsd,
    marginPct,
    pharmacySku: line.fulfillment?.pharmacySku ?? null,
    fulfillmentError: line.fulfillmentError,
  };
}

export function rollupGlp1OrderProfitTotals(rows: Glp1OrderProfitRow[]): Glp1OrderProfitTotals {
  let revenueUsd = 0;
  let wholesaleUsd = 0;
  let grossProfitUsd = 0;
  let marginSum = 0;
  let marginCount = 0;
  let onlineCount = 0;
  let clinicCount = 0;

  for (const row of rows) {
    if (row.source === "online") onlineCount += 1;
    else clinicCount += 1;

    if (row.revenueUsd != null) revenueUsd += row.revenueUsd;
    if (row.wholesaleUsd != null) wholesaleUsd += row.wholesaleUsd;
    if (row.grossProfitUsd != null) {
      grossProfitUsd += row.grossProfitUsd;
      if (row.marginPct != null) {
        marginSum += row.marginPct;
        marginCount += 1;
      }
    }
  }

  return {
    orderCount: rows.length,
    revenueUsd,
    wholesaleUsd,
    grossProfitUsd,
    avgMarginPct: marginCount > 0 ? Math.round((marginSum / marginCount) * 10) / 10 : null,
    onlineCount,
    clinicCount,
  };
}

export function glp1OrderProfitToCsv(rows: Glp1OrderProfitRow[]): string {
  const header = [
    "Date",
    "Source",
    "Patient",
    "Ref",
    "Medication",
    "Dose",
    "Supply",
    "Pharmacy",
    "Status",
    "Revenue",
    "Expected quote",
    "Wholesale COGS",
    "Gross profit",
    "Margin %",
    "SKU",
  ].join(",");

  const lines = rows.map((r) =>
    [
      r.orderedAt.slice(0, 10),
      r.source,
      `"${r.patientName.replace(/"/g, '""')}"`,
      r.intakeRef,
      r.medication,
      `"${(r.doseLabel ?? "").replace(/"/g, '""')}"`,
      r.supplyCycle,
      r.pharmacy ?? "",
      r.dispatchStatus,
      r.revenueUsd ?? "",
      r.expectedQuoteUsd ?? "",
      r.wholesaleUsd ?? "",
      r.grossProfitUsd ?? "",
      r.marginPct ?? "",
      r.pharmacySku ?? "",
    ].join(","),
  );

  return [header, ...lines].join("\n");
}

export async function listGlp1OrderProfit(opts?: {
  includeShipped?: boolean;
}): Promise<{
  rows: Glp1OrderProfitRow[];
  totals: Glp1OrderProfitTotals;
  tableReady: boolean;
}> {
  const { lines, tableReady } = await listPharmacyOrderLines({
    includeShipped: opts?.includeShipped,
  });

  const rows = lines.map(computeProfitRow);
  const totals = rollupGlp1OrderProfitTotals(rows);

  return { rows, totals, tableReady };
}
