// ============================================================
// CAMPAIGNS API - List & manage campaigns
// GET  /api/campaigns       - list all campaigns
// GET  /api/campaigns?id=X  - get single campaign
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { requireMarketingAccess } from '@/lib/api-auth';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ('error' in auth) return auth.error;

  try {
    const supabase = createAdminSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const channel = searchParams.get('channel');

    if (id) {
      // Single campaign
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // List campaigns, newest first (optional channel filter for Text Studio)
    let query = supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (channel === 'sms' || channel === 'email' || channel === 'multichannel') {
      query = query.eq('channel', channel);
    }
    const { data, error } = await query;

    if (error) {
      console.error('Campaigns fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
    }

    return NextResponse.json({ campaigns: data || [] });
  } catch (error: any) {
    console.error('Campaigns API error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
