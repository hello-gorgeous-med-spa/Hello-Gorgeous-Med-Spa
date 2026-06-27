/**
 * GLP-1 refill tier pricing — maps medication + dose tier → monthly program price.
 * Keeps refill form, RX invoices, and staff alerts in sync with GLP1_PROGRAM tiers.
 */

import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";

export type Glp1RefillTierOption = {
  tier: string;
  label: string;
  priceUsd: number;
  invoiceTemplateId: string;
  lineLabel: string;
};

export type Glp1RefillQuote = {
  medication: string;
  tier: string;
  priceUsd: number;
  invoiceTemplateId: string;
  lineLabel: string;
  priceLabel: string;
};

const INJ = GLP1_PROGRAM.injectable;

export function formatGlp1RefillPriceUsd(amountUsd: number): string {
  return `$${amountUsd.toFixed(0)}`;
}

export function glp1RefillTierOptions(medication: string): Glp1RefillTierOption[] {
  if (medication === "Semaglutide") {
    return [
      {
        tier: "Monthly",
        label: `Semaglutide — monthly program (${formatGlp1RefillPriceUsd(INJ.semaglutideFromUsd)}/mo)`,
        priceUsd: INJ.semaglutideFromUsd,
        invoiceTemplateId: "glp1-sema-monthly",
        lineLabel: "Semaglutide injectable program (1 mo)",
      },
    ];
  }

  if (medication === "Tirzepatide") {
    return [
      {
        tier: "Starter",
        label: `Starter tier (${formatGlp1RefillPriceUsd(INJ.tirzepatideStarterUsd)}/mo)`,
        priceUsd: INJ.tirzepatideStarterUsd,
        invoiceTemplateId: "glp1-tirz-starter",
        lineLabel: "Tirzepatide injectable — starter tier (1 mo)",
      },
      {
        tier: "Standard",
        label: `Standard tier (${formatGlp1RefillPriceUsd(INJ.tirzepatideStandardUsd)}/mo)`,
        priceUsd: INJ.tirzepatideStandardUsd,
        invoiceTemplateId: "glp1-tirz-standard",
        lineLabel: "Tirzepatide injectable — standard tier (1 mo)",
      },
      {
        tier: "Advanced",
        label: `Advanced tier (${formatGlp1RefillPriceUsd(INJ.tirzepatideAdvancedUsd)}/mo)`,
        priceUsd: INJ.tirzepatideAdvancedUsd,
        invoiceTemplateId: "glp1-tirz-advanced",
        lineLabel: "Tirzepatide injectable — advanced tier (1 mo)",
      },
    ];
  }

  return [];
}

export function computeGlp1RefillQuote(
  medication: string,
  tier: string,
): Glp1RefillQuote | null {
  const med = String(medication || "").trim();
  const tierKey = String(tier || "").trim();
  if (!med || !tierKey) return null;

  const match = glp1RefillTierOptions(med).find((o) => o.tier === tierKey);
  if (!match) return null;

  return {
    medication: med,
    tier: match.tier,
    priceUsd: match.priceUsd,
    invoiceTemplateId: match.invoiceTemplateId,
    lineLabel: match.lineLabel,
    priceLabel: `${formatGlp1RefillPriceUsd(match.priceUsd)}/mo`,
  };
}

export function glp1RefillPricingRequiresTier(medication: string): boolean {
  return medication === "Semaglutide" || medication === "Tirzepatide";
}
