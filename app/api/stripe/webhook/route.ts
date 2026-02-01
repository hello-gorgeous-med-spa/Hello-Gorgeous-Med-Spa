// ============================================================
// STRIPE WEBHOOK HANDLER
// Handles Stripe events (payment success, refunds, disputes)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import Stripe from 'stripe';

// Disable body parsing for webhooks (we need raw body)
export const runtime = 'nodejs';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;
const TELNYX_PHONE = process.env.TELNYX_PHONE_NUMBER;
const OWNER_PHONE = '+16306366193'; // Alert owner directly

// Send SMS alert for urgent issues like chargebacks
async function sendUrgentSMS(message: string) {
  if (!TELNYX_API_KEY || !TELNYX_PHONE) {
    console.warn('SMS not configured - cannot send alert');
    return;
  }
  
  try {
    await fetch('https://api.telnyx.com/v2/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TELNYX_API_KEY}`,
      },
      body: JSON.stringify({
        from: TELNYX_PHONE,
        to: OWNER_PHONE,
        text: message,
      }),
    });
    console.log('Alert SMS sent to owner');
  } catch (err) {
    console.error('Failed to send alert SMS:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 400 }
        );
      }
    } else {
      // If no webhook secret, parse event without verification (dev only)
      event = JSON.parse(body) as Stripe.Event;
      console.warn('⚠️ Webhook signature not verified - add STRIPE_WEBHOOK_SECRET for production');
    }

    const supabase = createServerSupabaseClient();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('💰 Payment succeeded:', paymentIntent.id);
        console.log('   Amount:', paymentIntent.amount / 100);
        console.log('   Client:', paymentIntent.metadata?.clientName);
        console.log('   Services:', paymentIntent.metadata?.services);
        
        // Update transaction status in database
        await supabase
          .from('transactions')
          .update({ status: 'completed' })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('❌ Payment failed:', paymentIntent.id);
        console.error('   Error:', paymentIntent.last_payment_error?.message);
        
        // Update transaction status
        await supabase
          .from('transactions')
          .update({ 
            status: 'failed',
            notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
          })
          .eq('stripe_payment_intent_id', paymentIntent.id);
        
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('↩️ Refund processed:', charge.id);
        console.log('   Amount refunded:', charge.amount_refunded / 100);
        
        // Log refund
        await supabase.from('payment_events').insert({
          event_type: 'refund',
          stripe_event_id: event.id,
          stripe_charge_id: charge.id,
          amount_cents: charge.amount_refunded,
          details: { refund_amount: charge.amount_refunded / 100 },
        });
        
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.warn('🚨 CHARGEBACK ALERT:', dispute.id);
        console.warn('   Amount:', dispute.amount / 100);
        console.warn('   Reason:', dispute.reason);
        
        // Store dispute record
        await supabase.from('payment_events').insert({
          event_type: 'dispute',
          stripe_event_id: event.id,
          stripe_dispute_id: dispute.id,
          stripe_charge_id: dispute.charge as string,
          amount_cents: dispute.amount,
          status: dispute.status,
          details: {
            reason: dispute.reason,
            evidence_due_by: dispute.evidence_details?.due_by,
          },
        });
        
        // SEND URGENT SMS ALERT TO OWNER
        const amount = (dispute.amount / 100).toFixed(2);
        await sendUrgentSMS(
          `🚨 CHARGEBACK ALERT\n` +
          `Amount: $${amount}\n` +
          `Reason: ${dispute.reason}\n` +
          `Respond in Stripe Dashboard ASAP!\n` +
          `dashboard.stripe.com`
        );
        
        break;
      }

      case 'charge.dispute.closed': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Dispute closed:', dispute.id, 'Status:', dispute.status);
        
        // Update dispute record
        await supabase
          .from('payment_events')
          .update({ status: dispute.status })
          .eq('stripe_dispute_id', dispute.id);
        
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
