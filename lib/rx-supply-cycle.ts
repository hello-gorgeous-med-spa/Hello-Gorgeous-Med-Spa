/**
 * Hello Gorgeous RX™ — 30-day vs 90-day supply cycles.
 * 90-day prepay bundles medication + one cold-chain shipping fee per cycle.
 * Telehealth is required every 90 days (not monthly) unless dose/strength changes.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { PEPTIDE_PHARMACY_SHIPPING_USD } from "@/lib/peptide-retail-pricing";

export type RxSupplyCycleId = "30-day" | "90-day";

export type RxSupplyCycle = {
  id: RxSupplyCycleId;
  label: string;
  shortLabel: string;
  monthsPerCycle: number;
  /** Days between required NP telehealth visits when stable on dose */
  telehealthCadenceDays: number;
  shippingChargesPerCycle: number;
};

export const RX_SUPPLY_CYCLES: Record<RxSupplyCycleId, RxSupplyCycle> = {
  "30-day": {
    id: "30-day",
    label: "30-day supply — pay & ship monthly",
    shortLabel: "Monthly",
    monthsPerCycle: 1,
    telehealthCadenceDays: 90,
    shippingChargesPerCycle: 1,
  },
  "90-day": {
    id: "90-day",
    label: "90-day supply — 3 months + one shipping fee",
    shortLabel: "Every 3 months",
    monthsPerCycle: 3,
    telehealthCadenceDays: 90,
    shippingChargesPerCycle: 1,
  },
};

export const RX_TELEHEALTH_CADENCE_DAYS = 90;

export const RX_SUPPLY_CYCLE_FIELD_OPTIONS = [
  RX_SUPPLY_CYCLES["90-day"].label,
  RX_SUPPLY_CYCLES["30-day"].label,
] as const;

export function parseRxSupplyCycle(raw: unknown): RxSupplyCycleId {
  const s = String(raw || "").trim();
  if (s.includes("90") || s === "90-day") return "90-day";
  return "30-day";
}

export function rxSupplyCycleFromField(raw: unknown): RxSupplyCycle {
  return RX_SUPPLY_CYCLES[parseRxSupplyCycle(raw)];
}

export type RxSupplyQuoteInput = {
  monthlyMedUsd: number;
  supplyCycle: RxSupplyCycleId;
  lineBase: string;
  shippingUsd?: number;
};

export type RxSupplyQuote = {
  supplyCycle: RxSupplyCycleId;
  months: number;
  monthlyMedUsd: number;
  medicationSubtotalUsd: number;
  shippingUsd: number;
  shippingCount: number;
  totalUsd: number;
  lineLabel: string;
  priceLabel: string;
  savingsNote?: string;
};

export function computeRxSupplyQuote(input: RxSupplyQuoteInput): RxSupplyQuote {
  const cycle = RX_SUPPLY_CYCLES[input.supplyCycle];
  const shippingUnit = input.shippingUsd ?? PEPTIDE_PHARMACY_SHIPPING_USD;
  const medicationSubtotalUsd = input.monthlyMedUsd * cycle.monthsPerCycle;
  const shippingCount = cycle.shippingChargesPerCycle;
  const shippingUsd = shippingUnit * shippingCount;
  const totalUsd = medicationSubtotalUsd + shippingUsd;

  const monthlyAltShipping = shippingUnit * cycle.monthsPerCycle;
  const savingsNote =
    input.supplyCycle === "90-day" && monthlyAltShipping > shippingUsd
      ? `Save $${monthlyAltShipping - shippingUsd} on shipping vs three monthly shipments`
      : undefined;

  const periodLabel =
    cycle.monthsPerCycle === 1 ? "1 mo" : `${cycle.monthsPerCycle} mo`;

  return {
    supplyCycle: cycle.id,
    months: cycle.monthsPerCycle,
    monthlyMedUsd: input.monthlyMedUsd,
    medicationSubtotalUsd,
    shippingUsd,
    shippingCount,
    totalUsd,
    lineLabel: `${input.lineBase} (${periodLabel}${shippingUsd > 0 ? " + shipping" : ""})`,
    priceLabel:
      cycle.monthsPerCycle === 1
        ? `$${totalUsd}/mo`
        : `$${totalUsd} / ${cycle.monthsPerCycle} mo`,
    savingsNote,
  };
}

export function rxTelehealthDueCopy(supplyCycle: RxSupplyCycleId = "90-day"): string {
  void supplyCycle;
  return `90-day supply and 3-month monthly auto-pay do not require telehealth for that order. After your cycle, a $${PROGRAM_CONSULT_FEE_USD} telehealth check-in is required before your next reorder. Single-month 30-day refills may require telehealth if you have not checked in within ${RX_TELEHEALTH_CADENCE_DAYS} days.`;
}

export function doseChangeRequiresTelehealth(data: Record<string, unknown>): boolean {
  if (data.dose_changes === "Yes") return true;
  if (data.current_medication === "Other / switching — discuss with NP") return true;
  return false;
}
