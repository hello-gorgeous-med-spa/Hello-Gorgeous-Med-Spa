import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { sendRegenNotification } from '@/lib/regen/notifications';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(supabase, session);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(supabase, paymentIntent);
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(supabase, invoice);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(supabase, subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(supabase, subscription);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutComplete(supabase: ReturnType<typeof createServerSupabaseClient>, session: Stripe.Checkout.Session) {
  const email = session.customer_email || session.customer_details?.email;
  if (!email) return;

  // Update intake status to pending (paid)
  const { data: intake } = await supabase
    .from('regen_intakes')
    .update({
      status: 'pending',
      stripe_payment_intent_id: session.payment_intent as string,
      amount_paid: (session.amount_total || 0) / 100,
      updated_at: new Date().toISOString(),
    })
    .eq('email', email.toLowerCase())
    .eq('status', 'awaiting_payment')
    .order('created_at', { ascending: false })
    .limit(1)
    .select()
    .single();

  if (intake) {
    // Send welcome email
    await sendRegenNotification({
      type: 'welcome',
      patient: { name: intake.name, email: intake.email },
    });

    // Check for referral
    if (session.metadata?.referral_code) {
      await processReferral(supabase, session.metadata.referral_code, email);
    }
  }
}

async function handlePaymentSuccess(supabase: ReturnType<typeof createServerSupabaseClient>, paymentIntent: Stripe.PaymentIntent) {
  // Update any orders with this payment intent
  await supabase
    .from('regen_orders')
    .update({
      status: 'processing',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id)
    .eq('status', 'pending');
}

async function handleInvoicePaid(supabase: ReturnType<typeof createServerSupabaseClient>, invoice: Stripe.Invoice) {
  const email = invoice.customer_email;
  if (!email) return;

  // Update any orders with this invoice
  await supabase
    .from('regen_orders')
    .update({
      status: 'processing',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_invoice_id', invoice.id)
    .eq('status', 'pending');
}

async function handleSubscriptionUpdate(supabase: ReturnType<typeof createServerSupabaseClient>, subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Get customer email
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || customer.deleted) return;

  const email = (customer as Stripe.Customer).email;
  if (!email) return;

  // Get patient
  const { data: patient } = await supabase
    .from('regen_patients')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (!patient) return;

  // Update subscription record
  await supabase
    .from('regen_subscriptions')
    .upsert({
      patient_id: patient.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'stripe_subscription_id',
    });
}

async function handleSubscriptionCanceled(supabase: ReturnType<typeof createServerSupabaseClient>, subscription: Stripe.Subscription) {
  await supabase
    .from('regen_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

async function processReferral(supabase: ReturnType<typeof createServerSupabaseClient>, referralCode: string, referredEmail: string) {
  // Find the referrer
  const { data: referrer } = await supabase
    .from('regen_patients')
    .select('id, name, email')
    .eq('referral_code', referralCode)
    .single();

  if (!referrer) return;

  // Record the referral
  await supabase.from('regen_referrals').insert({
    referrer_id: referrer.id,
    referred_email: referredEmail,
    status: 'completed',
    reward_amount: 25,
    completed_at: new Date().toISOString(),
  });

  // Send notification to referrer
  await sendRegenNotification({
    type: 'referral_earned',
    patient: { name: referrer.name, email: referrer.email },
    notes: '$25 off your next order',
  });
}
