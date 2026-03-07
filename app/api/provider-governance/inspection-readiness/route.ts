// ============================================================
// GET /api/provider-governance/inspection-readiness
// Phase 3: Aggregate compliance + governance + binder for inspection day
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const BINDER_SLUGS = [
  { slug: '00-README', title: 'Binder index' },
  { slug: '01-botox-complication-protocol', title: 'Botox Complication Protocol' },
  { slug: '02-vascular-occlusion-emergency-protocol', title: 'Vascular Occlusion Emergency' },
  { slug: '03-hyaluronidase-emergency-protocol', title: 'Hyaluronidase Emergency' },
  { slug: '04-laser-safety-protocol', title: 'Laser Safety' },
  { slug: '05-patient-consent-requirements', title: 'Patient Consent Requirements' },
  { slug: '06-standing-orders-injectables', title: 'Standing Orders Injectables' },
  { slug: '07-chart-audit-checklist', title: 'Chart Audit Checklist' },
  { slug: '08-illinois-idfpr-inspection-readiness', title: 'Illinois IDFPR Inspection Readiness' },
];

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const [
      { data: providers },
      { data: docs },
      { data: protocols },
      { data: recentAudits },
      { data: emergencyLogs },
    ] = await Promise.all([
      supabase.from('providers').select('id, first_name, last_name, name, classification').is('offboarded_at', null),
      supabase.from('provider_documents').select('provider_id, doc_type, expiration_date'),
      supabase.from('protocols').select('protocol_id, title, version, status, review_due_date, approved_by_provider_id').eq('status', 'active').order('review_due_date'),
      supabase.from('chart_audits').select('id, audit_date, audited_by_provider_id, status').order('audit_date', { ascending: false }).limit(5),
      supabase.from('emergency_response_log').select('id, used_at, protocol_slug, outcome').order('used_at', { ascending: false }).limit(5),
    ]);

    const medicalDirector = (providers || []).find((p: { classification?: string }) => p.classification === 'medical_director');
    const today = new Date().toISOString().slice(0, 10);
    const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const docsList = docs || [];
    const expiringLicenses = docsList.filter((d: { doc_type: string; expiration_date?: string }) => d.doc_type === 'license' && d.expiration_date && d.expiration_date >= today && d.expiration_date <= thirtyDays);
    const expiringMalpractice = docsList.filter((d: { doc_type: string; expiration_date?: string }) => d.doc_type === 'malpractice' && d.expiration_date && d.expiration_date >= today && d.expiration_date <= thirtyDays);
    const unsignedProtocols = (protocols || []).filter((p: { approved_by_provider_id?: string }) => !p.approved_by_provider_id);

    const governance = {
      medical_director: medicalDirector ? { id: medicalDirector.id, name: medicalDirector.name || [medicalDirector.first_name, medicalDirector.last_name].filter(Boolean).join(' ') } : null,
      expiring_licenses_count: expiringLicenses.length,
      expiring_malpractice_count: expiringMalpractice.length,
      unsigned_protocols_count: unsignedProtocols.length,
    };

    return NextResponse.json({
      governance,
      protocols: protocols || [],
      binder_docs: BINDER_SLUGS.map((d) => ({
        ...d,
        view_url: `/admin/compliance/binder/${d.slug}`,
      })),
      recent_chart_audits: recentAudits || [],
      recent_emergency_logs: emergencyLogs || [],
    });
  } catch (e) {
    console.error('[inspection-readiness]', e);
    return NextResponse.json({ error: 'Failed to load inspection readiness' }, { status: 500 });
  }
}
