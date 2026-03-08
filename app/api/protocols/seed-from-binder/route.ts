// ============================================================
// POST /api/protocols/seed-from-binder
// Create protocol records from Compliance Binder document list.
// Skips titles that already exist.
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

// Titles mirroring Compliance Binder documents (admin/compliance/binder/page.tsx)
const BINDER_TITLES = [
  'Binder index (README)',
  'Botox Complication Protocol',
  'Vascular Occlusion Emergency Protocol',
  'Hyaluronidase Emergency Protocol',
  'Laser Safety Protocol',
  'Patient Consent Requirements',
  'Standing Orders for Injectables',
  'Chart Audit Checklist',
  'Illinois IDFPR Inspection Readiness Checklist',
  'Medical Director Agreement (Ryan 2026)',
];

export async function POST() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const { data: existing } = await supabase
      .from('protocols')
      .select('title')
      .then((r) => (r.error ? { data: [] as { title: string }[] } : r));

    const existingTitles = new Set((existing || []).map((p) => p.title.trim().toLowerCase()));
    const reviewDue = new Date();
    reviewDue.setFullYear(reviewDue.getFullYear() + 1);
    const reviewDueStr = reviewDue.toISOString().slice(0, 10);

    let created = 0;
    for (const title of BINDER_TITLES) {
      if (existingTitles.has(title.trim().toLowerCase())) continue;
      const { error } = await supabase.from('protocols').insert({
        title,
        version: '1.0',
        status: 'draft',
        review_due_date: reviewDueStr,
        updated_at: new Date().toISOString(),
      });
      if (!error) {
        created++;
        existingTitles.add(title.trim().toLowerCase());
      }
    }

    return NextResponse.json({ created, skipped: BINDER_TITLES.length - created });
  } catch (e) {
    console.warn('[protocols seed-from-binder]', e);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}
