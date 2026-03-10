// ============================================================
// API: CHART NOTES — Template-driven clinical charting
// GET: list by client_id (optional limit, appointment_id filter)
// POST: create note (client_id, appointment_id?, template_type, payload)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory store when DB not used (matches clients API pattern)
const noteStore = new Map<string, Record<string, unknown>>();
let idCounter = 1;

function nextId() {
  return `cn-${Date.now()}-${idCounter++}`;
}

export type ChartNoteTemplate = 'soap' | 'injection' | 'iv' | 'hormone' | 'general';

export interface ChartNotePayload {
  template_type: ChartNoteTemplate;
  title?: string;
  status?: 'draft' | 'final' | 'locked' | 'amended';
  // SOAP
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  // Injection
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
  // IV
  route?: string;
  site?: string;
  needle?: string;
  dosage?: string;
  toleration?: string;
  // Hormone
  protocol?: string;
  follow_up_interval?: string;
  labs?: string;
  response?: string;
  // Common
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
    template_type: (raw.template_type as ChartNoteTemplate) || 'general',
    title: String(raw.title || 'Chart Note'),
    status: String(raw.status || 'draft'),
    payload: (raw.payload as ChartNotePayload) || {},
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

  if (id) {
    const note = noteStore.get(id);
    if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ note: toRecord(note as Record<string, unknown>) });
  }

  if (!clientId) {
    return NextResponse.json({ error: 'client_id required' }, { status: 400 });
  }

  let list = Array.from(noteStore.values())
    .filter((n: any) => n.client_id === clientId)
    .map((n) => toRecord(n as Record<string, unknown>));

  if (appointmentId) {
    list = list.filter((n) => n.appointment_id === appointmentId);
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const notes = list.slice(0, limit);

  return NextResponse.json({ notes, total: list.length, source: 'local' });
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

  const templateType = (body.template_type as ChartNoteTemplate) || 'general';
  const payload: ChartNotePayload = (body.payload as ChartNotePayload) || {};
  payload.template_type = templateType;

  const now = new Date().toISOString();
  const id = nextId();
  const title = (body.title as string) || payload.title || `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Note`;
  const status = (body.status as string) || payload.status || 'draft';

  const record: ChartNoteRecord = {
    id,
    client_id: clientId,
    appointment_id: body.appointment_id == null ? null : String(body.appointment_id),
    template_type: templateType,
    title,
    status,
    payload: { ...payload, template_type: templateType },
    created_at: now,
    updated_at: now,
    created_by: (body.created_by as string) || null,
    created_by_name: (body.created_by_name as string) || null,
  };

  noteStore.set(id, record as unknown as Record<string, unknown>);

  return NextResponse.json({ note: record }, { status: 201 });
}
