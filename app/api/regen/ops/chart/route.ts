import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

    const email = request.nextUrl.searchParams.get('email')?.toLowerCase();
    const intakeId = request.nextUrl.searchParams.get('intakeId');
    if (!email && !intakeId) {
      return NextResponse.json({ error: 'email or intakeId required' }, { status: 400 });
    }

    let intakeQuery = supabase.from('regen_intakes').select('*').order('created_at', { ascending: false });
    if (intakeId) intakeQuery = intakeQuery.eq('id', intakeId);
    else intakeQuery = intakeQuery.ilike('email', email!);

    const { data: intakes } = await intakeQuery;
    const primary = intakes?.[0];
    const lookupEmail = (primary?.email || email || '').toLowerCase();

    const { data: patients } = lookupEmail
      ? await supabase.from('regen_patients').select('*').ilike('email', lookupEmail).limit(1)
      : { data: [] };

    const { data: consents } = lookupEmail
      ? await supabase.from('regen_signed_consents').select('*').eq('patient_email', lookupEmail).order('signed_at', { ascending: false })
      : { data: [] };

    const { data: labs } = lookupEmail
      ? await supabase.from('regen_lab_requirements').select('*').eq('patient_email', lookupEmail).order('created_at', { ascending: false })
      : { data: [] };

    const intakeIds = (intakes || []).map((i) => i.id);
    const { data: orders } = intakeIds.length
      ? await supabase.from('regen_orders').select('*').in('intake_id', intakeIds).order('created_at', { ascending: false })
      : { data: [] };

    const { data: attestations } = intakeIds.length
      ? await supabase.from('regen_provider_attestations').select('*').in('intake_id', intakeIds).order('attested_at', { ascending: false })
      : { data: [] };

    const { data: audit } = intakeIds.length
      ? await supabase.from('regen_audit_log').select('*').in('resource_id', intakeIds).order('created_at', { ascending: false }).limit(50)
      : { data: [] };

    let messages: unknown[] = [];
    if (lookupEmail) {
      const byEmail = await supabase.from('regen_messages').select('*').eq('patient_email', lookupEmail).order('created_at', { ascending: false }).limit(50);
      if (!byEmail.error) {
        messages = byEmail.data || [];
      } else if (patients?.[0]?.id) {
        const byPatient = await supabase.from('regen_messages').select('*').eq('patient_id', patients[0].id).order('created_at', { ascending: false }).limit(50);
        messages = byPatient.data || [];
      }
    }

    return NextResponse.json({
      patient: patients?.[0] || null,
      intakes: intakes || [],
      consents: consents || [],
      labs: labs || [],
      orders: orders || [],
      attestations: attestations || [],
      audit: audit || [],
      messages,
    });
  } catch (error) {
    console.error('Chart API error:', error);
    return NextResponse.json({ error: 'Failed to load chart' }, { status: 500 });
  }
}
