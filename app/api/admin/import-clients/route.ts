// ============================================================
// ADMIN API: Import Fresha Clients
// POST /api/admin/import-clients
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient, isAdminConfigured } from '@/lib/hgos/supabase';
import {
  normalizePhone,
  normalizeEmail,
  excelDateToJSDate,
  mapReferralSource,
} from '@/lib/hgos/migrations/fresha-import';

interface FreshaClientRow {
  'Client ID': string;
  'First Name': string;
  'Last Name': string;
  'Full Name': string;
  'Blocked': string;
  'Block Reason': string;
  'Gender': string;
  'Mobile Number': string;
  'Telephone': string;
  'Email': string;
  'Accepts Marketing': string;
  'Accepts SMS Marketing': string;
  'Address': string;
  'Apartement Suite': string;
  'Area': string;
  'City': string;
  'State': string;
  'Post Code': string;
  'Date of Birth': string | number;
  'Added': number;
  'Note': string;
  'Referral Source': string;
}

export async function POST(request: NextRequest) {
  try {
    // Check admin key
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_ACCESS_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        { error: 'Supabase service role key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const clients: FreshaClientRow[] = body.clients;

    if (!clients || !Array.isArray(clients)) {
      return NextResponse.json(
        { error: 'Missing clients array in request body' },
        { status: 400 }
      );
    }

    const supabase = createAdminSupabaseClient();
    const results = {
      total: clients.length,
      imported: 0,
      skipped: 0,
      errors: [] as Array<{ name: string; error: string }>,
    };

    // Process in batches
    const batchSize = 50;
    for (let i = 0; i < clients.length; i += batchSize) {
      const batch = clients.slice(i, i + batchSize);

      for (const row of batch) {
        const email = normalizeEmail(row['Email']);
        const phone = normalizePhone(row['Mobile Number']) || normalizePhone(row['Telephone']);

        // Skip if no contact info
        if (!email && !phone) {
          results.skipped++;
          continue;
        }

        try {
          // Create user first
          const { data: userData, error: userError } = await supabase
            .from('users')
            .upsert(
              {
                email: email || `fresha_${row['Client ID']}@placeholder.hgos`,
                phone: phone,
                first_name: row['First Name']?.trim() || 'Unknown',
                last_name: row['Last Name']?.trim() || '',
                role: 'client',
                is_active: row['Blocked'] !== 'Yes',
              },
              { onConflict: 'email' }
            )
            .select('id')
            .single();

          if (userError) {
            results.errors.push({
              name: row['Full Name'],
              error: `User: ${userError.message}`,
            });
            continue;
          }

          // Parse date of birth
          let dob: string | null = null;
          if (row['Date of Birth']) {
            if (typeof row['Date of Birth'] === 'number') {
              const date = excelDateToJSDate(row['Date of Birth']);
              dob = date ? date.toISOString().split('T')[0] : null;
            } else {
              dob = row['Date of Birth'];
            }
          }

          // Create client record
          const { error: clientError } = await supabase.from('clients').upsert(
            {
              user_id: userData.id,
              fresha_client_id: row['Client ID'],
              date_of_birth: dob,
              gender: row['Gender']?.trim() || null,
              accepts_email_marketing: row['Accepts Marketing'] === 'Yes',
              accepts_sms_marketing: row['Accepts SMS Marketing'] === 'Yes',
              address_line1: row['Address']?.trim() || null,
              address_line2: row['Apartement Suite']?.trim() || null,
              city: row['City']?.trim() || null,
              state: row['State']?.trim() || null,
              postal_code: row['Post Code']?.trim() || null,
              is_new_client: false, // Existing clients from Fresha
              is_blocked: row['Blocked'] === 'Yes',
              block_reason: row['Block Reason']?.trim() || null,
              referral_source: mapReferralSource(row['Referral Source']),
              internal_notes: row['Note']?.trim() || null,
            },
            { onConflict: 'user_id' }
          );

          if (clientError) {
            results.errors.push({
              name: row['Full Name'],
              error: `Client: ${clientError.message}`,
            });
          } else {
            results.imported++;
          }
        } catch (err) {
          results.errors.push({
            name: row['Full Name'],
            error: String(err),
          });
        }
      }

      // Log progress
      console.log(`Imported ${Math.min(i + batchSize, clients.length)}/${clients.length} clients`);
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${results.imported} clients`,
      results: {
        ...results,
        errors: results.errors.slice(0, 20), // Only return first 20 errors
        errorCount: results.errors.length,
      },
    });
  } catch (error) {
    console.error('Import clients error:', error);
    return NextResponse.json(
      { error: 'Failed to import clients', details: String(error) },
      { status: 500 }
    );
  }
}
