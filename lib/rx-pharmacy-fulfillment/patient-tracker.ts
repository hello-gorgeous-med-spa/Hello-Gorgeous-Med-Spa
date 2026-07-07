import { getPharmacyShipmentForRequest } from "@/lib/rx-pharmacy-fulfillment/shipments";
import { PHARMACY_SHIPMENT_STATUS_LABELS } from "@/lib/rx-pharmacy-fulfillment/types";

export type PatientOrderTrackerStep = {
  id: string;
  label: string;
  detail: string;
  complete: boolean;
  current: boolean;
};

export async function buildRegenPatientTracker(orderRef: string): Promise<{
  steps: PatientOrderTrackerStep[];
  trackingNumber: string | null;
  pharmacy: string | null;
} | null> {
  const shipment = await getPharmacyShipmentForRequest("regen", orderRef);
  if (!shipment) return null;

  const order = [
    { id: "queued", key: "queued" as const },
    { id: "submitted", key: "submitted" as const },
    { id: "processing", key: "processing" as const },
    { id: "shipped", key: "shipped" as const },
    { id: "delivered", key: "delivered" as const },
  ];

  const rank: Record<string, number> = {
    queued: 0,
    submitted: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    failed: 0,
  };

  const currentRank = rank[shipment.status] ?? 0;

  const steps = order.map((step, idx) => ({
    id: step.id,
    label: PHARMACY_SHIPMENT_STATUS_LABELS[step.key],
    detail:
      step.key === "shipped" && shipment.tracking_number
        ? `Tracking ${shipment.tracking_number}`
        : step.key === "submitted"
          ? shipment.pharmacy
          : "",
    complete: currentRank > idx || shipment.status === "delivered",
    current: currentRank === idx && shipment.status !== "delivered",
  }));

  return {
    steps,
    trackingNumber: shipment.tracking_number,
    pharmacy: shipment.pharmacy,
  };
}
