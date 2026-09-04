import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get patient record
    const { data: patient } = await supabase
      .from('regen_patients')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!patient) {
      // No patient record yet - return empty state
      return NextResponse.json({
        patient: null,
        stats: {
          activePrescriptions: 0,
          pendingOrders: 0,
          unreadMessages: 0,
        },
        recentActivity: [],
        orders: [],
        prescriptions: [],
      });
    }

    // Get active prescriptions count
    const { count: activePrescriptions } = await supabase
      .from('regen_intakes')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patient.id)
      .eq('status', 'approved');

    // Get pending orders count
    const { count: pendingOrders } = await supabase
      .from('regen_orders')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patient.id)
      .in('status', ['pending', 'processing', 'compounding', 'shipped']);

    // Get unread messages count
    const { count: unreadMessages } = await supabase
      .from('regen_messages')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patient.id)
      .eq('direction', 'inbound')
      .eq('read', false);

    // Get recent orders
    const { data: orders } = await supabase
      .from('regen_orders')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent intakes/prescriptions
    const { data: prescriptions } = await supabase
      .from('regen_intakes')
      .select('*')
      .eq('patient_id', patient.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Build recent activity feed
    const recentActivity = [
      ...(orders || []).map(o => ({
        id: o.id,
        type: 'order',
        title: `Order ${o.order_number}`,
        status: o.status,
        date: o.created_at,
        icon: '📦',
      })),
      ...(prescriptions || []).map(p => ({
        id: p.id,
        type: 'prescription',
        title: `${p.goal} Visit`,
        status: p.status,
        date: p.created_at,
        icon: '💊',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 5);

    return NextResponse.json({
      patient,
      stats: {
        activePrescriptions: activePrescriptions || 0,
        pendingOrders: pendingOrders || 0,
        unreadMessages: unreadMessages || 0,
      },
      recentActivity,
      orders: orders || [],
      prescriptions: prescriptions || [],
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
