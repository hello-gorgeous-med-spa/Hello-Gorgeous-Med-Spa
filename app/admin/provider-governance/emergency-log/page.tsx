// ============================================================
// Emergency response log — list and log (Phase 3)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PROTOCOL_SLUGS = [
  'vascular-occlusion',
  'hyaluronidase',
  'botox-complication',
  'laser-safety',
  'other',
];

interface LogEntry {
  id: string;
  used_at: string;
  protocol_slug: string | null;
  protocol_id: string | null;
  outcome: string | null;
  used_by?: { first_name?: string; last_name?: string; name?: string };
}

export default function EmergencyLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ protocol_slug: 'vascular-occlusion', outcome: '' });

  const fetchLogs = () => {
    fetch('/api/emergency-response-log')
      .then((r) => r.json())
      .then((json) => {
        if (json.logs) setLogs(json.logs);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    fetch('/api/emergency-response-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        protocol_slug: form.protocol_slug,
        outcome: form.outcome.trim() || null,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.log) {
          setLogs((prev) => [json.log, ...prev]);
          setShowForm(false);
          setForm({ protocol_slug: 'vascular-occlusion', outcome: '' });
        }
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/provider-governance/inspection-readiness" className="text-sm text-[#2D63A4] hover:underline">
          ← Inspection Readiness
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Emergency response log</h1>
      <p className="text-gray-600 text-sm mb-6">Log when an emergency protocol (e.g. vascular occlusion, hyaluronidase) is used.</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          Log incident
        </button>
      ) : (
        <form onSubmit={submit} className="mb-8 p-4 rounded-xl border border-gray-200 bg-white space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Protocol used</label>
            <select
              value={form.protocol_slug}
              onChange={(e) => setForm((f) => ({ ...f, protocol_slug: e.target.value }))}
              className="w-full max-w-xs border border-gray-300 rounded-lg px-3 py-2 text-black"
            >
              {PROTOCOL_SLUGS.map((s) => (
                <option key={s} value={s}>{s.replace(/-/g, ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Outcome (optional)</label>
            <input
              type="text"
              value={form.outcome}
              onChange={(e) => setForm((f) => ({ ...f, outcome: e.target.value }))}
              placeholder="e.g. Resolved with hyaluronidase"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168] disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save log'}
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

      <h2 className="text-lg font-semibold text-black mb-3">Log entries</h2>
      {loading ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-500 text-sm">No entries yet.</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((l) => (
            <li key={l.id} className="p-4 rounded-xl border border-gray-200 bg-white text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-black">
                  {new Date(l.used_at).toLocaleString()}
                </span>
                <span className="text-gray-600">{l.protocol_slug || 'protocol'}</span>
                {l.outcome && <span className="text-gray-700">— {l.outcome}</span>}
              </div>
              {l.used_by && (
                <p className="text-gray-500 mt-1">
                  By {l.used_by.name || [l.used_by.first_name, l.used_by.last_name].filter(Boolean).join(' ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
