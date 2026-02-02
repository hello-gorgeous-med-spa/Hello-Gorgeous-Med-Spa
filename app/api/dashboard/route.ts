// ============================================================
// API: DASHBOARD STATS - Aggregated data with service role
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Safe Supabase helper
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// Default empty response
const EMPTY_STATS = {
  stats: {
    todayAppointments: 0,
    totalClients: 0,
    totalAppointments: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
    newClientsMonth: 0,
  },
  upcomingAppointments: [],
};

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    console.log('Dashboard: Supabase not configured, returning empty stats');
    return NextResponse.json(EMPTY_STATS);
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Get today's appointments count
    const { count: todayAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('starts_at', `${today}T00:00:00`)
      .lt('starts_at', `${today}T23:59:59`);

    // Get total clients
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    // Get total appointments
    const { count: totalAppointments } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    // Get today's revenue from transactions
    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('total, amount_cents')
      .eq('status', 'completed')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    const todayRevenue = (todayTransactions || []).reduce((sum: number, t: any) => {
      // Handle both POS schema (total as decimal) and main schema (amount_cents)
      if (t.total) return sum + parseFloat(t.total);
      if (t.amount_cents) return sum + (t.amount_cents / 100);
      return sum;
    }, 0);

    // Get week's revenue
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const { data: weekTransactions } = await supabase
      .from('transactions')
      .select('total, amount_cents')
      .eq('status', 'completed')
      .gte('created_at', weekStart.toISOString());

    const weekRevenue = (weekTransactions || []).reduce((sum: number, t: any) => {
      if (t.total) return sum + parseFloat(t.total);
      if (t.amount_cents) return sum + (t.amount_cents / 100);
      return sum;
    }, 0);

    // Get month's revenue
    const monthStart = new Date();
    monthStart.setDate(1);
    const { data: monthTransactions } = await supabase
      .from('transactions')
      .select('total, amount_cents')
      .eq('status', 'completed')
      .gte('created_at', monthStart.toISOString());

    const monthRevenue = (monthTransactions || []).reduce((sum: number, t: any) => {
      if (t.total) return sum + parseFloat(t.total);
      if (t.amount_cents) return sum + (t.amount_cents / 100);
      return sum;
    }, 0);

    // Get new clients this month
    const { count: newClientsMonth } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString());

    // Get upcoming appointments (next 5)
    const { data: upcomingAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        starts_at,
        scheduled_at,
        status,
        client:clients(id, first_name, last_name),
        service:services(name)
      `)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(5);

    const upcoming = (upcomingAppointments || []).map((apt: any) => ({
      id: apt.id,
      time: apt.starts_at || apt.scheduled_at,
      status: apt.status,
      client_name: apt.client ? 
        `${apt.client.first_name || ''} ${apt.client.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
      service: apt.service?.name || 'Service',
    }));

    return NextResponse.json({
      stats: {
        todayAppointments: todayAppointments || 0,
        totalClients: totalClients || 0,
        totalAppointments: totalAppointments || 0,
        todayRevenue,
        weekRevenue,
        monthRevenue,
        newClientsMonth: newClientsMonth || 0,
      },
      upcomingAppointments: upcoming,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(EMPTY_STATS);
  }
}
