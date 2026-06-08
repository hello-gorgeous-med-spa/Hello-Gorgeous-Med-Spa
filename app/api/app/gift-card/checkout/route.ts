export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { resolveSquareLocationId } from "@/lib/square/membership-checkout";
import { getAccessToken } from "@/lib/square/oauth";

const SQUARE_API_HOST =
  process.env.SQUARE_ENVIRONMENT === "production" || process.env.SQUARE_ENV === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

const VALID_AMOUNTS = [25, 50, 75, 100, 150, 200];

function idempotencyKey() {
  return `hg-gc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function POST(request: NextRequest) {
  const { amount } = await request.json();

  if (!amount || !VALID_AMOUNTS.includes(Number(amount))) {
    return NextResponse.json(
      { error: `Invalid amount. Choose from: ${VALID_AMOUNTS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const token = (await getAccessToken()) || process.env.SQUARE_ACCESS_TOKEN;
    if (!token) throw new Error("Square not configured");

    const locationId = await resolveSquareLocationId();
    const amountCents = Number(amount) * 100;

    const res = await fetch(`${SQUARE_API_HOST}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": "2024-12-18",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idempotency_key: idempotencyKey(),
        quick_pay: {
          name: `Hello Gorgeous Gift Card — $${amount}`,
          price_money: { amount: amountCents, currency: "USD" },
          location_id: locationId,
        },
        checkout_options: {
          redirect_url: `${process.env.BASE_URL ?? "https://hellogorgeousmedspa.com"}/app?tab=me&gc=success`,
          ask_for_shipping_address: false,
        },
        description: `Hello Gorgeous Med Spa gift card — $${amount} value. Redeemable for any service or product.`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data.errors?.map((e: { detail?: string }) => e.detail).join("; ") ?? "Square error";
      throw new Error(msg);
    }

    const url = data.payment_link?.url || data.payment_link?.long_url;
    if (!url) throw new Error("No checkout URL returned");

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[gift-card/checkout]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create checkout" },
      { status: 500 }
    );
  }
}
