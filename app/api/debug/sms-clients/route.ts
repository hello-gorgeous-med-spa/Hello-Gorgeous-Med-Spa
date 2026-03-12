// ============================================================
// DEBUG: SMS Clients Diagnostic
// This endpoint helps troubleshoot why clients aren't being fetched
// DELETE THIS FILE IN PRODUCTION
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllSquareCustomers, isSquareConfigured } from '@/lib/square-clients';
import { getAccessToken, getActiveConnection } from '@/lib/square/oauth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
  };

  // 1. Check environment variables
  diagnostics.env = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSquareAccessToken: !!process.env.SQUARE_ACCESS_TOKEN,
    hasSquareToken: !!process.env.SQUARE_TOKEN,
    hasSquareOAuthClientId: !!process.env.SQUARE_OAUTH_CLIENT_ID,
    squareEnvironment: process.env.SQUARE_ENVIRONMENT || 'not set',
    isSquareConfigured: isSquareConfigured(),
  };

  // 2. Test Supabase with service role key
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (supabaseUrl && serviceRoleKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Count total clients
      const { count: totalCount, error: countError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      diagnostics.supabase = {
        connected: true,
        totalClientsCount: totalCount,
        countError: countError?.message || null,
      };

      // Count clients with phones
      const { count: phoneCount, error: phoneError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .not('phone', 'is', null)
        .neq('phone', '');

      diagnostics.supabase.clientsWithPhones = phoneCount;
      diagnostics.supabase.phoneCountError = phoneError?.message || null;

      // Get sample clients with phones
      const { data: sampleClients, error: sampleError } = await supabase
        .from('clients')
        .select('id, first_name, last_name, phone')
        .not('phone', 'is', null)
        .neq('phone', '')
        .limit(5);

      diagnostics.supabase.sampleClients = sampleClients?.map(c => ({
        name: `${c.first_name} ${c.last_name}`,
        hasPhone: !!c.phone,
      })) || [];
      diagnostics.supabase.sampleError = sampleError?.message || null;

    } catch (e) {
      diagnostics.supabase = {
        connected: false,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  } else {
    diagnostics.supabase = {
      connected: false,
      reason: 'Missing URL or service role key',
    };
  }

  // 3. Check Square OAuth connection
  try {
    const connection = await getActiveConnection();
    diagnostics.squareOAuth = {
      hasConnection: !!connection,
      merchantId: connection?.merchant_id || null,
      businessName: connection?.business_name || null,
      status: connection?.status || null,
    };

    // Try to get access token
    const accessToken = await getAccessToken();
    diagnostics.squareOAuth.hasAccessToken = !!accessToken;
    diagnostics.squareOAuth.tokenLength = accessToken?.length || 0;
  } catch (e) {
    diagnostics.squareOAuth = {
      hasConnection: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  // 4. Try fetching from Square directly
  if (isSquareConfigured()) {
    try {
      console.log('[debug/sms-clients] Fetching from Square...');
      const squareClients = await fetchAllSquareCustomers(100);
      const withPhone = squareClients.filter(c => c.phone && c.phone.trim());
      
      diagnostics.squareDirect = {
        fetched: true,
        totalCount: squareClients.length,
        withPhoneCount: withPhone.length,
        sampleClients: squareClients.slice(0, 3).map(c => ({
          name: `${c.first_name} ${c.last_name}`,
          hasPhone: !!c.phone,
          source: c.source,
        })),
      };
    } catch (e) {
      diagnostics.squareDirect = {
        fetched: false,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  } else {
    diagnostics.squareDirect = {
      fetched: false,
      reason: 'Square not configured',
    };
  }

  return NextResponse.json(diagnostics, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
