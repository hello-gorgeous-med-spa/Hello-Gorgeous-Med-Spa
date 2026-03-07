// ============================================================
// Inspection Readiness Dashboard — Phase 3
// Combines governance summary, protocols, binder links, chart audits, emergency logs
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface InspectionData {
  governance: {
    medical_director: { id: string; name: string } | null;
    expiring_licenses_count: number;
    expiring_malpractice_count: number;
    unsigned_protocols_count: number;
  };
  protocols: Array<{ protocol_id: string; title: string; version: string; review_due_date: string }>;
  binder_docs: Array<{ slug: string; title: string; view_url: string }>;
  recent_chart_audits: Array<{ id: string; audit_date: string; status: string }>;
  recent_emergency_logs: Array<{ id: string; used_at: string; protocol_slug: string; outcome: string }>;
}

export default function InspectionReadinessPage() {
  const [data, setData] = useState<InspectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/provider-governance/inspection-readiness')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.error);
          return;
        }
        setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading inspection readiness…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">No data.</p>
      </div>
    );
  }

  const { governance, protocols, binder_docs, recent_chart_audits, recent_emergency_logs } = data;
  const hasGaps = (governance.expiring_licenses_count + governance.expiring_malpractice_count + governance.unsigned_protocols_count) > 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Inspection Readiness</h1>
        <p className="text-black mt-1">
          One view for compliance, governance, and binder. Use before or during an inspection.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/admin/provider-governance" className="text-[#2D63A4] hover:underline text-sm">
            ← Provider Governance
          </Link>
          <Link href="/admin/compliance" className="text-[#2D63A4] hover:underline text-sm">
            Compliance dashboard
          </Link>
        </div>
      </div>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Governance snapshot</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className="text-sm">
            <span className="text-gray-600">Medical director: </span>
            {governance.medical_director ? (
              <span className="font-medium text-black">{governance.medical_director.name}</span>
            ) : (
              <span className="text-amber-700">Not assigned</span>
            )}
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Expiring licenses (30d): </span>
            <span className={governance.expiring_licenses_count > 0 ? 'text-amber-700 font-medium' : 'text-black'}>{governance.expiring_licenses_count}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Expiring malpractice (30d): </span>
            <span className={governance.expiring_malpractice_count > 0 ? 'text-amber-700 font-medium' : 'text-black'}>{governance.expiring_malpractice_count}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600">Unsigned protocols: </span>
            <span className={governance.unsigned_protocols_count > 0 ? 'text-amber-700 font-medium' : 'text-black'}>{governance.unsigned_protocols_count}</span>
          </p>
        </div>
        {hasGaps && (
          <p className="mt-2 text-sm text-amber-700">Address items above before inspection.</p>
        )}
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Compliance binder</h2>
        <p className="text-sm text-gray-600 mb-3">View and print each document as needed.</p>
        <ul className="space-y-2">
          {binder_docs.map((d) => (
            <li key={d.slug}>
              <Link href={d.view_url} className="text-[#2D63A4] hover:underline font-medium">
                {d.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Active protocols</h2>
        {protocols.length === 0 ? (
          <p className="text-gray-600 text-sm">No active protocols on file.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {protocols.map((p) => (
              <li key={p.protocol_id}>
                <span className="font-medium text-black">{p.title}</span>
                <span className="text-gray-500"> v{p.version}</span>
                {p.review_due_date && <span className="text-gray-500"> — review {p.review_due_date}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-8 sm:grid-cols-2">
        <section className="p-4 rounded-xl border border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-black mb-2">Recent chart audits</h2>
          <Link href="/admin/provider-governance/chart-audits" className="text-sm text-[#2D63A4] hover:underline mb-2 inline-block">View all / New audit</Link>
          {recent_chart_audits.length === 0 ? (
            <p className="text-gray-500 text-sm">None yet.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {recent_chart_audits.map((a) => (
                <li key={a.id}>{a.audit_date} — {a.status}</li>
              ))}
            </ul>
          )}
        </section>
        <section className="p-4 rounded-xl border border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-black mb-2">Emergency response log</h2>
          <Link href="/admin/provider-governance/emergency-log" className="text-sm text-[#2D63A4] hover:underline mb-2 inline-block">View all / Log incident</Link>
          {recent_emergency_logs.length === 0 ? (
            <p className="text-gray-500 text-sm">No entries.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {recent_emergency_logs.map((l) => (
                <li key={l.id}>
                  {new Date(l.used_at).toLocaleString()} — {l.protocol_slug || 'protocol'} {l.outcome ? `(${l.outcome})` : ''}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
