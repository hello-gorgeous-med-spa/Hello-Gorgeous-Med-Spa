'use client';

// ============================================================
// SALES LEDGER PAGE - FRESHA-LEVEL
// Every sale has an ID, fully searchable, filterable, traceable
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Breadcrumb, ExportButton, NoSalesEmptyState } from '@/components/ui';

interface Sale {
  id: string;
  sale_number: string;
  client_id: string;
  clients?: { 
    id: string;
    user_profiles?: { first_name: string; last_name: string; email: string; phone: string } | null;
  };
  providers?: { 
    id: string;
    user_profiles?: { first_name: string; last_name: string } | null;
  };
  status: string;
  sale_type: string;
  gross_total: number;
  net_total: number;
  tip_total: number;
  balance_due: number;
  created_at: string;
  completed_at: string | null;
  sale_items?: any[];
  sale_payments?: any[];
}

interface Stats {
  total: number;
  grossTotal: number;
  netTotal: number;
  tipsTotal: number;
  outstanding: number;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  unpaid: 'bg-red-100 text-red-700',
  partially_paid: 'bg-orange-100 text-orange-700',
  refunded: 'bg-purple-100 text-purple-700',
  voided: 'bg-gray-200 text-gray-500',
  cancelled: 'bg-gray-200 text-gray-500',
};

export default function SalesLedgerPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  // Pagination
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 25;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDateRange = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    switch (dateFilter) {
      case 'today':
        return { date: today };
      case 'week':
        return { date_from: weekAgo, date_to: today };
      case 'month':
        return { date_from: monthAgo, date_to: today };
      case 'custom':
        return { date_from: customDateFrom, date_to: customDateTo };
      default:
        return {};
    }
  };

  const fetchSales = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const dateRange = getDateRange();
      if (dateRange.date) params.set('date', dateRange.date);
      if (dateRange.date_from) params.set('date_from', dateRange.date_from);
      if (dateRange.date_to) params.set('date_to', dateRange.date_to);
      
      params.set('limit', limit.toString());
      params.set('offset', (page * limit).toString());

      const res = await fetch(`/api/sales?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch sales');
      }

      setSales(data.sales || []);
      setStats(data.stats || null);
      setTotalCount(data.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, dateFilter, customDateFrom, customDateTo, page]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  // Export columns
  const exportColumns = [
    { key: 'sale_number', label: 'Sale #' },
    { key: 'created_at', label: 'Date', format: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'status', label: 'Status' },
    { key: 'gross_total', label: 'Gross Total', format: (v: number) => `$${(v / 100).toFixed(2)}` },
    { key: 'net_total', label: 'Net Total', format: (v: number) => `$${(v / 100).toFixed(2)}` },
    { key: 'tip_total', label: 'Tips', format: (v: number) => `$${(v / 100).toFixed(2)}` },
    { key: 'balance_due', label: 'Balance Due', format: (v: number) => `$${(v / 100).toFixed(2)}` },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-500 text-sm">Every transaction with a unique Sale ID</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={sales}
            filename="sales"
            columns={exportColumns}
          />
          <Link
            href="/pos"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + New Sale
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Gross Total</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.grossTotal)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Net Total</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.netTotal)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-gray-500">Tips</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.tipsTotal)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <p className="text-sm text-amber-700">Outstanding</p>
            <p className="text-2xl font-bold text-amber-700">{formatCurrency(stats.outstanding)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by Sale # or notes..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="unpaid">Unpaid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="draft">Draft</option>
            <option value="refunded">Refunded</option>
            <option value="voided">Voided</option>
          </select>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(0); }}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateFilter === 'custom' && (
            <>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </>
          )}

          <button
            onClick={fetchSales}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Sales Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin text-4xl mb-4">💰</div>
            <p className="text-gray-500">Loading sales...</p>
          </div>
        ) : sales.length === 0 ? (
          <NoSalesEmptyState />
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Sale #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Provider</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tips</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gross Total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/sales/${sale.id}`}
                      className="font-mono font-medium text-pink-600 hover:text-pink-700 hover:underline"
                    >
                      {sale.sale_number}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    {sale.clients?.user_profiles ? (
                      <div>
                        <p className="font-medium">{sale.clients.user_profiles.first_name} {sale.clients.user_profiles.last_name}</p>
                        <p className="text-xs text-gray-400">{sale.clients.user_profiles.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Walk-in</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[sale.status] || 'bg-gray-100'}`}>
                      {sale.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm">{formatDate(sale.created_at)}</p>
                    <p className="text-xs text-gray-400">{formatTime(sale.created_at)}</p>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {sale.providers?.user_profiles 
                      ? `${sale.providers.user_profiles.first_name} ${sale.providers.user_profiles.last_name}`
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-right text-sm">
                    {sale.tip_total > 0 ? formatCurrency(sale.tip_total) : '—'}
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {formatCurrency(sale.gross_total)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {sale.balance_due > 0 ? (
                      <span className="text-red-600 font-medium">{formatCurrency(sale.balance_due)}</span>
                    ) : (
                      <span className="text-green-600">Paid</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/sales/${sale.id}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalCount > limit && (
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {page * limit + 1} - {Math.min((page + 1) * limit, totalCount)} of {totalCount}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={(page + 1) * limit >= totalCount}
                className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Link
          href="/admin/sales/daily-summary"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          📊 Daily Summary
        </Link>
        <Link
          href="/admin/sales/payments"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          💳 Payments
        </Link>
        <Link
          href="/admin/sales/wallet"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
        >
          💼 Business Wallet
        </Link>
      </div>
    </div>
  );
}
