// GLP-1 refill — monthly auto-pay (Square subscription checkout)
// POST { reference, submissionId?, templateId, amountUsd?, lineLabel?, supplyCycle? }

import { NextRequest, NextResponse } from "next/server";

import { GLP1_REFILL_PATH } from "@/lib/flows";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { notifyStaffGlp1RefillCheckoutStarted } from "@/lib/glp1-refill-staff-sms";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
} from "@/lib/rx-invoice-templates";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { resolveRxSubmissionContext } from "@/lib/rx-submission-context";
import { SITE } from "@/lib/seo";
import { createMembershipCheckoutUrl } from "@/lib/square/membership-checkout";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    reference?: string;
    submissionId?: string;
    templateId?: string;
    amountUsd?: number;
    lineLabel?: string;
    supplyCycle?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  const submissionId = String(body?.submissionId || "").trim();
  const templateId = String(body?.templateId || "").trim();
  if (!templateId) {
    return NextResponse.json({ error: "templateId is required" }, { status: 400 });
  }

  const template = getRxInvoiceTemplate(templateId);
  if (!template || (template.track !== "weight-loss" && template.track !== "peptides")) {
    return NextResponse.json({ error: "Unknown refill or add-on invoice template" }, { status: 404 });
  }

  const amountUsd = resolveTemplateAmountUsd(template, body?.amountUsd);
  if (amountUsd == null || amountUsd <= 0) {
    return NextResponse.json({ error: "Invalid amount for this template" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const ctx =
    admin && (submissionId || reference)
      ? await resolveRxSubmissionContext(admin, { submissionId, intakeRef: reference })
      : null;

  const intakeRef = ctx?.intakeRef || reference || null;
  const lineLabel = String(body?.lineLabel || template.lineLabel).trim();
  const redirectBase = `${SITE.url}${GLP1_REFILL_PATH}`;
  const redirectUrl = intakeRef
    ? `${redirectBase}?autopay=1&ref=${encodeURIComponent(intakeRef)}`
    : `${redirectBase}?autopay=1`;

  try {
    const result = await createMembershipCheckoutUrl({
      membershipId: `glp1-refill-${templateId}`,
      name: `${template.name} — monthly auto-pay`,
      priceDollars: amountUsd,
      redirectUrl,
    });

    await insertRxPaymentLedger({
      submissionId: ctx?.submissionId ?? submissionId || null,
      intakeRef,
      clientId: ctx?.clientId ?? null,
      clientName: ctx?.clientName ?? null,
      clientEmail: ctx?.clientEmail ?? null,
      clientPhone: ctx?.clientPhone ?? null,
      source: "glp1_autopay",
      templateId: template.id,
      templateName: template.name,
      track: template.track,
      lineLabel,
      amountUsd,
      paymentUrl: result.url,
      squarePaymentLinkId: result.paymentLinkId ?? null,
      squareOrderId: result.orderId ?? null,
      deliveryMethod: "patient_portal",
      metadata: {
        mode: result.mode,
        reference: intakeRef,
        ...(body.supplyCycle ? { supply_cycle: body.supplyCycle } : {}),
        ...(ctx?.submissionId ? { submission_id: ctx.submissionId } : {}),
      },
    });

    void notifyStaffGlp1RefillCheckoutStarted({
      event: "autopay",
      intakeRef,
      submissionId: ctx?.submissionId ?? submissionId || null,
      templateName: template.name,
      lineLabel,
      amountUsd,
    });

    return NextResponse.json({
      url: result.url,
      mode: result.mode,
      amountUsd,
      lineLabel,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[glp1-refill/autopay]", msg);
    return NextResponse.json(
      { error: "Auto-pay setup failed. Call 630-636-6193 and we will enroll you manually." },
      { status: 500 },
    );
  }
}
