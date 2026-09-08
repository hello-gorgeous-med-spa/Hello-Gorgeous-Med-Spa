import { after, NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";

import { sendRegenNotification } from "@/lib/regen/notifications";
import { getSupabase } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function getStripe() {
  const key = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe API key not configured");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function webhookSecret(): string {
  return (
    process.env.REGEN_STRIPE_WEBHOOK_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim() ||
    ""
  );
}

/**
 * POST /api/regen/webhooks/stripe
 * Stripe live endpoint for the Hello Gorgeous Med Spa RX account.
 * Always 2xx after a valid signature so Stripe does not disable the endpoint.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const secret = webhookSecret();

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }
  if (!secret) {
    console.error("[regen-stripe-webhook] REGEN_STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("[regen-stripe-webhook] signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await dispatch(event);
  } catch (error) {
    console.error("[regen-stripe-webhook] handler failed", event.type, event.id, error);
  }

  return NextResponse.json({ received: true, id: event.id, type: event.type });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "regen-stripe",
    secretConfigured: Boolean(webhookSecret()),
  });
}

async function dispatch(event: Stripe.Event) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error("[regen-stripe-webhook] database not configured — event logged only", event.type, event.id);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutComplete(supabase, event.data.object as Stripe.Checkout.Session);
      break;
    case "payment_intent.succeeded":
      await handlePaymentSuccess(supabase, event.data.object as Stripe.PaymentIntent);
      break;
    case "invoice.paid":
      await handleInvoicePaid(supabase, event.data.object as Stripe.Invoice);
      break;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpdate(supabase, event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionCanceled(supabase, event.data.object as Stripe.Subscription);
      break;
    default:
      break;
  }
}

async function handleCheckoutComplete(supabase: SupabaseClient, session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.customer_details?.email;
  const intakeId = session.metadata?.intakeId || session.metadata?.intake_id;
  const customerName =
    session.customer_details?.name || session.metadata?.patientName || email?.split("@")[0] || "Patient";

  let intake: { id: string; name: string | null; email: string | null; goal: string | null } | null = null;

  if (intakeId) {
    const { data } = await supabase
      .from("regen_intakes")
      .select("id, name, email, goal, status")
      .eq("id", intakeId)
      .maybeSingle();
    intake = data;
  } else if (email) {
    const { data } = await supabase
      .from("regen_intakes")
      .select("id, name, email, goal, status")
      .eq("email", email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    intake = data;
  }

  if (intake) {
    const { data: updated, error } = await supabase
      .from("regen_intakes")
      .update({
        status: intake.status === "awaiting_payment" ? "pending" : intake.status,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string" ? session.payment_intent : session.id,
        amount_paid: (session.amount_total || 0) / 100,
        updated_at: new Date().toISOString(),
      })
      .eq("id", intake.id)
      .select("id, name, email, goal")
      .maybeSingle();
    if (error) console.error("[regen-stripe-webhook] intake update failed", error);
    if (updated) intake = updated;
  }

  const notifyEmail = email || intake?.email;
  if (notifyEmail) {
    after(() =>
      sendRegenNotification({
        type: "welcome",
        patient: { name: intake?.name || customerName, email: notifyEmail },
        intake: intake ? { id: intake.id, goal: intake.goal || "consult" } : undefined,
      }).catch((emailErr) => console.error("[regen-stripe-webhook] welcome email failed:", emailErr)),
    );
  }

  if (session.metadata?.referral_code && notifyEmail) {
    after(() =>
      processReferral(supabase, session.metadata!.referral_code!, notifyEmail).catch((err) =>
        console.error("[regen-stripe-webhook] referral failed", err),
      ),
    );
  }

  const affiliateCode = session.metadata?.affiliateCode || session.metadata?.affiliate_code;
  if (affiliateCode && notifyEmail) {
    after(async () => {
      try {
        const { recordPaidOrderCommission } = await import("@/lib/regen/affiliate-ledger");
        const medAmount = Number(session.metadata?.medAmount || 0) || (session.amount_total || 0) / 100;
        await recordPaidOrderCommission(
          supabase,
          affiliateCode,
          notifyEmail,
          typeof session.payment_intent === "string" ? session.payment_intent : session.id,
          medAmount,
        );
      } catch (affErr) {
        console.error("[regen-stripe-webhook] affiliate commission failed", affErr);
      }
    });
  }
}

async function handlePaymentSuccess(supabase: SupabaseClient, paymentIntent: Stripe.PaymentIntent) {
  const { error } = await supabase
    .from("regen_orders")
    .update({
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .eq("status", "pending");
  if (error) console.error("[regen-stripe-webhook] payment_intent order update failed", error);
}

async function handleInvoicePaid(supabase: SupabaseClient, invoice: Stripe.Invoice) {
  const { error } = await supabase
    .from("regen_orders")
    .update({
      status: "processing",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_invoice_id", invoice.id)
    .eq("status", "pending");
  if (error) console.error("[regen-stripe-webhook] invoice order update failed", error);
}

async function handleSubscriptionUpdate(supabase: SupabaseClient, subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await getStripe().customers.retrieve(customerId);
  if (!customer || customer.deleted) return;

  const email = customer.email;
  if (!email) return;

  const { data: patient } = await supabase
    .from("regen_patients")
    .select("id")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!patient) return;

  const { error } = await supabase.from("regen_subscriptions").upsert(
    {
      patient_id: patient.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) console.error("[regen-stripe-webhook] subscription upsert failed", error);
}

async function handleSubscriptionCanceled(supabase: SupabaseClient, subscription: Stripe.Subscription) {
  const { error } = await supabase
    .from("regen_subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);
  if (error) console.error("[regen-stripe-webhook] subscription cancel failed", error);
}

async function processReferral(supabase: SupabaseClient, referralCode: string, referredEmail: string) {
  const { data: referrer } = await supabase
    .from("regen_patients")
    .select("id, name, email")
    .eq("referral_code", referralCode)
    .maybeSingle();

  if (!referrer) return;

  await supabase.from("regen_referrals").insert({
    referrer_id: referrer.id,
    referred_email: referredEmail,
    status: "completed",
    reward_amount: 25,
    completed_at: new Date().toISOString(),
  });

  await sendRegenNotification({
    type: "referral_earned",
    patient: { name: referrer.name, email: referrer.email },
    notes: "$25 off your next order",
  });
}
