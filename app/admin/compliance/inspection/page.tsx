// ============================================================
// Inspection Readiness Dashboard — Phase 3
// Combines compliance + governance + binder in one view
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GovData {
  active_medical_director: { id: string; name: string } | null;
  expiring_licenses: unknown[];
  expiring_malpractice: unknown[];
  missing_documents: Array<{ provider_name: string; missing: string[] }>;
  unsigned_protocols: unknown[];
  backup_providers: unknown[];
}

export default function InspectionReadinessPage() {
  const [gov, setGov] = useState<GovData | null>(null);
  const [auditCount, setAuditCount] = useState<number | null>(null);
  const [emergencyLogCount, setEmergencyLogCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/provider-governance/dashboard').then((r) => r.json()),
      fetch('/api/chart-audits?limit=200').then((r) => r.json()),
      fetch('/api/emergency-response-log?limit=200').then((r) => r.json()),
    ]).then(([govJson, auditsJson, logsJson]) => {
      if (cancelled) return;
      if (!govJson.error) setGov(govJson);
      setAuditCount(Array.isArray(auditsJson.audits) ? auditsJson.audits.length : 0);
      setEmergencyLogCount(Array.isArray(logsJson.logs) ? logsJson.logs.length : 0);
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading inspection readiness…</p>
      </div>
    );
  }

  const hasGaps = gov && (
    !gov.active_medical_director ||
    gov.expiring_licenses?.length > 0 ||
    gov.expiring_malpractice?.length > 0 ||
    gov.missing_documents?.length > 0 ||
    gov.unsigned_protocols?.length > 0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Inspection Readiness</h1>
        <p className="text-black mt-1">
          One view for compliance, provider governance, and binder. Use before an inspection or audit.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Link
          href="/admin/compliance/binder"
          className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#2D63A4] hover:bg-blue-50/50"
        >
          <h2 className="font-semibold text-black">Compliance Binder</h2>
          <p className="text-sm text-gray-600 mt-1">Protocols, consent requirements, standing orders, IDFPR checklist</p>
        </Link>
        <Link
          href="/admin/provider-governance"
          className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#2D63A4] hover:bg-blue-50/50"
        >
          <h2 className="font-semibold text-black">Provider Governance</h2>
          <p className="text-sm text-gray-600 mt-1">Medical director, backup, expirations, missing docs</p>
        </Link>
        <Link
          href="/admin/compliance"
          className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#2D63A4] hover:bg-blue-50/50"
        >
          <h2 className="font-semibold text-black">Compliance Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Credentials, consents, inventory, audit</p>
        </Link>
        <Link
          href="/admin/compliance/chart-audits"
          className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-[#2D63A4] hover:bg-blue-50/50"
        >
          <h2 className="font-semibold text-black">Chart Audits</h2>
          <p className="text-sm text-gray-600 mt-1">{auditCount !== null ? `${auditCount} audit(s) recorded` : 'Checklist workflow'}</p>
        </Link>
      </div>

      {gov && (
        <section className="p-4 rounded-xl border border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-black mb-3">Readiness snapshot</h2>
          {hasGaps ? (
            <ul className="space-y-2 text-sm text-amber-800">
              {!gov.active_medical_director && <li>• No active medical director assigned</li>}
              {(gov.expiring_licenses?.length ?? 0) > 0 && <li>• Licenses expiring within 30 days</li>}
              {(gov.expiring_malpractice?.length ?? 0) > 0 && <li>• Malpractice expiring within 30 days</li>}
              {(gov.missing_documents?.length ?? 0) > 0 && <li>• Missing required provider documents</li>}
              {(gov.unsigned_protocols?.length ?? 0) > 0 && <li>• Unsigned protocols</li>}
            </ul>
          ) : (
            <p className="text-green-700 text-sm">No critical gaps in this snapshot. Still verify binder and compliance dashboard.</p>
          )}
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/compliance/emergency-log" className="text-sm text-[#2D63A4] hover:underline">
          Emergency protocol usage log {emergencyLogCount != null ? `(${emergencyLogCount})` : ''}
        </Link>
      </div>
    </div>
  );
}
