// ============================================================
// MEMBERSHIPS API
// CRUD operations for memberships and subscriptions
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/memberships - List memberships or plans
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type'); // 'plans' or 'subscriptions'
  const status = searchParams.get('status');
  const clientId = searchParams.get('clientId');

  try {
    if (type === 'plans') {
      // Return membership plans
      const { data, error } = await supabase
        .from('membership_plans')
        .select('*')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      return NextResponse.json({ plans: data });
    }

    // Return active memberships
    let query = supabase
      .from('memberships')
      .select(`
        *,
        client:clients(id, user:users(first_name, last_name, email)),
        plan:membership_plans(id, name, price, billing_cycle, benefits)
      `)
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const memberships = data || [];

    // Calculate stats
    const stats = {
      activeCount: memberships.filter(m => m.status === 'active').length,
      mrr: memberships
        .filter(m => m.status === 'active')
        .reduce((sum, m) => sum + (m.price_locked || m.plan?.price || 0), 0),
      pastDueCount: memberships.filter(m => m.status === 'past_due').length,
      totalMembers: memberships.length,
    };

    return NextResponse.json({ memberships, stats });
  } catch (error) {
    console.error('Error fetching memberships:', error);
    return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 });
  }
}

// POST /api/memberships - Create new membership
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      plan_id,
      price_override, // Optional: override plan price
      sold_by,
    } = body;

    if (!client_id || !plan_id) {
      return NextResponse.json({ error: 'Client and plan are required' }, { status: 400 });
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check for existing active membership
    const { data: existing } = await supabase
      .from('memberships')
      .select('id')
      .eq('client_id', client_id)
      .eq('status', 'active')
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Client already has an active membership' },
        { status: 400 }
      );
    }

    // Calculate next billing date
    const nextBilling = new Date();
    switch (plan.billing_cycle) {
      case 'monthly':
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        break;
      case 'quarterly':
        nextBilling.setMonth(nextBilling.getMonth() + 3);
        break;
      case 'yearly':
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
        break;
    }

    // Calculate end date if commitment
    let endDate = null;
    if (plan.commitment_months > 0) {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.commitment_months);
    }

    const { data, error } = await supabase
      .from('memberships')
      .insert({
        client_id,
        plan_id,
        status: 'active',
        price_locked: price_override || plan.price,
        start_date: new Date().toISOString().split('T')[0],
        end_date: endDate?.toISOString().split('T')[0],
        next_billing_date: nextBilling.toISOString().split('T')[0],
        sold_by,
      })
      .select(`
        *,
        client:clients(id, user:users(first_name, last_name)),
        plan:membership_plans(name)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ membership: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating membership:', error);
    return NextResponse.json({ error: 'Failed to create membership' }, { status: 500 });
  }
}

// PATCH /api/memberships - Update membership status
export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      membership_id,
      action, // 'pause', 'resume', 'cancel'
      cancellation_reason,
    } = body;

    if (!membership_id || !action) {
      return NextResponse.json({ error: 'Membership ID and action required' }, { status: 400 });
    }

    let updateData: Record<string, any> = {};

    switch (action) {
      case 'pause':
        updateData = { status: 'paused' };
        break;
      case 'resume':
        updateData = { status: 'active' };
        break;
      case 'cancel':
        updateData = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason,
        };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error } = await supabase
      .from('memberships')
      .update(updateData)
      .eq('id', membership_id);

    if (error) throw error;

    return NextResponse.json({ success: true, newStatus: updateData.status });
  } catch (error) {
    console.error('Error updating membership:', error);
    return NextResponse.json({ error: 'Failed to update membership' }, { status: 500 });
  }
}
