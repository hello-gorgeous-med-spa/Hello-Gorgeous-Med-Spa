import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { notifyOwnerFormSubmission } from "@/lib/notifications/form-alert";
import { resolveOrCreateClientForIntake } from "@/lib/resolveClientForIntake";
import {
  REGEN_POST_PAYMENT_INTAKE_SLUG,
  buildRegenPostPaymentIntakeSteps,
  evaluateRegenIntake,
  prefillRegenIntakeFromOrder,
  regenIntakeSignerName,
  resolveOrderCategory,
} from "@/lib/regen/post-payment-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OrderRow = {
  reference: string;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  goal: string | null;
  allergies: string | null;
  items: unknown;
  intake_completed_at: string | null;
  telehealth_required: boolean | null;
};

function paidStatuses(status: string): boolean {
  return status !== "pending_payment" && status !== "cancelled";
}

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim();
  if (!ref) {
    return NextResponse.json({ success: false, error: "Order reference required" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unavailable" }, { status: 503 });
  }

  const { data: order, error } = await admin
    .from("regen_orders")
    .select(
      "reference, status, customer_name, customer_email, customer_phone, goal, allergies, items, intake_completed_at, telehealth_required"
    )
    .eq("reference", ref)
    .maybeSingle();

  if (error || !order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  const row = order as OrderRow;
  if (!paidStatuses(row.status)) {
    return NextResponse.json(
      { success: false, error: "Payment not completed for this order" },
      { status: 402 }
    );
  }

  const category = resolveOrderCategory({
    goal: row.goal,
    items: Array.isArray(row.items) ? (row.items as Array<{ id?: string; name?: string }>) : [],
  });

  return NextResponse.json({
    success: true,
    orderRef: row.reference,
    status: row.status,
    intakeCompleted: Boolean(row.intake_completed_at),
    telehealthRequired: row.telehealth_required !== false,
    category,
    prefill: prefillRegenIntakeFromOrder(row),
    items: row.items,
    goal: row.goal,
    stepCount: buildRegenPostPaymentIntakeSteps(category).length,
  });
}

export async function POST(req: NextRequest) {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unavailable" }, { status: 503 });
  }

  let body: {
    orderRef?: string;
    responses?: Record<string, unknown>;
    signature_data?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const orderRef = String(body.orderRef || "").trim();
  if (!orderRef) {
    return NextResponse.json({ success: false, error: "Order reference required" }, { status: 400 });
  }

  const responses = body.responses && typeof body.responses === "object" ? body.responses : {};
  const signatureData = body.signature_data ? String(body.signature_data) : null;

  const { data: order, error: fetchErr } = await admin
    .from("regen_orders")
    .select(
      "reference, status, customer_name, customer_email, customer_phone, goal, allergies, items, intake_completed_at, telehealth_required"
    )
    .eq("reference", orderRef)
    .maybeSingle();

  if (fetchErr || !order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  const row = order as OrderRow;
  if (!paidStatuses(row.status)) {
    return NextResponse.json(
      { success: false, error: "Payment not completed for this order" },
      { status: 402 }
    );
  }

  if (row.intake_completed_at) {
    return NextResponse.json({
      success: true,
      alreadyCompleted: true,
      orderRef: row.reference,
      telehealthRequired: row.telehealth_required !== false,
    });
  }

  const category = resolveOrderCategory({
    goal: row.goal,
    items: Array.isArray(row.items) ? (row.items as Array<{ id?: string; name?: string }>) : [],
  });

  const evaluation = evaluateRegenIntake(category, responses);
  const signerName = regenIntakeSignerName(responses);
  const clientPhone = String(responses.confirm_phone || row.customer_phone || "").trim();

  const fullResponses: Record<string, unknown> = {
    ...responses,
    order_ref: orderRef,
    category,
    goal: row.goal,
    bmi: evaluation.bmi,
    qualified: evaluation.qualified,
    disqualification_reasons: evaluation.disqualificationReasons,
    provider_flags: evaluation.providerFlags,
    submitted_at: new Date().toISOString(),
  };
  delete fullResponses.signature;

  const { data: tmpl } = await admin
    .from("hg_form_templates")
    .select("id")
    .eq("slug", REGEN_POST_PAYMENT_INTAKE_SLUG)
    .eq("is_active", true)
    .maybeSingle();

  let submissionId: string | null = null;
  if (tmpl?.id) {
    let clientId: string | null = null;
    if (clientPhone) {
      const { clientId: resolved } = await resolveOrCreateClientForIntake(admin, {
        clientPhone,
        signerName,
        source: `regen_order:${orderRef}`,
      });
      clientId = resolved;
    }

    const token = randomBytes(24).toString("hex");
    const { data: submission, error: subErr } = await admin
      .from("hg_form_submissions")
      .insert({
        template_id: tmpl.id,
        client_id: clientId,
        access_token: token,
        responses_json: fullResponses,
        signer_name: signerName,
        signature_data: signatureData,
        client_phone: clientPhone || null,
      })
      .select("id")
      .single();

    if (subErr) {
      console.error("[regen/order-intake] submission error:", subErr);
    } else {
      submissionId = submission.id as string;
    }
  }

  const now = new Date().toISOString();
  const { error: updateErr } = await admin
    .from("regen_orders")
    .update({
      intake_completed_at: now,
      intake_data: fullResponses,
      intake_submission_id: submissionId,
      status: row.status === "paid" ? "intake_complete" : row.status,
      customer_name: signerName || row.customer_name,
      customer_email: String(responses.confirm_email || row.customer_email || "").trim() || row.customer_email,
      customer_phone: clientPhone || row.customer_phone,
      updated_at: now,
    })
    .eq("reference", orderRef);

  if (updateErr) {
    console.error("[regen/order-intake] update error:", updateErr);
    return NextResponse.json({ success: false, error: "Could not save intake" }, { status: 500 });
  }

  notifyOwnerFormSubmission({
    formName: "RE GEN INTAKE COMPLETE",
    lines: [
      `Ref ${orderRef}`,
      signerName || "—",
      clientPhone || "—",
      evaluation.qualified ? "Screening: OK for review" : "Screening: FLAGS — review required",
      evaluation.providerFlags.length ? `Flags: ${evaluation.providerFlags.join("; ")}` : "",
      "Patient needs telehealth before ship",
    ].filter(Boolean),
  });

  return NextResponse.json({
    success: true,
    orderRef,
    qualified: evaluation.qualified,
    telehealthRequired: row.telehealth_required !== false,
    disqualificationReasons: evaluation.disqualificationReasons,
  });
}
