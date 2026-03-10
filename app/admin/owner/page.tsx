'use client';

// ============================================================
// OWNER PORTAL — Phase 6: Business cockpit
// PRD: Revenue snapshot, pending issues, leads, marketing/membership
//      health, low stock, staff productivity, quick edits
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type OwnerStats = {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  noShowRate: number;
  conversionPlaceholder: string;
  topProviders: { id: string; name: string; revenue: number; appointments: number; utilization: number }[];
  topServices: { id: string; name: string; revenue: number; bookings: number }[];
};

export default function AdminOwnerPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnerStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Try dashboard API first
      const dashRes = await fetch('/api/dashboard').catch(() => null);
      const dashData = dashRes?.ok ? await dashRes.json().catch(() => ({})) : {};

      // Appointments for month (fallback for revenue / no-show / top lists)
      const aptsRes = await fetch(`/api/appointments?start_date=${monthStartStr}&end_date=${todayStr}&include_cancelled=true&limit=500`).catch(() => null);
      const aptsData = aptsRes?.ok ? await aptsRes.json().catch(() => ({})) : {};
      const appointments = aptsData.appointments || [];

      const completed = appointments.filter((a: any) => a.status === 'completed');
      const noShows = appointments.filter((a: any) => a.status === 'no_show');
      const totalScheduled = appointments.filter((a: any) => a.status !== 'cancelled').length;
      const noShowRate = totalScheduled > 0 ? Math.round((noShows.length / totalScheduled) * 100) : 0;

      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayRevenue = completed
        .filter((a: any) => new Date(a.starts_at) >= todayStart)
        .reduce((s: number, a: any) => s + (a.service_price || 0), 0);
      const weekRevenue = completed
        .filter((a: any) => new Date(a.starts_at) >= weekAgo)
        .reduce((s: number, a: any) => s + (a.service_price || 0), 0);
      const monthRevenue = completed.reduce((s: number, a: any) => s + (a.service_price || 0), 0);

      // Prefer dashboard API revenue if present
      const todayRevenueFinal = (dashData.stats?.todayRevenue ?? todayRevenue) || todayRevenue;
      const weekRevenueFinal = (dashData.stats?.weekRevenue ?? weekRevenue) || weekRevenue;
      const monthRevenueFinal = (dashData.stats?.monthRevenue ?? monthRevenue) || monthRevenue;

      const providerMap = new Map<string, { name: string; revenue: number; appointments: number; completed: number }>();
      completed.forEach((a: any) => {
        const id = a.provider_id || 'unknown';
        const name = a.provider_name || 'Provider';
        if (!providerMap.has(id)) providerMap.set(id, { name, revenue: 0, appointments: 0, completed: 0 });
        const p = providerMap.get(id)!;
        p.revenue += a.service_price || 0;
        p.completed += 1;
      });
      appointments.forEach((a: any) => {
        const id = a.provider_id || 'unknown';
        if (providerMap.has(id)) providerMap.get(id)!.appointments += 1;
      });
      const topProviders = Array.from(providerMap.entries())
        .map(([id, p]) => ({
          id,
          name: p.name,
          revenue: p.revenue,
          appointments: p.appointments,
          utilization: p.appointments > 0 ? Math.round((p.completed / p.appointments) * 100) : 0,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const serviceMap = new Map<string, { name: string; revenue: number; bookings: number }>();
      completed.forEach((a: any) => {
        const id = a.service_id || 'unknown';
        const name = a.service_name || 'Service';
        if (!serviceMap.has(id)) serviceMap.set(id, { name, revenue: 0, bookings: 0 });
        const s = serviceMap.get(id)!;
        s.revenue += a.service_price || 0;
        s.bookings += 1;
      });
      const topServices = Array.from(serviceMap.entries())
        .map(([id, s]) => ({ id, name: s.name, revenue: s.revenue, bookings: s.bookings }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setStats({
        todayRevenue: todayRevenueFinal,
        weekRevenue: weekRevenueFinal,
        monthRevenue: monthRevenueFinal,
        noShowRate,
        conversionPlaceholder: dashData.stats?.conversion != null ? `${dashData.stats.conversion}%` : '—',
        topProviders,
        topServices,
      });
    } catch (e) {
      setError('Could not load owner stats');
      setStats({
        todayRevenue: 0,
        weekRevenue: 0,
        monthRevenue: 0,
        noShowRate: 0,
        conversionPlaceholder: '—',
        topProviders: [],
        topServices: [],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwnerStats();
  }, [fetchOwnerStats]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Owner</h1>
          <p className="text-black mt-1">Business cockpit — revenue, productivity, quick edits.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-gray-50">Dashboard</Link>
          <Link href="/admin/owner/manual" className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800">Owner&apos;s Manual</Link>
        </div>
      </div>

      {error && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : stats && (
        <>
          {/* Revenue snapshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-black p-5">
              <p className="text-sm font-medium text-black">Today</p>
              <p className="text-2xl font-bold text-black mt-1">${stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-black p-5">
              <p className="text-sm font-medium text-black">This week</p>
              <p className="text-2xl font-bold text-black mt-1">${stats.weekRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl border border-black p-5">
              <p className="text-sm font-medium text-black">This month</p>
              <p className="text-2xl font-bold text-black mt-1">${stats.monthRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* No-show & conversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-black p-5">
              <p className="text-sm font-medium text-black">No-show rate</p>
              <p className="text-xl font-bold text-black mt-1">{stats.noShowRate}%</p>
            </div>
            <div className="bg-white rounded-xl border border-black p-5">
              <p className="text-sm font-medium text-black">Conversion (leads → bookings)</p>
              <p className="text-xl font-bold text-black mt-1">{stats.conversionPlaceholder}</p>
              <Link href="/admin/marketing" className="text-sm text-[#2D63A4] mt-1 inline-block">Marketing →</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top providers */}
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <div className="px-5 py-4 border-b border-black">
                <h2 className="font-semibold text-black">Top providers (month)</h2>
              </div>
              <div className="divide-y divide-black">
                {stats.topProviders.length === 0 ? (
                  <div className="px-5 py-6 text-center text-black text-sm">No data yet</div>
                ) : (
                  stats.topProviders.map((p) => (
                    <div key={p.id} className="px-5 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-black">{p.name}</p>
                        <p className="text-xs text-black">{p.appointments} appts • {p.utilization}% util</p>
                      </div>
                      <p className="font-semibold text-black">${p.revenue.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top services */}
            <div className="bg-white rounded-xl border border-black overflow-hidden">
              <div className="px-5 py-4 border-b border-black">
                <h2 className="font-semibold text-black">Top services (month)</h2>
              </div>
              <div className="divide-y divide-black">
                {stats.topServices.length === 0 ? (
                  <div className="px-5 py-6 text-center text-black text-sm">No data yet</div>
                ) : (
                  stats.topServices.map((s) => (
                    <div key={s.id} className="px-5 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-black">{s.name}</p>
                        <p className="text-xs text-black">{s.bookings} bookings</p>
                      </div>
                      <p className="font-semibold text-black">${s.revenue.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Pending issues / health */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/clients" className="bg-white rounded-xl border border-black p-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl block mb-2">📋</span>
              <p className="font-medium text-black">Pending issues</p>
              <p className="text-sm text-black mt-0.5">Consents, forms, follow-ups</p>
            </Link>
            <Link href="/admin/marketing" className="bg-white rounded-xl border border-black p-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl block mb-2">📈</span>
              <p className="font-medium text-black">Leads</p>
              <p className="text-sm text-black mt-0.5">Marketing & leads</p>
            </Link>
            <Link href="/admin/memberships" className="bg-white rounded-xl border border-black p-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl block mb-2">💎</span>
              <p className="font-medium text-black">Membership health</p>
              <p className="text-sm text-black mt-0.5">Active, overdue, usage</p>
            </Link>
            <Link href="/admin/inventory" className="bg-white rounded-xl border border-black p-4 hover:bg-gray-50 transition-colors">
              <span className="text-2xl block mb-2">📦</span>
              <p className="font-medium text-black">Low stock</p>
              <p className="text-sm text-black mt-0.5">Inventory alerts</p>
            </Link>
          </div>

          {/* Quick edits */}
          <div className="bg-white rounded-xl border border-black p-5">
            <h2 className="font-semibold text-black mb-3">Quick edits</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/services" className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a]">Services & pricing</Link>
              <Link href="/admin/marketing" className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50">Promos & campaigns</Link>
              <Link href="/admin/content/site" className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50">Website / Content</Link>
              <Link href="/admin/reports" className="px-4 py-2 bg-white border border-black text-black font-medium rounded-lg hover:bg-gray-50">Reports</Link>
            </div>
          </div>
        </>
      )}

      <div className="pt-4">
        <Link href="/admin" className="text-[#2D63A4] font-medium hover:underline">← Dashboard</Link>
      </div>
    </div>
  );
}
