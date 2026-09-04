import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Fetch Stripe revenue data
    let revenue = { today: 0, week: 0, month: 0 };
    try {
      const charges = await stripe.charges.list({
        created: { gte: Math.floor(monthStart.getTime() / 1000) },
        limit: 100,
      });
      
      for (const charge of charges.data) {
        if (charge.paid && !charge.refunded) {
          const chargeDate = new Date(charge.created * 1000);
          const amount = charge.amount / 100;
          
          if (chargeDate >= todayStart) revenue.today += amount;
          if (chargeDate >= weekStart) revenue.week += amount;
          revenue.month += amount;
        }
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
    }

    // Fetch intake queue count
    const { count: intakeQueue } = await supabase
      .from('regen_intakes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Fetch prescription queue count (intakes that are approved but not yet sent to pharmacy)
    const { count: prescriptionQueue } = await supabase
      .from('regen_intakes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    // Fetch orders stats
    const { count: pendingOrders } = await supabase
      .from('regen_orders')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'processing', 'compounding']);

    const { count: shippedOrders } = await supabase
      .from('regen_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'shipped');

    const { count: totalOrders } = await supabase
      .from('regen_orders')
      .select('*', { count: 'exact', head: true });

    // Fetch patient stats
    const { count: totalPatients } = await supabase
      .from('regen_patients')
      .select('*', { count: 'exact', head: true });

    const { count: newPatients } = await supabase
      .from('regen_patients')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart.toISOString());

    // Fetch unread messages
    const { count: unreadMessages } = await supabase
      .from('regen_messages')
      .select('*', { count: 'exact', head: true })
      .eq('read', false)
      .eq('direction', 'inbound');

    return NextResponse.json({
      revenue,
      orders: {
        pending: pendingOrders || 0,
        shipped: shippedOrders || 0,
        total: totalOrders || 0,
      },
      patients: {
        total: totalPatients || 0,
        new: newPatients || 0,
        active: totalPatients || 0, // TODO: define "active" criteria
      },
      intakeQueue: intakeQueue || 0,
      prescriptionQueue: prescriptionQueue || 0,
      messages: unreadMessages || 0,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
