import { NextRequest, NextResponse } from "next/server";

import { creditHgRewardsFromSquarePayment, type SquarePaymentLike } from "@/lib/hg-rewards/credit-from-square-payment";
import { reconcileRxLedgerFromSquarePayment } from "@/lib/rx-payment-ledger";
import { syncRegenOrderFromSquarePayment } from "@/lib/regen/sync-from-square-payment";
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
    regen: "RE GEN orders marked paid for Provider Portal on COMPLETED payments",
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

  const paymentExtra = payment as SquarePaymentLike & {
    order_id?: string | null;
    updated_at?: string | null;
    created_at?: string | null;
  };

  const regen = await syncRegenOrderFromSquarePayment(supabase, {
    id: payment.id,
    status: payment.status,
    order_id: paymentExtra.order_id,
    updated_at: paymentExtra.updated_at,
    created_at: paymentExtra.created_at,
  });

  const result = await creditHgRewardsFromSquarePayment(supabase, payment);

  void reconcileRxLedgerFromSquarePayment(
    {
      id: payment.id,
      status: payment.status,
      order_id: paymentExtra.order_id,
      updated_at: paymentExtra.updated_at,
      created_at: paymentExtra.created_at,
    },
    supabase,
  );

  if (result.credited || regen.matched) {
    return NextResponse.json({
      success: true,
      ...result,
      regen: regen.matched
        ? { orderRef: regen.orderRef, markedPaid: regen.markedPaid, notified: regen.notified }
        : undefined,
    });
  }

  return NextResponse.json({ skipped: true, ...result });
}
