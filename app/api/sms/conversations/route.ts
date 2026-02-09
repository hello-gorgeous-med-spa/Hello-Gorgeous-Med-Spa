// ============================================================
// SMS CONVERSATIONS LIST API
// Live list of all 2-way SMS conversations with client info
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ conversations: [] });
  }

  try {
    const { data: convRows, error: convError } = await supabase
      .from('sms_conversations')
      .select('id, client_id, phone_number, last_message_at, unread_count')
      .order('last_message_at', { ascending: false });

    if (convError || !convRows?.length) {
      return NextResponse.json({ conversations: [] });
    }

    const clientIds = [...new Set(convRows.map((c: any) => c.client_id).filter(Boolean))];
    const { data: clients } = await supabase
      .from('clients')
      .select('id, user_id, user_profiles:user_id(first_name, last_name, phone, email)')
      .in('id', clientIds);

    const clientMap = new Map(
      (clients || []).map((c: any) => {
        const up = Array.isArray(c.user_profiles) ? c.user_profiles[0] : c.user_profiles;
        return [
          c.id,
          {
            name: [up?.first_name, up?.last_name].filter(Boolean).join(' ') || 'Unknown',
            initials: [up?.first_name, up?.last_name]
              .filter(Boolean)
              .map((n: string) => n[0])
              .join('')
              .toUpperCase() || '?',
            phone: up?.phone || '',
            email: up?.email || '',
          },
        ];
      })
    );

    const convIds = convRows.map((c: any) => c.id);
    const { data: lastMessages } = await supabase
      .from('sms_messages')
      .select('conversation_id, content, sent_at')
      .in('conversation_id', convIds)
      .order('sent_at', { ascending: false });

    const lastByConv = new Map<string, { content: string; sent_at: string }>();
    (lastMessages || []).forEach((m: any) => {
      if (!lastByConv.has(m.conversation_id)) {
        lastByConv.set(m.conversation_id, { content: m.content || '', sent_at: m.sent_at || '' });
      }
    });

    const conversations = convRows.map((c: any) => {
      const client = clientMap.get(c.client_id) || { name: 'Unknown', initials: '?', phone: c.phone_number || '', email: '' };
      const last = lastByConv.get(c.id);
      return {
        id: c.id,
        client_id: c.client_id,
        client_name: client.name,
        client_initials: client.initials,
        client_phone: client.phone || c.phone_number || '',
        client_email: client.email || undefined,
        last_message: last?.content || '',
        last_message_time: last?.sent_at || c.last_message_at || c.updated_at || new Date().toISOString(),
        unread_count: c.unread_count || 0,
      };
    });

    return NextResponse.json({ conversations });
  } catch (e) {
    console.error('SMS conversations list error:', e);
    return NextResponse.json({ conversations: [] });
  }
}
