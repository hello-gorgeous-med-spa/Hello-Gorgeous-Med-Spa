/**
 * GLP-1 pharmacy fulfillment — vials to order per paid RX (clinic + online).
 * BoomRx tailored pricing (PDF) + Formulation SKU packs (2498–2502).
 */

import { boomRxOrderLine, pickBoomRxGlp1Pack, type BoomRxGlp1Pack } from "@/lib/glp1-boomrx-catalog";
import {
  formulationOrderLine,
  pickFormulationTirzInjectablePack,
  type FormulationGlp1Pack,
} from "@/lib/glp1-formulation-catalog";
import {
  glp1DoseTierById,
  type Glp1DoseTier,
  type Glp1MedicationType,
} from "@/lib/glp1-dose-tiers";
import type { RxPharmacy } from "@/lib/rx-dispatch";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type Glp1VialFulfillment = {
  medication: string;
  doseTierId: string;
  doseLabel: string;
  supplyCycle: RxSupplyCycleId;
  supplyMonths: number;
  vialsPer30Day: number;
  vialsToOrder: number;
  wholesaleCostPerVialUsd: number;
  totalWholesaleUsd: number;
  orderLine: string;
  pharmacyVendor: RxPharmacy | null;
  pharmacySku: string | null;
  pharmacyProduct: string | null;
  pharmacyPack: string | null;
  coldShip: boolean;
  shipNote: string | null;
};

export type Glp1VialOrderRollup = {
  key: string;
  medication: string;
  doseLabel: string;
  doseTierId: string;
  pharmacyVendor: RxPharmacy | null;
  pharmacySku: string | null;
  orderCount: number;
  totalVials: number;
  totalWholesaleUsd: number;
};

export type PharmacyOrderLine = {
  id: string;
  source: "online" | "clinic";
  orderedAt: string;
  patientName: string;
  intakeRef: string;
  medication: string;
  doseTierId: string | null;
  doseLabel: string | null;
  supplyCycle: RxSupplyCycleId;
  pharmacy: RxPharmacy | null;
  dispatchStatus: string;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  fulfillment: Glp1VialFulfillment | null;
  fulfillmentError?: string;
};

function vialsForSupplyCycle(tier: Glp1DoseTier, supplyCycle: RxSupplyCycleId): number {
  const months = supplyCycle === "90-day" ? 3 : 1;
  return tier.vialsPer30Day * months;
}

function fulfillmentFromFormulationPack(
  tier: Glp1DoseTier,
  supplyCycle: RxSupplyCycleId,
  supplyMonths: number,
  pack: FormulationGlp1Pack,
): Glp1VialFulfillment {
  const periodLabel = supplyMonths === 1 ? "30-day" : "90-day";
  return {
    medication: tier.medication,
    doseTierId: tier.id,
    doseLabel: tier.doseLabel,
    supplyCycle,
    supplyMonths,
    vialsPer30Day: tier.vialsPer30Day,
    vialsToOrder: pack.vialCount,
    wholesaleCostPerVialUsd: pack.wholesaleUsd / pack.vialCount,
    totalWholesaleUsd: pack.wholesaleUsd,
    pharmacyVendor: "formulation",
    pharmacySku: pack.sku,
    pharmacyProduct: pack.productName,
    pharmacyPack: pack.packDescription,
    coldShip: pack.coldShip,
    shipNote: pack.shipNote,
    orderLine: `${formulationOrderLine(pack)} — ${tier.doseLabel} (${periodLabel} supply)`,
  };
}

function fulfillmentFromBoomRxPack(
  tier: Glp1DoseTier,
  supplyCycle: RxSupplyCycleId,
  supplyMonths: number,
  pack: BoomRxGlp1Pack,
): Glp1VialFulfillment {
  const periodLabel = supplyMonths === 1 ? "30-day" : "90-day";
  return {
    medication: tier.medication,
    doseTierId: tier.id,
    doseLabel: tier.doseLabel,
    supplyCycle,
    supplyMonths,
    vialsPer30Day: tier.vialsPer30Day,
    vialsToOrder: pack.vialCount,
    wholesaleCostPerVialUsd: pack.vialCount > 0 ? pack.wholesaleUsd / pack.vialCount : pack.wholesaleUsd,
    totalWholesaleUsd: pack.wholesaleUsd,
    pharmacyVendor: "boomrx",
    pharmacySku: pack.id,
    pharmacyProduct: pack.productName,
    pharmacyPack: pack.packDescription,
    coldShip: false,
    shipNote: "BoomRx portal order",
    orderLine: `${boomRxOrderLine(pack)} — ${tier.doseLabel} (${periodLabel} supply)`,
  };
}

