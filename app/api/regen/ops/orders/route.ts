import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Generate order number: REGEN-YYYYMM-XXXXX
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `REGEN-${year}${month}-${random}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('regen_orders')
      .select(`
        *,
        patient:regen_patients(id, name, email, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`order_number.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ orders: data || [] });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    
    const orderNumber = generateOrderNumber();
    
    const { data: order, error } = await supabase
      .from('regen_orders')
      .insert({
        order_number: orderNumber,
        patient_id: body.patient_id,
        intake_id: body.intake_id,
        items: body.items,
        subtotal: body.subtotal,
        shipping: body.shipping || 0,
        discount: body.discount || 0,
        total: body.total,
        promo_code: body.promo_code,
        wholesale_cost: body.wholesale_cost,
        status: 'pending',
        stripe_payment_intent_id: body.stripe_payment_intent_id,
      })
      .select()
      .single();

    if (error) throw error;

    // Create initial status history entry
    await supabase.from('regen_order_status_history').insert({
      order_id: order.id,
      status: 'pending',
      actor_type: 'system',
      notes: 'Order created',
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id, status, tracking_number, tracking_carrier, pharmacy_order_id, actor_id, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update order
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (tracking_number) updateData.tracking_number = tracking_number;
    if (tracking_carrier) updateData.tracking_carrier = tracking_carrier;
    if (pharmacy_order_id) updateData.pharmacy_order_id = pharmacy_order_id;

    const { data: order, error } = await supabase
      .from('regen_orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Add to status history
    await supabase.from('regen_order_status_history').insert({
      order_id: id,
      status,
      actor_id,
      actor_type: actor_id ? 'staff' : 'system',
      notes,
      metadata: { tracking_number, tracking_carrier, pharmacy_order_id },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
