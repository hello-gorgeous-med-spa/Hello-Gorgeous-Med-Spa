// ============================================================
// CHART-TO-CART - Session History
// View past treatment sessions and sales
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Session {
  id: string;
  client_name: string;
  provider: string;
  date: string;
  treatment_summary: string;
  products_count: number;
  total: number;
  payment_method: string;
  status: 'completed' | 'refunded' | 'partial_refund';
}

export default function SessionHistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/chart-to-cart/sessions?limit=100');
        const data = await res.json();
        if (cancelled) return;
        const raw = (data.sessions || []) as Array<{
          id: string;
          client_name: string | null;
          provider: string | null;
          started_at: string;
          treatment_summary: string | null;
          products: unknown[] | null;
          total: number;
          status: string;
        }>;
        const mapped: Session[] = raw.map((s) => ({
          id: s.id,
          client_name: s.client_name || 'Unknown',
          provider: s.provider || 'Staff',
          date: s.started_at,
          treatment_summary: s.treatment_summary || '—',
          products_count: Array.isArray(s.products) ? s.products.length : 0,
          total: Number(s.total) || 0,
          payment_method: '—',
          status: s.status === 'completed' ? 'completed' : s.status === 'refunded' ? 'refunded' : 'completed',
        }));
        setSessions(mapped);
      } catch (e) {
        console.error('Session history fetch error:', e);
        if (!cancelled) setSessions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = !searchQuery || 
      s.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.treatment_summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (dateRange === 'today') {
      return matchesSearch && new Date(s.date).toDateString() === new Date().toDateString();
    } else if (dateRange === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return matchesSearch && new Date(s.date) >= weekAgo;
    }
    return matchesSearch;
  });

  const totalRevenue = filteredSessions.reduce((sum, s) => sum + s.total, 0);
  const totalSessions = filteredSessions.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-2">
            <Link href="/admin/chart-to-cart" className="hover:text-pink-600">Chart-to-Cart</Link>
            <span>→</span>
            <span>Session History</span>
          </div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <span className="text-3xl">📜</span>
            Session History
          </h1>
          <p className="text-black mt-1">View past treatment sessions and transactions</p>
        </div>
        <Link
          href="/admin/chart-to-cart/new"
          className="px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors font-medium flex items-center gap-2"
        >
          <span>➕</span> New Session
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Total Sessions</p>
              <p className="text-3xl font-bold text-black mt-1">{totalSessions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Average Sale</p>
              <p className="text-3xl font-bold text-black mt-1">
                ${totalSessions > 0 ? (totalRevenue / totalSessions).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black shadow-sm mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client or treatment..."
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDateRange('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'today' ? 'bg-pink-100 text-pink-700' : 'bg-white text-black hover:bg-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'week' ? 'bg-pink-100 text-pink-700' : 'bg-white text-black hover:bg-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === 'all' ? 'bg-pink-100 text-pink-700' : 'bg-white text-black hover:bg-white'
              }`}
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-black">Loading...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-5xl">📭</span>
            <h3 className="text-lg font-semibold text-black mt-4">No sessions found</h3>
            <p className="text-black mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Date & Time</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Client</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-black">Treatment</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-black">Products</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-black">Payment</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-black">Total</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-black">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-white">
                  <td className="px-6 py-4">
                    <p className="font-medium text-black">{formatDate(session.date)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {session.client_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-black">{session.client_name}</p>
                        <p className="text-xs text-black">{session.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-black text-sm max-w-xs truncate">{session.treatment_summary}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-black">
                      {session.products_count} items
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-black">{session.payment_method}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-black">
                      ${session.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      session.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : session.status === 'refunded'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {session.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-pink-600 hover:text-pink-700 font-medium text-sm">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
