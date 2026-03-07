// ============================================================
// GET /api/provider-governance/dashboard
// Aggregates: medical director, backup, expirations, missing docs, unsigned protocols/orders
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const REQUIRED_DOC_TYPES = [
  'medical_director_agreement',
  'license',
  'malpractice',
  'npi',
  'dea_if_applicable',
  'confidentiality',
  'protocol_acknowledgment',
  'non_solicit',
];

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    const [
      { data: providers },
      { data: docs },
      { data: protocols },
      { data: standingOrders },
    ] = await Promise.all([
      supabase.from('providers').select('id, first_name, last_name, name, status, classification, ownership_status, end_date, is_backup_candidate, emergency_activation_flag, offboarded_at'),
      supabase.from('provider_documents').select('id, provider_id, doc_type, expiration_date, verified, upload_date'),
      supabase.from('protocols').select('protocol_id, title, version, approved_by_provider_id, approval_date, review_due_date, status'),
      supabase.from('standing_orders').select('standing_order_id, provider_id, service_type, review_due_date, status'),
    ]);

    const providersList = (providers || []).filter(
      (p: { offboarded_at?: string; status?: string }) =>
        !p.offboarded_at && (p.status === 'active' || p.status === 'suspended' || p.status == null)
    );
    const docsList = docs || [];
    const protocolsList = protocols || [];
    const ordersList = standingOrders || [];

    const activeMedicalDirector = providersList.find(
      (p: { classification?: string }) => p.classification === 'medical_director'
    );
    const backupCandidates = providersList.filter(
      (p: { is_backup_candidate?: boolean }) => p.is_backup_candidate === true
    );

    const expiringLicenses = docsList.filter(
      (d: { doc_type: string; expiration_date?: string }) =>
        d.doc_type === 'license' &&
        d.expiration_date &&
        d.expiration_date >= today &&
        d.expiration_date <= thirtyDaysFromNow
    );
    const expiringMalpractice = docsList.filter(
      (d: { doc_type: string; expiration_date?: string }) =>
        d.doc_type === 'malpractice' &&
        d.expiration_date &&
        d.expiration_date >= today &&
        d.expiration_date <= thirtyDaysFromNow
    );

    const missingDocsByProvider: { provider_id: string; provider_name: string; missing: string[] }[] = [];
    for (const p of providersList) {
      const providerDocs = docsList.filter((d: { provider_id: string }) => d.provider_id === p.id);
      const have = new Set(providerDocs.map((d: { doc_type: string }) => d.doc_type));
      const missing = REQUIRED_DOC_TYPES.filter((t) => !have.has(t));
      if (missing.length) {
        const name = p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || p.id;
        missingDocsByProvider.push({ provider_id: p.id, provider_name: name, missing });
      }
    }

    const unsignedProtocols = protocolsList.filter(
      (pr: { approved_by_provider_id?: string; status?: string }) =>
        !pr.approved_by_provider_id && (pr.status === 'draft' || pr.status === 'active')
    );
    const protocolsReviewDue = protocolsList.filter(
      (pr: { review_due_date?: string }) => pr.review_due_date && pr.review_due_date <= thirtyDaysFromNow && pr.review_due_date >= today
    );

    const standingOrdersReviewDue = ordersList.filter(
      (o: { review_due_date?: string; status?: string }) =>
        o.status === 'active' && o.review_due_date && o.review_due_date <= thirtyDaysFromNow
    );

    const expiringAgreements = docsList.filter(
      (d: { doc_type: string; expiration_date?: string }) =>
        (d.doc_type === 'medical_director_agreement' || d.doc_type === 'protocol_acknowledgment') &&
        d.expiration_date &&
        d.expiration_date >= today &&
        d.expiration_date <= thirtyDaysFromNow
    );

    const backupWithReadiness = backupCandidates.map((p: { id: string; first_name?: string; last_name?: string; name?: string; emergency_activation_flag?: boolean }) => {
      const providerDocs = docsList.filter((d: { provider_id: string }) => d.provider_id === p.id);
      const verifiedCount = providerDocs.filter((d: { verified?: boolean }) => d.verified).length;
      const requiredForBackup = ['license', 'malpractice', 'npi', 'medical_director_agreement', 'protocol_acknowledgment'];
      const have = new Set(providerDocs.map((d: { doc_type: string }) => d.doc_type));
      const missing = requiredForBackup.filter((t) => !have.has(t));
      const credentialPct = requiredForBackup.length ? Math.round((verifiedCount / requiredForBackup.length) * 100) : 0;
      const hasAgreement = providerDocs.some((d: { doc_type: string }) => d.doc_type === 'medical_director_agreement');
      const name = p.name || [p.first_name, p.last_name].filter(Boolean).join(' ') || p.id;
      return {
        provider_id: p.id,
        name,
        credential_completion_pct: credentialPct,
        agreement_status: hasAgreement ? 'signed' : 'missing',
        onboarding_readiness: missing.length === 0 && credentialPct >= 80 ? 'ready' : 'incomplete',
        emergency_activation_flag: p.emergency_activation_flag === true,
      };
    });

    return NextResponse.json({
      active_medical_director: activeMedicalDirector
        ? {
            id: activeMedicalDirector.id,
            name: activeMedicalDirector.name || [activeMedicalDirector.first_name, activeMedicalDirector.last_name].filter(Boolean).join(' ') || activeMedicalDirector.id,
          }
        : null,
      backup_providers: backupWithReadiness,
      expiring_licenses: expiringLicenses.map((d: { provider_id: string; expiration_date: string }) => ({ provider_id: d.provider_id, expiration_date: d.expiration_date })),
      expiring_malpractice: expiringMalpractice.map((d: { provider_id: string; expiration_date: string }) => ({ provider_id: d.provider_id, expiration_date: d.expiration_date })),
      missing_documents: missingDocsByProvider,
      unsigned_protocols: unsignedProtocols.map((p: { protocol_id: string; title: string; version: string }) => ({ protocol_id: p.protocol_id, title: p.title, version: p.version })),
      protocols_review_due: protocolsReviewDue.map((p: { protocol_id: string; title: string; review_due_date: string }) => ({ protocol_id: p.protocol_id, title: p.title, review_due_date: p.review_due_date })),
      standing_orders_review_due: standingOrdersReviewDue.map((o: { standing_order_id: string; provider_id: string; service_type: string; review_due_date: string }) => ({ standing_order_id: o.standing_order_id, provider_id: o.provider_id, service_type: o.service_type, review_due_date: o.review_due_date })),
      expiring_agreements: expiringAgreements.map((d: { id: string; provider_id: string; doc_type: string; expiration_date: string }) => ({ id: d.id, provider_id: d.provider_id, doc_type: d.doc_type, expiration_date: d.expiration_date })),
    });
  } catch (e) {
    console.error('[provider-governance/dashboard]', e);
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 });
  }
}
