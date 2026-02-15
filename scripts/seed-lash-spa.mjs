#!/usr/bin/env node
/**
 * Seed Lash Spa service for online booking
 * Run: node scripts/seed-lash-spa.mjs
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';

const DANIELLE_ID = 'b7e6f872-3628-418a-aefb-aca2101f7cb2';
const LASH_CAT_ID = '11111111-1111-1111-1111-111111111009';
const LASH_SERVICE_ID = '33333333-3333-3333-3333-333333333001';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log('Seeding Lash Spa service...');

  // 1. Ensure category exists
  const { data: existingCat } = await supabase
    .from('service_categories')
    .select('id')
    .eq('slug', 'lash-spa')
    .single();

  if (!existingCat) {
    const { error: catErr } = await supabase.from('service_categories').insert({
      id: LASH_CAT_ID,
      name: 'Lash Spa',
      slug: 'lash-spa',
      display_order: 9,
      is_active: true,
    });
    if (catErr) {
      console.error('Category insert error:', catErr);
      process.exit(1);
    }
    console.log('Created Lash Spa category');
  } else {
    console.log('Lash Spa category exists');
  }

  // 2. Check if service exists
  const { data: existing } = await supabase
    .from('services')
    .select('id, provider_ids')
    .eq('slug', 'lash-spa')
    .single();

  if (existing) {
    const { error: updErr } = await supabase
      .from('services')
      .update({
        provider_ids: [DANIELLE_ID],
        allow_online_booking: true,
        is_active: true,
      })
      .eq('slug', 'lash-spa');
    if (updErr) console.warn('Update warning:', updErr);
    else console.log('Updated existing Lash Spa service (Danielle only)');
  } else {
    const { error: svcErr } = await supabase.from('services').insert({
      id: LASH_SERVICE_ID,
      category_id: LASH_CAT_ID,
      name: 'Lash Spa',
      slug: 'lash-spa',
      short_description: 'Full set, fill, lash perm & tint, mini fill.',
      price_cents: 15000,
      price_display: '$150',
      price_type: 'fixed',
      duration_minutes: 60,
      allow_online_booking: true,
      is_active: true,
      provider_ids: [DANIELLE_ID],
    });
    if (svcErr) {
      console.error('Service insert error:', svcErr);
      process.exit(1);
    }
    console.log('Created Lash Spa service');
  }

  console.log('Done! Clients can now book at /book/lash-spa → Danielle only.');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
