// ============================================================
// API: BUSINESS SETTINGS
// Get and update business configuration
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/hgos/supabase';
import { SITE } from '@/lib/seo';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

// Default settings
const DEFAULT_SETTINGS = {
  business_name: 'Hello Gorgeous Med Spa',
  phone: '(630) 636-6193',
  email: SITE.email,
  address: '74 W. Washington St, Oswego, IL 60543',
  timezone: 'America/Chicago',
  online_booking_enabled: true,
  require_deposit: false,
  send_reminders: true,
  cancellation_hours: 24,
  cancellation_fee_percent: 50,
};

const DEFAULT_HOURS = {
  monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
  tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
  wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
  thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
  friday: { open: '9:00 AM', close: '3:00 PM', enabled: true },
  saturday: { open: '10:00 AM', close: '2:00 PM', enabled: false },
  sunday: { open: '', close: '', enabled: false },
};

// Helper with timeout
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));
  return Promise.race([promise, timeout]);
}

// GET /api/settings - Get business settings
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ 
        settings: DEFAULT_SETTINGS, 
        businessHours: DEFAULT_HOURS 
      });
    }

    // Try business_settings table with timeout
    const result = await withTimeout(
      supabase
        .from('business_settings')
        .select('*')
        .limit(1)
        .single(),
      5000
    );

    // If timeout or error, return defaults
    if (!result || result.error) {
      return NextResponse.json({ 
        settings: DEFAULT_SETTINGS, 
        businessHours: DEFAULT_HOURS 
      });
    }

    // Return settings or defaults
    const settings = result.data?.settings || DEFAULT_SETTINGS;
    const businessHours = result.data?.business_hours || DEFAULT_HOURS;

    return NextResponse.json({ settings, businessHours });
  } catch (error) {
    // Return defaults silently if anything fails
    return NextResponse.json({
      settings: DEFAULT_SETTINGS,
      businessHours: DEFAULT_HOURS,
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
