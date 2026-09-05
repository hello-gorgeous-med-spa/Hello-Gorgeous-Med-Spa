'use client';

import { useEffect, useState } from 'react';

export default function ReportsPage() {
  const [stats, setStats] = useState<{ revenue?: { today: number; week: number; month: number }; orders?: { total: number }; patients?: { total: number } } | null>(null);

  useEffect(() => {
    fetch('/api/regen/ops/stats').then((r) => r.json()).then(setStats).catch(() => setStats({}));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Reports</h1>
      <p className="text-white/50">Live totals only. Zero means zero.</p>
      <div className="grid grid-cols-3 gap-4">
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
      <p className="text-white/50 text-sm">Orders: {stats?.orders?.total || 0} · Patients: {stats?.patients?.total || 0}</p>
    </div>
  );
}
