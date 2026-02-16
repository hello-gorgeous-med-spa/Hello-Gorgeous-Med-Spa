'use client';

// ============================================================
// PAYMENTS VIEW PAGE
// Transaction-level view of all payments
// Links back to Sales for full reconciliation
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Payment {
  id: string;
  payment_number: string;
  sale_id: string;
  payment_method: string;
  payment_processor: string;
  amount: number;
  tip_amount: number;
  processing_fee: number;
  net_amount: number;
  status: string;
  card_brand: string;
  card_last_four: string;
  processor_receipt_url: string;
  created_at: string;
  processed_at: string;
  sales?: {
    sale_number: string;
    gross_total: number;
    status: string;
    clients?: { first_name: string; last_name: string };
    providers?: { name: string };
  };
}

interface Stats {
  total: number;
  totalAmount: number;
  totalTips: number;
  totalFees: number;
  byMethod: {
    card: number;
    cash: number;
    gift_card: number;
    other: number;
  };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-purple-100 text-purple-700',
  partially_refunded: 'bg-orange-100 text-orange-700',
  voided: 'bg-white text-black',
};

const METHOD_ICONS: Record<string, string> = {
  card: '💳',
  cash: '💵',
  gift_card: '🎁',
  membership_credit: '💎',
  account_credit: '📋',
  check: '🧾',
  other: '📝',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
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

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (methodFilter !== 'all') params.set('payment_method', methodFilter);
      
      const dateRange = getDateRange();
      if (dateRange.date) params.set('date', dateRange.date);
      if (dateRange.date_from) params.set('date_from', dateRange.date_from);
      if (dateRange.date_to) params.set('date_to', dateRange.date_to);

      const res = await fetch(`/api/sales/payments?${params}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch payments');
      }

      setPayments(data.payments || []);
      setStats(data.stats || null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, methodFilter, dateFilter, customDateFrom, customDateTo]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin/sales" className="text-sm text-black hover:text-black">
            ← Back to Sales
          </Link>
          <h1 className="text-2xl font-bold text-black mt-1">Payments</h1>
          <p className="text-black text-sm">All transactions linked to sales</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-black">Total Payments</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-black">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-black">Tips</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalTips)}</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <p className="text-sm text-black">Fees</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalFees)}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-4 text-white">
            <p className="text-pink-100 text-sm">Net Received</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount - stats.totalFees)}</p>
          </div>
        </div>
      )}

      {/* Method Breakdown */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <p className="text-xs text-black">Card</p>
              <p className="text-lg font-bold">{formatCurrency(stats.byMethod.card)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <span className="text-2xl">💵</span>
            <div>
              <p className="text-xs text-black">Cash</p>
              <p className="text-lg font-bold">{formatCurrency(stats.byMethod.cash)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-xs text-black">Gift Card</p>
              <p className="text-lg font-bold">{formatCurrency(stats.byMethod.gift_card)}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border p-4 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-xs text-black">Other</p>
              <p className="text-lg font-bold">{formatCurrency(stats.byMethod.other)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="gift_card">Gift Card</option>
            <option value="membership_credit">Membership Credit</option>
          </select>

          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-white hover:bg-white rounded-lg"
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

      {/* Payments Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin text-4xl mb-4">💳</div>
            <p className="text-black">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-4xl">💳</span>
            <p className="text-black mt-2">No payments found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Payment #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Sale #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Method</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-black">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-black">Amount</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-black">Tip</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-black">Fee</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-black">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white">
                  <td className="px-4 py-4 font-mono text-sm text-black">
                    {payment.payment_number}
                  </td>
                  <td className="px-4 py-4 text-sm text-black">
                    {formatDateTime(payment.processed_at || payment.created_at)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    {payment.sales?.clients?.user_profiles ? (
                      `${payment.sales.clients.user_profiles.first_name} ${payment.sales.clients.user_profiles.last_name}`
                    ) : (
                      <span className="text-black">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/sales/${payment.sale_id}`}
                      className="font-mono text-sm text-pink-600 hover:underline"
                    >
                      {payment.sales?.sale_number || payment.sale_id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span>{METHOD_ICONS[payment.payment_method] || '📝'}</span>
                      <span className="capitalize text-sm">{payment.payment_method.replace('_', ' ')}</span>
                      {payment.card_last_four && (
                        <span className="text-black text-xs">•••• {payment.card_last_four}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {payment.amount < 0 ? (
                      <span className="text-red-600">{formatCurrency(payment.amount)}</span>
                    ) : (
                      formatCurrency(payment.amount)
                    )}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-blue-600">
                    {payment.tip_amount > 0 ? formatCurrency(payment.tip_amount) : '—'}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-red-600">
                    {payment.processing_fee > 0 ? `-${formatCurrency(payment.processing_fee)}` : '—'}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-green-600">
                    {formatCurrency(payment.net_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Link
          href="/admin/sales"
          className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
        >
          📋 Sales Ledger
        </Link>
        <Link
          href="/admin/sales/daily-summary"
          className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
        >
          📊 Daily Summary
        </Link>
        <Link
          href="/admin/sales/wallet"
          className="px-4 py-2 bg-white hover:bg-white rounded-lg text-sm"
        >
          💼 Business Wallet
        </Link>
      </div>
    </div>
  );
}
