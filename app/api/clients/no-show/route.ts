// ============================================================
// API: NO-SHOW TRACKING
// Track client no-shows and enforce deposit requirements
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

const MAX_NO_SHOWS = 3;

// GET /api/clients/no-show?clientId=xxx - Check no-show status
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ error: 'clientId required' }, { status: 400 });
    }

    // Count no-shows for this client
    const { count, error } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', clientId)
      .eq('status', 'no_show');

    if (error) {
      console.error('Error counting no-shows:', error);
      return NextResponse.json({ error: 'Failed to check no-show status' }, { status: 500 });
    }

    const noShowCount = count || 0;
    const requiresDeposit = noShowCount >= MAX_NO_SHOWS;

    return NextResponse.json({
      clientId,
      noShowCount,
      maxAllowed: MAX_NO_SHOWS,
      requiresDeposit,
      message: requiresDeposit 
        ? `Client has ${noShowCount} no-shows. Deposit required for future bookings.`
        : `Client has ${noShowCount} no-show(s). ${MAX_NO_SHOWS - noShowCount} more before deposit required.`,
    });
  } catch (error) {
    console.error('No-show check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/clients/no-show - Record a no-show (updates appointment status)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { appointmentId, clientId } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ error: 'appointmentId required' }, { status: 400 });
    }

    // Update appointment to no-show
    const { data: appointment, error: updateError } = await supabase
      .from('appointments')
      .update({ 
        status: 'no_show',
        no_show_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select('client_id')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Failed to record no-show' }, { status: 500 });
    }

    const targetClientId = clientId || appointment?.client_id;

    // Get updated no-show count
    const { count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('client_id', targetClientId)
      .eq('status', 'no_show');

    const noShowCount = count || 0;
    const requiresDeposit = noShowCount >= MAX_NO_SHOWS;

    // If max no-shows reached, flag the client
    if (requiresDeposit) {
      await supabase
        .from('clients')
        .update({ 
          requires_deposit: true,
          flagged_reason: `${noShowCount} no-shows recorded`,
        })
        .eq('id', targetClientId);
    }

    return NextResponse.json({
      success: true,
      noShowCount,
      requiresDeposit,
      message: requiresDeposit 
        ? 'Client now requires deposit for future bookings'
        : 'No-show recorded',
    });
  } catch (error) {
    console.error('No-show record error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
