import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabase } from '@/lib/supabase-server';
import { requireOpsAuth } from '@/lib/regen/ops-session';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  const email = request.nextUrl.searchParams.get('email')?.toLowerCase();
  if (!email) return NextResponse.json({ messages: [] });

  const { data, error } = await supabase
    .from('regen_messages')
    .select('*')
    .eq('patient_email', email)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    const { data: patient } = await supabase.from('regen_patients').select('id').eq('email', email).maybeSingle();
    if (!patient?.id) return NextResponse.json({ messages: [] });
    const fallback = await supabase
      .from('regen_messages')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(50);
    return NextResponse.json({ messages: fallback.data || [] });
  }

  return NextResponse.json({ messages: data || [] });
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireOpsAuth(request);
    if (auth.error) return auth.error;
    const staff = auth.staff;

    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

    const body = await request.json();
    const { email, name, subject, content } = body;
    if (!email || !content) {
      return NextResponse.json({ error: 'email and content required' }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) return NextResponse.json({ error: 'Email not configured' }, { status: 503 });

    const { error: sendError } = await resend.emails.send({
      from: 'REGEN RX <provider@hellogorgeousmedspa.com>',
      to: email,
      replyTo: 'provider@hellogorgeousmedspa.com',
      subject: subject || `Message from REGEN RX — ${staff.name}`,
      html: `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <p style="color:#E91E8C;font-weight:800">REGEN RX</p>
        <p>Hi ${name || 'there'},</p>
        <p style="white-space:pre-wrap;line-height:1.6">${String(content).replace(/</g, '&lt;')}</p>
        <p style="color:#6B7280;font-size:14px">— ${staff.name}<br>Questions: provider@hellogorgeousmedspa.com · (630) 636-6193</p>
      </div>`,
    });

    if (sendError) {
      return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    const { data: patient } = await supabase
      .from('regen_patients')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    const row = {
      patient_id: patient?.id || null,
      patient_email: email.toLowerCase(),
      direction: 'outbound',
      subject: subject || 'Staff message',
      content,
      sender_name: staff.name,
      sender: staff.name,
      message: content,
    };

    const { error: insertError } = await supabase.from('regen_messages').insert(row);
    if (insertError) {
      console.error('regen_messages insert:', insertError);
    }

    await supabase.from('regen_audit_log').insert({
      action: 'staff_message_sent',
      resource_type: 'message',
      actor_type: 'staff',
      actor_email: staff.email,
      details: { to: email, subject, staffId: staff.id, staffName: staff.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ops message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
