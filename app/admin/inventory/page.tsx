'use client';

import Link from 'next/link';

export default function AdminInventoryPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Inventory</h1>
        <p className="text-black mt-1">Medical + retail stock, reorder thresholds, lot/expiry.</p>
      </div>
      <div className="bg-white rounded-xl border border-black p-6 text-black">
        <p className="font-medium">Inventory management</p>
        <p className="text-sm mt-1 text-black/80">Track retail, injectables, IV supplies, disposables. Set reorder thresholds and lot/expiry. Auto-decrement from charting in a future release.</p>
        <Link href="/admin" className="inline-block mt-4 text-[#2D63A4] font-medium hover:underline">← Dashboard</Link>
      </div>
    </div>
  );
}
