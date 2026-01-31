// ============================================================
// REPORTS API
// Aggregate data for dashboards and reports
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/reports - Get report data
export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const reportType = searchParams.get('type') || 'overview';
  const startDate = searchParams.get('startDate') || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

  try {
    switch (reportType) {
      case 'overview':
        return await getOverviewReport(supabase, startDate, endDate);
      case 'revenue':
        return await getRevenueReport(supabase, startDate, endDate);
      case 'providers':
        return await getProviderReport(supabase, startDate, endDate);
      case 'services':
        return await getServicesReport(supabase, startDate, endDate);
      case 'clients':
        return await getClientsReport(supabase, startDate, endDate);
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function getOverviewReport(supabase: any, startDate: string, endDate: string) {
  // Get total revenue
  const { data: transactions } = await supabase
    .from('transactions')
    .select('total_amount, tip_amount, created_at')
    .gte('created_at', startDate)
    .lte('created_at', `${endDate}T23:59:59`)
    .eq('status', 'completed');

  const totalRevenue = transactions?.reduce((sum: number, t: any) => sum + (t.total_amount || 0), 0) || 0;
  const totalTips = transactions?.reduce((sum: number, t: any) => sum + (t.tip_amount || 0), 0) || 0;
  const transactionCount = transactions?.length || 0;
  const avgTicket = transactionCount > 0 ? totalRevenue / transactionCount : 0;

  // Get appointments
  const { data: appointments, count: appointmentCount } = await supabase
    .from('appointments')
    .select('id, status', { count: 'exact' })
    .gte('scheduled_at', startDate)
    .lte('scheduled_at', `${endDate}T23:59:59`);

  const completed = appointments?.filter((a: any) => a.status === 'completed').length || 0;
  const noShows = appointments?.filter((a: any) => a.status === 'no_show').length || 0;
  const cancelled = appointments?.filter((a: any) => a.status === 'cancelled').length || 0;

  // Get new clients
  const { count: newClients } = await supabase
    .from('clients')
    .select('id', { count: 'exact' })
    .gte('created_at', startDate)
    .lte('created_at', `${endDate}T23:59:59`);

  return NextResponse.json({
    report: {
      period: { startDate, endDate },
      revenue: {
        total: totalRevenue,
        tips: totalTips,
        avgTicket: Math.round(avgTicket * 100) / 100,
        transactionCount,
      },
      appointments: {
        total: appointmentCount || 0,
        completed,
        noShows,
        cancelled,
        completionRate: appointmentCount ? Math.round((completed / appointmentCount) * 100) : 0,
        noShowRate: appointmentCount ? Math.round((noShows / appointmentCount) * 100) : 0,
      },
      clients: {
        new: newClients || 0,
      },
    },
  });
}

async function getRevenueReport(supabase: any, startDate: string, endDate: string) {
  // Get daily revenue breakdown
  const { data: transactions } = await supabase
    .from('transactions')
    .select('total_amount, subtotal, tax_amount, tip_amount, discount_amount, created_at')
    .gte('created_at', startDate)
    .lte('created_at', `${endDate}T23:59:59`)
    .eq('status', 'completed')
    .order('created_at');

  // Group by date
  const dailyRevenue: Record<string, any> = {};
  
  for (const t of transactions || []) {
    const date = t.created_at.split('T')[0];
    if (!dailyRevenue[date]) {
      dailyRevenue[date] = { date, revenue: 0, transactions: 0, tips: 0, discounts: 0 };
    }
    dailyRevenue[date].revenue += t.total_amount || 0;
    dailyRevenue[date].transactions += 1;
    dailyRevenue[date].tips += t.tip_amount || 0;
    dailyRevenue[date].discounts += t.discount_amount || 0;
  }

  return NextResponse.json({
    report: {
      period: { startDate, endDate },
      daily: Object.values(dailyRevenue),
      totals: {
        revenue: Object.values(dailyRevenue).reduce((sum: number, d: any) => sum + d.revenue, 0),
        transactions: Object.values(dailyRevenue).reduce((sum: number, d: any) => sum + d.transactions, 0),
        tips: Object.values(dailyRevenue).reduce((sum: number, d: any) => sum + d.tips, 0),
        discounts: Object.values(dailyRevenue).reduce((sum: number, d: any) => sum + d.discounts, 0),
      },
    },
  });
}

async function getProviderReport(supabase: any, startDate: string, endDate: string) {
  // Get appointments by provider
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, status, provider_id,
      provider:staff(id, first_name, last_name),
      service:services(price)
    `)
    .gte('scheduled_at', startDate)
    .lte('scheduled_at', `${endDate}T23:59:59`);

  // Group by provider
  const providerStats: Record<string, any> = {};
  
  for (const apt of appointments || []) {
    if (!apt.provider_id) continue;
    
    if (!providerStats[apt.provider_id]) {
      providerStats[apt.provider_id] = {
        id: apt.provider_id,
        name: `${apt.provider?.first_name || ''} ${apt.provider?.last_name || ''}`.trim(),
        appointments: 0,
        completed: 0,
        noShows: 0,
        revenue: 0,
      };
    }
    
    providerStats[apt.provider_id].appointments += 1;
    if (apt.status === 'completed') {
      providerStats[apt.provider_id].completed += 1;
      providerStats[apt.provider_id].revenue += apt.service?.price || 0;
    }
    if (apt.status === 'no_show') {
      providerStats[apt.provider_id].noShows += 1;
    }
  }

  return NextResponse.json({
    report: {
      period: { startDate, endDate },
      providers: Object.values(providerStats),
    },
  });
}

async function getServicesReport(supabase: any, startDate: string, endDate: string) {
  // Get appointments by service
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id, status, service_id,
      service:services(id, name, price, category_id)
    `)
    .gte('scheduled_at', startDate)
    .lte('scheduled_at', `${endDate}T23:59:59`)
    .eq('status', 'completed');

  // Group by service
  const serviceStats: Record<string, any> = {};
  
  for (const apt of appointments || []) {
    if (!apt.service_id) continue;
    
    if (!serviceStats[apt.service_id]) {
      serviceStats[apt.service_id] = {
        id: apt.service_id,
        name: apt.service?.name || 'Unknown',
        count: 0,
        revenue: 0,
      };
    }
    
    serviceStats[apt.service_id].count += 1;
    serviceStats[apt.service_id].revenue += apt.service?.price || 0;
  }

  // Sort by revenue
  const sortedServices = Object.values(serviceStats).sort((a: any, b: any) => b.revenue - a.revenue);

  return NextResponse.json({
    report: {
      period: { startDate, endDate },
      services: sortedServices,
    },
  });
}

async function getClientsReport(supabase: any, startDate: string, endDate: string) {
  // Get new clients
  const { data: newClients } = await supabase
    .from('clients')
    .select('id, first_name, last_name, source, created_at')
    .gte('created_at', startDate)
    .lte('created_at', `${endDate}T23:59:59`)
    .order('created_at', { ascending: false });

  // Get top clients by spend
  const { data: topClients } = await supabase
    .from('clients')
    .select('id, first_name, last_name, total_spent, total_visits')
    .order('total_spent', { ascending: false })
    .limit(10);

  // Group new clients by source
  const bySource: Record<string, number> = {};
  for (const client of newClients || []) {
    const source = client.source || 'unknown';
    bySource[source] = (bySource[source] || 0) + 1;
  }

  return NextResponse.json({
    report: {
      period: { startDate, endDate },
      newClients: {
        total: newClients?.length || 0,
        bySource,
        list: newClients?.slice(0, 20) || [],
      },
      topClients: topClients || [],
    },
  });
}
