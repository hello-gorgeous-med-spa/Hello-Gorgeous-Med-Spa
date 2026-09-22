import { NextRequest, NextResponse } from "next/server";
import {
  getFormuConnectOrderStatus,
  isFormuConnectConfigured,
  isFormuConnectLiveSubmitEnabled,
  submitFormuConnectOrder,
  type FormuConnectOrderRequest,
  type FormuConnectPatient,
} from "@/lib/formuconnect";

function asPatient(input: Record<string, unknown>): FormuConnectPatient | null {
  const addr = (input.address && typeof input.address === "object"
    ? (input.address as Record<string, unknown>)
    : {}) as Record<string, unknown>;
  const first =
    String(input.first_name || input.firstName || "").trim();
  const last = String(input.last_name || input.lastName || "").trim();
  const dob = String(input.dob || input.dateOfBirth || "").trim();
  const sexRaw = String(input.sex || "").trim().toUpperCase();
  const sex = sexRaw === "F" || sexRaw === "FEMALE" ? "F" : sexRaw === "M" || sexRaw === "MALE" ? "M" : "";
  const street = String(input.address_line || addr.street1 || addr.address || input.street || "").trim();
  const city = String(input.city || addr.city || "").trim();
  const state = String(input.state || addr.state || "").trim();
  const zip = String(input.zip || addr.zip || "").trim();
  const phone = String(input.phone || "").trim();
  if (!first || !last || !dob || !sex || !street || !city || !state || !zip) return null;
  return {
    first_name: first,
    last_name: last,
    dob,
    sex,
    phone,
    address: street,
    city,
    state,
    zip,
  };
}

/**
 * POST /api/regen/formuconnect/order
 * Blocked unless RX_PHARMACY_API_ENABLED=true.
 * Monday path: paste the ticket in FormuConnect — do not call this.
 */
export async function POST(request: NextRequest) {
  if (!isFormuConnectLiveSubmitEnabled()) {
    return NextResponse.json(
      {
        success: false,
        error: "FormuConnect live submit is off. Copy the Formulation ticket into the portal.",
      },
      { status: 503 },
    );
  }

  if (!isFormuConnectConfigured()) {
    return NextResponse.json(
      { success: false, error: "FormuConnect API not configured" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const patient = asPatient((body.patient as Record<string, unknown>) || {});
    if (!patient) {
      return NextResponse.json(
        {
          success: false,
          error: "Patient first_name, last_name, dob, sex, address, city, state, and zip are required",
        },
        { status: 400 },
      );
    }

    const rawItems = Array.isArray(body.items)
      ? body.items
      : Array.isArray(body.prescriptions)
        ? body.prescriptions
        : [];
    const items = rawItems.map((rx: Record<string, unknown>) => ({
      sku: String(rx.sku || rx.productId || "").trim(),
      quantity: Number(rx.quantity) || 1,
      sig: String(rx.sig || "Use as directed").trim(),
      prescriber_notes: rx.prescriber_notes ? String(rx.prescriber_notes) : undefined,
    }));
    if (!items.length || items.some((item) => !item.sku)) {
      return NextResponse.json(
        { success: false, error: "Every item needs a FormuConnect SKU assigned to this account" },
        { status: 400 },
      );
    }

    const physician = body.physician && typeof body.physician === "object"
      ? (body.physician as FormuConnectOrderRequest["physician"])
      : body.prescriberId
        ? { last_name: "Kent", npi: String(body.prescriberId) }
        : undefined;

    const order: FormuConnectOrderRequest = {
      patient,
      items,
      diagnosis: body.diagnosis as FormuConnectOrderRequest["diagnosis"],
      physician,
      shipping: (body.shipping as FormuConnectOrderRequest["shipping"]) || {
        ship_to: "patient",
        method: "ground",
      },
      vendor_order_id: String(body.vendor_order_id || body.regenOrderId || "").trim() || undefined,
    };

    const result = await submitFormuConnectOrder(order);
    const first = result.orders?.[0];

    return NextResponse.json({
      success: Boolean(result.ok),
      orderId: first?.order_number,
      batch_number: result.batch_number,
      vendor_order_id: result.vendor_order_id,
      orders: result.orders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to submit order",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (!isFormuConnectConfigured()) {
    return NextResponse.json(
      { success: false, error: "FormuConnect API not configured" },
      { status: 503 },
    );
  }

  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!orderId) {
    return NextResponse.json({ success: false, error: "orderId parameter required" }, { status: 400 });
  }

  try {
    const status = await getFormuConnectOrderStatus(orderId);
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get order status",
      },
      { status: 500 },
    );
  }
}
