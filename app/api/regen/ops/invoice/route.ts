import { NextRequest, NextResponse } from "next/server";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabase } from "@/lib/supabase-server";
import { requireOpsAuth } from "@/lib/regen/ops-session";
import { parsePatientFromOrderNotes, quoteClinicInvoice, sendClinicInvoice } from "@/lib/regen/clinic-invoice";
import { isBluefinPayconexConfigured } from "@/lib/bluefin-payconex";

export const dynamic = "force-dynamic";

async function requireInvoiceStaff(request: NextRequest) {
  const ops = await requireOpsAuth(request);
  if (!ops.error) return { ok: true as const };
  const provider = requireProviderAreaAccess(request);
  if (!("error" in provider)) return { ok: true as const };
  return { ok: false as const, error: ops.error };
}

/** GET /api/regen/ops/invoice — is auto-invoice ready? */
export async function GET(request: NextRequest) {
  const auth = await requireInvoiceStaff(request);
  if (!auth.ok) return auth.error;
  return NextResponse.json({
    configured: isBluefinPayconexConfigured(),
    processor: "bluefin-payconex",
    charmApi: false,
    message: isBluefinPayconexConfigured()
      ? "Approve can email a Bluefin pay link. Confirm payment before sending Formulation."
      : "Stage 1 is Charm-manual: preview the quote, create that invoice in Charm, then Send Invoice → Payment Link.",
  });
}

/** POST — send (or resend) the clinic invoice for an order. */
export async function POST(request: NextRequest) {
  const auth = await requireInvoiceStaff(request);
  if (!auth.ok) return auth.error;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    orderId?: string;
    orderNumber?: string;
    amountUsd?: number;
    applyGorgeous20?: boolean;
    applyConsultCredit?: boolean;
    previewOnly?: boolean;
  };

  let order: Record<string, unknown> | null = null;
  if (body.orderId) {
    const { data } = await supabase.from("regen_orders").select("*").eq("id", body.orderId).maybeSingle();
    order = data;
  } else if (body.orderNumber) {
    const byNumber = await supabase
      .from("regen_orders")
      .select("*")
      .eq("order_number", body.orderNumber)
      .maybeSingle();
    order = byNumber.data;
    if (!order) {
      const byRef = await supabase
        .from("regen_orders")
        .select("*")
        .eq("reference", body.orderNumber)
        .maybeSingle();
      if (!byRef.error) order = byRef.data;
    }
    if (!order) {
      const byId = await supabase.from("regen_orders").select("*").eq("id", body.orderNumber).maybeSingle();
      order = byId.data;
    }
  }
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const parsed = parsePatientFromOrderNotes(String(order.notes || ""));
  const patientName =
    String(order.customer_name || "").trim() || parsed.name || "Patient";
  const email = String(order.customer_email || parsed.email || "").trim();
  const phone = String(order.customer_phone || "").trim();

  let intakeHistory: Record<string, unknown> | null = null;
  const intakeId = String(order.intake_id || "").trim() || parsed.intakeId;
  if (intakeId) {
    const { data: intake } = await supabase
      .from("regen_intakes")
      .select("name,email,phone,goal,amount_paid,medical_history")
      .eq("id", intakeId)
      .maybeSingle();
    if (intake) {
      intakeHistory = (intake.medical_history as Record<string, unknown>) || null;
    }
  }

  const quote = quoteClinicInvoice({
    goal: String(order.goal || order.program || ""),
    program: String(order.program || ""),
    customerName: patientName,
    customerEmail: email,
    customerPhone: phone,
    amountPaid: order.amount_cents ? Number(order.amount_cents) / 100 : null,
    medicalHistory: intakeHistory || (order.intake_data as Record<string, unknown>) || null,
    overrideUsd: body.amountUsd,
    applyGorgeous20: body.applyGorgeous20,
    applyConsultCredit: body.applyConsultCredit,
  });

  if (body.previewOnly) {
    return NextResponse.json({
      ok: true,
      preview: true,
      charmManual: !isBluefinPayconexConfigured(),
      quote,
    });
  }

  const sent = await sendClinicInvoice({
    orderNumber: String(order.order_number),
    orderId: String(order.id),
    patientName,
    email: email || undefined,
    phone: phone || undefined,
    quote,
  });

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error, quote }, { status: 400 });
  }

  if (sent.charmManual && supabase) {
    const lines = quote.lines
      .map((line) => `${line.label}: ${line.amountUsd < 0 ? "-" : ""}$${Math.abs(line.amountUsd).toFixed(2)}`)
      .join(" · ");
    await supabase
      .from("regen_orders")
      .update({
        notes: `CHARM INVOICE QUOTE ${lines}`,
        pharmacy_error: `Charm-manual quote $${quote.amountUsd.toFixed(2)}. Create this invoice in Charm, then Send Invoice → Payment Link. Do not send Formulation until paid.`,
        amount_cents: Math.round(quote.amountUsd * 100),
        updated_at: new Date().toISOString(),
      })
      .eq("id", String(order.id));
  }

  return NextResponse.json({
    ok: true,
    payUrl: sent.payUrl,
    emailed: sent.emailed,
    texted: sent.texted,
    charmManual: Boolean(sent.charmManual),
    quote,
  });
}
