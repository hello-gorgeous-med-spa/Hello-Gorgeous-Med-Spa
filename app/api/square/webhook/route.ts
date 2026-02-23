// ============================================================
// SQUARE WEBHOOK HANDLER
// Real-time sync for terminal checkouts, payments, gift cards, refunds
// ============================================================
// SECURITY:
// - Signature verification with SQUARE_WEBHOOK_SIGNATURE_KEY
// - Event deduplication via event_id in square_webhook_events table
// - Secondary idempotency guards for checkout/payment/refund IDs
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { createPaymentReceiptFromSale } from '@/lib/portal/sync-receipt';
import { fetchPaymentDetails } from '@/lib/square/terminal';
import {
  verifyWebhookSignature,
  claimWebhookEvent,
  updateWebhookEventStatus,
  checkTerminalCheckoutProcessed,
  checkPaymentProcessed,
  checkRefundProcessed,
  getWebhookUrl,
  type SquareWebhookEvent,
} from '@/lib/square/webhook';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // ============================================================
  // CRITICAL: Read raw body FIRST, before any JSON parsing!
  // Signature verification requires the exact raw request body.
  // DO NOT use request.json() before signature check.
  // ============================================================
  const body = await request.text();
  let event: SquareWebhookEvent;
  
  try {
    // ============================================================
    // 1. SIGNATURE VERIFICATION (uses raw body + BASE_URL)
    // ============================================================
    const signature = request.headers.get('x-square-hmacsha256-signature');
    const webhookUrl = getWebhookUrl(); // Uses server BASE_URL, not NEXT_PUBLIC_*

    if (process.env.SQUARE_WEBHOOK_SIGNATURE_KEY && signature) {
      const verification = verifyWebhookSignature(signature, body, webhookUrl);
      if (!verification.valid) {
        console.error('Invalid Square webhook signature:', verification.error);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    event = JSON.parse(body);
    
    // ============================================================
    // 2. PRIMARY IDEMPOTENCY: CLAIM EVENT_ID FIRST
    // Insert event_id atomically before processing
    // If insert fails (duplicate), short-circuit with 200
    // ============================================================
    const eventId = event.event_id;
    if (!eventId) {
      console.error('Webhook missing event_id');
      return NextResponse.json({ error: 'Missing event_id' }, { status: 400 });
    }

    // Atomic claim: insert event_id, if conflict → another worker has it
    const { isNew, existingEvent } = await claimWebhookEvent(event);
    if (!isNew) {
      console.log('Duplicate webhook event ignored:', eventId, 'First received:', existingEvent?.received_at);
      return NextResponse.json({ received: true, duplicate: true });
    }

    console.log('Square webhook claimed:', event.type, 'Event ID:', eventId);

    const supabase = createServerSupabaseClient();

    // ============================================================
    // GIFT CARD EVENTS
    // ============================================================
    
    if (event.type === 'gift_card.created') {
      const giftCard = event.data.object.gift_card;
      
      const { data: existing } = await supabase
        .from('gift_cards')
        .select('id')
        .eq('square_gift_card_id', giftCard.id)
        .single();

      if (!existing) {
        await supabase.from('gift_cards').insert({
          square_gift_card_id: giftCard.id,
          square_gan: giftCard.gan,
          gan_last_4: giftCard.gan?.slice(-4),
          initial_value: Number(giftCard.balance_money?.amount || 0) / 100,
          current_balance: Number(giftCard.balance_money?.amount || 0) / 100,
          status: giftCard.state === 'ACTIVE' ? 'active' : 'pending',
          card_type: giftCard.type?.toLowerCase() || 'digital',
          source: 'online',
          last_synced_at: new Date().toISOString(),
        });
        console.log('Gift card created from webhook:', giftCard.id);
      }
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    else if (event.type === 'gift_card.updated') {
      const giftCard = event.data.object.gift_card;
      
      const { data: existing } = await supabase
        .from('gift_cards')
        .select('id, current_balance')
        .eq('square_gift_card_id', giftCard.id)
        .single();

      if (existing) {
        const newBalance = Number(giftCard.balance_money?.amount || 0) / 100;
        
        await supabase
          .from('gift_cards')
          .update({
            current_balance: newBalance,
            status: mapSquareStatus(giftCard.state),
            last_synced_at: new Date().toISOString(),
            needs_sync: false,
          })
          .eq('square_gift_card_id', giftCard.id);

        if (existing.current_balance !== newBalance) {
          await supabase.from('gift_card_transactions').insert({
            gift_card_id: existing.id,
            transaction_type: newBalance > existing.current_balance ? 'adjustment_up' : 'adjustment_down',
            amount: newBalance - existing.current_balance,
            balance_before: existing.current_balance,
            balance_after: newBalance,
            notes: 'Synced from Square webhook',
          });
        }
        console.log('Gift card updated from webhook:', giftCard.id);
      }
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    else if (event.type === 'gift_card.activity.created') {
      const activity = event.data.object.gift_card_activity;
      
      const { data: giftCard } = await supabase
        .from('gift_cards')
        .select('id, current_balance')
        .eq('square_gift_card_id', activity.gift_card_id)
        .single();

      if (giftCard) {
        const { data: existingTxn } = await supabase
          .from('gift_card_transactions')
          .select('id')
          .eq('square_activity_id', activity.id)
          .single();

        if (!existingTxn) {
          const newBalance = Number(activity.gift_card_balance_money?.amount || 0) / 100;
          const txnType = mapActivityType(activity.type);
          const amount = calculateActivityAmount(activity);

          await supabase.from('gift_card_transactions').insert({
            gift_card_id: giftCard.id,
            square_activity_id: activity.id,
            transaction_type: txnType,
            amount,
            balance_before: giftCard.current_balance,
            balance_after: newBalance,
            location_id: activity.location_id,
            notes: `Synced from Square: ${activity.type}`,
          });

          await supabase
            .from('gift_cards')
            .update({
              current_balance: newBalance,
              status: newBalance > 0 ? 'active' : 'redeemed',
              last_used_at: ['REDEEM', 'LOAD'].includes(activity.type) ? new Date().toISOString() : undefined,
              last_synced_at: new Date().toISOString(),
            })
            .eq('id', giftCard.id);

          console.log('Gift card activity logged:', activity.type);
        }
      }
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    // ============================================================
    // TERMINAL CHECKOUT EVENTS
    // ============================================================

    else if (event.type === 'terminal.checkout.created') {
      const checkout = event.data.object.checkout;
      console.log('Terminal checkout created:', checkout.id, 'Status:', checkout.status);
      
      await supabase
        .from('terminal_checkouts')
        .update({ 
          status: checkout.status,
          updated_at: new Date().toISOString(),
        })
        .eq('square_checkout_id', checkout.id);
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    else if (event.type === 'terminal.checkout.updated') {
      const checkout = event.data.object.checkout;
      const status = checkout.status;
      const checkoutId = checkout.id;
      
      console.log('Terminal checkout updated:', checkoutId, 'Status:', status);
      
      // Secondary idempotency check
      const alreadyProcessed = await checkTerminalCheckoutProcessed(checkoutId, status);
      if (alreadyProcessed) {
        console.log('Terminal checkout already in final state, skipping:', checkoutId);
        await updateWebhookEventStatus(eventId, 'skipped', 'Already in final state');
        return NextResponse.json({ received: true, skipped: true });
      }
      
      const { data: terminalCheckout } = await supabase
        .from('terminal_checkouts')
        .select('*, sale_id, payment_id')
        .eq('square_checkout_id', checkoutId)
        .single();
      
      if (terminalCheckout) {
        const checkoutUpdate: Record<string, any> = {
          status,
          updated_at: new Date().toISOString(),
        };
        
        if (status === 'COMPLETED') {
          checkoutUpdate.completed_at = new Date().toISOString();
          
          // ============================================================
          // FINALIZE TOTALS FROM PAYMENT
          // tip-on-device means we must fetch Payment to get final amounts
          // ============================================================
          const paymentIds = checkout.payment_ids || [];
          if (paymentIds.length > 0) {
            // If multiple payment_ids, log anomaly and use the last (newest) one
            if (paymentIds.length > 1) {
              console.warn(
                'Multiple payment_ids on checkout:', checkoutId,
                'Count:', paymentIds.length,
                'IDs:', paymentIds
              );
            }
            
            // Select the last (newest) payment_id
            const selectedPaymentId = paymentIds[paymentIds.length - 1];
            checkoutUpdate.square_payment_id = selectedPaymentId;
            
            const paymentDetails = await fetchPaymentDetails(selectedPaymentId);
            
            if (paymentDetails) {
              checkoutUpdate.tip_money = paymentDetails.tipMoney;
              
              // Final amounts come from Payment, NOT checkout
              const totalCollected = paymentDetails.totalMoney;
              const tipAmount = paymentDetails.tipMoney;
              
              await supabase
                .from('sales')
                .update({
                  status: 'completed',
                  tip_total: tipAmount,
                  gross_total: terminalCheckout.amount_money + tipAmount,
                  net_total: terminalCheckout.amount_money + tipAmount,
                  amount_paid: totalCollected,
                  balance_due: 0,
                  completed_at: new Date().toISOString(),
                })
                .eq('id', terminalCheckout.sale_id);
              
              // Estimate Square processing fee: 2.6% + $0.10
              const processingFee = Math.round(totalCollected * 0.026 + 10);
              
              await supabase
                .from('sale_payments')
                .update({
                  status: 'completed',
                  tip_amount: tipAmount,
                  amount: totalCollected,
                  net_amount: totalCollected - processingFee,
                  processing_fee: processingFee,
                  square_payment_id: paymentDetails.paymentId,
                  processor_transaction_id: paymentDetails.paymentId,
                  processor_receipt_url: paymentDetails.receiptUrl,
                  card_brand: paymentDetails.cardBrand,
                  card_last_four: paymentDetails.cardLast4,
                  terminal_status: 'COMPLETED',
                  raw_square_response: paymentDetails.rawPayment,
                  processed_at: new Date().toISOString(),
                })
                .eq('square_terminal_checkout_id', checkoutId);
              
              console.log('Terminal payment finalized:', paymentDetails.paymentId, 'Total:', totalCollected, 'Tip:', tipAmount);
              createPaymentReceiptFromSale(supabase, terminalCheckout.sale_id).then((r) => {
                if (r.created) console.log('[Webhook] Portal receipt created for terminal payment');
              }).catch((e) => console.warn('[Webhook] Portal receipt sync failed:', e));

              // Client Intelligence Engine: update LTV and visits
              if (terminalCheckout.sale_id) {
                const { data: sale } = await supabase.from('sales').select('client_id').eq('id', terminalCheckout.sale_id).single();
                if (sale?.client_id) {
                  const { data: client } = await supabase.from('clients').select('total_lifetime_value_cents, total_visits').eq('id', sale.client_id).single();
                  if (client) {
                    await supabase.from('clients').update({
                      total_lifetime_value_cents: (Number(client.total_lifetime_value_cents) || 0) + totalCollected,
                      total_visits: (Number(client.total_visits) || 0) + 1,
                      last_visit_date: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }).eq('id', sale.client_id);
                  }
                }
              }
            }
          }
        } else if (status === 'CANCELED') {
          checkoutUpdate.canceled_at = new Date().toISOString();
          checkoutUpdate.error_code = checkout.cancel_reason;
          
          await supabase
            .from('sales')
            .update({ status: 'unpaid' })
            .eq('id', terminalCheckout.sale_id);
          
          await supabase
            .from('sale_payments')
            .update({
              status: 'voided',
              terminal_status: 'CANCELED',
            })
            .eq('square_terminal_checkout_id', checkoutId);
          
          console.log('Terminal checkout canceled:', checkoutId, 'Reason:', checkout.cancel_reason);
        } else if (status === 'FAILED') {
          checkoutUpdate.error_code = checkout.cancel_reason;
          checkoutUpdate.error_message = 'Payment failed';
          
          await supabase
            .from('sales')
            .update({ status: 'unpaid' })
            .eq('id', terminalCheckout.sale_id);
          
          await supabase
            .from('sale_payments')
            .update({
              status: 'failed',
              terminal_status: 'FAILED',
            })
            .eq('square_terminal_checkout_id', checkoutId);
          
          console.log('Terminal checkout failed:', checkoutId);
        }
        
        await supabase
          .from('terminal_checkouts')
          .update(checkoutUpdate)
          .eq('square_checkout_id', checkoutId);
      }
      
      // Update last_webhook_at on connection
      await supabase
        .from('square_connections')
        .update({ last_webhook_at: new Date().toISOString() })
        .eq('status', 'active');
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    // ============================================================
    // PAYMENT EVENTS
    // ============================================================

    else if (event.type === 'payment.updated' || event.type === 'payment.completed') {
      const payment = event.data.object.payment;
      
      console.log('Payment event:', event.type, payment.id, 'Status:', payment.status);
      
      // Secondary idempotency check
      const alreadyProcessed = await checkPaymentProcessed(payment.id);
      if (alreadyProcessed) {
        console.log('Payment already processed, skipping:', payment.id);
        await updateWebhookEventStatus(eventId, 'skipped', 'Already processed');
        return NextResponse.json({ received: true, skipped: true });
      }
      
      // Only process completed payments
      if (payment.status === 'COMPLETED' && payment.terminal_checkout_id) {
        const { data: existingPayment } = await supabase
          .from('sale_payments')
          .select('id, status, sale_id')
          .eq('square_terminal_checkout_id', payment.terminal_checkout_id)
          .single();
        
        if (existingPayment && existingPayment.status !== 'completed') {
          const tipAmount = Number(payment.tip_money?.amount || 0);
          const totalAmount = Number(payment.total_money?.amount || 0);
          
          await supabase
            .from('sale_payments')
            .update({
              status: 'completed',
              tip_amount: tipAmount,
              amount: totalAmount,
              square_payment_id: payment.id,
              processor_transaction_id: payment.id,
              processor_receipt_url: payment.receipt_url,
              card_brand: payment.card_details?.card?.card_brand,
              card_last_four: payment.card_details?.card?.last_4,
              terminal_status: 'COMPLETED',
              processed_at: new Date().toISOString(),
            })
            .eq('id', existingPayment.id);
          
          // Client Intelligence Engine: update LTV and visits when payment completes
          if (existingPayment.sale_id) {
            const { data: sale } = await supabase
              .from('sales')
              .select('client_id')
              .eq('id', existingPayment.sale_id)
              .single();
            if (sale?.client_id) {
              const { data: client } = await supabase
                .from('clients')
                .select('total_lifetime_value_cents, total_visits')
                .eq('id', sale.client_id)
                .single();
              if (client) {
                await supabase
                  .from('clients')
                  .update({
                    total_lifetime_value_cents: (Number(client.total_lifetime_value_cents) || 0) + totalAmount,
                    total_visits: (Number(client.total_visits) || 0) + 1,
                    last_visit_date: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  })
                  .eq('id', sale.client_id);
              }
            }
          }
          
          console.log('Payment updated from payment.updated webhook');
        }
      }
      
      // Handle gift card payments
      if (payment.source_type === 'GIFT_CARD') {
        console.log('Payment with gift card:', payment.id);
      }
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    // ============================================================
    // REFUND EVENTS
    // ============================================================

    else if (event.type === 'refund.created' || event.type === 'refund.updated') {
      const refund = event.data.object.refund;
      
      console.log('Refund event:', event.type, refund.id, 'Status:', refund.status);
      
      // Secondary idempotency check
      const alreadyProcessed = await checkRefundProcessed(refund.id);
      if (alreadyProcessed) {
        console.log('Refund already processed, skipping:', refund.id);
        await updateWebhookEventStatus(eventId, 'skipped', 'Already processed');
        return NextResponse.json({ received: true, skipped: true });
      }
      
      const { data: existingRefund } = await supabase
        .from('refunds')
        .select('id')
        .eq('square_refund_id', refund.id)
        .single();
      
      if (existingRefund) {
        await supabase
          .from('refunds')
          .update({
            status: refund.status?.toLowerCase() || 'completed',
            processed_at: new Date().toISOString(),
            raw_square_response: refund,
          })
          .eq('id', existingRefund.id);
      } else if (refund.payment_id) {
        // External refund - link to our payment
        const { data: payment } = await supabase
          .from('sale_payments')
          .select('id, sale_id')
          .or(`square_payment_id.eq.${refund.payment_id},processor_transaction_id.eq.${refund.payment_id}`)
          .single();
        
        if (payment) {
          const refundAmount = Number(refund.amount_money?.amount || 0);
          
          await supabase.from('refunds').insert({
            sale_id: payment.sale_id,
            payment_id: payment.id,
            square_refund_id: refund.id,
            square_payment_id: refund.payment_id,
            amount: refundAmount,
            reason: refund.reason || 'Refunded via Square Dashboard',
            refund_type: 'partial',
            status: refund.status?.toLowerCase() || 'completed',
            raw_square_response: refund,
            processed_at: new Date().toISOString(),
          });
          
          const { data: sale } = await supabase
            .from('sales')
            .select('gross_total, amount_paid')
            .eq('id', payment.sale_id)
            .single();
          
          if (sale) {
            const newStatus = refundAmount >= sale.amount_paid ? 'refunded' : 'partially_paid';
            await supabase
              .from('sales')
              .update({ 
                status: newStatus,
                amount_paid: sale.amount_paid - refundAmount,
                balance_due: sale.gross_total - (sale.amount_paid - refundAmount),
              })
              .eq('id', payment.sale_id);
          }
          
          await supabase
            .from('sale_payments')
            .update({
              status: 'refunded',
              refund_amount: refundAmount,
              refund_reason: refund.reason,
              refunded_at: new Date().toISOString(),
            })
            .eq('id', payment.id);
          
          console.log('External refund recorded:', refund.id);
        }
      }
      
      await updateWebhookEventStatus(eventId, 'processed');
    }

    // ============================================================
    // UNSUPPORTED EVENT TYPES
    // ============================================================
    
    else {
      console.log('Unsupported webhook event type:', event.type);
      await updateWebhookEventStatus(eventId, 'skipped', `Unsupported event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Square webhook error:', error);
    
    // Try to update the failed event status
    try {
      if (event! && event.event_id) {
        await updateWebhookEventStatus(event.event_id, 'failed', String(error));
      }
    } catch (recordError) {
      console.error('Failed to update webhook error status:', recordError);
    }
    
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function mapSquareStatus(squareState: string): string {
  switch (squareState) {
    case 'ACTIVE': return 'active';
    case 'DEACTIVATED': return 'voided';
    case 'BLOCKED': return 'blocked';
    case 'PENDING': return 'pending';
    default: return 'active';
  }
}

function mapActivityType(squareType: string): string {
  switch (squareType) {
    case 'ACTIVATE': return 'purchase';
    case 'LOAD': return 'load';
    case 'REDEEM': return 'redemption';
    case 'CLEAR_BALANCE': return 'void';
    case 'DEACTIVATE': return 'void';
    case 'ADJUST_INCREMENT': return 'adjustment_up';
    case 'ADJUST_DECREMENT': return 'adjustment_down';
    default: return 'adjustment_up';
  }
}

function calculateActivityAmount(activity: any): number {
  const details = 
    activity.activate_activity_details ||
    activity.load_activity_details ||
    activity.redeem_activity_details ||
    activity.adjust_increment_activity_details ||
    activity.adjust_decrement_activity_details;

  if (details?.amount_money?.amount) {
    const amount = Number(details.amount_money.amount) / 100;
    if (['REDEEM', 'ADJUST_DECREMENT', 'CLEAR_BALANCE', 'DEACTIVATE'].includes(activity.type)) {
      return -amount;
    }
    return amount;
  }

  return 0;
}
