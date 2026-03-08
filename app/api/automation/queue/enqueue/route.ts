// ============================================================
// POST /api/automation/queue/enqueue
// Enqueue time-based automation messages (24h reminder, follow-up, review, rebook).
// Call from Vercel Cron (e.g. every hour). Uses starts_at for appointment time.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function replaceVars(text: string, vars: Record<string, string>): string {
  if (!text) return '';
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

  const now = new Date();
  const toIso = (d: Date) => d.toISOString();
  const enqueued: { trigger: string; count: number }[] = [];

  // Templates by trigger_event + channel
  const { data: templates } = await supabase.from('message_templates').select('id, trigger_event, channel, subject, body').eq('active', true);
  const templateMap = new Map<string, { subject: string | null; body: string }>();
  for (const t of templates || []) {
    templateMap.set(`${t.trigger_event}:${t.channel}`, { subject: t.subject || null, body: t.body || '' });
  }

  // Active rules with template lookup
  const { data: rules } = await supabase.from('automation_rules').select('id, trigger_event, delay_minutes, channel, template_id').eq('active', true);
  if (!rules?.length) {
    return NextResponse.json({ enqueued: 0, message: 'No active automation rules' });
  }

  // 24h reminder: starts_at in [23h, 25h]
  const low24 = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const high24 = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const { data: appts24 } = await supabase
    .from('appointments')
    .select('id, client_id, starts_at, services(name)')
    .in('status', ['scheduled', 'confirmed'])
    .gte('starts_at', toIso(low24))
    .lte('starts_at', toIso(high24));

  for (const apt of appts24 || []) {
    const clientId = (apt as any).client_id;
    if (!clientId) continue;
    const { data: client } = await supabase.from('clients').select('first_name, last_name, email, phone').eq('id', clientId).single();
    if (!client) continue;
    const startsAt = new Date((apt as any).starts_at);
    const appointment_time = startsAt.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    const service_name = (apt as any).services?.name || 'Your appointment';
    const vars = { first_name: (client.first_name || '').trim() || 'there', appointment_time, service_name, provider_name: '', review_link: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://g.page/r/CYQOWmT_HcwQEBM/review' };
    for (const rule of rules.filter((r) => r.trigger_event === 'reminder_24h')) {
      const t = templateMap.get(`${rule.trigger_event}:${rule.channel}`);
      if (!t?.body) continue;
      const scheduledFor = new Date(now.getTime() + (rule.delay_minutes || 0) * 60 * 1000);
      await supabase.from('message_queue').insert({
        client_id: clientId,
        appointment_id: apt.id,
        automation_rule_id: rule.id,
        channel: rule.channel,
        scheduled_for: toIso(scheduledFor),
        status: 'pending',
        payload_json: { subject: t.subject ? replaceVars(t.subject, vars) : null, body: replaceVars(t.body, vars), ...vars },
      });
    }
  }
  if (appts24?.length) enqueued.push({ trigger: 'reminder_24h', count: appts24.length });

  // Post-treatment follow-up: starts_at between 23h and 25h ago, status completed
  const lowPost = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  const highPost = new Date(now.getTime() - 23 * 60 * 60 * 1000);
  const { data: apptsPost } = await supabase
    .from('appointments')
    .select('id, client_id, starts_at, services(name)')
    .eq('status', 'completed')
    .gte('starts_at', toIso(lowPost))
    .lte('starts_at', toIso(highPost));

  for (const apt of apptsPost || []) {
    const clientId = (apt as any).client_id;
    if (!clientId) continue;
    const { data: client } = await supabase.from('clients').select('first_name, email').eq('id', clientId).single();
    if (!client?.email) continue;
    const vars = { first_name: (client.first_name || '').trim() || 'there', appointment_time: '', service_name: (apt as any).services?.name || '', provider_name: '', review_link: '' };
    for (const rule of rules.filter((r) => r.trigger_event === 'post_treatment_followup')) {
      const t = templateMap.get(`${rule.trigger_event}:${rule.channel}`);
      if (!t?.body) continue;
      const scheduledFor = new Date(now.getTime() + (rule.delay_minutes || 0) * 60 * 1000);
      await supabase.from('message_queue').insert({
        client_id: clientId,
        appointment_id: apt.id,
        automation_rule_id: rule.id,
        channel: rule.channel,
        scheduled_for: toIso(scheduledFor),
        status: 'pending',
        payload_json: { subject: t.subject ? replaceVars(t.subject, vars) : null, body: replaceVars(t.body, vars), ...vars },
      });
    }
  }
  if (apptsPost?.length) enqueued.push({ trigger: 'post_treatment_followup', count: apptsPost.length });

  // Review request: starts_at 47–49h ago, completed
  const lowReview = new Date(now.getTime() - 49 * 60 * 60 * 1000);
  const highReview = new Date(now.getTime() - 47 * 60 * 60 * 1000);
  const { data: apptsReview } = await supabase
    .from('appointments')
    .select('id, client_id, starts_at')
    .eq('status', 'completed')
    .gte('starts_at', toIso(lowReview))
    .lte('starts_at', toIso(highReview));

  const { data: alreadySent } = await supabase.from('review_requests_sent').select('appointment_id');
  const sentSet = new Set((alreadySent || []).map((r: { appointment_id: string }) => r.appointment_id));
  const reviewLink = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || 'https://g.page/r/CYQOWmT_HcwQEBM/review';
  for (const apt of apptsReview || []) {
    if (sentSet.has(apt.id)) continue;
    const clientId = (apt as any).client_id;
    if (!clientId) continue;
    const { data: client } = await supabase.from('clients').select('first_name, phone').eq('id', clientId).single();
    if (!client?.phone) continue;
    const vars = { first_name: (client.first_name || '').trim() || 'there', appointment_time: '', service_name: '', provider_name: '', review_link };
    for (const rule of rules.filter((r) => r.trigger_event === 'review_request')) {
      const t = templateMap.get(`${rule.trigger_event}:${rule.channel}`);
      if (!t?.body) continue;
      const scheduledFor = new Date(now.getTime() + (rule.delay_minutes || 0) * 60 * 1000);
      await supabase.from('message_queue').insert({
        client_id: clientId,
        appointment_id: apt.id,
        automation_rule_id: rule.id,
        channel: rule.channel,
        scheduled_for: toIso(scheduledFor),
        status: 'pending',
        payload_json: { subject: null, body: replaceVars(t.body, vars), ...vars },
      });
    }
    await supabase.from('review_requests_sent').upsert({ appointment_id: apt.id, client_id: clientId, sms_sent: true }, { onConflict: 'appointment_id' });
  }
  if (apptsReview?.length) enqueued.push({ trigger: 'review_request', count: apptsReview.length });

  return NextResponse.json({ enqueued: enqueued.reduce((s, e) => s + e.count, 0), detail: enqueued });
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return POST(request);
}
