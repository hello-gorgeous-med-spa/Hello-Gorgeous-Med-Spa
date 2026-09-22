/**
 * Pharmacy fulfillment adapters (HGRX-040 Formulation, HGRX-041 BoomRx, HGRX-042 Olympia).
 *
 * Formulation live submit: `/admin/rx/regen-orders/[ref]` → Send to Formulation.
 * This adapter only places a shipment when it can load that RE GEN order.
 */

import { fetchRegenFulfillmentOrder } from "@/lib/regen/order-fulfillment";
import { placeFormuConnectFromRegenOrder } from "@/lib/regen/formuconnect-place";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import type { PharmacyShipmentRow } from "@/lib/rx-pharmacy-fulfillment/types";
import { vendorPortalUrl } from "@/lib/rx-pharmacy-fulfillment/pharmacy-key";

export type PharmacySubmitResult =
  | { ok: true; status: "submitted" | "processing"; externalOrderId?: string; manualPortalUrl?: string }
  | { ok: false; error: string };

/** True when live pharmacy API mode is on (credentials still required per vendor). */
export function isRxPharmacyApiEnabled(): boolean {
  return process.env.RX_PHARMACY_API_ENABLED === "true";
}

function formulationCredentialsPresent(): boolean {
  return Boolean(
    process.env.FORMULATION_API_KEY?.trim() ||
      process.env.FORMUCONNECT_API_KEY?.trim() ||
      process.env.FORMULATION_CLIENT_ID?.trim(),
  );
}

async function submitFormulation(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!isRxPharmacyApiEnabled()) {
    return {
      ok: true,
      status: "submitted",
      externalOrderId: `FRX-MANUAL-${order.request_id}`,
      manualPortalUrl: vendorPortalUrl("formulation") ?? undefined,
    };
  }

  if (!formulationCredentialsPresent()) {
    return {
      ok: false,
      error:
        "RX_PHARMACY_API_ENABLED is true but Formulation API credentials are missing (FORMUCONNECT_API_KEY)",
    };
  }

  if (order.request_kind !== "regen") {
    return {
      ok: false,
      error: "Open the RE GEN order and tap Send to Formulation. This shipment is not a RE GEN ticket.",
    };
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };
  const regen = await fetchRegenFulfillmentOrder(admin, order.request_id);
  if (!regen) {
    return { ok: false, error: `RE GEN order ${order.request_id} not found` };
  }

  const placed = await placeFormuConnectFromRegenOrder(regen);
  if (!placed.ok) return { ok: false, error: placed.error };
  return {
    ok: true,
    status: "submitted",
    externalOrderId: placed.orderNumbers[0] || placed.batchNumber,
  };
}

async function submitBoomRx(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  return {
    ok: true,
    status: "submitted",
    externalOrderId: `BRX-MANUAL-${order.request_id}`,
    manualPortalUrl: vendorPortalUrl("boomrx") ?? undefined,
  };
}

async function submitOlympia(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  return {
    ok: true,
    status: "submitted",
    externalOrderId: `OLY-MANUAL-${order.request_id}`,
    manualPortalUrl: vendorPortalUrl("olympia") ?? undefined,
  };
}

export async function submitPharmacyOrder(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  switch (order.pharmacy_key) {
    case "boomrx":
      return submitBoomRx(order);
    case "olympia":
      return submitOlympia(order);
    default:
      return submitFormulation(order);
  }
}

/**
 * Poll / sync tracking into `hg_rx_pharmacy_shipments`.
 * Phase 6: call vendor status API when enabled; until then no-op.
 */
export async function syncPharmacyShipmentStatus(
  order: PharmacyShipmentRow,
): Promise<{ status?: PharmacyShipmentRow["status"]; trackingNumber?: string; carrier?: string }> {
  if (!isRxPharmacyApiEnabled()) {
    return {};
  }
  // Live sync stub — implement webhook + poll per vendor once credentials land.
  void order;
  return {};
}
