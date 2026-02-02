// ============================================================
// API: GIFT CARDS - Full Square Integration
// Sell, redeem, track - NO manual reconciliation required
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import {
  createSquareGiftCard,
  activateSquareGiftCard,
  redeemSquareGiftCard,
  getSquareGiftCard,
  getSquareGiftCardByGan,
  linkGiftCardToCustomer,
  deactivateSquareGiftCard,
  adjustSquareGiftCardBalance,
  listGiftCardActivities,
  isSquareConfigured,
  getSquareLocationId,
  dollarsToCents,
  centsToDollars,
} from '@/lib/square/client';

// ============================================================
// GET - List all gift cards or get specific card
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const id = searchParams.get('id');
    const code = searchParams.get('code');
    const clientId = searchParams.get('client_id');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const includeHistory = searchParams.get('include_history') === 'true';

    // Get single gift card by ID or code
    if (id || code) {
      let query = supabase.from('gift_cards').select('*');
      
      if (id) {
        query = query.eq('id', id);
      } else if (code) {
        query = query.eq('code', code.toUpperCase());
      }
      
      const { data: giftCard, error } = await query.single();
      
      if (error || !giftCard) {
        return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });
      }

      // Optionally get transaction history
      let transactions = [];
      if (includeHistory) {
        const { data: txns } = await supabase
          .from('gift_card_transactions')
          .select('*')
          .eq('gift_card_id', giftCard.id)
          .order('created_at', { ascending: false });
        transactions = txns || [];
      }

      return NextResponse.json({ giftCard, transactions });
    }

    // Get gift cards for a specific client (for wallet view)
    if (clientId) {
      const { data: giftCards, error } = await supabase
        .from('gift_cards')
        .select('*')
        .or(`purchaser_client_id.eq.${clientId},recipient_client_id.eq.${clientId}`)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Gift cards fetch error:', error);
        return NextResponse.json({ giftCards: [] });
      }

      return NextResponse.json({ giftCards: giftCards || [] });
    }

    // List all gift cards with filters
    let query = supabase
      .from('gift_cards')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`code.ilike.%${search}%,recipient_name.ilike.%${search}%,recipient_email.ilike.%${search}%,gan_last_4.ilike.%${search}%`);
    }

    const { data: giftCards, error } = await query;

    if (error) {
      console.error('Gift cards fetch error:', error);
      return NextResponse.json({ giftCards: [] });
    }

    // Calculate totals for reporting
    const stats = {
      totalCards: giftCards?.length || 0,
      activeCards: giftCards?.filter(gc => gc.status === 'active').length || 0,
      totalLiability: giftCards?.filter(gc => gc.status === 'active').reduce((sum, gc) => sum + (gc.current_balance || 0), 0) || 0,
      totalSold: giftCards?.reduce((sum, gc) => sum + (gc.initial_value || 0), 0) || 0,
      totalRedeemed: giftCards?.reduce((sum, gc) => sum + ((gc.initial_value || 0) - (gc.current_balance || 0)), 0) || 0,
    };

    return NextResponse.json({ giftCards: giftCards || [], stats });
  } catch (error) {
    console.error('Gift cards GET error:', error);
    return NextResponse.json({ giftCards: [], error: 'Failed to fetch gift cards' });
  }
}

// ============================================================
// POST - Create and activate a new gift card
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { 
      initial_amount, 
      recipient_name, 
      recipient_email,
      recipient_phone,
      purchaser_name,
      purchaser_email,
      purchaser_client_id,
      recipient_client_id,
      message,
      expires_at,
      card_type = 'digital',
      source = 'pos',
      payment_id,
      order_id,
    } = body;

    if (!initial_amount || initial_amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    const locationId = getSquareLocationId();
    let squareGiftCard = null;
    let squareActivity = null;

    // Create and activate in Square if configured
    if (isSquareConfigured() && locationId) {
      // Create gift card in Square
      squareGiftCard = await createSquareGiftCard(locationId, card_type === 'physical' ? 'PHYSICAL' : 'DIGITAL');
      
      if (!squareGiftCard) {
        console.warn('Failed to create Square gift card, proceeding with local only');
      } else {
        // Activate with initial value
        squareActivity = await activateSquareGiftCard(
          squareGiftCard.id,
          dollarsToCents(initial_amount),
          locationId,
          order_id
        );

        if (!squareActivity) {
          console.warn('Failed to activate Square gift card');
        }
      }
    }

    // Calculate expiration
    const expiresAtDate = expires_at 
      ? new Date(expires_at) 
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year default

    // Create in database
    const { data: giftCard, error } = await supabase
      .from('gift_cards')
      .insert({
        // Square fields
        square_gift_card_id: squareGiftCard?.id || null,
        square_gan: squareGiftCard?.gan || null,
        gan_last_4: squareGiftCard?.gan ? squareGiftCard.gan.slice(-4) : null,
        
        // Values
        initial_value: initial_amount,
        current_balance: initial_amount,
        status: squareGiftCard ? 'active' : 'pending',
        
        // Client links
        purchaser_client_id,
        recipient_client_id,
        
        // Recipient info
        recipient_name,
        recipient_email,
        recipient_phone,
        
        // Purchaser info
        purchaser_name,
        purchaser_email,
        
        // Details
        message,
        card_type,
        source,
        expires_at: expiresAtDate.toISOString(),
        
        // Payment tracking
        purchase_payment_id: payment_id,
        purchase_order_id: order_id,
        
        // Timestamps
        activated_at: squareGiftCard ? new Date().toISOString() : null,
        last_synced_at: squareGiftCard ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Gift card create error:', error);
      return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
    }

    // Log purchase transaction
    await supabase.from('gift_card_transactions').insert({
      gift_card_id: giftCard.id,
      square_activity_id: squareActivity?.id,
      square_payment_id: payment_id,
      square_order_id: order_id,
      transaction_type: 'purchase',
      amount: initial_amount,
      balance_before: 0,
      balance_after: initial_amount,
      notes: `Gift card purchased for $${initial_amount}`,
      location_id: locationId,
    });

    // Link to Square customer if we have a client
    if (squareGiftCard && recipient_client_id) {
      // Try to get Square customer ID from client
      const { data: client } = await supabase
        .from('clients')
        .select('square_customer_id')
        .eq('id', recipient_client_id)
        .single();

      if (client?.square_customer_id) {
        await linkGiftCardToCustomer(squareGiftCard.id, client.square_customer_id);
      }
    }

    return NextResponse.json({ 
      success: true, 
      giftCard,
      squareLinked: !!squareGiftCard,
    });
  } catch (error) {
    console.error('Gift cards POST error:', error);
    return NextResponse.json({ error: 'Failed to create gift card' }, { status: 500 });
  }
}

