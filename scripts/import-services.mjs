#!/usr/bin/env node
// ============================================================
// FRESHA SERVICE IMPORT SCRIPT
// Imports services from Fresha CSV export to Supabase
//
// Usage:
//   1. Create .env.local with SUPABASE credentials
//   2. Run: node scripts/import-services.mjs [csv-path]
// ============================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Supabase credentials from environment
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate credentials
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

if (SUPABASE_SERVICE_KEY.includes('placeholder')) {
  console.error('❌ Supabase service key appears to be a placeholder!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// CSV file path - can be overridden via command line argument
const csvPath = process.argv[2] || '/Users/danid/Downloads/export_service_list_2026-01-31.csv';

// Verify file exists
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  console.error('   Usage: node scripts/import-services.mjs [path-to-csv]');
  process.exit(1);
}

// Parse CSV with quoted fields (handles multi-line descriptions)
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let headers = null;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      
      if (!headers) {
        headers = currentRow;
      } else if (currentRow.length > 1 && currentRow[0]) {
        const row = {};
        headers.forEach((h, idx) => {
          row[h] = currentRow[idx] || '';
        });
        rows.push(row);
      }
      
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  // Handle last row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (headers && currentRow.length > 1 && currentRow[0]) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = currentRow[idx] || '';
      });
      rows.push(row);
    }
  }

  return rows;
}

// Parse duration string to minutes
function parseDuration(duration) {
  if (!duration) return 30;
  
  let minutes = 0;
  const hourMatch = duration.match(/(\d+)\s*h/);
  const minMatch = duration.match(/(\d+)\s*m/);
  
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minMatch) minutes += parseInt(minMatch[1]);
  
  return minutes || 30;
}

// Create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 90);
}

// Main import function
async function importServices() {
  console.log('📂 Reading CSV file...');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  
  console.log(`📊 Found ${rows.length} services to import\n`);
  
  // First, get existing categories
  const { data: existingCategories } = await supabase
    .from('service_categories')
    .select('id, name, slug');
  
  const categoryMap = new Map();
  existingCategories?.forEach(c => categoryMap.set(c.name, c.id));
  
  let imported = 0;
  let errors = [];
  const seenSlugs = new Set();
  
  for (const row of rows) {
    const serviceName = row['Service Name']?.trim();
    if (!serviceName) continue;
    
    const categoryName = row['Category Name']?.trim();
    const price = parseFloat(row['Retail Price']?.replace(/[^0-9.]/g, '') || '0');
    const duration = parseDuration(row['Duration']);
    const description = row['Description']?.trim();
    const onlineBooking = row['Online Booking'] === 'Enabled';
    const freshaId = row['Service ID']?.trim();
    
    // Create or get category
    let categoryId = categoryMap.get(categoryName);
    if (!categoryId && categoryName) {
      const categorySlug = createSlug(categoryName);
      const { data: newCat, error: catError } = await supabase
        .from('service_categories')
        .upsert({
          name: categoryName,
          slug: categorySlug,
          is_active: true,
        }, { onConflict: 'slug' })
        .select('id')
        .single();
      
      if (newCat) {
        categoryId = newCat.id;
        categoryMap.set(categoryName, categoryId);
      }
    }
    
    // Create unique slug
    let baseSlug = createSlug(serviceName);
    let slug = baseSlug;
    let counter = 1;
    while (seenSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    seenSlugs.add(slug);
    
    try {
      const { error: serviceError } = await supabase
        .from('services')
        .upsert({
          name: serviceName,
          slug: slug,
          category_id: categoryId || null,
          description: description || null,
          short_description: description ? description.substring(0, 500) : null,
          price_cents: Math.round(price * 100),
          price_display: price > 0 ? `$${price}` : 'Free',
          price_type: serviceName.toLowerCase().includes('from') ? 'starting_at' : 'fixed',
          duration_minutes: duration,
          allow_online_booking: onlineBooking,
          is_active: true,
          is_featured: false,
        }, { onConflict: 'slug' });
      
      if (serviceError) {
        errors.push({ name: serviceName, error: serviceError.message });
      } else {
        imported++;
        process.stdout.write(`\r✅ Imported ${imported} services...`);
      }
    } catch (err) {
      errors.push({ name: serviceName, error: String(err) });
    }
  }
  
  console.log('\n\n✅ Import complete!\n');
  console.log(`📈 Results:`);
  console.log(`   - Total processed: ${rows.length}`);
  console.log(`   - Successfully imported: ${imported}`);
  console.log(`   - Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ Errors:`);
    errors.forEach(e => {
      console.log(`   - ${e.name}: ${e.error}`);
    });
  }
}

// Run
importServices().catch(console.error);
