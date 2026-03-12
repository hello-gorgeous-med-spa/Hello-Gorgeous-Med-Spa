// ============================================================
// DEBUG: Direct DB Check
// DELETE THIS FILE IN PRODUCTION
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    hasUrl: !!url,
    hasServiceRoleKey: !!serviceRoleKey,
    hasAnonKey: !!anonKey,
  };

  // Test with service role key
  if (url && serviceRoleKey) {
    try {
      const supabase = createClient(url, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Total count
      const { count: totalCount, error: totalError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      results.serviceRole = {
        totalClients: totalCount,
        totalError: totalError?.message || null,
      };

      // Count with phone not null
      const { count: phoneNotNull, error: phoneNotNullError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null);

      results.serviceRole.phoneNotNull = phoneNotNull;
      results.serviceRole.phoneNotNullError = phoneNotNullError?.message || null;

      // Count with phone not empty
      const { count: phoneNotEmpty, error: phoneNotEmptyError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null)
        .neq('phone', '');

      results.serviceRole.phoneNotEmpty = phoneNotEmpty;
      results.serviceRole.phoneNotEmptyError = phoneNotEmptyError?.message || null;

      // Get sample with phones
      const { data: sampleWithPhone, error: sampleError } = await supabase
        .from('clients')
        .select('id, first_name, last_name, phone')
        .not('phone', 'is', null)
        .neq('phone', '')
        .limit(5);

      results.serviceRole.sampleWithPhone = sampleWithPhone?.map(c => ({
        name: `${c.first_name} ${c.last_name}`,
        phone: c.phone,
      })) || [];
      results.serviceRole.sampleError = sampleError?.message || null;

      // Get sample without phones (to see what's missing)
      const { data: sampleNoPhone, error: noPhoneError } = await supabase
        .from('clients')
        .select('id, first_name, last_name, phone, email')
        .or('phone.is.null,phone.eq.')
        .limit(5);

      results.serviceRole.sampleWithoutPhone = sampleNoPhone?.map(c => ({
        name: `${c.first_name} ${c.last_name}`,
        phone: c.phone,
        email: c.email?.slice(0, 10) + '...',
      })) || [];
      results.serviceRole.noPhoneError = noPhoneError?.message || null;

    } catch (e) {
      results.serviceRole = {
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  // Test with anon key for comparison
  if (url && anonKey) {
    try {
      const supabase = createClient(url, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { count: totalCount, error: totalError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      results.anonKey = {
        totalClients: totalCount,
        totalError: totalError?.message || null,
      };

      const { count: phoneNotEmpty, error: phoneError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null)
        .neq('phone', '');

      results.anonKey.phoneNotEmpty = phoneNotEmpty;
      results.anonKey.phoneError = phoneError?.message || null;

    } catch (e) {
      results.anonKey = {
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }

  return NextResponse.json(results, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
