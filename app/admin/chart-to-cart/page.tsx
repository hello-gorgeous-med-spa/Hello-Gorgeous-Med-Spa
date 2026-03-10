'use client';

// ============================================================
// CHART-TO-CART — "Chart then add to cart" hub
// PRD: Integrate into Calendar + Charting; session list
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Session = {
  id: string;
  client_id: string;
  appointment_id?: string | null;
  treatment_summary?: string;
  status: string;
  products?: { name: string; quantity: number; unit_price?: number }[];
  total: number;
  started_at: string;
  provider?: string | null;
};

export default function ChartToCartPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/chart-to-cart/sessions?limit=50');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Chart-to-Cart</h1>
          <p className="text-black mt-1">Chart then add to cart — treatment sessions linked to checkout.</p>
        </div>
        <Link
          href="/admin/chart-to-cart/new"
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + New session
        </Link>
      </div>

      {loading ? (
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-black p-8 text-center text-black">
          <span className="text-4xl block mb-2">🛒</span>
          <p className="font-medium">No sessions yet</p>
          <p className="text-sm mt-1">Start from a client profile (Charting → Chart-to-Cart) or Calendar after selecting an appointment.</p>
          <Link href="/admin/chart-to-cart/new" className="inline-block mt-4 px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg">
            + New session
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-black">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Summary</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Total</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-black text-sm">{new Date(s.started_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/clients/${s.client_id}`} className="text-[#2D63A4] font-medium hover:underline">
                      {s.treatment_summary || 'Treatment'}
                    </Link>
                    <p className="text-xs text-black mt-0.5">Client ID: {s.client_id.slice(0, 8)}…</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      s.status === 'completed' ? 'bg-green-100 text-green-700' :
                      s.status === 'ready_to_checkout' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-black">${Number(s.total || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/chart-to-cart/${s.id}`} className="text-[#2D63A4] text-sm font-medium hover:underline">View</Link>
                    <span className="mx-1 text-black">·</span>
                    <Link href={`/pos?client=${s.client_id}&session=${s.id}`} className="text-[#FF2D8E] text-sm font-medium hover:underline">Checkout</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Link href="/admin/calendar" className="text-[#2D63A4] font-medium hover:underline">← Calendar</Link>
        <Link href="/admin/charting" className="text-[#2D63A4] font-medium hover:underline">Charting</Link>
      </div>
    </div>
  );
}
