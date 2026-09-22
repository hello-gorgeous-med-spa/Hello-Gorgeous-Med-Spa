/**
 * Place a RE GEN order at Formulation via FormuConnect POST /orders.
 * Staff-only. Charges the clinic card on file / net terms.
 */

import {
  isFormuConnectConfigured,
  isFormuConnectLiveSubmitEnabled,
  submitFormuConnectOrder,
  type FormuConnectOrderRequest,
  type FormuConnectOrderResponse,
  type FormuConnectPatient,
} from "@/lib/formuconnect";
import { PRESCRIBING_NP } from "@/lib/medical-authority";
import {
  BOOMRX_PHARMACY_LABEL,
  resolveFormulationTicket,
} from "@/lib/regen/formulation-dispatch";
import type { RegenFulfillmentOrder } from "@/lib/regen/order-fulfillment-predicates";
import { SITE } from "@/lib/seo";

export type FormuConnectPlaceResult =
  | {
      ok: true;
      alreadyPlaced?: boolean;
      response: FormuConnectOrderResponse;
      orderNumbers: string[];
      batchNumber?: string;
    }
  | { ok: false; error: string };

const INTAKE_FORMUCONNECT_KEY = "formuconnect";

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function intakeOf(order: RegenFulfillmentOrder): Record<string, unknown> {
  return order.intake_data && typeof order.intake_data === "object" ? order.intake_data : {};
}

export function readFormuConnectReceipt(
  order: RegenFulfillmentOrder,
): { batchNumber?: string; orderNumbers: string[]; submittedAt?: string } | null {
  const raw = intakeOf(order)[INTAKE_FORMUCONNECT_KEY];
  if (!raw || typeof raw !== "object") return null;
  const rec = raw as Record<string, unknown>;
  const orderNumbers = Array.isArray(rec.orderNumbers)
    ? rec.orderNumbers.map((n) => str(n)).filter(Boolean)
    : [];
  const batchNumber = str(rec.batchNumber) || undefined;
  if (!orderNumbers.length && !batchNumber) return null;
  return {
    batchNumber,
    orderNumbers,
    submittedAt: str(rec.submittedAt) || undefined,
  };
}

function splitName(full: string): { first_name: string; last_name: string } | null {
  const parts = full.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (!parts.length) return null;
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function sexFrom(raw: string): FormuConnectPatient["sex"] | null {
  const v = raw.trim().toUpperCase();
  if (v === "F" || v === "FEMALE") return "F";
  if (v === "M" || v === "MALE") return "M";
  return null;
}

function dobFrom(raw: string): string {
  const v = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
  const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  }
  return v;
}

function addressFrom(order: RegenFulfillmentOrder): {
  address: string;
  city: string;
  state: string;
  zip: string;
} | null {
  const intake = intakeOf(order);
  const ship = (order.shipping_address && typeof order.shipping_address === "object"
    ? order.shipping_address
    : {}) as Record<string, unknown>;
  const address =
    str(ship.line1) ||
    str(ship.address_line_1) ||
    str(intake.shipping_street) ||
    str(intake.street);
  const city = str(ship.city) || str(intake.shipping_city) || str(intake.city);
  const state = str(ship.state) || str(intake.shipping_state) || str(intake.state) || "IL";
  const zip =
    str(ship.postalCode) ||
    str(ship.postal_code) ||
    str(intake.shipping_zip) ||
    str(intake.zip);
  if (!address || !city || !zip) return null;
  const line2 = str(ship.line2) || str(intake.shipping_street2);
  return {
    address: line2 ? `${address}, ${line2}` : address,
    city,
    state,
    zip,
  };
}

