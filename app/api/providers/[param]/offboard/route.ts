// ============================================================
// POST /api/providers/[param]/offboard
// Revoke access, set offboarded_at, revoke financial permissions, log
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function POST(
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

  try {
    const now = new Date().toISOString();

    const { data: provider, error: fetchErr } = await supabase
      .from('providers')
      .select('id, first_name, last_name, name, user_id')
      .eq('id', providerId)
      .single();

    if (fetchErr || !provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    await supabase.from('providers').update({
      status: 'inactive',
      end_date: now.slice(0, 10),
      offboarded_at: now,
      updated_at: now,
    }).eq('id', providerId);

    await supabase.from('financial_permissions').update({
      bank_access: false,
      vendor_ordering: false,
      refund_authority: false,
      contract_authority: false,
      pricing_authority: false,
      updated_at: now,
    }).eq('provider_id', providerId);

    await supabase.from('governance_audit_log').insert({
      action: 'provider_offboarded',
      entity_type: 'provider',
      entity_id: providerId,
      metadata: {
        provider_name: provider.name || [provider.first_name, provider.last_name].filter(Boolean).join(' '),
        offboarded_at: now,
      },
    });

    return NextResponse.json({
      ok: true,
      message: 'Provider offboarded.',
      checklist_url: `/api/providers/${providerId}/offboarding-checklist`,
    });
  } catch (e) {
    console.error('[providers/offboard]', e);
    return NextResponse.json({ error: 'Offboard failed' }, { status: 500 });
  }
}
