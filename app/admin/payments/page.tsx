'use client';

// ============================================================
// ADMIN PAYMENTS PAGE
// Payment history and processing
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const MOCK_PAYMENTS = [
  { id: 'p1', date: '2026-01-31', time: '9:45 AM', client: 'Jennifer Martinez', service: 'Botox - Full Face', amount: 450, method: 'Visa •••• 4242', status: 'completed' },
  { id: 'p2', date: '2026-01-31', time: '9:30 AM', client: 'Lisa Thompson', service: 'Botox + Filler', amount: 850, method: 'Amex •••• 1001', status: 'completed' },
  { id: 'p3', date: '2026-01-30', time: '3:15 PM', client: 'Karen White', service: 'Dermal Filler', amount: 650, method: 'Mastercard •••• 5555', status: 'completed' },
  { id: 'p4', date: '2026-01-30', time: '11:00 AM', client: 'Sarah Johnson', service: 'Glass Glow Facial', amount: 175, method: 'Visa •••• 9876', status: 'completed' },
  { id: 'p5', date: '2026-01-29', time: '2:00 PM', client: 'Rachel Brown', service: 'Semaglutide', amount: 400, method: 'Visa •••• 4242', status: 'completed' },
];

export default function AdminPaymentsPage() {
  const [dateFilter, setDateFilter] = useState('all');

  const totalRevenue = MOCK_PAYMENTS.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">View and manage payment history</p>
        </div>
        <Link
          href="/admin/payments/new"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Process Payment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Today's Revenue</p>
          <p className="text-2xl font-bold text-green-600">$1,300</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-gray-900">$8,750</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold text-gray-900">$42,500</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">$0</p>
        </div>
      </div>

      {/* Stripe Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium text-amber-800">Stripe Integration Required</p>
            <p className="text-sm text-amber-700 mt-1">
              Connect your Stripe account to process payments directly in Hello Gorgeous OS.
              Currently showing mock data.
            </p>
            <button className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900">
              Connect Stripe →
            </button>
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Client</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Service</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Method</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_PAYMENTS.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">{payment.date}</p>
                  <p className="text-sm text-gray-500">{payment.time}</p>
                </td>
                <td className="px-5 py-3 text-gray-900">{payment.client}</td>
                <td className="px-5 py-3 text-gray-600">{payment.service}</td>
                <td className="px-5 py-3 text-gray-600">{payment.method}</td>
                <td className="px-5 py-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                    ✓ Completed
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className="font-semibold text-green-600">+${payment.amount}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
