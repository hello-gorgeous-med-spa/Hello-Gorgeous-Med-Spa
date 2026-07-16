/**
 * RE GEN Checkout — Square payment link creation for RX products.
 * Promo codes (e.g. BESTIE100) are entered on Square's hosted checkout — not in-app.
 */

import "server-only";

import { getAccessToken } from "@/lib/square/oauth";
import { resolveSquareLocationId } from "@/lib/square/membership-checkout";

const SQUARE_API_HOST =
  process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const SQUARE_API_VERSION = "2024-12-18";

function idempotencyKey(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function squareFetch<T>(
  path: string,
  init: RequestInit & { body?: unknown } = {},
): Promise<T> {
  let token: string | null = null;
  try {
    token = await getAccessToken();
  } catch (oauthErr) {
    console.error("[regen/checkout] OAuth error, falling back to env var:", oauthErr);
  }
  token = token || process.env.SQUARE_ACCESS_TOKEN || null;

  if (!token) {
    console.error("[regen/checkout] No Square token available - check SQUARE_ACCESS_TOKEN env var or OAuth connection");
    throw new Error("Square is not connected - missing access token");
  }

  const { body, ...rest } = init;

  console.log(`[regen/checkout] Square API: ${init.method || "GET"} ${path}`);
  if (body) {
    console.log("[regen/checkout] Request body keys:", Object.keys(body as object));
  }

  const res = await fetch(`${SQUARE_API_HOST}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    errors?: Array<{ detail?: string; code?: string; field?: string; category?: string }>;
  };
  if (!res.ok) {
    const errorDetails = data.errors
      ?.map(
        (e) =>
          `${e.code || "ERROR"}${e.field ? ` (field: ${e.field})` : ""}: ${e.detail || "Unknown"}`,
      )
      .join("; ");
    console.error("[regen/checkout] Square API error:", res.status, errorDetails, data.errors);
    throw new Error(errorDetails || `Square API ${res.status}`);
  }
  return data;
}

export type RegenCartItem = {
  id: string;
  name: string;
  priceUsd: number;
  quantity: number;
  category: string;
  rx?: boolean;
  /** Square catalog variation — links line to Item Library */
  squareVariationId?: string;
  /** regen-best-prices / manifest catalog_id */
  regenCatalogId?: string;
  variantLabel?: string;
  supplyDays?: 30 | 90;
};

export type RegenCheckoutResult = {
  url: string;
  paymentLinkId?: string;
  orderId?: string;
};

/**
 * Create a Square payment link for RE GEN cart items.
 * Flat $30 shipping is added automatically.
 */
export async function createRegenCheckout(opts: {
  items: RegenCartItem[];
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  redirectUrl: string;
  orderReference?: string;
  /** When set, shipping uses Square catalog variation (RE GEN flat ship SKU). */
  shippingSquareVariationId?: string;
  shippingUsd?: number;
}): Promise<RegenCheckoutResult> {
  if (!opts.items.length) {
    throw new Error("Cart is empty");
  }

  const locationId = await resolveSquareLocationId();
  console.log("[regen/checkout] Using location ID:", locationId ? `${locationId.slice(0, 8)}...` : "MISSING!");

  if (!locationId) {
    throw new Error("Square location not configured - check SQUARE_LOCATION_ID env var");
  }

  const lineItems = opts.items.map((item) => {
    const priceInCents = Math.round(item.priceUsd * 100);
    if (priceInCents <= 0) {
      console.error("[regen/checkout] Invalid price for item:", item.name, item.priceUsd);
      throw new Error(`Invalid price for ${item.name}: $${item.priceUsd}`);
    }
    if (item.squareVariationId) {
      return {
        catalog_object_id: item.squareVariationId,
        quantity: String(item.quantity),
        base_price_money: {
          amount: priceInCents,
          currency: "USD",
        },
      };
    }
    return {
      name: item.rx ? `${item.name} Rx` : item.name,
      quantity: String(item.quantity),
      base_price_money: {
        amount: priceInCents,
        currency: "USD",
      },
    };
  });

  console.log(
    "[regen/checkout] Line items:",
    lineItems.map((li) =>
      "catalog_object_id" in li && li.catalog_object_id
        ? { catalog: li.catalog_object_id.slice(0, 8), amount: li.base_price_money.amount }
        : { name: (li as { name?: string }).name, amount: li.base_price_money.amount },
    ),
  );

  const shippingCents = Math.round((opts.shippingUsd ?? 30) * 100);
  if (opts.shippingSquareVariationId) {
    lineItems.push({
      catalog_object_id: opts.shippingSquareVariationId,
      quantity: "1",
      base_price_money: {
        amount: shippingCents,
        currency: "USD",
      },
    });
  } else {
    lineItems.push({
      name: "Flat Rate Shipping",
      quantity: "1",
      base_price_money: {
        amount: shippingCents,
        currency: "USD",
      },
    });
  }

  const orderPayload: Record<string, unknown> = {
    location_id: locationId,
    reference_id: opts.orderReference?.slice(0, 40) || undefined,
    line_items: lineItems,
  };

  const email = opts.customerEmail?.trim().toLowerCase() || undefined;
  const phoneE164 = opts.customerPhone
    ? (await import("@/lib/phone-e164")).normalizeToE164(opts.customerPhone)
    : null;

  const buildBody = (includePhone: boolean) => {
    const prePopulated: Record<string, string> = {};
    if (email) prePopulated.buyer_email = email;
    if (includePhone && phoneE164) prePopulated.buyer_phone_number = phoneE164;

    return {
      idempotency_key: idempotencyKey("regen-link"),
      order: orderPayload,
      checkout_options: {
        redirect_url: opts.redirectUrl,
        ask_for_shipping_address: true,
        merchant_support_email: "hello@hellogorgeousmedspa.com",
      },
      ...(Object.keys(prePopulated).length
        ? { pre_populated_data: prePopulated }
        : {}),
      description:
        "RE GEN by Hello Gorgeous Med Spa — Prescription order (provider review required)",
    };
  };

  let linkData: {
    payment_link?: {
      id?: string;
      order_id?: string;
      url?: string;
      long_url?: string;
    };
  };

  try {
    linkData = await squareFetch("/v2/online-checkout/payment-links", {
      method: "POST",
      body: buildBody(true),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (phoneE164 && /INVALID_PHONE_NUMBER|phone/i.test(msg)) {
      console.warn("[regen/checkout] Square rejected phone; retrying without prefill");
      linkData = await squareFetch("/v2/online-checkout/payment-links", {
        method: "POST",
        body: buildBody(false),
      });
    } else {
      throw err;
    }
  }

  const url = linkData.payment_link?.url || linkData.payment_link?.long_url;
  if (!url) {
    throw new Error("Could not create checkout link");
  }

  return {
    url,
    paymentLinkId: linkData.payment_link?.id,
    orderId: linkData.payment_link?.order_id,
  };
}

/**
 * Create a quick-pay link for a single RE GEN product.
 */
export async function createRegenQuickPay(opts: {
  productId: string;
  name: string;
  priceUsd: number;
  redirectUrl: string;
}): Promise<RegenCheckoutResult> {
  const locationId = await resolveSquareLocationId();

  const totalCents = Math.round(opts.priceUsd * 100) + 3000;

  const linkData = await squareFetch<{
    payment_link?: {
      id?: string;
      order_id?: string;
      url?: string;
      long_url?: string;
    };
  }>("/v2/online-checkout/payment-links", {
    method: "POST",
    body: {
      idempotency_key: idempotencyKey(`regen-qp-${opts.productId}`),
      quick_pay: {
        name: `${opts.name} + $30 shipping`,
        price_money: {
          amount: totalCents,
          currency: "USD",
        },
        location_id: locationId,
      },
      checkout_options: {
        redirect_url: opts.redirectUrl,
        ask_for_shipping_address: true,
        merchant_support_email: "hello@hellogorgeousmedspa.com",
      },
      description:
        "RE GEN by Hello Gorgeous Med Spa — Provider must review intake before shipping.",
    },
  });

  const url = linkData.payment_link?.url || linkData.payment_link?.long_url;
  if (!url) {
    throw new Error("Could not create checkout link");
  }

  return {
    url,
    paymentLinkId: linkData.payment_link?.id,
    orderId: linkData.payment_link?.order_id,
  };
}
