// ============================================================
// API: CONSENT WIZARD - Sign packet
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
    const { packet_id, signature_image } = body;

    if (!packet_id || !signature_image) {
      return NextResponse.json(
        { error: 'packet_id and signature_image are required' },
        { status: 400 }
      );
    }

    // Verify token matches packet and check expiration
    const { data: packet, error: fetchError } = await supabase
      .from('consent_packets')
      .select('id, status, wizard_token, wizard_expires_at')
      .eq('id', packet_id)
      .eq('wizard_token', token)
      .single();

    if (fetchError || !packet) {
      return NextResponse.json({ error: 'Packet not found' }, { status: 404 });
    }

    // Check expiration
    if (packet.wizard_expires_at && new Date(packet.wizard_expires_at) < new Date()) {
      return NextResponse.json({ error: 'This consent link has expired' }, { status: 410 });
    }

    // Check if already signed
    if (packet.status === 'signed') {
      return NextResponse.json({ error: 'This consent has already been signed' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Update packet with signature
    const { error: updateError } = await supabase
      .from('consent_packets')
      .update({
        status: 'signed',
        signed_at: new Date().toISOString(),
        signature_image,
        signature_ip: ip,
        signature_user_agent: userAgent,
      })
      .eq('id', packet_id);

    if (updateError) {
      console.error('Sign update error:', updateError);
      return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 });
    }

    // Log event
    await supabase
      .from('consent_events')
      .insert({
        packet_id,
        event: 'signed',
        actor_type: 'client',
        ip_address: ip,
        user_agent: userAgent,
        meta: {
          signature_captured: true,
          source: 'wizard',
        },
      });

    return NextResponse.json({
      success: true,
      message: 'Consent signed successfully',
    });

  } catch (error) {
    console.error('Sign API error:', error);
    return NextResponse.json({ error: 'Failed to sign consent' }, { status: 500 });
  }
}
