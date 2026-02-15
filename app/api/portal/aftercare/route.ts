import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getClientFromSession(request: NextRequest) {
  const sessionToken = request.cookies.get('portal_session')?.value;
  if (!sessionToken) return null;

  const { data: session } = await supabase
    .from('client_sessions')
    .select('client_id')
    .eq('session_token', sessionToken)
    .is('revoked_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  return session?.client_id || null;
}

// GET - List aftercare instructions
export async function GET(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client's aftercare assignments with full instruction details
    const { data: clientAftercares } = await supabase
      .from('client_aftercare')
      .select(`
        *,
        aftercare:aftercare_instructions(*)
      `)
      .eq('client_id', clientId)
      .order('sent_at', { ascending: false });

    return NextResponse.json({
      aftercares: (clientAftercares || []).map(ca => ({
        id: ca.id,
        sentAt: ca.sent_at,
        acknowledgedAt: ca.acknowledged_at,
        customNotes: ca.custom_notes,
        providerNotes: ca.provider_notes,
        instructions: ca.aftercare ? {
          treatmentType: ca.aftercare.treatment_type,
          title: ca.aftercare.title,
          summary: ca.aftercare.summary,
          instructions: ca.aftercare.instructions,
          warnings: ca.aftercare.warnings,
          immediateCare: ca.aftercare.immediate_care,
          first24Hours: ca.aftercare.first_24_hours,
          firstWeek: ca.aftercare.first_week,
          emergencySigns: ca.aftercare.emergency_signs
        } : null
      }))
    });
  } catch (error) {
    console.error('Aftercare error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Acknowledge aftercare
export async function POST(request: NextRequest) {
  try {
    const clientId = await getClientFromSession(request);
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { aftercareId } = await request.json();
    if (!aftercareId) {
      return NextResponse.json({ error: 'Aftercare ID required' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    await supabase
      .from('client_aftercare')
      .update({ 
        acknowledged_at: new Date().toISOString(),
        acknowledged_ip: ip 
      })
      .eq('id', aftercareId)
      .eq('client_id', clientId);

    await supabase.from('portal_access_log').insert({
      client_id: clientId,
      action: 'acknowledge_aftercare',
      resource_type: 'aftercare',
      resource_id: aftercareId,
      ip_address: ip
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Aftercare acknowledge error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
