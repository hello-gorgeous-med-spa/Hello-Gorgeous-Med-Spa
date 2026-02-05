// ============================================================
// POS INVOICES API
// Create and manage invoices/sales for terminal checkout
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { dollarsToCents } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/pos/invoices
 * List invoices with optional filters, or fetch a single invoice by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const clientId = searchParams.get('client_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const supabase = createServerSupabaseClient();
    
    // If ID is provided, fetch single invoice
    if (id) {
      const { data: invoice, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (*),
          sale_payments (*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Invoice not found' },
            { status: 404 }
          );
        }
        throw error;
      }
      
      return NextResponse.json({ invoice });
    }
    
    // Otherwise list invoices
    let query = supabase
      .from('sales')
      .select(`
        *,
        sale_items (*),
        sale_payments (*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data: invoices, error, count } = await query;
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      invoices,
      total: count,
      limit,
      offset,
    });
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pos/invoices
 * Create a new invoice (sale) for checkout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      client_id,
      appointment_id,
      provider_id,
      items,
      discount_amount = 0,
      discount_type,
      discount_reason,
      tax_rate = 0,
      notes,
    } = body;
    
    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }
    
    const supabase = createServerSupabaseClient();
    
    // Calculate totals
    let subtotal = 0;
    const processedItems = items.map((item: any) => {
      const unitPrice = typeof item.unit_price === 'number' 
        ? dollarsToCents(item.unit_price) 
        : item.unit_price_cents || 0;
      const quantity = item.quantity || 1;
      const itemDiscount = item.discount_amount 
        ? dollarsToCents(item.discount_amount) 
        : (item.discount_amount_cents || 0);
      const itemTotal = (unitPrice * quantity) - itemDiscount;
      
      subtotal += itemTotal;
      
      return {
        item_type: item.type || item.item_type || 'service',
        item_id: item.id || item.item_id,
        item_name: item.name || item.item_name,
        item_description: item.description,
        provider_id: item.provider_id,
        quantity,
        unit_price: unitPrice,
        discount_amount: itemDiscount,
        tax_amount: 0, // Will calculate below
        total_price: itemTotal,
      };
    });
    
    // Calculate order-level discount
    const discountTotal = discount_type === 'percent'
      ? Math.round(subtotal * (discount_amount / 100))
      : dollarsToCents(discount_amount);
    
    // Calculate tax (on subtotal minus discount)
    const taxableAmount = subtotal - discountTotal;
    const taxTotal = Math.round(taxableAmount * (tax_rate / 100));
    
    // Grand total (before tip - tip will be added at terminal)
    const grossTotal = subtotal - discountTotal + taxTotal;
    
    // Create the sale
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert({
        client_id: client_id || null,
        appointment_id: appointment_id || null,
        provider_id: provider_id || null,
        sale_type: 'service',
        status: 'draft',
        subtotal,
        discount_total: discountTotal,
        discount_type,
        discount_reason,
        tax_total: taxTotal,
        tax_rate,
        tip_total: 0, // Will be set after terminal payment
        gross_total: grossTotal,
        net_total: grossTotal,
        amount_paid: 0,
        balance_due: grossTotal,
        internal_notes: notes,
      })
      .select()
      .single();
    
    if (saleError) {
      throw saleError;
    }
    
    // Create sale items
    const itemsToInsert = processedItems.map((item: any) => ({
      ...item,
      sale_id: sale.id,
    }));
    
    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(itemsToInsert);
    
    if (itemsError) {
      console.error('Error creating sale items:', itemsError);
      // Don't fail - sale is created
    }
    
    // Fetch the complete sale with items
    const { data: completeSale } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items (*)
      `)
      .eq('id', sale.id)
      .single();
    
    return NextResponse.json({
      invoice: completeSale,
      sale_id: sale.id,
      sale_number: sale.sale_number,
    });
    
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
