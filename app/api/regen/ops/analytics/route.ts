import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import Stripe from 'stripe';

// Lazy init to avoid build-time errors
function getStripe() {
  const key = process.env.REGEN_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe API key not configured');
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month';

    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Fetch Stripe revenue
    let revenue = { today: 0, week: 0, month: 0, year: 0, lastMonth: 0 };
    try {
      // This month
      const charges = await getStripe().charges.list({
        created: { gte: Math.floor(yearStart.getTime() / 1000) },
        limit: 100,
      });

      for (const charge of charges.data) {
        if (charge.paid && !charge.refunded) {
          const chargeDate = new Date(charge.created * 1000);
          const amount = charge.amount / 100;

          if (chargeDate >= todayStart) revenue.today += amount;
          if (chargeDate >= weekStart) revenue.week += amount;
          if (chargeDate >= monthStart) revenue.month += amount;
          if (chargeDate >= lastMonthStart && chargeDate < monthStart) revenue.lastMonth += amount;
          revenue.year += amount;
        }
      }
    } catch (stripeError) {
      console.error('Stripe analytics error:', stripeError);
    }

    const growth = revenue.lastMonth > 0 
      ? ((revenue.month - revenue.lastMonth) / revenue.lastMonth) * 100 
      : 0;

    // Fetch orders from Supabase
    const { data: allOrders } = await supabase
      .from('regen_orders')
      .select('id, total, status, items, created_at')
      .gte('created_at', yearStart.toISOString());

    const orders = allOrders || [];
    const completedOrders = orders.filter(o => o.status === 'delivered');
    const pendingOrders = orders.filter(o => ['pending', 'processing', 'compounding', 'shipped'].includes(o.status));
    const avgValue = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + (o.total || 0), 0) / completedOrders.length
      : 0;

    // Fetch patients
    const { count: totalPatients } = await supabase
      .from('regen_patients')
      .select('*', { count: 'exact', head: true });

    const { count: newPatients } = await supabase
      .from('regen_patients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString());

    // Active = ordered in last 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const { data: activePatientOrders } = await supabase
      .from('regen_orders')
      .select('patient_id')
      .gte('created_at', ninetyDaysAgo.toISOString());
    
    const activePatients = new Set(activePatientOrders?.map(o => o.patient_id) || []).size;

    // Churn rate (simplified: patients who ordered last quarter but not this quarter)
    const churnRate = totalPatients && totalPatients > 0
      ? Math.max(0, ((totalPatients - activePatients) / totalPatients) * 100)
      : 0;

    // Subscriptions (from Stripe)
    let subscriptionStats = { active: 0, mrr: 0, growth: 0 };
    try {
      const subscriptions = await getStripe().subscriptions.list({
        status: 'active',
        limit: 100,
      });

      subscriptionStats.active = subscriptions.data.length;
      subscriptionStats.mrr = subscriptions.data.reduce((sum, sub) => {
        const item = sub.items.data[0];
        return sum + (item?.price?.unit_amount || 0) / 100;
      }, 0);
    } catch (subError) {
      console.error('Subscription analytics error:', subError);
    }

    // Top products
    const productCounts: Record<string, { name: string; revenue: number; count: number }> = {};
    for (const order of completedOrders) {
      const items = order.items as Array<{ name: string; price?: number }> || [];
      for (const item of items) {
        const name = item.name || 'Unknown';
        if (!productCounts[name]) {
          productCounts[name] = { name, revenue: 0, count: 0 };
        }
        productCounts[name].count += 1;
        productCounts[name].revenue += item.price || 0;
      }
    }
    const topProducts = Object.values(productCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Revenue by program
    const programRevenue: Record<string, number> = {
      'Weight Loss': 0,
      'Hormones': 0,
      'Peptides': 0,
      'Vitamins': 0,
      'Other': 0,
    };

    for (const order of completedOrders) {
      const total = order.total || 0;
      const items = JSON.stringify(order.items || []).toLowerCase();
      
      if (items.includes('semaglutide') || items.includes('tirzepatide') || items.includes('weight')) {
        programRevenue['Weight Loss'] += total;
      } else if (items.includes('testosterone') || items.includes('hormone')) {
        programRevenue['Hormones'] += total;
      } else if (items.includes('peptide') || items.includes('sermorelin')) {
        programRevenue['Peptides'] += total;
      } else if (items.includes('b12') || items.includes('vitamin')) {
        programRevenue['Vitamins'] += total;
      } else {
        programRevenue['Other'] += total;
      }
    }

    const totalProgramRevenue = Object.values(programRevenue).reduce((a, b) => a + b, 0);
    const revenueByProgram = Object.entries(programRevenue)
      .filter(([_, rev]) => rev > 0)
      .map(([program, rev]) => ({
        program,
        revenue: rev,
        percentage: totalProgramRevenue > 0 ? (rev / totalProgramRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({
      revenue: { ...revenue, growth },
      orders: {
        total: orders.length,
        pending: pendingOrders.length,
        completed: completedOrders.length,
        avgValue,
      },
      patients: {
        total: totalPatients || 0,
        new: newPatients || 0,
        active: activePatients,
        churnRate,
      },
      subscriptions: subscriptionStats,
      topProducts,
      revenueByProgram,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
