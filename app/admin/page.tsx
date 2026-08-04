'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';
import {
  ADMIN_DASHBOARD_DIRECTORY,
  ADMIN_DASHBOARD_PRIMARY,
  ADMIN_PORTAL_TAGLINE,
} from '@/lib/admin-nav';

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
  source?: 'square' | 'local';
  likelyUnpaid?: boolean;
}

interface RxQueueItem {
  submissionId: string;
  patientName: string;
  track: string;
  dispatchStatus: string;
  paymentStatus: string | null;
  submittedAt: string;
}

const SQUARE_CALENDAR_FALLBACK = 'https://app.squareup.com/dashboard/appointments/calendar';
const NAVY = '#0B1F33';

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function statusTone(status: string): string {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    confirmed: 'bg-slate-100 text-slate-700',
    pending: 'bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200',
    checked_in: 'bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200',
    cancelled: 'bg-rose-50 text-rose-700',
    no_show: 'bg-amber-50 text-amber-800',
  };
  return styles[status] || 'bg-slate-100 text-slate-600';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcoming, setUpcoming] = useState<UpcomingAppointment[]>([]);
  const [rxItems, setRxItems] = useState<RxQueueItem[]>([]);
  const [rxDue, setRxDue] = useState({ overdue: 0, dueSoon: 0 });
  const [unsignedConsents, setUnsignedConsents] = useState<
    { id: string; client_name: string; time: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [squareSyncing, setSquareSyncing] = useState(false);
  const [squareSyncMsg, setSquareSyncMsg] = useState<string | null>(null);
  const [squareCalendarUrl, setSquareCalendarUrl] = useState(SQUARE_CALENDAR_FALLBACK);
  const [scheduleSource, setScheduleSource] = useState<'square' | 'local' | null>(null);
  const [businessName, setBusinessName] = useState('Hello Gorgeous');
  const [opsOpen, setOpsOpen] = useState(false);

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
      const chicagoToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

      const [dashRes, squareRes, aptsRes, rxRes] = await Promise.all([
        fetchWithTimeout('/api/dashboard'),
        fetchWithTimeout(`/api/admin/square/appointments?date=${chicagoToday}`),
        fetchWithTimeout(`/api/appointments?date=${chicagoToday}`),
        fetchWithTimeout('/api/admin/rx?limit=8'),
      ]);

      const dashData = await dashRes.json().catch(() => ({}));
      const squareData = await squareRes.json().catch(() => ({}));
      const aptsData = await aptsRes.json().catch(() => ({}));
      const rxData = await rxRes.json().catch(() => ({}));

      if (dashRes.ok && dashData.source === 'local') {
        setError('Database not connected — check Supabase env vars.');
      }

      if (squareData.calendarUrl) {
        setSquareCalendarUrl(squareData.calendarUrl);
      }

      const localAppointments = aptsData.appointments || [];
      const squareAppointments = squareData.ok ? squareData.appointments || [] : [];
      const useSquare = squareData.ok === true;

      setScheduleSource(useSquare ? 'square' : 'local');

      const scheduleRows: UpcomingAppointment[] = useSquare
        ? squareAppointments
            .filter((a: { status: string }) => !['cancelled', 'no_show'].includes(a.status))
            .sort((a: { starts_at?: string }, b: { starts_at?: string }) =>
              String(a.starts_at || '').localeCompare(String(b.starts_at || '')),
            )
            .map(
              (a: {
                id: string;
                starts_at?: string;
                status: string;
                client_name?: string;
                service_name?: string;
                likely_unpaid?: boolean;
              }) => ({
                id: a.id,
                time: a.starts_at || '',
                status: a.status,
                client_name: a.client_name || 'Guest',
                service: a.service_name || 'Service',
                source: 'square' as const,
                likelyUnpaid: !!a.likely_unpaid,
              }),
            )
        : localAppointments
            .filter((a: { status: string }) => !['cancelled', 'completed', 'no_show'].includes(a.status))
            .sort((a: { starts_at: string }, b: { starts_at: string }) =>
              new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
            )
            .map(
              (a: {
                id: string;
                starts_at: string;
                status: string;
                client_name?: string;
                service_name?: string;
              }) => ({
                id: a.id,
                time: a.starts_at,
                status: a.status,
                client_name: a.client_name || 'Client',
                service: a.service_name || 'Service',
                source: 'local' as const,
              }),
            );

      if (!useSquare && squareData.error) {
        setError(
          `Square calendar: ${squareData.error}${
            squareData.setupPath ? ` — connect at ${squareData.setupPath}` : ''
          }`,
        );
      }

      const completedToday = localAppointments.filter(
        (a: { status: string }) => a.status === 'completed',
      ).length;

      setStats({
        todayRevenue: dashData.stats?.todayRevenue || 0,
        monthRevenue: dashData.stats?.monthRevenue || 0,
        todayAppointments: useSquare
          ? squareData.totalCount ?? scheduleRows.length
          : localAppointments.filter((a: { status: string }) => a.status !== 'cancelled').length,
        completedToday,
        totalClients: dashData.stats?.totalClients || 0,
      });

      setUpcoming(scheduleRows.slice(0, 12));

      const pendingRx = (rxData.items || []).filter(
        (i: RxQueueItem) =>
          i.dispatchStatus !== 'shipped' &&
          i.dispatchStatus !== 'complete' &&
          i.dispatchStatus !== 'cancelled',
      );
      setRxItems(pendingRx.slice(0, 6));
      setRxDue(rxData.dueCounts || { overdue: 0, dueSoon: 0 });

      const pendingIds = localAppointments
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
              localAppointments
                .filter((a: { id: string; starts_at: string }) => {
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
      const chicagoToday = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());

      const [payRes, calRes] = await Promise.all([
        fetch('/api/admin/square/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'payments', days }),
        }),
        fetch(`/api/admin/square/appointments?date=${chicagoToday}`),
      ]);
      const payData = await payRes.json().catch(() => ({}));
      const calData = await calRes.json().catch(() => ({}));

      const parts: string[] = [];
      if (payData.ok) parts.push(`${payData.fetched} payments (${payData.upserted} saved)`);
      else if (payData.error) parts.push(`payments: ${payData.error}`);
      if (calData.ok) {
        parts.push(`${calData.totalCount ?? 0} on Square today`);
        if (calData.calendarUrl) setSquareCalendarUrl(calData.calendarUrl);
      } else if (calData.error) {
        parts.push(`calendar: ${calData.error}`);
      }

      setSquareSyncMsg(parts.length ? parts.join(' · ') : 'Sync finished');
      setTimeout(() => void fetchDashboard(), 400);
    } catch {
      setSquareSyncMsg('Sync failed — check Square connection');
    } finally {
      setSquareSyncing(false);
      setTimeout(() => setSquareSyncMsg(null), 8000);
    }
  };

  const rxActionCount = rxItems.length + rxDue.overdue + rxDue.dueSoon;

  return (
    <div className="-m-4 sm:-m-6 min-h-[calc(100vh-62px)] bg-[#f1f5f9] text-slate-900">
      {/* Provider-portal style top bar */}
      <header className="bg-white border-b border-slate-200 px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-teal-700/90">
            Hello Gorgeous · {ADMIN_PORTAL_TAGLINE}
          </p>
          <h1 className="text-2xl font-black" style={{ color: NAVY }}>
            {businessName} Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {today}
            {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void handleSquareSync()}
            disabled={squareSyncing}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-teal-400 disabled:opacity-50"
          >
            {squareSyncing ? 'Syncing…' : 'Sync Square'}
          </button>
          <a
            href={squareCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-[#2dd4bf] px-4 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-300"
          >
            + Book in Square
          </a>
        </div>
      </header>

      <div className="p-5 sm:p-6 space-y-5 max-w-6xl">
        {/* My day script */}
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-white px-5 py-4">
          <p className="text-[11px] font-black uppercase tracking-wider text-teal-800">Desk · My day</p>
          <ol className="mt-2 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Sync Square · confirm today’s calendar',
              'Run consults / proposals for walk-ins',
              'Clear RX queue & unpaid invoices',
              'Check consents before next arrivals',
              'End of day: daily summary',
            ].map((step, i) => (
              <li key={step} className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11px] font-black text-[#0B1F33]">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {ADMIN_DASHBOARD_PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-teal-400"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/rx-portal"
              className="rounded-full bg-[#0B1F33] px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              Provider Portal
            </Link>
          </div>
        </div>

        {squareSyncMsg && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {squareSyncMsg}
          </p>
        )}
        {error && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            {error}
          </p>
        )}
        {unsignedConsents.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
            <p className="text-sm font-bold text-rose-900">
              {unsignedConsents.length} appointment{unsignedConsents.length > 1 ? 's' : ''} need consent
              forms
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {unsignedConsents.map((apt) => (
                <Link
                  key={apt.id}
                  href={`/admin/appointments/${apt.id}`}
                  className="rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-800 hover:bg-rose-100"
                >
                  {apt.client_name} · {apt.time}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Today strip — same as RX portal */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: 'Today revenue',
              value: loading ? '—' : formatUsd(stats?.todayRevenue || 0),
            },
            {
              label: 'Month revenue',
              value: loading ? '—' : formatUsd(stats?.monthRevenue || 0),
            },
            {
              label: "Today's schedule",
              value: loading ? '—' : String(stats?.todayAppointments ?? 0),
              sub: scheduleSource === 'square' ? 'Live from Square' : 'Local calendar',
            },
            {
              label: 'RX action needed',
              value: loading ? '—' : String(rxActionCount),
              sub:
                rxDue.overdue > 0
                  ? `${rxDue.overdue} overdue`
                  : rxDue.dueSoon > 0
                    ? `${rxDue.dueSoon} due soon`
                    : 'Queue + refills',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-black" style={{ color: NAVY }}>
                {s.value}
              </p>
              {'sub' in s && s.sub ? <p className="mt-0.5 text-xs text-slate-500">{s.sub}</p> : null}
            </div>
          ))}
        </div>

        {/* Schedule + RX queues */}
        <div className="grid gap-4 lg:grid-cols-5">
          <section className="lg:col-span-3 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Today&apos;s schedule
                </p>
                <p className="mt-1 text-3xl font-black text-teal-600">
                  {loading ? '—' : stats?.todayAppointments ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {scheduleSource === 'square'
                    ? 'Synced from Square Appointments'
                    : 'Local calendar (Square unavailable)'}
                </p>
              </div>
              <a
                href={squareCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                Open Square →
              </a>
            </div>
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Loading schedule…</p>
            ) : upcoming.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">
                No appointments on Square today
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {upcoming.map((apt) => {
                  const body = (
                    <>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                          {apt.client_name}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">
                          {apt.time ? formatTime(apt.time) : '—'} · {apt.service}
                          {apt.likelyUnpaid ? ' · likely unpaid' : ''}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${statusTone(apt.status)}`}
                      >
                        {apt.status.replace(/_/g, ' ')}
                      </span>
                    </>
                  );
                  const rowClass =
                    'flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50';
                  return apt.source === 'square' ? (
                    <li key={apt.id}>
                      <a
                        href={squareCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={rowClass}
                      >
                        {body}
                      </a>
                    </li>
                  ) : (
                    <li key={apt.id}>
                      <Link href={`/admin/appointments/${apt.id}`} className={rowClass}>
                        {body}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="lg:col-span-2 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  RX & refills
                </p>
                <p className="mt-1 text-3xl font-black text-violet-600">
                  {loading ? '—' : rxActionCount}
                </p>
              </div>
              <Link href="/admin/rx" className="text-xs font-bold text-teal-700 hover:underline">
                View all →
              </Link>
            </div>
            {(rxDue.overdue > 0 || rxDue.dueSoon > 0) && (
              <div className="mx-4 mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                <strong>Refills:</strong>{' '}
                {rxDue.overdue > 0 ? `${rxDue.overdue} overdue` : null}
                {rxDue.overdue > 0 && rxDue.dueSoon > 0 ? ' · ' : null}
                {rxDue.dueSoon > 0 ? `${rxDue.dueSoon} due soon` : null}
              </div>
            )}
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">Loading…</p>
            ) : rxItems.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-slate-500">No pending RX orders</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {rxItems.map((item) => (
                  <li key={item.submissionId}>
                    <Link
                      href={`/admin/rx-dispatch?ref=${encodeURIComponent(item.submissionId)}`}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold" style={{ color: NAVY }}>
                          {item.patientName}
                        </p>
                        <p className="truncate text-[11px] capitalize text-slate-500">
                          {item.track} · {item.dispatchStatus.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        {item.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto grid grid-cols-2 gap-2 border-t border-slate-100 p-3">
              <Link
                href="/rx-portal"
                className="rounded-lg bg-[#2dd4bf] px-3 py-2 text-center text-xs font-bold text-[#0B1F33]"
              >
                Provider Portal
              </Link>
              <Link
                href="/admin/rx/ops"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-bold text-slate-700"
              >
                RX Ops
              </Link>
            </div>
          </section>
        </div>

        {/* Directory — text links, not a card wall */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ADMIN_DASHBOARD_DIRECTORY.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {group.title}
              </p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-[#0B1F33] hover:text-teal-700"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Collapsed ops — mirrors portal */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setOpsOpen((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-left"
            aria-expanded={opsOpen}
          >
            <div>
              <p className="text-sm font-black" style={{ color: NAVY }}>
                More tools
              </p>
              <p className="text-xs text-slate-500">Full admin nav lives in the sidebar</p>
            </div>
            <span className="text-lg font-bold text-slate-400">{opsOpen ? '−' : '+'}</span>
          </button>
          {opsOpen ? (
            <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600">
              Use the left sidebar for RX tools, marketing, documents, and settings. Prefer{' '}
              <Link href="/rx-portal" className="font-bold text-teal-700 hover:underline">
                Provider Portal
              </Link>{' '}
              for RE GEN order workflow and{' '}
              <a
                href={squareCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-700 hover:underline"
              >
                Square calendar
              </a>{' '}
              for booking.
            </div>
          ) : null}
        </div>

        <p className="text-[11px] text-slate-400 pb-2">
          Square calendar auto-loads · payments sync on demand · Chrome recommended
        </p>
      </div>
    </div>
  );
}
