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

export type RxPortalShipSpeed = "NEXTDAY" | "TWODAY" | "GROUND";
export type RxPortalShipDestination = "PATIENT" | "OFFICE";

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

  if (
    signals.pharmacyOrderedAt ||
    status === "ordered" ||
    pharmacy === "submitted" ||
    pharmacy === "queued"
  ) {
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

export function rxPortalShipDestination(signals: {
  shippingAddress?: Record<string, unknown> | null;
  salesChannel?: string | null;
}): RxPortalShipDestination {
  const channel = (signals.salesChannel || "").toLowerCase();
  if (channel.includes("clinic") || channel.includes("office")) return "OFFICE";
  if (signals.shippingAddress) return "PATIENT";
  return "PATIENT";
}

/** @deprecated Use rxPortalShipDestination — kept for older call sites */
export function rxPortalShipLabel(signals: {
  shippingAddress?: Record<string, unknown> | null;
  salesChannel?: string | null;
}): string {
  return rxPortalShipDestination(signals);
}

/** Flat $30 default → TWODAY; rush / higher ship fee → NEXTDAY. */
export function rxPortalShipSpeed(shippingUsd?: number | string | null): RxPortalShipSpeed {
  const fee = Number(shippingUsd ?? 30);
  if (Number.isFinite(fee) && fee >= 45) return "NEXTDAY";
  if (Number.isFinite(fee) && fee <= 15) return "GROUND";
  return "TWODAY";
}

/** Most recent pipeline timestamp for the footnote under the stepper. */
export function rxPortalStatusStamp(signals: RxPortalOrderSignals): string | null {
  const candidates = [
    signals.deliveredAt,
    signals.shippedAt,
    signals.pharmacyOrderedAt,
    signals.npApprovedAt,
    signals.paidAt,
  ].filter(Boolean) as string[];
  return candidates[0] ?? null;
}

export function formatRxPortalStatusTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

export function rxPortalTrackingUrl(trackingNumber: string | null | undefined): string | null {
  const tn = (trackingNumber || "").trim();
  if (!tn) return null;
  if (/^1Z/i.test(tn)) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`;
  }
  if (/^\d{12,22}$/.test(tn)) {
    return `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(`${tn} tracking`)}`;
}

export function rxPortalSourceLabel(pharmacySource?: string | null): string {
  const raw = (pharmacySource || "").trim();
  if (!raw) return "RE GEN";
  if (/formu|completerx|complete.?rx/i.test(raw)) return "CompleteRx";
  if (/boom/i.test(raw)) return "BoomRx";
  if (/olympia/i.test(raw)) return "Olympia";
  return raw.length > 24 ? `${raw.slice(0, 22)}…` : raw;
}
