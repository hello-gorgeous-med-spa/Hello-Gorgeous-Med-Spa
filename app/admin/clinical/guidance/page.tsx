'use client';

// ============================================================
// Clinical Guidance — hub for protocols, binder, governance
// ============================================================

import Link from 'next/link';

export default function ClinicalGuidancePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-black mb-2">Clinical Guidance</h1>
      <p className="text-black mb-6">
        Central place for protocols, compliance binder, and governance. Use these before or during patient care.
      </p>

      <div className="space-y-4">
        <Link
          href="/admin/compliance/binder"
          className="block p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">📑</span>
          <h2 className="font-semibold text-black mt-2">Compliance Binder</h2>
          <p className="text-sm text-gray-600 mt-1">View and print protocols, consent requirements, standing orders, IDFPR checklist.</p>
        </Link>

        <Link
          href="/admin/clinical/protocols"
          className="block p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">📋</span>
          <h2 className="font-semibold text-black mt-2">Protocol Center</h2>
          <p className="text-sm text-gray-600 mt-1">List and manage clinical protocols; review due dates and approval status.</p>
        </Link>

        <Link
          href="/admin/provider-governance"
          className="block p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">🩺</span>
          <h2 className="font-semibold text-black mt-2">Provider Governance</h2>
          <p className="text-sm text-gray-600 mt-1">Medical director, backup providers, expirations, missing docs.</p>
        </Link>

        <Link
          href="/admin/provider-governance/inspection-readiness"
          className="block p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-lg">✅</span>
          <h2 className="font-semibold text-black mt-2">Inspection Readiness</h2>
          <p className="text-sm text-gray-600 mt-1">One view for compliance, governance, binder, chart audits, emergency log.</p>
        </Link>
      </div>
    </div>
  );
}
