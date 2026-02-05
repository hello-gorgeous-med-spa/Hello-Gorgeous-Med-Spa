// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: PROVIDER CAPABILITIES - Owner-controlled provider permissions
// No hardcoded provider logic - all configurable
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    // createClient imported at top
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const providerId = searchParams.get('provider_id');

  if (supabase) {
    try {
      let query = supabase
        .from('provider_capabilities')
        .select(`
          *,
          provider:providers(
            id,
            user:users(first_name, last_name)
          ),
          service:services(id, name)
        `);

      if (providerId) {
        query = query.eq('provider_id', providerId);
      }

      const { data, error } = await query;

      if (!error && data) {
        return NextResponse.json({ capabilities: data, source: 'database' });
      }
    } catch (error) {
      console.log('Provider capabilities DB error:', error);
    }
  }

  // Return empty array if no DB - capabilities must be configured
  return NextResponse.json({ capabilities: [], source: 'defaults' });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { provider_id, service_id, capability, value, notes } = body;

    if (!provider_id || !capability) {
      return NextResponse.json({ error: 'provider_id and capability required' }, { status: 400 });
    }

    const capabilityData = {
      provider_id,
      service_id: service_id || null,
      capability,
      value: value !== undefined ? value : true,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('provider_capabilities')
        .upsert(capabilityData, {
          onConflict: 'provider_id,service_id,capability',
        })
        .select()
        .single();

      if (!error) {
        // Log the change
        await supabase.from('config_audit_log').insert({
          table_name: 'provider_capabilities',
          record_id: data.id,
          action: 'upsert',
          new_value: capabilityData,
          description: `Set capability "${capability}" for provider`,
        });
        return NextResponse.json({ success: true, capability: data });
      }
    }

    return NextResponse.json({ 
      success: true, 
      capability: { id: `cap-${Date.now()}`, ...capabilityData },
      source: 'local' 
    });
  } catch (error: any) {
    console.error('Provider capability POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  if (supabase) {
    const { error } = await supabase
      .from('provider_capabilities')
      .delete()
      .eq('id', id);

    if (!error) {
      await supabase.from('config_audit_log').insert({
        table_name: 'provider_capabilities',
        record_id: id,
        action: 'delete',
        description: `Removed provider capability`,
      });
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ success: true, source: 'local' });
}
