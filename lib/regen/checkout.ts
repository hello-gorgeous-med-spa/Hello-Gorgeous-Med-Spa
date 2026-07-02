/**
 * RE GEN Checkout — Square payment link creation for RX products.
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
  
  // Log the request for debugging (without sensitive data)
  console.log(`[regen/checkout] Square API: ${init.method || 'GET'} ${path}`);
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
    const errorDetails = data.errors?.map((e) => 
      `${e.code || 'ERROR'}${e.field ? ` (field: ${e.field})` : ''}: ${e.detail || 'Unknown'}`
    ).join("; ");
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
  redirectUrl: string;
}): Promise<RegenCheckoutResult> {
  if (!opts.items.length) {
    throw new Error("Cart is empty");
  }

  const locationId = await resolveSquareLocationId();
  console.log("[regen/checkout] Using location ID:", locationId ? `${locationId.slice(0, 8)}...` : "MISSING!");
  
  if (!locationId) {
    throw new Error("Square location not configured - check SQUARE_LOCATION_ID env var");
  }

  // Build line items
  const lineItems = opts.items.map((item) => ({
    name: item.rx ? `${item.name} Rx` : item.name,
    quantity: String(item.quantity),
    base_price_money: {
      amount: Math.round(item.priceUsd * 100),
      currency: "USD",
    },
  }));

  // Add flat $30 shipping
  const shippingCents = 3000;
  lineItems.push({
    name: "Flat Rate Shipping",
    quantity: "1",
    base_price_money: {
      amount: shippingCents,
      currency: "USD",
    },
  });

  const orderData = {
    idempotency_key: idempotencyKey("regen-order"),
    order: {
      location_id: locationId,
      line_items: lineItems,
      ...(opts.customerEmail && {
        fulfillments: [
          {
            type: "SHIPMENT",
            state: "PROPOSED",
            shipment_details: {
              recipient: {
                email_address: opts.customerEmail,
              },
            },
          },
        ],
      }),
    },
  };

  // Create the order first
  const orderResult = await squareFetch<{
    order?: { id: string };
  }>("/v2/orders", {
    method: "POST",
    body: orderData,
  });

  const orderId = orderResult.order?.id;
  if (!orderId) {
    throw new Error("Failed to create order");
  }

  // Create payment link for this order
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
      idempotency_key: idempotencyKey("regen-link"),
      order_id: orderId,
      checkout_options: {
        redirect_url: opts.redirectUrl,
        ask_for_shipping_address: true,
        merchant_support_email: "hello@hellogorgeousmedspa.com",
        enable_coupon: false,
        enable_loyalty: false,
      },
      description: "RE GEN by Hello Gorgeous Med Spa — Prescription order (provider review required)",
    },
  });

  const url = linkData.payment_link?.url || linkData.payment_link?.long_url;
  if (!url) {
    throw new Error("Could not create checkout link");
  }

  return {
    url,
    paymentLinkId: linkData.payment_link?.id,
    orderId,
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

  // Price + $30 shipping
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
      description: "RE GEN by Hello Gorgeous Med Spa — Provider must review intake before shipping.",
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
