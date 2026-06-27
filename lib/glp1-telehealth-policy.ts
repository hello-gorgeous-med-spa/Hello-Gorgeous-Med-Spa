/**
 * GLP-1 refill telehealth rules — payment first, ship after review.
 * 90-day prepay and 3-month monthly auto-pay waive telehealth for the current order.
 */

import { PROGRAM_CONSULT_FEE_USD } from "@/lib/flows";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

/** NP telehealth check-in required before the next reorder after a completed cycle. */
export const GLP1_REORDER_TELEHEALTH_FEE_USD = PROGRAM_CONSULT_FEE_USD;

export const GLP1_PAYMENT_FIRST_FINE_PRINT =
  "Payment is collected at checkout. We will reach out via email and text if a telehealth appointment is required before we ship your medication.";

export const GLP1_SUPPLY_CYCLE_TELEHEALTH_COPY = {
  "90-day":
    "90-day supply — prepay 3 months + one shipping fee. No telehealth required for this order.",
  "30-day":
    "30-day supply — pay monthly. Set up 3-month auto-pay after checkout to skip telehealth for this cycle.",
} as const;

export const GLP1_REORDER_TELEHEALTH_COPY = `After your 90-day supply or 3-month monthly program, a $${GLP1_REORDER_TELEHEALTH_FEE_USD} telehealth check-in with Ryan is required before your next reorder.`;

export type Glp1TelehealthRefillInput = {
  supplyCycleRaw?: unknown;
  lastVisitWithin90Days?: unknown;
  doseChanges?: unknown;
  sideEffects?: unknown;
  /** Patient chose monthly auto-pay (3-month commitment) on checkout */
  monthlyAutopayCommitment?: boolean;
};

/** 90-day prepay or 3-month monthly auto-pay — no telehealth gate for this shipment. */
export function glp1TelehealthWaivedForOrder(input: Glp1TelehealthRefillInput): boolean {
  const cycle = parseRxSupplyCycle(input.supplyCycleRaw ?? "90-day");
  if (cycle === "90-day") return true;
  if (input.monthlyAutopayCommitment) return true;
  return false;
}

/** Ryan must review before ship — dose change, side effects, or telehealth visit due (30-day only). */
export function glp1TelehealthRequiredBeforeShip(input: Glp1TelehealthRefillInput): boolean {
  if (String(input.doseChanges || "") === "Yes") return true;
  if (String(input.sideEffects || "") === "Yes") return true;
  if (glp1TelehealthWaivedForOrder(input)) return false;
  return String(input.lastVisitWithin90Days || "") !== "Yes";
}

export function glp1TelehealthProviderFlags(input: Glp1TelehealthRefillInput): string[] {
  const flags: string[] = [];
  if (String(input.doseChanges || "") === "Yes") {
    flags.push("Health or dose changes reported — NP telehealth before ship");
  }
  if (String(input.sideEffects || "") === "Yes") {
    flags.push("Reported side effects — NP review before ship");
  }
  if (glp1TelehealthRequiredBeforeShip(input)) {
    flags.push(
      `$${GLP1_REORDER_TELEHEALTH_FEE_USD} telehealth check-in required before ship — contact patient after payment`,
    );
  } else if (glp1TelehealthWaivedForOrder(input)) {
    flags.push("Telehealth waived for this order (90-day or 3-month monthly program)");
  }
  return flags;
}

export function glp1SupplyCycleLabel(cycle: RxSupplyCycleId): string {
  return cycle === "90-day" ? "90-day supply" : "30-day supply";
}
