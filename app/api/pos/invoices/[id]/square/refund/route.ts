// ============================================================
// REFUND API
// Process full or partial refunds through Square
// ============================================================
// SECURITY:
// - Requires authenticated staff/admin role
// - All refunds are audit logged (who, when, amount, reason)
//
// PHI COMPLIANCE: The refund 'reason' field is sent to Square.
// Ensure reason contains only operational info (e.g., "customer request")
// and NOT clinical details, treatment names, or health conditions.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { getRefundsApiAsync } from '@/lib/square/client';
import { getActiveConnection } from '@/lib/square/oauth';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Get authenticated user from session
 * Returns null if not authenticated
 */
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'staff',
  };
}

/**
 * POST /api/pos/invoices/[id]/square/refund
 * Process a refund for the invoice
 * Body: { amount?: number (cents), reason: string }
 * If amount is omitted, full refund is processed
 * 
 * REQUIRES: Authenticated user with staff or admin role
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: saleId } = await params;
    
    // ============================================================
    // ROLE PROTECTION: Require authenticated staff/admin
    // ============================================================
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required to process refunds' },
        { status: 401 }
      );
    }
    
    // Optional: Check for specific role
    const allowedRoles = ['admin', 'manager', 'staff'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to process refunds' },
        { status: 403 }
      );
    }
    
    // Check Square connection
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { amount: requestedAmount, reason } = body;
    
    if (!reason || reason.trim().length < 3) {
      return NextResponse.json(
        { error: 'Refund reason is required (minimum 3 characters)' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Fetch the sale with payments
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select(`
        *,
        sale_payments (*)
      `)
      .eq('id', saleId)
      .single();
    
    if (saleError || !sale) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    // Find a completed Square payment to refund
    const eligiblePayment = sale.sale_payments?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => 
        p.status === 'completed' && 
        p.payment_processor === 'square' &&
        (p.square_payment_id || p.processor_transaction_id)
    );
    
    if (!eligiblePayment) {
      return NextResponse.json(
        { error: 'No refundable Square payment found for this invoice' },
        { status: 400 }
      );
    }
    
    const squarePaymentId = eligiblePayment.square_payment_id || eligiblePayment.processor_transaction_id;
    
    // Calculate refund amount
    const maxRefundable = eligiblePayment.amount - (eligiblePayment.refund_amount || 0);
    const refundAmount = requestedAmount 
      ? Math.min(requestedAmount, maxRefundable)
      : maxRefundable;
    
    if (refundAmount <= 0) {
      return NextResponse.json(
        { error: 'No amount available to refund' },
        { status: 400 }
      );
    }
    
    const isFullRefund = refundAmount >= maxRefundable;
    
    // Process refund through Square
    const refundsApi = await getRefundsApiAsync();
    if (!refundsApi) {
      return NextResponse.json(
        { error: 'Refunds API not available' },
        { status: 500 }
      );
    }
    
    const idempotencyKey = crypto.randomUUID();
    
    try {
      const { result } = await refundsApi.refundPayment({
        idempotencyKey,
        paymentId: squarePaymentId,
        amountMoney: {
          amount: BigInt(refundAmount),
          currency: 'USD',
        },
        reason: reason.trim(),
      });
      
      if (!result.refund) {
        return NextResponse.json(
          { error: 'Refund was not created' },
          { status: 500 }
        );
      }
      
      const squareRefund = result.refund;
      
      // Create refund record in our database (with who processed it)
      const { data: refundRecord, error: refundError } = await supabase
        .from('refunds')
        .insert({
          sale_id: saleId,
          payment_id: eligiblePayment.id,
          square_refund_id: squareRefund.id,
          square_payment_id: squarePaymentId,
          amount: refundAmount,
          processing_fee_refunded: 0, // Square doesn't refund processing fees
          reason: reason.trim(),
          refund_type: isFullRefund ? 'full' : 'partial',
          status: squareRefund.status?.toLowerCase() || 'pending',
          created_by: user.id, // Track who processed the refund
          raw_square_response: squareRefund,
        })
        .select()
        .single();
      
      if (refundError) {
        console.error('Error creating refund record:', refundError);
      }
      
      // Update payment record
      await supabase
        .from('sale_payments')
        .update({
          status: isFullRefund ? 'refunded' : 'partially_refunded',
          refund_amount: (eligiblePayment.refund_amount || 0) + refundAmount,
          refund_reason: reason.trim(),
          refunded_at: new Date().toISOString(),
        })
        .eq('id', eligiblePayment.id);
      
      // Update sale status and amounts
      const newAmountPaid = sale.amount_paid - refundAmount;
      const newBalanceDue = sale.gross_total - newAmountPaid;
      
      await supabase
        .from('sales')
        .update({
          status: isFullRefund ? 'refunded' : 'partially_paid',
          amount_paid: newAmountPaid,
          balance_due: newBalanceDue,
        })
        .eq('id', saleId);
      
      // ============================================================
      // AUDIT LOG: Record who processed the refund
      // ============================================================
      await supabase.from('audit_log').insert({
        entity_type: 'refund',
        entity_id: refundRecord?.id || null,
        action: 'create',
        user_id: user.id,
        user_email: user.email,
        user_role: user.role,
        details: {
          sale_id: saleId,
          payment_id: eligiblePayment.id,
          amount: refundAmount,
          amount_formatted: `$${(refundAmount / 100).toFixed(2)}`,
          refund_type: isFullRefund ? 'full' : 'partial',
          reason: reason.trim(),
          square_refund_id: squareRefund.id,
          processed_by: user.email,
          processed_at: new Date().toISOString(),
        },
      });
      
      return NextResponse.json({
        success: true,
        refund: {
          id: refundRecord?.id,
          square_refund_id: squareRefund.id,
          amount: refundAmount,
          status: squareRefund.status,
          refund_type: isFullRefund ? 'full' : 'partial',
        },
        sale: {
          status: isFullRefund ? 'refunded' : 'partially_paid',
          amount_paid: newAmountPaid,
          balance_due: newBalanceDue,
        },
      });
      
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (squareError: any) {
      console.error('Square refund error:', squareError);
      
      // Parse Square errors
      if (squareError.errors) {
        const error = squareError.errors[0];
        return NextResponse.json(
          { 
            error: error.detail || error.code || 'Refund failed',
            code: error.code,
          },
          { status: 400 }
        );
      }
      
      throw squareError;
    }
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error processing refund:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process refund' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/pos/invoices/[id]/square/refund
 * Get refund history for an invoice
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: saleId } = await params;
    
    const supabase = createServerSupabaseClient();
    
    const { data: refunds, error } = await supabase
      .from('refunds')
      .select('*')
      .eq('sale_id', saleId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({ refunds: refunds || [] });
    
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}
