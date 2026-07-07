import { NextRequest, NextResponse } from "next/server";

import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
  templateRequiresShippingAddress,
} from "@/lib/rx-invoice-templates";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { resolveRxSubmissionContext } from "@/lib/rx-submission-context";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** POST — peptide refill checkout (30-day or 90-day combined quote) */
export async function POST(req: NextRequest) {
  let body: {
    reference?: string;
    submissionId?: string;
    templateId?: string;
    amountUsd?: number;
    supplyCycle?: string;
    lineLabel?: string;
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
  if (!template || template.track !== "peptides") {
    return NextResponse.json({ error: "Unknown peptide invoice template" }, { status: 404 });
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
  const redirectBase = `${SITE.url}${PEPTIDE_REQUEST_PATH}`;
  const redirectUrl = intakeRef
    ? `${redirectBase}?refill_paid=1&ref=${encodeURIComponent(intakeRef)}`
    : `${redirectBase}?refill_paid=1`;

  const lineLabel = body.lineLabel || template.lineLabel;
  const description = intakeRef
    ? `Hello Gorgeous RX peptide refill · Ref ${intakeRef} · ${lineLabel}`
    : `Hello Gorgeous RX peptide refill · ${lineLabel}`;

  const linkResult = await createRxPaymentLink({
    squareName: template.squareName,
    amountUsd,
    description,
    clientLabel: lineLabel,
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
    source: "peptide_checkout",
    templateId: template.id,
    templateName: template.name,
    track: template.track,
    lineLabel,
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

  return NextResponse.json({ url: linkResult.url, amountUsd });
}
