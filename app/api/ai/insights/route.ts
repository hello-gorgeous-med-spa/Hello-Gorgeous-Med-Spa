// ============================================================
import { createClient } from '@supabase/supabase-js';
// AI INSIGHTS API - Pre-built insight cards
// Returns key business metrics for dashboard display
// ============================================================

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    // createClient imported at top
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
      insights: [
        { id: '1', title: "Today's Appointments", value: '—', icon: '📅', color: 'from-blue-500 to-blue-600' },
        { id: '2', title: "Today's Revenue", value: '—', icon: '💰', color: 'from-green-500 to-emerald-600' },
        { id: '3', title: 'New Clients (Month)', value: '—', icon: '👥', color: 'from-violet-500 to-purple-600' },
        { id: '4', title: 'Rebook Rate', value: '—', icon: '🔄', color: 'from-pink-500 to-rose-600' },
      ],
    });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

    // Today's appointments
    const { count: todayAppts } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .gte('starts_at', todayStart)
      .lt('starts_at', todayEnd)
      .not('status', 'eq', 'cancelled');

    // Today's revenue from sales
    const { data: todaySales } = await supabase
      .from('sales')
      .select('net_total')
      .gte('created_at', todayStart)
      .lt('created_at', todayEnd)
      .eq('status', 'completed');

    const todayRevenue = (todaySales || []).reduce((sum: number, s: any) => sum + (s.net_total || 0), 0) / 100;

    // This month's new clients
    const { count: newClientsMonth } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart);

    // Last month's new clients for comparison
    const { count: newClientsLastMonth } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonthStart)
      .lt('created_at', monthStart);

    // Calculate client growth percentage
    const clientGrowth = newClientsLastMonth && newClientsLastMonth > 0
      ? Math.round(((newClientsMonth || 0) - newClientsLastMonth) / newClientsLastMonth * 100)
      : 0;

    // Rebook rate - clients with 2+ appointments in last 90 days
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const { data: recentAppts } = await supabase
      .from('appointments')
      .select('client_id')
      .gte('starts_at', ninetyDaysAgo)
      .not('status', 'in', '("cancelled","no_show")');

    const clientApptCounts = new Map<string, number>();
    (recentAppts || []).forEach((a: any) => {
      if (a.client_id) {
        clientApptCounts.set(a.client_id, (clientApptCounts.get(a.client_id) || 0) + 1);
      }
    });
    const totalClients = clientApptCounts.size;
    const rebookedClients = Array.from(clientApptCounts.values()).filter(c => c >= 2).length;
    const rebookRate = totalClients > 0 ? Math.round((rebookedClients / totalClients) * 100) : 0;

    return NextResponse.json({
      insights: [
        {
          id: '1',
          title: "Today's Appointments",
          value: todayAppts || 0,
          icon: '📅',
          color: 'from-blue-500 to-blue-600',
        },
        {
          id: '2',
          title: "Today's Revenue",
          value: `$${todayRevenue.toLocaleString()}`,
          icon: '💰',
          color: 'from-green-500 to-emerald-600',
        },
        {
          id: '3',
          title: 'New Clients (Month)',
          value: newClientsMonth || 0,
          change: clientGrowth,
          changeLabel: 'vs last month',
          icon: '👥',
          color: 'from-violet-500 to-purple-600',
        },
        {
          id: '4',
          title: 'Rebook Rate',
          value: `${rebookRate}%`,
          icon: '🔄',
          color: 'from-pink-500 to-rose-600',
        },
      ],
    });
  } catch (error) {
    console.error('Insights API error:', error);
    return NextResponse.json({
      insights: [
        { id: '1', title: "Today's Appointments", value: '—', icon: '📅', color: 'from-blue-500 to-blue-600' },
        { id: '2', title: "Today's Revenue", value: '—', icon: '💰', color: 'from-green-500 to-emerald-600' },
        { id: '3', title: 'New Clients (Month)', value: '—', icon: '👥', color: 'from-violet-500 to-purple-600' },
        { id: '4', title: 'Rebook Rate', value: '—', icon: '🔄', color: 'from-pink-500 to-rose-600' },
      ],
    });
  }
}
