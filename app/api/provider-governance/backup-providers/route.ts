// ============================================================
// GET /api/provider-governance/backup-providers
// Lists backup candidates with credential completion and readiness
// ============================================================

import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/hgos/supabase';

export const dynamic = 'force-dynamic';

const REQUIRED_FOR_BACKUP = ['license', 'malpractice', 'npi', 'medical_director_agreement', 'protocol_acknowledgment'];

export async function GET() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const { data: providers } = await supabase
      .from('providers')
      .select('id, first_name, last_name, name, status, is_backup_candidate, emergency_activation_flag')
      .eq('is_backup_candidate', true);

    const { data: docs } = await supabase
      .from('provider_documents')
      .select('provider_id, doc_type, verified, expiration_date');

    const list = (providers || []).map((p: { id: string; first_name?: string; last_name?: string; name?: string; emergency_activation_flag?: boolean }) => {
      const providerDocs = (docs || []).filter((d: { provider_id: string }) => d.provider_id === p.id);
      const have = new Set(providerDocs.map((d: { doc_type: string }) => d.doc_type));
      const verifiedCount = providerDocs.filter((d: { verified?: boolean }) => d.verified).length;
      const credentialPct = REQUIRED_FOR_BACKUP.length
        ? Math.round((providerDocs.filter((d: { doc_type: string }) => REQUIRED_FOR_BACKUP.includes(d.doc_type) && d.verified).length / REQUIRED_FOR_BACKUP.length) * 100)
        : 0;
      const missing = REQUIRED_FOR_BACKUP.filter((t) => !have.has(t));
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

    return NextResponse.json({ backup_providers: list });
  } catch (e) {
    console.error('[provider-governance/backup-providers]', e);
    return NextResponse.json({ error: 'Failed to load backup providers' }, { status: 500 });
  }
}
