// ============================================================
// Backup providers — list and emergency activation flag
// ============================================================

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type BackupProvider = {
  provider_id: string;
  name: string;
  credential_completion_pct: number;
  agreement_status: string;
  onboarding_readiness: string;
  emergency_activation_flag: boolean;
};

export default function BackupProvidersPage() {
  const [list, setList] = useState<BackupProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchList = () => {
    fetch('/api/provider-governance/backup-providers')
      .then((r) => r.json())
      .then((d) => setList(d.backup_providers || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const toggleEmergency = (providerId: string, current: boolean) => {
    setToggling(providerId);
    fetch(`/api/providers/${providerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emergency_activation_flag: !current }),
    })
      .then((r) => (r.ok ? fetchList() : Promise.reject()))
      .finally(() => setToggling(null));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-black">Loading backup providers…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/provider-governance" className="text-[#2D63A4] hover:underline text-sm">
          ← Provider Governance
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Backup Providers</h1>
      <p className="text-gray-600 mb-6">
        Credential completion and emergency activation. Only medical director / super_owner should set emergency flag.
      </p>

      {list.length === 0 ? (
        <p className="text-gray-600">No backup candidates. Mark providers as backup in provider settings (is_backup_candidate).</p>
      ) : (
        <ul className="space-y-4">
          {list.map((bp) => (
            <li
              key={bp.provider_id}
              className="p-4 rounded-xl border border-gray-200 bg-white flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <span className="font-medium text-black">{bp.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  {bp.credential_completion_pct}% credentials · {bp.agreement_status} · {bp.onboarding_readiness}
                </span>
              </div>
              <button
                type="button"
                onClick={() => toggleEmergency(bp.provider_id, bp.emergency_activation_flag)}
                disabled={toggling === bp.provider_id}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  bp.emergency_activation_flag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {toggling === bp.provider_id ? '…' : bp.emergency_activation_flag ? 'Emergency on' : 'Set emergency'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
