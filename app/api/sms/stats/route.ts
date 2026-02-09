// ============================================================
// SMS STATS API
// Get count of clients opted in for SMS marketing (live from DB)
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient, createServerSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export async function GET() {
  try {
    // Use admin client so RLS doesn't block the count (same as campaign send)
    const supabase = isAdminConfigured() ? createAdminSupabaseClient() : createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        smsOptInCount: 0,
        totalWithPhone: 0,
        totalClients: 0,
        message: 'Database not configured',
      });
    }

    // Count clients who have opted IN to SMS and have a phone (join users for phone)
    const { data: smsClients, error: smsError } = await supabase
      .from('clients')
      .select('id, user_id, users(phone)')
      .eq('accepts_sms_marketing', true);

    const smsOptInCount = (smsClients || []).filter((c: any) => c.users?.phone && String(c.users.phone).replace(/\D/g, '').length >= 10).length;

    // Total clients with phone (any opt-in)
    const { data: allClients } = await supabase
      .from('clients')
      .select('id, user_id, users(phone)');
    const totalWithPhone = (allClients || []).filter((c: any) => c.users?.phone && String(c.users.phone).replace(/\D/g, '').length >= 10).length;

    // Total clients
    const { count: totalClients, error: totalError } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true });

    if (smsError || totalError) {
      console.log('SMS stats query error:', smsError?.message || totalError?.message);
      return NextResponse.json({
        smsOptInCount: 0,
        totalWithPhone: 0,
        totalClients: 0,
        message: 'No client data available',
      });
    }

    return NextResponse.json({
      smsOptInCount,
      totalWithPhone,
      totalClients: totalClients || 0,
      optInRate: totalWithPhone ? ((smsOptInCount / totalWithPhone) * 100).toFixed(1) : '0',
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
