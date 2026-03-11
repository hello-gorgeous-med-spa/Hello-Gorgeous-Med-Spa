// ============================================================
// API: SMS Stats – count of clients eligible for SMS marketing (Twilio)
// Used by Admin → SMS campaign page for "Send to all" audience size
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', note: 'Database not configured' });
  }

  try {
    // Count clients with a non-empty phone (SMS-reachable).
    // When you add sms_opt_in to clients, filter: .eq('sms_opt_in', true)
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .not('phone', 'is', null)
      .neq('phone', '');

    if (error) {
      console.error('[sms/stats]', error);
      return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', error: error.message });
    }

    const smsOptInCount = typeof count === 'number' ? count : 0;
    const twilioConfigured = !!(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    );

    return NextResponse.json({
      smsOptInCount,
      provider: 'twilio',
      twilioConfigured,
    });
  } catch (e) {
    console.error('[sms/stats]', e);
    return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', error: 'Server error' });
  }
}
