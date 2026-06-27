/**
 * Hello Gorgeous GLP-1 — master price list (retail, website checkout, wholesale, margin).
 * BoomRx is the preferred pharmacy for 90-day / online refills.
 */

import { pickBoomRxGlp1Pack } from "@/lib/glp1-boomrx-catalog";
import {
  GLP1_ALL_DOSE_TIERS,
  GLP1_INSURANCE_OVERSIGHT,
  type Glp1DoseTier,
} from "@/lib/glp1-dose-tiers";
import { pickFormulationTirzInjectablePack } from "@/lib/glp1-formulation-catalog";
import { computeGlp1RefillQuote } from "@/lib/glp1-refill-pricing";
import type { RxPharmacy } from "@/lib/rx-dispatch";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";
import {
  computeRxSupplyQuote,
  type RxSupplyCycleId,
} from "@/lib/rx-supply-cycle";

export const GLP1_PHARMACY_POLICY = {
  /** Online GLP-1 refills ship via BoomRx portal */
  onlineDefault: "boomrx" as RxPharmacy,
  /** 90-day prepay — order BoomRx combo packs (better wholesale vs 3× monthly) */
  preferred90Day: "boomrx" as RxPharmacy,
  /** In-clinic sale — staff picks Formulation or BoomRx on encounter */
  clinicOptions: ["boomrx", "formulation"] as const,
  shippingUsd: PEPTIDE_PHARMACY_SHIPPING_USD,
} as const;

export type Glp1VendorWholesale = {
  vendor: RxPharmacy;
  sku: string | null;
  product: string | null;
  pack: string | null;
  wholesaleUsd: number | null;
  grossProfitUsd: number | null;
  marginPct: number | null;
};

export type Glp1PriceListRow = {
  tierId: string;
  medication: string;
  doseLabel: string;
  supplyCycle: RxSupplyCycleId;
  supplyMonths: number;
  /** Published monthly med price (program tier) */
  retailMonthlyUsd: number;
  /** Med subtotal for the supply cycle (no shipping) */
  medSubtotalUsd: number;
  shippingUsd: number;
  /** What the website charges at checkout (med × months + one shipping fee) */
  websiteChargeUsd: number;
  /** Preferred vendor for ordering at this cycle */
  preferredVendor: RxPharmacy;
  boomrx: Glp1VendorWholesale;
  formulation: Glp1VendorWholesale | null;
};

function margin(revenueUsd: number, cogsUsd: number | null): { profit: number | null; pct: number | null } {
  if (cogsUsd == null || revenueUsd <= 0) return { profit: null, pct: null };
  const profit = revenueUsd - cogsUsd;
  const pct = Math.round((profit / revenueUsd) * 1000) / 10;
  return { profit, pct };
}

function boomrxWholesaleForTier(tier: Glp1DoseTier, cycle: RxSupplyCycleId): Glp1VendorWholesale {
  const pack = pickBoomRxGlp1Pack(tier.id, cycle);
  return {
    vendor: "boomrx",
    sku: pack?.id ?? null,
    product: pack?.productName ?? null,
    pack: pack?.packDescription ?? null,
    wholesaleUsd: pack?.wholesaleUsd ?? null,
    grossProfitUsd: null,
    marginPct: null,
  };
}

function formulationWholesaleForTier(
  tier: Glp1DoseTier,
  cycle: RxSupplyCycleId,
): Glp1VendorWholesale | null {
  if (tier.medication !== "Tirzepatide") return null;
  const vialCount = cycle === "90-day" ? 3 : 1;
  const pack = pickFormulationTirzInjectablePack(vialCount);
  if (!pack) return null;
  return {
    vendor: "formulation",
    sku: pack.sku,
    product: pack.productName,
    pack: pack.packDescription,
    wholesaleUsd: pack.wholesaleUsd,
    grossProfitUsd: null,
    marginPct: null,
  };
}