function fulfillmentFromEstimate(
  tier: Glp1DoseTier,
  supplyCycle: RxSupplyCycleId,
  supplyMonths: number,
  vialsToOrder: number,
  pharmacy: RxPharmacy | null,
): Glp1VialFulfillment {
  const totalWholesaleUsd = vialsToOrder * tier.wholesaleCostPerVialUsd;
  const periodLabel = supplyMonths === 1 ? "30-day" : "90-day";
  return {
    medication: tier.medication,
    doseTierId: tier.id,
    doseLabel: tier.doseLabel,
    supplyCycle,
    supplyMonths,
    vialsPer30Day: tier.vialsPer30Day,
    vialsToOrder,
    wholesaleCostPerVialUsd: tier.wholesaleCostPerVialUsd,
    totalWholesaleUsd,
    pharmacyVendor: pharmacy,
    pharmacySku: null,
    pharmacyProduct: null,
    pharmacyPack: null,
    coldShip: false,
    shipNote: null,
    orderLine: `Order ${vialsToOrder} vial${vialsToOrder === 1 ? "" : "s"} — ${tier.medication} ${tier.doseLabel} (${periodLabel} · est. $${totalWholesaleUsd} — confirm ${pharmacy ?? "pharmacy"} catalog)`,
  };
}

export function computeGlp1VialFulfillment(
  medication: string,
  doseTierId: string,
  supplyCycleRaw?: unknown,
  pharmacy: RxPharmacy = "boomrx",
): Glp1VialFulfillment | null {
  const med = String(medication || "").trim();
  const tierId = String(doseTierId || "").trim();
  if (!med || !tierId) return null;

  const tier = glp1DoseTierById(tierId);
  if (!tier || tier.medication !== med) return null;

  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  const supplyMonths = supplyCycle === "90-day" ? 3 : 1;
  const vialsToOrder = vialsForSupplyCycle(tier, supplyCycle);

  if (pharmacy === "boomrx") {
    const pack = pickBoomRxGlp1Pack(tierId, supplyCycle);
    if (pack) {
      return fulfillmentFromBoomRxPack(tier, supplyCycle, supplyMonths, pack);
    }
  }

  if (pharmacy === "formulation" && tier.medication === "Tirzepatide") {
    const pack = pickFormulationTirzInjectablePack(vialsToOrder);
    if (pack) {
      return fulfillmentFromFormulationPack(tier, supplyCycle, supplyMonths, pack);
    }
  }

  return fulfillmentFromEstimate(tier, supplyCycle, supplyMonths, vialsToOrder, pharmacy);
}

export function fulfillmentFromIntakeResponses(
  responses: Record<string, unknown>,
  pharmacy: RxPharmacy = "boomrx",
): Glp1VialFulfillment | null {
  const med = String(responses.current_medication || "").trim();
  const tierId = String(responses.refill_dose_tier || responses.dose_tier || "").trim();
  return computeGlp1VialFulfillment(med, tierId, responses.supply_cycle, pharmacy);
}

export function rollupPharmacyVialOrders(lines: PharmacyOrderLine[]): Glp1VialOrderRollup[] {
  const map = new Map<string, Glp1VialOrderRollup>();

  for (const line of lines) {
    if (!line.fulfillment) continue;
    const f = line.fulfillment;
    const key = `${f.pharmacyVendor ?? "?"}|${f.medication}|${f.doseTierId}|${f.pharmacySku ?? "est"}`;
    const existing = map.get(key);
    if (existing) {
      existing.orderCount += 1;
      existing.totalVials += f.vialsToOrder;
      existing.totalWholesaleUsd += f.totalWholesaleUsd;
    } else {
      map.set(key, {
        key,
        medication: f.medication,
        doseLabel: f.doseLabel,
        doseTierId: f.doseTierId,
        pharmacyVendor: f.pharmacyVendor,
        pharmacySku: f.pharmacySku,
        orderCount: 1,
        totalVials: f.vialsToOrder,
        totalWholesaleUsd: f.totalWholesaleUsd,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.medication.localeCompare(b.medication) || a.doseLabel.localeCompare(b.doseLabel),
  );
}

export function pharmacyOrderSheetTotals(lines: PharmacyOrderLine[]): {
  orderCount: number;
  totalVials: number;
  totalWholesaleUsd: number;
} {
  let orderCount = 0;
  let totalVials = 0;
  let totalWholesaleUsd = 0;
  for (const line of lines) {
    if (!line.fulfillment) continue;
    orderCount += 1;
    totalVials += line.fulfillment.vialsToOrder;
    totalWholesaleUsd += line.fulfillment.totalWholesaleUsd;
  }
  return { orderCount, totalVials, totalWholesaleUsd };
}

export function isInjectableGlp1Medication(med: string): med is Glp1MedicationType {
  return med === "Semaglutide" || med === "Tirzepatide";
}
