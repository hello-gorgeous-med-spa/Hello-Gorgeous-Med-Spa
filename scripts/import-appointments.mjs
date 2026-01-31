#!/usr/bin/env node
// ============================================================
// FRESHA APPOINTMENT IMPORT SCRIPT
// Imports appointments from Fresha CSV export to Supabase
//
// Usage:
//   1. Create .env.local with SUPABASE credentials
//   2. Run: node scripts/import-appointments.mjs [csv-path]
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
const csvPath = process.argv[2] || '/Users/danid/Desktop/appointment reference 1 year new .csv';

// Verify file exists
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV file not found: ${csvPath}`);
  console.error('   Usage: node scripts/import-appointments.mjs [path-to-csv]');
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

// Map Fresha status to our status
function mapStatus(freshaStatus) {
  const statusMap = {
    'Booked': 'pending',
    'Confirmed': 'confirmed',
    'Completed': 'completed',
    'Canceled': 'cancelled',
    'Cancelled': 'cancelled',
    'Did not show': 'no_show',
    'No-show': 'no_show',
    'No Show': 'no_show',
  };
  return statusMap[freshaStatus] || 'pending';
}

// Map booking source
function mapBookingSource(channel) {
  const sourceMap = {
    'Offline': 'admin',
    'Fresha': 'online',
    'Book now link': 'online',
    'Google': 'online',
    'Marketing - Blast messages': 'marketing',
    'Widget': 'online',
  };
  return sourceMap[channel] || 'online';
}

// Parse time string like "4:00 pm" to 24h format
function parseTime(timeStr) {
  if (!timeStr) return null;
  
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
  if (!match) return null;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toLowerCase();
  
  if (period === 'pm' && hours !== 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Parse date and time to ISO string
function parseDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  
  const time = parseTime(timeStr) || '09:00';
  const [hours, minutes] = time.split(':').map(Number);
  
  // Parse date (format: YYYY-MM-DD or MM/DD/YYYY)
  let date;
  if (dateStr.includes('-')) {
    date = new Date(dateStr);
  } else {
    const parts = dateStr.split('/');
    date = new Date(parts[2], parts[0] - 1, parts[1]);
  }
  
  date.setHours(hours, minutes, 0, 0);
  
  // Adjust for Chicago timezone (UTC-6)
  return date.toISOString();
}

// Main import function
async function importAppointments() {
  console.log('📂 Reading CSV file...');
  const csvText = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvText);
  
  console.log(`📊 Found ${rows.length} appointments to import\n`);
  
  // Load clients, services, and create provider lookup
  console.log('📥 Loading clients...');
  const { data: clients } = await supabase
    .from('clients')
    .select('id, user_id, users!inner(first_name, last_name)');
  
  // Create client lookup by name
  const clientLookup = new Map();
  clients?.forEach(c => {
    const fullName = `${c.users.first_name} ${c.users.last_name}`.toLowerCase().trim();
    clientLookup.set(fullName, c.id);
  });
  console.log(`   Found ${clientLookup.size} clients`);
  
  console.log('📥 Loading services...');
  const { data: services } = await supabase
    .from('services')
    .select('id, name');
  
  // Create service lookup by name (partial match)
  const serviceLookup = new Map();
  services?.forEach(s => {
    serviceLookup.set(s.name.toLowerCase().trim(), s.id);
  });
  console.log(`   Found ${serviceLookup.size} services`);
  
  console.log('📥 Loading/creating providers...');
  // Get or create providers
  const providerNames = [...new Set(rows.map(r => r['Staff']).filter(Boolean))];
  const providerLookup = new Map();
  
  for (const providerName of providerNames) {
    if (!providerName || providerName === 'Walk-In') continue;
    
    const [firstName, ...lastParts] = providerName.split(' ');
    const lastName = lastParts.join(' ') || '';
    
    // Check if user exists
    let { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .ilike('first_name', firstName)
      .ilike('last_name', lastName || '%')
      .eq('role', 'provider')
      .single();
    
    if (!existingUser) {
      // Create provider user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase() || 'provider'}@hellogorgeousmedspa.com`,
          first_name: firstName,
          last_name: lastName,
          role: 'provider',
          is_active: true,
        })
        .select('id')
        .single();
      
      if (newUser) {
        // Create provider record
        await supabase
          .from('providers')
          .insert({
            user_id: newUser.id,
            credentials: providerName.includes('Ryan') ? 'APRN, FNP-BC' : '',
            is_active: true,
          });
        
        existingUser = newUser;
      }
    }
    
    // Get provider ID
    if (existingUser) {
      const { data: provider } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', existingUser.id)
        .single();
      
      if (provider) {
        providerLookup.set(providerName.toLowerCase(), provider.id);
      }
    }
  }
  console.log(`   Found/created ${providerLookup.size} providers`);
  
  // Get location
  const { data: location } = await supabase
    .from('locations')
    .select('id')
    .single();
  const locationId = location?.id;
  
  console.log('\n🚀 Importing appointments...\n');
  
  let imported = 0;
  let skipped = 0;
  let errors = [];
  
  for (const row of rows) {
    const clientName = row['Client']?.toLowerCase().trim();
    const serviceName = row['Service']?.toLowerCase().trim();
    const providerName = row['Staff']?.toLowerCase().trim();
    const scheduledDate = row['Scheduled Date'];
    const scheduledTime = row['Time'];
    const duration = parseInt(row['Duration']) || 30;
    const price = parseFloat(row['Price']?.replace(/[^0-9.]/g, '') || '0');
    const status = mapStatus(row['Status']);
    const bookingSource = mapBookingSource(row['Channel']);
    const freshaRef = row['Ref #'];
    
    // Skip if no essential data
    if (!clientName || !scheduledDate || clientName === 'walk-in') {
      skipped++;
      continue;
    }
    
    // Find client
    const clientId = clientLookup.get(clientName);
    if (!clientId) {
      // Try partial match
      let found = false;
      for (const [name, id] of clientLookup) {
        if (name.includes(clientName) || clientName.includes(name)) {
          found = true;
          break;
        }
      }
      if (!found) {
        skipped++;
        continue;
      }
    }
    
    // Find service (partial match)
    let serviceId = null;
    for (const [name, id] of serviceLookup) {
      if (serviceName && (name.includes(serviceName.substring(0, 20)) || serviceName.includes(name.substring(0, 20)))) {
        serviceId = id;
        break;
      }
    }
    
    // Find provider
    const providerId = providerLookup.get(providerName);
    
    // Parse dates
    const startsAt = parseDateTime(scheduledDate, scheduledTime);
    if (!startsAt) {
      skipped++;
      continue;
    }
    
    const endsAt = new Date(new Date(startsAt).getTime() + duration * 60 * 1000).toISOString();
    
    try {
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          client_id: clientId || null,
          provider_id: providerId || null,
          service_id: serviceId || null,
          location_id: locationId,
          starts_at: startsAt,
          ends_at: endsAt,
          status: status,
          booking_source: bookingSource,
          client_notes: freshaRef ? `Fresha Ref: ${freshaRef}` : null,
        });
      
      if (insertError) {
        errors.push({ ref: freshaRef, error: insertError.message });
      } else {
        imported++;
      }
    } catch (err) {
      errors.push({ ref: freshaRef, error: String(err) });
    }
    
    // Progress
    if ((imported + skipped + errors.length) % 100 === 0) {
      process.stdout.write(`\r⏳ Progress: ${imported} imported, ${skipped} skipped, ${errors.length} errors`);
    }
  }
  
  console.log('\n\n✅ Import complete!\n');
  console.log(`📈 Results:`);
  console.log(`   - Total processed: ${rows.length}`);
  console.log(`   - Successfully imported: ${imported}`);
  console.log(`   - Skipped (no client match): ${skipped}`);
  console.log(`   - Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️ First 10 errors:`);
    errors.slice(0, 10).forEach(e => {
      console.log(`   - ${e.ref}: ${e.error}`);
    });
  }
}

// Run
importAppointments().catch(console.error);