// ============================================================
// PUT - Update gift card (redeem, void, adjust, etc)
// ============================================================
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { 
      id, 
      code, 
      action, 
      amount, 
      reason,
      appointment_id,
      transaction_reference,
      payment_id,
      performed_by,
      performed_by_name,
      ...updateData 
    } = body;

    // Find gift card
    let query = supabase.from('gift_cards').select('*');
    if (id) {
      query = query.eq('id', id);
    } else if (code) {
      query = query.eq('code', code.toUpperCase());
    } else {
      return NextResponse.json({ error: 'ID or code required' }, { status: 400 });
    }

    const { data: giftCard, error: fetchError } = await query.single();

    if (fetchError || !giftCard) {
      return NextResponse.json({ error: 'Gift card not found' }, { status: 404 });
    }

    const locationId = getSquareLocationId();

    // ============================================================
    // REDEEM ACTION
    // ============================================================
    if (action === 'redeem') {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Valid redemption amount required' }, { status: 400 });
      }

      if (giftCard.status !== 'active') {
        return NextResponse.json({ error: 'Gift card is not active' }, { status: 400 });
      }

      if (amount > giftCard.current_balance) {
        return NextResponse.json({ 
          error: `Insufficient balance. Available: $${giftCard.current_balance}`,
          available_balance: giftCard.current_balance,
        }, { status: 400 });
      }

      // Check expiration
      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        return NextResponse.json({ error: 'Gift card has expired' }, { status: 400 });
      }

      // Redeem in Square if linked
      let squareActivity = null;
      if (isSquareConfigured() && giftCard.square_gift_card_id && locationId) {
        squareActivity = await redeemSquareGiftCard(
          giftCard.square_gift_card_id,
          dollarsToCents(amount),
          locationId,
          payment_id,
          transaction_reference
        );

        if (!squareActivity) {
          console.warn('Square redemption failed, proceeding with local');
        }
      }

      const newBalance = giftCard.current_balance - amount;
      const newStatus = newBalance <= 0.01 ? 'redeemed' : 'active';

      // Update database
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({
          current_balance: Math.max(0, newBalance),
          status: newStatus,
          last_used_at: new Date().toISOString(),
          last_synced_at: squareActivity ? new Date().toISOString() : giftCard.last_synced_at,
        })
        .eq('id', giftCard.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('gift_card_transactions').insert({
        gift_card_id: giftCard.id,
        square_activity_id: squareActivity?.id,
        square_payment_id: payment_id,
        transaction_type: 'redemption',
        amount: -amount,
        balance_before: giftCard.current_balance,
        balance_after: Math.max(0, newBalance),
        appointment_id,
        transaction_reference,
        performed_by,
        performed_by_name,
        notes: reason || `Redeemed $${amount}`,
        location_id: locationId,
      });

      return NextResponse.json({ 
        success: true, 
        message: `Redeemed $${amount}`,
        newBalance: Math.max(0, newBalance),
        status: newStatus,
        squareSynced: !!squareActivity,
      });
    }

    // ============================================================
    // VOID ACTION
    // ============================================================
    if (action === 'void') {
      // Deactivate in Square if linked
      let squareActivity = null;
      if (isSquareConfigured() && giftCard.square_gift_card_id && locationId) {
        squareActivity = await deactivateSquareGiftCard(
          giftCard.square_gift_card_id,
          locationId,
          reason || 'Voided by admin'
        );
      }

      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({
          status: 'voided',
          current_balance: 0,
          voided_at: new Date().toISOString(),
          void_reason: reason || 'Voided by admin',
          voided_by: performed_by,
          last_synced_at: squareActivity ? new Date().toISOString() : giftCard.last_synced_at,
        })
        .eq('id', giftCard.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('gift_card_transactions').insert({
        gift_card_id: giftCard.id,
        square_activity_id: squareActivity?.id,
        transaction_type: 'void',
        amount: -giftCard.current_balance,
        balance_before: giftCard.current_balance,
        balance_after: 0,
        performed_by,
        performed_by_name,
        reason,
        notes: `Gift card voided. Previous balance: $${giftCard.current_balance}`,
        location_id: locationId,
      });

      return NextResponse.json({ success: true, message: 'Gift card voided' });
    }

    // ============================================================
    // ADJUST BALANCE ACTION
    // ============================================================
    if (action === 'adjust') {
      if (!amount) {
        return NextResponse.json({ error: 'Adjustment amount required' }, { status: 400 });
      }

      const isIncrement = amount > 0;
      const absAmount = Math.abs(amount);
      const newBalance = giftCard.current_balance + amount;

      if (newBalance < 0) {
        return NextResponse.json({ error: 'Cannot adjust below zero' }, { status: 400 });
      }

      // Adjust in Square if linked
      let squareActivity = null;
      if (isSquareConfigured() && giftCard.square_gift_card_id && locationId) {
        squareActivity = await adjustSquareGiftCardBalance(
          giftCard.square_gift_card_id,
          dollarsToCents(absAmount),
          locationId,
          reason || 'Manual adjustment',
          isIncrement
        );
      }

      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({
          current_balance: newBalance,
          status: newBalance > 0 ? 'active' : 'redeemed',
          last_synced_at: squareActivity ? new Date().toISOString() : giftCard.last_synced_at,
        })
        .eq('id', giftCard.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('gift_card_transactions').insert({
        gift_card_id: giftCard.id,
        square_activity_id: squareActivity?.id,
        transaction_type: isIncrement ? 'adjustment_up' : 'adjustment_down',
        amount,
        balance_before: giftCard.current_balance,
        balance_after: newBalance,
        performed_by,
        performed_by_name,
        reason,
        notes: `Balance adjusted by ${isIncrement ? '+' : ''}$${amount}`,
        location_id: locationId,
      });

      return NextResponse.json({ 
        success: true, 
        message: `Balance adjusted to $${newBalance}`,
        newBalance,
      });
    }

    // ============================================================
    // REFUND TO CARD ACTION
    // ============================================================
    if (action === 'refund') {
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Valid refund amount required' }, { status: 400 });
      }

      const newBalance = giftCard.current_balance + amount;

      // Load in Square if linked
      let squareActivity = null;
      if (isSquareConfigured() && giftCard.square_gift_card_id && locationId) {
        const { loadSquareGiftCard } = await import('@/lib/square/client');
        squareActivity = await loadSquareGiftCard(
          giftCard.square_gift_card_id,
          dollarsToCents(amount),
          locationId
        );
      }

      const { error: updateError } = await supabase
        .from('gift_cards')
        .update({
          current_balance: newBalance,
          status: 'active',
          last_synced_at: squareActivity ? new Date().toISOString() : giftCard.last_synced_at,
        })
        .eq('id', giftCard.id);

      if (updateError) throw updateError;

      // Log transaction
      await supabase.from('gift_card_transactions').insert({
        gift_card_id: giftCard.id,
        square_activity_id: squareActivity?.id,
        transaction_type: 'refund',
        amount,
        balance_before: giftCard.current_balance,
        balance_after: newBalance,
        appointment_id,
        performed_by,
        performed_by_name,
        reason,
        notes: `Refund of $${amount} applied to card`,
        location_id: locationId,
      });

      return NextResponse.json({ 
        success: true, 
        message: `Refunded $${amount} to gift card`,
        newBalance,
      });
    }

    // ============================================================
    // REGULAR UPDATE (edit recipient info, etc)
    // ============================================================
    const allowedUpdates: Record<string, any> = {};
    const editableFields = ['recipient_name', 'recipient_email', 'recipient_phone', 'recipient_client_id', 'message', 'expires_at'];
    
    for (const field of editableFields) {
      if (updateData[field] !== undefined) {
        allowedUpdates[field] = updateData[field];
      }
    }

    if (Object.keys(allowedUpdates).length > 0) {
      const { error: updateError } = await supabase
        .from('gift_cards')
        .update(allowedUpdates)
        .eq('id', giftCard.id);

      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true, message: 'Gift card updated' });
  } catch (error) {
    console.error('Gift cards PUT error:', error);
    return NextResponse.json({ error: 'Failed to update gift card' }, { status: 500 });
  }
}

// ============================================================
// DELETE - Not actually deleting, just voiding
// ============================================================
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  // Redirect to void action
  return PUT(new NextRequest(request.url, {
    method: 'PUT',
    body: JSON.stringify({ id, action: 'void', reason: 'Deleted by admin' }),
    headers: request.headers,
  }));
}
