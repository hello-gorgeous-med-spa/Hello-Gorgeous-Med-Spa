// ============================================================
// GIFT CARD SYNC API
// Nightly reconciliation with Square
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import {
  getSquareGiftCard,
  isSquareConfigured,
  centsToDollars,
} from '@/lib/square/client';

// ============================================================
// POST - Run sync job
// ============================================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json().catch(() => ({}));
    const { full = false } = body;

    if (!isSquareConfigured()) {
      return NextResponse.json({ 
        error: 'Square not configured',
        synced: 0,
        errors: 0,
      });
    }

    // Get cards that need sync
    let query = supabase
      .from('gift_cards')
      .select('*')
      .not('square_gift_card_id', 'is', null);

    if (!full) {
      // Only sync cards that are flagged or haven't been synced recently
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      query = query.or(`needs_sync.eq.true,last_synced_at.lt.${oneDayAgo},last_synced_at.is.null`);
    }

    const { data: cardsToSync, error } = await query.in('status', ['active', 'pending']);

    if (error) {
      console.error('Sync query error:', error);
      return NextResponse.json({ error: 'Failed to query cards' }, { status: 500 });
    }

    const results = {
      total: cardsToSync?.length || 0,
      synced: 0,
      errors: 0,
      mismatches: [] as any[],
    };

    // Sync each card
    for (const card of cardsToSync || []) {
      try {
        const squareCard = await getSquareGiftCard(card.square_gift_card_id);
        
        if (!squareCard) {
          // Card not found in Square - mark for review
          await supabase
            .from('gift_cards')
            .update({
              sync_error: 'Card not found in Square',
              needs_sync: true,
            })
            .eq('id', card.id);
          
          results.errors++;
          continue;
        }

        const squareBalance = centsToDollars(squareCard.balanceMoney.amount);
        const localBalance = card.current_balance;

        // Check for mismatch
        if (Math.abs(squareBalance - localBalance) > 0.01) {
          results.mismatches.push({
            id: card.id,
            code: card.code,
            squareBalance,
            localBalance,
            difference: squareBalance - localBalance,
          });

          // Log the discrepancy
          await supabase.from('gift_card_transactions').insert({
            gift_card_id: card.id,
            transaction_type: squareBalance > localBalance ? 'adjustment_up' : 'adjustment_down',
            amount: squareBalance - localBalance,
            balance_before: localBalance,
            balance_after: squareBalance,
            notes: `Sync reconciliation: Square balance (${squareBalance}) differs from local (${localBalance})`,
          });
        }

        // Map Square status
        let status = card.status;
        if (squareCard.state === 'DEACTIVATED') status = 'voided';
        else if (squareCard.state === 'BLOCKED') status = 'blocked';
        else if (squareBalance <= 0) status = 'redeemed';
        else status = 'active';

        // Update local record
        await supabase
          .from('gift_cards')
          .update({
            current_balance: squareBalance,
            status,
            square_gan: squareCard.gan,
            gan_last_4: squareCard.gan.slice(-4),
            last_synced_at: new Date().toISOString(),
            sync_error: null,
            needs_sync: false,
          })
          .eq('id', card.id);

        results.synced++;
      } catch (err) {
        console.error(`Sync error for card ${card.id}:`, err);
        
        await supabase
          .from('gift_cards')
          .update({
            sync_error: err instanceof Error ? err.message : 'Unknown error',
            needs_sync: true,
          })
          .eq('id', card.id);
        
        results.errors++;
      }
    }

    // Log sync job completion
    console.log('Gift card sync completed:', results);

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Sync job error:', error);
    return NextResponse.json({ error: 'Sync job failed' }, { status: 500 });
  }
}

// ============================================================
// GET - Check sync status
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();

    // Get sync stats
    const { data: stats } = await supabase
      .from('gift_cards')
      .select('status, needs_sync, sync_error, last_synced_at')
      .not('square_gift_card_id', 'is', null);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const syncStats = {
      total: stats?.length || 0,
      needsSync: stats?.filter(s => s.needs_sync).length || 0,
      hasErrors: stats?.filter(s => s.sync_error).length || 0,
      stale: stats?.filter(s => !s.last_synced_at || new Date(s.last_synced_at) < oneDayAgo).length || 0,
      recentlySynced: stats?.filter(s => s.last_synced_at && new Date(s.last_synced_at) > oneDayAgo).length || 0,
    };

    // Get any cards with sync errors
    const { data: errorCards } = await supabase
      .from('gift_cards')
      .select('id, code, sync_error, last_synced_at')
      .not('sync_error', 'is', null)
      .limit(10);

    return NextResponse.json({
      syncStats,
      errorCards: errorCards || [],
      squareConfigured: isSquareConfigured(),
    });
  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json({ error: 'Failed to get sync status' }, { status: 500 });
  }
}
