// ============================================================
// API: OWNER METRICS - Single source of truth for Founder Dashboard
// ALL data is from database - NO hardcoded values
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  // Get date range from query params
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'month';
  
  // Calculate date ranges
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  let startDate: Date;
  switch (range) {
    case 'today':
      startDate = new Date(today);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  if (!supabase) {
    return NextResponse.json({
      connected: false,
      message: 'Database not configured',
      data: null,
    });
  }

  try {
    // ============================================================
    // REVENUE METRICS
    // ============================================================
    const { data: transactions } = await supabase
      .from('transactions')
      .select('id, total, amount_cents, created_at, status')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString());

    const revenue = (transactions || []).reduce((sum: number, t: any) => {
      if (t.total) return sum + parseFloat(t.total);
      if (t.amount_cents) return sum + (t.amount_cents / 100);
      return sum;
    }, 0);

    const transactionCount = transactions?.length || 0;
    const avgTicket = transactionCount > 0 ? revenue / transactionCount : 0;

    // ============================================================
    // APPOINTMENT METRICS
    // ============================================================
    const { data: appointments, count: totalAppointments } = await supabase
      .from('appointments')
      .select('id, status, starts_at, client_id, provider_id', { count: 'exact' })
      .gte('starts_at', startDate.toISOString())
      .lte('starts_at', now.toISOString());

    const completedAppointments = (appointments || []).filter((a: any) => 
      a.status === 'completed' || a.status === 'checked_out'
    ).length;
    
    const noShows = (appointments || []).filter((a: any) => 
      a.status === 'no_show' || a.status === 'no-show'
    ).length;
    
    const cancelled = (appointments || []).filter((a: any) => 
      a.status === 'cancelled'
    ).length;

    const noShowRate = totalAppointments && totalAppointments > 0 
      ? noShows / totalAppointments 
      : 0;

    // ============================================================
    // CLIENT METRICS
    // ============================================================
    const { count: totalClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    const { count: newClients } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Clients with return visits (rebook rate)
    const { data: clientVisits } = await supabase
      .from('appointments')
      .select('client_id')
      .eq('status', 'completed')
      .gte('starts_at', startDate.toISOString());
    
    const clientsWithVisits = new Set((clientVisits || []).map((v: any) => v.client_id));
    
    // Get clients with multiple visits
    const visitCounts: Record<string, number> = {};
    (clientVisits || []).forEach((v: any) => {
      visitCounts[v.client_id] = (visitCounts[v.client_id] || 0) + 1;
    });
    const returningClients = Object.values(visitCounts).filter(c => c > 1).length;
    const rebookRate = clientsWithVisits.size > 0 ? returningClients / clientsWithVisits.size : 0;

    // ============================================================
    // PROVIDER METRICS
    // ============================================================
    const { data: providers } = await supabase
      .from('providers')
      .select(`
        id,
        is_active,
        user:users(first_name, last_name)
      `)
      .eq('is_active', true);

    const activeProviders = providers?.length || 0;

    // Provider productivity
    const providerAppointments: Record<string, number> = {};
    (appointments || []).forEach((a: any) => {
      if (a.provider_id) {
        providerAppointments[a.provider_id] = (providerAppointments[a.provider_id] || 0) + 1;
      }
    });

    const providerStats = (providers || []).map((p: any) => ({
      id: p.id,
      name: p.user ? `${p.user.first_name || ''} ${p.user.last_name || ''}`.trim() : 'Unknown',
      appointments: providerAppointments[p.id] || 0,
    }));

    // ============================================================
    // SERVICE METRICS
    // ============================================================
    const { count: totalServices } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // ============================================================
    // MEMBERSHIP METRICS
    // ============================================================
    const { data: memberships, count: membershipCount } = await supabase
      .from('memberships')
      .select('id, status, plan_id', { count: 'exact' })
      .eq('status', 'active');

    const activeMemberships = membershipCount || 0;

    // ============================================================
    // INVENTORY METRICS
    // ============================================================
    const { data: inventory } = await supabase
      .from('inventory')
      .select('id, quantity, expiration_date, reorder_level');

    const lowStockItems = (inventory || []).filter((i: any) => 
      i.quantity <= (i.reorder_level || 10)
    ).length;

    const expiringItems = (inventory || []).filter((i: any) => {
      if (!i.expiration_date) return false;
      const expDate = new Date(i.expiration_date);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expDate <= thirtyDaysFromNow && expDate > now;
    }).length;

    const expiredItems = (inventory || []).filter((i: any) => {
      if (!i.expiration_date) return false;
      return new Date(i.expiration_date) < now;
    }).length;

    // ============================================================
    // CONSENT METRICS
    // ============================================================
    const { count: pendingConsents } = await supabase
      .from('consent_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // ============================================================
    // RECENT ACTIVITY (Audit Log)
    // ============================================================
    const { data: recentChanges } = await supabase
      .from('config_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // ============================================================
    // FEATURE FLAGS
    // ============================================================
    const { data: featureFlags, count: flagCount } = await supabase
      .from('feature_flags')
      .select('*', { count: 'exact' });

    const enabledFeatures = (featureFlags || []).filter((f: any) => f.enabled).length;

    // ============================================================
    // BUSINESS RULES
    // ============================================================
    const { count: activeRules } = await supabase
      .from('business_rules')
      .select('*', { count: 'exact', head: true })
      .eq('enabled', true);

    // ============================================================
    // UPCOMING APPOINTMENTS
    // ============================================================
    const { data: upcomingAppointments } = await supabase
      .from('appointments')
      .select(`
        id,
        starts_at,
        status,
        client_id,
        service:services(name),
        provider:providers(
          id,
          user:users(first_name, last_name)
        )
      `)
      .gte('starts_at', now.toISOString())
      .order('starts_at')
      .limit(5);

    // Get client names
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
      time: apt.starts_at,
      status: apt.status,
      clientName: clientMap.get(apt.client_id) || 'Unknown',
      service: apt.service?.name || 'Service',
      provider: apt.provider?.user 
        ? `${apt.provider.user.first_name || ''} ${apt.provider.user.last_name || ''}`.trim() 
        : 'Provider',
    }));

    // ============================================================
    // SYSTEM STATUS
    // ============================================================
    const systemStatus = {
      database: true,
      configVersion: 'v1.0', // Could be stored in system_config table
      lastBackup: null, // Would come from backup tracking
    };

    return NextResponse.json({
      connected: true,
      timestamp: now.toISOString(),
      range,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      
      // Revenue & Financial
      revenue: {
        total: revenue,
        transactions: transactionCount,
        avgTicket: Math.round(avgTicket * 100) / 100,
      },
      
      // Appointments
      appointments: {
        total: totalAppointments || 0,
        completed: completedAppointments,
        noShows,
        cancelled,
        noShowRate: Math.round(noShowRate * 100) / 100,
        upcoming,
      },
      
      // Clients
      clients: {
        total: totalClients || 0,
        new: newClients || 0,
        rebookRate: Math.round(rebookRate * 100) / 100,
      },
      
      // Providers
      providers: {
        active: activeProviders,
        stats: providerStats,
      },
      
      // Services
      services: {
        total: totalServices || 0,
      },
      
      // Memberships
      memberships: {
        active: activeMemberships,
      },
      
      // Inventory
      inventory: {
        total: inventory?.length || 0,
        lowStock: lowStockItems,
        expiringSoon: expiringItems,
        expired: expiredItems,
      },
      
      // Compliance
      compliance: {
        pendingConsents: pendingConsents || 0,
      },
      
      // System
      system: {
        status: 'operational',
        enabledFeatures,
        totalFeatures: flagCount || 0,
        activeRules: activeRules || 0,
      },
      
      // Recent Activity
      recentChanges: (recentChanges || []).map((c: any) => ({
        id: c.id,
        timestamp: c.created_at,
        user: c.changed_by || 'System',
        action: c.change_type,
        target: c.table_name,
        details: c.new_value,
      })),
    });
  } catch (error) {
    console.error('Owner metrics API error:', error);
    return NextResponse.json({
      connected: true,
      error: 'Failed to fetch metrics',
      message: error instanceof Error ? error.message : 'Unknown error',
      data: null,
    }, { status: 500 });
  }
}
