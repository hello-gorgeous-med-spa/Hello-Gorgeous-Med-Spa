#!/usr/bin/env node

/**
 * FRESHA SALES IMPORTER
 * Imports sales history from Fresha CSV export into HGOS
 * 
 * Usage: node scripts/import-fresha-sales.mjs /path/to/fresha-sales.csv
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

// Parse Fresha date format: "02 Feb 2026, 1:46pm"
function parseFreshaDate(dateStr) {
  if (!dateStr) return null;
  
  const months = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
    'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  // "02 Feb 2026, 1:46pm"
  const match = dateStr.match(/(\d{1,2})\s+(\w{3})\s+(\d{4}),?\s+(\d{1,2}):(\d{2})(am|pm)/i);
  if (!match) {
    console.warn(`Could not parse date: ${dateStr}`);
    return null;
  }
  
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
    'Completed': 'completed',
    'Unpaid': 'unpaid',
    'Refunded': 'refunded',
    'Voided': 'voided',
    'Cancelled': 'cancelled',
    'No Show': 'no_show',
    'Partially Paid': 'partially_paid',
  };
  return statusMap[freshaStatus] || 'completed';
}

// Map Fresha sale to HGOS sale type
// sale_type must be: service, product, membership, package, gift_card, fee, other
function mapSaleType(row) {
  // Default to 'service' since most Fresha sales are services
  // We track the booking channel separately
  return 'service';
}

async function importSales(csvPath) {
  console.log('🚀 Starting Fresha Sales Import...\n');
  
  // Read CSV
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  
  console.log(`📊 Found ${records.length} sales to import\n`);
  
  // Get existing clients for matching (join with user_profiles for names)
  console.log('👥 Loading client database...');
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select(`
      id,
      user_profiles:user_id (first_name, last_name, email)
    `);
  
  if (clientsError) {
    console.error('❌ Failed to load clients:', clientsError.message);
    process.exit(1);
  }
  
  // Build client lookup by name
  const clientLookup = new Map();
  clients?.forEach(c => {
    const profile = c.user_profiles;
    if (!profile) return;
    
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim().toLowerCase();
    if (fullName) clientLookup.set(fullName, c.id);
    
    // Also try first name only for partial matches
    if (profile.first_name) {
      const firstName = profile.first_name.toLowerCase();
      if (!clientLookup.has(firstName)) {
        clientLookup.set(firstName, c.id);
      }
    }
  });
  
  console.log(`   Found ${clients?.length || 0} clients for matching\n`);
  
  // Check for existing Fresha imports to avoid duplicates
  const { data: existingSales } = await supabase
    .from('sales')
    .select('external_id')
    .eq('external_source', 'fresha');
  
  const existingIds = new Set(existingSales?.map(s => s.external_id) || []);
  console.log(`   Found ${existingIds.size} existing Fresha imports\n`);
  
  // Process in batches
  const batchSize = 100;
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let unmatchedClients = new Set();
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const salesToInsert = [];
    
    for (const row of batch) {
      const saleNo = row['Sale no.'];
      
      // Skip if already imported
      if (existingIds.has(saleNo)) {
        skipped++;
        continue;
      }
      
      // Parse data
      const saleDate = parseFreshaDate(row['Sale date']);
      const clientName = row['Client']?.trim();
      const status = mapStatus(row['Sale status']);
      const channel = row['Channel'];
      const totalSales = Math.round(parseFloat(row['Total sales'] || '0') * 100); // Convert to cents
      const giftCard = Math.round(parseFloat(row['Gift card'] || '0') * 100);
      const serviceFees = Math.round(parseFloat(row['Service charges'] || '0') * 100);
      const amountDue = Math.round(parseFloat(row['Amount due'] || '0') * 100);
      const itemCount = parseInt(row['Items sold'] || '1');
      
      // Match client
      let clientId = null;
      if (clientName) {
        const lookupName = clientName.toLowerCase();
        clientId = clientLookup.get(lookupName);
        
        // Try partial match if no exact match
        if (!clientId) {
          for (const [name, id] of clientLookup) {
            if (lookupName.includes(name) || name.includes(lookupName)) {
              clientId = id;
              break;
            }
          }
        }
        
        if (!clientId) {
          unmatchedClients.add(clientName);
        }
      }
      
      // Create sale record
      salesToInsert.push({
        sale_number: `FR-${saleNo}`,
        external_id: saleNo,
        external_source: 'fresha',
        client_id: clientId,
        status,
        sale_type: mapSaleType(row),
        booking_channel: channel,
        subtotal: totalSales,
        discount_total: 0,
        tax_total: 0,
        gross_total: totalSales,
        net_total: Math.round(totalSales - serviceFees),
        tip_total: 0,
        balance_due: amountDue,
        payment_status: amountDue > 0 ? 'unpaid' : 'paid',
        processing_fee_total: serviceFees,
        gift_card_amount: giftCard,
        item_count: itemCount,
        created_at: saleDate?.toISOString(),
        completed_at: status === 'completed' ? saleDate?.toISOString() : null,
        internal_notes: `Imported from Fresha. Original sale #${saleNo}. Client: ${clientName}`,
      });
    }
    
    // Insert batch
    if (salesToInsert.length > 0) {
      const { data, error } = await supabase
        .from('sales')
        .insert(salesToInsert)
        .select();
      
      if (error) {
        // Log full error on first batch
        if (i === 0) {
          console.error(`\n\n❌ FIRST BATCH ERROR DETAILS:`);
          console.error(`   Message: ${error.message}`);
          console.error(`   Code: ${error.code}`);
          console.error(`   Details: ${error.details}`);
          console.error(`   Hint: ${error.hint}`);
          console.error(`   Sample record:`, JSON.stringify(salesToInsert[0], null, 2));
        }
        errors += salesToInsert.length;
      } else {
        imported += salesToInsert.length;
      }
    }
    
    // Progress
    const progress = Math.min(100, Math.round(((i + batchSize) / records.length) * 100));
    process.stdout.write(`\r⏳ Progress: ${progress}% (${imported} imported, ${skipped} skipped, ${errors} errors)`);
  }
  
  console.log('\n\n✅ Import Complete!\n');
  console.log(`   📥 Imported: ${imported}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  
  if (unmatchedClients.size > 0) {
    console.log(`\n⚠️  ${unmatchedClients.size} clients could not be matched:`);
    const samples = Array.from(unmatchedClients).slice(0, 10);
    samples.forEach(name => console.log(`   - ${name}`));
    if (unmatchedClients.size > 10) {
      console.log(`   ... and ${unmatchedClients.size - 10} more`);
    }
  }
  
  console.log('\n🎉 Done! Check /admin/sales to see imported data.');
}

// Run
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/import-fresha-sales.mjs /path/to/fresha-sales.csv');
  process.exit(1);
}

importSales(csvPath).catch(console.error);
