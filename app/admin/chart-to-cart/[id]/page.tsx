'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ChartToCartSessionPage() {
  const params = useParams();
  const id = params?.id as string;
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/chart-to-cart/sessions/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.session) setSession(d.session);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (!session) {
    return (
      <div className="p-6">
        <p className="text-black">Session not found</p>
        <Link href="/admin/chart-to-cart" className="inline-block mt-2 text-[#2D63A4] font-medium">← Chart-to-Cart</Link>
      </div>
    );
  }

  const products = session.products || [];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/chart-to-cart" className="text-black hover:underline">← Chart-to-Cart</Link>
        <span className="text-black">/</span>
        <span className="font-semibold text-black">Session</span>
      </div>

      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black flex justify-between items-center">
          <h1 className="font-bold text-black">{session.treatment_summary || 'Treatment session'}</h1>
          <span className={`text-xs px-2 py-0.5 rounded ${session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {session.status?.replace('_', ' ')}
          </span>
        </div>
        <div className="p-5 space-y-3 text-black">
          <p className="text-sm"><strong>Date:</strong> {new Date(session.started_at).toLocaleString()}</p>
          {session.provider && <p className="text-sm"><strong>Provider:</strong> {session.provider}</p>}
          <p className="text-sm"><strong>Client:</strong> <Link href={`/admin/clients/${session.client_id}`} className="text-[#2D63A4] hover:underline">View profile</Link></p>
          {products.length > 0 && (
            <div className="pt-2">
              <p className="font-medium text-sm mb-2">Line items</p>
              <ul className="divide-y divide-black">
                {products.map((p: any, i: number) => (
                  <li key={i} className="py-2 flex justify-between text-sm">
                    <span>{p.name} × {p.quantity}</span>
                    <span>${(Number(p.quantity) * Number(p.unit_price || 0)).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="font-semibold pt-2">Total: ${Number(session.total || 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/pos?client=${session.client_id}&session=${id}`}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-pink-600"
        >
          Checkout →
        </Link>
        <Link href={`/admin/clients/${session.client_id}`} className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">
          Client profile
        </Link>
      </div>
    </div>
  );
}
