// ============================================================
// GET /api/live-state — Live system health (DB, env, counts)
// Used by Live System page for transparency and ops visibility
// ============================================================

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) return null;
  try {
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch {
    return null;
  }
}

export async function GET() {
  const now = new Date().toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayStr = todayStart.toISOString().split('T')[0];
  const tomorrowStr = new Date(todayStart.getTime() + 86400000).toISOString().split('T')[0];

  const state: {
    lastChecked: string;
    database: 'connected' | 'disconnected';
    databaseDetail?: string;
    clientsCount: number;
    servicesCount: number;
    appointmentsTodayCount: number;
    env: { hasSupabaseUrl: boolean; hasSupabaseKey: boolean };
  } = {
    lastChecked: now,
    database: 'disconnected',
    clientsCount: 0,
    servicesCount: 0,
    appointmentsTodayCount: 0,
    env: {
      hasSupabaseUrl: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && !String(process.env.NEXT_PUBLIC_SUPABASE_URL).includes('placeholder')),
      hasSupabaseKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY && !String(process.env.SUPABASE_SERVICE_ROLE_KEY).includes('placeholder')),
    },
  };

  const supabase = getSupabase();
  if (!supabase) {
    state.databaseDetail = 'Supabase env not set or placeholder';
    return NextResponse.json(state);
  }

  try {
    const clientsRes = await supabase.from('clients').select('*', { count: 'exact', head: true });
    if (clientsRes.error) {
      state.databaseDetail = clientsRes.error.message;
      return NextResponse.json(state);
    }
    state.database = 'connected';
    state.clientsCount = clientsRes.count ?? 0;
  } catch (e: any) {
    state.databaseDetail = e?.message || 'Connection failed';
    return NextResponse.json(state);
  }

  try {
    const servicesRes = await supabase.from('services').select('*', { count: 'exact', head: true });
    if (!servicesRes.error) state.servicesCount = servicesRes.count ?? 0;
  } catch {
    // optional
  }
  try {
    const aptsRes = await supabase.from('appointments').select('id').gte('starts_at', todayStr).lt('starts_at', tomorrowStr);
    if (!aptsRes.error) state.appointmentsTodayCount = aptsRes.data?.length ?? 0;
  } catch {
    // optional
  }

  return NextResponse.json(state);
}
