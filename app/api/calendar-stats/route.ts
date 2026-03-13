// ============================================================
// API: CALENDAR STATS - Owner Command Center KPI data
// Returns appointment counts, revenue, and error counts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { businessDayToISOBounds } from '@/lib/business-timezone';

export const dynamic = 'force-dynamic';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) {
    return null;
  }
  
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  
  if (!supabase) {
    return NextResponse.json({ 
      total: 0,
      booked: 0,
      confirmed: 0,
      checkedIn: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      revenue: 0,
      bookingErrors: 0,
      messagingErrors: 0,
      pendingVerification: 0,
    });
  }

  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const { startISO, endISO } = businessDayToISOBounds(date);

    // Fetch appointments for the day
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select(`
        id,
        status,
        verification_status,
        service:services(price_cents, price)
      `)
      .gte('starts_at', startISO)
      .lt('starts_at', endISO);

    if (apptError) {
      console.error('Error fetching appointments:', apptError);
    }

    const appts = appointments || [];
    
    // Calculate appointment stats
    const stats = {
      total: appts.filter(a => a.status !== 'cancelled').length,
      booked: appts.filter(a => a.status === 'booked' || a.status === 'pending').length,
      confirmed: appts.filter(a => a.status === 'confirmed').length,
      checkedIn: appts.filter(a => a.status === 'checked_in').length,
      inProgress: appts.filter(a => a.status === 'in_progress').length,
      completed: appts.filter(a => a.status === 'completed').length,
      cancelled: appts.filter(a => a.status === 'cancelled').length,
      noShow: appts.filter(a => a.status === 'no_show').length,
      pendingVerification: appts.filter(a => 
        a.status === 'completed' && 
        (!a.verification_status || a.verification_status !== 'verified')
      ).length,
      revenue: appts
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => {
          const price = a.service?.price_cents 
            ? a.service.price_cents / 100 
            : (a.service?.price || 0);
          return sum + price;
        }, 0),
    };

    // Fetch booking errors for today
    let bookingErrors = 0;
    try {
      const { count } = await supabase
        .from('booking_errors')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startISO)
        .lt('created_at', endISO)
        .eq('resolved', false);
      
      bookingErrors = count || 0;
    } catch (e) {
      // Table might not exist yet
      console.log('booking_errors table not available');
    }

    // Fetch messaging errors for today
    let messagingErrors = 0;
    try {
      const { count } = await supabase
        .from('messaging_errors')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startISO)
        .lt('created_at', endISO)
        .eq('resolved', false);
      
      messagingErrors = count || 0;
    } catch (e) {
      // Table might not exist yet
      console.log('messaging_errors table not available');
    }

    return NextResponse.json({
      ...stats,
      bookingErrors,
      messagingErrors,
      date,
    });
  } catch (error) {
    console.error('Calendar stats API error:', error);
    return NextResponse.json({ 
      total: 0,
      booked: 0,
      confirmed: 0,
      checkedIn: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      revenue: 0,
      bookingErrors: 0,
      messagingErrors: 0,
      pendingVerification: 0,
    });
  }
}
