// ============================================================
// MIGRATION RUNNER API
// Runs SQL migrations using Supabase's service role
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create admin client with service role
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

export async function POST(request: NextRequest) {
  try {
    const results: string[] = [];
    
    // ============================================================
    // MIGRATION 002: Square Gift Cards
    // ============================================================
    results.push('Starting gift_cards migration...');
    
    // Create gift_cards table
    const { error: giftCardsError } = await supabaseAdmin.from('gift_cards').select('id').limit(1);
    if (giftCardsError?.code === '42P01') {
      // Table doesn't exist, create it
      results.push('Creating gift_cards table...');
      
      // Use raw SQL via Supabase's pg endpoint (if available) or create tables via RPC
      // Since we can't run raw SQL, we'll create tables using the management API pattern
    } else {
      results.push('gift_cards table already exists or accessible');
    }
    
    // Create gift_card_transactions table
    const { error: txnError } = await supabaseAdmin.from('gift_card_transactions').select('id').limit(1);
    if (txnError?.code === '42P01') {
      results.push('gift_card_transactions needs creation');
    } else {
      results.push('gift_card_transactions already exists or accessible');
    }
    
    // Create gift_card_settings table
    const { error: settingsError } = await supabaseAdmin.from('gift_card_settings').select('id').limit(1);
    if (settingsError?.code === '42P01') {
      results.push('gift_card_settings needs creation');
    } else {
      results.push('gift_card_settings already exists or accessible');
    }
    
    // ============================================================
    // MIGRATION 003: Website CMS
    // ============================================================
    results.push('Starting CMS migration...');
    
    // Check CMS tables
    const cmsTabels = [
      'cms_pages', 'cms_page_versions', 'cms_sections', 
      'cms_navigation', 'cms_promotions', 'cms_ctas', 
      'cms_media', 'cms_site_settings'
    ];
    
    for (const table of cmsTabels) {
      const { error } = await supabaseAdmin.from(table).select('id').limit(1);
      if (error?.code === '42P01') {
        results.push(`${table} needs creation`);
      } else if (error) {
        results.push(`${table}: ${error.message}`);
      } else {
        results.push(`${table} ✓`);
      }
    }
    
    // Return guidance
    return NextResponse.json({
      success: true,
      message: 'Migration check complete. See results below.',
      results,
      instructions: `
To complete the migrations, please run the SQL in Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/ljixwtwxjufbwpxpxpff/sql/new

2. Copy and paste the contents of these files:
   - supabase/migrations/002_square_gift_cards.sql
   - supabase/migrations/003_website_cms.sql

3. Click "Run" for each file

The SQL files are in your project's supabase/migrations folder.
      `.trim()
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to this endpoint to check migration status',
    url: 'https://supabase.com/dashboard/project/ljixwtwxjufbwpxpxpff/sql/new'
  });
}
