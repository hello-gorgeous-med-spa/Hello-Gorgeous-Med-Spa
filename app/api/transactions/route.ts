// ============================================================
// TRANSACTIONS API
// CRUD operations for payments and transactions
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/transactions - List transactions
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get('clientId');
  const appointmentId = searchParams.get('appointmentId');
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        client:clients(id, first_name, last_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Calculate totals
    const totals = {
      total: (data || []).reduce((sum, t) => sum + (t.total_amount || 0), 0),
      subtotal: (data || []).reduce((sum, t) => sum + (t.subtotal || 0), 0),
      tax: (data || []).reduce((sum, t) => sum + (t.tax_amount || 0), 0),
      tips: (data || []).reduce((sum, t) => sum + (t.tip_amount || 0), 0),
    };

    return NextResponse.json({
      transactions: data,
      total: count,
      totals,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      client_id,
      appointment_id,
      type = 'sale',
      subtotal,
      discount_amount = 0,
      tax_amount = 0,
      tip_amount = 0,
      payment_method,
      stripe_payment_intent_id,
      notes,
      processed_by,
      line_items,
    } = body;

    // Calculate total
    const total_amount = subtotal - discount_amount + tax_amount + tip_amount;

    // Create transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        client_id,
        appointment_id,
        type,
        status: 'completed',
        subtotal,
        discount_amount,
        tax_amount,
        tip_amount,
        total_amount,
        payment_method,
        stripe_payment_intent_id,
        notes,
        processed_by,
        processed_at: new Date().toISOString(),
      })
      .select(`
        *,
        client:clients(id, first_name, last_name)
      `)
      .single();

    if (error) throw error;

    // Update client total_spent
    if (client_id) {
      await supabase.rpc('increment_client_spent', {
        client_id_param: client_id,
        amount_param: total_amount,
      });
    }

    // Mark appointment as completed if linked
    if (appointment_id) {
      await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          check_out_at: new Date().toISOString(),
        })
        .eq('id', appointment_id);
    }

    return NextResponse.json({ transaction: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
