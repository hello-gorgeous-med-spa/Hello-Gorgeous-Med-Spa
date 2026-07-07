// ============================================================
// VITAMIN BAR — dynamic Square checkout (Payment Links)
// POST { itemId, kind: "shot" | "membership" }
// Creates a Square hosted Payment Link (quickPay) and returns its URL.
// No manual dashboard links needed; prices come from lib/vitamin-bar.ts.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import {
  getCheckoutApiAsync,
  getSquareLocationIdAsync,
  getLocationsApiAsync,
  dollarsToCents,
} from "@/lib/square/client";
import { validateClientAppPromoCode } from "@/lib/client-app-promo-codes";
import { SITE } from "@/lib/seo";
import { CLIENT_APP } from "@/lib/client-app";
import { VITAMIN_SHOTS, VITAMIN_MEMBERSHIPS, VITAMIN_BAR } from "@/lib/vitamin-bar";

export const dynamic = "force-dynamic";

function idempotencyKey(): string {
  return `vb-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export async function POST(req: NextRequest) {
  let body: { itemId?: string; kind?: string; promoCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const itemId = String(body?.itemId || "").trim();
  const kind = body?.kind === "membership" ? "membership" : "shot";
  if (!itemId) {
    return NextResponse.json({ error: "itemId is required" }, { status: 400 });
  }

  // Resolve name + price from our menu data (server-side source of truth).
  let name: string;
  let priceDollars: number;
  let isRecurring = false;

  if (kind === "membership") {
    const m = VITAMIN_MEMBERSHIPS.find((x) => x.id === itemId);
    if (!m) return NextResponse.json({ error: "Unknown membership" }, { status: 404 });
    name = `${m.name} — ${VITAMIN_BAR.name} membership`;
    priceDollars = m.pricePerMonth;
    isRecurring = true;
  } else {
    const s = VITAMIN_SHOTS.find((x) => x.id === itemId);
    if (!s) return NextResponse.json({ error: "Unknown shot" }, { status: 404 });
    name = `${s.name} — ${VITAMIN_BAR.name}`;
    priceDollars = s.price;
  }

  // Memberships are recurring — Payment Links quickPay is one-time only.
  // Send members to a call-to-join until a Square subscription plan is wired.
  if (isRecurring) {
    return NextResponse.json(
      {
        error: "membership_recurring",
        message:
          "Memberships are recurring — set up a Square subscription plan, then we'll wire it here.",
      },
      { status: 422 },
    );
  }

  const promoCode = String(body?.promoCode || "").trim();
  let chargeDollars = priceDollars;
  let promoApplied: { code: string; discountUsd: number } | null = null;

  if (promoCode) {
    const promo = validateClientAppPromoCode({
      code: promoCode,
      subtotalUsd: priceDollars,
      context: "vitamin",
    });
    if (!promo.ok) {
      return NextResponse.json({ error: promo.error }, { status: 400 });
    }
    chargeDollars = promo.finalUsd;
    promoApplied = { code: promo.code, discountUsd: promo.discountUsd };
  }

  if (chargeDollars <= 0) {
    return NextResponse.json(
      { error: "Total after promo must be greater than $0. Call us to complete this order." },
      { status: 400 },
    );
  }

  const checkoutLabel = promoApplied
    ? `${name} (${promoApplied.code} -$${promoApplied.discountUsd})`
    : name;

  const checkoutApi = await getCheckoutApiAsync();
  if (!checkoutApi?.createPaymentLink) {
    return NextResponse.json(
      { error: "Square checkout is not connected yet. Connect Square to enable pre-pay." },
      { status: 503 },
    );
  }

  let locationId = await getSquareLocationIdAsync();
  if (!locationId) {
    // Fall back to the first active location on the connected Square account.
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
      console.error("[vitamin-bar/checkout] listLocations", e);
    }
  }
  if (!locationId) {
    return NextResponse.json({ error: "No Square location configured." }, { status: 503 });
  }

  try {
    const res = await checkoutApi.createPaymentLink({
      idempotencyKey: idempotencyKey(),
      quickPay: {
        name: checkoutLabel,
        priceMoney: { amount: dollarsToCents(chargeDollars), currency: "USD" },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${SITE.url}${CLIENT_APP.path}?paid=1`,
        askForShippingAddress: false,
      },
      description: `${VITAMIN_BAR.name} pre-pay`,
    });

    const link =
      (res as { result?: { paymentLink?: { url?: string; longUrl?: string } } })?.result
        ?.paymentLink ??
      (res as { paymentLink?: { url?: string; longUrl?: string } })?.paymentLink;
    const url = link?.url || link?.longUrl;

    if (!url) {
      return NextResponse.json({ error: "Could not create payment link" }, { status: 502 });
    }
    return NextResponse.json({
      url,
      promo: promoApplied,
      chargedUsd: chargeDollars,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[vitamin-bar/checkout]", msg);
    return NextResponse.json({ error: "Payment link creation failed" }, { status: 500 });
  }
}
