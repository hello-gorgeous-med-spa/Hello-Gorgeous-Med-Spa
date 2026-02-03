// ============================================================
// POS PAYMENT API
// Process payments through SQUARE (Primary Processor)
// ============================================================
// 
// IMPORTANT: Stripe is DEPRECATED for Hello Gorgeous Med Spa
// All payments must route through Square.
// 
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getPaymentsApi, getSquareLocationId, dollarsToCents } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      client_id,
      appointment_id,
      items,
      payment_method = 'card',
      source_id, // Square payment source (nonce from Web Payments SDK)
      discount_amount = 0,
      discount_type,
      discount_reason,
      tip_amount = 0,
      notes,
    } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    const locationId = getSquareLocationId();

    // Generate sale number
    const saleNumber = `HG-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
    const amountInCents = dollarsToCents(amount);
    const tipInCents = dollarsToCents(tip_amount);

    // For card payments, process through Square
    let squarePaymentId: string | null = null;
    let paymentStatus = 'completed';

    if (payment_method === 'card' && source_id) {
      const paymentsApi = getPaymentsApi();
      
      if (paymentsApi && locationId) {
        try {
          const { result } = await paymentsApi.createPayment({
            sourceId: source_id,
            idempotencyKey: crypto.randomUUID(),
            amountMoney: {
              amount: BigInt(amountInCents + tipInCents),
              currency: 'USD',
            },
            tipMoney: tipInCents > 0 ? {
              amount: BigInt(tipInCents),
              currency: 'USD',
            } : undefined,
            locationId,
            referenceId: saleNumber,
            note: `Hello Gorgeous Med Spa - ${items?.[0]?.name || 'Sale'}`,
          });

          squarePaymentId = result.payment?.id || null;
          paymentStatus = result.payment?.status === 'COMPLETED' ? 'completed' : 'pending';
        } catch (squareError: any) {
          console.error('Square payment error:', squareError);
          return NextResponse.json(
            { error: 'Payment processing failed', details: squareError.message },
            { status: 500 }
          );
        }
      } else {
        // Square not configured - allow cash/other payments
        if (payment_method === 'card') {
          return NextResponse.json(
            { error: 'Card processing not configured. Use cash or gift card.' },
            { status: 400 }
          );
        }
      }
    }

    // Calculate totals
    const subtotal = items?.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0) || amount;

    // Create sale record in sales ledger
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        client_id,
        appointment_id,
        sale_type: 'service',
        status: paymentStatus,
        subtotal: dollarsToCents(subtotal),
        discount_total: dollarsToCents(discount_amount),
        discount_type,
        discount_reason,
        tax_total: 0,
        tip_total: tipInCents,
        gross_total: amountInCents,
        net_total: amountInCents,
        amount_paid: paymentStatus === 'completed' ? amountInCents : 0,
        balance_due: paymentStatus === 'completed' ? 0 : amountInCents,
        internal_notes: notes,
        completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (saleError) {
      console.warn('Sale creation warning:', saleError.message);
    }

    // Create sale items
    if (items && items.length > 0 && sale) {
      const saleItems = items.map((item: any) => ({
        sale_id: sale.id,
        item_type: item.item_type || 'service',
        item_id: item.item_id,
        item_name: item.name || item.item_name,
        item_description: item.description,
        quantity: item.quantity || 1,
        unit_price: dollarsToCents(item.unit_price),
        discount_amount: dollarsToCents(item.discount_amount || 0),
        tax_amount: 0,
        total_price: dollarsToCents((item.unit_price * (item.quantity || 1)) - (item.discount_amount || 0)),
        provider_id: item.provider_id,
      }));

      await supabase.from('sale_items').insert(saleItems);
    }

    // Create payment record
    if (sale) {
      await supabase.from('sale_payments').insert({
        sale_id: sale.id,
        payment_method,
        payment_processor: payment_method === 'card' ? 'square' : payment_method,
        amount: amountInCents,
        tip_amount: tipInCents,
        processing_fee: payment_method === 'card' ? Math.round(amountInCents * 0.026 + 10) : 0, // ~2.6% + $0.10
        net_amount: amountInCents - (payment_method === 'card' ? Math.round(amountInCents * 0.026 + 10) : 0),
        status: paymentStatus,
        processor_transaction_id: squarePaymentId,
        processed_at: new Date().toISOString(),
      });
    }

    // Update appointment status if linked
    if (appointment_id) {
      await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          payment_status: 'paid',
        })
        .eq('id', appointment_id);
    }

    return NextResponse.json({
      success: true,
      sale_id: sale?.id,
      sale_number: sale?.sale_number || saleNumber,
      processor: 'square',
      payment_id: squarePaymentId,
      status: paymentStatus,
      amount: amount,
      tip: tip_amount,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve sale details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const saleId = searchParams.get('id');
  const saleNumber = searchParams.get('number');

  if (!saleId && !saleNumber) {
    return NextResponse.json(
      { error: 'Sale ID or number required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('sales')
      .select(`
        *,
        sale_items (*),
        sale_payments (*)
      `);

    if (saleId) {
      query = query.eq('id', saleId);
    } else {
      query = query.eq('sale_number', saleNumber);
    }

    const { data: sale, error } = await query.single();

    if (error) {
      return NextResponse.json(
        { error: 'Sale not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ sale });

  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sale' },
      { status: 500 }
    );
  }
}
