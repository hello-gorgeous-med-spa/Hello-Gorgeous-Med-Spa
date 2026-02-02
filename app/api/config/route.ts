// ============================================================
// API: SYSTEM CONFIGURATION - Owner-Controlled Settings
// ALL business logic reads from here - NO HARDCODING
// ============================================================

import { NextRequest, NextResponse } from 'next/server';

// Helper to get Supabase client
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.includes('placeholder')) return null;
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  } catch {
    return null;
  }
}

// ============================================================
// DEFAULT CONFIGURATION (Used when DB not available)
// ============================================================

const DEFAULT_CONFIG = {
  business: {
    hours: {
      monday: { open: '09:00', close: '18:00', enabled: true },
      tuesday: { open: '09:00', close: '18:00', enabled: true },
      wednesday: { open: '09:00', close: '18:00', enabled: true },
      thursday: { open: '09:00', close: '18:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '10:00', close: '14:00', enabled: true },
      sunday: { open: null, close: null, enabled: false },
    },
    info: {
      name: 'Hello Gorgeous Med Spa',
      phone: '(555) 123-4567',
      email: 'hello@hellogorgeousmedspa.com',
      address: '123 Main Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
    },
  },
  booking: {
    rules: {
      min_advance_hours: 2,
      max_advance_days: 60,
      allow_same_day: true,
      require_deposit: false,
      deposit_percentage: 25,
      cancellation_hours: 24,
      cancellation_fee_percentage: 50,
      no_show_fee_percentage: 100,
      allow_online_booking: true,
      require_phone_verified: false,
      require_email_verified: false,
    },
  },
  scheduling: {
    buffers: {
      default_buffer_before: 0,
      default_buffer_after: 15,
      injectable_buffer_after: 15,
      consultation_buffer_after: 10,
      iv_therapy_buffer_after: 15,
    },
  },
  compliance: {
    consents: {
      require_hipaa: true,
      require_financial_policy: true,
      require_photo_release: false,
      consent_expiry_days: 365,
      allow_digital_signature: true,
    },
  },
  clinical: {
    charting: {
      require_soap_notes: true,
      require_lot_tracking_injectables: true,
      require_before_photos: false,
      require_after_photos: false,
      lock_chart_after_hours: 24,
      allow_addendum: true,
    },
  },
  payments: {
    settings: {
      accept_cash: true,
      accept_card: true,
      accept_financing: true,
      require_payment_before_service: false,
      auto_generate_receipt: true,
      send_receipt_email: true,
      send_receipt_sms: false,
    },
  },
  notifications: {
    settings: {
      send_booking_confirmation: true,
      send_24h_reminder: true,
      send_2h_reminder: true,
      send_follow_up: true,
      follow_up_delay_days: 14,
      send_review_request: true,
      review_request_delay_hours: 24,
    },
  },
};

const DEFAULT_FEATURE_FLAGS = {
  online_booking: true,
  quick_sale: true,
  memberships: true,
  gift_cards: true,
  sms_notifications: true,
  email_notifications: true,
  review_requests: true,
  client_portal: true,
  provider_portal: true,
  charting: true,
  photo_gallery: true,
  inventory_tracking: true,
  consent_forms: true,
  ai_features: false,
  sandbox_mode: false,
};

// In-memory cache for config (improves performance)
let configCache: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 30000; // 30 seconds

// GET - Fetch all configuration
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const key = searchParams.get('key');
  const includeFlags = searchParams.get('flags') !== 'false';

  // Try database first
  const supabase = getSupabase();
  
  if (supabase) {
    try {
      // Fetch system_config
      let configQuery = supabase.from('system_config').select('*');
      if (category) configQuery = configQuery.eq('category', category);
      if (key) configQuery = configQuery.eq('key', key);
      
      const { data: configData, error: configError } = await configQuery;
      
      // Fetch feature_flags
      const { data: flagsData, error: flagsError } = includeFlags 
        ? await supabase.from('feature_flags').select('*')
        : { data: null, error: null };

      // If tables exist and have data, use DB
      if (!configError && configData && configData.length > 0) {
        const config: any = {};
        for (const row of configData) {
          if (!config[row.category]) config[row.category] = {};
          config[row.category][row.key] = row.value;
        }

        const flags: any = {};
        if (flagsData) {
          for (const flag of flagsData) {
            flags[flag.key] = flag.is_enabled;
          }
        }

        return NextResponse.json({
          config,
          featureFlags: flags,
          source: 'database',
        });
      }
    } catch (error) {
      console.log('Config DB error, using defaults:', error);
    }
  }

  // Return defaults if DB not available
  return NextResponse.json({
    config: DEFAULT_CONFIG,
    featureFlags: DEFAULT_FEATURE_FLAGS,
    source: 'defaults',
  });
}

// PUT - Update configuration
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { category, key, value, description } = body;

    if (!category || !key) {
      return NextResponse.json({ error: 'category and key required' }, { status: 400 });
    }

    if (supabase) {
      // Try to upsert to database
      const { data, error } = await supabase
        .from('system_config')
        .upsert({
          category,
          key,
          value,
          description,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'category,key',
        })
        .select()
        .single();

      if (!error) {
        // Log the change
        await supabase.from('config_audit_log').insert({
          table_name: 'system_config',
          record_id: data.id,
          action: 'update',
          new_value: { category, key, value },
          description: `Updated ${category}.${key}`,
        });

        return NextResponse.json({ success: true, config: data, source: 'database' });
      }
    }

    // If DB fails, still return success (will work via localStorage on frontend)
    return NextResponse.json({ 
      success: true, 
      config: { category, key, value },
      source: 'local',
      message: 'Saved locally. Run migration to enable database persistence.'
    });
  } catch (error: any) {
    console.error('Config PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Batch update configuration
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  
  try {
    const body = await request.json();
    const { configs } = body; // Array of { category, key, value }

    if (!Array.isArray(configs)) {
      return NextResponse.json({ error: 'configs array required' }, { status: 400 });
    }

    const results = [];

    for (const config of configs) {
      const { category, key, value } = config;
      
      if (supabase) {
        const { error } = await supabase
          .from('system_config')
          .upsert({
            category,
            key,
            value,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'category,key',
          });

        results.push({ category, key, success: !error });
      } else {
        results.push({ category, key, success: true, source: 'local' });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error('Config POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
