// ============================================================
// GET /api/chart-audits — list
// POST /api/chart-audits — create (chart audit checklist)
// Phase 3: Chart audit workflow and storage
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const DEFAULT_CHECKLIST = [
  { id: 'consent', label: 'Consent documented', checked: false },
  { id: 'treatment', label: 'Treatment and sites documented', checked: false },
  { id: 'lot', label: 'Product/lot documented if applicable', checked: false },
  { id: 'followup', label: 'Follow-up plan documented', checked: false },
];

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);

  try {
    const { data, error } = await supabase
      .from('chart_audits')
      .select(`
        id,
        chart_id,
        appointment_id,
        audited_by_provider_id,
        audit_date,
        checklist_result,
        status,
        created_at,
        audited_by:providers(id, first_name, last_name, name)
      `)
      .order('audit_date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[chart-audits GET]', error);
      return NextResponse.json({ error: 'Failed to list audits' }, { status: 500 });
    }

    return NextResponse.json({ audits: data || [] });
  } catch (e) {
    console.error('[chart-audits GET]', e);
    return NextResponse.json({ error: 'Failed to list audits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  let body: {
    chart_id?: string;
    appointment_id?: string;
    audited_by_provider_id?: string;
    audit_date?: string;
    checklist_result?: Array<{ id: string; label: string; checked: boolean }>;
    status?: string;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const checklist = body.checklist_result && body.checklist_result.length > 0
    ? body.checklist_result
    : DEFAULT_CHECKLIST;
  const auditDate = body.audit_date || new Date().toISOString().slice(0, 10);

  try {
    const { data, error } = await supabase
      .from('chart_audits')
      .insert({
        chart_id: body.chart_id || null,
        appointment_id: body.appointment_id || null,
        audited_by_provider_id: body.audited_by_provider_id || null,
        audit_date: auditDate,
        checklist_result: checklist,
        status: body.status || 'completed',
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[chart-audits POST]', error);
      return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
    }

    return NextResponse.json({ audit: data });
  } catch (e) {
    console.error('[chart-audits POST]', e);
    return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
  }
}
