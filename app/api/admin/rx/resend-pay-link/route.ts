import { NextRequest, NextResponse } from "next/server";

import { requireProviderAreaAccess } from "@/lib/api-auth";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import {
  emailClientRxPaymentLink,
  smsClientRxPaymentLink,
} from "@/lib/rx-invoice-notify";
import {
  defaultInvoiceTemplateForTrack,
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
} from "@/lib/rx-invoice-templates";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { intakeTrackFromSlug } from "@/lib/rx-dispatch";
import { loadSubmissionById } from "@/lib/rx-submission-context";

export const dynamic = "force-dynamic";

type Delivery = "link" | "email" | "sms" | "both";

function parseDelivery(raw: unknown): Delivery {
  if (raw === "email" || raw === "sms" || raw === "both") return raw;
  return "both";
}

/**
 * POST /api/admin/rx/resend-pay-link
 * Resend or create a payment link from Command Center row context.
 */
export async function POST(req: NextRequest) {
  const auth = requireProviderAreaAccess(req);
  if ("error" in auth) return auth.error;

  let body: {
    submissionId?: string;
    templateId?: string;
    delivery?: string;
    resendExistingUrl?: boolean;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const submissionId = String(body.submissionId || "").trim();
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

  const submission = await loadSubmissionById(admin, submissionId);
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const track = intakeTrackFromSlug(submission.slug ?? "");
  const templateId =
    String(body.templateId || "").trim() ||
    defaultInvoiceTemplateForTrack(track === "glp1" ? "glp1" : track === "peptide" ? "peptide" : "unknown");
  const template = getRxInvoiceTemplate(templateId);
  if (!template) {
    return NextResponse.json({ error: "Unknown invoice template" }, { status: 404 });
  }

  const amountUsd = resolveTemplateAmountUsd(template);
  if (amountUsd == null || amountUsd <= 0) {
    return NextResponse.json({ error: "Template amount invalid" }, { status: 400 });
  }

  const clientName = submission.clientName?.trim() || "";
  const email = submission.clientEmail?.trim() || "";
  const phone = submission.clientPhone?.trim() || "";
  const delivery = parseDelivery(body.delivery);

  if (delivery === "email" || delivery === "both") {
    if (!email) {
      return NextResponse.json({ error: "Client email required for email delivery" }, { status: 400 });
    }
  }
  if (delivery === "sms" || delivery === "both") {
    if (!phone) {
      return NextResponse.json({ error: "Client phone required for text delivery" }, { status: 400 });
    }
  }

  const linkResult = await createRxPaymentLink({
    squareName: template.squareName,
    amountUsd,
    clientLabel: clientName || email || phone || "Client",
    description: `${template.lineLabel} · Ref ${submission.intakeRef}`,
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  const url = linkResult.url;
  const notify: { email?: { ok: boolean; error?: string }; sms?: { ok: boolean; error?: string } } =
    {};

  if (delivery === "email" || delivery === "both") {
    notify.email = await emailClientRxPaymentLink({
      to: email,
      clientName,
      itemName: template.name,
      amountUsd,
      url,
    });
  }
  if (delivery === "sms" || delivery === "both") {
    notify.sms = await smsClientRxPaymentLink({
      phone,
      clientName,
      itemName: template.name,
      amountUsd,
      url,
    });
  }

  const ledgerRow = await insertRxPaymentLedger({
    clientId: submission.clientId,
    clientName: clientName || null,
    clientEmail: email || null,
    clientPhone: phone || null,
    submissionId: submission.submissionId,
    intakeRef: submission.intakeRef,
    source: "staff_invoice",
    templateId: template.id,
    templateName: template.name,
    track: template.track,
    lineLabel: template.lineLabel,
    amountUsd,
    paymentUrl: url,
    squarePaymentLinkId: linkResult.paymentLinkId,
    squareOrderId: linkResult.orderId,
    deliveryMethod: delivery,
    sentBy: auth.user.email,
    staffNote: `Resent from RX Command Center`,
  });

  return NextResponse.json({
    ok: true,
    url,
    ledgerId: ledgerRow?.id,
    template: { id: template.id, name: template.name, amountUsd },
    notify,
  });
}
