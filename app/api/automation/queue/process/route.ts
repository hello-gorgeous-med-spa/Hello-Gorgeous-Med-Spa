// ============================================================
// POST /api/automation/queue/process
// Process pending message_queue rows (send via Resend/Telnyx).
// Call from Vercel Cron or manually. Respects unsubscribes and consent.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { sendSmsTelnyx } from '@/lib/notifications/telnyx';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function replaceVars(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'gi'), v ?? '');
  return out;
}

function isAuthorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true;
  if (request.headers.get('authorization') === `Bearer ${cronSecret}`) return true;
  if (request.nextUrl?.searchParams.get('secret') === cronSecret) return true;
  return false;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const now = new Date().toISOString();
  const { data: pending, error: fetchErr } = await supabase
    .from('message_queue')
    .select('id, client_id, appointment_id, channel, payload_json, automation_rule_id')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .limit(50);

  if (fetchErr || !pending?.length) {
    return NextResponse.json({ processed: 0, message: fetchErr?.message || 'No pending messages' });
  }

  const results: { id: string; success: boolean; error?: string }[] = [];
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Hello Gorgeous <onboarding@resend.dev>';
  const reviewLink = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://g.page/r/CYQOWmT_HcwQEBM/review';

  for (const row of pending) {
    const payload = (row.payload_json as Record<string, unknown>) || {};
    const clientId = row.client_id;
    const { data: client } = await supabase.from('clients').select('id, first_name, last_name, email, phone, consent_sms, consent_email').eq('id', clientId).single();
    if (!client) {
      await supabase.from('message_queue').update({ status: 'failed', last_error: 'Client not found', updated_at: now }).eq('id', row.id);
      results.push({ id: row.id, success: false, error: 'Client not found' });
      continue;
    }

    const first_name = (client.first_name || '').trim() || 'there';
    const vars: Record<string, string> = {
      first_name,
      appointment_time: (payload.appointment_time as string) || '',
      service_name: (payload.service_name as string) || '',
      provider_name: (payload.provider_name as string) || '',
      review_link,
      ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v ?? '')])),
    };

    if (row.channel === 'sms') {
      const phone = client.phone?.trim();
      if (!phone) {
        await supabase.from('message_queue').update({ status: 'failed', last_error: 'No phone', updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: 'No phone' });
        continue;
      }
      const { data: unsubByPhone } = await supabase.from('unsubscribes').select('id').eq('channel', 'sms').eq('phone', phone).limit(1).maybeSingle();
      const { data: unsubByClient } = await supabase.from('unsubscribes').select('id').eq('channel', 'sms').eq('client_id', clientId).limit(1).maybeSingle();
      if (unsubByPhone || unsubByClient || client.consent_sms === false) {
        await supabase.from('message_queue').update({ status: 'cancelled', last_error: 'Unsubscribed or no consent', updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: 'Opt-out' });
        continue;
      }
      const body = replaceVars((payload.body as string) || 'Hi {{first_name}}, reply STOP to unsubscribe.', vars);
      try {
        const smsResult = await sendSmsTelnyx(phone, body);
        const ok = smsResult.success;
        await supabase.from('message_queue').update({ status: ok ? 'sent' : 'failed', last_error: ok ? null : (smsResult.error || '')?.slice(0, 500), updated_at: now, attempts: (row as any).attempts + 1 }).eq('id', row.id);
        if (ok) {
          await supabase.from('message_logs').insert({ client_id: clientId, appointment_id: row.appointment_id, channel: 'sms', provider: 'telnyx', external_message_id: smsResult.providerMessageId || undefined, status: 'sent', sent_at: now });
        }
        results.push({ id: row.id, success: ok });
      } catch (e: unknown) {
        const err = e instanceof Error ? e.message : String(e);
        await supabase.from('message_queue').update({ status: 'failed', last_error: err?.slice(0, 500), updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: err });
      }
      continue;
    }

    if (row.channel === 'email') {
      const email = client.email?.trim();
      if (!email) {
        await supabase.from('message_queue').update({ status: 'failed', last_error: 'No email', updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: 'No email' });
        continue;
      }
      const { data: unsubByEmail } = await supabase.from('unsubscribes').select('id').eq('channel', 'email').ilike('email', email).limit(1).maybeSingle();
      const { data: unsubByClient } = await supabase.from('unsubscribes').select('id').eq('channel', 'email').eq('client_id', clientId).limit(1).maybeSingle();
      if (unsubByEmail || unsubByClient || client.consent_email === false) {
        await supabase.from('message_queue').update({ status: 'cancelled', last_error: 'Unsubscribed or no consent', updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: 'Opt-out' });
        continue;
      }
      const subject = replaceVars((payload.subject as string) || 'Hello Gorgeous Med Spa', vars);
      const body = replaceVars((payload.body as string) || '', vars);
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        await supabase.from('message_queue').update({ status: 'failed', last_error: 'Resend not configured', updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: 'Resend not configured' });
        continue;
      }
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({ from: fromEmail, to: [email], subject, text: body }),
        });
        const ok = res.ok;
        const data = await res.json().catch(() => ({}));
        await supabase.from('message_queue').update({ status: ok ? 'sent' : 'failed', last_error: ok ? null : (data.message || data.error || res.statusText)?.slice(0, 500), updated_at: now }).eq('id', row.id);
        if (ok) {
          await supabase.from('message_logs').insert({ client_id: clientId, appointment_id: row.appointment_id, channel: 'email', provider: 'resend', external_message_id: data.id, status: 'sent', sent_at: now });
        }
        results.push({ id: row.id, success: ok });
      } catch (e: unknown) {
        const err = e instanceof Error ? e.message : String(e);
        await supabase.from('message_queue').update({ status: 'failed', last_error: err?.slice(0, 500), updated_at: now }).eq('id', row.id);
        results.push({ id: row.id, success: false, error: err });
      }
    }
  }

  return NextResponse.json({
    processed: results.length,
    success: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return POST(request);
}
