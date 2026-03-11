// ============================================================
// API: SMS Campaign – bulk send via Twilio (marketing)
// POST body: { message: string, mediaUrl?: string, sendToAll?: boolean, recipients?: string[] }
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCampaign } from '@/lib/hgos/sms-marketing';
import type { SMSCampaign } from '@/lib/hgos/sms-marketing';
import { getTwilioSmsConfig, isTwilioConfigured } from '@/lib/hgos/twilio-config';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: NextRequest) {
  if (!isTwilioConfigured()) {
    return NextResponse.json(
      { error: 'Twilio not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const message = body?.message?.trim();
    const mediaUrl = body?.mediaUrl?.trim() || undefined;
    const sendToAll = !!body?.sendToAll;
    const recipientsInput = Array.isArray(body?.recipients) ? body.recipients : [];

    if (!message) {
      return NextResponse.json({ error: 'Missing "message".' }, { status: 400 });
    }

    let phones: string[] = [];

    if (sendToAll) {
      const supabase = getSupabase();
      if (!supabase) {
        return NextResponse.json({ error: 'Database not configured. Cannot send to all.' }, { status: 503 });
      }
      const { data: rows, error } = await supabase
        .from('clients')
        .select('id, phone, user_id')
        .not('phone', 'is', null)
        .neq('phone', '');

      if (error) {
        console.error('[sms/campaign] fetch clients', error);
        return NextResponse.json({ error: 'Failed to load clients' }, { status: 502 });
      }

      const withPhone = (rows || []).map((r: { phone?: string | null }) => (r.phone || '').trim()).filter(Boolean);
      const seen = new Set<string>();
      for (const p of withPhone) {
        const normalized = p.replace(/\D/g, '');
        const key = normalized.length === 10 ? `1${normalized}` : normalized;
        if (key.length >= 10 && !seen.has(key)) {
          seen.add(key);
          phones.push(p);
        }
      }
    } else {
      phones = recipientsInput.map((r: string) => (r || '').trim()).filter(Boolean);
    }

    if (phones.length === 0) {
      return NextResponse.json({
        error: sendToAll ? 'No clients with phone numbers found.' : 'No recipients provided.',
        sent: 0,
        failed: 0,
        total: 0,
      }, { status: 400 });
    }

    const campaign: SMSCampaign = {
      id: `camp-${Date.now()}`,
      name: 'Marketing campaign',
      type: 'promotional',
      message,
      mediaUrl,
      status: 'sending',
    };

    const config = getTwilioSmsConfig();
    const result = await sendCampaign(
      campaign,
      phones.map(phone => ({ phone })),
      config
    );

    return NextResponse.json({
      sent: result.sent,
      failed: result.failed,
      total: result.total,
      errors: result.errors?.slice(0, 20) || [],
    });
  } catch (e) {
    console.error('[sms/campaign]', e);
    return NextResponse.json({ error: 'Campaign send failed', sent: 0, failed: 0, total: 0 }, { status: 500 });
  }
}
