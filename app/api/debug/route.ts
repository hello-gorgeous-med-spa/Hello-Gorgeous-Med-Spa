// ============================================================
// DEBUG API - Check environment and database connection
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: {},
    database: {},
  };

  // Check environment variables (don't expose full keys)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  results.environment = {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey ? `${anonKey.substring(0, 20)}...` : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: serviceKey ? `${serviceKey.substring(0, 20)}...` : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  };

  // Try to connect to database
  if (supabaseUrl && serviceKey) {
    try {
      const supabase = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });

      // Test query
      const { data, error, count } = await supabase
        .from('services')
        .select('id, name', { count: 'exact' })
        .limit(3);

      if (error) {
        results.database = {
          status: 'ERROR',
          error: error.message,
          code: error.code,
          details: error.details,
        };
      } else {
        results.database = {
          status: 'CONNECTED',
          servicesCount: count,
          sampleServices: data?.map(s => s.name) || [],
        };
      }

      // Also test clients table
      const { count: clientCount, error: clientError } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      results.database.clientsCount = clientError ? `Error: ${clientError.message}` : clientCount;

    } catch (err: any) {
      results.database = {
        status: 'EXCEPTION',
        error: err.message,
      };
    }
  } else {
    results.database = {
      status: 'NOT CONFIGURED',
      reason: 'Missing Supabase URL or Service Key',
    };
  }

  return NextResponse.json(results);
}
