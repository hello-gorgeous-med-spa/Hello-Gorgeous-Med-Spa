// ============================================================
// Chart audit checklist — list and create (Phase 3)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEFAULT_ITEMS = [
  { id: 'consent', label: 'Consent documented', checked: false },
  { id: 'treatment', label: 'Treatment and sites documented', checked: false },
  { id: 'lot', label: 'Product/lot documented if applicable', checked: false },
  { id: 'followup', label: 'Follow-up plan documented', checked: false },
];

interface Audit {
  id: string;
  audit_date: string;
  checklist_result: Array<{ id: string; label: string; checked: boolean }>;
  status: string;
  audited_by?: { first_name?: string; last_name?: string; name?: string };
}

export default function ChartAuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checklist, setChecklist] = useState(DEFAULT_ITEMS);
  const [auditDate, setAuditDate] = useState(() => new Date().toISOString().slice(0, 10));

  const fetchAudits = () => {
    fetch('/api/chart-audits')
      .then((r) => r.json())
      .then((json) => {
        if (json.audits) setAudits(json.audits);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    fetch('/api/chart-audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audit_date: auditDate,
        checklist_result: checklist,
        status: 'completed',
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.audit) {
          setAudits((prev) => [json.audit, ...prev]);
          setShowForm(false);
          setChecklist(DEFAULT_ITEMS);
          setAuditDate(new Date().toISOString().slice(0, 10));
        }
      })
      .finally(() => setSaving(false));
  };

  const toggleItem = (id: string) => {
    setChecklist((prev) => prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/provider-governance/inspection-readiness" className="text-sm text-[#2D63A4] hover:underline">
          ← Inspection Readiness
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Chart audit checklist</h1>
      <p className="text-gray-600 text-sm mb-6">Record chart audits for compliance and inspection readiness.</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          New audit
        </button>
      ) : (
        <form onSubmit={submit} className="mb-8 p-4 rounded-xl border border-gray-200 bg-white space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Audit date</label>
            <input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Checklist</label>
            <ul className="space-y-2">
              {checklist.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-black">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save audit'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h2 className="text-lg font-semibold text-black mb-3">Recent audits</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : audits.length === 0 ? (
        <p className="text-gray-500 text-sm">No audits yet.</p>
      ) : (
        <ul className="space-y-3">
          {audits.map((a) => (
            <li key={a.id} className="p-4 rounded-xl border border-gray-200 bg-white text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-black">{a.audit_date}</span>
                <span className="text-gray-500">{a.status}</span>
                {a.audited_by && (
                  <span className="text-gray-600">
                    — {a.audited_by.name || [a.audited_by.first_name, a.audited_by.last_name].filter(Boolean).join(' ')}
                  </span>
                )}
              </div>
              {a.checklist_result && a.checklist_result.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {a.checklist_result.map((c) => (
                    <li key={c.id} className={c.checked ? 'text-green-600' : 'text-gray-400'}>
                      {c.checked ? '✓' : '○'} {c.label}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
