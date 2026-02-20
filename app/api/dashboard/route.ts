// ============================================================
import { createClient } from '@supabase/supabase-js';
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
    // createClient imported at top
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
    return NextResponse.json({ ...EMPTY_STATS, source: 'local' });
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

    // Get today's revenue from SALES table (not transactions - that table doesn't exist)
    // Sales table uses gross_total in cents
    const { data: todaySales } = await supabase
      .from('sales')
      .select('gross_total, net_total')
      .eq('status', 'completed')
      .gte('created_at', `${today}T00:00:00`)
      .lt('created_at', `${today}T23:59:59`);

    const todayRevenue = (todaySales || []).reduce((sum: number, s: any) => {
      // gross_total is in cents
      return sum + ((s.gross_total || s.net_total || 0) / 100);
    }, 0);

    // Get week's revenue
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const { data: weekSales } = await supabase
      .from('sales')
      .select('gross_total, net_total')
      .eq('status', 'completed')
      .gte('created_at', weekStart.toISOString());

    const weekRevenue = (weekSales || []).reduce((sum: number, s: any) => {
      return sum + ((s.gross_total || s.net_total || 0) / 100);
    }, 0);

    // Get month's revenue - 1st of current month at midnight
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthStartStr = monthStart.toISOString();
    
    const { data: monthSales } = await supabase
      .from('sales')
      .select('gross_total, net_total, created_at')
      .eq('status', 'completed')
      .gte('created_at', monthStartStr);
    
    console.log('[Dashboard] Month sales count:', monthSales?.length || 0);

    const monthRevenue = (monthSales || []).reduce((sum: number, s: any) => {
      return sum + ((s.gross_total || s.net_total || 0) / 100);
    }, 0);

    // Get new clients this month
    const { count: newClientsMonth } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString());

    // Get upcoming appointments (next 5) - join through clients to users for names
    const { data: upcomingAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        starts_at,
        scheduled_at,
        status,
        client_id,
        service:services(name),
        provider:providers(
          id,
          user:users(first_name, last_name)
        )
      `)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at')
      .limit(5);

    // Get client names separately (clients -> users join)
    const clientIds = (upcomingAppointments || []).map((a: any) => a.client_id).filter(Boolean);
    const { data: clientsData } = clientIds.length > 0 
      ? await supabase
          .from('clients')
          .select('id, users!inner(first_name, last_name)')
          .in('id', clientIds)
      : { data: [] };
    
    const clientMap = new Map((clientsData || []).map((c: any) => [
      c.id, 
      `${c.users?.first_name || ''} ${c.users?.last_name || ''}`.trim() || 'Unknown'
    ]));

    const upcoming = (upcomingAppointments || []).map((apt: any) => ({
      id: apt.id,
      time: apt.starts_at || apt.scheduled_at,
      status: apt.status,
      client_name: clientMap.get(apt.client_id) || 'Unknown',
      service: apt.service?.name || 'Service',
      provider_name: apt.provider?.user 
        ? `${apt.provider.user.first_name || ''} ${apt.provider.user.last_name || ''}`.trim() 
        : 'Provider',
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
