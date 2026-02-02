// ============================================================
// CLIENT WALLET API
// Gift cards, store credit, and payment methods for a client
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ============================================================
// GET - Get client's wallet (gift cards, credits, etc)
// ============================================================
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: clientId } = await params;
    const supabase = createServerSupabaseClient();

    // Get gift cards where client is recipient OR purchaser
    const { data: giftCards, error: gcError } = await supabase
      .from('gift_cards')
      .select(`
        id,
        code,
        gan_last_4,
        initial_value,
        current_balance,
        status,
        card_type,
        expires_at,
        purchaser_name,
        recipient_name,
        message,
        created_at,
        last_used_at,
        purchaser_client_id,
        recipient_client_id
      `)
      .or(`recipient_client_id.eq.${clientId},purchaser_client_id.eq.${clientId}`)
      .in('status', ['active', 'pending'])
      .gt('current_balance', 0)
      .order('created_at', { ascending: false });

    if (gcError) {
      console.error('Gift cards fetch error:', gcError);
    }

    // Get transaction history for these gift cards
    const giftCardIds = (giftCards || []).map(gc => gc.id);
    let transactions: any[] = [];
    
    if (giftCardIds.length > 0) {
      const { data: txns } = await supabase
        .from('gift_card_transactions')
        .select('*')
        .in('gift_card_id', giftCardIds)
        .order('created_at', { ascending: false })
        .limit(20);
      
      transactions = txns || [];
    }

    // Calculate totals
    const totalGiftCardBalance = (giftCards || [])
      .reduce((sum, gc) => sum + (gc.current_balance || 0), 0);

    // Format gift cards for client view
    const formattedCards = (giftCards || []).map(gc => ({
      id: gc.id,
      code: gc.code,
      last4: gc.gan_last_4 || gc.code?.slice(-4) || '****',
      initialValue: gc.initial_value,
      currentBalance: gc.current_balance,
      status: gc.status,
      type: gc.card_type,
      expiresAt: gc.expires_at,
      isExpired: gc.expires_at ? new Date(gc.expires_at) < new Date() : false,
      isOwned: gc.recipient_client_id === clientId,
      isPurchased: gc.purchaser_client_id === clientId,
      purchaserName: gc.purchaser_name,
      message: gc.message,
      createdAt: gc.created_at,
      lastUsedAt: gc.last_used_at,
    }));

    // Get any store credits (if implemented)
    // const { data: credits } = await supabase
    //   .from('store_credits')
    //   .select('*')
    //   .eq('client_id', clientId)
    //   .eq('status', 'active');

    return NextResponse.json({
      wallet: {
        giftCards: formattedCards,
        giftCardBalance: totalGiftCardBalance,
        // storeCredits: credits || [],
        // storeCreditBalance: (credits || []).reduce((sum, c) => sum + c.balance, 0),
        totalAvailable: totalGiftCardBalance, // + store credit balance
      },
      recentTransactions: transactions.map(txn => ({
        id: txn.id,
        type: txn.transaction_type,
        amount: txn.amount,
        balanceAfter: txn.balance_after,
        createdAt: txn.created_at,
        notes: txn.notes,
      })),
    });
  } catch (error) {
    console.error('Wallet GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
  }
}

// ============================================================
// POST - Apply wallet to checkout
// ============================================================
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: clientId } = await params;
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      gift_card_id,
      amount,
      appointment_id,
      transaction_reference,
    } = body;

    if (!gift_card_id || !amount) {
      return NextResponse.json({ error: 'Gift card ID and amount required' }, { status: 400 });
    }

    // Verify ownership
    const { data: giftCard, error: gcError } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('id', gift_card_id)
      .or(`recipient_client_id.eq.${clientId},purchaser_client_id.eq.${clientId}`)
      .single();

    if (gcError || !giftCard) {
      return NextResponse.json({ error: 'Gift card not found or not owned by client' }, { status: 404 });
    }

    if (giftCard.status !== 'active') {
      return NextResponse.json({ error: 'Gift card is not active' }, { status: 400 });
    }

    if (amount > giftCard.current_balance) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        available: giftCard.current_balance,
      }, { status: 400 });
    }

    // Check expiration
    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Gift card has expired' }, { status: 400 });
    }

    // This endpoint just validates - actual redemption happens through the main gift card API
    // Return confirmation that this redemption would be valid
    return NextResponse.json({
      valid: true,
      giftCard: {
        id: giftCard.id,
        code: giftCard.code,
        currentBalance: giftCard.current_balance,
        amountToApply: Math.min(amount, giftCard.current_balance),
        remainingAfter: giftCard.current_balance - Math.min(amount, giftCard.current_balance),
      },
    });
  } catch (error) {
    console.error('Wallet POST error:', error);
    return NextResponse.json({ error: 'Failed to validate redemption' }, { status: 500 });
  }
}
