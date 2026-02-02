// ============================================================
// CLIENT LOYALTY API
// Track Allē, Aspire, Evolus rewards for each client
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// In-memory store (would be database in production)
const loyaltyStore: Map<string, any[]> = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const loyalty = loyaltyStore.get(clientId) || [];
  return NextResponse.json({ loyalty });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const body = await request.json();
  
  const { program_id, member_id, points_balance, tier } = body;
  
  if (!program_id || !member_id) {
    return NextResponse.json(
      { error: 'program_id and member_id are required' },
      { status: 400 }
    );
  }

  const loyalty: any = {
    program_id,
    member_id,
    points_balance: points_balance || null,
    tier: tier || null,
    enrolled_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
  };

  // Get existing loyalty data for client
  const existing = loyaltyStore.get(clientId) || [];
  
  // Update or add
  const existingIndex = existing.findIndex(l => l.program_id === program_id);
  if (existingIndex >= 0) {
    existing[existingIndex] = { ...existing[existingIndex], ...loyalty };
  } else {
    existing.push(loyalty);
  }
  
  loyaltyStore.set(clientId, existing);

  return NextResponse.json({ success: true, loyalty });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const clientId = params.id;
  const { searchParams } = new URL(request.url);
  const programId = searchParams.get('program_id');

  if (!programId) {
    return NextResponse.json(
      { error: 'program_id is required' },
      { status: 400 }
    );
  }

  const existing = loyaltyStore.get(clientId) || [];
  const filtered = existing.filter(l => l.program_id !== programId);
  loyaltyStore.set(clientId, filtered);

  return NextResponse.json({ success: true });
}
