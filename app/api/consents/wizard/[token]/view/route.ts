// ============================================================
// API: CONSENT WIZARD - Mark packet as viewed
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) return null;
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { token } = params;
    const body = await request.json();
    const { packet_id } = body;

    if (!packet_id) {
      return NextResponse.json({ error: 'packet_id is required' }, { status: 400 });
    }

    // Verify token matches packet
    const { data: packet, error: fetchError } = await supabase
      .from('consent_packets')
      .select('id, status, viewed_at, wizard_token')
      .eq('id', packet_id)
      .eq('wizard_token', token)
      .single();

    if (fetchError || !packet) {
      return NextResponse.json({ error: 'Packet not found' }, { status: 404 });
    }

    // Only mark as viewed if not already viewed or signed
    if (!packet.viewed_at && packet.status !== 'signed') {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      // Update packet
      await supabase
        .from('consent_packets')
        .update({
          status: 'viewed',
          viewed_at: new Date().toISOString(),
        })
        .eq('id', packet_id);

      // Log event
      await supabase
        .from('consent_events')
        .insert({
          packet_id,
          event: 'viewed',
          actor_type: 'client',
          ip_address: ip,
          user_agent: userAgent,
        });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('View API error:', error);
    return NextResponse.json({ error: 'Failed to mark as viewed' }, { status: 500 });
  }
}
