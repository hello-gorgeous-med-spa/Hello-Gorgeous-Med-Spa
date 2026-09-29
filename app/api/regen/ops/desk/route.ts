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
  const sku = regenRequestSkuById(String(body.skuId || ""));
  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json({ error: "Need a phone or email so we can send the pay link." }, { status: 400 });
  }
  if (!sku) {
    return NextResponse.json({ error: "Pick a protocol." }, { status: 400 });
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

  const history = {
    source: "regen_ops_desk",
    requestIntent: "add",
    skuId: sku.id,
    sku: sku.sku,
    productName: sku.name,
    pack: sku.pack,
    retailUsd: sku.retailUsd,
    shippingUsd: sku.inOffice ? 0 : sku.shippingUsd,
    promo: body.applyGorgeous20 ? "GORGEOUS20" : "",
    deskNotes: String(body.notes || "").slice(0, 400),
    enteredBy: staff.name,
  };

  const invoiceNow = Boolean(body.invoiceNow);
  const { data: intake, error: intakeError } = await supabase
    .from("regen_intakes")
    .insert({
      patient_id: patientId,
      name,
      email: savedEmail,
      phone: phone || null,
      goal: sku.hub === "peptides" ? "energy" : sku.hub,
      medical_history: history,
      current_medications: [],
      allergies: [],
      state: "IL",
      verified_illinois: true,
      amount_paid: 0,
      status: invoiceNow ? "approved" : "pending",
      review_notes: invoiceNow
        ? `Desk walk-in by ${staff.name}. Invoice sent from /ops/desk.`
        : `Desk walk-in by ${staff.name}. Waiting on Today review.`,
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
    review_notes: String(intake.review_notes || ""),
  });

  const quote = quoteClinicInvoice({
    goal: intake.goal,
    program: sku.id,
    customerName: name,
    customerEmail: email || undefined,
    customerPhone: phone,
    medicalHistory: history,
    overrideUsd: body.overrideUsd && body.overrideUsd > 0 ? body.overrideUsd : null,
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
