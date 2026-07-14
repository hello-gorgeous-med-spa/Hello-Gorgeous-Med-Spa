/**
 * Pharmacy fulfillment adapters (HGRX-040 Formulation, HGRX-041 BoomRx, HGRX-042 Olympia).
 *
 * Phase 6 (live API): when `RX_PHARMACY_API_ENABLED=true` and vendor credentials are present,
 * `submitFormulation` / BoomRx / Olympia call real APIs and `syncPharmacyShipmentStatus`
 * writes tracking into `hg_rx_pharmacy_shipments`. Until then, adapters return manual portal
 * URLs for staff to submit in FormuConnect / vendor portals.
 */

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

  // Phase 6 live path — wire FormuConnect / Formulation submit when credentials exist.
  if (!formulationCredentialsPresent()) {
    return {
      ok: false,
      error:
        "RX_PHARMACY_API_ENABLED is true but Formulation API credentials are missing (FORMULATION_API_KEY / FORMUCONNECT_API_KEY)",
    };
  }

  // Placeholder until vendor OpenAPI client is generated from their docs.
  return {
    ok: false,
    error:
      "Formulation live submit not implemented yet — keep RX_PHARMACY_API_ENABLED=false and use vendor portal until Phase 6 client lands",
  };
}

async function submitBoomRx(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!isRxPharmacyApiEnabled()) {
    return {
      ok: true,
      status: "submitted",
      externalOrderId: `BRX-MANUAL-${order.request_id}`,
      manualPortalUrl: vendorPortalUrl("boomrx") ?? undefined,
    };
  }
  return {
    ok: false,
    error: "BoomRx/WellSync live API not configured — set credentials after Phase 6",
  };
}

async function submitOlympia(order: PharmacyShipmentRow): Promise<PharmacySubmitResult> {
  if (!isRxPharmacyApiEnabled()) {
    return {
      ok: true,
      status: "submitted",
      externalOrderId: `OLY-MANUAL-${order.request_id}`,
      manualPortalUrl: vendorPortalUrl("olympia") ?? undefined,
    };
  }
  return {
    ok: false,
    error: "Olympia live API not configured — set credentials after Phase 6",
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
