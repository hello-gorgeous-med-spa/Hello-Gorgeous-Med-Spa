// ============================================================
// GIFT CARD SETTINGS API
// Owner-controlled configuration
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Default settings
const DEFAULT_SETTINGS = {
  enabled: true,
  allow_online_purchase: true,
  allow_pos_purchase: true,
  allow_partial_redemption: true,
  min_purchase_amount: 25,
  max_purchase_amount: 500,
  preset_amounts: [25, 50, 100, 150, 200, 250],
  allow_custom_amount: true,
  cards_expire: false,
  default_expiration_months: 12,
  allow_split_tender: true,
  auto_apply_to_appointments: false,
  prompt_before_checkout: true,
  allow_promotional_cards: true,
};

// GET - Fetch settings
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: settings, error } = await supabase
      .from('gift_card_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Settings fetch error:', error);
    }

    return NextResponse.json({
      settings: settings || DEFAULT_SETTINGS,
    });
  } catch (error) {
    console.error('Gift card settings GET error:', error);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { updated_by, ...updates } = body;

    // Validate updates
    const allowedFields = [
      'enabled',
      'allow_online_purchase',
      'allow_pos_purchase',
      'allow_partial_redemption',
      'min_purchase_amount',
      'max_purchase_amount',
      'preset_amounts',
      'allow_custom_amount',
      'cards_expire',
      'default_expiration_months',
      'allow_split_tender',
      'auto_apply_to_appointments',
      'prompt_before_checkout',
      'allow_promotional_cards',
      'square_location_id',
    ];

    const cleanUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
      updated_by,
    };

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        cleanUpdates[field] = updates[field];
      }
    }

    // Upsert settings
    const { data: existing } = await supabase
      .from('gift_card_settings')
      .select('id')
      .single();

    if (existing) {
      await supabase
        .from('gift_card_settings')
        .update(cleanUpdates)
        .eq('id', existing.id);
    } else {
      await supabase
        .from('gift_card_settings')
        .insert({ id: crypto.randomUUID(), ...cleanUpdates });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gift card settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
