'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import { ADMIN_DASHBOARD_QUICK_LINKS, ADMIN_PORTAL_TAGLINE } from '@/lib/admin-nav';

interface DashboardStats {
  todayRevenue: number;
  monthRevenue: number;
  todayAppointments: number;
  completedToday: number;
  totalClients: number;
}

interface UpcomingAppointment {
  id: string;
  time: string;
  status: string;
  client_name: string;
  service: string;
}

interface RxQueueItem {
  submissionId: string;
  patientName: string;
  track: string;
  dispatchStatus: string;
  paymentStatus: string | null;
  submittedAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-800',
    in_progress: 'bg-violet-100 text-violet-800',
    checked_in: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-slate-100 text-slate-800',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-amber-100 text-amber-800',
  };
  return (
    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full capitalize ${styles[status] || 'bg-slate-100 text-slate-700'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  loading,
}: {
  label: string;
  value: string;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-black/45">{label}</p>
      {loading ? (
        <div className="mt-2 h-9 w-28 animate-pulse rounded bg-black/5" />
      ) : (
        <>
          <p className="mt-1 text-3xl font-bold tracking-tight text-black">{value}</p>
          {sub && <p className="mt-1 text-sm text-black/55">{sub}</p>}
        </>
      )}
    </div>
  );
}