function buildTierRow(tier: Glp1DoseTier, cycle: RxSupplyCycleId): Glp1PriceListRow {
  const quote = computeGlp1RefillQuote(tier.medication, tier.id, cycle);
  const websiteChargeUsd = quote?.priceUsd ?? 0;
  const preferredVendor: RxPharmacy =
    cycle === "90-day" ? GLP1_PHARMACY_POLICY.preferred90Day : GLP1_PHARMACY_POLICY.onlineDefault;

  const boomrx = boomrxWholesaleForTier(tier, cycle);
  const formulation = formulationWholesaleForTier(tier, cycle);

  const boomrxMargin = margin(websiteChargeUsd, boomrx.wholesaleUsd);
  boomrx.grossProfitUsd = boomrxMargin.profit;
  boomrx.marginPct = boomrxMargin.pct;

  if (formulation) {
    const fMargin = margin(websiteChargeUsd, formulation.wholesaleUsd);
    formulation.grossProfitUsd = fMargin.profit;
    formulation.marginPct = fMargin.pct;
  }

  return {
    tierId: tier.id,
    medication: tier.medication,
    doseLabel: tier.doseLabel,
    supplyCycle: cycle,
    supplyMonths: cycle === "90-day" ? 3 : 1,
    retailMonthlyUsd: tier.priceUsd,
    medSubtotalUsd: quote?.productUsd ?? tier.priceUsd * (cycle === "90-day" ? 3 : 1),
    shippingUsd: quote?.shippingUsd ?? GLP1_PHARMACY_POLICY.shippingUsd,
    websiteChargeUsd,
    preferredVendor,
    boomrx,
    formulation,
  };
}

export function buildGlp1MasterPriceList(): Glp1PriceListRow[] {
  const cycles: RxSupplyCycleId[] = ["30-day", "90-day"];
  const rows: Glp1PriceListRow[] = [];

  for (const tier of GLP1_ALL_DOSE_TIERS) {
    for (const cycle of cycles) {
      rows.push(buildTierRow(tier, cycle));
    }
  }

  return rows;
}

export type Glp1InsurancePriceRow = {
  tierId: string;
  label: string;
  supplyCycle: RxSupplyCycleId;
  retailMonthlyUsd: number;
  websiteChargeUsd: number;
  wholesaleUsd: null;
  grossProfitUsd: number;
  marginPct: number;
  note: string;
};

export function buildGlp1InsurancePriceRows(): Glp1InsurancePriceRow[] {
  const cycles: RxSupplyCycleId[] = ["30-day", "90-day"];
  return cycles.map((cycle) => {
    const supply = computeRxSupplyQuote({
      monthlyMedUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
      supplyCycle: cycle,
      lineBase: "GLP-1 insurance oversight",
      shippingUsd: 0,
    });
    return {
      tierId: GLP1_INSURANCE_OVERSIGHT.id,
      label: GLP1_INSURANCE_OVERSIGHT.label,
      supplyCycle: cycle,
      retailMonthlyUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
      websiteChargeUsd: supply.totalUsd,
      wholesaleUsd: null,
      grossProfitUsd: supply.totalUsd,
      marginPct: 100,
      note: "No medication COGS — client fills at insurance pharmacy",
    };
  });
}

export function glp1PriceListSummary(rows: Glp1PriceListRow[]): {
  tierCount: number;
  avgBoomrxMargin90: number | null;
  avgBoomrxMargin30: number | null;
} {
  const m90 = rows.filter((r) => r.supplyCycle === "90-day" && r.boomrx.marginPct != null);
  const m30 = rows.filter((r) => r.supplyCycle === "30-day" && r.boomrx.marginPct != null);
  const avg = (list: Glp1PriceListRow[]) =>
    list.length
      ? Math.round((list.reduce((s, r) => s + (r.boomrx.marginPct ?? 0), 0) / list.length) * 10) / 10
      : null;
  return {
    tierCount: GLP1_ALL_DOSE_TIERS.length,
    avgBoomrxMargin90: avg(m90),
    avgBoomrxMargin30: avg(m30),
  };
}

export function glp1PriceListToCsv(rows: Glp1PriceListRow[]): string {
  const header = [
    "Medication",
    "Dose",
    "Supply",
    "Retail/mo",
    "Website charge",
    "Shipping",
    "Preferred vendor",
    "BoomRx SKU",
    "BoomRx wholesale",
    "BoomRx profit",
    "BoomRx margin %",
    "Formulation SKU",
    "Formulation wholesale",
    "Formulation profit",
    "Formulation margin %",
  ].join(",");

  const lines = rows.map((r) =>
    [
      r.medication,
      `"${r.doseLabel}"`,
      r.supplyCycle,
      r.retailMonthlyUsd,
      r.websiteChargeUsd,
      r.shippingUsd,
      r.preferredVendor,
      r.boomrx.sku ?? "",
      r.boomrx.wholesaleUsd ?? "",
      r.boomrx.grossProfitUsd ?? "",
      r.boomrx.marginPct ?? "",
      r.formulation?.sku ?? "",
      r.formulation?.wholesaleUsd ?? "",
      r.formulation?.grossProfitUsd ?? "",
      r.formulation?.marginPct ?? "",
    ].join(","),
  );

  return [header, ...lines].join("\n");
}
