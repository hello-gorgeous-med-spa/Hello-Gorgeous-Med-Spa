// Hello Gorgeous RX™ — $49 peptide consult pre-pay (Square Payment Links)
// POST { reference?: string } — consult fee only, not medication.

import { NextRequest, NextResponse } from "next/server";

import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { CLIENT_APP } from "@/lib/client-app";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import { createRxPaymentLink } from "@/lib/rx-invoice-payment-link";
import { insertRxPaymentLedger } from "@/lib/rx-payment-ledger";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { reference?: string; returnTo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  const returnTo = body?.returnTo === "app" ? "app" : "form";
  const name = "Hello Gorgeous RX™ — Peptide Consult (NP)";
  const priceDollars = PEPTIDE_CONSULT_FEE_USD;

  const redirectBase =
    returnTo === "app"
      ? `${SITE.url}${CLIENT_APP.path}?rx=1`
      : `${SITE.url}${PEPTIDE_REQUEST_PATH}`;
  const joiner = redirectBase.includes("?") ? "&" : "?";
  const redirectUrl = reference
    ? `${redirectBase}${joiner}paid=1&ref=${encodeURIComponent(reference)}`
    : `${redirectBase}${joiner}paid=1`;

  const description = reference
    ? `Hello Gorgeous RX consult pre-pay · Ref ${reference}`
    : "Hello Gorgeous RX consult pre-pay";

  const linkResult = await createRxPaymentLink({
    squareName: name,
    amountUsd: priceDollars,
    description,
    redirectUrl,
    askForShippingAddress: false,
  });

  if (!linkResult.ok) {
    return NextResponse.json({ error: linkResult.error }, { status: linkResult.status });
  }

  await insertRxPaymentLedger({
    intakeRef: reference || null,
    source: "peptide_checkout",
    templateId: "peptide-consult",
    templateName: "Peptide NP consult",
    track: "fees",
    lineLabel: "Peptide consult pre-pay (NP)",
    amountUsd: priceDollars,
    paymentUrl: linkResult.url,
    squarePaymentLinkId: linkResult.paymentLinkId,
    squareOrderId: linkResult.orderId,
    deliveryMethod: "patient_portal",
    metadata: reference ? { reference, returnTo } : { returnTo },
  });

  return NextResponse.json({ url: linkResult.url });
}