function QuickLinkGrid({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string; desc: string }[];
}) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-widest text-black/40 mb-3">{title}</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-black/10 bg-white px-4 py-3 hover:border-[#E6007E]/40 hover:shadow-sm transition-all"
          >
            <p className="font-semibold text-black group-hover:text-[#E6007E]">{link.label}</p>
            <p className="text-xs text-black/50 mt-0.5">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);
  const [rxItems, setRxItems] = useState<RxQueueItem[]>([]);
  const [rxDue, setRxDue] = useState({ overdue: 0, dueSoon: 0 });
  const [unsignedConsents, setUnsignedConsents] = useState<{ id: string; client_name: string; time: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [squareSyncing, setSquareSyncing] = useState(false);
  const [squareSyncMsg, setSquareSyncMsg] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('Hello Gorgeous');

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, aptsRes, rxRes] = await Promise.all([
        fetchWithTimeout('/api/dashboard'),
        fetchWithTimeout(`/api/appointments?date=${new Date().toISOString().split('T')[0]}`),
        fetchWithTimeout('/api/admin/rx?limit=8'),
      ]);

      const dashData = await dashRes.json().catch(() => ({}));
      const aptsData = await aptsRes.json().catch(() => ({}));
      const rxData = await rxRes.json().catch(() => ({}));

      if (dashRes.ok && dashData.source === 'local') {
        setError('Database not connected — check Supabase env vars.');
      }

      const appointments = aptsData.appointments || [];
      const todayAppts = appointments.filter((a: { status: string }) => a.status !== 'cancelled');
      const completedToday = appointments.filter((a: { status: string }) => a.status === 'completed').length;

      setStats({
        todayRevenue: dashData.stats?.todayRevenue || 0,
        monthRevenue: dashData.stats?.monthRevenue || 0,
        todayAppointments: todayAppts.length,
        completedToday,
        totalClients: dashData.stats?.totalClients || 0,
      });

      setUpcoming(
        appointments
          .filter((a: { status: string }) => !['cancelled', 'completed', 'no_show'].includes(a.status))
          .sort((a: { starts_at: string }, b: { starts_at: string }) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
          )
          .slice(0, 8)
          .map((a: { id: string; starts_at: string; status: string; client_name?: string; service_name?: string }) => ({
            id: a.id,
            time: a.starts_at,
            status: a.status,
            client_name: a.client_name || 'Client',
            service: a.service_name || 'Service',
          })),
      );

      const pendingRx = (rxData.items || []).filter(
        (i: RxQueueItem) =>
          i.dispatchStatus !== 'shipped' && i.dispatchStatus !== 'complete' && i.dispatchStatus !== 'cancelled',
      );
      setRxItems(pendingRx.slice(0, 6));
      setRxDue(rxData.dueCounts || { overdue: 0, dueSoon: 0 });

      const pendingIds = appointments
        .filter((a: { status: string }) => ['pending', 'confirmed', 'checked_in'].includes(a.status))
        .map((a: { id: string }) => a.id)
        .filter(Boolean);

      if (pendingIds.length > 0) {
        try {
          const consentRes = await fetchWithTimeout(
            `/api/appointments/consent-status?ids=${pendingIds.join(',')}`,
          );
          const consentData = await consentRes.json().catch(() => ({}));
          if (consentData.statuses) {
            setUnsignedConsents(
              appointments
                .filter((a: { id: string; client_name?: string; starts_at: string }) => {
                  const cs = consentData.statuses[a.id];
                  return cs && cs.total > 0 && cs.status !== 'complete';
                })
                .slice(0, 5)
                .map((a: { id: string; client_name?: string; starts_at: string }) => ({
                  id: a.id,
                  client_name: a.client_name || 'Client',
                  time: formatTime(a.starts_at),
                })),
            );
          }
        } catch {
          /* optional */
        }
      } else {
        setUnsignedConsents([]);
      }

      setLastUpdated(new Date());
    } catch {
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const name = data?.settings?.business_name;
        if (name && typeof name === 'string') setBusinessName(name.trim() || 'Hello Gorgeous');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    void fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const handleSquareSync = async (days = 7) => {
    setSquareSyncing(true);
    setSquareSyncMsg(null);
    try {
      const res = await fetch('/api/admin/square/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'payments', days }),
      });
      const data = await res.json();
      if (data.ok) {
        setSquareSyncMsg(`Synced ${data.fetched} payments (${data.upserted} saved)`);
        setTimeout(() => void fetchDashboard(), 1000);
      } else {
        setSquareSyncMsg(data.error || 'Sync failed — connect Square in Settings → Payments');
      }
    } catch {
      setSquareSyncMsg('Sync failed — check Square connection');
    } finally {
      setSquareSyncing(false);
      setTimeout(() => setSquareSyncMsg(null), 8000);
    }
  };

  const rxActionCount = rxItems.length + rxDue.overdue + rxDue.dueSoon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Medical portal</p>
          <h1 className="text-2xl font-bold text-black mt-0.5">{businessName}</h1>
          <p className="text-sm text-black/55 mt-0.5">{today} · {ADMIN_PORTAL_TAGLINE}</p>
          {lastUpdated && (
            <p className="text-xs text-black/40 mt-1">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleSquareSync()}
            disabled={squareSyncing}
            className="px-4 py-2.5 rounded-lg border border-black/15 bg-white text-sm font-semibold text-black hover:border-[#E6007E]/40 disabled:opacity-50"
          >
            {squareSyncing ? 'Syncing Square…' : 'Sync Square'}
          </button>
          <Link
            href="/admin/appointments/new"
            className="px-4 py-2.5 rounded-lg bg-[#E6007E] text-white text-sm font-semibold hover:bg-[#c90a68]"
          >
            New booking
          </Link>
          <Link
            href="/pos"
            className="px-4 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-black/85"
          >
            Open POS
          </Link>
        </div>
      </div>

      {squareSyncMsg && (
        <p className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
          {squareSyncMsg}
        </p>
      )}

      {error && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {unsignedConsents.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-800">
            {unsignedConsents.length} appointment{unsignedConsents.length > 1 ? 's' : ''} need consent forms
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {unsignedConsents.map((apt) => (
              <Link
                key={apt.id}
                href={`/admin/appointments/${apt.id}`}
                className="text-xs font-medium text-red-700 bg-white border border-red-200 rounded-lg px-2.5 py-1 hover:bg-red-100"
              >
                {apt.client_name} · {apt.time}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today revenue"
          value={`$${(stats?.todayRevenue || 0).toLocaleString()}`}
          sub={`${stats?.completedToday || 0} completed · Square synced`}
          loading={loading}
        />
        <StatCard
          label="Month revenue"
          value={`$${(stats?.monthRevenue || 0).toLocaleString()}`}
          loading={loading}
        />
        <StatCard
          label="Today's schedule"
          value={String(stats?.todayAppointments ?? 0)}
          sub={`${stats?.completedToday || 0} done`}
          loading={loading}
        />
        <StatCard
          label="RX queue"
          value={String(rxActionCount)}
          sub={
            rxDue.overdue > 0
              ? `${rxDue.overdue} overdue refills`
              : rxDue.dueSoon > 0
                ? `${rxDue.dueSoon} due soon`
                : 'Pending dispatch & refills'
          }
          loading={loading}
        />
      </div>

      {/* Schedule + RX */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
            <h2 className="font-semibold text-black">Today&apos;s schedule</h2>
            <Link href="/admin/calendar" className="text-sm font-medium text-[#E6007E] hover:underline">
              Full calendar →
            </Link>
          </div>
          <div className="divide-y divide-black/5 max-h-[420px] overflow-y-auto">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="h-10 animate-pulse rounded bg-black/5" />
                </div>
              ))
            ) : upcoming.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-black/45">No upcoming appointments today</p>
            ) : (
              upcoming.map((apt) => (
                <Link
                  key={apt.id}
                  href={`/admin/appointments/${apt.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-[#FFF0F7]/50 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-sm font-semibold text-black/70 w-16 shrink-0">
                      {formatTime(apt.time)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-black truncate">{apt.client_name}</p>
                      <p className="text-sm text-black/50 truncate">{apt.service}</p>
                    </div>
                  </div>
                  <StatusBadge status={apt.status} />
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
            <h2 className="font-semibold text-black">RX & refills</h2>
            <Link href="/admin/rx" className="text-sm font-medium text-[#E6007E] hover:underline">
              Command center →
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {(rxDue.overdue > 0 || rxDue.dueSoon > 0) && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm">
                <span className="font-semibold text-amber-900">Refills: </span>
                {rxDue.overdue > 0 && (
                  <span className="text-amber-800">{rxDue.overdue} overdue · </span>
                )}
                {rxDue.dueSoon > 0 && (
                  <span className="text-amber-800">{rxDue.dueSoon} due soon</span>
                )}
              </div>
            )}
            <div className="divide-y divide-black/5 max-h-[320px] overflow-y-auto">
              {loading ? (
                <div className="py-8 text-center text-sm text-black/40">Loading…</div>
              ) : rxItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-black/45">No pending RX orders</p>
              ) : (
                rxItems.map((item) => (
                  <Link
                    key={item.submissionId}
                    href={`/admin/rx-dispatch?ref=${encodeURIComponent(item.submissionId)}`}
                    className="block py-3 hover:bg-black/[0.02] -mx-1 px-1 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-black text-sm">{item.patientName}</p>
                        <p className="text-xs text-black/50 capitalize mt-0.5">
                          {item.track} · {item.dispatchStatus.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                          item.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/admin/flowwave"
                className="text-center text-xs font-semibold py-2 rounded-lg border border-[#E6007E]/30 bg-[#FFF0F7] text-[#E6007E] hover:border-[#E6007E]"
              >
                FlowWave
              </Link>
              <Link
                href="/admin/rx/pharmacy-orders"
                className="text-center text-xs font-semibold py-2 rounded-lg border border-black/10 hover:border-[#E6007E]/40"
              >
                Pharmacy orders
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 pt-2">
        <QuickLinkGrid title="Prescriptions & RX" links={ADMIN_DASHBOARD_QUICK_LINKS.rx} />
        <QuickLinkGrid title="Patients & schedule" links={ADMIN_DASHBOARD_QUICK_LINKS.patients} />
        <QuickLinkGrid title="Payments & Square" links={ADMIN_DASHBOARD_QUICK_LINKS.payments} />
        <QuickLinkGrid title="Marketing" links={ADMIN_DASHBOARD_QUICK_LINKS.marketing} />
        <QuickLinkGrid title="Forms, docs & vendors" links={ADMIN_DASHBOARD_QUICK_LINKS.resources} />
      </div>
    </div>
  );
}
