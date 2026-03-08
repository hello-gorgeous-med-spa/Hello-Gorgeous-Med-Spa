// ============================================================
// Emergency response log — Phase 3 (list + record)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogEntry {
  id: string;
  protocol_id?: string;
  protocol_slug?: string;
  used_at: string;
  used_by_provider_id?: string;
  outcome?: string;
  created_at: string;
}

const PROTOCOL_SLUGS = [
  '02-vascular-occlusion-emergency-protocol',
  '03-hyaluronidase-emergency-protocol',
  '01-botox-complication-protocol',
];

export default function EmergencyLogPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ protocol_slug: PROTOCOL_SLUGS[0], outcome: '' });

  const fetchList = () => {
    fetch('/api/emergency-response-log?limit=50')
      .then((r) => r.json())
      .then((json) => setLogs(json.logs || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    fetch('/api/emergency-response-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ protocol_slug: form.protocol_slug, outcome: form.outcome.trim() || undefined }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.log) {
          setLogs((prev) => [json.log, ...prev]);
          setShowForm(false);
          setForm({ protocol_slug: PROTOCOL_SLUGS[0], outcome: '' });
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
      <h1 className="text-2xl font-bold text-black mb-2">Emergency protocol usage</h1>
      <p className="text-gray-600 text-sm mb-6">Log when emergency protocols (e.g. vascular occlusion, hyaluronidase) are used.</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168]"
        >
          Log usage
        </button>
      ) : (
        <form onSubmit={submit} className="mb-6 p-4 rounded-xl border border-gray-200 bg-white space-y-3">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Protocol</label>
            <select
              value={form.protocol_slug}
              onChange={(e) => setForm((f) => ({ ...f, protocol_slug: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black"
              placeholder="e.g. Resolved with hyaluronidase"
            />
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
          {logs.map((l) => (
            <li key={l.id} className="p-3 rounded-lg border border-gray-200 bg-white text-sm">
              <span className="font-medium text-black">{l.protocol_slug || l.protocol_id || 'Protocol'}</span>
              <span className="text-gray-500 ml-2">{new Date(l.used_at).toLocaleString()}</span>
              {l.outcome && <p className="text-gray-600 mt-1">{l.outcome}</p>}
            </li>
          ))}
        </ul>
      )}
      {!loading && logs.length === 0 && !showForm && <p className="text-gray-500 text-sm">No entries yet.</p>}
    </div>
  );
}
