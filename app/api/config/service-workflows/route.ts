// ============================================================
// API: SERVICE WORKFLOWS - Configurable service requirements
// Owner can define per-service requirements without code
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch { return null; }
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('service_id');

  if (supabase) {
    try {
      let query = supabase
        .from('service_workflows')
        .select(`
          *,
          service:services(id, name, category_id)
        `);

      if (serviceId) {
        query = query.eq('service_id', serviceId);
      }

      const { data, error } = await query;

      if (!error && data) {
        return NextResponse.json({ workflows: data, source: 'database' });
      }
    } catch (error) {
      console.log('Service workflows DB error:', error);
    }
  }

  return NextResponse.json({ workflows: [], source: 'defaults' });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { 
      service_id,
      required_consents,
      required_chart_sections,
      require_photos_before,
      require_photos_after,
      require_lot_tracking,
      follow_up_days,
      follow_up_message,
      pre_instructions,
      post_instructions,
      buffer_before_minutes,
      buffer_after_minutes,
    } = body;

    if (!service_id) {
      return NextResponse.json({ error: 'service_id required' }, { status: 400 });
    }

    const workflow = {
      service_id,
      required_consents: required_consents || [],
      required_chart_sections: required_chart_sections || [],
      require_photos_before: require_photos_before || false,
      require_photos_after: require_photos_after || false,
      require_lot_tracking: require_lot_tracking || false,
      follow_up_days,
      follow_up_message,
      pre_instructions,
      post_instructions,
      buffer_before_minutes: buffer_before_minutes || 0,
      buffer_after_minutes: buffer_after_minutes || 15,
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('service_workflows')
        .upsert(workflow, {
          onConflict: 'service_id',
        })
        .select()
        .single();

      if (!error) {
        await supabase.from('config_audit_log').insert({
          table_name: 'service_workflows',
          record_id: data.id,
          action: 'upsert',
          new_value: workflow,
          description: `Updated workflow for service ${service_id}`,
        });
        return NextResponse.json({ success: true, workflow: data });
      }
    }

    return NextResponse.json({ 
      success: true, 
      workflow: { id: `wf-${Date.now()}`, ...workflow },
      source: 'local' 
    });
  } catch (error: any) {
    console.error('Service workflow POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { id, service_id, ...updates } = body;

    if (!id && !service_id) {
      return NextResponse.json({ error: 'id or service_id required' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    if (supabase) {
      let query = supabase.from('service_workflows').update(updates);
      
      if (id) {
        query = query.eq('id', id);
      } else {
        query = query.eq('service_id', service_id);
      }

      const { data, error } = await query.select().single();

      if (!error) {
        await supabase.from('config_audit_log').insert({
          table_name: 'service_workflows',
          record_id: data.id,
          action: 'update',
          new_value: updates,
          description: `Updated service workflow`,
        });
        return NextResponse.json({ success: true, workflow: data });
      }
    }

    return NextResponse.json({ success: true, workflow: { id, service_id, ...updates }, source: 'local' });
  } catch (error: any) {
    console.error('Service workflow PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const serviceId = searchParams.get('service_id');

  if (!id && !serviceId) {
    return NextResponse.json({ error: 'id or service_id required' }, { status: 400 });
  }

  if (supabase) {
    let query = supabase.from('service_workflows').delete();
    
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('service_id', serviceId);
    }

    const { error } = await query;

    if (!error) {
      await supabase.from('config_audit_log').insert({
        table_name: 'service_workflows',
        action: 'delete',
        description: `Deleted service workflow`,
      });
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ success: true, source: 'local' });
}
