// ============================================================
// API: PROMOTIONS & COUPONS
// Create, manage discount codes and promotions
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// Generate random promo code
function generateCode(prefix: string = 'HG'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = prefix + '-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// GET /api/promotions - List all promotions
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active', 'expired', 'all'
    const code = searchParams.get('code'); // Lookup specific code

    // Single code lookup (for validation at checkout)
    if (code) {
      const { data: promo, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error || !promo) {
        return NextResponse.json({ valid: false, error: 'Invalid promo code' });
      }

      // Check if active
      const now = new Date();
      const startDate = promo.start_date ? new Date(promo.start_date) : null;
      const endDate = promo.end_date ? new Date(promo.end_date) : null;

      if (!promo.is_active) {
        return NextResponse.json({ valid: false, error: 'This promo code is no longer active' });
      }
      if (startDate && now < startDate) {
        return NextResponse.json({ valid: false, error: 'This promo code is not yet active' });
      }
      if (endDate && now > endDate) {
        return NextResponse.json({ valid: false, error: 'This promo code has expired' });
      }
      if (promo.usage_limit && promo.usage_count >= promo.usage_limit) {
        return NextResponse.json({ valid: false, error: 'This promo code has reached its usage limit' });
      }

      return NextResponse.json({
        valid: true,
        promotion: {
          id: promo.id,
          code: promo.code,
          name: promo.name,
          discount_type: promo.discount_type,
          discount_value: promo.discount_value,
          min_purchase: promo.min_purchase,
          applies_to: promo.applies_to,
          service_ids: promo.service_ids,
        },
      });
    }

    // List all promotions
    let query = supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: promotions, error } = await query;

    if (error) {
      console.error('Promotions fetch error:', error);
      return NextResponse.json({ promotions: [] });
    }

    // Filter by status if requested
    let filtered = promotions || [];
    const now = new Date();

    if (status === 'active') {
      filtered = filtered.filter(p => {
        if (!p.is_active) return false;
        const endDate = p.end_date ? new Date(p.end_date) : null;
        if (endDate && now > endDate) return false;
        if (p.usage_limit && p.usage_count >= p.usage_limit) return false;
        return true;
      });
    } else if (status === 'expired') {
      filtered = filtered.filter(p => {
        const endDate = p.end_date ? new Date(p.end_date) : null;
        return (endDate && now > endDate) || (p.usage_limit && p.usage_count >= p.usage_limit);
      });
    }

    return NextResponse.json({ promotions: filtered });
  } catch (error) {
    console.error('Promotions GET error:', error);
    return NextResponse.json({ promotions: [] });
  }
}

// POST /api/promotions - Create new promotion
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      name,
      code,
      discount_type, // 'percentage' or 'fixed'
      discount_value,
      min_purchase,
      usage_limit,
      start_date,
      end_date,
      applies_to, // 'all', 'services', 'products'
      service_ids, // Array of service IDs if applies_to = 'services'
      description,
    } = body;

    if (!name || !discount_type || !discount_value) {
      return NextResponse.json({ error: 'Name, discount type, and value are required' }, { status: 400 });
    }

    // Generate code if not provided
    let promoCode = code?.toUpperCase() || generateCode();

    // Check for duplicates
    const { data: existing } = await supabase
      .from('promotions')
      .select('id')
      .eq('code', promoCode)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'A promotion with this code already exists' }, { status: 400 });
    }

    const { data: promotion, error } = await supabase
      .from('promotions')
      .insert({
        name,
        code: promoCode,
        discount_type,
        discount_value,
        min_purchase: min_purchase || 0,
        usage_limit: usage_limit || null,
        usage_count: 0,
        start_date: start_date || null,
        end_date: end_date || null,
        applies_to: applies_to || 'all',
        service_ids: service_ids || null,
        description: description || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Promotion create error:', error);
      return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error('Promotions POST error:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}

// PUT /api/promotions - Update promotion or record usage
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, action, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 });
    }

    // Record usage action
    if (action === 'use') {
      const { data: promo } = await supabase
        .from('promotions')
        .select('usage_count')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('promotions')
        .update({
          usage_count: (promo?.usage_count || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Usage recorded' });
    }

    // Regular update
    const update: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) update.name = data.name;
    if (data.discount_type !== undefined) update.discount_type = data.discount_type;
    if (data.discount_value !== undefined) update.discount_value = data.discount_value;
    if (data.min_purchase !== undefined) update.min_purchase = data.min_purchase;
    if (data.usage_limit !== undefined) update.usage_limit = data.usage_limit;
    if (data.start_date !== undefined) update.start_date = data.start_date;
    if (data.end_date !== undefined) update.end_date = data.end_date;
    if (data.applies_to !== undefined) update.applies_to = data.applies_to;
    if (data.service_ids !== undefined) update.service_ids = data.service_ids;
    if (data.description !== undefined) update.description = data.description;
    if (data.is_active !== undefined) update.is_active = data.is_active;

    const { error } = await supabase
      .from('promotions')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Promotion update error:', error);
      return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Promotion updated' });
  } catch (error) {
    console.error('Promotions PUT error:', error);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}

// DELETE /api/promotions - Delete promotion
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Promotion ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Promotion delete error:', error);
      return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Promotion deleted' });
  } catch (error) {
    console.error('Promotions DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}
