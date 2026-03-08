'use client';

// ============================================================
// Protocol Center — list, add, edit protocols
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Protocol {
  protocol_id: string;
  title: string;
  version: string;
  status: string;
  review_due_date: string;
  approved_by_provider_id: string | null;
  approval_date: string | null;
  attachment_url?: string | null;
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

function ProtocolForm({
  protocol,
  onSave,
  onCancel,
}: {
  protocol: Protocol | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(protocol?.title ?? '');
  const [version, setVersion] = useState(protocol?.version ?? '1.0');
  const [status, setStatus] = useState(protocol?.status ?? 'draft');
  const [reviewDueDate, setReviewDueDate] = useState(
    protocol?.review_due_date?.slice(0, 10) ?? ''
  );
  const [attachmentUrl, setAttachmentUrl] = useState(protocol?.attachment_url ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!reviewDueDate) {
      setError('Review due date is required.');
      return;
    }
    setSaving(true);
    try {
      if (protocol) {
        const res = await fetch(`/api/protocols/${protocol.protocol_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            version: version.trim() || '1.0',
            status,
            review_due_date: reviewDueDate,
            attachment_url: attachmentUrl.trim() || null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || res.statusText);
        }
      } else {
        const res = await fetch('/api/protocols', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            version: version.trim() || '1.0',
            status,
            review_due_date: reviewDueDate,
            attachment_url: attachmentUrl.trim() || null,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || res.statusText);
        }
      }
      onSave();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">
            {protocol ? 'Edit protocol' : 'Add protocol'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2D63A4] focus:border-transparent"
              placeholder="e.g. Vascular Occlusion Emergency"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2D63A4] focus:border-transparent"
                placeholder="1.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2D63A4] focus:border-transparent"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Review due date *</label>
            <input
              type="date"
              value={reviewDueDate}
              onChange={(e) => setReviewDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2D63A4] focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachment URL (optional)</label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#2D63A4] focus:border-transparent"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 px-4 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#002168] disabled:opacity-50"
            >
              {saving ? 'Saving…' : protocol ? 'Save changes' : 'Add protocol'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProtocolCenterPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Protocol | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const fetchProtocols = useCallback(() => {
    fetch('/api/protocols')
      .then((r) => r.json())
      .then((data) => setProtocols(data.protocols || []))
      .catch(() => setProtocols([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this protocol? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/protocols/${id}`, { method: 'DELETE' });
      if (res.ok) fetchProtocols();
    } catch {
      // ignore
    }
  };

  const handleSeedFromBinder = async () => {
    setSeedMessage(null);
    setSeeding(true);
    try {
      const res = await fetch('/api/protocols/seed-from-binder', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Seed failed');
      const { created, skipped } = data;
      if (created > 0) fetchProtocols();
      if (created > 0 && skipped > 0) setSeedMessage(`Added ${created} protocol(s). ${skipped} already existed.`);
      else if (created > 0) setSeedMessage(`Added ${created} protocol(s) from Compliance Binder.`);
      else setSeedMessage('All binder documents are already in Protocol Center.');
    } catch (err: unknown) {
      setSeedMessage(err instanceof Error ? err.message : 'Could not seed from binder.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/clinical/guidance" className="text-sm text-[#2D63A4] hover:underline">
            ← Clinical Guidance
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Protocol Center</h1>
          <p className="text-gray-600 mt-1">
            Clinical protocols; approval by medical director. Review due dates and status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSeedFromBinder}
            disabled={seeding}
            className="px-4 py-2.5 border border-[#2D63A4] text-[#2D63A4] font-medium rounded-lg hover:bg-[#2D63A4] hover:text-white disabled:opacity-50"
          >
            {seeding ? 'Seeding…' : 'Seed from Binder'}
          </button>
          <button
            type="button"
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="px-4 py-2.5 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#002168]"
          >
            + Add protocol
          </button>
        </div>
      </div>

      {seedMessage && (
        <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm">
          {seedMessage}
        </div>
      )}

      {showForm && (
        <ProtocolForm
          protocol={editing}
          onSave={() => { setShowForm(false); setEditing(null); fetchProtocols(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : protocols.length === 0 ? (
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <p className="text-gray-600">No protocols on file yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Add your first protocol with the button above, or use the Compliance Binder for printable protocol documents.
          </p>
          <Link href="/admin/compliance/binder" className="inline-block mt-4 text-[#2D63A4] hover:underline font-medium">
            Open Compliance Binder →
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {protocols.map((p) => (
            <li
              key={p.protocol_id}
              className="p-4 rounded-xl border border-gray-200 bg-white flex flex-wrap items-center justify-between gap-2"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-black">{p.title}</p>
                <p className="text-sm text-gray-600">
                  v{p.version} · {p.status}
                  {p.review_due_date && ` · Review due ${p.review_due_date}`}
                  {p.approval_date && ` · Approved ${p.approval_date}`}
                </p>
                {p.attachment_url && (
                  <a
                    href={p.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#2D63A4] hover:underline mt-1 inline-block"
                  >
                    View attachment →
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => { setEditing(p); setShowForm(true); }}
                  className="px-3 py-1.5 text-sm font-medium text-[#2D63A4] hover:bg-blue-50 rounded-lg"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.protocol_id)}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
