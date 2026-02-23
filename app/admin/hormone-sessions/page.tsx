'use client';

// ============================================================
// ADMIN HORMONE SESSIONS (Harmony AI™)
// Read-only list of hormone assessment sessions for providers
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface HormoneSessionRow {
  id: string;
  created_at: string;
  age_range: string | null;
  biological_sex: string | null;
  menopause_status: string | null;
  top_symptoms: string[] | null;
  sleep_quality: string | null;
  energy_level: string | null;
  weight_change: string | null;
  stress_level: string | null;
  prior_hormone_therapy: boolean | null;
  severity_score: number | null;
  recommended_labs: string[] | null;
  recommended_protocol: Array<{ therapy?: string; reason?: string }> | null;
  estimated_timeline: string | null;
  estimated_investment_range: string | null;
  conversion_status: string;
}

export default function AdminHormoneSessionsPage() {
  const [sessions, setSessions] = useState<HormoneSessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'created_at' | 'severity_score'>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('sort', sort);
      params.set('order', order);
      const res = await fetch(`/api/admin/hormone-sessions?${params.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? 'Failed to load sessions');
        setSessions([]);
        return;
      }
      setSessions(data.sessions ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [search, sort, order]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const labsPreview = (arr: string[] | null) =>
    Array.isArray(arr) && arr.length ? arr.slice(0, 3).join(', ') + (arr.length > 3 ? '…' : '') : '—';
  const protocolPreview = (arr: Array<{ therapy?: string }> | null) =>
    Array.isArray(arr) && arr.length
      ? arr.slice(0, 2).map((p) => p.therapy ?? '').filter(Boolean).join(', ') + (arr.length > 2 ? '…' : '')
      : '—';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/admin" className="text-[#E6007E] hover:underline">Admin</Link>
        <span className="mx-2">/</span>
        <span className="text-black font-medium">Hormone Sessions</span>
      </nav>

      <h1 className="text-2xl font-bold text-black mb-2">Harmony AI™ Sessions</h1>
      <p className="text-gray-600 mb-6">
        Read-only list of hormone assessment blueprints. Client name not yet linked (user_id only).
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="search"
          placeholder="Search (age, sex, status, symptoms…)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 w-64 text-sm"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'created_at' | 'severity_score')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="created_at">Date</option>
            <option value="severity_score">Severity</option>
          </select>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="desc">Newest / Highest first</option>
            <option value="asc">Oldest / Lowest first</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          Loading sessions…
        </div>
      ) : sessions.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          No hormone sessions found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Date</th>
                <th className="px-4 py-3 font-semibold text-black">Severity</th>
                <th className="px-4 py-3 font-semibold text-black">Sex / Age / Menopause</th>
                <th className="px-4 py-3 font-semibold text-black">Recommended Labs</th>
                <th className="px-4 py-3 font-semibold text-black">Protocol</th>
                <th className="px-4 py-3 font-semibold text-black">Investment</th>
                <th className="px-4 py-3 font-semibold text-black">Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(s.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {s.severity_score != null ? (
                      <span className="font-medium text-black">{s.severity_score}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {[s.biological_sex, s.age_range, s.menopause_status].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={labsPreview(s.recommended_labs)}>
                    {labsPreview(s.recommended_labs)}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate" title={protocolPreview(s.recommended_protocol)}>
                    {protocolPreview(s.recommended_protocol)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {s.estimated_investment_range || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        s.conversion_status === 'emailed'
                          ? 'rounded-full bg-green-100 px-2 py-0.5 text-green-700 text-xs font-medium'
                          : 'rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs font-medium'
                      }
                    >
                      {s.conversion_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
