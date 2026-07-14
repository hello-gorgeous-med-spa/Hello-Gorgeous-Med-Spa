/**
 * FormuConnect-style display pipeline over Hello Gorgeous order statuses.
 * Does not change stored statuses — UI aliases only.
 */

export const RX_PORTAL_PIPELINE_STEPS = [
  "Processing",
  "Compounding",
  "Verified",
  "Completed",
  "Shipped",
] as const;

export type RxPortalPipelineStep = (typeof RX_PORTAL_PIPELINE_STEPS)[number];

export type RxPortalOrderSignals = {
  status: string;
  paidAt?: string | null;
  npApprovedAt?: string | null;
  pharmacyOrderedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  trackingNumber?: string | null;
  /** pharmacy shipment status if joined */
  pharmacyShipmentStatus?: string | null;
};

/** Highest completed step index (0–4). -1 = not started / pending payment. */
export function rxPortalPipelineIndex(signals: RxPortalOrderSignals): number {
  const status = (signals.status || "").toLowerCase();
  if (status === "pending_payment" || status === "cancelled") return -1;

  if (
    signals.deliveredAt ||
    signals.shippedAt ||
    status === "shipped" ||
    status === "delivered" ||
    signals.pharmacyShipmentStatus === "shipped" ||
    signals.pharmacyShipmentStatus === "delivered"
  ) {
    return 4; // Shipped
  }

  const pharmacy = (signals.pharmacyShipmentStatus || "").toLowerCase();
  if (pharmacy === "processing" || pharmacy === "compounding") {
    // Compounding done when verified progresses further
  }

  if (
    signals.pharmacyOrderedAt ||
    status === "ordered" ||
    pharmacy === "submitted" ||
    pharmacy === "queued"
  ) {
    // Ready for ship / pharmacy completed line → Completed (index 3) if approved
    if (signals.npApprovedAt || status === "approved" || status === "ordered") {
      return 3; // Completed (ready)
    }
    return 1; // Compounding / in pharmacy queue
  }

  if (signals.npApprovedAt || status === "approved") {
    return 2; // Verified
  }

  if (pharmacy === "processing") {
    return 1; // Compounding
  }

  if (signals.paidAt || status === "paid" || status === "intake_complete") {
    return 0; // Processing
  }

  return 0;
}

export function rxPortalPipelineStepsReached(signals: RxPortalOrderSignals): boolean[] {
  const idx = rxPortalPipelineIndex(signals);
  return RX_PORTAL_PIPELINE_STEPS.map((_, i) => idx >= i);
}

export function rxPortalShipLabel(signals: {
  shippingAddress?: Record<string, unknown> | null;
  salesChannel?: string | null;
}): string {
  const channel = (signals.salesChannel || "").toLowerCase();
  if (channel.includes("clinic") || channel.includes("office")) return "OFFICE";
  if (signals.shippingAddress) return "PATIENT";
  return "PATIENT";
}
