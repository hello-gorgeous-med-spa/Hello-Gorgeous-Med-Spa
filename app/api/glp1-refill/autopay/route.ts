// GLP-1 refill — monthly auto-pay (Square subscription checkout)
// POST { reference, templateId, amountUsd?, lineLabel? }

import { NextRequest, NextResponse } from "next/server";

import { GLP1_REFILL_PATH } from "@/lib/flows";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { notifyStaffGlp1RefillCheckoutStarted } from "@/lib/glp1-refill-staff-sms";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
} from "@/lib/rx-invoice-templates";
import { SITE } from "@/lib/seo";
import { createMembershipCheckoutUrl } from "@/lib/square/membership-checkout";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { reference?: string; templateId?: string; amountUsd?: number; lineLabel?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
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

  const lineLabel = String(body?.lineLabel || template.lineLabel).trim();
  const redirectBase = `${SITE.url}${GLP1_REFILL_PATH}`;
  const redirectUrl = reference
    ? `${redirectBase}?autopay=1&ref=${encodeURIComponent(reference)}`
    : `${redirectBase}?autopay=1`;

  try {
    const result = await createMembershipCheckoutUrl({
      membershipId: `glp1-refill-${templateId}`,
      name: `${template.name} — monthly auto-pay`,
      priceDollars: amountUsd,
      redirectUrl,
    });

    await insertRxPaymentLedger({
      intakeRef: reference || null,
      source: "glp1_autopay",
      templateId: template.id,
      templateName: template.name,
      track: template.track,
      lineLabel: lineLabel,
      amountUsd,
      paymentUrl: result.url,
      deliveryMethod: "patient_portal",
      metadata: { mode: result.mode, reference: reference || null },
    });

    void notifyStaffGlp1RefillCheckoutStarted({
      event: "autopay",
      intakeRef: reference || null,
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
