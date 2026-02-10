#!/usr/bin/env node

/**
 * FRESHA APPOINTMENTS IMPORTER (HISTORICAL / REFERENCE ONLY)
 * Imports appointment history from Fresha CSV export into HGOS.
 * Use for legacy data and reporting only — NOT for availability enforcement.
 * This system is the canonical source for new appointments; Fresha is not live-integrated.
 *
 * Usage: node scripts/import-fresha-appointments.mjs /path/to/fresha-appointments.csv
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
    return null;
  }
  
  const [, day, monthStr, year, hour, minute, ampm] = match;
  const month = months[monthStr];
  let hours = parseInt(hour);
  
  if (ampm.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (ampm.toLowerCase() === 'am' && hours === 12) hours = 0;
  
  return new Date(parseInt(year), month, parseInt(day), hours, parseInt(minute));
}

// Parse time slot like "15:30:00-16:00:00" to get start time
function parseTimeSlot(dateStr, timeSlot) {
  if (!dateStr || !timeSlot) return { start: null, end: null };
  
  const baseDate = parseFreshaDate(dateStr);
  if (!baseDate) return { start: null, end: null };
  
  const match = timeSlot.match(/(\d{1,2}):(\d{2}):(\d{2})-(\d{1,2}):(\d{2}):(\d{2})/);
  if (!match) return { start: baseDate, end: null };
  
  const [, startHour, startMin, , endHour, endMin] = match;
  
  const startDate = new Date(baseDate);
  startDate.setHours(parseInt(startHour), parseInt(startMin), 0, 0);
  
  const endDate = new Date(baseDate);
  endDate.setHours(parseInt(endHour), parseInt(endMin), 0, 0);
  
  return { start: startDate, end: endDate };
}

// Map Fresha status to HGOS status
function mapStatus(freshaStatus) {
  const statusMap = {
    'Completed': 'completed',
    'Confirmed': 'confirmed',
    'New': 'confirmed',
    'Cancelled': 'cancelled',
    'No Show': 'no_show',
    'Arrived': 'checked_in',
    'Started': 'in_progress',
  };
  return statusMap[freshaStatus] || 'confirmed';
}

async function importAppointments(csvPath) {
  console.log('🚀 Starting Fresha Appointments Import...\n');
  
  // Read CSV
  const csvContent = readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  
  console.log(`📊 Found ${records.length} appointments to import\n`);
  
  // Get existing clients for matching
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
    
    if (profile.first_name) {
      const firstName = profile.first_name.toLowerCase();
      if (!clientLookup.has(firstName)) {
        clientLookup.set(firstName, c.id);
      }
    }
  });
  
  console.log(`   Found ${clients?.length || 0} clients for matching\n`);
  
  // Get providers
  console.log('👨‍⚕️ Loading providers...');
  const { data: providers } = await supabase
    .from('providers')
    .select('id, user_profiles:user_id(first_name, last_name)');
  
  const providerLookup = new Map();
  providers?.forEach(p => {
    const profile = p.user_profiles;
    if (!profile) return;
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim().toLowerCase();
    if (fullName) providerLookup.set(fullName, p.id);
  });
  
  console.log(`   Found ${providers?.length || 0} providers\n`);
  
  // Get services
  console.log('💆 Loading services...');
  const { data: services } = await supabase
    .from('services')
    .select('id, name');
  
  const serviceLookup = new Map();
  services?.forEach(s => {
    if (s.name) serviceLookup.set(s.name.toLowerCase(), s.id);
  });
  
  console.log(`   Found ${services?.length || 0} services\n`);
  
  // Check for existing Fresha imports
  const { data: existingAppts } = await supabase
    .from('appointments')
    .select('booking_source')
    .like('booking_source', 'fresha:%');
  
  const existingRefs = new Set(
    existingAppts?.map(a => a.booking_source?.replace('fresha:', '')) || []
  );
  console.log(`   Found ${existingRefs.size} existing Fresha imports\n`);
  
  // Process in batches
  const batchSize = 100;
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  let unmatchedClients = new Set();
  let unmatchedProviders = new Set();
  
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const appointmentsToInsert = [];
    
    for (const row of batch) {
      const apptRef = row['Appt. ref.'];
      
      // Skip if already imported
      if (existingRefs.has(apptRef)) {
        skipped++;
        continue;
      }
      
      // Parse data
      const clientName = row['Client']?.trim();
      const providerName = row['Team member']?.trim();
      const status = mapStatus(row['Status']);
      const scheduledDate = row['Scheduled date'];
      const timeSlot = row['Appt. slot'];
      const { start: startsAt, end: endsAt } = parseTimeSlot(scheduledDate, timeSlot);
      const serviceName = row['Service']?.trim();
      const category = row['Category']?.trim();
      const cancelledDate = parseFreshaDate(row['Cancelled date']);
      const cancelReason = row['Cancellation reason'];
      const cancelledBy = row['Cancelled by'];
      const createdBy = row['Created by'];
      const netSales = Math.round(parseFloat(row['Net sales'] || '0') * 100);
      
      // Match client
      let clientId = null;
      if (clientName) {
        const lookupName = clientName.toLowerCase();
        clientId = clientLookup.get(lookupName);
        
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
      
      // Match provider
      let providerId = null;
      if (providerName) {
        const lookupName = providerName.toLowerCase();
        providerId = providerLookup.get(lookupName);
        
        if (!providerId) {
          unmatchedProviders.add(providerName);
        }
      }
      
      // Match service (optional)
      let serviceId = null;
      if (serviceName) {
        serviceId = serviceLookup.get(serviceName.toLowerCase());
      }
      
      if (!startsAt) {
        continue; // Skip if no valid date
      }
      
      // Create appointment record
      // Note: booked_by and cancelled_by are UUIDs, so we skip them for imports
      // and store the info in notes instead
      appointmentsToInsert.push({
        client_id: clientId,
        provider_id: providerId,
        service_id: serviceId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt?.toISOString() || new Date(startsAt.getTime() + 30 * 60000).toISOString(),
        status,
        booking_source: `fresha:${apptRef}`,
        cancelled_at: cancelledDate?.toISOString() || null,
        cancel_reason: cancelReason || null,
        client_notes: `${category}: ${serviceName}`,
        provider_notes: `Imported from Fresha. Ref: ${apptRef}. Booked by: ${createdBy}. Net sales: $${(netSales / 100).toFixed(2)}${cancelledBy ? `. Cancelled by: ${cancelledBy}` : ''}`,
      });
    }
    
    // Insert batch
    if (appointmentsToInsert.length > 0) {
      const { error } = await supabase
        .from('appointments')
        .insert(appointmentsToInsert);
      
      if (error) {
        if (i === 0) {
          console.error(`\n\n❌ FIRST BATCH ERROR:`);
          console.error(`   Message: ${error.message}`);
          console.error(`   Code: ${error.code}`);
          console.error(`   Sample:`, JSON.stringify(appointmentsToInsert[0], null, 2));
        }
        errors += appointmentsToInsert.length;
      } else {
        imported += appointmentsToInsert.length;
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
    console.log(`\n⚠️  ${unmatchedClients.size} clients could not be matched`);
  }
  
  if (unmatchedProviders.size > 0) {
    console.log(`\n⚠️  Unmatched providers:`);
    unmatchedProviders.forEach(name => console.log(`   - ${name}`));
  }
  
  console.log('\n🎉 Done! Check /admin/appointments to see imported data.');
}

// Run
const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/import-fresha-appointments.mjs /path/to/fresha-appointments.csv');
  process.exit(1);
}

importAppointments(csvPath).catch(console.error);
