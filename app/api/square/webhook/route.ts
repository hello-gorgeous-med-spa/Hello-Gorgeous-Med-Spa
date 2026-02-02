// ============================================================
// SQUARE WEBHOOK HANDLER
// Real-time sync for gift cards and payments
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import crypto from 'crypto';

// Verify Square webhook signature
function verifySignature(
  body: string,
  signature: string,
  webhookSignatureKey: string,
  notificationUrl: string
): boolean {
  const payload = notificationUrl + body;
  const hmac = crypto.createHmac('sha256', webhookSignatureKey);
  hmac.update(payload, 'utf8');
  const expectedSignature = 'sha256=' + hmac.digest('base64');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-square-hmacsha256-signature');
    const webhookSignatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
    const webhookUrl = process.env.SQUARE_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/api/square/webhook`;

    // Verify signature in production
    if (webhookSignatureKey && signature) {
      const isValid = verifySignature(body, signature, webhookSignatureKey, webhookUrl);
      if (!isValid) {
        console.error('Invalid Square webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const supabase = createServerSupabaseClient();

    console.log('Square webhook received:', event.type);

    // ============================================================
    // GIFT CARD EVENTS
    // ============================================================
    
    // Gift card created (online purchase)
    if (event.type === 'gift_card.created') {
      const giftCard = event.data.object.gift_card;
      
      // Check if we already have this card
      const { data: existing } = await supabase
        .from('gift_cards')
        .select('id')
        .eq('square_gift_card_id', giftCard.id)
        .single();

      if (!existing) {
        // Create new record for card created outside our system (online)
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
    }

    // Gift card updated (balance change, status change)
    if (event.type === 'gift_card.updated') {
      const giftCard = event.data.object.gift_card;
      
      // Update our record
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

        // If balance changed and we didn't initiate it, log the sync
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
    }

    // ============================================================
    // GIFT CARD ACTIVITY EVENTS
    // ============================================================

    if (event.type === 'gift_card.activity.created') {
      const activity = event.data.object.gift_card_activity;
      
      // Find our gift card
      const { data: giftCard } = await supabase
        .from('gift_cards')
        .select('id, current_balance')
        .eq('square_gift_card_id', activity.gift_card_id)
        .single();

      if (giftCard) {
        // Check if we already logged this activity
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

          // Update balance
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
    }

    // ============================================================
    // PAYMENT EVENTS (for gift card purchases/redemptions)
    // ============================================================

    if (event.type === 'payment.completed') {
      const payment = event.data.object.payment;
      
      // Check if payment involves gift cards
      if (payment.source_type === 'GIFT_CARD') {
        // This is a payment made WITH a gift card - we likely already handled this
        // via our redemption flow, but double-check sync
        console.log('Payment with gift card:', payment.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Square webhook error:', error);
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
  // Try to extract amount from the activity details
  const details = 
    activity.activate_activity_details ||
    activity.load_activity_details ||
    activity.redeem_activity_details ||
    activity.adjust_increment_activity_details ||
    activity.adjust_decrement_activity_details;

  if (details?.amount_money?.amount) {
    const amount = Number(details.amount_money.amount) / 100;
    // Redemptions and decrements should be negative
    if (['REDEEM', 'ADJUST_DECREMENT', 'CLEAR_BALANCE', 'DEACTIVATE'].includes(activity.type)) {
      return -amount;
    }
    return amount;
  }

  return 0;
}
