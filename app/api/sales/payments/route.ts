// ============================================================
// PAYMENTS API - Process payments for sales
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// GET - List payments with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    
    const saleId = searchParams.get('sale_id');
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('payment_method');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('sale_payments')
      .select(`
        *,
        sales:sale_id (
          id, sale_number, client_id, provider_id, gross_total, status,
          clients:client_id (
            id,
            user_profiles:user_id (first_name, last_name)
          ),
          providers:provider_id (
            id,
            user_profiles:user_id (first_name, last_name)
          )
        )
      `, { count: 'exact' });

    if (saleId) {
      query = query.eq('sale_id', saleId);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query = query.eq('payment_method', paymentMethod);
    }

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

    query = query.order('created_at', { ascending: false });
    query = query.range(offset, offset + limit - 1);

    const { data: payments, error, count } = await query;

    if (error) {
      console.error('Payments fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate totals
    const stats = {
      total: count || 0,
      totalAmount: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      totalTips: payments?.reduce((sum, p) => sum + (p.tip_amount || 0), 0) || 0,
      totalFees: payments?.reduce((sum, p) => sum + (p.processing_fee || 0), 0) || 0,
      byMethod: {
        card: payments?.filter(p => p.payment_method === 'card').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        cash: payments?.filter(p => p.payment_method === 'cash').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        gift_card: payments?.filter(p => p.payment_method === 'gift_card').reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
        other: payments?.filter(p => !['card', 'cash', 'gift_card'].includes(p.payment_method)).reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
      },
    };

    return NextResponse.json({
      payments: payments || [],
      count: count || 0,
      stats,
    });

  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST - Create new payment for a sale
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const {
      sale_id,
      payment_method,
      payment_processor = 'internal',
      amount,
      tip_amount = 0,
      processing_fee = 0,
      processor_transaction_id,
      processor_payment_intent_id,
      processor_receipt_url,
      gift_card_id,
      gift_card_code,
      membership_id,
      card_brand,
      card_last_four,
      notes,
    } = body;

    if (!sale_id) {
      return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount required' }, { status: 400 });
    }

    // Check if sale exists and get current balance
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select('id, balance_due, status')
      .eq('id', sale_id)
      .single();

    if (saleError || !sale) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    if (sale.status === 'voided' || sale.status === 'cancelled') {
      return NextResponse.json({ error: 'Cannot add payment to voided/cancelled sale' }, { status: 400 });
    }

    // Create payment
    const netAmount = amount - processing_fee;

    const { data: payment, error: paymentError } = await supabase
      .from('sale_payments')
      .insert({
        sale_id,
        payment_method,
        payment_processor,
        amount,
        tip_amount,
        processing_fee,
        net_amount: netAmount,
        status: 'completed', // Can be 'pending' for async payments
        processor_transaction_id,
        processor_payment_intent_id,
        processor_receipt_url,
        gift_card_id,
        gift_card_code,
        membership_id,
        card_brand,
        card_last_four,
        notes,
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    // Handle gift card payment - deduct from gift card balance
    if (payment_method === 'gift_card' && gift_card_id) {
      const { error: gcError } = await supabase.rpc('deduct_gift_card_balance', {
        card_id: gift_card_id,
        deduct_amount: amount,
      });
      
      if (gcError) {
        console.error('Gift card deduction error:', gcError);
        // Payment was recorded, log warning
      }
    }

    // Fetch updated sale
    const { data: updatedSale } = await supabase
      .from('sales')
      .select('*')
      .eq('id', sale_id)
      .single();

    return NextResponse.json({
      success: true,
      payment,
      sale: updatedSale,
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}

// PUT - Update payment (refund, void)
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { id, action, refund_amount, refund_reason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
    }

    // Get payment
    const { data: payment, error: fetchError } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (action === 'refund') {
      const refundAmt = refund_amount || payment.amount;

      if (refundAmt > payment.amount - (payment.refund_amount || 0)) {
        return NextResponse.json({ error: 'Refund amount exceeds available balance' }, { status: 400 });
      }

      // Update payment with refund
      const newRefundTotal = (payment.refund_amount || 0) + refundAmt;
      const newStatus = newRefundTotal >= payment.amount ? 'refunded' : 'partially_refunded';

      const { data, error } = await supabase
        .from('sale_payments')
        .update({
          refund_amount: newRefundTotal,
          refund_reason,
          refunded_at: new Date().toISOString(),
          status: newStatus,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Create refund record
      await supabase
        .from('sale_payments')
        .insert({
          sale_id: payment.sale_id,
          payment_method: payment.payment_method,
          payment_processor: payment.payment_processor,
          amount: -refundAmt,
          tip_amount: 0,
          processing_fee: 0,
          net_amount: -refundAmt,
          status: 'completed',
          original_payment_id: payment.id,
          notes: `Refund for ${payment.payment_number}: ${refund_reason || 'No reason provided'}`,
          processed_at: new Date().toISOString(),
        });

      return NextResponse.json({ success: true, payment: data });
    }

    if (action === 'void') {
      if (payment.status === 'completed') {
        return NextResponse.json({ error: 'Cannot void completed payment. Use refund instead.' }, { status: 400 });
      }

      const { data, error } = await supabase
        .from('sale_payments')
        .update({ status: 'voided' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, payment: data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}
