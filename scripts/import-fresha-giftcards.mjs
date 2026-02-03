#!/usr/bin/env node

/**
 * FRESHA GIFT CARDS IMPORTER
 * Imports gift card data from Fresha CSV export into HGOS
 * 
 * Usage: node scripts/import-fresha-giftcards.mjs /path/to/fresha-giftcards.csv
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse Fresha date format: "24 Dec 2025, 12:00am"
function parseFreshaDate(dateStr) {
  if (!dateStr) return null;
  
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const match = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4}),?\s+(\d{1,2}):(\d{2})(am|pm)/i);
  if (!match) return null;
  
  const [, day, monthStr, year, hour, minute, ampm] = match;
  const month = months[monthStr];
  let hours = parseInt(hour);
  
  if (ampm.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
  
  return new Date(parseInt(year), month, parseInt(day), hours, parseInt(minute));
}

// Map Fresha status to HGOS status
function mapStatus(freshaStatus) {
  const statusMap = {
    'Active': 'active',
    'Redeemed': 'redeemed',
    'Expired': 'expired',
    'Voided': 'voided',
    'Pending': 'pending',
  };
  return statusMap[freshaStatus] || 'active';
}

async function importGiftCards(csvPath) {
  console.log('🚀 Starting Fresha Gift Cards Import...\n');
  
  // Read CSV
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  
  console.log(`📊 Found ${records.length} gift cards to import\n`);
  
  // Get existing clients for matching
  console.log('👥 Loading client database...');
  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      user_profiles:user_id (first_name, last_name)
    `);
  
  const clientLookup = new Map();
  clients?.forEach(c => {
    const profile = c.user_profiles;
    if (!profile) return;
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim().toLowerCase();
    if (fullName) clientLookup.set(fullName, c.id);
  });
  
  console.log(`   Found ${clients?.length || 0} clients for matching\n`);
  
  // Check for existing imports
  const { data: existingCards } = await supabase
    .from('gift_cards')
    .select('code');
  
  const existingCodes = new Set(existingCards?.map(c => c.code) || []);
  console.log(`   Found ${existingCodes.size} existing gift cards\n`);
  
  // Process
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const row of records) {
    const code = row['Code']?.trim();
    
    // Skip if already exists
    if (existingCodes.has(code)) {
      skipped++;
      continue;
    }
    
    // Parse data
    const purchaserName = row['Purchased by']?.trim();
    const status = mapStatus(row['Status']);
    const issueDate = parseFreshaDate(row['Issue date']);
    const expiryDate = parseFreshaDate(row['Expiry date']);
    const issuedValue = parseFloat(row['Issued value'] || '0');
    const closingBalance = parseFloat(row['Closing balance'] || '0');
    const redemptions = parseFloat(row['Redemptions'] || '0');
    const saleNo = row['Sale no.'];
    
    // Match client
    let purchaserClientId = null;
    if (purchaserName && purchaserName !== 'Walk-In') {
      const lookupName = purchaserName.toLowerCase();
      purchaserClientId = clientLookup.get(lookupName);
      
      if (!purchaserClientId) {
        for (const [name, id] of clientLookup) {
          if (lookupName.includes(name) || name.includes(lookupName)) {
            purchaserClientId = id;
            break;
          }
        }
      }
    }
    
    // Insert - using actual column names from database
    const { error } = await supabase
      .from('gift_cards')
      .insert({
        code,
        initial_amount: issuedValue,
        current_balance: closingBalance,
        status,
        purchaser_client_id: purchaserClientId,
        purchaser_name: purchaserName,
        purchased_at: issueDate?.toISOString(),
        expires_at: expiryDate?.toISOString(),
        gift_message: `Imported from Fresha. Sale #${saleNo}. Total redeemed: $${redemptions}`,
      });
    
    if (error) {
      if (errors === 0) {
        console.error(`\n❌ Error: ${error.message}`);
        console.error(`   Code: ${error.code}`);
      }
      errors++;
    } else {
      imported++;
    }
    
    process.stdout.write(`\r⏳ Processing: ${imported + skipped + errors}/${records.length}`);
  }
  
  console.log('\n\n✅ Import Complete!\n');
  console.log(`   📥 Imported: ${imported}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n🎉 Done! Check /admin/gift-cards to see imported data.');
}

// Run
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/import-fresha-giftcards.mjs /path/to/fresha-giftcards.csv');
  process.exit(1);
}

importGiftCards(csvPath).catch(console.error);
