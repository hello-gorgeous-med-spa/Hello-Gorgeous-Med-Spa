import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type PharmacyVendorKey = "formulation" | "boomrx" | "olympia";

export type PharmacyShipmentStatus =
  | "queued"
  | "submitted"
  | "processing"
  | "shipped"
  | "delivered"
  | "failed";

export type PharmacyShipmentRow = {
  id: string;
  request_kind: RxOpsRequestKind;
  request_id: string;
  prescription_id: string | null;
  patient_name: string;
  patient_email: string | null;
  patient_phone: string | null;
  pharmacy: string;
  pharmacy_key: PharmacyVendorKey;
  product_label: string | null;
  compound: string | null;
  sig: string | null;
  ship_to: Record<string, unknown> | null;
  status: PharmacyShipmentStatus;
  external_order_id: string | null;
  tracking_number: string | null;
  carrier: string | null;
  last_sync_at: string | null;
  last_error: string | null;
  submitted_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EnqueuePharmacyShipmentInput = {
  requestKind: RxOpsRequestKind;
  requestId: string;
  prescriptionId?: string | null;
  patientName: string;
  patientEmail?: string | null;
  patientPhone?: string | null;
  pharmacyLabel: string;
  productLabel?: string | null;
  compound?: string | null;
  sig?: string | null;
  shipTo?: Record<string, unknown> | null;
};

export const PHARMACY_SHIPMENT_STATUS_LABELS: Record<PharmacyShipmentStatus, string> = {
  queued: "Queued for pharmacy",
  submitted: "Submitted to pharmacy",
  processing: "Pharmacy processing",
  shipped: "Shipped",
  delivered: "Delivered",
  failed: "Submission failed",
};
