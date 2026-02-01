// ============================================================
// INVENTORY API
// CRUD operations for inventory items and lots
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/inventory - List inventory items with stock levels
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const lowStockOnly = searchParams.get('lowStockOnly') === 'true';
  const search = searchParams.get('search');

  try {
    // Get inventory items
    let query = supabase
      .from('inventory_items')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,sku.ilike.%${search}%`);
    }

    const { data: items, error: itemsError } = await query;

    if (itemsError) throw itemsError;

    // Get current stock for each item from active, non-expired lots
    const { data: lots, error: lotsError } = await supabase
      .from('inventory_lots')
      .select('*')
      .eq('status', 'active')
      .gt('expiration_date', new Date().toISOString().split('T')[0]);

    if (lotsError) throw lotsError;

    // Combine items with their stock levels
    const inventory = (items || []).map(item => {
      const itemLots = (lots || []).filter(lot => lot.item_id === item.id);
      const currentStock = itemLots.reduce((sum, lot) => sum + (lot.quantity_remaining || 0), 0);
      
      return {
        ...item,
        currentStock,
        lots: itemLots,
        isLowStock: currentStock <= item.reorder_point,
      };
    });

    // Filter low stock if requested
    const filteredInventory = lowStockOnly 
      ? inventory.filter(item => item.isLowStock)
      : inventory;

    // Calculate stats
    const stats = {
      total: inventory.length,
      lowStock: inventory.filter(i => i.isLowStock).length,
      totalValue: inventory.reduce((sum, i) => sum + (i.currentStock * (i.cost_per_unit || 0)), 0),
      categories: [...new Set(inventory.map(i => i.category))].length,
    };

    return NextResponse.json({
      inventory: filteredInventory,
      stats,
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

// POST /api/inventory - Create new inventory item
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      name,
      brand,
      category,
      sku,
      unit_type = 'units',
      cost_per_unit = 0,
      price_per_unit = 0,
      reorder_point = 10,
      is_controlled = false,
      requires_lot_tracking = true,
    } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Name and category are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('inventory_items')
      .insert({
        name,
        brand,
        category,
        sku,
        unit_type,
        cost_per_unit,
        price_per_unit,
        reorder_point,
        is_controlled,
        requires_lot_tracking,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}
