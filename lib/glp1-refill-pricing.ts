/**
 * GLP-1 refill pricing — maps medication + weekly dose tier + supply cycle → invoice total.
 */

import {
  GLP1_INSURANCE_OVERSIGHT,
  glp1DoseTierById,
  glp1DoseTiersForMedication,
  type Glp1DoseTier,
} from "@/lib/glp1-dose-tiers";
import {
  computeRxSupplyQuote,
  parseRxSupplyCycle,
  type RxSupplyCycleId,
} from "@/lib/rx-supply-cycle";

export type Glp1RefillTierOption = {
  tier: string;
  label: string;
  doseLabel: string;
  priceUsd: number;
  invoiceTemplateId: string;
  lineLabel: string;
};

export type Glp1RefillQuote = {
  medication: string;
  tier: string;
  doseLabel: string;
  priceUsd: number;
  invoiceTemplateId: string;
  lineLabel: string;
  priceLabel: string;
  supplyCycle: RxSupplyCycleId;
  monthlyMedUsd: number;
  shippingUsd: number;
  savingsNote?: string;
};

export function formatGlp1RefillPriceUsd(amountUsd: number): string {
  return `$${amountUsd.toFixed(0)}`;
}

function tierToOption(tier: Glp1DoseTier): Glp1RefillTierOption {
  return {
    tier: tier.id,
    doseLabel: tier.doseLabel,
    label: `${tier.doseLabel} — ${formatGlp1RefillPriceUsd(tier.priceUsd)}/mo med`,
    priceUsd: tier.priceUsd,
    invoiceTemplateId: tier.invoiceTemplateId,
    lineLabel: `${tier.medication} ${tier.doseLabel} (1 mo)`,
  };
}

export function glp1RefillTierOptions(medication: string): Glp1RefillTierOption[] {
  if (medication === GLP1_INSURANCE_OVERSIGHT.label) {
    return [
      {
        tier: GLP1_INSURANCE_OVERSIGHT.id,
        doseLabel: "Medical oversight only",
        label: `Insurance oversight — ${formatGlp1RefillPriceUsd(GLP1_INSURANCE_OVERSIGHT.monthlyUsd)}/mo`,
        priceUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
        invoiceTemplateId: GLP1_INSURANCE_OVERSIGHT.invoiceTemplateId,
        lineLabel: GLP1_INSURANCE_OVERSIGHT.lineLabel,
      },
    ];
  }

  return glp1DoseTiersForMedication(medication).map(tierToOption);
}

export function computeGlp1RefillQuote(
  medication: string,
  tierId: string,
  supplyCycleRaw?: unknown,
): Glp1RefillQuote | null {
  const med = String(medication || "").trim();
  const tierKey = String(tierId || "").trim();
  const supplyCycle = parseRxSupplyCycle(supplyCycleRaw ?? "90-day");
  if (!med || !tierKey) return null;

  if (med === GLP1_INSURANCE_OVERSIGHT.label && tierKey === GLP1_INSURANCE_OVERSIGHT.id) {
    const supply = computeRxSupplyQuote({
      monthlyMedUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
      supplyCycle,
      lineBase: "GLP-1 insurance oversight",
      shippingUsd: 0,
    });
    return {
      medication: med,
      tier: tierKey,
      doseLabel: "Medical oversight only",
      priceUsd: supply.totalUsd,
      invoiceTemplateId: GLP1_INSURANCE_OVERSIGHT.invoiceTemplateId,
      lineLabel: supply.lineLabel,
      priceLabel: supply.priceLabel,
      supplyCycle,
      monthlyMedUsd: GLP1_INSURANCE_OVERSIGHT.monthlyUsd,
      shippingUsd: supply.shippingUsd,
      savingsNote: supply.savingsNote,
    };
  }

  const doseTier = glp1DoseTierById(tierKey);
  if (!doseTier || doseTier.medication !== med) return null;

  const supply = computeRxSupplyQuote({
    monthlyMedUsd: doseTier.priceUsd,
    supplyCycle,
    lineBase: `${doseTier.medication} ${doseTier.doseLabel}`,
  });

  return {
    medication: med,
    tier: doseTier.id,
    doseLabel: doseTier.doseLabel,
    priceUsd: supply.totalUsd,
    invoiceTemplateId: doseTier.invoiceTemplateId,
    lineLabel: supply.lineLabel,
    priceLabel: supply.priceLabel,
    supplyCycle,
    monthlyMedUsd: doseTier.priceUsd,
    shippingUsd: supply.shippingUsd,
    savingsNote: supply.savingsNote,
  };
}

export function glp1RefillPricingRequiresTier(medication: string): boolean {
  return (
    medication === "Semaglutide" ||
    medication === "Tirzepatide" ||
    medication === GLP1_INSURANCE_OVERSIGHT.label
  );
}

export { GLP1_INSURANCE_OVERSIGHT };
