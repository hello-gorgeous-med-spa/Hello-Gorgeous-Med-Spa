// ============================================================
// Chart audit checklist — Phase 3 (list + record)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Audit {
  id: string;
  chart_id?: string;
  appointment_id?: string;
  audited_by_provider_id?: string;
  audit_date: string;
  checklist_result: unknown[];
  status: string;
  created_at: string;
}

export default function ChartAuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ audit_date: new Date().toISOString().slice(0, 10), checklist_result: [] as unknown[], status: 'completed' as string });

  const fetchList = () => {
    fetch('/api/chart-audits?limit=50')
      .then((r) => r.json())
      .then((json) => setAudits(json.audits || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    fetch('/api/chart-audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.audit) {
          setAudits((prev) => [json.audit, ...prev]);
          setShowForm(false);
          setForm({ audit_date: new Date().toISOString().slice(0, 10), checklist_result: [], status: 'completed' });
        }
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/compliance/inspection" className="text-sm text-[#2D63A4] hover:underline">
          ← Inspection readiness
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Chart audits</h1>
      <p className="text-gray-600 text-sm mb-6">Record chart audit checklist completions for compliance.</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          Record audit
        </button>
      ) : (
        <form onSubmit={submit} className="mb-6 p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Audit date</label>
            <input
              type="date"
              value={form.audit_date}
              onChange={(e) => setForm((f) => ({ ...f, audit_date: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-black"
            >
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <ul className="space-y-2">
          {audits.map((a) => (
            <li key={a.id} className="p-3 rounded-lg border border-gray-200 bg-white text-sm">
              <span className="font-medium text-black">{a.audit_date}</span>
              <span className="text-gray-500 ml-2">— {a.status}</span>
              {a.checklist_result?.length > 0 && <span className="text-gray-500 ml-2">({a.checklist_result.length} items)</span>}
            </li>
          ))}
        </ul>
      )}
      {!loading && audits.length === 0 && !showForm && <p className="text-gray-500 text-sm">No audits yet.</p>}
    </div>
  );
}
