// ============================================================
// GET /api/protocols — list protocols (Protocol Center)
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const { data, error } = await supabase
      .from('protocols')
      .select('protocol_id, title, version, status, review_due_date, approved_by_provider_id, approval_date')
      .order('title')
      .order('version', { ascending: false });

    if (error) {
      console.warn('[protocols GET]', error.message);
      return NextResponse.json({ protocols: [] });
    }

    return NextResponse.json({ protocols: data || [] });
  } catch (e) {
    console.warn('[protocols GET]', e);
    return NextResponse.json({ protocols: [] });
  }
}
