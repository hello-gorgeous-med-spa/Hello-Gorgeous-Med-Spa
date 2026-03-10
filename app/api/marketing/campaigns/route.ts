// ============================================================
// API: MARKETING CAMPAIGNS — list + create (Phase 5)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const store = new Map<string, Record<string, unknown>>();
let idCounter = 1;
function nextId() {
  return `mkt-${Date.now()}-${idCounter++}`;
}

export async function GET() {
  const list = Array.from(store.values())
    .map((r) => ({
      id: r.id,
      name: r.name,
      channel: r.channel || 'sms',
      status: r.status || 'draft',
      created_at: r.created_at,
    }))
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return NextResponse.json({ campaigns: list, total: list.length });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  const now = new Date().toISOString();
  const id = nextId();
  const record = {
    id,
    name,
    channel: body.channel || 'sms',
    status: body.status || 'draft',
    segment_id: body.segment_id ?? null,
    created_at: now,
    updated_at: now,
  };
  store.set(id, record as Record<string, unknown>);
  return NextResponse.json({ campaign: record }, { status: 201 });
}
