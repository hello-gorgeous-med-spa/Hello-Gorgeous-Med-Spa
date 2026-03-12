// ============================================================
// API: CHART NOTES — Template-driven clinical charting
// GET: list by client_id (optional limit, appointment_id filter)
// POST: create note (client_id, appointment_id?, template_type, payload)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type ChartNoteTemplate = 'soap' | 'injection' | 'iv' | 'hormone' | 'general';

export interface ChartNotePayload {
  template_type: ChartNoteTemplate;
  title?: string;
  status?: 'draft' | 'final' | 'locked' | 'amended';
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  product?: string;
  units_syringes?: string;
  dilution?: string;
  lot?: string;
  expiration?: string;
  areas?: string;
  provider_name?: string;
  consent_verified?: boolean;
  complications?: string;
  follow_up?: string;
  route?: string;
  site?: string;
  needle?: string;
  dosage?: string;
  toleration?: string;
  protocol?: string;
  follow_up_interval?: string;
  labs?: string;
  response?: string;
  post_care?: string;
  before_after_notes?: string;
  [key: string]: unknown;
}

export interface ChartNoteRecord {
  id: string;
  client_id: string;
  appointment_id?: string | null;
  template_type: ChartNoteTemplate;
  title: string;
  status: string;
  payload: ChartNotePayload;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  created_by_name?: string | null;
}

function toRecord(raw: Record<string, unknown>): ChartNoteRecord {
  return {
    id: String(raw.id),
    client_id: String(raw.client_id),
    appointment_id: raw.appointment_id == null ? null : String(raw.appointment_id),
    template_type: (raw.note_type as ChartNoteTemplate) || (raw.template_type as ChartNoteTemplate) || 'general',
    title: String(raw.title || 'Chart Note'),
    status: String(raw.status || 'draft'),
    payload: {
      subjective: raw.subjective as string || undefined,
      objective: raw.objective as string || undefined,
      assessment: raw.assessment as string || undefined,
      plan: raw.plan as string || undefined,
      procedure_details: raw.procedure_details as any || undefined,
      ...((raw.payload as ChartNotePayload) || {}),
    } as ChartNotePayload,
    created_at: String(raw.created_at),
    updated_at: String(raw.updated_at),
    created_by: raw.created_by == null ? null : String(raw.created_by),
    created_by_name: raw.created_by_name == null ? null : String(raw.created_by_name),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');
  const appointmentId = searchParams.get('appointment_id');
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const id = searchParams.get('id');

  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    if (id) {
      const { data, error } = await supabase
        .from('chart_notes')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json({ note: toRecord(data as Record<string, unknown>) });
    }

    if (!clientId) {
      return NextResponse.json({ error: 'client_id required' }, { status: 400 });
    }

    let query = supabase
      .from('chart_notes')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (appointmentId) {
      query = query.eq('appointment_id', appointmentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Chart notes fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }

    const notes = (data || []).map(n => toRecord(n as Record<string, unknown>));
    return NextResponse.json({ notes, total: notes.length });
  } catch (error) {
    console.error('Chart notes API error:', error);
    return NextResponse.json({ error: 'Failed to fetch chart notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const clientId = body.client_id as string | undefined;
  if (!clientId) return NextResponse.json({ error: 'client_id required' }, { status: 400 });

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const templateType = (body.template_type as ChartNoteTemplate) || 'general';
  const payload: ChartNotePayload = (body.payload as ChartNotePayload) || {};
  const title = (body.title as string) || payload.title || `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Note`;
  const status = (body.status as string) || payload.status || 'draft';

  try {
    const noteData: Record<string, unknown> = {
      client_id: clientId,
      appointment_id: body.appointment_id || null,
      service_id: body.service_id || null,
      note_type: templateType,
      title,
      status,
      subjective: payload.subjective || body.subjective || null,
      objective: payload.objective || body.objective || null,
      assessment: payload.assessment || body.assessment || null,
      plan: payload.plan || body.plan || null,
      procedure_details: payload.procedure_details || body.procedure_details || null,
      created_by: body.created_by || null,
    };

    const { data, error } = await supabase
      .from('chart_notes')
      .insert(noteData)
      .select()
      .single();

    if (error) {
      console.error('Chart note create error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note: toRecord(data as Record<string, unknown>) }, { status: 201 });
  } catch (error) {
    console.error('Chart note POST error:', error);
    return NextResponse.json({ error: 'Failed to create chart note' }, { status: 500 });
  }
}
