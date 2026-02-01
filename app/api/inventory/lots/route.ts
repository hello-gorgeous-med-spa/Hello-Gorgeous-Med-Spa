// ============================================================
// INVENTORY LOTS API
// Receive stock, track lot numbers and expiration
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/inventory/lots - List lots for an item
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const itemId = searchParams.get('itemId');
  const status = searchParams.get('status') || 'active';

  try {
    let query = supabase
      .from('inventory_lots')
      .select(`
        *,
        item:inventory_items(id, name, brand)
      `)
      .order('expiration_date', { ascending: true });

    if (itemId) {
      query = query.eq('item_id', itemId);
    }

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ lots: data });
  } catch (error) {
    console.error('Error fetching lots:', error);
    return NextResponse.json({ error: 'Failed to fetch lots' }, { status: 500 });
  }
}

// POST /api/inventory/lots - Receive new stock
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      item_id,
      lot_number,
      quantity,
      cost_per_unit,
      expiration_date,
      supplier,
      invoice_number,
      notes,
      received_by,
    } = body;

    if (!item_id || !lot_number || !quantity || !expiration_date) {
      return NextResponse.json(
        { error: 'Item, lot number, quantity, and expiration date are required' },
        { status: 400 }
      );
    }

    // Create lot
    const { data: lot, error: lotError } = await supabase
      .from('inventory_lots')
      .insert({
        item_id,
        lot_number,
        quantity_received: quantity,
        quantity_remaining: quantity,
        cost_per_unit,
        expiration_date,
        supplier,
        invoice_number,
        notes,
        received_by,
      })
      .select()
      .single();

    if (lotError) throw lotError;

    // Record transaction
    await supabase
      .from('inventory_transactions')
      .insert({
        item_id,
        lot_id: lot.id,
        transaction_type: 'receive',
        quantity,
        performed_by: received_by,
        notes: `Received from ${supplier || 'supplier'}. Invoice: ${invoice_number || 'N/A'}`,
      });

    return NextResponse.json({ lot }, { status: 201 });
  } catch (error) {
    console.error('Error receiving stock:', error);
    return NextResponse.json({ error: 'Failed to receive stock' }, { status: 500 });
  }
}

// PATCH /api/inventory/lots - Use/adjust stock
export async function PATCH(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      lot_id,
      quantity_change, // negative for use, positive for adjustment
      transaction_type = 'use',
      appointment_id,
      client_id,
      provider_id,
      performed_by,
      notes,
    } = body;

    if (!lot_id || quantity_change === undefined) {
      return NextResponse.json({ error: 'Lot ID and quantity change required' }, { status: 400 });
    }

    // Get current lot
    const { data: lot, error: lotError } = await supabase
      .from('inventory_lots')
      .select('*')
      .eq('id', lot_id)
      .single();

    if (lotError || !lot) {
      return NextResponse.json({ error: 'Lot not found' }, { status: 404 });
    }

    const newQuantity = lot.quantity_remaining + quantity_change;

    if (newQuantity < 0) {
      return NextResponse.json({ error: 'Insufficient stock in lot' }, { status: 400 });
    }

    // Update lot
    const { error: updateError } = await supabase
      .from('inventory_lots')
      .update({
        quantity_remaining: newQuantity,
        status: newQuantity === 0 ? 'depleted' : 'active',
      })
      .eq('id', lot_id);

    if (updateError) throw updateError;

    // Record transaction
    await supabase
      .from('inventory_transactions')
      .insert({
        item_id: lot.item_id,
        lot_id,
        transaction_type,
        quantity: quantity_change,
        appointment_id,
        client_id,
        provider_id,
        performed_by,
        notes,
      });

    return NextResponse.json({ 
      success: true, 
      newQuantity,
      status: newQuantity === 0 ? 'depleted' : 'active',
    });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
