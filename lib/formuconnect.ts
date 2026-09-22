/**
 * FormuConnect EMR Integration API — portal.formuconnect.com/api/docs (OAS 3.0, 1.0.0).
 *
 * Production: https://portal.formuconnect.com/api/v1
 * Auth: X-API-Key (admin-issued, tied to the provider account).
 * POST /orders charges the card on file (or invoices net-terms) and sends the Rx to PioneerRx.
 *
 * Live submit: RX_PHARMACY_API_ENABLED=true. Staff send from the RE GEN order
 * page after Ryan approves. POST /orders charges the clinic account.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export const FORMUCONNECT_API_BASE =
  process.env.FORMUCONNECT_API_URL?.replace(/\/$/, "") ||
  "https://portal.formuconnect.com/api/v1";

const FORMUCONNECT_API_KEY = process.env.FORMUCONNECT_API_KEY;

export type FormuConnectPatient = {
  first_name: string;
  last_name: string;
  dob: string;
  sex: "M" | "F";
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export type FormuConnectOrderItem = {
  sku: string;
  quantity: number;
  sig: string;
  prescriber_notes?: string;
};

export type FormuConnectPhysician = {
  first_name?: string;
  last_name: string;
  npi?: string;
  dea?: string;
  phone?: string;
  address?: string;
};

export type FormuConnectShipping = {
  ship_to: "office" | "patient";
  method?: "ground" | "next_day" | "two_day" | string;
};

export type FormuConnectOrderRequest = {
  patient: FormuConnectPatient;
  items: FormuConnectOrderItem[];
  diagnosis?: { icd10?: string; clinical_notes?: string };
  physician?: FormuConnectPhysician;
  supervising_physician?: FormuConnectPhysician;
  shipping?: FormuConnectShipping;
  vendor_order_id?: string;
};

export type FormuConnectOrderLine = {
  product?: string;
  sku?: string;
  quantity?: number;
  unit_price?: number;
  line_total?: number;
};

export type FormuConnectCreatedOrder = {
  order_number: string;
  patient_id?: string;
  patient?: string;
  items?: FormuConnectOrderLine[];
  subtotal?: number;
};

export type FormuConnectOrderResponse = {
  ok: boolean;
  batch_number?: string;
  vendor_order_id?: string;
  patient_id?: string;
  orders?: FormuConnectCreatedOrder[];
  shipping?: { method?: string; cost?: number };
  errors?: string[];
};

export function isFormuConnectConfigured(): boolean {
  return Boolean(FORMUCONNECT_API_KEY && FORMUCONNECT_API_KEY.length > 8);
}

export function isFormuConnectLiveSubmitEnabled(): boolean {
  return process.env.RX_PHARMACY_API_ENABLED === "true";
}

async function formuConnectRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!FORMUCONNECT_API_KEY) {
    throw new Error("FormuConnect API key not configured");
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${FORMUCONNECT_API_BASE}${path}`, {
    ...options,
    headers: {
      "X-API-Key": FORMUCONNECT_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  const data = (await response.json().catch(() => ({}))) as T & { errors?: string[]; ok?: boolean };
  if (!response.ok) {
    const detail = Array.isArray(data.errors) ? data.errors.join("; ") : JSON.stringify(data).slice(0, 400);
    throw new Error(`FormuConnect ${response.status}: ${detail || response.statusText}`);
  }
  return data;
}

export async function testFormuConnectConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const products = await formuConnectRequest<{ products?: unknown[] } | unknown[]>("/products");
    const count = Array.isArray(products)
      ? products.length
      : Array.isArray((products as { products?: unknown[] }).products)
        ? (products as { products: unknown[] }).products.length
        : 0;
    return { success: true, message: `Connected · ${count} product${count === 1 ? "" : "s"} on this key` };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export async function listFormuConnectProducts(): Promise<unknown> {
  return formuConnectRequest("/products");
}

export async function submitFormuConnectOrder(
  order: FormuConnectOrderRequest,
): Promise<FormuConnectOrderResponse> {
  if (!isFormuConnectLiveSubmitEnabled()) {
    throw new Error(
      "FormuConnect live submit is off. Copy the Formulation ticket into portal.formuconnect.com.",
    );
  }
  if (!order.patient?.first_name || !order.patient?.last_name || !order.patient?.dob) {
    throw new Error("Patient first_name, last_name, and dob are required");
  }
  if (!order.items?.length) {
    throw new Error("At least one item is required");
  }
  const badSku = order.items.filter((item) => !String(item.sku || "").trim());
  if (badSku.length) {
    throw new Error("Every item needs a FormuConnect SKU assigned to this account");
  }

  return formuConnectRequest<FormuConnectOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function getFormuConnectOrderStatus(identifier: string): Promise<unknown> {
  return formuConnectRequest(`/orders/${encodeURIComponent(identifier)}`);
}

export async function getFormuSyncRxStatus(rxNumber: string): Promise<unknown> {
  return formuConnectRequest(`/rx/${encodeURIComponent(rxNumber)}`);
}

/** X-FormuConnect-Signature: sha256=<hex> over the raw body. */
export function verifyFormuConnectWebhookSignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.FORMUCONNECT_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const hex = header.replace(/^sha256=/i, "").trim();
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(hex, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
