#!/usr/bin/env node
/**
 * Seed Homepage Content into CMS
 * Migrates hardcoded homepage sections to the cms_pages table
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, key);

// Homepage sections in order
const homepageSections = [
  {
    id: 'home-hero',
    type: 'hero',
    visible: true,
    content: {
      headline: "Oswego's Trusted Aesthetic Team",
      subheadline: "Medical Experts. Real Results.",
      subtext: "Botox • Fillers • Hormone Therapy • Weight Loss",
      cta_text: "Book Now",
      cta_url: "/book",
      cta_secondary_text: "Call Us",
      cta_secondary_url: "tel:630-636-6193",
      image_url: "/images/hero-banner.png",
    },
  },
  {
    id: 'home-geo-links',
    type: 'geo_links',
    visible: true,
    content: {
      title: "Serving the Fox Valley Area",
    },
  },
  {
    id: 'home-banner',
    type: 'promo_banner',
    visible: true,
    content: {
      headline: "New Client Special",
      subheadline: "FREE Vitamin B12 Shot with any service",
      cta_text: "Book Now",
      cta_url: "/book",
      background_color: "bg-gradient-to-r from-pink-500 to-rose-500",
    },
  },
  {
    id: 'home-mascots',
    type: 'mascots',
    visible: true,
    content: {
      title: "Meet Your Treatment Guides",
    },
  },
  {
    id: 'home-fix-bothers',
    type: 'fix_what_bothers_me',
    visible: true,
    content: {
      title: "Fix What Bothers You",
      subtitle: "Tell us what's on your mind and we'll match you with the perfect treatment",
    },
  },
  {
    id: 'home-quiz',
    type: 'quiz_cta',
    visible: true,
    content: {
      title: "Not Sure Where to Start?",
      subtitle: "Take our 60-second quiz to find your perfect treatment",
      cta_text: "Take the Quiz",
      cta_url: "/quiz",
    },
  },
  {
    id: 'home-hormone-tool',
    type: 'hormone_tool',
    visible: true,
    content: {
      title: "Hormone Lab Insight Tool",
    },
  },
  {
    id: 'home-providers',
    type: 'providers',
    visible: true,
    content: {
      title: "Meet Your Providers",
      subtitle: "Licensed medical professionals dedicated to your care",
    },
  },
  {
    id: 'home-offers',
    type: 'offers',
    visible: true,
    content: {
      title: "Current Offers",
    },
  },
  {
    id: 'home-membership',
    type: 'membership',
    visible: true,
    content: {
      title: "VIP Membership",
      subtitle: "Save 10% on everything, every visit",
    },
  },
  {
    id: 'home-tools',
    type: 'interactive_tools',
    visible: true,
    content: {
      title: "Plan Your Treatment",
    },
  },
  {
    id: 'home-care-team',
    type: 'care_team',
    visible: true,
    content: {
      title: "Your Care Team",
    },
  },
  {
    id: 'home-pharmacy',
    type: 'pharmacy',
    visible: true,
    content: {
      title: "Compounding Pharmacy Partner",
    },
  },
  {
    id: 'home-fullscript',
    type: 'fullscript',
    visible: true,
    content: {
      title: "Fullscript Supplements",
    },
  },
  {
    id: 'home-biote',
    type: 'biote',
    visible: true,
    content: {
      title: "Biote Hormone Therapy",
    },
  },
  {
    id: 'home-trigger-point',
    type: 'trigger_point',
    visible: true,
    content: {
      title: "Trigger Point Injections",
    },
  },
  {
    id: 'home-microneedling',
    type: 'microneedling',
    visible: true,
    content: {
      title: "RF Microneedling",
    },
  },
  {
    id: 'home-anteage',
    type: 'anteage',
    visible: true,
    content: {
      title: "AnteAGE Skincare",
    },
  },
  {
    id: 'home-laser',
    type: 'laser_hair',
    visible: true,
    content: {
      title: "Laser Hair Removal",
    },
  },
  {
    id: 'home-tiktok',
    type: 'tiktok',
    visible: true,
    content: {
      title: "Follow Us on TikTok",
    },
  },
  {
    id: 'home-testimonials',
    type: 'testimonials',
    visible: true,
    content: {
      title: "What Our Clients Say",
      show_rating: true,
    },
  },
  {
    id: 'home-immediate-care',
    type: 'immediate_care',
    visible: true,
    content: {
      title: "Need Care Today?",
      cta_text: "Book Same-Day",
      cta_url: "/book",
    },
  },
  {
    id: 'home-partners',
    type: 'partners',
    visible: true,
    content: {
      title: "Our Partners",
    },
  },
  {
    id: 'home-gallery',
    type: 'photo_gallery',
    visible: true,
    content: {
      title: "Our Space",
    },
  },
  {
    id: 'home-email',
    type: 'email_capture',
    visible: true,
    content: {
      title: "Stay in Touch",
      subtitle: "Get exclusive offers and updates",
    },
  },
  {
    id: 'home-map',
    type: 'location_map',
    visible: true,
    content: {
      title: "Visit Us",
      address: "74 W. Washington Street, Oswego, IL 60543",
      phone: "(630) 636-6193",
    },
  },
];

async function seedHomepage() {
  console.log('Seeding homepage into CMS...');

  // Check if homepage already exists
  const { data: existing } = await supabase
    .from('cms_pages')
    .select('id')
    .eq('slug', 'home')
    .single();

  if (existing) {
    console.log('Homepage already exists, updating...');
    
    const { error } = await supabase
      .from('cms_pages')
      .update({
        title: 'Home',
        sections: homepageSections,
        meta_title: 'Hello Gorgeous Med Spa | Botox, Fillers & Weight Loss',
        meta_description: 'Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more.',
        status: 'published',
        visibility: 'public',
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Update error:', error);
      process.exit(1);
    }
    console.log('Homepage updated!');
  } else {
    console.log('Creating homepage...');
    
    const { error } = await supabase
      .from('cms_pages')
      .insert({
        slug: 'home',
        title: 'Home',
        sections: homepageSections,
        meta_title: 'Hello Gorgeous Med Spa | Botox, Fillers & Weight Loss',
        meta_description: 'Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more.',
        status: 'published',
        visibility: 'public',
        template: 'default',
        no_index: false,
      });

    if (error) {
      console.error('Insert error:', error);
      process.exit(1);
    }
    console.log('Homepage created!');
  }

  // Now seed the navigation
  console.log('Updating navigation...');
  
  const mainNavItems = [
    { label: 'Services', href: '/services', type: 'dropdown' },
    { label: 'Providers', href: '/providers', type: 'dropdown' },
    { label: 'About', href: '/about', type: 'dropdown' },
    { label: 'Memberships', href: '/memberships', type: 'link' },
    { label: 'Specials', href: '/specials', type: 'dropdown', highlight: true },
    { label: 'Contact', href: '/contact', type: 'link' },
  ];

  const { data: navExists } = await supabase
    .from('cms_navigation')
    .select('id')
    .eq('location', 'header')
    .single();

  if (navExists) {
    await supabase
      .from('cms_navigation')
      .update({ items: mainNavItems, is_active: true })
      .eq('id', navExists.id);
  } else {
    await supabase
      .from('cms_navigation')
      .insert({ location: 'header', items: mainNavItems, is_active: true });
  }

  console.log('Done! Homepage and navigation seeded.');
}

seedHomepage().catch(console.error);
