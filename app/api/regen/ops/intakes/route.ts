import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { sendRegenNotification } from '@/lib/regen/notifications';
import { fulfillApprovedIntake } from '@/lib/regen/fulfill-approved-intake';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
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
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }
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

    let fulfillment: Awaited<ReturnType<typeof fulfillApprovedIntake>> | null = null;
    if (status === 'approved' && data) {
      try {
        fulfillment = await fulfillApprovedIntake({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          goal: data.goal,
          patient_id: data.patient_id,
          amount_paid: data.amount_paid,
          medical_history: data.medical_history,
          review_notes: review_notes || data.review_notes,
        });
      } catch (fulfillError) {
        console.error('Fulfillment error:', fulfillError);
      }
    }

    // Log the action
    await supabase.from('regen_audit_log').insert({
      action: `intake_${status}`,
      resource_type: 'intake',
      resource_id: id,
      actor_id: reviewed_by,
      actor_type: 'staff',
      details: { status, notes: review_notes },
    });

    // Send patient notification based on status
    try {
      const notificationType = {
        'approved': 'rx_approved',
        'needs_labs': 'rx_needs_labs',
        'needs_video': 'rx_needs_video',
        'declined': 'rx_declined',
      }[status];

      if (notificationType && data.email) {
        await sendRegenNotification({
          type: notificationType as 'rx_approved' | 'rx_needs_labs' | 'rx_needs_video' | 'rx_declined',
          patient: { name: data.name, email: data.email, phone: data.phone },
          intake: { id: data.id, goal: data.goal },
          notes: review_notes,
        });
      }
    } catch (notifyError) {
      console.error('Failed to send notification:', notifyError);
      // Don't fail the request
    }

    return NextResponse.json({ intake: data, fulfillment });
  } catch (error) {
    console.error('Intake update error:', error);
    return NextResponse.json(
      { error: 'Failed to update intake' },
      { status: 500 }
    );
  }
}
