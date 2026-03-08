'use client';

// ============================================================
// Protocol Center — list protocols (approval, review due)
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Protocol {
  protocol_id: string;
  title: string;
  version: string;
  status: string;
  review_due_date: string;
  approved_by_provider_id: string | null;
  approval_date: string | null;
}

export default function ProtocolCenterPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/protocols')
      .then((r) => r.json())
      .then((data) => {
        setProtocols(data.protocols || []);
      })
      .catch(() => setProtocols([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <Link href="/admin/clinical/guidance" className="text-sm text-[#2D63A4] hover:underline">
          ← Clinical Guidance
        </Link>
      </div>
      <h1 className="text-2xl font-bold text-black mb-2">Protocol Center</h1>
      <p className="text-black mb-6">
        Clinical protocols; approval by medical director. Review due dates and status.
      </p>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : protocols.length === 0 ? (
        <div className="p-6 rounded-xl border border-gray-200 bg-white">
          <p className="text-gray-600">No protocols on file yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Add protocols via your database or a future admin form. You can use the Compliance Binder for printable protocol documents.
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
              <div>
                <p className="font-semibold text-black">{p.title}</p>
                <p className="text-sm text-gray-600">
                  v{p.version} · {p.status}
                  {p.review_due_date && ` · Review due ${p.review_due_date}`}
                  {p.approval_date && ` · Approved ${p.approval_date}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
