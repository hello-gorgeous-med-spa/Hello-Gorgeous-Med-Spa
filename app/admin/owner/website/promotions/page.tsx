'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OwnerLayout from '../../layout-wrapper';

interface Promo {
  id: string;
  name: string;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}

export default function WebsitePromotionsPage() {
  const [promotions, setPromotions] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cms/promotions')
      .then((r) => r.json())
      .then((d) => {
        setPromotions(d.promotions || []);
      })
      .catch(() => setPromotions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <OwnerLayout title="Promotions" description="Offers, banners, and campaigns.">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">Manage promotions and special offers shown on the site.</p>
          <Link
            href="/admin/owner/website/promotions?new=true"
            className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black text-sm font-medium"
          >
            + New Promotion
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading…</div>
          ) : promotions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No promotions yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {promotions.map((p) => (
                <li key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <span className="font-medium">{p.name}</span>
                  <span className={p.is_active ? 'text-green-600 text-sm font-medium' : 'text-gray-400 text-sm'}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/admin/owner/website" className="text-[#FF2D8E] font-medium hover:underline">
          ← Website Control
        </Link>
      </div>
    </OwnerLayout>
  );
}
