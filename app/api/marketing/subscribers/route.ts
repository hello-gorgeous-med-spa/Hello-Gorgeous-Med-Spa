// ============================================================
// MARKETING SUBSCRIBERS API
// Fetch subscribers and stats for admin dashboard
// ============================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

export async function GET() {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({
      subscribers: [],
      stats: {
        total: 0,
        thisMonth: 0,
        emailOptIn: 0,
        smsOptIn: 0,
        loyaltyEnrolled: 0,
      },
    });
  }

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Get clients who signed up via marketing (referral_source = 'marketing_signup')
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        id,
        user_id,
        created_at,
        referral_source,
        user_profiles(first_name, last_name, email, phone)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Fetch subscribers error:', error);
    }

    // Get marketing preferences
    const { data: preferences } = await supabase
      .from('marketing_preferences')
      .select('user_id, email_opt_in, sms_opt_in');

    const prefMap = new Map((preferences || []).map((p: any) => [p.user_id, p]));

    // Get loyalty accounts
    const { data: loyaltyAccounts } = await supabase
      .from('loyalty_accounts')
      .select('client_id');

    const loyaltySet = new Set((loyaltyAccounts || []).map((l: any) => l.client_id));

    // Format subscribers
    const subscribers = (clients || []).map((c: any) => ({
      id: c.id,
      first_name: c.user_profiles?.first_name || '',
      last_name: c.user_profiles?.last_name || '',
      email: c.user_profiles?.email || '',
      phone: c.user_profiles?.phone || '',
      email_opt_in: prefMap.get(c.user_id)?.email_opt_in ?? true,
      sms_opt_in: prefMap.get(c.user_id)?.sms_opt_in ?? false,
      loyalty: loyaltySet.has(c.id),
      created_at: c.created_at,
    }));

    // Calculate stats
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { count: thisMonthClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart);

    const emailOptIn = (preferences || []).filter((p: any) => p.email_opt_in).length;
    const smsOptIn = (preferences || []).filter((p: any) => p.sms_opt_in).length;
    const loyaltyEnrolled = loyaltyAccounts?.length || 0;

    return NextResponse.json({
      subscribers,
      stats: {
        total: totalClients || 0,
        thisMonth: thisMonthClients || 0,
        emailOptIn,
        smsOptIn,
        loyaltyEnrolled,
      },
    });

  } catch (error) {
    console.error('Subscribers API error:', error);
    return NextResponse.json({
      subscribers: [],
      stats: {
        total: 0,
        thisMonth: 0,
        emailOptIn: 0,
        smsOptIn: 0,
        loyaltyEnrolled: 0,
      },
    });
  }
}
