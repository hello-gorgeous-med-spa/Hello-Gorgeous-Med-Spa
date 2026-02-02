// ============================================================
// API: INVENTORY - Full CRUD
// Manage products, stock levels, lot numbers
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/inventory - List inventory with optional filters
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
    const search = searchParams.get('search');

    let query = supabase
      .from('inventory_products')
      .select(`
        id,
        name,
        brand,
        category,
        sku,
        current_stock,
        reorder_point,
        price_per_unit,
        cost_per_unit,
        is_active,
        inventory_lots(id, lot_number, quantity, expiration_date, received_at)
      `)
      .eq('is_active', true)
      .order('name');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Inventory fetch error:', error);
      return NextResponse.json({ inventory: [] });
    }

    let inventory = (products || []).map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      sku: p.sku,
      currentStock: p.current_stock || 0,
      reorder_point: p.reorder_point || 10,
      price_per_unit: p.price_per_unit || 0,
      cost_per_unit: p.cost_per_unit || 0,
      lots: p.inventory_lots || [],
    }));

    if (lowStockOnly) {
      inventory = inventory.filter(item => item.currentStock <= item.reorder_point);
    }

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error('Inventory GET error:', error);
    return NextResponse.json({ inventory: [] });
  }
}

// POST /api/inventory - Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { name, brand, category, sku, reorder_point, price_per_unit, cost_per_unit } = body;

    if (!name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    const { data: product, error } = await supabase
      .from('inventory_products')
      .insert({
        name,
        brand: brand || null,
        category: category || 'supplies',
        sku: sku || null,
        current_stock: 0,
        reorder_point: reorder_point || 10,
        price_per_unit: price_per_unit || 0,
        cost_per_unit: cost_per_unit || 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Product create error:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Inventory POST error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT /api/inventory - Update product or receive stock
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, action, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // RECEIVE STOCK action
    if (action === 'receive_stock') {
      const { quantity, lot_number, expiration_date, cost_per_unit, notes } = data;

      if (!quantity || quantity <= 0) {
        return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 });
      }

      // Create lot record if lot tracking enabled
      if (lot_number) {
        await supabase
          .from('inventory_lots')
          .insert({
            product_id: id,
            lot_number,
            quantity,
            expiration_date: expiration_date || null,
            received_at: new Date().toISOString(),
            notes: notes || null,
          });
      }

      // Update stock level
      const { data: current } = await supabase
        .from('inventory_products')
        .select('current_stock')
        .eq('id', id)
        .single();

      const newStock = (current?.current_stock || 0) + quantity;

      const updateData: any = { 
        current_stock: newStock,
        updated_at: new Date().toISOString(),
      };
      if (cost_per_unit) updateData.cost_per_unit = cost_per_unit;

      await supabase
        .from('inventory_products')
        .update(updateData)
        .eq('id', id);

      // Log the transaction
      await supabase
        .from('inventory_transactions')
        .insert({
          product_id: id,
          transaction_type: 'receive',
          quantity,
          lot_number: lot_number || null,
          notes: notes || null,
        });

      return NextResponse.json({ success: true, message: 'Stock received', newStock });
    }

    // Regular UPDATE
    const update: any = {};
    if (data.name !== undefined) update.name = data.name;
    if (data.brand !== undefined) update.brand = data.brand;
    if (data.category !== undefined) update.category = data.category;
    if (data.sku !== undefined) update.sku = data.sku;
    if (data.reorder_point !== undefined) update.reorder_point = data.reorder_point;
    if (data.price_per_unit !== undefined) update.price_per_unit = data.price_per_unit;
    if (data.cost_per_unit !== undefined) update.cost_per_unit = data.cost_per_unit;
    update.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('inventory_products')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Product update error:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product updated' });
  } catch (error) {
    console.error('Inventory PUT error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// DELETE /api/inventory - Soft delete product
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('inventory_products')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Product delete error:', error);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Inventory DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
