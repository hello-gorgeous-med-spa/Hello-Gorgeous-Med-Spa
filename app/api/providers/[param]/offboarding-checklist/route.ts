// ============================================================
// GET /api/providers/[param]/offboarding-checklist
// Returns checklist data for offboarded provider (for print/PDF)
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ param: string }> }
) {
  const { param: providerId } = await params;
  if (!providerId) {
    return NextResponse.json({ error: 'Provider ID required' }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const { data: provider, error } = await supabase
    .from('providers')
    .select('id, first_name, last_name, name, offboarded_at, end_date, status')
    .eq('id', providerId)
    .single();

  if (error || !provider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }

  const name = provider.name || [provider.first_name, provider.last_name].filter(Boolean).join(' ') || providerId;

  const checklist = {
    provider_id: providerId,
    provider_name: name,
    offboarded_at: provider.offboarded_at,
    end_date: provider.end_date,
    status: provider.status,
    steps: [
      { done: true, label: 'Provider record set to inactive and end_date/offboarded_at recorded' },
      { done: true, label: 'Financial permissions revoked (bank, vendor, refund, contract, pricing)' },
      { done: true, label: 'Audit log entry created' },
      { done: false, label: 'Revoke app/login access (user_profiles or auth) — perform manually if needed' },
      { done: false, label: 'Remove from scheduling/calendar — perform manually if needed' },
      { done: false, label: 'Final compensation recorded — perform manually if needed' },
      { done: false, label: 'Non-solicit date set if applicable (non_solicit_until) — perform manually if needed' },
    ],
  };

  return NextResponse.json(checklist);
}
