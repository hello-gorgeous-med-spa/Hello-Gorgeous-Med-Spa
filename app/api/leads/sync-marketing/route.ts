// ============================================================
// POST /api/leads/sync-marketing
// Add selected feature leads to Admin Contact Collection (users + clients + marketing_preferences).
// Body: { leadIds?: string[] } — if omitted, syncs all leads.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOwnerSession } from '@/lib/get-owner-session';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

function normalizeEmail(email: string): string | null {
  const e = (email || '').trim().toLowerCase();
  if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return e;
}

function normalizePhone(phone: string): string | null {
  const p = (phone || '').replace(/\D/g, '');
  if (p.length >= 10) return p.length === 10 ? `+1${p}` : `+${p}`;
  return null;
}

const SOURCE_LABEL: Record<string, string> = {
  face_blueprint: 'Face Blueprint',
  journey: 'Journey',
  hormone: 'Harmony AI',
  lip_studio: 'Lip Studio',
};

export async function POST(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
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
      console.error('sync-marketing fetch error:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (!leads?.length) {
      return NextResponse.json({ imported: 0, updated: 0, skipped: 0, errors: [], message: 'No leads to sync' });
    }

    let imported = 0;
    let updated = 0;
    const errors: { leadId: string; email: string; error: string }[] = [];

    for (const lead of leads) {
      const email = normalizeEmail(lead.email);
      if (!email) {
        errors.push({ leadId: lead.id, email: lead.email, error: 'Invalid email' });
        continue;
      }
      const phone = normalizePhone(lead.phone || '');
      const firstName = 'Feature Lead';
      const lastName = SOURCE_LABEL[lead.source] || lead.source || '';

      try {
        const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
        let userId: string;

        if (existingUser?.id) {
          userId = existingUser.id;
          await supabase
            .from('users')
            .update({
              first_name: firstName,
              last_name: lastName,
              phone: phone || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);
          const { data: existingClient } = await supabase.from('clients').select('id').eq('user_id', userId).single();
          if (!existingClient) {
            await supabase.from('clients').insert({
              user_id: userId,
              referral_source: 'marketing_import',
              accepts_email_marketing: true,
              accepts_sms_marketing: !!phone,
            });
          }
          updated++;
        } else {
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              email,
              first_name: firstName,
              last_name: lastName,
              phone: phone || null,
              role: 'client',
            })
            .select('id')
            .single();

          if (userError) {
            errors.push({ leadId: lead.id, email, error: userError.message });
            continue;
          }
          userId = newUser.id;
          await supabase.from('clients').insert({
            user_id: userId,
            referral_source: 'marketing_import',
            accepts_email_marketing: true,
            accepts_sms_marketing: !!phone,
          });
          imported++;
        }

        await supabase
          .from('marketing_preferences')
          .upsert(
            {
              user_id: userId,
              email_opt_in: true,
              sms_opt_in: !!phone,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push({ leadId: lead.id, email, error: msg });
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      updated,
      skipped: leads.length - imported - updated - errors.length,
      errors,
    });
  } catch (error) {
    console.error('sync-marketing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
