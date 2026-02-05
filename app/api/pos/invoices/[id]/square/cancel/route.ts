// ============================================================
// CANCEL TERMINAL CHECKOUT API
// Cancel an in-progress terminal checkout
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { cancelTerminalCheckout } from '@/lib/square/terminal';

export const dynamic = 'force-dynamic';

/**
 * POST /api/pos/invoices/[id]/square/cancel
 * Cancel the active terminal checkout for an invoice
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: saleId } = await params;
    
    const supabase = createServerSupabaseClient();
    
    // Get the most recent active terminal checkout for this sale
    const { data: checkout, error: checkoutError } = await supabase
      .from('terminal_checkouts')
      .select('*')
      .eq('sale_id', saleId)
      .in('status', ['PENDING', 'IN_PROGRESS'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (checkoutError || !checkout) {
      return NextResponse.json(
        { error: 'No active terminal checkout found' },
        { status: 404 }
      );
    }
    
    // Attempt to cancel
    try {
      const canceled = await cancelTerminalCheckout(checkout.square_checkout_id);
      
      if (!canceled) {
        // Checkout may have already completed or been canceled
        return NextResponse.json(
          { 
            error: 'Could not cancel checkout - it may have already completed',
            checkout_id: checkout.square_checkout_id,
          },
          { status: 409 }
        );
      }
      
      // Update sale status back to draft/unpaid
      await supabase
        .from('sales')
        .update({ status: 'unpaid' })
        .eq('id', saleId);
      
      // Update payment status
      await supabase
        .from('sale_payments')
        .update({ 
          status: 'voided',
          terminal_status: 'CANCELED',
        })
        .eq('square_terminal_checkout_id', checkout.square_checkout_id);
      
      return NextResponse.json({
        success: true,
        message: 'Terminal checkout canceled',
        checkout_id: checkout.square_checkout_id,
      });
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (cancelError: any) {
      console.error('Error canceling terminal checkout:', cancelError);
      
      // Check if it's a "cannot cancel" error
      if (cancelError.errors) {
        const squareError = cancelError.errors[0];
        return NextResponse.json(
          { 
            error: squareError.detail || 'Could not cancel checkout',
            code: squareError.code,
          },
          { status: 400 }
        );
      }
      
      throw cancelError;
    }
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error in cancel endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel terminal checkout' },
      { status: 500 }
    );
  }
}
