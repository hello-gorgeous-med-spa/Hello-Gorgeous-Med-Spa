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
import {
  SQUARE_RX_CNP_ERROR,
  squareRxCnpBlocked,
  type SquarePaymentLinkPurpose,
} from "@/lib/square-rx-cnp";

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
  redirectUrl?: string;
  /** When true, Square checkout collects shipping address (required for ship-to-home RX). */
  askForShippingAddress?: boolean;
  /**
   * Business payment type shown on Square checkout / order line (e.g. "Proposal").
   * Prefixed into quickPay.name and description so it appears on receipts/invoices.
   */
  paymentType?: string;
  /**
   * Labs and spa treatment proposals may still use Square payment links.
   * Prescription products/services default to blocked (Square CNP terms).
   */
  purpose?: SquarePaymentLinkPurpose;
};

export type CreateRxPaymentLinkResult =
  | { ok: true; url: string; paymentLinkId?: string; orderId?: string }
  | { ok: false; error: string; status: number };

/** Format Square line-item title so payment type is visible on invoices/receipts. */
export function formatSquarePaymentLineName(opts: {
  paymentType?: string | null;
  name: string;
  maxLen?: number;
}): string {
  const maxLen = opts.maxLen ?? 120;
  const type = opts.paymentType?.trim();
  const name = opts.name.trim();
  const full = type ? `${type} · ${name}` : name;
  return full.slice(0, maxLen);
}

export async function createRxPaymentLink(
  input: CreateRxPaymentLinkInput,
): Promise<CreateRxPaymentLinkResult> {
  if (squareRxCnpBlocked(input.purpose ?? "prescription")) {
    return { ok: false, error: SQUARE_RX_CNP_ERROR, status: 403 };
  }

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

  const redirectUrl = input.redirectUrl?.trim() || `${SITE.url}/admin/rx-invoices?paid=1`;
  const paymentType = input.paymentType?.trim() || "";
  const squareName = formatSquarePaymentLineName({
    paymentType,
    name: input.squareName,
  });
  const baseDescription =
    input.description?.trim() ||
    (input.clientLabel
      ? `Hello Gorgeous RX · ${input.clientLabel}`
      : "Hello Gorgeous RX payment");
  const description = paymentType
    ? `Payment type: ${paymentType} · ${baseDescription}`
    : baseDescription;
  const askForShippingAddress = input.askForShippingAddress ?? true;

  try {
    const res = await checkoutApi.createPaymentLink({
      idempotencyKey: idempotencyKey("rx-inv"),
      quickPay: {
        name: squareName,
        priceMoney: { amount: dollarsToCents(input.amountUsd), currency: "USD" },
        locationId,
      },
      checkoutOptions: {
        redirectUrl,
        askForShippingAddress,
        ...(askForShippingAddress
          ? { merchantSupportEmail: "hello@hellogorgeousmedspa.com" }
          : {}),
      },
      description,
    });

    const link =
      (res as {
        result?: {
          paymentLink?: { id?: string; orderId?: string; url?: string; longUrl?: string };
        };
      })?.result?.paymentLink ??
      (res as {
        paymentLink?: { id?: string; orderId?: string; url?: string; longUrl?: string };
      })?.paymentLink;
    const url = link?.url || link?.longUrl;

    if (!url) {
      return { ok: false, error: "Could not create payment link", status: 502 };
    }

    return {
      ok: true,
      url,
      paymentLinkId: link?.id,
      orderId: link?.orderId,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[rx-invoice-payment-link]", msg);
    return { ok: false, error: "Payment link creation failed", status: 500 };
  }
}
