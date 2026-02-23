// ============================================================
// POST /api/leads/sync-square
// Create Square customers from feature leads so they appear in Square Marketing.
// Body: { leadIds?: string[] } — if omitted, syncs all opt-in leads.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOwnerSession } from '@/lib/get-owner-session';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';
import { getCustomersApiAsync } from '@/lib/square/client';

export const dynamic = 'force-dynamic';

const SOURCE_LABEL: Record<string, string> = {
  face_blueprint: 'Face Blueprint',
  journey: 'Journey',
  hormone: 'Harmony AI',
  lip_studio: 'Lip Studio',
};

function formatPhoneForSquare(phone: string): string {
  const p = (phone || '').replace(/\D/g, '');
  if (p.length === 10) return `+1${p}`;
  if (p.length === 11 && p.startsWith('1')) return `+${p}`;
  return p.length >= 10 ? `+${p}` : '';
}

export async function POST(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const customersApi = await getCustomersApiAsync();
  if (!customersApi) {
    return NextResponse.json(
      { error: 'Square is not connected. Connect Square in Settings → Payments.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const leadIds = Array.isArray(body.leadIds) ? body.leadIds : undefined;

    let query = supabase.from('feature_leads').select('id, email, phone, source').eq('marketing_opt_in', true);
    if (leadIds?.length) {
      query = query.in('id', leadIds);
    }
    const { data: leads, error: fetchError } = await query;

    if (fetchError) {
      console.error('sync-square fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!leads?.length) {
      return NextResponse.json({ created: 0, skipped: 0, errors: [], message: 'No leads to sync' });
    }

    let created = 0;
    const errors: { leadId: string; email: string; error: string }[] = [];

    for (const lead of leads) {
      const email = (lead.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        errors.push({ leadId: lead.id, email: lead.email, error: 'Invalid email' });
        continue;
      }
      const phone = formatPhoneForSquare(lead.phone || '');
      const givenName = 'Feature Lead';
      const familyName = SOURCE_LABEL[lead.source] || lead.source || 'Website';
      const note = `Source: ${SOURCE_LABEL[lead.source] || lead.source}. Lead ID: ${lead.id}`;

      try {
        const createBody: Record<string, string> = {
          givenName,
          familyName,
          emailAddress: email,
          note,
        };
        if (phone) createBody.phoneNumber = phone;
        createBody.idempotencyKey = `feature-lead-${lead.id}`;

        const response = await customersApi.createCustomer(createBody as any);
        const resBody = (response as any)?.result ?? (response as any)?.body ?? {};

        if (resBody.customer) {
          created++;
        } else if (Array.isArray(resBody.errors) && resBody.errors.length) {
          const sqError = resBody.errors[0];
          const code = sqError?.code;
          if (code === 'DUPLICATE_EMAIL' || (typeof sqError?.detail === 'string' && sqError.detail.toLowerCase().includes('already exists'))) {
            created++;
          } else {
            errors.push({
              leadId: lead.id,
              email,
              error: (sqError?.detail as string) || sqError?.code || 'Square error',
            });
          }
        } else {
          errors.push({ leadId: lead.id, email, error: 'No customer returned' });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push({ leadId: lead.id, email, error: msg });
      }
    }

    return NextResponse.json({
      success: true,
      created,
      skipped: leads.length - created - errors.length,
      errors,
    });
  } catch (error) {
    console.error('sync-square error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
