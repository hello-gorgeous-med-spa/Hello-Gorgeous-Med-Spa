// ============================================================
// SMS STATS API
// Get count of clients opted in for SMS marketing
// ============================================================

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Count clients who have opted IN to SMS marketing AND have a phone number
    const { count: smsOptInCount, error: smsError } = await supabase
      .from('clients')
      .select(`
        id,
        users!inner(phone)
      `, { count: 'exact', head: true })
      .eq('accepts_sms_marketing', true)
      .not('users.phone', 'is', null);

    // Count total clients with phone numbers
    const { count: totalWithPhone, error: phoneError } = await supabase
      .from('clients')
      .select(`
        id,
        users!inner(phone)
      `, { count: 'exact', head: true })
      .not('users.phone', 'is', null);

    // Count total clients
    const { count: totalClients, error: totalError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true });

    // Handle errors gracefully
    if (smsError || phoneError || totalError) {
      console.log('SMS stats query error:', smsError?.message || phoneError?.message || totalError?.message);
      // Return defaults if table doesn't exist
      return NextResponse.json({
        smsOptInCount: 0,
        totalWithPhone: 0,
        totalClients: 0,
        message: 'No client data available',
      });
    }

    return NextResponse.json({
      smsOptInCount: smsOptInCount || 0,
      totalWithPhone: totalWithPhone || 0,
      totalClients: totalClients || 0,
      optInRate: totalWithPhone ? ((smsOptInCount || 0) / totalWithPhone * 100).toFixed(1) : '0',
    });

  } catch (error) {
    console.error('SMS stats error:', error);
    return NextResponse.json({
      smsOptInCount: 0,
      totalWithPhone: 0,
      totalClients: 0,
      error: 'Failed to fetch stats',
    });
  }
}
