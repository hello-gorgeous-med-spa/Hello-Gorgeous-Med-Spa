// ============================================================
// Export requests queue — approve/deny (super_owner)
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ExportRequest {
  id: string;
  type: string;
  scope?: Record<string, unknown>;
  requested_by: string;
  status: string;
  approved_by?: string;
  denied_by?: string;
  resolved_at?: string;
  result_url?: string;
  created_at: string;
}

export default function ExportRequestsPage() {
  const [requests, setRequests] = useState<ExportRequest[]>([]);
  const [pending, setPending] = useState<ExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchList = () => {
    fetch('/api/exports/requests')
      .then((r) => r.json())
      .then((json) => {
        if (json.error) return;
        setRequests(json.requests || []);
        setPending(json.pending || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const approve = (id: string) => {
    setActing(id);
    fetch(`/api/exports/requests/${id}/approve`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) fetchList();
      })
      .finally(() => setActing(null));
  };

  const deny = (id: string) => {
    setActing(id);
    fetch(`/api/exports/requests/${id}/deny`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) fetchList();
      })
      .finally(() => setActing(null));
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-black">Loading export requests…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/provider-governance"
          className="text-sm text-[#2D63A4] hover:underline"
        >
          ← Provider Governance
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Export requests</h1>
      <p className="text-gray-600 text-sm mb-6">
        Pending exports require super_owner approval. Approve to generate the export; deny to reject.
      </p>

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-3">Pending</h2>
          <ul className="space-y-3">
            {pending.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-black">{r.type}</span>
                  <span className="text-gray-600 text-sm ml-2">
                    requested {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approve(r.id)}
                    disabled={acting === r.id}
                    className="px-4 py-2 rounded-lg bg-[#2D63A4] text-white text-sm font-medium hover:bg-[#002168] disabled:opacity-50"
                  >
                    {acting === r.id ? '…' : 'Approve'}
                  </button>
                  <button
                    onClick={() => deny(r.id)}
                    disabled={acting === r.id}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
                  >
                    Deny
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-black mb-3">Resolved</h2>
        {requests.filter((r) => r.status !== 'pending').length === 0 ? (
          <p className="text-gray-600 text-sm">No resolved requests yet.</p>
        ) : (
          <ul className="space-y-2">
            {requests
              .filter((r) => r.status !== 'pending')
              .map((r) => (
                <li
                  key={r.id}
                  className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white text-sm"
                >
                  <span className="font-medium">{r.type}</span>
                  <span className={r.status === 'approved' ? 'text-green-600' : 'text-red-600'}>
                    {r.status}
                  </span>
                  <span className="text-gray-500">
                    {r.resolved_at ? new Date(r.resolved_at).toLocaleString() : ''}
                  </span>
                  {r.status === 'approved' && r.result_url && (
                    <Link href={r.result_url} className="text-[#2D63A4] hover:underline">
                      View result
                    </Link>
                  )}
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
