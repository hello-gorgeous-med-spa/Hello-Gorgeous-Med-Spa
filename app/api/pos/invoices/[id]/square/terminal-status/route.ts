// ============================================================
// TERMINAL STATUS API
// Poll terminal checkout status from our database
// (Updated by webhooks - never poll Square directly from frontend)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/pos/invoices/[id]/square/terminal-status
 * Get the current terminal checkout status for an invoice
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: saleId } = await params;
    
    const supabase = createServerSupabaseClient();
    
    // Get the most recent terminal checkout for this sale
    const { data: checkout, error: checkoutError } = await supabase
      .from('terminal_checkouts')
      .select('*')
      .eq('sale_id', saleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (checkoutError || !checkout) {
      return NextResponse.json(
        { error: 'No terminal checkout found for this invoice' },
        { status: 404 }
      );
    }
    
    // Get the associated sale for full context
    const { data: sale } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();
    
    // Get the payment record if exists
    const { data: payment } = await supabase
      .from('sale_payments')
      .select('*')
      .eq('square_terminal_checkout_id', checkout.square_checkout_id)
      .single();
    
    // Determine display status
    let displayStatus: string;
    let displayMessage: string;
    
    switch (checkout.status) {
      case 'PENDING':
        displayStatus = 'pending';
        displayMessage = 'Sending to terminal...';
        break;
      case 'IN_PROGRESS':
        displayStatus = 'in_progress';
        displayMessage = 'Waiting for customer to tap/chip/swipe...';
        break;
      case 'CANCEL_REQUESTED':
        displayStatus = 'canceling';
        displayMessage = 'Cancellation requested...';
        break;
      case 'CANCELED':
        displayStatus = 'canceled';
        displayMessage = checkout.error_message || 'Payment was canceled';
        break;
      case 'COMPLETED':
        displayStatus = 'completed';
        displayMessage = 'Payment complete!';
        break;
      case 'EXPIRED':
        displayStatus = 'expired';
        displayMessage = 'Checkout expired. Please try again.';
        break;
      case 'FAILED':
        displayStatus = 'failed';
        displayMessage = checkout.error_message || 'Payment failed';
        break;
      default:
        displayStatus = 'unknown';
        displayMessage = 'Unknown status';
    }
    
    return NextResponse.json({
      checkout_id: checkout.square_checkout_id,
      status: checkout.status,
      display_status: displayStatus,
      display_message: displayMessage,
      
      // Amounts (in cents)
      amount_money: checkout.amount_money,
      tip_money: checkout.tip_money || 0,
      total_money: (checkout.amount_money || 0) + (checkout.tip_money || 0),
      
      // Square IDs
      square_order_id: checkout.square_order_id,
      square_payment_id: checkout.square_payment_id,
      
      // Error info
      error_code: checkout.error_code,
      error_message: checkout.error_message,
      
      // Timestamps
      created_at: checkout.created_at,
      updated_at: checkout.updated_at,
      completed_at: checkout.completed_at,
      
      // Payment details (if completed)
      payment: payment ? {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        tip_amount: payment.tip_amount,
        card_brand: payment.card_brand,
        card_last_four: payment.card_last_four,
        processor_receipt_url: payment.processor_receipt_url,
      } : null,
      
      // Sale status
      sale: sale ? {
        id: sale.id,
        sale_number: sale.sale_number,
        status: sale.status,
        gross_total: sale.gross_total,
        tip_total: sale.tip_total,
        amount_paid: sale.amount_paid,
        balance_due: sale.balance_due,
      } : null,
    });
    
  } catch (error) {
    console.error('Error fetching terminal status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch terminal status' },
      { status: 500 }
    );
  }
}
