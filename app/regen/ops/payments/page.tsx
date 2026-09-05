'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

type Order = {
  id: string;
  order_number?: string;
  status?: string;
  total?: number;
  amount?: number;
  created_at: string;
  pharmacy_order_id?: string | null;
};

export default function PaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<{ revenue?: { today: number; week: number; month: number } } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [oRes, sRes] = await Promise.all([
      fetch('/api/regen/ops/orders?status=all', { cache: 'no-store' }),
      fetch('/api/regen/ops/stats'),
    ]);
    if (oRes.ok) {
      const j = await oRes.json();
      setOrders(j.orders || []);
    }
    if (sRes.ok) setStats(await sRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <p className="text-white/50">Stripe totals and paid fulfill rows. Empty means nobody has paid yet.</p>
        </div>
        <button onClick={load} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Refresh</button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-sm">Today</p>
          <p className="text-white text-2xl font-bold">${(stats?.revenue?.today || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-sm">This week</p>
          <p className="text-white text-2xl font-bold">${(stats?.revenue?.week || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-white/40 text-sm">This month</p>
          <p className="text-white text-2xl font-bold">${(stats?.revenue?.month || 0).toLocaleString()}</p>
        </div>
      </div>

      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">
          No paid orders yet. Approve a visit on Today after checkout.
        </div>
      )}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-medium">{o.order_number || o.id}</p>
              <p className="text-white/45 text-sm">{o.status} · {new Date(o.created_at).toLocaleString()}</p>
              {o.pharmacy_order_id && <p className="text-teal-400 text-xs mt-1">{o.pharmacy_order_id}</p>}
            </div>
            <p className="text-white text-xl font-bold">${Number(o.total ?? o.amount ?? 0).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <Link href="/ops/reports" className="inline-block text-teal-400 text-sm">Open reports →</Link>
    </div>
  );
}
