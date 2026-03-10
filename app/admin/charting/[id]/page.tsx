'use client';

// ============================================================
// CHART NOTE DETAIL — View a single chart note
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const TEMPLATE_LABELS: Record<string, string> = {
  soap: 'SOAP Note',
  injection: 'Injection / Injectable',
  iv: 'IV / Vitamin',
  hormone: 'Hormone',
  general: 'General Note',
};

export default function ChartNoteDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/chart-notes?id=${id}`);
        if (!res.ok) {
          setError('Note not found');
          return;
        }
        const data = await res.json();
        setNote(data.note);
      } catch {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error || !note) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p className="text-black">{error || 'Not found'}</p>
        <Link href="/admin/charting" className="inline-block mt-3 text-[#2D63A4] font-medium">← Charting</Link>
      </div>
    );
  }

  const payload = note.payload || {};
  const backUrl = `/admin/charting?client=${note.client_id}`;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link href={backUrl} className="text-black hover:underline">← Charting</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">{note.title || 'Chart Note'}</span>
        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-black">{note.status}</span>
      </div>

      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-3 border-b border-black bg-gray-50">
          <div className="text-sm text-black">
            {new Date(note.created_at).toLocaleString('en-US')} • {note.created_by_name || '—'}
          </div>
          <div className="text-xs text-black mt-0.5">
            {TEMPLATE_LABELS[note.template_type] || note.template_type} • Client: <Link href={`/admin/clients/${note.client_id}`} className="text-[#2D63A4] hover:underline">View profile</Link>
          </div>
        </div>
        <div className="p-5 space-y-4 text-black">
          {note.template_type === 'soap' && (
            <>
              {payload.subjective && <div><span className="font-medium text-sm text-gray-600">Subjective</span><p className="mt-0.5 whitespace-pre-wrap">{String(payload.subjective)}</p></div>}
              {payload.objective && <div><span className="font-medium text-sm text-gray-600">Objective</span><p className="mt-0.5 whitespace-pre-wrap">{String(payload.objective)}</p></div>}
              {payload.assessment && <div><span className="font-medium text-sm text-gray-600">Assessment</span><p className="mt-0.5 whitespace-pre-wrap">{String(payload.assessment)}</p></div>}
              {payload.plan && <div><span className="font-medium text-sm text-gray-600">Plan</span><p className="mt-0.5 whitespace-pre-wrap">{String(payload.plan)}</p></div>}
            </>
          )}
          {(note.template_type === 'injection' || note.template_type === 'general') && (
            <>
              {payload.product && <p><span className="font-medium text-sm text-gray-600">Product:</span> {String(payload.product)}</p>}
              {(payload.units_syringes || payload.lot) && <p><span className="font-medium text-sm text-gray-600">Units/Lot:</span> {[payload.units_syringes, payload.lot].filter(Boolean).join(' • ')}</p>}
              {payload.areas && <p><span className="font-medium text-sm text-gray-600">Areas:</span> {String(payload.areas)}</p>}
              {payload.provider_name && <p><span className="font-medium text-sm text-gray-600">Provider:</span> {String(payload.provider_name)}</p>}
              {payload.consent_verified != null && <p><span className="font-medium text-sm text-gray-600">Consent verified:</span> {payload.consent_verified ? 'Yes' : 'No'}</p>}
              {payload.complications && <p><span className="font-medium text-sm text-gray-600">Complications/Notes:</span> {String(payload.complications)}</p>}
              {payload.follow_up && <p><span className="font-medium text-sm text-gray-600">Follow-up:</span> {String(payload.follow_up)}</p>}
              {payload.post_care && <p><span className="font-medium text-sm text-gray-600">Post-care:</span> {String(payload.post_care)}</p>}
            </>
          )}
          {note.template_type === 'iv' && (
            <>
              {payload.route && <p><span className="font-medium text-sm text-gray-600">Route:</span> {String(payload.route)}</p>}
              {payload.site && <p><span className="font-medium text-sm text-gray-600">Site:</span> {String(payload.site)}</p>}
              {payload.dosage && <p><span className="font-medium text-sm text-gray-600">Dosage:</span> {String(payload.dosage)}</p>}
              {payload.toleration && <p><span className="font-medium text-sm text-gray-600">Toleration:</span> {String(payload.toleration)}</p>}
              {payload.consent_verified != null && <p><span className="font-medium text-sm text-gray-600">Consent verified:</span> {payload.consent_verified ? 'Yes' : 'No'}</p>}
              {payload.follow_up && <p><span className="font-medium text-sm text-gray-600">Follow-up:</span> {String(payload.follow_up)}</p>}
            </>
          )}
          {note.template_type === 'hormone' && (
            <>
              {payload.protocol && <p><span className="font-medium text-sm text-gray-600">Protocol:</span> {String(payload.protocol)}</p>}
              {payload.follow_up_interval && <p><span className="font-medium text-sm text-gray-600">Follow-up interval:</span> {String(payload.follow_up_interval)}</p>}
              {payload.labs && <p><span className="font-medium text-sm text-gray-600">Labs:</span> {String(payload.labs)}</p>}
              {payload.response && <p><span className="font-medium text-sm text-gray-600">Response:</span> {String(payload.response)}</p>}
              {payload.consent_verified != null && <p><span className="font-medium text-sm text-gray-600">Consent verified:</span> {payload.consent_verified ? 'Yes' : 'No'}</p>}
            </>
          )}
          {Object.keys(payload).length === 0 && <p className="text-gray-500">No content recorded.</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <Link href={backUrl} className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50">← Back to Charting</Link>
        <Link href={`/admin/clients/${note.client_id}`} className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]">Client profile</Link>
      </div>
    </div>
  );
}
