// ============================================================
// GIFT CARDS API
// CRUD operations for gift cards
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Generate unique gift card code
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing characters
  let code = 'HG-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/gift-cards - List gift cards
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const code = searchParams.get('code'); // For looking up specific card

  try {
    let query = supabase
      .from('gift_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (code) {
      query = query.eq('code', code.toUpperCase());
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`code.ilike.%${search}%,recipient_name.ilike.%${search}%,recipient_email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate stats
    const cards = data || [];
    const stats = {
      activeCount: cards.filter(c => c.status === 'active').length,
      totalLiability: cards.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.current_balance || 0), 0),
      totalSold: cards.reduce((sum, c) => sum + (c.initial_amount || 0), 0),
      redeemedCount: cards.filter(c => c.status === 'redeemed').length,
    };

    return NextResponse.json({ giftCards: cards, stats });
  } catch (error) {
    console.error('Error fetching gift cards:', error);
    return NextResponse.json({ error: 'Failed to fetch gift cards' }, { status: 500 });
  }
}

// POST /api/gift-cards - Create/sell new gift card
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      amount,
      recipient_name,
      recipient_email,
      recipient_phone,
      gift_message,
      purchaser_name,
      purchaser_email,
      purchaser_client_id,
      sold_by,
      expires_months = 24, // Default 2 year expiration
    } = body;

    if (!amount || amount < 10) {
      return NextResponse.json({ error: 'Minimum gift card amount is $10' }, { status: 400 });
    }

    // Generate unique code
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const { data: existing } = await supabase
        .from('gift_cards')
        .select('id')
        .eq('code', code)
        .single();
      
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    // Calculate expiration
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + expires_months);

    const { data, error } = await supabase
      .from('gift_cards')
      .insert({
        code,
        initial_amount: amount,
        current_balance: amount,
        status: 'active',
        recipient_name,
        recipient_email,
        recipient_phone,
        gift_message,
        purchaser_name,
        purchaser_email,
        purchaser_client_id,
        sold_by,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Record initial transaction
    await supabase
      .from('gift_card_transactions')
      .insert({
        gift_card_id: data.id,
        transaction_type: 'purchase',
        amount,
        balance_before: 0,
        balance_after: amount,
        performed_by: sold_by,
        notes: `Gift card purchased for ${recipient_name || 'recipient'}`,
      });

    return NextResponse.json({ giftCard: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating gift card:', error);
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
  }
}

// PATCH /api/gift-cards - Redeem gift card
export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      code,
      redeem_amount,
      appointment_id,
      transaction_id,
      performed_by,
      notes,
    } = body;

    if (!code || !redeem_amount) {
      return NextResponse.json({ error: 'Code and redeem amount required' }, { status: 400 });
    }

    // Find gift card
    const { data: card, error: findError } = await supabase
      .from('gift_cards')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (findError || !card) {
      return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });
    }

    if (card.status !== 'active') {
      return NextResponse.json({ error: `Gift card is ${card.status}` }, { status: 400 });
    }

    if (card.expires_at && new Date(card.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Gift card has expired' }, { status: 400 });
    }

    if (redeem_amount > card.current_balance) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        available: card.current_balance,
      }, { status: 400 });
    }

    const newBalance = card.current_balance - redeem_amount;
    const newStatus = newBalance === 0 ? 'redeemed' : 'active';

    // Update card
    const { error: updateError } = await supabase
      .from('gift_cards')
      .update({
        current_balance: newBalance,
        status: newStatus,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', card.id);

    if (updateError) throw updateError;

    // Record transaction
    await supabase
      .from('gift_card_transactions')
      .insert({
        gift_card_id: card.id,
        transaction_type: 'redemption',
        amount: -redeem_amount,
        balance_before: card.current_balance,
        balance_after: newBalance,
        related_transaction_id: transaction_id,
        appointment_id,
        performed_by,
        notes,
      });

    return NextResponse.json({
      success: true,
      amountRedeemed: redeem_amount,
      newBalance,
      status: newStatus,
    });
  } catch (error) {
    console.error('Error redeeming gift card:', error);
    return NextResponse.json({ error: 'Failed to redeem gift card' }, { status: 500 });
  }
}
