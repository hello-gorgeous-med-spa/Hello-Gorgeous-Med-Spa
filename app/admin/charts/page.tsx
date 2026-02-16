// ADMIN CHARTS PAGE - List all chart notes or redirect with params
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ChartsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('appointment');
  const clientId = searchParams.get('client');

  // If params provided, redirect to charting page
  useEffect(() => {
    if (appointmentId || clientId) {
      const params = new URLSearchParams();
      if (appointmentId) params.set('appointment', appointmentId);
      if (clientId) params.set('client', clientId);
      router.replace(`/admin/charting?${params.toString()}`);
    }
  }, [appointmentId, clientId, router]);

  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent chart notes
  useEffect(() => {
    if (!appointmentId && !clientId) {
      fetch('/api/chart-notes?limit=20')
        .then(res => res.json())
        .then(data => {
          setRecentNotes(data.notes || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [appointmentId, clientId]);

  // If redirecting, show loading
  if (appointmentId || clientId) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Chart Notes</h1>
          <p className="text-black">Clinical documentation and SOAP notes</p>
        </div>
        <Link
          href="/admin/appointments"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + New Chart (Select Appointment)
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : recentNotes.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-black mb-4">No chart notes yet</p>
            <Link href="/admin/appointments" className="text-pink-600 hover:text-pink-700 font-medium">
              Go to appointments to create a chart
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Date</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Client</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Provider</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentNotes.map((note) => (
                <tr key={note.id} className="hover:bg-white">
                  <td className="px-5 py-3 text-black">
                    {new Date(note.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-black">
                    {note.client_name || 'Client'}
                  </td>
                  <td className="px-5 py-3 text-black">
                    {note.provider_name || 'Provider'}
                  </td>
                  <td className="px-5 py-3">
                    {note.signed_at ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        ✓ Signed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/admin/charting?appointment=${note.appointment_id}`}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function AdminChartsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    }>
      <ChartsContent />
    </Suspense>
  );
}
