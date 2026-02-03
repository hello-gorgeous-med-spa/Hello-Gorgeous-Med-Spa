// ============================================================
// SINGLE SALE API - Get, Update, Delete individual sale
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - Get single sale with full details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { id } = params;

    // Try to find by UUID or sale_number
    let query = supabase
      .from('sales')
      .select(`
        *,
        clients:client_id (
          id, date_of_birth, city, state,
          user_profiles:user_id (first_name, last_name, email, phone)
        ),
        providers:provider_id (
          id, specialties,
          user_profiles:user_id (first_name, last_name, email)
        ),
        appointments:appointment_id (id, start_time, end_time, status),
        sale_items (
          id, item_type, item_id, item_name, item_description,
          provider_id, quantity, unit_price, discount_amount,
          tax_amount, total_price, units_used, unit_type, created_at
        ),
        sale_payments (
          id, payment_number, payment_method, payment_processor,
          amount, tip_amount, processing_fee, net_amount, status,
          card_brand, card_last_four, processor_receipt_url,
          created_at, processed_at
        )
      `);

    // Check if ID looks like a UUID or a sale number
    if (id.startsWith('HG-')) {
      query = query.eq('sale_number', id);
    } else {
      query = query.eq('id', id);
    }

    const { data: sale, error } = await query.single();

    if (error) {
      console.error('Sale fetch error:', error);
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({ sale });

  } catch (error) {
    console.error('Sale API error:', error);
    return NextResponse.json({ error: 'Failed to fetch sale' }, { status: 500 });
  }
}

// DELETE - Void a sale (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { id } = params;
    const body = await request.json().catch(() => ({}));
    const { reason } = body;

    // Check if sale has completed payments
    const { data: payments } = await supabase
      .from('sale_payments')
      .select('id, status')
      .eq('sale_id', id)
      .eq('status', 'completed');

    if (payments && payments.length > 0) {
      return NextResponse.json({
        error: 'Cannot void sale with completed payments. Refund payments first.',
      }, { status: 400 });
    }

    // Void the sale
    const { data, error } = await supabase
      .from('sales')
      .update({
        status: 'voided',
        voided_at: new Date().toISOString(),
        void_reason: reason || 'Voided by admin',
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, sale: data });

  } catch (error) {
    console.error('Sale void error:', error);
    return NextResponse.json({ error: 'Failed to void sale' }, { status: 500 });
  }
}
