// ============================================================
// Offboarding checklist view — print/PDF for a provider
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Checklist {
  provider_id: string;
  provider_name: string;
  offboarded_at?: string;
  end_date?: string;
  status?: string;
  steps: Array< { done: boolean; label: string }>;
}

export default function OffboardingChecklistPage() {
  const params = useParams();
  const id = params?.id as string;
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`/api/providers/${id}/offboarding-checklist`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setChecklist(data);
      })
      .catch((e) => setError(String(e.message)))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600">No provider ID. Open from Provider Management after offboarding.</p>
        <Link href="/admin/team/providers" className="text-[#2D63A4] hover:underline mt-2 inline-block">
          Provider Management
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-black">Loading checklist…</p>
      </div>
    );
  }

  if (error || !checklist) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-red-600">{error || 'Checklist not found'}</p>
        <Link href="/admin/provider-governance" className="text-[#2D63A4] hover:underline mt-2 inline-block">
          Provider Governance
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 print:max-w-none">
      <div className="mb-6 flex flex-wrap items-center gap-3 no-print">
        <Link href="/admin/provider-governance" className="text-sm text-[#2D63A4] hover:underline">
          ← Provider Governance
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="p-6 border border-gray-200 rounded-xl bg-white">
        <h1 className="text-xl font-bold text-black mb-1">Offboarding Checklist</h1>
        <p className="text-black font-medium">{checklist.provider_name}</p>
        <p className="text-sm text-gray-600 mt-1">
          Offboarded: {checklist.offboarded_at ? new Date(checklist.offboarded_at).toLocaleString() : '—'} · End date: {checklist.end_date || '—'} · Status: {checklist.status || '—'}
        </p>

        <ul className="mt-6 space-y-2">
          {checklist.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={step.done ? 'text-green-600 font-bold' : 'text-gray-400'}>
                {step.done ? '✓' : '○'}
              </span>
              <span className={step.done ? 'text-gray-700' : 'text-black'}>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
