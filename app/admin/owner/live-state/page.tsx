'use client';

/**
 * Live System State – Owner view
 * Shows connectivity and status of Dashboard, Appointments, Providers APIs and DB.
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui';
import { fetchWithTimeout } from '@/lib/fetchWithTimeout';

type CheckStatus = 'pending' | 'ok' | 'fail' | 'timeout';

interface CheckResult {
  label: string;
  status: CheckStatus;
  message?: string;
}

export default function LiveStatePage() {
  const [checks, setChecks] = useState<CheckResult[]>([
    { label: 'Dashboard API', status: 'pending' },
    { label: 'Appointments API', status: 'pending' },
    { label: 'Providers API', status: 'pending' },
  ]);
  const [loading, setLoading] = useState(true);

  const runChecks = useCallback(async () => {
    setLoading(true);
    setChecks([
      { label: 'Dashboard API', status: 'pending' },
      { label: 'Appointments API', status: 'pending' },
      { label: 'Providers API', status: 'pending' },
    ]);

    const results: CheckResult[] = [];

    try {
      const dashRes = await fetchWithTimeout('/api/dashboard');
      const dashData = await dashRes.json().catch(() => ({}));
      if (!dashRes.ok) {
        results.push({ label: 'Dashboard API', status: 'fail', message: dashData?.error || `HTTP ${dashRes.status}` });
      } else if (dashData.source === 'local') {
        results.push({ label: 'Dashboard API', status: 'ok', message: 'Responding (DB not connected – check env)' });
      } else {
        results.push({ label: 'Dashboard API', status: 'ok', message: 'Connected' });
      }
    } catch (e) {
      results.push({
        label: 'Dashboard API',
        status: e instanceof Error && e.message.includes('timed out') ? 'timeout' : 'fail',
        message: e instanceof Error ? e.message : 'Request failed',
      });
    }

    try {
      const aptRes = await fetchWithTimeout('/api/appointments?date=' + new Date().toISOString().split('T')[0]);
      const aptData = await aptRes.json().catch(() => ({}));
      if (!aptRes.ok) {
        results.push({ label: 'Appointments API', status: 'fail', message: aptData?.error || `HTTP ${aptRes.status}` });
      } else if (aptData.source === 'local') {
        results.push({ label: 'Appointments API', status: 'ok', message: 'Responding (DB not connected)' });
      } else {
        results.push({ label: 'Appointments API', status: 'ok', message: `Connected (${aptData.appointments?.length ?? 0} today)` });
      }
    } catch (e) {
      results.push({
        label: 'Appointments API',
        status: e instanceof Error && e.message.includes('timed out') ? 'timeout' : 'fail',
        message: e instanceof Error ? e.message : 'Request failed',
      });
    }

    try {
      const provRes = await fetchWithTimeout('/api/providers');
      const provData = await provRes.json().catch(() => ({}));
      if (!provRes.ok) {
        results.push({ label: 'Providers API', status: 'fail', message: provData?.error || `HTTP ${provRes.status}` });
      } else {
        const count = provData.providers?.length ?? 0;
        results.push({ label: 'Providers API', status: 'ok', message: `Connected (${count} providers)` });
      }
    } catch (e) {
      results.push({
        label: 'Providers API',
        status: e instanceof Error && e.message.includes('timed out') ? 'timeout' : 'fail',
        message: e instanceof Error ? e.message : 'Request failed',
      });
    }

    setChecks(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const statusColor = (s: CheckStatus) => {
    if (s === 'ok') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (s === 'timeout') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const statusIcon = (s: CheckStatus) => {
    if (s === 'ok') return '✓';
    if (s === 'timeout') return '⏱';
    if (s === 'pending') return '…';
    return '✗';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Live System State</h1>
          <p className="text-black mt-0.5">See exactly what your system is doing – no hidden logic.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 border-2 border-black text-black font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
          >
            ← Dashboard
          </Link>
          <button
            onClick={runChecks}
            disabled={loading}
            className="px-4 py-2 bg-[#E6007E] text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? 'Checking…' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-black shadow-sm overflow-hidden">
        <div className="p-4 border-b border-black bg-black/5">
          <h2 className="font-semibold text-black">System checks</h2>
          <p className="text-sm text-black mt-0.5">APIs and database connectivity (last run just now).</p>
        </div>
        <ul className="divide-y divide-black/10">
          {checks.map((c, i) => (
            <li key={i} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-black">{c.label}</p>
                {c.message && <p className="text-sm text-black/70 mt-0.5">{c.message}</p>}
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-lg border text-sm font-medium ${statusColor(c.status)}`}
                title={c.status === 'pending' ? 'Checking…' : c.message}
              >
                {statusIcon(c.status)} {c.status === 'pending' ? 'Checking…' : c.status.toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
