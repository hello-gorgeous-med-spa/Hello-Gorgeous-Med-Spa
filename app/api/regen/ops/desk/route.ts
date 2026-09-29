import { NextRequest, NextResponse } from "next/server";

import { quoteClinicInvoice, sendClinicInvoice } from "@/lib/regen/clinic-invoice";
import { fulfillApprovedIntake } from "@/lib/regen/fulfill-approved-intake";
import { requireOpsAuth } from "@/lib/regen/ops-session";
import { regenRequestSkuById } from "@/lib/regen/refill-request-catalog";
import { normalizeToE164 } from "@/lib/phone-e164";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function upsertPatient(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  input: { firstName: string; lastName: string; email: string; phone: string; dob?: string },
) {
  const email = input.email.toLowerCase();
  const { data: existing } = await supabase.from("regen_patients").select("id").eq("email", email).maybeSingle();
  if (existing?.id) {
    await supabase
      .from("regen_patients")
      .update({
        first_name: input.firstName,
        last_name: input.lastName,
        phone: input.phone,
        date_of_birth: input.dob || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
    return existing.id as string;
  }
  const { data: created, error } = await supabase
    .from("regen_patients")
    .insert({
      email,
      first_name: input.firstName,
      last_name: input.lastName,
      phone: input.phone,
      date_of_birth: input.dob || null,
      state: "IL",
    })
    .select("id")
    .single();
  if (error || !created?.id) throw error || new Error("Could not save the patient.");
  return created.id as string;
}

export async function POST(request: NextRequest) {
  const auth = await requireOpsAuth(request);
  if (auth.error) return auth.error;
  const staff = auth.staff;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dob?: string;
    skuId?: string;
    manualName?: string;
    manualSku?: string;
    manualPack?: string;
    invoiceNow?: boolean;
    applyGorgeous20?: boolean;
    overrideUsd?: number;
    notes?: string;
  };

  const firstName = String(body.firstName || "").trim().slice(0, 40);
  const lastName = String(body.lastName || "").trim().slice(0, 40);
  const email = String(body.email || "").trim().toLowerCase();
  const phone = normalizeToE164(String(body.phone || "")) || "";
  const dob = String(body.dob || "").trim();
  const skuId = String(body.skuId || "").trim();
  const isManual = skuId === "manual";
  const sku = isManual ? null : regenRequestSkuById(skuId);
  const manualName = String(body.manualName || "").trim().slice(0, 80);
  const manualSku = String(body.manualSku || "").trim().slice(0, 20);
  const manualPack = String(body.manualPack || "").trim().slice(0, 80);
  const deskNote = String(body.notes || "").trim().slice(0, 2000);
  const overrideUsd = body.overrideUsd && body.overrideUsd > 0 ? Number(body.overrideUsd) : null;
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ error: "Need a phone or email so we can send the pay link." }, { status: 400 });
  }
  if (!isManual && !sku) {
    return NextResponse.json({ error: "Pick a protocol, or choose Manual and type it in." }, { status: 400 });
  }
  if (isManual && !manualName) {
    return NextResponse.json({ error: "Type the protocol name for a manual entry." }, { status: 400 });
  }
  if (isManual && !overrideUsd) {
    return NextResponse.json({ error: "Type the dollar amount for a manual invoice." }, { status: 400 });
  }

  const name = `${firstName} ${lastName}`.trim();
  const savedEmail = email || `${phone.replace(/\D/g, "") || "desk"}@walkin.hellogorgeousmedspa.com`;
  const patientId = await upsertPatient(supabase, {
    firstName,
    lastName,
    email: savedEmail,
    phone,
    dob,
  });

  const productName = isManual ? manualName : sku?.name || "REGEN protocol";
  const productSku = isManual ? manualSku || "review" : sku?.sku || "";
  const pack = isManual ? manualPack : sku?.pack || "";
  const history = {
    source: "regen_ops_desk",
    requestIntent: "add",
    skuId: isManual ? "manual" : sku?.id || "",
    sku: productSku,
    productName,
    pack,
    retailUsd: isManual ? overrideUsd : sku?.retailUsd,
    shippingUsd: sku?.inOffice ? 0 : sku?.shippingUsd || 30,
    promo: body.applyGorgeous20 ? "GORGEOUS20" : "",
    deskNotes: deskNote,
    enteredBy: staff.name,
  };
  const invoiceNow = Boolean(body.invoiceNow);
  const staffLine = invoiceNow
    ? `Desk walk-in by ${staff.name}. Invoice sent from /ops/desk.`
    : `Desk walk-in by ${staff.name}. Waiting on Today review.`;
  const reviewNotes = [deskNote, staffLine].filter(Boolean).join("\n\n");
  const { data: intake, error: intakeError } = await supabase
    .from("regen_intakes")
    .insert({
      patient_id: patientId,
      name,
      email: savedEmail,
      phone: phone || null,
      goal: sku?.hub === "sexual-health" ? "sexual-health" : sku?.hub === "dermatology" ? "skincare" : "energy",
      medical_history: history,
      current_medications: [],
      allergies: [],
      state: "IL",
      verified_illinois: true,
      amount_paid: 0,
      status: invoiceNow ? "approved" : "pending",
      review_notes: reviewNotes,
      reviewed_at: invoiceNow ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (intakeError || !intake) {
    return NextResponse.json({ error: intakeError?.message || "Could not create the visit." }, { status: 500 });
  }

  if (!invoiceNow) {
    return NextResponse.json({
      ok: true,
      patientId,
      intakeId: intake.id,
      invoiced: false,
      message: `${name} is on Today. Approve there when Ryan is ready, or open Walk-in again and invoice now.`,
    });
  }

  const fulfillment = await fulfillApprovedIntake({
    id: intake.id,
    name,
    email: savedEmail,
    phone,
    goal: intake.goal,
    patient_id: patientId,
    amount_paid: 0,
    medical_history: history,
    review_notes: reviewNotes,
  });

  if (deskNote) {
    await supabase
      .from("regen_orders")
      .update({
        notes: `DESK NOTE · ${deskNote}`.slice(0, 1800),
        np_notes: reviewNotes,
      })
      .eq("id", fulfillment.orderId);
  }

  const quote = quoteClinicInvoice({
    goal: intake.goal,
    program: isManual ? "" : sku?.id || "",
    customerName: name,
    customerEmail: email || undefined,
    customerPhone: phone,
    medicalHistory: history,
    overrideUsd,
    applyGorgeous20: Boolean(body.applyGorgeous20),
  });

  const invoice = await sendClinicInvoice({
    orderNumber: fulfillment.orderNumber,
    orderId: fulfillment.orderId,
    patientName: name,
    email: email || undefined,
    phone: phone || undefined,
    quote,
  });

  if (deskNote) {
    const { data: orderRow } = await supabase
      .from("regen_orders")
      .select("notes")
      .eq("id", fulfillment.orderId)
      .maybeSingle();
    await supabase
      .from("regen_orders")
      .update({
        notes: `${String(orderRow?.notes || "")} · DESK NOTE · ${deskNote}`.slice(0, 1800),
        np_notes: reviewNotes,
      })
      .eq("id", fulfillment.orderId);
  }

  return NextResponse.json({
    ok: true,
    patientId,
    intakeId: intake.id,
    invoiced: true,
    orderNumber: fulfillment.orderNumber,
    orderId: fulfillment.orderId,
    quote,
    invoice,
    payUrl: invoice.ok && "payUrl" in invoice ? invoice.payUrl : "",
    message: invoice.ok
      ? invoice.charmManual
        ? `Quote $${quote.amountUsd.toFixed(2)}. Create that invoice in Charm and send the payment link.`
        : `Pay link sent for $${quote.amountUsd.toFixed(2)}.`
      : invoice.error,
  });
}
