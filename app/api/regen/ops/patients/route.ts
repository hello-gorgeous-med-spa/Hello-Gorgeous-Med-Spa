import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('regen_patients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Get order totals for each patient
    const patientsWithStats = await Promise.all(
      (data || []).map(async (patient) => {
        const { data: orders } = await supabase
          .from('regen_orders')
          .select('total, created_at')
          .eq('patient_id', patient.id);

        const totalSpent = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
        const lastOrder = orders?.length ? orders[0].created_at : null;

        return {
          ...patient,
          totalSpent,
          lastOrder,
          orderCount: orders?.length || 0,
        };
      })
    );

    return NextResponse.json({
      patients: patientsWithStats,
      total: count || 0,
    });
  } catch (error) {
    console.error('Patients API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('regen_patients')
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone,
        date_of_birth: body.date_of_birth,
        state: body.state || 'IL',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ patient: data });
  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
