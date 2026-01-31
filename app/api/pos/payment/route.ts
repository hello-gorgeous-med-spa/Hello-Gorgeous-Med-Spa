// ============================================================
// POS PAYMENT API
// Process payments through Stripe
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, dollarsToCents, getOrCreateCustomer } from '@/lib/hgos/stripe';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      amount,
      client_id,
      client_email,
      client_name,
      appointment_id,
      items,
      payment_method,
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

    // Get or create Stripe customer if email provided
    let stripeCustomerId: string | null = null;
    if (client_email && client_name) {
      stripeCustomerId = await getOrCreateCustomer({
        email: client_email,
        name: client_name,
      });
    }

    // Create payment intent
    const amountInCents = dollarsToCents(amount);
    const paymentIntent = await createPaymentIntent({
      amount: amountInCents,
      customerId: stripeCustomerId || undefined,
      description: `Hello Gorgeous Med Spa - ${items?.[0]?.name || 'Sale'}`,
      metadata: {
        client_id: client_id || '',
        appointment_id: appointment_id || '',
      },
      receiptEmail: client_email,
    });

    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Failed to create payment' },
        { status: 500 }
      );
    }

    // Generate transaction number
    const transactionNumber = `HG-${Date.now().toString(36).toUpperCase()}`;

    // Calculate totals
    const subtotal = items?.reduce((sum: number, item: any) => 
      sum + (item.unit_price * item.quantity), 0) || amount;

    // Create transaction record
    const { data: transaction, error: txnError } = await supabase
      .from('transactions')
      .insert({
        transaction_number: transactionNumber,
        type: 'sale',
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        subtotal,
        discount_amount,
        discount_type,
        discount_reason,
        tax_amount: 0,
        tip_amount,
        total: amount,
        payment_method,
        stripe_payment_intent_id: paymentIntent.id,
        client_id,
        appointment_id,
        staff_id: '00000000-0000-0000-0000-000000000001', // TODO: Get from session
        location_id: '00000000-0000-0000-0000-000000000001',
        notes,
      })
      .select()
      .single();

    // If transaction table doesn't exist, just return success with payment info
    if (txnError) {
      console.warn('Transaction table not ready:', txnError.message);
    }

    // Create transaction items
    if (items && items.length > 0 && transaction) {
      const itemsToInsert = items.map((item: any) => ({
        transaction_id: transaction.id,
        item_type: item.item_type || 'service',
        item_id: item.item_id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount_amount: item.discount_amount || 0,
        total: item.unit_price * item.quantity - (item.discount_amount || 0),
        provider_id: item.provider_id,
      }));

      await supabase.from('transaction_items').insert(itemsToInsert);
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
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.clientSecret,
      transaction_number: transactionNumber,
      transaction_id: transaction?.id,
      status: paymentIntent.status,
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve transaction details
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('id');
  const transactionNumber = searchParams.get('number');

  if (!transactionId && !transactionNumber) {
    return NextResponse.json(
      { error: 'Transaction ID or number required' },
      { status: 400 }
    );
  }

  try {
    const supabase = createServerSupabaseClient();
    
    let query = supabase
      .from('transactions')
      .select(`
        *,
        client:clients(*),
        items:transaction_items(*)
      `);

    if (transactionId) {
      query = query.eq('id', transactionId);
    } else {
      query = query.eq('transaction_number', transactionNumber);
    }

    const { data: transaction, error } = await query.single();

    if (error) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ transaction });

  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}
