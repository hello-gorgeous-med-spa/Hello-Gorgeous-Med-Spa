// ============================================================
// SALES API - Full CRUD + Filters + Search
// Fresha-Level Sales Ledger Backend
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - List sales with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    
    // Filters
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const saleType = searchParams.get('sale_type');
    const providerId = searchParams.get('provider_id');
    const clientId = searchParams.get('client_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const date = searchParams.get('date'); // Single date shorthand
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Build query - join through user_profiles for client/provider names
    let query = supabase
      .from('sales')
      .select(`
        *,
        clients:client_id (
          id,
          user_profiles:user_id (first_name, last_name, email, phone)
        ),
        providers:provider_id (
          id,
          user_profiles:user_id (first_name, last_name)
        ),
        sale_items (id, item_type, item_name, quantity, total_price),
        sale_payments (id, payment_method, amount, status)
      `, { count: 'exact' });

    // Apply filters
    if (search) {
      // Search in sale_number and internal_notes (which contains client name from imports)
      // Note: Can't search across joined tables with .or() in PostgREST
      query = query.or(`sale_number.ilike.%${search}%,internal_notes.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (saleType && saleType !== 'all') {
      query = query.eq('sale_type', saleType);
    }

    if (providerId) {
      query = query.eq('provider_id', providerId);
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    // Date filters
    if (date) {
      query = query.gte('created_at', `${date}T00:00:00`)
                   .lte('created_at', `${date}T23:59:59`);
    } else {
      if (dateFrom) {
        query = query.gte('created_at', `${dateFrom}T00:00:00`);
      }
      if (dateTo) {
        query = query.lte('created_at', `${dateTo}T23:59:59`);
      }
    }

    // Sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: sales, error, count } = await query;

    if (error) {
      console.error('Sales fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary stats
    const stats = {
      total: count || 0,
      grossTotal: sales?.reduce((sum, s) => sum + (s.gross_total || 0), 0) || 0,
      netTotal: sales?.reduce((sum, s) => sum + (s.net_total || 0), 0) || 0,
      tipsTotal: sales?.reduce((sum, s) => sum + (s.tip_total || 0), 0) || 0,
      outstanding: sales?.reduce((sum, s) => sum + (s.balance_due || 0), 0) || 0,
    };

    return NextResponse.json({
      sales: sales || [],
      count: count || 0,
      stats,
      pagination: {
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });

  } catch (error) {
    console.error('Sales API error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

// POST - Create new sale
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const {
      client_id,
      appointment_id,
      provider_id,
      sale_type = 'service',
      items = [],
      discount_type,
      discount_code,
      discount_reason,
      tax_rate = 0,
      tax_exempt = false,
      internal_notes,
      client_notes,
    } = body;

    // Calculate totals from items
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0);
    const discountTotal = items.reduce((sum: number, item: any) => 
      sum + (item.discount_amount || 0), 0);
    const taxTotal = tax_exempt ? 0 : Math.round(subtotal * tax_rate);
    const grossTotal = subtotal - discountTotal + taxTotal;

    // Create sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        client_id,
        appointment_id,
        provider_id,
        sale_type,
        status: 'draft',
        subtotal,
        discount_total: discountTotal,
        discount_type,
        discount_code,
        discount_reason,
        tax_total: taxTotal,
        tax_rate,
        tax_exempt,
        gross_total: grossTotal,
        net_total: grossTotal,
        balance_due: grossTotal,
        internal_notes,
        client_notes,
      })
      .select()
      .single();

    if (saleError) {
      console.error('Sale creation error:', saleError);
      return NextResponse.json({ error: saleError.message }, { status: 500 });
    }

    // Add line items
    if (items.length > 0) {
      const saleItems = items.map((item: any) => ({
        sale_id: sale.id,
        item_type: item.item_type || 'service',
        item_id: item.item_id,
        item_name: item.item_name,
        item_description: item.item_description,
        provider_id: item.provider_id || provider_id,
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        discount_amount: item.discount_amount || 0,
        tax_amount: item.tax_amount || 0,
        total_price: (item.unit_price * (item.quantity || 1)) - (item.discount_amount || 0) + (item.tax_amount || 0),
        units_used: item.units_used,
        unit_type: item.unit_type,
      }));

      const { error: itemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);

      if (itemsError) {
        console.error('Sale items error:', itemsError);
        // Sale was created, but items failed - log but don't fail
      }
    }

    // Fetch complete sale with items
    const { data: completeSale } = await supabase
      .from('sales')
      .select(`
        *,
        clients:client_id (id, first_name, last_name, email),
        sale_items (*)
      `)
      .eq('id', sale.id)
      .single();

    return NextResponse.json({
      success: true,
      sale: completeSale || sale,
    });

  } catch (error) {
    console.error('Sale creation error:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}

// PUT - Update sale
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });
    }

    // Handle special actions
    if (action === 'void') {
      const { data, error } = await supabase
        .from('sales')
        .update({
          status: 'voided',
          voided_at: new Date().toISOString(),
          void_reason: updates.void_reason || 'Voided by admin',
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, sale: data });
    }

    if (action === 'complete') {
      const { data, error } = await supabase
        .from('sales')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, sale: data });
    }

    // Regular update
    const { data, error } = await supabase
      .from('sales')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sale: data });

  } catch (error) {
    console.error('Sale update error:', error);
    return NextResponse.json({ error: 'Failed to update sale' }, { status: 500 });
  }
}
