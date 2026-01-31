// ============================================================
// SERVICES API
// CRUD operations for services
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/services - List all services
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const categoryId = searchParams.get('categoryId');
  const isActive = searchParams.get('active');

  try {
    let query = supabase
      .from('services')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('name');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (isActive === 'true') {
      query = query.eq('is_active', true);
    } else if (isActive === 'false') {
      query = query.eq('is_active', false);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ services: data });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/services - Create new service
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const {
      name,
      description,
      category_id,
      duration_minutes,
      buffer_minutes = 0,
      price,
      cost,
      requires_consultation = false,
      requires_consent = false,
      consent_form_ids,
    } = body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'name and price are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('services')
      .insert({
        name,
        description,
        category_id,
        duration_minutes: duration_minutes || 30,
        buffer_minutes,
        price,
        cost,
        is_active: true,
        requires_consultation,
        requires_consent,
        consent_form_ids,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ service: data }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
