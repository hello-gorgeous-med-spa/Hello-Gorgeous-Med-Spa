// ============================================================
// START TERMINAL CHARGE API
// Initiate a terminal checkout for an invoice
// ============================================================
// PHI COMPLIANCE:
// - Never send treatment names, client names, or health info to Square
// - Use generic line items only: Service, Product, Deposit
// - Use UUID-based reference IDs (non-sequential, no patterns)
// - Tax/discounts as generic adjustments without reason text
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { getActiveConnection } from '@/lib/square/oauth';
import { createTerminalCheckout } from '@/lib/square/terminal';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ================================================================
// PHI-SAFE ORDER BUILDER
// Builds Square Order with max 3 generic line items
// ================================================================

interface PhiSafeLineItem {
  name: string;
  quantity: number;
  unitPriceCents: number;
}

interface PhiSafeOrder {
  lineItems: PhiSafeLineItem[];
  discountCents: number;
  taxCents: number;
  referenceToken: string; // UUID-based, non-sequential
}

/**
 * Build PHI-safe Square order from sale items
 * 
 * RULES:
 * - Max 3 line items: Service (sum), Product (sum), Deposit (sum)
 * - Taxes: single "Tax" line or included in totals
 * - Discounts: single "Discount" adjustment (no reason text)
 * - Reference: UUID-based token (non-sequential, reveals nothing)
 * - NEVER include: treatment names, SKU names, descriptions, notes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPhiSafeOrder(sale: any): PhiSafeOrder {
  // Aggregate by generic category (max 3 categories)
  
  // Map all item types to one of 3 categories
  const getCategory = (itemType: string): 'Service' | 'Product' | 'Deposit' => {
    const t = (itemType || 'service').toLowerCase().trim();
    
    // Service: anything clinical, consultations, treatments, procedures
    if (['service', 'treatment', 'consultation', 'procedure', 'package', 'membership'].includes(t)) {
      return 'Service';
    }
    // Product: retail, skincare, take-home items
    if (['product', 'retail', 'skincare', 'item', 'gift_card'].includes(t)) {
      return 'Product';
    }
    // Deposit: prepayments, holds
    if (['deposit', 'prepay', 'hold'].includes(t)) {
      return 'Deposit';
    }
    // Default to Service (safe for unknown types)
    return 'Service';
  };
  
  // Aggregate totals by category
  const totals: Record<'Service' | 'Product' | 'Deposit', number> = {
    Service: 0,
    Product: 0,
    Deposit: 0,
  };
  const counts: Record<'Service' | 'Product' | 'Deposit', number> = {
    Service: 0,
    Product: 0,
    Deposit: 0,
  };
  
  for (const item of (sale.sale_items || [])) {
    const category = getCategory(item.item_type);
    const quantity = item.quantity || 1;
    // Use unit_price * quantity to get item total (before item-level discounts)
    const itemTotal = (item.unit_price || 0) * quantity;
    totals[category] += itemTotal;
    counts[category] += quantity;
  }
  
  // Build line items (only categories with amounts)
  const lineItems: PhiSafeLineItem[] = [];
  
  for (const category of ['Service', 'Product', 'Deposit'] as const) {
    if (totals[category] > 0 && counts[category] > 0) {
      lineItems.push({
        name: category, // Generic: "Service", "Product", or "Deposit"
        quantity: counts[category],
        unitPriceCents: Math.round(totals[category] / counts[category]),
      });
    }
  }
  
  // Generate UUID-based reference token (non-sequential, reveals nothing)
  // Format: Ref: <first-8-chars-of-uuid>
  // This is sufficient for lookup but reveals no patterns
  const referenceToken = crypto.randomUUID().substring(0, 8);
  
  return {
    lineItems,
    discountCents: sale.discount_total || 0,
    taxCents: sale.tax_total || 0,
    referenceToken,
  };
}

/**
 * POST /api/pos/invoices/[id]/square/start-terminal-charge
 * Start a terminal checkout for the invoice
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: saleId } = await params;
    
    // Check Square connection
    const connection = await getActiveConnection();
    if (!connection) {
      return NextResponse.json(
        { error: 'Square not connected' },
        { status: 401 }
      );
    }
    
    if (!connection.location_id) {
      return NextResponse.json(
        { error: 'No location selected. Please configure Square settings.' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { device_id, tip_settings } = body;
    
    // Use provided device or default
    const deviceId = device_id || connection.default_device_id;
    if (!deviceId) {
      return NextResponse.json(
        { error: 'No terminal device specified and no default device set' },
        { status: 400 }
      );
    }
    
    const supabase = createAdminSupabaseClient() ?? createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }
    
    // Fetch the sale with items
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (*)
      `)
      .eq('id', saleId)
      .single();
    
    if (saleError || !sale) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }
    
    // Validate sale status
    if (sale.status === 'completed' || sale.status === 'refunded') {
      return NextResponse.json(
        { error: `Invoice is already ${sale.status}` },
        { status: 400 }
      );
    }
    
    // Check for existing pending checkout
    const { data: existingCheckout } = await supabase
      .from('terminal_checkouts')
      .select('*')
      .eq('sale_id', saleId)
      .in('status', ['PENDING', 'IN_PROGRESS'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (existingCheckout) {
      return NextResponse.json(
        { 
          error: 'A terminal checkout is already in progress',
          checkout_id: existingCheckout.square_checkout_id,
          status: existingCheckout.status,
        },
        { status: 409 }
      );
    }
    
    // Calculate amount to charge (balance due)
    const amountCents = sale.balance_due || sale.gross_total;
    
    if (amountCents <= 0) {
      return NextResponse.json(
        { error: 'No amount due on this invoice' },
        { status: 400 }
      );
    }
    
    // ================================================================
    // BUILD PHI-SAFE ORDER
    // Max 3 line items + generic tax/discount adjustments
    // ================================================================
    const phiSafeOrder = buildPhiSafeOrder(sale);
    
    // Store the reference token for reconciliation
    await supabase
      .from('sales')
      .update({ 
        status: 'pending',
        // Store the reference token for later lookup
        internal_notes: `Square Ref: ${phiSafeOrder.referenceToken}`,
      })
      .eq('id', saleId);
    
    // Create terminal checkout with tip-on-device
    // PHI COMPLIANCE: Note uses UUID-based reference only
    const result = await createTerminalCheckout({
      saleId,
      amountCents,
      deviceId,
      locationId: connection.location_id,
      lineItems: phiSafeOrder.lineItems.length > 0 ? phiSafeOrder.lineItems : undefined,
      // PHI-SAFE: Reference token is UUID-based, non-sequential
      note: `Ref: ${phiSafeOrder.referenceToken}`,
      referenceId: saleId, // Internal only, not displayed to customer
      tipSettings: tip_settings || {
        allowTipping: true,
        separateTipScreen: true,
        customTipField: true,
        tipPercentages: [15, 20, 25],
      },
      // Pass tax/discount for adjustments (if supported)
      discountCents: phiSafeOrder.discountCents,
      taxCents: phiSafeOrder.taxCents,
    });
    
    // Create a payment record
    const { data: payment } = await supabase
      .from('sale_payments')
      .insert({
        sale_id: saleId,
        payment_method: 'card',
        payment_processor: 'square',
        amount: amountCents,
        tip_amount: 0, // Will be updated after payment completes
        processing_fee: 0,
        net_amount: amountCents,
        status: 'pending',
        square_order_id: result.orderId,
        square_terminal_checkout_id: result.checkoutId,
        terminal_status: result.status,
      })
      .select()
      .single();
    
    // Link payment to terminal checkout
    if (payment) {
      await supabase
        .from('terminal_checkouts')
        .update({ payment_id: payment.id })
        .eq('square_checkout_id', result.checkoutId);
    }
    
    return NextResponse.json({
      success: true,
      checkout_id: result.checkoutId,
      order_id: result.orderId,
      status: result.status,
      payment_id: payment?.id,
      amount_cents: amountCents,
      reference_token: phiSafeOrder.referenceToken,
      message: 'Checkout sent to terminal. Waiting for customer payment.',
    });
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error starting terminal charge:', error);
    
    // Parse Square errors
    if (error.errors) {
      const squareError = error.errors[0];
      return NextResponse.json(
        { 
          error: squareError.detail || squareError.code || 'Terminal checkout failed',
          code: squareError.code,
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to start terminal charge' },
      { status: 500 }
    );
  }
}
