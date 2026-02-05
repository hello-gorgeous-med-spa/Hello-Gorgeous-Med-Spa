// ============================================================
import { createClient } from '@supabase/supabase-js';
// API: FEATURE FLAGS - Kill Switches & Feature Toggles
// Owner can enable/disable features instantly
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) return null;
  try {
    // createClient imported at top
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  } catch { return null; }
}

// Default feature flags
const DEFAULT_FLAGS = [
  { key: 'online_booking', name: 'Online Booking', description: 'Allow clients to book online', is_enabled: true, category: 'booking' },
  { key: 'quick_sale', name: 'Quick Sale / POS', description: 'Point of sale for walk-ins', is_enabled: true, category: 'payments' },
  { key: 'memberships', name: 'Memberships', description: 'Membership program', is_enabled: true, category: 'billing' },
  { key: 'gift_cards', name: 'Gift Cards', description: 'Gift card sales', is_enabled: true, category: 'billing' },
  { key: 'sms_notifications', name: 'SMS Notifications', description: 'Send SMS reminders', is_enabled: true, category: 'notifications' },
  { key: 'email_notifications', name: 'Email Notifications', description: 'Send email confirmations', is_enabled: true, category: 'notifications' },
  { key: 'review_requests', name: 'Review Requests', description: 'Auto-request reviews', is_enabled: true, category: 'marketing' },
  { key: 'client_portal', name: 'Client Portal', description: 'Client self-service', is_enabled: true, category: 'client' },
  { key: 'provider_portal', name: 'Provider Portal', description: 'Provider clinical portal', is_enabled: true, category: 'clinical' },
  { key: 'charting', name: 'Clinical Charting', description: 'SOAP notes', is_enabled: true, category: 'clinical' },
  { key: 'photo_gallery', name: 'Photo Gallery', description: 'Before/after photos', is_enabled: true, category: 'clinical' },
  { key: 'inventory_tracking', name: 'Inventory Tracking', description: 'Track products & lots', is_enabled: true, category: 'inventory' },
  { key: 'consent_forms', name: 'Digital Consent Forms', description: 'Electronic signing', is_enabled: true, category: 'compliance' },
  { key: 'ai_features', name: 'AI Features', description: 'AI summaries & suggestions', is_enabled: false, category: 'experimental' },
  { key: 'sandbox_mode', name: 'Sandbox Mode', description: 'Test changes safely', is_enabled: false, category: 'system' },
];

export async function GET() {
  const supabase = getSupabase();
  
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('category');

      if (!error && data && data.length > 0) {
        return NextResponse.json({ flags: data, source: 'database' });
      }
    } catch (error) {
      console.log('Feature flags DB error:', error);
    }
  }

  return NextResponse.json({ flags: DEFAULT_FLAGS, source: 'defaults' });
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { key, is_enabled, name, description } = body;

    if (!key) {
      return NextResponse.json({ error: 'key required' }, { status: 400 });
    }

    if (supabase) {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (is_enabled !== undefined) updateData.is_enabled = is_enabled;
      if (name) updateData.name = name;
      if (description) updateData.description = description;

      const { data, error } = await supabase
        .from('feature_flags')
        .update(updateData)
        .eq('key', key)
        .select()
        .single();

      if (!error) {
        // Log the change
        await supabase.from('config_audit_log').insert({
          table_name: 'feature_flags',
          action: 'toggle',
          new_value: { key, is_enabled },
          description: `Feature "${key}" ${is_enabled ? 'enabled' : 'disabled'}`,
        });

        return NextResponse.json({ success: true, flag: data });
      }

      // If update failed, try insert (flag might not exist yet)
      if (error.code === 'PGRST116') {
        const { data: newFlag, error: insertError } = await supabase
          .from('feature_flags')
          .insert({ key, is_enabled, name: name || key, description })
          .select()
          .single();

        if (!insertError) {
          return NextResponse.json({ success: true, flag: newFlag, created: true });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      flag: { key, is_enabled },
      source: 'local' 
    });
  } catch (error: any) {
    console.error('Feature flag PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
