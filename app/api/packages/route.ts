// ============================================================
// API: SERVICE PACKAGES
// Create, manage bundled service packages
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/packages - List all packages
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    let query = supabase
      .from('service_packages')
      .select(`
        *,
        package_services:service_package_items(
          id,
          service_id,
          quantity,
          services(id, name, price_cents, duration_minutes)
        )
      `)
      .order('name');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data: packages, error } = await query;

    if (error) {
      console.error('Packages fetch error:', error);
      return NextResponse.json({ packages: [] });
    }

    // Calculate savings for each package
    const packagesWithSavings = (packages || []).map(pkg => {
      const regularPrice = (pkg.package_services || []).reduce((sum: number, ps: any) => {
        const servicePrice = ps.services?.price_cents || 0;
        return sum + (servicePrice * (ps.quantity || 1));
      }, 0);

      return {
        ...pkg,
        regular_price_cents: regularPrice,
        savings_cents: regularPrice - (pkg.price_cents || 0),
        savings_percent: regularPrice > 0 ? Math.round((1 - (pkg.price_cents || 0) / regularPrice) * 100) : 0,
      };
    });

    return NextResponse.json({ packages: packagesWithSavings });
  } catch (error) {
    console.error('Packages GET error:', error);
    return NextResponse.json({ packages: [] });
  }
}

// POST /api/packages - Create new package
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const {
      name,
      description,
      price_cents,
      services, // Array of { service_id, quantity }
      validity_days,
      max_uses,
      is_featured,
    } = body;

    if (!name || !price_cents || !services || services.length === 0) {
      return NextResponse.json({ error: 'Name, price, and at least one service are required' }, { status: 400 });
    }

    // Create the package
    const { data: pkg, error: pkgError } = await supabase
      .from('service_packages')
      .insert({
        name,
        description: description || null,
        price_cents,
        validity_days: validity_days || null,
        max_uses: max_uses || null,
        is_featured: is_featured || false,
        is_active: true,
      })
      .select()
      .single();

    if (pkgError) {
      console.error('Package create error:', pkgError);
      return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
    }

    // Add services to package
    const serviceItems = services.map((s: any) => ({
      package_id: pkg.id,
      service_id: s.service_id,
      quantity: s.quantity || 1,
    }));

    const { error: itemsError } = await supabase
      .from('service_package_items')
      .insert(serviceItems);

    if (itemsError) {
      console.error('Package items create error:', itemsError);
      // Rollback package creation
      await supabase.from('service_packages').delete().eq('id', pkg.id);
      return NextResponse.json({ error: 'Failed to add services to package' }, { status: 500 });
    }

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error('Packages POST error:', error);
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 });
  }
}

// PUT /api/packages - Update package
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();

    const { id, services, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    // Update package details
    const update: any = { updated_at: new Date().toISOString() };
    if (data.name !== undefined) update.name = data.name;
    if (data.description !== undefined) update.description = data.description;
    if (data.price_cents !== undefined) update.price_cents = data.price_cents;
    if (data.validity_days !== undefined) update.validity_days = data.validity_days;
    if (data.max_uses !== undefined) update.max_uses = data.max_uses;
    if (data.is_featured !== undefined) update.is_featured = data.is_featured;
    if (data.is_active !== undefined) update.is_active = data.is_active;

    const { error: updateError } = await supabase
      .from('service_packages')
      .update(update)
      .eq('id', id);

    if (updateError) {
      console.error('Package update error:', updateError);
      return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
    }

    // Update services if provided
    if (services) {
      // Remove existing service items
      await supabase
        .from('service_package_items')
        .delete()
        .eq('package_id', id);

      // Add new service items
      if (services.length > 0) {
        const serviceItems = services.map((s: any) => ({
          package_id: id,
          service_id: s.service_id,
          quantity: s.quantity || 1,
        }));

        const { error: itemsError } = await supabase
          .from('service_package_items')
          .insert(serviceItems);

        if (itemsError) {
          console.error('Package items update error:', itemsError);
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Package updated' });
  } catch (error) {
    console.error('Packages PUT error:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

// DELETE /api/packages - Delete package
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    // Delete service items first
    await supabase
      .from('service_package_items')
      .delete()
      .eq('package_id', id);

    // Delete package
    const { error } = await supabase
      .from('service_packages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Package delete error:', error);
      return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    console.error('Packages DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
