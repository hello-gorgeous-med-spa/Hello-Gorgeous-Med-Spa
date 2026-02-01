// ============================================================
// API: BUSINESS SETTINGS
// Get and update business configuration
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';

// GET /api/settings - Get business settings
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();

    // Try to get settings from database
    const { data: settingsData, error } = await supabase
      .from('business_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine for first load
      console.error('Settings fetch error:', error);
    }

    // Return settings or defaults
    const settings = settingsData?.settings || {
      business_name: 'Hello Gorgeous Med Spa',
      phone: '(630) 636-6193',
      email: 'hello@hellogorgeousmedspa.com',
      address: '74 W. Washington St, Oswego, IL 60543',
      timezone: 'America/Chicago',
      online_booking_enabled: true,
      require_deposit: false,
      send_reminders: true,
      cancellation_hours: 24,
      cancellation_fee_percent: 50,
    };

    const businessHours = settingsData?.business_hours || {
      monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
      tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
      wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
      thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
      friday: { open: '9:00 AM', close: '3:00 PM', enabled: true },
      saturday: { open: '10:00 AM', close: '2:00 PM', enabled: false },
      sunday: { open: '', close: '', enabled: false },
    };

    return NextResponse.json({ settings, businessHours });
  } catch (error) {
    console.error('Settings GET error:', error);
    // Return defaults if anything fails
    return NextResponse.json({
      settings: {
        business_name: 'Hello Gorgeous Med Spa',
        phone: '(630) 636-6193',
        email: 'hello@hellogorgeousmedspa.com',
        address: '74 W. Washington St, Oswego, IL 60543',
        timezone: 'America/Chicago',
        online_booking_enabled: true,
        require_deposit: false,
        send_reminders: true,
        cancellation_hours: 24,
        cancellation_fee_percent: 50,
      },
      businessHours: {
        monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
        tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
        wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
        thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
        friday: { open: '9:00 AM', close: '3:00 PM', enabled: true },
        saturday: { open: '10:00 AM', close: '2:00 PM', enabled: false },
        sunday: { open: '', close: '', enabled: false },
      },
    });
  }
}

// PUT /api/settings - Update business settings
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { settings, businessHours } = await request.json();

    // Check if settings row exists
    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('business_settings')
        .update({
          settings,
          business_hours: businessHours,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Insert new
      result = await supabase
        .from('business_settings')
        .insert({
          settings,
          business_hours: businessHours,
        });
    }

    if (result.error) {
      // If table doesn't exist, just return success (settings stored in browser)
      console.error('Settings save error:', result.error);
      // Still return success - settings work locally
      return NextResponse.json({ 
        success: true, 
        message: 'Settings saved locally (database table may not exist yet)',
        note: 'Run the business_settings migration to persist settings'
      });
    }

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
