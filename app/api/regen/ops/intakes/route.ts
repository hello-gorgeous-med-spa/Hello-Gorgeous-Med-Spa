import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('regen_intakes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ intakes: data || [] });
  } catch (error) {
    console.error('Intakes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch intakes' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const body = await request.json();
    const { id, status, review_notes, reviewed_by } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('regen_intakes')
      .update({
        status,
        review_notes,
        reviewed_by,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.from('regen_audit_log').insert({
      action: `intake_${status}`,
      resource_type: 'intake',
      resource_id: id,
      actor_id: reviewed_by,
      actor_type: 'staff',
      details: { status, notes: review_notes },
    });

    return NextResponse.json({ intake: data });
  } catch (error) {
    console.error('Intake update error:', error);
    return NextResponse.json(
      { error: 'Failed to update intake' },
      { status: 500 }
    );
  }
}
