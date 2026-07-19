/**
 * RE GEN monthly Square Subscription plans — popular peptide protocols.
 * Plan IDs are filled by scripts/square-upsert-peptide-subscription-plans.mjs
 * into data/peptide-subscription-plans.json and used by membership-checkout.
 */

import { PEPTIDE_PHARMACY_SHIPPING_USD, PEPTIDE_RETAIL_MENU } from "@/lib/peptide-retail-pricing";

export type PeptideSubscriptionPlanDef = {
  /** Matches membershipId suffix used by /api/peptide-refill/autopay */
  membershipId: string;
  /** rx-invoice-templates id for 30-day peptide line */
  templateId: string;
  name: string;
  /** Monthly charge (med + shipping) */
  priceDollars: number;
  retailId: string;
};

/** Popular protocols for monthly auto-pay (excludes GLP-1 / weight-loss rows). */
const FEATURED_RETAIL_IDS = [
  "sermorelin",
  "bpc-157",
  "tb-500",
  "ghk-cu",
  "nad-plus",
  "pt-141",
  "tesamorelin",
  "cjc-ipamorelin",
  "recovery-blend",
  "heal-blend",
  "sermorelin-troche",
  "bpc-157-caps",
] as const;

export function listPeptideSubscriptionPlanDefs(): PeptideSubscriptionPlanDef[] {
  const byId = new Map(PEPTIDE_RETAIL_MENU.map((r) => [r.id, r]));
  const defs: PeptideSubscriptionPlanDef[] = [];
  for (const retailId of FEATURED_RETAIL_IDS) {
    const row = byId.get(retailId);
    if (!row) continue;
    const templateId = `peptide-${row.id}`;
    defs.push({
      membershipId: `peptide-refill-${templateId}`,
      templateId,
      retailId: row.id,
      name: `RE GEN — ${row.name} (Monthly)`,
      priceDollars: row.fromMonthlyUsd + PEPTIDE_PHARMACY_SHIPPING_USD,
    });
  }
  return defs;
}

export type PeptideSubscriptionPlanIds = {
  planId: string;
  variationId: string;
  name: string;
  priceCents: number;
  templateId: string;
  membershipId: string;
};

export type PeptideSubscriptionPlanMap = Record<string, PeptideSubscriptionPlanIds>;
