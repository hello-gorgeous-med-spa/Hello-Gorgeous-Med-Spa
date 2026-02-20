// ============================================================
// HEALTH CHECK - Quick diagnostic endpoint
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 10; // 10 second max for this function

export async function GET() {
  const startTime = Date.now();
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseUrlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      nodeEnv: process.env.NODE_ENV,
      vercelRegion: process.env.VERCEL_REGION || 'unknown',
    },
    checks: {},
  };

  // Check 1: Can we create Supabase client?
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!url || !key) {
      results.checks.supabaseClient = { status: 'error', message: 'Missing credentials' };
    } else {
      const supabase = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      results.checks.supabaseClient = { status: 'ok', message: 'Client created', time: Date.now() - startTime };
      
      // Check 2: Can we ping Supabase with a simple query? (5 second timeout)
      const queryStart = Date.now();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout (5s)')), 5000)
      );
      
      try {
        const { count, error } = await Promise.race([
          supabase.from('appointments').select('*', { count: 'exact', head: true }),
          timeoutPromise,
        ]) as any;
        
        if (error) {
          results.checks.supabaseQuery = { status: 'error', message: error.message, time: Date.now() - queryStart };
        } else {
          results.checks.supabaseQuery = { status: 'ok', appointmentCount: count, time: Date.now() - queryStart };
        }
      } catch (e: any) {
        results.checks.supabaseQuery = { status: 'timeout', message: e.message, time: Date.now() - queryStart };
      }
    }
  } catch (e: any) {
    results.checks.supabaseClient = { status: 'error', message: e.message };
  }

  results.totalTime = Date.now() - startTime;
  
  // Return appropriate status
  const hasError = Object.values(results.checks).some((c: any) => c.status === 'error' || c.status === 'timeout');
  
  return NextResponse.json(results, { status: hasError ? 503 : 200 });
}
