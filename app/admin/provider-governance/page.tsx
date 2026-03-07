// ============================================================
// Provider Governance Dashboard
// Medical director, backup providers, expirations, missing docs, protocols
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  active_medical_director: { id: string; name: string } | null;
  backup_providers: Array<{
    provider_id: string;
    name: string;
    credential_completion_pct: number;
    agreement_status: string;
    onboarding_readiness: string;
    emergency_activation_flag: boolean;
  }>;
  expiring_licenses: Array<{ provider_id: string; expiration_date: string }>;
  expiring_malpractice: Array<{ provider_id: string; expiration_date: string }>;
  missing_documents: Array<{ provider_id: string; provider_name: string; missing: string[] }>;
  unsigned_protocols: Array<{ protocol_id: string; title: string; version: string }>;
  protocols_review_due: Array<{ protocol_id: string; title: string; review_due_date: string }>;
  standing_orders_review_due: Array<{ standing_order_id: string; provider_id: string; service_type: string; review_due_date: string }>;
  expiring_agreements: Array<{ id: string; provider_id: string; doc_type: string; expiration_date: string }>;
}

export default function ProviderGovernancePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/provider-governance/dashboard')
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
        <p className="text-gray-600">Loading provider governance…</p>
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Provider Governance</h1>
        <p className="text-black mt-1">
          Medical director, backup readiness, expirations, and compliance. Administrative or operational access does not create ownership rights.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link
            href="/admin/team/providers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Provider management (offboard)
          </Link>
          <Link
            href="/admin/exports/requests"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Export requests
          </Link>
          <Link
            href="/admin/settings/asset-registry"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Asset registry
          </Link>
          <Link
            href="/admin/provider-governance/inspection-readiness"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Inspection readiness
          </Link>
          <Link
            href="/admin/provider-governance/chart-audits"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Chart audits
          </Link>
          <Link
            href="/admin/provider-governance/emergency-log"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
          >
            Emergency log
          </Link>
        </div>
      </div>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Medical Director</h2>
        {data.active_medical_director ? (
          <p className="text-black">
            <span className="font-medium">{data.active_medical_director.name}</span>
          </p>
        ) : (
          <p className="text-amber-700">No active medical director assigned.</p>
        )}
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Backup Providers</h2>
        {data.backup_providers.length === 0 ? (
          <p className="text-gray-600">No backup candidates.</p>
        ) : (
          <ul className="space-y-2">
            {data.backup_providers.map((b) => (
              <li key={b.provider_id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-black">{b.name}</span>
                <span className="text-gray-600">— {b.credential_completion_pct}% credentials</span>
                <span className={b.onboarding_readiness === 'ready' ? 'text-green-600' : 'text-amber-600'}>
                  {b.onboarding_readiness}
                </span>
                {b.emergency_activation_flag && <span className="text-blue-600">Emergency flag on</span>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Expiring Soon (30 days)</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Licenses</h3>
            {data.expiring_licenses.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <ul className="text-sm text-black">
                {data.expiring_licenses.map((x, i) => (
                  <li key={i}>Provider {x.provider_id.slice(0, 8)}… — {x.expiration_date}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Malpractice</h3>
            {data.expiring_malpractice.length === 0 ? (
              <p className="text-sm text-gray-500">None</p>
            ) : (
              <ul className="text-sm text-black">
                {data.expiring_malpractice.map((x, i) => (
                  <li key={i}>Provider {x.provider_id.slice(0, 8)}… — {x.expiration_date}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {data.expiring_agreements.length > 0 && (
          <div className="mt-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Agreements</h3>
            <ul className="text-sm text-black">
              {data.expiring_agreements.map((a) => (
                <li key={a.id}>{a.doc_type} — {a.expiration_date}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Missing Documents</h2>
        {data.missing_documents.length === 0 ? (
          <p className="text-gray-600">No missing required documents.</p>
        ) : (
          <ul className="space-y-2">
            {data.missing_documents.map((m) => (
              <li key={m.provider_id} className="text-sm">
                <span className="font-medium text-black">{m.provider_name}</span>
                <span className="text-gray-600"> — {m.missing.join(', ')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 p-4 rounded-xl border border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-black mb-2">Protocols & Standing Orders</h2>
        {data.unsigned_protocols.length > 0 && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Unsigned protocols</h3>
            <ul className="text-sm text-black">
              {data.unsigned_protocols.map((p) => (
                <li key={p.protocol_id}>{p.title} (v{p.version})</li>
              ))}
            </ul>
          </div>
        )}
        {data.protocols_review_due.length > 0 && (
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Protocols review due</h3>
            <ul className="text-sm text-black">
              {data.protocols_review_due.map((p) => (
                <li key={p.protocol_id}>{p.title} — {p.review_due_date}</li>
              ))}
            </ul>
          </div>
        )}
        {data.standing_orders_review_due.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Standing orders review due</h3>
            <ul className="text-sm text-black">
              {data.standing_orders_review_due.map((o) => (
                <li key={o.standing_order_id}>{o.service_type} — {o.review_due_date}</li>
              ))}
            </ul>
          </div>
        )}
        {data.unsigned_protocols.length === 0 &&
          data.protocols_review_due.length === 0 &&
          data.standing_orders_review_due.length === 0 && (
            <p className="text-gray-600">No outstanding protocol or standing order items.</p>
          )}
      </section>
    </div>
  );
}
