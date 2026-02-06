// ============================================================
// API: CONSENT WIZARD - Get wizard data by token
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

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const { token } = params;

    // Get packets by wizard token
    const { data: packets, error } = await supabase
      .from('consent_packets')
      .select(`
        id,
        template_name,
        template_content,
        status,
        viewed_at,
        signed_at,
        wizard_expires_at,
        client:clients(
          id,
          users(first_name, last_name)
        ),
        appointment:appointments(
          id,
          starts_at,
          service:services(name)
        )
      `)
      .eq('wizard_token', token)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Wizard fetch error:', error);
      return NextResponse.json({ error: 'Failed to load wizard' }, { status: 500 });
    }

    if (!packets || packets.length === 0) {
      return NextResponse.json({ 
        valid: false,
        error: 'Invalid or expired consent link'
      }, { status: 404 });
    }

    // Check expiration
    const expiresAt = packets[0].wizard_expires_at;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return NextResponse.json({
        valid: false,
        expired: true,
        error: 'This consent link has expired',
      });
    }

    // Format response
    const client = packets[0].client;
    const appointment = packets[0].appointment;

    return NextResponse.json({
      valid: true,
      expired: false,
      client_name: client?.users 
        ? `${client.users.first_name} ${client.users.last_name}`
        : 'Patient',
      appointment_date: appointment?.starts_at
        ? new Date(appointment.starts_at).toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        : null,
      service_name: appointment?.service?.name || 'Your appointment',
      packets: packets.map(p => ({
        id: p.id,
        template_name: p.template_name,
        template_content: p.template_content,
        status: p.status,
        viewed_at: p.viewed_at,
        signed_at: p.signed_at,
      })),
    });

  } catch (error) {
    console.error('Wizard API error:', error);
    return NextResponse.json({ error: 'Failed to load wizard' }, { status: 500 });
  }
}
