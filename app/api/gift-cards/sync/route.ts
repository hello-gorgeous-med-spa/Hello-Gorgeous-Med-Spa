// ============================================================
// API: GIFT CARD SYNC FROM SQUARE
// Imports gift cards from Square into local database
// ============================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getAccessToken } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

const SQUARE_API_BASE = 'https://connect.squareup.com';

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Get Square access token
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Square not connected. Please connect Square in Settings > Payments.' 
      }, { status: 400 });
    }

    // Fetch gift cards from Square
    let cursor: string | undefined;
    let allGiftCards: any[] = [];
    
    do {
      const url = new URL(`${SQUARE_API_BASE}/v2/gift-cards`);
      if (cursor) url.searchParams.set('cursor', cursor);
      url.searchParams.set('limit', '100');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-01-18',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Square gift cards API error:', errorData);
        return NextResponse.json({ 
          error: 'Failed to fetch gift cards from Square',
          details: errorData.errors?.[0]?.detail || 'Unknown error'
        }, { status: 500 });
      }

      const data = await response.json();
      allGiftCards = allGiftCards.concat(data.gift_cards || []);
      cursor = data.cursor;
    } while (cursor);

    console.log(`Fetched ${allGiftCards.length} gift cards from Square`);

    let syncedCount = 0;
    let updatedCount = 0;

    // Sync each gift card
    for (const giftCard of allGiftCards) {
      // Check if already exists
      const { data: existing } = await supabase
        .from('gift_cards')
        .select('id, current_balance')
        .eq('square_gift_card_id', giftCard.id)
        .single();

      const giftCardData = {
        square_gift_card_id: giftCard.id,
        square_gan: giftCard.gan,
        gan_last_4: giftCard.gan?.slice(-4),
        code: giftCard.gan ? `GC-${giftCard.gan.slice(-8)}` : `SQ-${giftCard.id.slice(-8)}`,
        initial_value: Number(giftCard.balance_money?.amount || 0) / 100,
        current_balance: Number(giftCard.balance_money?.amount || 0) / 100,
        status: mapSquareState(giftCard.state),
        card_type: giftCard.type?.toLowerCase() || 'digital',
        source: 'square',
        last_synced_at: new Date().toISOString(),
        needs_sync: false,
      };

      if (existing) {
        // Update if balance changed
        if (existing.current_balance !== giftCardData.current_balance) {
          await supabase
            .from('gift_cards')
            .update(giftCardData)
            .eq('id', existing.id);
          updatedCount++;
        }
      } else {
        // Insert new
        const { error: insertError } = await supabase
          .from('gift_cards')
          .insert({
            ...giftCardData,
            created_at: giftCard.created_at || new Date().toISOString(),
          });
        
        if (!insertError) syncedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      updated: updatedCount,
      total: allGiftCards.length,
      message: `Synced ${syncedCount} new, updated ${updatedCount} existing gift cards`,
    });

  } catch (error) {
    console.error('Gift card sync error:', error);
    return NextResponse.json({ 
      error: 'Failed to sync gift cards' 
    }, { status: 500 });
  }
}

function mapSquareState(state: string): string {
  switch (state) {
    case 'ACTIVE': return 'active';
    case 'DEACTIVATED': return 'voided';
    case 'BLOCKED': return 'blocked';
    case 'PENDING': return 'pending';
    default: return 'active';
  }
}
