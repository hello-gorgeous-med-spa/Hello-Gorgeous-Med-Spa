import { getSupabase } from '@/lib/supabase-server';

export async function loadOpsToday() {
  const empty = {
    intakes: [] as Array<Record<string, unknown>>,
    shipped: [] as Array<Record<string, unknown>>,
    stats: {
      revenue: { today: 0, week: 0, month: 0 },
      intakeQueue: 0,
      orders: { pending: 0, shipped: 0, total: 0 },
      patients: { total: 0 },
    },
  };
  const supabase = getSupabase();
  if (!supabase) return empty;

  const { data: intakes } = await supabase
    .from('regen_intakes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80);

  const { count: intakeQueue } = await supabase
    .from('regen_intakes')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  const { count: pendingOrders } = await supabase
    .from('regen_orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'processing', 'compounding']);

  const { count: totalOrders } = await supabase
    .from('regen_orders')
    .select('*', { count: 'exact', head: true });

  const { data: shipped } = await supabase
    .from('regen_orders')
    .select('*')
    .eq('status', 'shipped')
    .order('created_at', { ascending: false })
    .limit(40);

  const { count: totalPatients } = await supabase
    .from('regen_patients')
    .select('*', { count: 'exact', head: true });

  return {
    intakes: intakes || [],
    shipped: shipped || [],
    stats: {
      revenue: { today: 0, week: 0, month: 0 },
      intakeQueue: intakeQueue || 0,
      orders: { pending: pendingOrders || 0, shipped: shipped?.length || 0, total: totalOrders || 0 },
      patients: { total: totalPatients || 0 },
    },
  };
}

export async function loadOpsOrders() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
    .from('regen_orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80);
  return data || [];
}
