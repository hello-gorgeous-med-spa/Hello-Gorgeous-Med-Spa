import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({
        revenue: { today: 0, week: 0, month: 0 },
        orders: { pending: 0, shipped: 0, total: 0 },
        patients: { total: 0, new: 0, active: 0 },
        intakeQueue: 0,
        prescriptionQueue: 0,
        messages: 0,
      });
    }

    // Get date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data: monthOrders } = await supabase
      .from('regen_orders')
      .select('total, created_at')
      .gte('created_at', monthStart.toISOString());

    const revenue = { today: 0, week: 0, month: 0 };
    for (const order of monthOrders || []) {
      const amount = Number(order.total ?? 0);
      const created = new Date(order.created_at);
      if (created >= todayStart) revenue.today += amount;
      if (created >= weekStart) revenue.week += amount;
      revenue.month += amount;
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
