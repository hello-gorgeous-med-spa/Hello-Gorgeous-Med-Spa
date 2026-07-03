/**
 * In-clinic RE GEN catalog sales — peptides, wellness, hormones upsold at terminal.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  ALL_REGEN_PRICING,
  REGEN_SHIPPING_USD,
  getRegenProductPrice,
  type RegenProductPrice,
} from "@/lib/regen/pricing-sync";
import type {
  RxClinicClinical,
  RxClinicEncounterRow,
  RxClinicPharmacy,
  RxClinicPricingSnapshot,
} from "@/lib/rx-clinic-encounter";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type RxClinicSaleMode = "glp1" | "regen_catalog";

export type RxClinicLineItemInput = {
  productId: string;
  quantity?: number;
  supplyCycle?: RxSupplyCycleId;
};

export type RxClinicLineItem = {
  productId: string;
  name: string;
  category: string;
  quantity: number;
  supplyCycle: RxSupplyCycleId;
  unitPriceUsd: number;
  lineTotalUsd: number;
  priceLabel: string;
  rx: boolean;
  coldShip?: boolean;
  controlled?: boolean;
};

export type RxClinicRegenPricingSnapshot = {
  kind: "regen_catalog";
  lineItems: RxClinicLineItem[];
  subtotalUsd: number;
  shippingUsd: number;
  consultFeeUsd: number;
  listTotalUsd: number;
  discountUsd: number;
  discountReason?: string | null;
  discountAuthorizedBy?: string | null;
  finalTotalUsd: number;
};

export type SaveRegenClinicEncounterInput = {
  clientId: string;
  createdBy?: string | null;
  lineItems: RxClinicLineItemInput[];
  includeShipping?: boolean;
  consultFeeUsd?: number;
  discountUsd?: number;
  discountReason?: string | null;
  discountAuthorizedBy?: string | null;
  shipAddressLine1?: string | null;
  shipAddressLine2?: string | null;
  shipCity?: string | null;
  shipState?: string | null;
  shipZip?: string | null;
  pharmacy?: RxClinicPharmacy | null;
  sig?: string | null;
  clinical?: RxClinicClinical;
  staffNotes?: string | null;
  appointmentId?: string | null;
};

export const REGEN_CLINIC_CATALOG_GROUPS: {
  id: string;
  label: string;
  products: RegenProductPrice[];
}[] = [
  { id: "peptide-therapy", label: "Peptides", products: ALL_REGEN_PRICING.filter((p) => p.category === "peptide-therapy") },
  { id: "vitamins", label: "Daily wellness", products: ALL_REGEN_PRICING.filter((p) => p.category === "vitamins") },
  { id: "hormones", label: "Hormones", products: ALL_REGEN_PRICING.filter((p) => p.category === "hormones") },
  { id: "hair-skin", label: "Hair & skin", products: ALL_REGEN_PRICING.filter((p) => p.category === "hair-skin") },
  { id: "sexual-health", label: "Sexual health", products: ALL_REGEN_PRICING.filter((p) => p.category === "sexual-health") },
  { id: "weight-loss", label: "Weight loss add-ons", products: ALL_REGEN_PRICING.filter((p) => p.category === "weight-loss") },
];

function roundUsd(n: number): number {
  return Math.round(n * 100) / 100;
}

export function resolveRegenClinicLineItems(inputs: RxClinicLineItemInput[]): {
  lineItems: RxClinicLineItem[];
} | { error: string } {
  if (!inputs.length) return { error: "Add at least one RE GEN product" };

  const lineItems: RxClinicLineItem[] = [];

  for (const input of inputs) {
    const product = getRegenProductPrice(input.productId);
    if (!product) return { error: `Unknown product: ${input.productId}` };

    const quantity = Math.max(1, Math.min(12, Number(input.quantity) || 1));
    const supplyCycle: RxSupplyCycleId = input.supplyCycle === "90-day" ? "90-day" : "30-day";
    const unitPriceUsd =
      supplyCycle === "90-day" ? product.retail90 : product.retail30;
    const lineTotalUsd = roundUsd(unitPriceUsd * quantity);

    lineItems.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      quantity,
      supplyCycle,
      unitPriceUsd,
      lineTotalUsd,
      priceLabel: product.priceLabel,
      rx: product.rx,
      coldShip: product.coldShip,
      controlled: product.controlled,
    });
  }

  return { lineItems };
}

export function computeRegenClinicPricing(input: {
  lineItems: RxClinicLineItemInput[];
  includeShipping?: boolean;
  consultFeeUsd?: number;
  discountUsd?: number;
  discountReason?: string | null;
  discountAuthorizedBy?: string | null;
}): { snapshot: RxClinicRegenPricingSnapshot; lineItems: RxClinicLineItem[] } | { error: string } {
  const resolved = resolveRegenClinicLineItems(input.lineItems);
  if ("error" in resolved) return resolved;

  const subtotalUsd = roundUsd(resolved.lineItems.reduce((sum, li) => sum + li.lineTotalUsd, 0));
  const shippingUsd = input.includeShipping !== false ? REGEN_SHIPPING_USD : 0;
  const consultFeeUsd = roundUsd(Math.max(0, input.consultFeeUsd ?? 0));
  const listTotalUsd = roundUsd(subtotalUsd + shippingUsd + consultFeeUsd);
  const discountUsd = roundUsd(Math.max(0, input.discountUsd ?? 0));

  if (discountUsd > listTotalUsd) return { error: "Discount cannot exceed list total" };
  if (discountUsd > 0 && !String(input.discountReason || "").trim()) {
    return { error: "Discount reason is required for owner override" };
  }

  const finalTotalUsd = roundUsd(listTotalUsd - discountUsd);

  return {
    lineItems: resolved.lineItems,
    snapshot: {
      kind: "regen_catalog",
      lineItems: resolved.lineItems,
      subtotalUsd,
      shippingUsd,
      consultFeeUsd,
      listTotalUsd,
      discountUsd,
      discountReason: input.discountReason?.trim() || null,
      discountAuthorizedBy: input.discountAuthorizedBy?.trim() || null,
      finalTotalUsd,
    },
  };
}

export function regenClinicPrimaryTrack(lineItems: RxClinicLineItem[]): "peptide" | "glp1" | "unknown" {
  const categories = new Set(lineItems.map((li) => li.category));
  if (categories.has("peptide-therapy") || categories.has("vitamins")) return "peptide";
  if (categories.has("weight-loss")) return "glp1";
  return "peptide";
}

export function regenClinicEncounterTitle(row: Pick<RxClinicEncounterRow, "sale_mode" | "medication" | "line_items">): string {
  if (row.sale_mode !== "regen_catalog") {
    return row.medication || "Clinic RX sale";
  }
  const items = Array.isArray(row.line_items) ? row.line_items : [];
  if (!items.length) return "RE GEN in-clinic sale";
  const names = items.slice(0, 2).map((i) => i.name);
  const suffix = items.length > 2 ? ` +${items.length - 2} more` : "";
  return `RE GEN · ${names.join(", ")}${suffix}`;
}

export function formatRegenClinicDispatchPreview(
  row: RxClinicEncounterRow,
  clientName: string,
): string {
  const items = Array.isArray(row.line_items) ? (row.line_items as RxClinicLineItem[]) : [];
  const lines = [
    `Patient: ${clientName}`,
    `RE GEN in-clinic sale · Ref CL-${row.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    "",
    "Products:",
    ...items.map(
      (li) =>
        `  • ${li.name} × ${li.quantity} (${li.supplyCycle}) — $${li.lineTotalUsd.toFixed(2)}`,
    ),
    row.shipping_usd > 0 ? `Shipping: $${row.shipping_usd.toFixed(2)}` : null,
    `Total charged: $${row.final_total_usd.toFixed(2)}`,
    "",
    `Ship to: ${row.ship_address_line1 || ""}${row.ship_address_line2 ? `, ${row.ship_address_line2}` : ""}`,
    `${row.ship_city || ""}, ${row.ship_state || "IL"} ${row.ship_zip || ""}`.trim(),
    row.pharmacy ? `Pharmacy: ${row.pharmacy}` : "Pharmacy: TBD",
    row.sig ? `Sig: ${row.sig}` : null,
    row.staff_notes ? `Notes: ${row.staff_notes}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function insertRegenClinicEncounter(
  input: SaveRegenClinicEncounterInput,
  client?: SupabaseClient | null,
): Promise<{ row: RxClinicEncounterRow } | { error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { error: "Database unavailable" };

  const pricing = computeRegenClinicPricing({
    lineItems: input.lineItems,
    includeShipping: input.includeShipping !== false,
    consultFeeUsd: input.consultFeeUsd,
    discountUsd: input.discountUsd,
    discountReason: input.discountReason,
    discountAuthorizedBy: input.discountAuthorizedBy,
  });
  if ("error" in pricing) return { error: pricing.error };

  const primary = pricing.lineItems[0]!;
  const supplyCycle = pricing.lineItems.length === 1 ? primary.supplyCycle : "30-day";

  const pricingSnapshot: RxClinicPricingSnapshot & RxClinicRegenPricingSnapshot = {
    quote: null,
    consultFeeUsd: pricing.snapshot.consultFeeUsd,
    listTotalUsd: pricing.snapshot.listTotalUsd,
    discountUsd: pricing.snapshot.discountUsd,
    discountReason: pricing.snapshot.discountReason,
    discountAuthorizedBy: pricing.snapshot.discountAuthorizedBy,
    finalTotalUsd: pricing.snapshot.finalTotalUsd,
    ...pricing.snapshot,
  };

  const row = {
    client_id: input.clientId,
    created_by: input.createdBy?.trim() || null,
    encounter_type: "regen_in_clinic",
    sale_mode: "regen_catalog",
    medication: primary.name,
    dose_tier_id: pricing.lineItems.length > 1 ? "multi" : primary.productId,
    dose_label:
      pricing.lineItems.length > 1
        ? `${pricing.lineItems.length} products`
        : primary.priceLabel,
    supply_cycle: supplyCycle,
    line_items: pricing.lineItems,
    shipping_usd: pricing.snapshot.shippingUsd,
    list_total_usd: pricing.snapshot.listTotalUsd,
    consult_fee_usd: pricing.snapshot.consultFeeUsd,
    discount_usd: pricing.snapshot.discountUsd,
    discount_reason: pricing.snapshot.discountReason,
    discount_authorized_by: pricing.snapshot.discountAuthorizedBy,
    final_total_usd: pricing.snapshot.finalTotalUsd,
    pricing_snapshot: pricingSnapshot,
    ship_address_line1: input.shipAddressLine1?.trim() || null,
    ship_address_line2: input.shipAddressLine2?.trim() || null,
    ship_city: input.shipCity?.trim() || null,
    ship_state: input.shipState?.trim() || "IL",
    ship_zip: input.shipZip?.trim() || null,
    pharmacy: input.pharmacy ?? "boomrx",
    sig: input.sig?.trim() || null,
    clinical: input.clinical ?? {},
    staff_notes: input.staffNotes?.trim() || null,
    appointment_id: input.appointmentId ?? null,
    status: "draft",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin
    .from("hg_rx_clinic_encounters")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    if (error.code === "42P01") return { error: "Clinic encounters table not migrated yet" };
    return { error: error.message };
  }

  return { row: data as unknown as RxClinicEncounterRow };
}
