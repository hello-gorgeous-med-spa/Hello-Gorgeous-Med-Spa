'use client';

// ============================================================
// CHARTING PORTAL — Template-driven clinical documentation
// PRD Phase 3: SOAP, injection, IV, hormone; separate from front-desk
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const TEMPLATES: { id: string; label: string; description: string; icon: string }[] = [
  { id: 'soap', label: 'SOAP Note', description: 'Subjective, Objective, Assessment, Plan', icon: '📋' },
  { id: 'injection', label: 'Injection / Injectable', description: 'Botox, filler — product, units, lot, areas', icon: '💉' },
  { id: 'iv', label: 'IV / Vitamin', description: 'Route, site, dosage, toleration', icon: '🩺' },
  { id: 'hormone', label: 'Hormone', description: 'Protocol, labs, follow-up interval', icon: '🧪' },
  { id: 'general', label: 'General Note', description: 'Free-form clinical note', icon: '📝' },
];

function ChartingContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client') || searchParams.get('client_id') || '';
  const appointmentId = searchParams.get('appointment') || searchParams.get('appointment_id') || '';

  const [client, setClient] = useState<{ id: string; first_name?: string; last_name?: string } | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(!!clientId);

  useEffect(() => {
    if (!clientId) {
      setLoadingNotes(false);
      return;
    }
    setClient({ id: clientId });
    (async () => {
      try {
        const res = await fetch(`/api/chart-notes?client_id=${clientId}&limit=10`);
        const data = await res.json();
        setNotes(data.notes || []);
      } catch {
        setNotes([]);
      } finally {
        setLoadingNotes(false);
      }
    })();
  }, [clientId]);

  const newNoteUrl = (template: string) => {
    const params = new URLSearchParams();
    params.set('template', template);
    if (clientId) params.set('client_id', clientId);
    if (appointmentId) params.set('appointment_id', appointmentId);
    return `/admin/charting/new?${params.toString()}`;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Charting</h1>
        <p className="text-black mt-1">Medical documentation — template-driven notes only.</p>
      </div>

      {clientId && (
        <div className="bg-white rounded-xl border border-black p-4 flex flex-wrap items-center gap-3">
          <span className="text-black font-medium">Client context:</span>
          <Link
            href={`/admin/clients/${clientId}`}
            className="text-[#2D63A4] font-medium hover:underline"
          >
            View profile →
          </Link>
          {appointmentId && (
            <span className="text-black text-sm">Appointment linked</span>
          )}
        </div>
      )}

      {!clientId && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-black">
          <p className="font-medium">No client selected</p>
          <p className="text-sm mt-1">
            Open charting from the Calendar (Chart / Notes on an appointment) or from a client profile → Charting tab to link the note to a client.
          </p>
          <Link href="/admin/calendar" className="inline-block mt-3 text-[#2D63A4] font-medium">
            Open Calendar →
          </Link>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold text-black mb-3">New chart note</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <Link
              key={t.id}
              href={clientId ? newNoteUrl(t.id) : '/admin/charting'}
              className={`block rounded-xl border-2 border-black p-4 transition-all ${
                clientId
                  ? 'hover:bg-[#2D63A4] hover:text-white hover:border-[#2D63A4] bg-white text-black'
                  : 'bg-gray-100 text-black border-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl block mb-2">{t.icon}</span>
              <div className="font-semibold">{t.label}</div>
              <div className={`text-sm mt-1 ${clientId ? 'opacity-90' : 'opacity-60'}`}>{t.description}</div>
            </Link>
          ))}
        </div>
        {!clientId && (
          <p className="text-sm text-black mt-2">Select a client from Calendar or Clients to create a note.</p>
        )}
      </section>

      {clientId && (
        <section>
          <h2 className="text-lg font-semibold text-black mb-3">Recent chart notes</h2>
          {loadingNotes ? (
            <div className="h-32 rounded-xl bg-gray-100 animate-pulse" />
          ) : notes.length === 0 ? (
            <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
              <span className="text-4xl block mb-2">📋</span>
              <p>No chart notes yet. Create one using a template above.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <ul className="divide-y divide-black">
                {notes.map((note) => (
                  <li key={note.id}>
                    <Link
                      href={`/admin/charting/${note.id}`}
                      className="block px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-black">{note.title || 'Chart Note'}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-black">{note.status}</span>
                      </div>
                      <div className="text-sm text-black mt-0.5">
                        {formatDate(note.created_at)} • {note.created_by_name || '—'}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <div className="flex gap-3 pt-4">
        <Link
          href="/admin/calendar"
          className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50"
        >
          ← Calendar
        </Link>
        <Link
          href="/admin/clients"
          className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50"
        >
          Clients
        </Link>
      </div>
    </div>
  );
}

export default function AdminChartingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <ChartingContent />
    </Suspense>
  );
}
