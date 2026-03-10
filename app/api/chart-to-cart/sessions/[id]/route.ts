// ============================================================
// API: CHART-TO-CART SESSION [id] — GET one, PATCH update
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { sessionStore } from '../../store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = sessionStore.get(id);
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ session });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const existing = sessionStore.get(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updates: Record<string, unknown> = { ...existing };
  if (body.status !== undefined) updates.status = body.status;
  if (body.products !== undefined) {
    updates.products = body.products;
    const products = (body.products as { quantity?: number; unit_price?: number }[]) || [];
    updates.total = products.reduce((s, p) => s + (Number(p.quantity) || 0) * (Number(p.unit_price) || 0), 0);
  }
  if (body.treatment_summary !== undefined) updates.treatment_summary = body.treatment_summary;
  if (body.provider !== undefined) updates.provider = body.provider;
  updates.updated_at = new Date().toISOString();

  sessionStore.set(id, updates as Record<string, unknown>);
  return NextResponse.json({ session: updates });
}
