/**
 * Create Square Payment Links for staff RX invoice templates.
 */

import {
  getCheckoutApiAsync,
  getLocationsApiAsync,
  getSquareLocationIdAsync,
  dollarsToCents,
} from "@/lib/square/client";
import { SITE } from "@/lib/seo";

function idempotencyKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function resolveLocationId(): Promise<string | null> {
  let locationId = await getSquareLocationIdAsync();
  if (locationId) return locationId;

  try {
    const locationsApi = await getLocationsApiAsync();
    const res = await locationsApi?.listLocations?.();
    const locations =
      (res as { result?: { locations?: Array<{ id?: string; status?: string }> } })?.result
        ?.locations ??
      (res as { locations?: Array<{ id?: string; status?: string }> })?.locations ??
      [];
    const active = locations.find((l) => l?.status === "ACTIVE") ?? locations[0];
    return active?.id ?? null;
  } catch (e) {
    console.error("[rx-invoice-payment-link] listLocations", e);
    return null;
  }
}

export type CreateRxPaymentLinkInput = {
  squareName: string;
  amountUsd: number;
  description?: string;
  clientLabel?: string;
};

export type CreateRxPaymentLinkResult =
  | { ok: true; url: string }
  | { ok: false; error: string; status: number };

export async function createRxPaymentLink(
  input: CreateRxPaymentLinkInput,
): Promise<CreateRxPaymentLinkResult> {
  if (!Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    return { ok: false, error: "Amount must be greater than zero", status: 400 };
  }

  const checkoutApi = await getCheckoutApiAsync();
  if (!checkoutApi?.createPaymentLink) {
    return {
      ok: false,
      error: "Square checkout is not connected. Connect Square in Settings first.",
      status: 503,
    };
  }

  const locationId = await resolveLocationId();
  if (!locationId) {
    return { ok: false, error: "No Square location configured.", status: 503 };
  }

  const redirectUrl = `${SITE.url}/admin/rx-invoices?paid=1`;
  const description =
    input.description?.trim() ||
    (input.clientLabel
      ? `Hello Gorgeous RX · ${input.clientLabel}`
      : "Hello Gorgeous RX payment");

  try {
    const res = await checkoutApi.createPaymentLink({
      idempotencyKey: idempotencyKey("rx-inv"),
      quickPay: {
        name: input.squareName,
        priceMoney: { amount: dollarsToCents(input.amountUsd), currency: "USD" },
        locationId,
      },
      checkoutOptions: {
        redirectUrl,
        askForShippingAddress: false,
      },
      description,
    });

    const link =
      (res as { result?: { paymentLink?: { url?: string; longUrl?: string } } })?.result
        ?.paymentLink ??
      (res as { paymentLink?: { url?: string; longUrl?: string } })?.paymentLink;
    const url = link?.url || link?.longUrl;

    if (!url) {
      return { ok: false, error: "Could not create payment link", status: 502 };
    }

    return { ok: true, url };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[rx-invoice-payment-link]", msg);
    return { ok: false, error: "Payment link creation failed", status: 500 };
  }
}