export function buildFormuConnectOrderFromRegen(
  order: RegenFulfillmentOrder,
): { ok: true; request: FormuConnectOrderRequest } | { ok: false; error: string } {
  const ticket = resolveFormulationTicket({
    orderRef: order.reference,
    goal: order.goal,
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    items: order.items,
    intakeData: order.intake_data,
    shippingAddress: order.shipping_address,
    allergies: order.allergies,
  });
  if (ticket.pharmacy === BOOMRX_PHARMACY_LABEL) {
    return {
      ok: false,
      error: "This line is BoomRx — paste it in the BoomRx portal. FormuConnect cannot take it.",
    };
  }
  if (ticket.status !== "ready") {
    return {
      ok: false,
      error: "Ryan must pick the Formulation SKU on this ticket before we can send it.",
    };
  }

  const items = ticket.lines
    .filter((line) => str(line.sku))
    .map((line) => ({
      sku: String(line.sku),
      quantity: line.quantity || 1,
      sig: line.sig || `Use as directed by ${PRESCRIBING_NP.displayName}`,
      prescriber_notes: line.packDescription || undefined,
    }));
  if (!items.length) {
    return { ok: false, error: "No Formulation SKU on this ticket yet." };
  }

  const intake = intakeOf(order);
  const name = splitName(str(order.customer_name) || str(intake.confirm_name) || str(intake.full_name));
  if (!name) return { ok: false, error: "Patient first and last name are required." };

  const dob = dobFrom(str(intake.dob) || str(intake.dateOfBirth) || ticket.patient.dob);
  if (!dob) return { ok: false, error: "Patient date of birth is required from intake." };

  const sex = sexFrom(str(intake.sex) || str(intake.gender));
  if (!sex) {
    return {
      ok: false,
      error: "Intake sex must be Female or Male before Formulation will accept the order.",
    };
  }

  const addr = addressFrom(order);
  if (!addr) {
    return {
      ok: false,
      error: "Ship-to street, city, and ZIP are required. Sync from Square or complete intake first.",
    };
  }

  const phone = str(order.customer_phone) || str(intake.confirm_phone) || ticket.patient.phone;
  if (!phone) return { ok: false, error: "Patient phone is required." };

  const cold = ticket.lines.some((line) => line.coldShip);
  const npi = str(process.env.FORMUCONNECT_PHYSICIAN_NPI);
  const dea = str(process.env.FORMUCONNECT_PHYSICIAN_DEA);

  return {
    ok: true,
    request: {
      patient: {
        first_name: name.first_name,
        last_name: name.last_name,
        dob,
        sex,
        phone,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        zip: addr.zip,
      },
      items,
      diagnosis: {
        clinical_notes: [
          str(order.np_notes),
          ticket.notes.join(" · "),
          `RE GEN ${order.reference}`,
        ]
          .filter(Boolean)
          .join(" — ")
          .slice(0, 2000),
      },
      physician: {
        first_name: str(process.env.FORMUCONNECT_PHYSICIAN_FIRST_NAME) || "Ryan",
        last_name: str(process.env.FORMUCONNECT_PHYSICIAN_LAST_NAME) || "Kent",
        npi: npi || undefined,
        dea: dea || undefined,
        phone: SITE.phone,
      },
      supervising_physician: {
        first_name: "Mukesh",
        last_name: "Arora",
        phone: SITE.phone,
      },
      shipping: {
        ship_to: "patient",
        method: cold ? "next_day" : "ground",
      },
      vendor_order_id: order.reference,
    },
  };
}

export async function placeFormuConnectFromRegenOrder(
  order: RegenFulfillmentOrder,
): Promise<FormuConnectPlaceResult> {
  if (!isFormuConnectLiveSubmitEnabled()) {
    return {
      ok: false,
      error: "Live submit is off. Set RX_PHARMACY_API_ENABLED=true on the server.",
    };
  }
  if (!isFormuConnectConfigured()) {
    return { ok: false, error: "FormuConnect API key is missing on this server." };
  }

  const existing = readFormuConnectReceipt(order);
  if (existing) {
    return {
      ok: true,
      alreadyPlaced: true,
      response: {
        ok: true,
        batch_number: existing.batchNumber,
        vendor_order_id: order.reference,
        orders: existing.orderNumbers.map((order_number) => ({ order_number })),
      },
      orderNumbers: existing.orderNumbers,
      batchNumber: existing.batchNumber,
    };
  }

  const built = buildFormuConnectOrderFromRegen(order);
  if (!built.ok) return built;

  try {
    const response = await submitFormuConnectOrder(built.request);
    if (response.ok === false || (Array.isArray(response.errors) && response.errors.length)) {
      return {
        ok: false,
        error: response.errors?.join("; ") || "FormuConnect rejected the order",
      };
    }
    const orderNumbers = (response.orders || []).map((o) => o.order_number).filter(Boolean);
    return {
      ok: true,
      response,
      orderNumbers,
      batchNumber: response.batch_number,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "FormuConnect submit failed",
    };
  }
}

export function mergeFormuConnectReceipt(
  existing: Record<string, unknown> | null | undefined,
  result: Extract<FormuConnectPlaceResult, { ok: true }>,
): Record<string, unknown> {
  return {
    ...(existing || {}),
    [INTAKE_FORMUCONNECT_KEY]: {
      submittedAt: new Date().toISOString(),
      batchNumber: result.batchNumber || null,
      orderNumbers: result.orderNumbers,
      vendorOrderId: result.response.vendor_order_id || null,
      alreadyPlaced: Boolean(result.alreadyPlaced),
    },
  };
}
