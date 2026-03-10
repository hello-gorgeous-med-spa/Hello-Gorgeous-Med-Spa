'use client';

// ============================================================
// LIVE SYSTEM — Real-time visibility: DB, APIs, counts
// "See exactly what your system is doing"
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type LiveState = {
  lastChecked: string;
  database: 'connected' | 'disconnected';
  databaseDetail?: string;
  clientsCount: number;
  servicesCount: number;
  appointmentsTodayCount: number;
  env: { hasSupabaseUrl: boolean; hasSupabaseKey: boolean };
};

export default function LiveStatePage() {
  const [state, setState] = useState<LiveState | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveState = useCallback(async () => {
    try {
      const res = await fetch('/api/live-state');
      const data = await res.json();
      setState(data);
    } catch {
      setState(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const checkApis = useCallback(async () => {
    const apis: Record<string, string> = {};
    try {
      const r = await fetch('/api/auth/session');
      apis['Auth session'] = r.ok ? 'OK' : `${r.status}`;
    } catch {
      apis['Auth session'] = 'Error';
    }
    try {
      const r = await fetch('/api/clients?limit=1');
      const d = await r.json().catch(() => ({}));
      apis['Clients API'] = r.ok ? (d.source === 'local' ? 'OK (local)' : 'OK') : `${r.status}`;
    } catch {
      apis['Clients API'] = 'Error';
    }
    try {
      const r = await fetch('/api/services');
      apis['Services API'] = r.ok ? 'OK' : `${r.status}`;
    } catch {
      apis['Services API'] = 'Error';
    }
    try {
      const r = await fetch('/api/chart-notes?client_id=00000000-0000-0000-0000-000000000000&limit=1');
      apis['Chart notes API'] = r.ok ? 'OK' : `${r.status}`;
    } catch {
      apis['Chart notes API'] = 'Error';
    }
    setApiStatus(apis);
  }, []);

  useEffect(() => {
    fetchLiveState();
    checkApis();
  }, [fetchLiveState, checkApis]);

  useEffect(() => {
    const t = setInterval(() => {
      setRefreshing(true);
      fetchLiveState();
      checkApis();
    }, 30000);
    return () => clearInterval(t);
  }, [fetchLiveState, checkApis]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLiveState();
    checkApis();
  };

  if (loading && !state) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/owner" className="text-[#2D63A4] font-medium hover:underline">← Owner</Link>
          <h1 className="text-2xl font-bold text-black mt-2">Live System</h1>
          <p className="text-black mt-1">See exactly what your system is doing — no hidden logic.</p>
        </div>
        <div className="flex items-center gap-2">
          {state?.lastChecked && (
            <span className="text-sm text-black/70">
              Updated {new Date(state.lastChecked).toLocaleTimeString()}
            </span>
          )}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-[#2D63A4] text-white font-medium rounded-lg hover:bg-[#234a7a] disabled:opacity-50 text-sm"
          >
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black flex items-center justify-between">
          <h2 className="font-semibold text-black">Database</h2>
          {state && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                state.database === 'connected'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {state.database === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          )}
        </div>
        <div className="p-5 text-black text-sm space-y-1">
          {state && (
            <>
              <p>Env: URL {state.env.hasSupabaseUrl ? '✓' : '✗'} · Key {state.env.hasSupabaseKey ? '✓' : '✗'}</p>
              {state.databaseDetail && <p className="text-red-600">{state.databaseDetail}</p>}
            </>
          )}
        </div>
      </div>

      {/* Counts */}
      {state && state.database === 'connected' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-black p-5">
            <p className="text-sm font-medium text-black/70">Clients</p>
            <p className="text-2xl font-bold text-black mt-1">{state.clientsCount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-black p-5">
            <p className="text-sm font-medium text-black/70">Services</p>
            <p className="text-2xl font-bold text-black mt-1">{state.servicesCount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-black p-5">
            <p className="text-sm font-medium text-black/70">Appointments today</p>
            <p className="text-2xl font-bold text-black mt-1">{state.appointmentsTodayCount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* API status */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="px-5 py-4 border-b border-black">
          <h2 className="font-semibold text-black">API status</h2>
        </div>
        <ul className="divide-y divide-black">
          {Object.entries(apiStatus).map(([name, status]) => (
            <li key={name} className="px-5 py-3 flex justify-between items-center">
              <span className="text-black font-medium">{name}</span>
              <span
                className={`text-sm font-medium ${
                  status.startsWith('OK') ? 'text-green-600' : status === 'Error' ? 'text-red-600' : 'text-amber-600'
                }`}
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-black/70">Auto-refreshes every 30 seconds.</p>
    </div>
  );
}
