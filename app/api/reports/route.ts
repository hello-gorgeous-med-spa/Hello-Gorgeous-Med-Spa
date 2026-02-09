// ============================================================
// REPORTS API — Live data only, no static values
// Query params: range=today|week|month
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

function getDateRange(range: string): { start: string; end: string } {
  const end = new Date();
  let start = new Date();
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(start.getDate() - 7);
      break;
    case 'month':
      start.setDate(start.getDate() - 30);
      break;
    default:
      start.setDate(start.getDate() - 7);
  }
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'week';
  const { start, end } = getDateRange(range);

  try {
    // Revenue from sales (completed only) in range
    const { data: sales } = await supabase
      .from('sales')
      .select('id, gross_total, net_total, tip_total')
      .eq('status', 'completed')
      .gte('created_at', start)
      .lte('created_at', end);

    const transactionCount = sales?.length ?? 0;
    const totalRevenueCents = (sales || []).reduce((sum: number, s: any) => sum + (s.gross_total ?? s.net_total ?? 0), 0);
    const totalTipsCents = (sales || []).reduce((sum: number, s: any) => sum + (s.tip_total ?? 0), 0);
    const totalRevenue = totalRevenueCents / 100;
    const totalTips = totalTipsCents / 100;
    const avgTicket = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    // Appointments in range (by status)
    const { data: appointments } = await supabase
      .from('appointments')
      .select('id, status')
      .gte('starts_at', start)
      .lte('starts_at', end);

    const totalAppointments = appointments?.length ?? 0;
    const completed = appointments?.filter((a: any) => a.status === 'completed').length ?? 0;
    const noShows = appointments?.filter((a: any) => a.status === 'no_show').length ?? 0;
    const cancelled = appointments?.filter((a: any) => a.status === 'cancelled').length ?? 0;
    const completionRate = totalAppointments > 0 ? Math.round((completed / totalAppointments) * 100) : 0;
    const noShowRate = totalAppointments > 0 ? Math.round((noShows / totalAppointments) * 100) : 0;

    // New clients in range
    const { count: newClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', start)
      .lte('created_at', end);

    return NextResponse.json({
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        tips: Math.round(totalTips * 100) / 100,
        transactionCount,
        avgTicket: Math.round(avgTicket * 100) / 100,
      },
      appointments: {
        total: totalAppointments,
        completed,
        noShows,
        cancelled,
        completionRate,
        noShowRate,
      },
      clients: {
        new: newClients ?? 0,
      },
    });
  } catch (e) {
    console.error('Reports API error:', e);
    return NextResponse.json({ error: 'Failed to load report' }, { status: 500 });
  }
}
