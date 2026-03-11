// ============================================================
// API: IMPORT CLIENTS INTO DATABASE
// Sync Square customers (or future: CSV) into Supabase users + clients.
// Top priority: get clients from pre-remodel source into DB.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { fetchAllSquareCustomers, isSquareConfigured } from '@/lib/square-clients';

export const dynamic = 'force-dynamic';
export const maxDuration = 120; // Allow up to 2 min for large imports

export async function POST(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.' },
      { status: 503 }
    );
  }

  let body: { source?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const source = (body.source || 'square').toLowerCase();

  if (source === 'square') {
    if (!isSquareConfigured()) {
      return NextResponse.json(
        { error: 'Square not configured. Add SQUARE_ACCESS_TOKEN (and optionally SQUARE_ENVIRONMENT) in Vercel → Settings → Environment Variables, then redeploy.' },
        { status: 400 }
      );
    }

    const squareCustomers = await fetchAllSquareCustomers(2000);
    if (squareCustomers.length === 0) {
      return NextResponse.json({
        imported: 0,
        skipped: 0,
        errors: [],
        message: 'No customers found in Square. Check SQUARE_ENVIRONMENT (sandbox vs production).',
      });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const c of squareCustomers) {
      const email = (c.email || '').trim().toLowerCase();
      const firstName = (c.first_name || '').trim() || 'Unknown';
      const lastName = (c.last_name || '').trim() || 'Unknown';
      const phone = (c.phone || '').trim() || null;

      // Skip if we already have a client with this Square ID
      const { data: existingBySquare } = await supabase
        .from('clients')
        .select('id')
        .eq('square_customer_id', c.id)
        .maybeSingle();
      if (existingBySquare) {
        skipped++;
        continue;
      }

      // Prefer matching by email so we don't duplicate
      if (email) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (existingUser) {
          const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', existingUser.id)
            .maybeSingle();

          if (existingClient) {
            await supabase
              .from('clients')
              .update({
                square_customer_id: c.id,
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone: phone,
              })
              .eq('id', existingClient.id);
            imported++;
            continue;
          }

          const { data: newClient, error: clientErr } = await supabase
            .from('clients')
            .insert({
              user_id: existingUser.id,
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone: phone,
              source: 'square',
              square_customer_id: c.id,
            })
            .select('id')
            .single();

          if (clientErr) {
            errors.push(`${email}: ${clientErr.message}`);
            continue;
          }
          if (newClient) imported++;
          continue;
        }
      }

      // New user + new client (no email or email not in users)
      const { data: newUser, error: userErr } = await supabase
        .from('users')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone,
          role: 'client',
        })
        .select('id')
        .single();

      if (userErr) {
        if (userErr.message?.includes('duplicate') || userErr.message?.includes('unique')) {
          skipped++;
          continue;
        }
        errors.push(`${firstName} ${lastName}: ${userErr.message}`);
        continue;
      }

      if (!newUser?.id) continue;

      const { error: clientErr } = await supabase
        .from('clients')
        .insert({
          user_id: newUser.id,
          first_name: firstName,
          last_name: lastName,
          email: email || null,
          phone: phone,
          source: 'square',
          square_customer_id: c.id,
        });

      if (clientErr) {
        errors.push(`${firstName} ${lastName}: ${clientErr.message}`);
        continue;
      }
      imported++;
    }

    return NextResponse.json({
      imported,
      skipped,
      errors: errors.slice(0, 20),
      totalFromSquare: squareCustomers.length,
      message: `Imported ${imported} clients from Square. ${skipped} already in database.`,
    });
  }

  return NextResponse.json(
    { error: 'Unsupported import source. Use source: "square".' },
    { status: 400 }
  );
}
