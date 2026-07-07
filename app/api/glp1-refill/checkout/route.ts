// GLP-1 refill — one-time monthly invoice (Square Payment Links)
// POST { reference, submissionId?, templateId, amountUsd?, supplyCycle? }

import { NextRequest, NextResponse } from "next/server";

import { GLP1_REFILL_PATH } from "@/lib/flows";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { notifyStaffGlp1RefillCheckoutStarted } from "@/lib/glp1-refill-staff-sms";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
  templateRequiresShippingAddress,
} from "@/lib/rx-invoice-templates";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { resolveRxSubmissionContext } from "@/lib/rx-submission-context";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    reference?: string;
    submissionId?: string;
    templateId?: string;
    amountUsd?: number;
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

  const redirectBase = `${SITE.url}${GLP1_REFILL_PATH}`;
  const redirectUrl = intakeRef
    ? `${redirectBase}?paid=1&ref=${encodeURIComponent(intakeRef)}`
    : `${redirectBase}?paid=1`;

  const description = intakeRef
    ? `Hello Gorgeous RX refill · Ref ${intakeRef} · ${template.lineLabel}`
    : `Hello Gorgeous RX refill · ${template.lineLabel}`;

  const linkResult = await createRxPaymentLink({
    squareName: template.squareName,
    amountUsd,
    description,
    clientLabel: template.lineLabel,
    redirectUrl,
    askForShippingAddress: templateRequiresShippingAddress(template),
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  await insertRxPaymentLedger({
    submissionId: (ctx?.submissionId ?? submissionId) || null,
    intakeRef,
    clientId: ctx?.clientId ?? null,
    clientName: ctx?.clientName ?? null,
    clientEmail: ctx?.clientEmail ?? null,
    clientPhone: ctx?.clientPhone ?? null,
    source: "glp1_checkout",
    templateId: template.id,
    templateName: template.name,
    track: template.track,
    lineLabel: template.lineLabel,
    amountUsd,
    paymentUrl: linkResult.url,
    squarePaymentLinkId: linkResult.paymentLinkId,
    squareOrderId: linkResult.orderId,
    deliveryMethod: "patient_portal",
    metadata: {
      ...(intakeRef ? { reference: intakeRef } : {}),
      ...(body.supplyCycle ? { supply_cycle: body.supplyCycle } : {}),
      ...(ctx?.submissionId ? { submission_id: ctx.submissionId } : {}),
    },
  });

  void notifyStaffGlp1RefillCheckoutStarted({
    event: "checkout",
    intakeRef,
    submissionId: (ctx?.submissionId ?? submissionId) || null,
    templateName: template.name,
    lineLabel: template.lineLabel,
    amountUsd,
  });

  return NextResponse.json({ url: linkResult.url, amountUsd });
}
