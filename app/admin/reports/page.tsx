'use client';

import Link from 'next/link';

export default function AdminReportsPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Reports</h1>
        <p className="text-black mt-1">Revenue, retention, no-show, by provider/service. Export CSV.</p>
      </div>
      <div className="bg-white rounded-xl border border-black p-6 text-black">
        <p className="font-medium">Reports & analytics</p>
        <p className="text-sm mt-1 text-black/80">Revenue by day/week/month, by provider and service. New clients, retention, rebook rate, no-show rate. CSV export. Full Reports in a future release. Use Dashboard and Owner portal for key metrics today.</p>
        <Link href="/admin" className="inline-block mt-4 text-[#2D63A4] font-medium hover:underline">← Dashboard</Link>
        <span className="mx-2 text-black/50">·</span>
        <Link href="/admin/owner" className="text-[#2D63A4] font-medium hover:underline">Owner portal</Link>
      </div>
    </div>
  );
}
