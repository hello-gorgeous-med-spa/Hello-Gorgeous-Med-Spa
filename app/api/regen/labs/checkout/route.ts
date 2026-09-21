import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { getPanel } from '@/lib/fullscript/lab-panels';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { panelId, panelName, price, patient } = body;

    const panel = getPanel(panelId);
    if (!panel) {
      return NextResponse.json({ error: 'Invalid lab panel' }, { status: 400 });
    }

    if (!patient?.email || !patient?.firstName || !patient?.lastName || !patient?.dob) {
      return NextResponse.json({ error: 'Missing required patient information' }, { status: 400 });
    }

    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('regen_lab_requirements').insert({
        patient_email: patient.email,
        patient_name: `${patient.firstName} ${patient.lastName}`,
        lab_type: panelName || panel.name,
        required_for: 'intake',
        status: 'pending_invoice',
        panel_id: panelId,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      submitted: true,
      processor: 'charm-bluefin',
      amount: price || panel.price,
      redirect: '/labs/success',
    });
  } catch (error) {
    console.error('Lab request error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save lab request' },
      { status: 500 },
    );
  }
}
