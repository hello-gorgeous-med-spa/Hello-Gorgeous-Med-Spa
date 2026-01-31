'use client';

// ============================================================
// ADMIN PAYMENTS PAGE
// Payment history and processing - Connected to Live Data
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRecentPayments } from '@/lib/supabase/hooks';
import { isSupabaseConfigured } from '@/lib/supabase/client';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminPaymentsPage() {
  const [dateFilter, setDateFilter] = useState('all');
  
  // Fetch payments from Supabase
  const { payments, loading, error } = useRecentPayments(50);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todayRevenue = payments
      .filter((p: any) => p.created_at?.startsWith(today))
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0);

    const weekRevenue = payments
      .filter((p: any) => new Date(p.created_at) >= weekAgo)
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0);

    const monthRevenue = payments
      .filter((p: any) => new Date(p.created_at) >= monthAgo)
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0);

    const pending = payments
      .filter((p: any) => p.status === 'pending')
      .reduce((sum: number, p: any) => sum + (p.total_amount || 0), 0);

    return { todayRevenue, weekRevenue, monthRevenue, pending };
  }, [payments]);

  // Filter payments by date
  const filteredPayments = useMemo(() => {
    if (dateFilter === 'all') return payments;
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (dateFilter) {
      case 'today':
        return payments.filter((p: any) => p.created_at?.startsWith(today));
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return payments.filter((p: any) => new Date(p.created_at) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return payments.filter((p: any) => new Date(p.created_at) >= monthAgo);
      default:
        return payments;
    }
  }, [payments, dateFilter]);

  // Format date
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format time
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">View and manage payment history</p>
        </div>
        <Link
          href="/pos"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          Open POS Terminal
        </Link>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to see real payment data
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading payments</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Today's Revenue</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-green-600">${stats.todayRevenue.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Week</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">${stats.weekRevenue.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Month</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">${stats.monthRevenue.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-amber-600">${stats.pending.toLocaleString()}</p>
          )}
        </div>
      </div>

      {/* Stripe Status */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-xl">✓</span>
          <div>
            <p className="font-medium text-green-800">Stripe Connected</p>
            <p className="text-sm text-green-700 mt-1">
              Payments are processed through Stripe. View detailed reports in your Stripe Dashboard.
            </p>
            <a 
              href="https://dashboard.stripe.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-green-800 hover:text-green-900"
            >
              Open Stripe Dashboard →
            </a>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Payments</h2>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Client</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Method</th>
                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-28 h-4" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-20 h-6 rounded-full" /></td>
                    <td className="px-5 py-3"><Skeleton className="w-16 h-4 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: any) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{formatDate(payment.created_at)}</p>
                      <p className="text-sm text-gray-500">{formatTime(payment.created_at)}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-900">
                      {payment.client?.first_name} {payment.client?.last_name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {payment.payment_method || 'Card'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : payment.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {payment.status === 'completed' ? '✓ Completed' : payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-semibold text-green-600">
                        +${(payment.total_amount || 0).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
