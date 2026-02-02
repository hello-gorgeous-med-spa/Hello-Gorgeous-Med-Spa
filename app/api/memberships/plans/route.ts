// ============================================================
// API: MEMBERSHIP PLANS - Full CRUD
// Manage membership plan templates
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/memberships/plans - List all plans
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: plans, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('is_active', true)
      .order('price');

    if (error) {
      console.error('Plans fetch error:', error);
      // Return defaults if table doesn't exist
      return NextResponse.json({
        plans: [
          { id: 'vip-annual', name: 'VIP Annual', price: 299, billing_cycle: 'yearly', benefits: ['10% off all services', 'Free vitamin injection monthly'] },
          { id: 'glow-monthly', name: 'Glow Monthly', price: 149, billing_cycle: 'monthly', benefits: ['$150 treatment credit', '15% off skincare'] },
          { id: 'botox-club', name: 'Botox Club', price: 199, billing_cycle: 'monthly', benefits: ['20 units Botox monthly', '20% off additional units'] },
        ]
      });
    }

    return NextResponse.json({ plans: plans || [] });
  } catch (error) {
    console.error('Plans GET error:', error);
    return NextResponse.json({ plans: [] });
  }
}

// POST /api/memberships/plans - Create new plan
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { name, price, billing_cycle, commitment, benefits, description } = body;

    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const { data: plan, error } = await supabase
      .from('membership_plans')
      .insert({
        name,
        price,
        billing_cycle: billing_cycle || 'monthly',
        commitment: commitment || 'month-to-month',
        benefits: benefits || [],
        description: description || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Plan create error:', error);
      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, plan });
  } catch (error) {
    console.error('Plans POST error:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

// PUT /api/memberships/plans - Update plan
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const update: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) update.name = data.name;
    if (data.price !== undefined) update.price = data.price;
    if (data.billing_cycle !== undefined) update.billing_cycle = data.billing_cycle;
    if (data.commitment !== undefined) update.commitment = data.commitment;
    if (data.benefits !== undefined) update.benefits = data.benefits;
    if (data.description !== undefined) update.description = data.description;
    if (data.is_active !== undefined) update.is_active = data.is_active;

    const { error } = await supabase
      .from('membership_plans')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Plan update error:', error);
      return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Plan updated' });
  } catch (error) {
    console.error('Plans PUT error:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}

// DELETE /api/memberships/plans - Soft delete plan
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('membership_plans')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Plan delete error:', error);
      return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Plan deleted' });
  } catch (error) {
    console.error('Plans DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 });
  }
}
