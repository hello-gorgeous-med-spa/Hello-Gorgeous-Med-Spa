// ============================================================
// API: SERVICE CATEGORIES
// GET: list all categories
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  try {
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json({ categories: [], source: 'local' });
  }

  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('id, name, slug, icon, description, display_order, is_active')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('name');

    if (error) throw error;

    return NextResponse.json({ 
      categories: data || [],
      total: data?.length || 0,
    });
  } catch (err) {
    console.error('Service categories GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch categories', categories: [] }, { status: 500 });
  }
}
