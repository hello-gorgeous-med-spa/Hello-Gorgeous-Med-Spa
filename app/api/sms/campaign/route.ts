// ============================================================
// API: SMS Campaign – bulk send via Twilio (marketing)
// POST body: { message: string, mediaUrl?: string, sendToAll?: boolean, recipients?: string[] }
// Falls back to Square customers when DB has no clients with phones
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendCampaign } from '@/lib/hgos/sms-marketing';
import type { SMSCampaign } from '@/lib/hgos/sms-marketing';
import { getTwilioSmsConfig, isTwilioConfigured } from '@/lib/hgos/twilio-config';
import { fetchAllSquareCustomers, isSquareConfigured } from '@/lib/square-clients';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

function getSupabaseServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key to bypass RLS
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Normalize phone numbers and deduplicate */
function normalizePhones(rawPhones: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const p of rawPhones) {
    const normalized = p.replace(/\D/g, '');
    const key = normalized.length === 10 ? `1${normalized}` : normalized;
    if (key.length >= 10 && !seen.has(key)) {
      seen.add(key);
      result.push(p);
    }
  }
  return result;
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
    let source = 'custom';

    if (sendToAll) {
      const supabase = getSupabaseServiceRole();
      let dbPhones: string[] = [];
      
      // Try database first (with service role key to bypass RLS)
      if (supabase) {
        console.log('[sms/campaign] Fetching clients from DB with service role...');
        const { data: rows, error, count } = await supabase
          .from('clients')
          .select('id, phone, user_id', { count: 'exact' })
          .not('phone', 'is', null)
          .neq('phone', '');

        console.log(`[sms/campaign] DB query result: ${count} clients, error: ${error?.message || 'none'}`);

        if (!error && rows && rows.length > 0) {
          dbPhones = rows.map((r: { phone?: string | null }) => (r.phone || '').trim()).filter(Boolean);
          source = 'database';
          console.log(`[sms/campaign] Found ${dbPhones.length} phones from DB`);
        } else if (error) {
          console.error('[sms/campaign] fetch clients from DB:', error);
        }
      } else {
        console.log('[sms/campaign] No service role key available');
      }

      // If few phones from DB (<10), also try Square to compare
      if (dbPhones.length < 10 && isSquareConfigured()) {
        try {
          console.log('[sms/campaign] Checking Square for more clients...');
          const squareClients = await fetchAllSquareCustomers(5000);
          const squarePhones = squareClients
            .map(c => (c.phone || '').trim())
            .filter(Boolean);
          console.log(`[sms/campaign] Found ${squarePhones.length} phones from Square`);
          if (squarePhones.length > dbPhones.length) {
            dbPhones = squarePhones;
            source = 'square';
          }
        } catch (e) {
          console.error('[sms/campaign] Square fetch error:', e);
        }
      }

      // If still no phones, return error
      if (dbPhones.length === 0) {
        const hint = isSquareConfigured() 
          ? 'No clients found in database or Square.' 
          : 'No clients found. Connect Square or import clients first.';
        return NextResponse.json({ 
          error: hint,
          sent: 0,
          failed: 0,
          total: 0,
          squareConfigured: isSquareConfigured(),
        }, { status: 400 });
      }

      phones = normalizePhones(dbPhones);
    } else {
      phones = normalizePhones(recipientsInput.map((r: string) => (r || '').trim()).filter(Boolean));
    }

    if (phones.length === 0) {
      return NextResponse.json({
        error: sendToAll ? 'No clients with valid phone numbers found.' : 'No valid recipients provided.',
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
      source,
      totalRecipients: phones.length,
      estimatedMinutes: Math.ceil(phones.length / 2),
      estimatedCost: `$${(phones.length * 0.0079).toFixed(2)}`,
      errors: result.errors?.slice(0, 20) || [],
    });
  } catch (e) {
    console.error('[sms/campaign]', e);
    return NextResponse.json({ error: 'Campaign send failed', sent: 0, failed: 0, total: 0 }, { status: 500 });
  }
}
