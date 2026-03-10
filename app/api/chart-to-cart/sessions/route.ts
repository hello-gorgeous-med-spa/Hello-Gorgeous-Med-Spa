// ============================================================
// API: CHART-TO-CART SESSIONS — "chart then add to cart"
// GET: list by client_id (optional limit); POST: create session
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { sessionStore, nextSessionId } from '../store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('client_id');
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const id = searchParams.get('id');

  if (id) {
    const session = sessionStore.get(id);
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ session });
  }

  if (!clientId) {
    const all = Array.from(sessionStore.values())
      .sort((a: any, b: any) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
      .slice(0, limit);
    return NextResponse.json({ sessions: all, total: sessionStore.size });
  }

  const list = Array.from(sessionStore.values())
    .filter((s: any) => s.client_id === clientId)
    .sort((a: any, b: any) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, limit);

  return NextResponse.json({ sessions: list, total: list.length });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const clientId = body.client_id as string | undefined;
  if (!clientId) return NextResponse.json({ error: 'client_id is required' }, { status: 400 });

  const now = new Date().toISOString();
  const products = (body.products as { name: string; quantity: number; unit_price?: number }[]) || [];
  const total = products.reduce((sum, p) => sum + (Number(p.quantity) || 0) * (Number(p.unit_price) || 0), 0);
  const treatmentSummary = (body.treatment_summary as string) || products.map((p: any) => `${p.name} (${p.quantity})`).join(', ') || 'Treatment session';

  const session = {
    id: nextSessionId(),
    client_id: clientId,
    appointment_id: body.appointment_id ?? null,
    provider: body.provider ?? null,
    treatment_summary: treatmentSummary,
    status: body.status || 'in_progress',
    products,
    total,
    started_at: body.started_at || now,
    updated_at: now,
  };

  sessionStore.set(session.id, session as Record<string, unknown>);
  return NextResponse.json({ session }, { status: 201 });
}
