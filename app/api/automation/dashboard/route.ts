// ============================================================
// GET /api/automation/dashboard — stats for automation dashboard
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
    const [
      rulesRes,
      queuePendingRes,
      queueFailedRes,
      logsRecentRes,
      templatesRes,
    ] = await Promise.all([
      supabase.from('automation_rules').select('id, name, trigger_event, channel, active').eq('active', true),
      supabase.from('message_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('message_queue').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
      supabase.from('message_logs').select('id, channel, status, sent_at').order('sent_at', { ascending: false }).limit(100),
      supabase.from('message_templates').select('id, name, channel, trigger_event, active'),
    ]);

    const rules = rulesRes.data || [];
    const queuePending = queuePendingRes.count ?? 0;
    const queueFailed = queueFailedRes.count ?? 0;
    const logsRecent = logsRecentRes.data || [];
    const templates = templatesRes.data || [];

    const sentByChannel = { email: 0, sms: 0 };
    const last7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    for (const log of logsRecent) {
      if (log.sent_at >= last7d && log.channel in sentByChannel) (sentByChannel as Record<string, number>)[log.channel]++;
    }

    return NextResponse.json({
      activeRules: rules.length,
      rules,
      queuePending,
      queueFailed,
      templates,
      recentLogs: logsRecent.slice(0, 50),
      sentLast7d: sentByChannel,
    });
  } catch (e) {
    console.warn('[automation/dashboard]', e);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
