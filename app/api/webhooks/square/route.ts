// POST /api/webhooks/square — HG Rewards auto-credit (see lib/hg-rewards/credit-from-square-payment.ts)

import { NextRequest, NextResponse } from "next/server";

import { creditHgRewardsFromSquarePayment, type SquarePaymentLike } from "@/lib/hg-rewards/credit-from-square-payment";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { verifySquareWebhookSignature } from "@/lib/square/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/webhooks/square",
    dashboardUrl: "https://www.hellogorgeousmedspa.com/api/webhooks/square",
    events: ["payment.completed", "payment.updated"],
    rewards: "HG Rewards auto-credit on COMPLETED payments",
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");

  if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY) {
    if (!signature) {
      return NextResponse.json({ error: "Missing Square signature header" }, { status: 401 });
    }
    const verification = verifySquareWebhookSignature(request, signature, rawBody);
    if (!verification.valid) {
      console.error("[webhooks/square] Invalid signature:", verification.error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let event: { type?: string; data?: { object?: { payment?: SquarePaymentLike } } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.type ?? "";
  if (eventType !== "payment.completed" && eventType !== "payment.updated") {
    return NextResponse.json({ skipped: true, reason: `Event type ${eventType} not handled` });
  }

  const payment = event.data?.object?.payment;
  if (!payment?.id) {
    return NextResponse.json({ skipped: true, reason: "No payment object" });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const result = await creditHgRewardsFromSquarePayment(supabase, payment);

  if (result.credited) {
    return NextResponse.json({ success: true, ...result });
  }

  return NextResponse.json({ skipped: true, ...result });
}
