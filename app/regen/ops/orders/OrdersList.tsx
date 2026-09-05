'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total?: number;
  pharmacy_order_id?: string | null;
  pharmacyError?: string | null;
  pharmacy_error?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  intake_id?: string | null;
  created_at: string;
  items?: Array<{ name?: string }>;
}

export default function OrdersList({ initialOrders = [] }: { initialOrders?: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/regen/ops/orders?status=all', { cache: 'no-store' });
    const j = await res.json();
    setOrders(j.orders || []);
    setLoading(false);
  }, []);

  async function saveTracking(order: Order) {
    const number = tracking[order.id];
    if (!number) return;
    await fetch('/api/regen/ops/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: order.id, status: 'shipped', tracking_number: number, tracking_carrier: 'USPS' }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-white/50">Real Formulation / local fulfill rows only</p>
        </div>
        <button onClick={load} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Refresh</button>
      </div>
      {loading && <p className="text-white/40">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-10 text-center text-white/50">No orders yet. Approve a visit on Today to create one.</div>
      )}
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white font-semibold">{o.order_number}</p>
            <p className="text-white/50 text-sm">
              {o.items?.[0]?.name || 'REGEN RX'} · {o.status}
              {o.total != null ? ` · $${o.total}` : ''}
            </p>
            {o.pharmacy_order_id ? (
              <p className="text-teal-300 text-sm mt-2">Formulation id: {o.pharmacy_order_id}</p>
            ) : (
              <p className="text-amber-300 text-sm mt-2">No Formulation id — send this Rx in the Formulation portal, then add tracking.</p>
            )}
            {(o.pharmacyError || o.pharmacy_error) && (
              <p className="text-red-400 text-sm mt-2">{o.pharmacyError || o.pharmacy_error}</p>
            )}
            {o.tracking_number && (
              <p className="text-white/70 text-sm mt-1">{o.tracking_carrier} {o.tracking_number}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <input
                value={tracking[o.id] || ''}
                onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })}
                placeholder="Tracking number"
                className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
              />
              <button onClick={() => saveTracking(o)} className="px-3 py-2 rounded-lg bg-teal-500 text-white text-sm">Mark shipped</button>
              {o.intake_id && (
                <Link href="/ops" className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm">Today</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
