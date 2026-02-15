// ============================================================
// SEED ALL PAGES INTO CMS
// Gives owner full control over all website pages
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// All public pages that should be in the CMS
const ALL_PAGES = [
  // Main Pages
  { slug: 'home', title: 'Homepage', description: 'Main landing page', category: 'main' },
  { slug: 'about', title: 'About Us', description: 'About Hello Gorgeous Med Spa', category: 'main' },
  { slug: 'contact', title: 'Contact', description: 'Contact information and form', category: 'main' },
  { slug: 'services', title: 'Services', description: 'All services we offer', category: 'main' },
  { slug: 'providers', title: 'Providers', description: 'Meet our providers', category: 'main' },
  { slug: 'book', title: 'Book Appointment', description: 'Online booking page', category: 'main' },
  
  // Location Pages
  { slug: 'oswego-il', title: 'Oswego, IL', description: 'Oswego location page', category: 'locations' },
  { slug: 'naperville-il', title: 'Naperville, IL', description: 'Naperville area page', category: 'locations' },
  { slug: 'aurora-il', title: 'Aurora, IL', description: 'Aurora area page', category: 'locations' },
  { slug: 'plainfield-il', title: 'Plainfield, IL', description: 'Plainfield area page', category: 'locations' },
  { slug: 'locations', title: 'Locations', description: 'All locations', category: 'locations' },
  
  // Service Pages
  { slug: 'botox-calculator', title: 'Botox Calculator', description: 'Calculate your Botox needs', category: 'services' },
  { slug: 'botox-party', title: 'Botox Party', description: 'Host a Botox party', category: 'services' },
  { slug: 'lip-studio', title: 'Lip Studio', description: 'Lip filler services', category: 'services' },
  { slug: 'iv-therapy', title: 'IV Therapy', description: 'IV vitamin therapy', category: 'services' },
  { slug: 'peptides', title: 'Peptides', description: 'Peptide therapy', category: 'services' },
  { slug: 'telehealth', title: 'Telehealth', description: 'Virtual consultations', category: 'services' },
  { slug: 'virtual-consultation', title: 'Virtual Consultation', description: 'Book a virtual consult', category: 'services' },
  
  // Membership & Offers
  { slug: 'membership', title: 'Membership', description: 'VIP membership program', category: 'membership' },
  { slug: 'memberships', title: 'Memberships', description: 'Membership options', category: 'membership' },
  { slug: 'vip', title: 'VIP Program', description: 'VIP membership details', category: 'membership' },
  { slug: 'offers', title: 'Special Offers', description: 'Current promotions', category: 'membership' },
  { slug: 'financing', title: 'Financing', description: 'Payment options', category: 'membership' },
  { slug: 'free-vitamin', title: 'Free Vitamin', description: 'Free vitamin promo', category: 'membership' },
  
  // Educational / Trust Pages
  { slug: 'results', title: 'Results', description: 'Before & after gallery', category: 'trust' },
  { slug: 'reviews', title: 'Reviews', description: 'Client testimonials', category: 'trust' },
  { slug: 'meet-the-team', title: 'Meet the Team', description: 'Our team members', category: 'trust' },
  { slug: 'clinical-partners', title: 'Clinical Partners', description: 'Our clinical partners', category: 'trust' },
  { slug: 'pharmacy-partner', title: 'Pharmacy Partner', description: 'Our pharmacy partners', category: 'trust' },
  { slug: 'care-engine', title: 'Care Engine', description: 'Our care approach', category: 'trust' },
  { slug: 'community', title: 'Community', description: 'Community involvement', category: 'trust' },
  
  // Journey Pages
  { slug: 'your-journey', title: 'Your Journey', description: 'Client journey overview', category: 'journey' },
  { slug: 'explore-care', title: 'Explore Care', description: 'Explore our care options', category: 'journey' },
  { slug: 'fix-what-bothers-me', title: 'Fix What Bothers Me', description: 'Concern-based navigation', category: 'journey' },
  { slug: 'conditions', title: 'Conditions', description: 'Conditions we treat', category: 'journey' },
  { slug: 'understand-your-body', title: 'Understand Your Body', description: 'Educational content', category: 'journey' },
  { slug: 'care-and-support', title: 'Care & Support', description: 'Aftercare and support', category: 'journey' },
  { slug: 'quiz', title: 'Treatment Quiz', description: 'Find your treatment', category: 'journey' },
  
  // Engagement Pages  
  { slug: 'blog', title: 'Blog', description: 'News and articles', category: 'content' },
  { slug: 'shop', title: 'Shop', description: 'Products for sale', category: 'content' },
  { slug: 'referral', title: 'Referral Program', description: 'Refer a friend', category: 'content' },
  { slug: 'join', title: 'Join Us', description: 'Careers page', category: 'content' },
  { slug: 'waitlist', title: 'Waitlist', description: 'Join our waitlist', category: 'content' },
  { slug: 'subscribe', title: 'Subscribe', description: 'Newsletter signup', category: 'content' },
  { slug: 'get-app', title: 'Get the App', description: 'Download our app', category: 'content' },
  
  // Legal Pages
  { slug: 'privacy', title: 'Privacy Policy', description: 'Privacy policy', category: 'legal' },
  { slug: 'terms', title: 'Terms of Service', description: 'Terms and conditions', category: 'legal' },
  { slug: 'sms-opt-in', title: 'SMS Opt-In', description: 'SMS consent', category: 'legal' },
];

async function seedAllPages() {
  console.log('🚀 Seeding all pages into CMS...\n');
  
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const page of ALL_PAGES) {
    // Check if page already exists
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id, slug')
      .eq('slug', page.slug)
      .single();

    if (existing) {
      console.log(`⏭️  ${page.title} (/${page.slug}) - already exists`);
      skipped++;
      continue;
    }

    // Create the page with basic sections
    const sections = generateBasicSections(page);

    // Match actual table structure - NO description column
    const { data, error } = await supabase
      .from('cms_pages')
      .insert({
        slug: page.slug,
        title: page.title,
        status: 'published',
        visibility: 'public',
        template: page.category === 'legal' ? 'default' : 'landing',
        sections: sections,
        meta_title: `${page.title} | Hello Gorgeous Med Spa`,
        meta_description: page.description, // This goes in meta_description, not description
        schema_enabled: true,
        no_index: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`❌ Failed to create ${page.title}:`, error.message);
    } else {
      console.log(`✅ Created: ${page.title} (/${page.slug})`);
      created++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (existing): ${skipped}`);
  console.log(`   Total pages in CMS: ${created + skipped}`);
  console.log('\n✨ Done! You can now edit all pages from Admin → Website Control → Pages');
}

function generateBasicSections(page) {
  // Generate placeholder sections that can be edited in the CMS
  return [
    {
      id: `${page.slug}-hero`,
      type: 'hero',
      order: 1,
      visible: true,
      content: {
        headline: page.title,
        subheadline: page.description,
        cta_text: 'Book Now',
        cta_url: '/book',
      }
    },
    {
      id: `${page.slug}-content`,
      type: 'text',
      order: 2,
      visible: true,
      content: {
        title: 'About This Page',
        body: `This is the ${page.title} page. Edit this content from the admin panel.`,
      }
    },
    {
      id: `${page.slug}-cta`,
      type: 'cta',
      order: 3,
      visible: true,
      content: {
        headline: 'Ready to Get Started?',
        subheadline: 'Book your appointment today',
        button_text: 'Book Now',
        button_url: '/book',
      }
    }
  ];
}

seedAllPages().catch(console.error);
