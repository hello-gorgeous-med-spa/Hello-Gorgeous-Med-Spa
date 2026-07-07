/**
 * Pharmacy fulfillment adapters (HGRX-040 Formulation, HGRX-041 BoomRx, HGRX-042 Olympia).
 *
 * API credentials are not wired yet — submissions queue for staff portal entry
 * and return a manual reference until FormuConnect / WellSync / Olympia APIs are configured.
 */

import type { PharmacyShipmentRow } from "@/lib/rx-pharmacy-fulfillment/types";
import { vendorPortalUrl } from "@/lib/rx-pharmacy-fulfillment/pharmacy-key";

export type PharmacySubmitResult =
  | { ok: true; status: "submitted" | "processing"; externalOrderId?: string; manualPortalUrl?: string }
  | { ok: false; error: string };

function manualModeEnabled(): boolean {
  return process.env.RX_PHARMACY_API_ENABLED !== "true";
}

async function submitFormulation(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!manualModeEnabled()) {
    return { ok: false, error: "FormuConnect API not configured — set RX_PHARMACY_API_ENABLED after credentials" };
  }
  return {
    ok: true,
    status: "submitted",
    externalOrderId: `FRX-MANUAL-${order.request_id}`,
    manualPortalUrl: vendorPortalUrl("formulation") ?? undefined,
  };
}

async function submitBoomRx(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!manualModeEnabled()) {
    return { ok: false, error: "BoomRx/WellSync API not configured — set RX_PHARMACY_API_ENABLED after credentials" };
  }
  return {
    ok: true,
    status: "submitted",
    externalOrderId: `BRX-MANUAL-${order.request_id}`,
    manualPortalUrl: vendorPortalUrl("boomrx") ?? undefined,
  };
}

async function submitOlympia(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!manualModeEnabled()) {
    return { ok: false, error: "Olympia API not configured — set RX_PHARMACY_API_ENABLED after credentials" };
  }
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

/** Poll adapter for status updates — stub until vendor webhooks land (HGRX-043). */
export async function syncPharmacyShipmentStatus(
  order: PharmacyShipmentRow,
): Promise<{ status?: PharmacyShipmentRow["status"]; trackingNumber?: string; carrier?: string }> {
  void order;
  return {};
}
