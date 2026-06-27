// GLP-1 refill — one-time monthly invoice (Square Payment Links)
// POST { reference, templateId, amountUsd? }

import { NextRequest, NextResponse } from "next/server";

import { GLP1_REFILL_PATH } from "@/lib/flows";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import {
  getRxInvoiceTemplate,
  resolveTemplateAmountUsd,
} from "@/lib/rx-invoice-templates";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { reference?: string; templateId?: string; amountUsd?: number };
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
  if (!template || template.track !== "weight-loss") {
    return NextResponse.json({ error: "Unknown GLP-1 invoice template" }, { status: 404 });
  }

  const amountUsd = resolveTemplateAmountUsd(template, body?.amountUsd);
  if (amountUsd == null || amountUsd <= 0) {
    return NextResponse.json({ error: "Invalid amount for this template" }, { status: 400 });
  }

  const redirectBase = `${SITE.url}${GLP1_REFILL_PATH}`;
  const redirectUrl = reference
    ? `${redirectBase}?paid=1&ref=${encodeURIComponent(reference)}`
    : `${redirectBase}?paid=1`;

  const description = reference
    ? `Hello Gorgeous RX refill · Ref ${reference} · ${template.lineLabel}`
    : `Hello Gorgeous RX refill · ${template.lineLabel}`;

  const linkResult = await createRxPaymentLink({
    squareName: template.squareName,
    amountUsd,
    description,
    clientLabel: template.lineLabel,
    redirectUrl,
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  return NextResponse.json({ url: linkResult.url, amountUsd });
}
