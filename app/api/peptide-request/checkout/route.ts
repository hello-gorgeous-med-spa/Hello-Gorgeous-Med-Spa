// Hello Gorgeous RX™ — $49 peptide consult pre-pay (Square Payment Links)
// POST { reference?: string } — consult fee only, not medication.

import { NextRequest, NextResponse } from "next/server";

import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { PEPTIDE_CONSULT_FEE_USD } from "@/lib/peptide-request-menu";
import {
  getCheckoutApiAsync,
  getSquareLocationIdAsync,
  getLocationsApiAsync,
  dollarsToCents,
} from "@/lib/square/client";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

function idempotencyKey(): string {
  return `pr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function POST(req: NextRequest) {
  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = String(body?.reference || "").trim();
  const name = "Hello Gorgeous RX™ Peptide Consult";
  const priceDollars = PEPTIDE_CONSULT_FEE_USD;

  const checkoutApi = await getCheckoutApiAsync();
  if (!checkoutApi?.createPaymentLink) {
    return NextResponse.json(
      { error: "Square checkout is not connected yet. Call 630-636-6193 to pay by phone." },
      { status: 503 },
    );
  }

  let locationId = await getSquareLocationIdAsync();
  if (!locationId) {
    try {
      const locationsApi = await getLocationsApiAsync();
      const res = await locationsApi?.listLocations?.();
      const locations =
        (res as { result?: { locations?: Array<{ id?: string; status?: string }> } })?.result
          ?.locations ??
        (res as { locations?: Array<{ id?: string; status?: string }> })?.locations ??
        [];
      const active = locations.find((l) => l?.status === "ACTIVE") ?? locations[0];
      locationId = active?.id ?? null;
    } catch (e) {
      console.error("[peptide-request/checkout] listLocations", e);
    }
  }
  if (!locationId) {
    return NextResponse.json({ error: "No Square location configured." }, { status: 503 });
  }

  const redirectUrl = reference
    ? `${SITE.url}${PEPTIDE_REQUEST_PATH}?paid=1&ref=${encodeURIComponent(reference)}`
    : `${SITE.url}${PEPTIDE_REQUEST_PATH}?paid=1`;

  try {
    const res = await checkoutApi.createPaymentLink({
      idempotencyKey: idempotencyKey(),
      quickPay: {
        name,
        priceMoney: { amount: dollarsToCents(priceDollars), currency: "USD" },
        locationId,
      },
      checkoutOptions: {
        redirectUrl,
        askForShippingAddress: false,
      },
      description: reference
        ? `Hello Gorgeous RX peptide consult · Ref ${reference}`
        : "Hello Gorgeous RX peptide consult",
    });

    const link =
      (res as { result?: { paymentLink?: { url?: string; longUrl?: string } } })?.result
        ?.paymentLink ??
      (res as { paymentLink?: { url?: string; longUrl?: string } })?.paymentLink;
    const url = link?.url || link?.longUrl;

    if (!url) {
      return NextResponse.json({ error: "Could not create payment link" }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[peptide-request/checkout]", msg);
    return NextResponse.json({ error: "Payment link creation failed" }, { status: 500 });
  }
}
