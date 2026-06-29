// Hello Gorgeous RX™ — HRT medication pre-pay (Square Payment Links)
// POST { reference, templateId, amountUsd, lineLabel?, supplyCycle? }

import { NextRequest, NextResponse } from "next/server";

import { HRT_REQUEST_PATH } from "@/lib/flows";
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
    supplyCycle?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  const templateId = String(body?.templateId || "hrt-request").trim();
  const amountUsd = Number(body?.amountUsd);
  const lineLabel = String(body?.lineLabel || "Hormone therapy supply").trim();
  const supplyCycle = String(body?.supplyCycle || "").trim();

  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }
  if (!Number.isFinite(amountUsd) || amountUsd < 1) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const redirectUrl = `${SITE.url}${HRT_REQUEST_PATH}?paid=1&ref=${encodeURIComponent(reference)}`;
  const squareName = `Hello Gorgeous RX™ — ${lineLabel}`;
  const description = `HRT pre-pay · Ref ${reference}${supplyCycle ? ` · ${supplyCycle}` : ""}`;

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
    source: "hrt_checkout",
    templateId,
    templateName: lineLabel,
    track: "medication",
    lineLabel,
    amountUsd,
    paymentUrl: linkResult.url,
    squarePaymentLinkId: linkResult.paymentLinkId,
    squareOrderId: linkResult.orderId,
    deliveryMethod: "ship_to_home",
    metadata: {
      reference,
      supplyCycle: supplyCycle || undefined,
    },
  });

  return NextResponse.json({ url: linkResult.url });
}
