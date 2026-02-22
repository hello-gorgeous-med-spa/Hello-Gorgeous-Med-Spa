#!/usr/bin/env node

/**
 * SEED PROVIDER MEDIA
 * 
 * Seeds the provider_media table with initial video entries.
 * Videos need to be uploaded to a CDN first, then URLs added here.
 * 
 * Usage: node scripts/seed-provider-media.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Provider IDs (will need to be fetched or set correctly)
const DANIELLE_ID = 'a8f2e9d1-4b7c-4e5a-9f3d-2c1b8a7e6f5d';
const RYAN_ID = 'b7e6f872-3628-418a-aefb-aca2101f7cb2';

// Sample media entries
// Replace VIDEO_URL placeholders with actual CDN URLs after uploading
const SAMPLE_MEDIA = [
  // Danielle's videos
  {
    provider_id: DANIELLE_ID,
    type: 'video',
    title: 'Meet Danielle - Owner & Lead Injector',
    description: 'Get to know Danielle and her approach to aesthetic medicine.',
    video_url: 'REPLACE_WITH_CDN_URL', // IMG_3288.MOV
    video_orientation: 'vertical',
    service_tag: null,
    is_featured: true,
    consent_confirmed: true,
    is_active: true,
    display_order: 1,
  },
  {
    provider_id: DANIELLE_ID,
    type: 'video',
    title: 'Lip Filler Treatment Process',
    description: 'Watch how Danielle performs natural-looking lip filler.',
    video_url: 'REPLACE_WITH_CDN_URL', // IMG_3290.MOV
    video_orientation: 'vertical',
    service_tag: 'lip_filler',
    is_featured: true,
    consent_confirmed: true,
    is_active: true,
    display_order: 2,
  },
  {
    provider_id: DANIELLE_ID,
    type: 'video',
    title: 'Botox Injection Technique',
    description: 'Learn about our precise Botox injection technique.',
    video_url: 'REPLACE_WITH_CDN_URL', // IMG_3049 3.MOV
    video_orientation: 'vertical',
    service_tag: 'botox',
    is_featured: false,
    consent_confirmed: true,
    is_active: true,
    display_order: 3,
  },
  {
    provider_id: DANIELLE_ID,
    type: 'video',
    title: 'Treatment Room Tour',
    description: 'Take a virtual tour of our treatment rooms.',
    video_url: 'REPLACE_WITH_CDN_URL', // IMG_3059 2.MOV
    video_orientation: 'vertical',
    service_tag: null,
    is_featured: false,
    consent_confirmed: true,
    is_active: true,
    display_order: 4,
  },
  // Ryan's videos
  {
    provider_id: RYAN_ID,
    type: 'intro_video',
    title: 'Meet Ryan - Medical Director',
    description: 'Get to know Ryan and his approach to weight loss and hormone therapy.',
    video_url: 'REPLACE_WITH_CDN_URL',
    video_orientation: 'horizontal',
    service_tag: null,
    is_featured: true,
    consent_confirmed: true,
    is_active: true,
    display_order: 1,
  },
  {
    provider_id: RYAN_ID,
    type: 'video',
    title: 'Weight Loss Program Overview',
    description: 'Learn about our GLP-1 weight loss program.',
    video_url: 'REPLACE_WITH_CDN_URL',
    video_orientation: 'horizontal',
    service_tag: 'weight_loss',
    is_featured: true,
    consent_confirmed: true,
    is_active: true,
    display_order: 2,
  },
];

async function seedProviderMedia() {
  console.log('🎬 Seeding provider media...\n');

  // First, ensure providers exist
  const { data: existingProviders, error: providerError } = await supabase
    .from('providers')
    .select('id, slug');

  if (providerError) {
    console.error('Error checking providers:', providerError);
    return;
  }

  if (!existingProviders || existingProviders.length === 0) {
    console.log('⚠️  No providers found. Seeding default providers first...\n');
    
    // Seed default providers
    const defaultProviders = [
      {
        id: DANIELLE_ID,
        first_name: 'Danielle',
        last_name: 'Glazier-Alcala',
        slug: 'danielle',
        title: 'Owner & Nurse Practitioner',
        credentials: 'FNP-BC',
        bio: 'Danielle is the founder and lead aesthetic injector at Hello Gorgeous Med Spa. With years of experience in medical aesthetics, she specializes in creating natural, beautiful results that enhance each client\'s unique features.',
        philosophy: 'I believe in enhancing your natural beauty, not changing who you are. Every treatment is customized to your unique features and goals.',
        headshot_url: '/images/team/danielle-glazier-alcala.jpg',
        booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/1',
        is_active: true,
        display_order: 1,
      },
      {
        id: RYAN_ID,
        first_name: 'Ryan',
        last_name: 'Kent',
        slug: 'ryan',
        title: 'Medical Director & Nurse Practitioner',
        credentials: 'FNP-C',
        bio: 'Ryan brings extensive medical experience to Hello Gorgeous Med Spa, specializing in weight loss management and hormone optimization.',
        philosophy: 'Healthcare should be personalized and accessible. I work with each patient to develop a treatment plan that fits their lifestyle and goals.',
        headshot_url: '/images/team/ryan-kent.jpg',
        booking_url: 'https://hellogorgeousmedspa.janeapp.com/staff_members/2',
        is_active: true,
        display_order: 2,
      },
    ];

    for (const provider of defaultProviders) {
      const { error } = await supabase
        .from('providers')
        .upsert(provider, { onConflict: 'slug' });
      
      if (error) {
        console.log(`  ⚠️  Provider ${provider.first_name}: ${error.message}`);
      } else {
        console.log(`  ✅ Provider seeded: ${provider.first_name}`);
      }
    }
    console.log('');
  }

  // Check which media already exists
  const { data: existingMedia } = await supabase
    .from('provider_media')
    .select('id, title');

  const existingTitles = new Set((existingMedia || []).map(m => m.title));

  // Only seed media with valid URLs
  const mediaToSeed = SAMPLE_MEDIA.filter(
    m => m.video_url && m.video_url !== 'REPLACE_WITH_CDN_URL' && !existingTitles.has(m.title)
  );

  if (mediaToSeed.length === 0) {
    console.log('ℹ️  No new media to seed.');
    console.log('');
    console.log('To add videos:');
    console.log('1. Upload videos to a CDN (Vercel Blob, Cloudflare R2, AWS S3)');
    console.log('2. Replace REPLACE_WITH_CDN_URL with actual URLs in this script');
    console.log('3. Run this script again');
    console.log('');
    console.log('OR use the Admin panel:');
    console.log('Admin → Content → Providers → Upload Media');
    return;
  }

  let success = 0;
  let errors = 0;

  for (const media of mediaToSeed) {
    const { error } = await supabase
      .from('provider_media')
      .insert(media);

    if (error) {
      console.log(`  ❌ ${media.title}: ${error.message}`);
      errors++;
    } else {
      console.log(`  ✅ ${media.title}`);
      success++;
    }
  }

  console.log(`\n✨ Media seeding complete: ${success} added, ${errors} errors`);
}

seedProviderMedia().catch(console.error);
