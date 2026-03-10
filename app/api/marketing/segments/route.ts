// ============================================================
// API: MARKETING SEGMENTS — list + create (Phase 5)
// Audience filters: never_booked, no_visit_90d, vip, etc.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const store = new Map<string, Record<string, unknown>>();
let idCounter = 1;
function nextId() {
  return `seg-${Date.now()}-${idCounter++}`;
}

export async function GET() {
  const list = Array.from(store.values())
    .map((r) => ({
      id: r.id,
      name: r.name,
      filter_id: r.filter_id,
      count_estimate: r.count_estimate,
    }))
    .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
  return NextResponse.json({ segments: list, total: list.length });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  const filter_id = String(body.filter_id || '').trim();
  if (!name || !filter_id) return NextResponse.json({ error: 'name and filter_id are required' }, { status: 400 });
  const id = nextId();
  const record = {
    id,
    name,
    filter_id,
    count_estimate: body.count_estimate ?? null,
    created_at: new Date().toISOString(),
  };
  store.set(id, record as Record<string, unknown>);
  return NextResponse.json({ segment: record }, { status: 201 });
}
