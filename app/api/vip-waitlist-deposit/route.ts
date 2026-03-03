// ============================================================
// VIP WAITLIST $500 DEPOSIT – CREATE SQUARE PAYMENT LINK
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getAccessToken, getActiveConnection } from "@/lib/square/oauth";

const DEPOSIT_AMOUNT_CENTS = 50000; // $500
const SQUARE_API_VERSION = "2024-01-18";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === "string" ? body.email.trim() : undefined;
    const name = typeof body.name === "string" ? body.name.trim() : undefined;

    const accessToken = await getAccessToken();
    const connection = await getActiveConnection();

    if (!accessToken || !connection?.location_id) {
      return NextResponse.json(
        { error: "Payment link is not available. We'll contact you to complete your deposit." },
        { status: 503 }
      );
    }

    const baseUrl =
      connection.environment === "production"
        ? "https://connect.squareup.com"
        : "https://connect.squareupsandbox.com";

    const idempotencyKey = `vip-deposit-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

    const payload: Record<string, unknown> = {
      idempotency_key: idempotencyKey,
      quick_pay: {
        name: "VIP Waitlist 2026 – Refundable Deposit",
        price_money: {
          amount: DEPOSIT_AMOUNT_CENTS,
          currency: "USD",
        },
        location_id: connection.location_id,
      },
      description: "Refundable deposit for VIP Skin Tightening waitlist. Applied toward treatment.",
      payment_note: [
        "VIP Waitlist 2026 deposit",
        email ? `Email: ${email}` : null,
        name ? `Name: ${name}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    };

    if (email) {
      payload.pre_populated_data = {
        buyer_email: email,
      };
    }

    const res = await fetch(`${baseUrl}/v2/online-checkout/payment-links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Square-Version": SQUARE_API_VERSION,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[vip-waitlist-deposit] Square API error:", data);
      return NextResponse.json(
        { error: "Could not create payment link. We'll contact you to complete your deposit." },
        { status: 502 }
      );
    }

    const url = data.payment_link?.url ?? data.payment_link?.long_url;
    if (!url) {
      return NextResponse.json(
        { error: "Invalid response from payment provider." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[vip-waitlist-deposit]", err);
    return NextResponse.json(
      { error: "Something went wrong. We'll contact you to complete your deposit." },
      { status: 500 }
    );
  }
}
