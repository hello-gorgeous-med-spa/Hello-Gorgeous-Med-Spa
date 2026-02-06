// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: PROVIDERS - Full CRUD
// Manage bookable providers/staff
// ONLY Ryan Kent and Danielle Alcala are allowed
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// Safe Supabase helper - returns null if not configured
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  try {
    // createClient imported at top
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// ONLY THESE TWO PROVIDERS - HARDCODED
const ALLOWED_PROVIDERS = [
  {
    id: 'ryan-kent',
    first_name: 'Ryan',
    last_name: 'Kent',
    email: 'ryan@hellogorgeousmedspa.com',
    credentials: 'FNP-BC',
    color_hex: '#3b82f6',
    is_active: true,
  },
  {
    id: 'danielle-alcala',
    first_name: 'Danielle',
    last_name: 'Alcala',
    email: 'hello.gorgeous@hellogorgeousmedspa.com',
    credentials: 'RN-S',
    color_hex: '#ec4899',
    is_active: true,
  },
];

// Helper to check if a name matches allowed providers
function isAllowedProvider(firstName: string, lastName: string): boolean {
  const fullName = `${firstName} ${lastName}`.toLowerCase();
  return (
    fullName.includes('ryan') && fullName.includes('kent') ||
    fullName.includes('danielle') && (fullName.includes('alcala') || fullName.includes('glazier'))
  );
}

// GET /api/providers - List ONLY Ryan and Danielle
export async function GET() {
  // Always return fallback if Supabase not configured
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ providers: ALLOWED_PROVIDERS });
  }

  try {
    // Try to get providers - support both direct columns and users join
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        email,
        credentials,
        color_hex,
        is_active
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Providers fetch error:', error);
      // Return hardcoded fallback
      return NextResponse.json({ providers: ALLOWED_PROVIDERS });
    }

    // Format providers - use direct columns
    if (providers && providers.length > 0) {
      // Filter to ONLY allowed providers (if they have names)
      const filtered = providers.filter(p => {
        const firstName = p.first_name || '';
        const lastName = p.last_name || '';
        // If no name set, include anyway
        if (!firstName && !lastName) return true;
        return isAllowedProvider(firstName, lastName);
      });

      const formatted = filtered.map(p => ({
        id: p.id,
        user_id: p.user_id,
        first_name: p.first_name || 'Provider',
        last_name: p.last_name || '',
        email: p.email,
        credentials: p.credentials,
        color_hex: p.color_hex || '#EC4899',
        is_active: p.is_active,
      }));
      
      if (formatted.length > 0) {
        return NextResponse.json({ providers: formatted });
      }
    }

    // Return hardcoded fallback
    return NextResponse.json({ providers: ALLOWED_PROVIDERS });
  } catch (error) {
    console.error('Providers GET error:', error);
    return NextResponse.json({ providers: ALLOWED_PROVIDERS });
  }
}

// POST /api/providers - Create new provider
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const { user_id, credentials, color_hex } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Check if already a provider
    const { data: existing } = await supabase
      .from('providers')
      .select('id')
      .eq('user_id', user_id)
      .single();

    if (existing) {
      // Reactivate if exists
      const { error } = await supabase
        .from('providers')
        .update({ is_active: true, credentials, color_hex })
        .eq('id', existing.id);

      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Provider reactivated' });
    }

    // Create new provider
    const { data: newProvider, error } = await supabase
      .from('providers')
      .insert({
        user_id,
        credentials: credentials || null,
        color_hex: color_hex || '#EC4899',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Provider create error:', error);
      return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, provider: newProvider });
  } catch (error) {
    console.error('Providers POST error:', error);
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 });
  }
}

// PUT /api/providers - Update provider
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();

    const { id, credentials, color_hex, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const update: any = {};
    if (credentials !== undefined) update.credentials = credentials;
    if (color_hex !== undefined) update.color_hex = color_hex;
    if (is_active !== undefined) update.is_active = is_active;
    update.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('providers')
      .update(update)
      .eq('id', id);

    if (error) {
      console.error('Provider update error:', error);
      return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Provider updated' });
  } catch (error) {
    console.error('Providers PUT error:', error);
    return NextResponse.json({ error: 'Failed to update provider' }, { status: 500 });
  }
}

// DELETE /api/providers - Soft delete (deactivate) provider
export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    // Soft delete - just deactivate
    const { error } = await supabase
      .from('providers')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Provider delete error:', error);
      return NextResponse.json({ error: 'Failed to remove provider' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Provider removed' });
  } catch (error) {
    console.error('Providers DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove provider' }, { status: 500 });
  }
}
