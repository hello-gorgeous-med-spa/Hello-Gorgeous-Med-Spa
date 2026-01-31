#!/usr/bin/env node
// ============================================================
// FRESHA CLIENT IMPORT SCRIPT
// Imports clients from Fresha CSV export to Supabase
// 
// Usage: 
//   1. Create .env.local with SUPABASE credentials
//   2. Run: node scripts/import-fresha-clients.mjs [csv-path]
// ============================================================

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
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
  console.error('   Please set a valid SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// CSV file path - can be overridden via command line argument
const csvPath = process.argv[2] || '/Users/danid/Desktop/export_customer_list_2026-01-30.csv';

// Verify file exists
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  console.error('   Usage: node scripts/import-fresha-clients.mjs [path-to-csv]');
  process.exit(1);
}

// Parse CSV
function parseCSV(text) {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.replace(/^"|"$/g, '') || '';
    });
    rows.push(row);
  }
  
  return rows;
}

// Normalize phone number
function normalizePhone(phone) {
  if (!phone) return null;
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) return null;
  // Return last 10 digits with formatting
  const last10 = digits.slice(-10);
  return `(${last10.slice(0,3)}) ${last10.slice(3,6)}-${last10.slice(6)}`;
}

// Main import function
async function importClients() {
  console.log('📂 Reading CSV file...');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  
  console.log(`📊 Found ${rows.length} clients to import\n`);
  
  let imported = 0;
  let skipped = 0;
  let errors = [];
  
  // Process in batches
  const batchSize = 50;
  
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    for (const row of batch) {
      const firstName = row['First Name']?.trim() || '';
      const lastName = row['Last Name']?.trim() || '';
      const email = row['Email']?.trim().toLowerCase() || '';
      const phone = normalizePhone(row['Mobile Number']) || normalizePhone(row['Telephone']);
      
      // Skip if no meaningful data
      if (!firstName && !lastName && !email && !phone) {
        skipped++;
        continue;
      }
      
      try {
        // Generate unique email if none provided
        const userEmail = email || `fresha_${row['Client ID']}@import.hgos.local`;
        
        // Insert user
        const { data: userData, error: userError } = await supabase
          .from('users')
          .upsert({
            email: userEmail,
            phone: phone,
            first_name: firstName || 'Unknown',
            last_name: lastName || '',
            role: 'client',
            is_active: row['Blocked'] !== 'Yes',
          }, { 
            onConflict: 'email',
            ignoreDuplicates: false 
          })
          .select('id')
          .single();
        
        if (userError) {
          errors.push({ name: `${firstName} ${lastName}`, error: userError.message });
          continue;
        }
        
        // Parse date of birth
        let dob = null;
        if (row['Date of Birth'] && row['Date of Birth'] !== '') {
          dob = row['Date of Birth'];
        }
        
        // Insert client record
        const { error: clientError } = await supabase
          .from('clients')
          .upsert({
            user_id: userData.id,
            fresha_client_id: row['Client ID'] || null,
            date_of_birth: dob,
            gender: row['Gender']?.trim() || null,
            accepts_email_marketing: row['Accepts Marketing'] === 'Yes',
            accepts_sms_marketing: row['Accepts SMS Marketing'] === 'Yes',
            address_line1: row['Address']?.trim() || null,
            address_line2: row['Apartement Suite']?.trim() || null,
            city: row['City']?.trim() || null,
            state: row['State']?.trim() || null,
            postal_code: row['Post Code']?.trim() || null,
            is_new_client: false,
            is_blocked: row['Blocked'] === 'Yes',
            block_reason: row['Block Reason']?.trim() || null,
            referral_source: row['Referral Source']?.trim() || null,
            internal_notes: row['Note']?.trim() || null,
          }, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          });
        
        if (clientError) {
          errors.push({ name: `${firstName} ${lastName}`, error: clientError.message });
        } else {
          imported++;
        }
        
      } catch (err) {
        errors.push({ name: `${firstName} ${lastName}`, error: String(err) });
      }
    }
    
    // Progress update
    const progress = Math.min(i + batchSize, rows.length);
    process.stdout.write(`\r⏳ Progress: ${progress}/${rows.length} (${imported} imported, ${skipped} skipped, ${errors.length} errors)`);
  }
  
  console.log('\n\n✅ Import complete!\n');
  console.log(`📈 Results:`);
  console.log(`   - Total processed: ${rows.length}`);
  console.log(`   - Successfully imported: ${imported}`);
  console.log(`   - Skipped (no data): ${skipped}`);
  console.log(`   - Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ First 10 errors:`);
    errors.slice(0, 10).forEach(e => {
      console.log(`   - ${e.name}: ${e.error}`);
    });
  }
}

// Run
importClients().catch(console.error);
