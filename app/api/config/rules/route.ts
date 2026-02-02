// ============================================================
// API: BUSINESS RULES - No-Code Rules Engine
// Owner can create/modify business rules without code
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch { return null; }
}

// Default business rules
const DEFAULT_RULES = [
  {
    id: 'rule-001',
    name: 'Injectable Consent Required',
    description: 'Require neurotoxin consent for all injectable services',
    category: 'consent',
    conditions: [
      { field: 'service.category', operator: 'in', value: ['Injectables', 'BOTOX', 'Dermal Fillers', 'Dermal Fillers'] }
    ],
    actions: [
      { type: 'require_consent', consent_type: 'neurotoxin' }
    ],
    priority: 100,
    is_active: true,
    version: 1,
  },
  {
    id: 'rule-002',
    name: 'Weight Loss Medical Clearance',
    description: 'Require medical consultation for weight loss programs',
    category: 'booking',
    conditions: [
      { field: 'service.category', operator: 'in', value: ['Weight Loss', 'Weight Loss Program', 'Weight Loss Injections'] }
    ],
    actions: [
      { type: 'require_consult', consult_type: 'medical_clearance' }
    ],
    priority: 90,
    is_active: true,
    version: 1,
  },
  {
    id: 'rule-003',
    name: 'New Client Intake',
    description: 'Require intake form for new clients',
    category: 'intake',
    conditions: [
      { field: 'client.is_new', operator: 'equals', value: true }
    ],
    actions: [
      { type: 'require_form', form_type: 'intake' }
    ],
    priority: 80,
    is_active: true,
    version: 1,
  },
  {
    id: 'rule-004',
    name: '24h Cancellation Policy',
    description: 'Apply 50% cancellation fee for cancellations within 24 hours',
    category: 'cancellation',
    conditions: [
      { field: 'hours_until_appointment', operator: 'less_than', value: 24 }
    ],
    actions: [
      { type: 'apply_fee', fee_type: 'cancellation', percentage: 50 }
    ],
    priority: 70,
    is_active: true,
    version: 1,
  },
  {
    id: 'rule-005',
    name: 'No Show Fee',
    description: 'Apply full service fee for no-shows',
    category: 'no_show',
    conditions: [
      { field: 'appointment.status', operator: 'equals', value: 'no_show' }
    ],
    actions: [
      { type: 'apply_fee', fee_type: 'no_show', percentage: 100 }
    ],
    priority: 100,
    is_active: true,
    version: 1,
  },
  {
    id: 'rule-006',
    name: 'Lot Tracking for Injectables',
    description: 'Require lot number and expiration for injectable charting',
    category: 'charting',
    conditions: [
      { field: 'service.category', operator: 'in', value: ['Injectables', 'BOTOX', 'Dermal Fillers'] }
    ],
    actions: [
      { type: 'require_field', field: 'lot_number' },
      { type: 'require_field', field: 'expiration_date' }
    ],
    priority: 85,
    is_active: true,
    version: 1,
  },
];

export async function GET() {
  const supabase = getSupabase();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('business_rules')
        .select('*')
        .order('priority', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ rules: data, source: 'database' });
      }
    } catch (error) {
      console.log('Business rules DB error:', error);
    }
  }

  return NextResponse.json({ rules: DEFAULT_RULES, source: 'defaults' });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { name, description, category, conditions, actions, priority, is_active } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'name and category required' }, { status: 400 });
    }

    const rule = {
      name,
      description,
      category,
      conditions: conditions || [],
      actions: actions || [],
      priority: priority || 0,
      is_active: is_active !== false,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('business_rules')
        .insert(rule)
        .select()
        .single();

      if (!error) {
        await supabase.from('config_audit_log').insert({
          table_name: 'business_rules',
          record_id: data.id,
          action: 'create',
          new_value: rule,
          description: `Created rule: ${name}`,
        });
        return NextResponse.json({ success: true, rule: data });
      }
    }

    return NextResponse.json({ success: true, rule: { id: `rule-${Date.now()}`, ...rule }, source: 'local' });
  } catch (error: any) {
    console.error('Business rule POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();
    if (updates.conditions || updates.actions) {
      updates.version = (body.version || 1) + 1;
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('business_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (!error) {
        await supabase.from('config_audit_log').insert({
          table_name: 'business_rules',
          record_id: id,
          action: 'update',
          new_value: updates,
          description: `Updated rule: ${data.name}`,
        });
        return NextResponse.json({ success: true, rule: data });
      }
    }

    return NextResponse.json({ success: true, rule: { id, ...updates }, source: 'local' });
  } catch (error: any) {
    console.error('Business rule PUT error:', error);
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
      .from('business_rules')
      .delete()
      .eq('id', id);

    if (!error) {
      await supabase.from('config_audit_log').insert({
        table_name: 'business_rules',
        record_id: id,
        action: 'delete',
        description: `Deleted rule: ${id}`,
      });
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ success: true, source: 'local' });
}
