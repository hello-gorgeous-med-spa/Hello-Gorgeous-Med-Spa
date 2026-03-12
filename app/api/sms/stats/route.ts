// ============================================================
// API: SMS Stats – count of clients eligible for SMS marketing (Twilio)
// Used by Admin → SMS campaign page for "Send to all" audience size
// Falls back to Square customers when DB has no clients with phones
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllSquareCustomers, isSquareConfigured } from '@/lib/square-clients';

export const dynamic = 'force-dynamic';

function getSupabaseServiceRole() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Prefer service role key to bypass RLS
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function GET() {
  const twilioConfigured = !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );

  const supabase = getSupabaseServiceRole();
  
  // If no database with service role key, try Square directly
  if (!supabase) {
    console.log('[sms/stats] No service role key, trying Square...');
    if (isSquareConfigured()) {
      try {
        const squareClients = await fetchAllSquareCustomers(5000);
        const withPhone = squareClients.filter(c => c.phone && c.phone.trim());
        return NextResponse.json({
          smsOptInCount: withPhone.length,
          provider: 'twilio',
          twilioConfigured,
          source: 'square',
        });
      } catch (e) {
        console.error('[sms/stats] Square fetch error:', e);
      }
    }
    return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', twilioConfigured, note: 'Service role key not configured' });
  }

  try {
    // Phone numbers can be in either the 'clients' table OR the 'users' table
    // The /api/clients endpoint joins these: phone: user.phone || client.phone
    // We need to count BOTH sources
    
    // 1. Count clients with phone directly in clients table
    const { count: clientsWithPhone, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .not('phone', 'is', null)
      .neq('phone', '');

    // 2. Count users with phone (these are linked to clients via user_id)
    const { count: usersWithPhone, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .not('phone', 'is', null)
      .neq('phone', '');

    if (clientsError && usersError) {
      console.error('[sms/stats] DB errors:', { clientsError, usersError });
      // Try Square as fallback
      if (isSquareConfigured()) {
        const squareClients = await fetchAllSquareCustomers(5000);
        const withPhone = squareClients.filter(c => c.phone && c.phone.trim());
        return NextResponse.json({
          smsOptInCount: withPhone.length,
          provider: 'twilio',
          twilioConfigured,
          source: 'square',
          dbError: clientsError?.message || usersError?.message,
        });
      }
      return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', twilioConfigured, error: 'Database query failed' });
    }

    // Use the larger count (users table typically has the phone data)
    const clientCount = typeof clientsWithPhone === 'number' ? clientsWithPhone : 0;
    const userCount = typeof usersWithPhone === 'number' ? usersWithPhone : 0;
    let smsOptInCount = Math.max(clientCount, userCount);
    let source = userCount > clientCount ? 'users_table' : 'clients_table';
    
    console.log('[sms/stats] clients.phone count:', clientCount);
    console.log('[sms/stats] users.phone count:', userCount);
    console.log('[sms/stats] Using:', source, 'with count:', smsOptInCount);

    // If still low, check Square
    if (smsOptInCount < 10 && isSquareConfigured()) {
      try {
        const squareClients = await fetchAllSquareCustomers(5000);
        const withPhone = squareClients.filter(c => c.phone && c.phone.trim());
        console.log('[sms/stats] Square count:', withPhone.length);
        if (withPhone.length > smsOptInCount) {
          smsOptInCount = withPhone.length;
          source = 'square';
        }
      } catch (e) {
        console.error('[sms/stats] Square fallback error:', e);
      }
    }

    return NextResponse.json({
      smsOptInCount,
      provider: 'twilio',
      twilioConfigured,
      source,
    });
  } catch (e) {
    console.error('[sms/stats]', e);
    return NextResponse.json({ smsOptInCount: 0, provider: 'twilio', twilioConfigured, error: 'Server error' });
  }
}
