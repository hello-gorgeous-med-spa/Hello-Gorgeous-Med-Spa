// ============================================================
// SYSTEM HEALTH CHECK API
// Comprehensive verification of all system components
// ============================================================

import { NextResponse } from 'next/server';

// Helper to safely create supabase client
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

interface TableCheck {
  name: string;
  exists: boolean;
  count: number | null;
  error?: string;
}

interface IntegrationCheck {
  name: string;
  configured: boolean;
  details?: string;
}

export async function GET() {
  const supabase = getSupabase();
  
  // ===== CHECK DATABASE TABLES =====
  const tablesToCheck = [
    // Core
    'users',
    'user_profiles',
    'clients', 
    'providers',
    'services',
    'service_categories',
    'appointments',
    // Sales Ledger (Square-primary)
    'sales',
    'sale_items',
    'sale_payments',
    'daily_sales_summary',
    'business_wallet',
    // Legacy transactions
    'transactions',
    'transaction_items',
    // Clinical
    'consent_templates',
    'signed_consents',
    'chart_notes',
    // Inventory
    'inventory_items',
    'inventory_lots',
    // Gift Cards (Square-native)
    'gift_cards',
    'gift_card_transactions',
    // Memberships
    'membership_plans',
    'client_memberships',
    // Marketing
    'promotions',
    // Audit
    'audit_logs',
  ];

  const tableChecks: TableCheck[] = [];
  
  // If no Supabase connection, mark all tables as not existing
  if (!supabase) {
    for (const table of tablesToCheck) {
      tableChecks.push({
        name: table,
        exists: false,
        count: null,
        error: 'Supabase not configured',
      });
    }
  } else {
    for (const table of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        tableChecks.push({
          name: table,
          exists: !error,
          count: error ? null : (count || 0),
          error: error?.message,
        });
      } catch (err) {
        tableChecks.push({
          name: table,
          exists: false,
          count: null,
          error: String(err),
        });
      }
    }
  }

  // ===== CHECK INTEGRATIONS =====
  const integrations: IntegrationCheck[] = [
    {
      name: 'Supabase Database',
      configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      details: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected' : 'Missing URL',
    },
    {
      name: 'Supabase Service Role',
      configured: !!process.env.SUPABASE_SERVICE_ROLE_KEY &&
                  process.env.SUPABASE_SERVICE_ROLE_KEY !== 'placeholder-service-role-key',
      details: 'For admin operations',
    },
    {
      name: 'Square Payments (PRIMARY)',
      configured: !!process.env.SQUARE_ACCESS_TOKEN,
      details: process.env.SQUARE_ENVIRONMENT === 'production' ? 'PRODUCTION' : 
               process.env.SQUARE_ACCESS_TOKEN ? 'SANDBOX' : 'Not configured',
    },
    {
      name: 'Square Location',
      configured: !!process.env.SQUARE_LOCATION_ID,
      details: process.env.SQUARE_LOCATION_ID ? 'Configured' : 'Missing',
    },
    {
      name: 'Square Webhooks',
      configured: !!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY,
      details: process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ? 'Configured' : 'Missing',
    },
    {
      name: 'Stripe (DEPRECATED)',
      configured: false, // Always false - Stripe is deprecated
      details: '⚠️ DEPRECATED - Use Square instead',
    },
    {
      name: 'Telnyx SMS',
      configured: !!process.env.TELNYX_API_KEY,
      details: process.env.TELNYX_PHONE_NUMBER || 'No phone configured',
    },
    {
      name: 'Telnyx Messaging Profile',
      configured: !!process.env.TELNYX_MESSAGING_PROFILE_ID,
      details: 'For 10DLC compliance',
    },
  ];

  // ===== CALCULATE HEALTH SCORES =====
  const tablesExisting = tableChecks.filter(t => t.exists).length;
  const tablesTotal = tableChecks.length;
  const tablesWithData = tableChecks.filter(t => t.count && t.count > 0).length;
  
  const integrationsConfigured = integrations.filter(i => i.configured).length;
  const integrationsTotal = integrations.length;

  // ===== KEY METRICS =====
  const clientsTable = tableChecks.find(t => t.name === 'clients');
  const usersTable = tableChecks.find(t => t.name === 'users');
  const servicesTable = tableChecks.find(t => t.name === 'services');
  const appointmentsTable = tableChecks.find(t => t.name === 'appointments');

  // Get SMS opt-in count
  let smsOptInCount = 0;
  if (supabase) {
    try {
      const { count } = await supabase
        .from('clients')
        .select('id', { count: 'exact', head: true })
        .eq('accepts_sms_marketing', true);
      smsOptInCount = count || 0;
    } catch {}
  }

  // ===== CALCULATE OVERALL SCORE =====
  let score = 0;
  
  // Database tables (40 points)
  score += (tablesExisting / tablesTotal) * 20;
  score += (tablesWithData / tablesTotal) * 20;
  
  // Integrations (40 points)
  score += (integrationsConfigured / integrationsTotal) * 40;
  
  // Key data (20 points)
  if (clientsTable?.count && clientsTable.count > 0) score += 5;
  if (servicesTable?.count && servicesTable.count > 0) score += 5;
  if (usersTable?.count && usersTable.count > 0) score += 5;
  if (smsOptInCount > 0) score += 5;

  const overallScore = Math.round(score * 10) / 10;

  // ===== GO-LIVE CHECKLIST =====
  const checklist = [
    {
      item: 'Database connected',
      ready: tablesExisting > 0,
      critical: true,
    },
    {
      item: 'Core tables exist (users, clients, services)',
      ready: ['users', 'clients', 'services'].every(t => 
        tableChecks.find(tc => tc.name === t)?.exists
      ),
      critical: true,
    },
    {
      item: 'Sales Ledger tables exist',
      ready: ['sales', 'sale_items', 'sale_payments'].every(t => 
        tableChecks.find(tc => tc.name === t)?.exists
      ),
      critical: true,
    },
    {
      item: 'Square Payments configured (PRIMARY)',
      ready: integrations.find(i => i.name === 'Square Payments (PRIMARY)')?.configured || false,
      critical: true,
    },
    {
      item: 'Square Location configured',
      ready: integrations.find(i => i.name === 'Square Location')?.configured || false,
      critical: true,
    },
    {
      item: 'Telnyx SMS configured',
      ready: integrations.find(i => i.name === 'Telnyx SMS')?.configured || false,
      critical: true,
    },
    {
      item: 'Client data imported',
      ready: (clientsTable?.count || 0) > 0,
      critical: true,
    },
    {
      item: 'Services defined',
      ready: (servicesTable?.count || 0) > 0,
      critical: false,
    },
    {
      item: 'Gift cards (Square native)',
      ready: tableChecks.find(t => t.name === 'gift_cards')?.exists || false,
      critical: false,
    },
    {
      item: 'Consent templates exist',
      ready: tableChecks.find(t => t.name === 'consent_templates')?.exists || false,
      critical: false,
    },
    {
      item: 'Audit logging enabled',
      ready: tableChecks.find(t => t.name === 'audit_logs')?.exists || false,
      critical: false,
    },
  ];

  const criticalReady = checklist.filter(c => c.critical && c.ready).length;
  const criticalTotal = checklist.filter(c => c.critical).length;
  const allReady = checklist.filter(c => c.ready).length;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    overallScore,
    status: overallScore >= 90 ? 'READY' : overallScore >= 70 ? 'ALMOST_READY' : 'NEEDS_WORK',
    
    database: {
      tablesExisting,
      tablesTotal,
      tablesWithData,
      tables: tableChecks,
    },
    
    integrations,
    
    metrics: {
      totalClients: clientsTable?.count || 0,
      totalUsers: usersTable?.count || 0,
      totalServices: servicesTable?.count || 0,
      totalAppointments: appointmentsTable?.count || 0,
      smsOptInCount,
    },
    
    checklist,
    checklistSummary: {
      criticalReady,
      criticalTotal,
      allReady,
      allTotal: checklist.length,
      canGoLive: criticalReady === criticalTotal,
    },
  });
}
