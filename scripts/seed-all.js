#!/usr/bin/env node

/**
 * HELLO GORGEOUS OS - Data Seeding Script
 * 
 * This script seeds:
 * 1. Service categories and services
 * 2. Imports clients from Fresha export
 * 
 * Usage: node scripts/seed-all.js
 */

const { createClient } = require('@supabase/supabase-js');
const XLSX = require('xlsx');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey === 'placeholder-service-role-key') {
  console.error('❌ Missing Supabase credentials. Check .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================================
// SERVICE CATEGORIES
// ============================================================

const SERVICE_CATEGORIES = [
  { name: 'Bioidentical Hormone Therapy', slug: 'bhrt', description: 'BioTE hormone optimization', icon: '⚖️', display_order: 1 },
  { name: 'Weight Loss Program', slug: 'weight-loss', description: 'GLP-1 and metabolic treatments', icon: '⚡', display_order: 2 },
  { name: 'Botox & Neuromodulators', slug: 'botox', description: 'Wrinkle relaxing injections', icon: '💉', display_order: 3 },
  { name: 'Dermal Fillers', slug: 'fillers', description: 'Volume and contouring', icon: '💋', display_order: 4 },
  { name: 'Skin Regeneration', slug: 'anteage', description: 'AnteAGE stem cell treatments', icon: '🧬', display_order: 5 },
  { name: 'Facials & Skin Spa', slug: 'facials', description: 'Hydrafacials, peels, dermaplaning', icon: '✨', display_order: 6 },
  { name: 'PRP & PRF Treatments', slug: 'prp', description: 'Platelet-rich plasma therapy', icon: '🩸', display_order: 7 },
  { name: 'IV Therapy & Vitamins', slug: 'iv-therapy', description: 'IV drips and vitamin injections', icon: '💧', display_order: 8 },
  { name: 'Lash Services', slug: 'lash', description: 'Extensions, lifts, and fills', icon: '👁️', display_order: 9 },
  { name: 'Brow Services', slug: 'brow', description: 'Shaping, lamination, henna', icon: '🤨', display_order: 10 },
  { name: 'Laser Hair Removal', slug: 'laser-hair', description: 'Permanent hair reduction', icon: '⚡', display_order: 11 },
  { name: 'Medical Consultations', slug: 'consultations', description: 'Evaluations and planning', icon: '🩺', display_order: 12 },
];

// ============================================================
// SERVICES (Condensed list - key services)
// ============================================================

const SERVICES = [
  // BHRT
  { category_slug: 'bhrt', name: 'BioTE Pellet Therapy - Women', slug: 'pellet-therapy-women', price_cents: 65000, price_display: '$650', duration_minutes: 60, requires_intake: true, requires_consent: true, is_featured: true, primary_persona_id: 'harmony' },
  { category_slug: 'bhrt', name: 'BioTE Pellet Therapy - Men', slug: 'pellet-therapy-men', price_cents: 90000, price_display: '$900', duration_minutes: 60, requires_intake: true, requires_consent: true, is_featured: true, primary_persona_id: 'harmony' },
  { category_slug: 'bhrt', name: 'Hormone Panel Labs', slug: 'hormone-panel-labs', price_cents: 24900, price_display: '$249', duration_minutes: 30, requires_intake: true },
  
  // Weight Loss
  { category_slug: 'weight-loss', name: 'Semaglutide (Wegovy/Ozempic)', slug: 'semaglutide', price_cents: 40000, price_display: 'From $400', price_type: 'starting_at', duration_minutes: 15, requires_consult: true, requires_intake: true, is_featured: true, primary_persona_id: 'ryan' },
  { category_slug: 'weight-loss', name: 'Tirzepatide (Zepbound/Mounjaro)', slug: 'tirzepatide', price_cents: 45000, price_display: 'From $450', price_type: 'starting_at', duration_minutes: 15, requires_consult: true, requires_intake: true, is_featured: true, primary_persona_id: 'ryan' },
  { category_slug: 'weight-loss', name: 'Retatrutide GLP-1', slug: 'retatrutide', price_cents: 55000, price_display: 'From $550', price_type: 'starting_at', duration_minutes: 20, requires_consult: true, requires_intake: true, is_featured: true, primary_persona_id: 'ryan' },
  
  // Botox
  { category_slug: 'botox', name: 'Botox/Dysport/Jeuveau', slug: 'botox-per-unit', price_cents: 1200, price_display: '$12/unit', price_type: 'per_unit', duration_minutes: 30, requires_intake: true, requires_consent: true, is_featured: true, primary_persona_id: 'beau-tox' },
  { category_slug: 'botox', name: 'Botox - New Client Special', slug: 'botox-new-client', price_cents: 1000, price_display: '$10/unit', price_type: 'per_unit', duration_minutes: 30, requires_intake: true, requires_consent: true, is_featured: true, primary_persona_id: 'beau-tox' },
  { category_slug: 'botox', name: 'Lip Flip', slug: 'lip-flip', price_cents: 9900, price_display: '$99', duration_minutes: 30, requires_intake: true, primary_persona_id: 'beau-tox' },
  
  // Fillers
  { category_slug: 'fillers', name: 'Dermal Filler - Per Syringe', slug: 'filler-syringe', price_cents: 59900, price_display: '$599', duration_minutes: 60, deposit_required: true, deposit_amount_cents: 10000, requires_intake: true, requires_consent: true, is_featured: true, minimum_age: 22, primary_persona_id: 'filla-grace' },
  { category_slug: 'fillers', name: 'Filler - 2 Syringe Special', slug: 'filler-2-syringe', price_cents: 89800, price_display: '$898', duration_minutes: 60, deposit_required: true, deposit_amount_cents: 15000, requires_intake: true, requires_consent: true, minimum_age: 22, primary_persona_id: 'filla-grace' },
  
  // AnteAGE
  { category_slug: 'anteage', name: 'Microneedling with Exosomes', slug: 'microneedling-exosomes', price_cents: 49900, price_display: '$499', duration_minutes: 45, deposit_required: true, deposit_amount_cents: 10000, requires_intake: true, is_featured: true, primary_persona_id: 'peppi' },
  { category_slug: 'anteage', name: 'Microneedling with Growth Factors', slug: 'microneedling-growth-factors', price_cents: 39900, price_display: '$399', duration_minutes: 45, requires_intake: true, primary_persona_id: 'peppi' },
  { category_slug: 'anteage', name: 'Hair Restoration - Exosomes', slug: 'hair-restoration-exosomes', price_cents: 49900, price_display: '$499', duration_minutes: 45, deposit_required: true, deposit_amount_cents: 10000, requires_intake: true, is_featured: true, primary_persona_id: 'peppi' },
  
  // Facials
  { category_slug: 'facials', name: 'Glass Glow Facial (Signature)', slug: 'glass-glow-facial', price_cents: 34900, price_display: '$349', duration_minutes: 60, deposit_required: true, deposit_amount_cents: 7500, is_featured: true },
  { category_slug: 'facials', name: 'Dermaplaning Facial', slug: 'dermaplaning', price_cents: 7500, price_display: '$75', duration_minutes: 60, is_featured: true },
  { category_slug: 'facials', name: 'IPL Photofacial', slug: 'ipl-photofacial', price_cents: 16900, price_display: '$169', duration_minutes: 30, requires_intake: true },
  { category_slug: 'facials', name: 'Hydra Peel Facial', slug: 'hydra-peel', price_cents: 7500, price_display: '$75', duration_minutes: 45 },
  { category_slug: 'facials', name: 'Chemical Peel', slug: 'chemical-peel', price_cents: 8000, price_display: '$80', duration_minutes: 45, requires_intake: true },
  
  // PRP
  { category_slug: 'prp', name: 'PRP Vampire Facial', slug: 'prp-vampire-facial', price_cents: 29900, price_display: '$299', duration_minutes: 60, deposit_required: true, deposit_amount_cents: 7500, requires_intake: true, is_featured: true },
  { category_slug: 'prp', name: 'PRF Hair Restoration', slug: 'prf-hair', price_cents: 39800, price_display: '$398', duration_minutes: 60, deposit_required: true, deposit_amount_cents: 10000, requires_intake: true },
  
  // IV Therapy
  { category_slug: 'iv-therapy', name: 'Vitamin Injection', slug: 'vitamin-injection', price_cents: 2500, price_display: '$25', duration_minutes: 10 },
  { category_slug: 'iv-therapy', name: 'Myers Cocktail IV', slug: 'myers-cocktail', price_cents: 19900, price_display: '$199', duration_minutes: 60, requires_intake: true, is_featured: true },
  { category_slug: 'iv-therapy', name: 'Beauty IV', slug: 'beauty-iv', price_cents: 18900, price_display: '$189', duration_minutes: 60, requires_intake: true },
  { category_slug: 'iv-therapy', name: 'Reboot (Hangover) IV', slug: 'reboot-iv', price_cents: 14900, price_display: '$149', duration_minutes: 60, requires_intake: true },
  
  // Lash
  { category_slug: 'lash', name: 'Classic Lash Full Set', slug: 'lash-classic-full', price_cents: 12000, price_display: '$120', duration_minutes: 90, deposit_required: true, deposit_amount_cents: 2500 },
  { category_slug: 'lash', name: 'Hybrid Lash Full Set', slug: 'lash-hybrid-full', price_cents: 15000, price_display: '$150', duration_minutes: 90, deposit_required: true, deposit_amount_cents: 2500 },
  { category_slug: 'lash', name: 'Lash Lift with Tint', slug: 'lash-lift-tint', price_cents: 7500, price_display: '$75', duration_minutes: 60 },
  
  // Brow
  { category_slug: 'brow', name: 'Brow Shaping & Wax', slug: 'brow-wax', price_cents: 2000, price_display: '$20', duration_minutes: 15 },
  { category_slug: 'brow', name: 'Brow Lamination with Tint', slug: 'brow-lamination', price_cents: 8500, price_display: '$85', duration_minutes: 60 },
  
  // Laser
  { category_slug: 'laser-hair', name: 'Laser - Brazilian', slug: 'laser-brazilian', price_cents: 12900, price_display: '$129', duration_minutes: 30, requires_intake: true, requires_consent: true },
  { category_slug: 'laser-hair', name: 'Laser - Underarm', slug: 'laser-underarm', price_cents: 7900, price_display: '$79', duration_minutes: 15, requires_intake: true, requires_consent: true },
  { category_slug: 'laser-hair', name: 'Laser - Upper Lip/Chin', slug: 'laser-lip-chin', price_cents: 5900, price_display: '$59', duration_minutes: 15, requires_intake: true, requires_consent: true },
  
  // Consultations
  { category_slug: 'consultations', name: 'Free Consultation', slug: 'free-consultation', price_cents: 0, price_display: 'FREE', duration_minutes: 15 },
  { category_slug: 'consultations', name: 'Medical Visit - Ryan Kent', slug: 'medical-visit-ryan', price_cents: 4900, price_display: '$49', duration_minutes: 15, requires_intake: true, primary_persona_id: 'ryan' },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function normalizePhone(phone) {
  if (!phone || typeof phone !== 'string') return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

function normalizeEmail(email) {
  if (!email || typeof email !== 'string') return null;
  const trimmed = email.toLowerCase().trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  return trimmed;
}

function excelDateToJSDate(excelDate) {
  if (!excelDate || isNaN(excelDate)) return null;
  const excelEpoch = new Date(1899, 11, 30);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + excelDate * msPerDay);
}

function mapReferralSource(source) {
  const mapping = {
    'Book Now Link': 'website',
    'Walk-In': 'walk_in',
    'Fresha Marketplace': 'fresha_marketplace',
    'Facebook': 'facebook',
    'Instagram': 'instagram',
    'Google': 'google',
    'Referral': 'referral',
  };
  return mapping[source] || 'unknown';
}

// ============================================================
// SEED SERVICES
// ============================================================

async function seedServices() {
  console.log('\n📦 Seeding services...\n');
  
  // Get existing categories
  const { data: existingCats } = await supabase
    .from('service_categories')
    .select('id, slug');
  
  const categoryMap = {};
  (existingCats || []).forEach(c => {
    categoryMap[c.slug] = c.id;
  });
  
  // Insert any missing categories
  for (const cat of SERVICE_CATEGORIES) {
    if (!categoryMap[cat.slug]) {
      const { data, error } = await supabase
        .from('service_categories')
        .insert(cat)
        .select('id, slug')
        .single();
      
      if (data) {
        categoryMap[cat.slug] = data.id;
        console.log(`  ✅ Created category: ${cat.name}`);
      } else if (error) {
        console.log(`  ⚠️ Category ${cat.slug}: ${error.message}`);
      }
    }
  }
  
  // Insert services
  let inserted = 0;
  let errors = 0;
  
  for (const svc of SERVICES) {
    const categoryId = categoryMap[svc.category_slug];
    
    const serviceData = {
      category_id: categoryId,
      name: svc.name,
      slug: svc.slug,
      price_cents: svc.price_cents,
      price_display: svc.price_display,
      price_type: svc.price_type || 'fixed',
      duration_minutes: svc.duration_minutes,
      deposit_required: svc.deposit_required || false,
      deposit_amount_cents: svc.deposit_amount_cents || null,
      requires_consult: svc.requires_consult || false,
      requires_intake: svc.requires_intake || false,
      requires_consent: svc.requires_consent || false,
      minimum_age: svc.minimum_age || null,
      is_featured: svc.is_featured || false,
      primary_persona_id: svc.primary_persona_id || null,
      is_active: true,
      allow_online_booking: true,
    };
    
    const { error } = await supabase
      .from('services')
      .upsert(serviceData, { onConflict: 'slug' });
    
    if (error) {
      console.log(`  ❌ ${svc.name}: ${error.message}`);
      errors++;
    } else {
      inserted++;
    }
  }
  
  console.log(`\n✅ Services: ${inserted} inserted, ${errors} errors`);
}

// ============================================================
// IMPORT CLIENTS
// ============================================================

async function importClients() {
  console.log('\n👥 Importing Fresha clients...\n');
  
  // Try to find the Fresha export file
  const possiblePaths = [
    '/Users/danid/Desktop/export_customer_list_2026-01-30.xlsx',
    path.join(process.cwd(), 'export_customer_list_2026-01-30.xlsx'),
  ];
  
  let workbook;
  let filePath;
  
  for (const p of possiblePaths) {
    try {
      workbook = XLSX.readFile(p);
      filePath = p;
      break;
    } catch (e) {
      // Try next path
    }
  }
  
  if (!workbook) {
    console.log('  ⚠️ Fresha export file not found. Skipping client import.');
    console.log('     Expected at: /Users/danid/Desktop/export_customer_list_2026-01-30.xlsx');
    return;
  }
  
  console.log(`  📄 Found: ${filePath}`);
  
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const clients = XLSX.utils.sheet_to_json(sheet);
  
  console.log(`  📊 Total records: ${clients.length}`);
  
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process in batches
  const batchSize = 100;
  
  for (let i = 0; i < clients.length; i += batchSize) {
    const batch = clients.slice(i, i + batchSize);
    
    for (const row of batch) {
      const email = normalizeEmail(row['Email']);
      const phone = normalizePhone(row['Mobile Number']) || normalizePhone(row['Telephone']);
      
      if (!email && !phone) {
        skipped++;
        continue;
      }
      
      try {
        // Create user
        const userEmail = email || `fresha_${row['Client ID']}@placeholder.hgos`;
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .upsert({
            email: userEmail,
            phone: phone,
            first_name: row['First Name']?.trim() || 'Unknown',
            last_name: row['Last Name']?.trim() || '',
            role: 'client',
            is_active: row['Blocked'] !== 'Yes',
          }, { onConflict: 'email' })
          .select('id')
          .single();
        
        if (userError) {
          errors++;
          continue;
        }
        
        // Parse DOB
        let dob = null;
        if (row['Date of Birth']) {
          if (typeof row['Date of Birth'] === 'number') {
            const date = excelDateToJSDate(row['Date of Birth']);
            dob = date ? date.toISOString().split('T')[0] : null;
          } else {
            dob = row['Date of Birth'];
          }
        }
        
        // Create client
        const { error: clientError } = await supabase
          .from('clients')
          .upsert({
            user_id: userData.id,
            fresha_client_id: row['Client ID']?.toString(),
            date_of_birth: dob,
            gender: row['Gender']?.trim() || null,
            accepts_email_marketing: row['Accepts Marketing'] === 'Yes',
            accepts_sms_marketing: row['Accepts SMS Marketing'] === 'Yes',
            city: row['City']?.trim() || null,
            state: row['State']?.trim() || null,
            postal_code: row['Post Code']?.trim() || null,
            is_new_client: false,
            is_blocked: row['Blocked'] === 'Yes',
            block_reason: row['Block Reason']?.trim() || null,
            referral_source: mapReferralSource(row['Referral Source']),
            internal_notes: row['Note']?.trim() || null,
          }, { onConflict: 'user_id' });
        
        if (clientError) {
          errors++;
        } else {
          imported++;
        }
      } catch (err) {
        errors++;
      }
    }
    
    // Progress update
    const progress = Math.min(i + batchSize, clients.length);
    process.stdout.write(`\r  Progress: ${progress}/${clients.length} (${imported} imported, ${skipped} skipped, ${errors} errors)`);
  }
  
  console.log(`\n\n✅ Clients: ${imported} imported, ${skipped} skipped, ${errors} errors`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('🚀 Hello Gorgeous OS - Data Seeding');
  console.log('====================================');
  
  try {
    await seedServices();
    await importClients();
    
    console.log('\n====================================');
    console.log('✨ Seeding complete!');
    console.log('====================================\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
