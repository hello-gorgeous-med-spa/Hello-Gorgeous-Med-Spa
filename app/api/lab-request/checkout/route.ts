// Hello Gorgeous — lab panel pre-pay (Square Payment Links)

import { NextRequest, NextResponse } from "next/server";

import { LAB_REQUEST_PATH } from "@/lib/flows";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: {
    reference?: string;
    submissionId?: string;
    templateId?: string;
    amountUsd?: number;
    lineLabel?: string;
    panelId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  const templateId = String(body?.templateId || "lab-panel").trim();
  const amountUsd = Number(body?.amountUsd);
  const lineLabel = String(body?.lineLabel || "Lab panel").trim();
  const panelId = String(body?.panelId || "").trim();

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }
  if (!Number.isFinite(amountUsd) || amountUsd < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const redirectUrl = `${SITE.url}${LAB_REQUEST_PATH}?paid=1&ref=${encodeURIComponent(reference)}`;
  const squareName = `Hello Gorgeous — ${lineLabel}`;
  const description = `Lab panel pre-pay · Ref ${reference}${panelId ? ` · ${panelId}` : ""}`;

  const linkResult = await createRxPaymentLink({
    squareName,
    amountUsd,
    description,
    redirectUrl,
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  await insertRxPaymentLedger({
    intakeRef: reference,
    submissionId: body.submissionId || null,
    source: "lab_checkout",
    templateId,
    templateName: lineLabel,
    track: "labs",
    lineLabel,
    amountUsd,
    paymentUrl: linkResult.url,
    squarePaymentLinkId: linkResult.paymentLinkId,
    squareOrderId: linkResult.orderId,
    deliveryMethod: "requisition",
    metadata: {
      reference,
      panelId: panelId || undefined,
    },
  });

  return NextResponse.json({ url: linkResult.url });
}
