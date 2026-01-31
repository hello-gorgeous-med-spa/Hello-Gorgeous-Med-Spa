'use client';

// ============================================================
// PROVIDER CHARTS PAGE
// View and search all patient charts
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

const RECENT_CHARTS = [
  {
    id: '1',
    clientName: 'Jennifer Martinez',
    service: 'Botox - Full Face',
    date: '2026-01-30',
    status: 'signed',
    units: '28 units',
  },
  {
    id: '2',
    clientName: 'Sarah Johnson',
    service: 'Lip Filler',
    date: '2026-01-29',
    status: 'signed',
    units: '1 syringe',
  },
  {
    id: '3',
    clientName: 'Emily Chen',
    service: 'Botox Touch-up',
    date: '2026-01-28',
    status: 'pending',
    units: '12 units',
  },
  {
    id: '4',
    clientName: 'Amanda Wilson',
    service: 'Consultation',
    date: '2026-01-27',
    status: 'signed',
    units: null,
  },
];

export default function ProviderChartsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'signed'>('all');

  const filteredCharts = RECENT_CHARTS.filter((chart) => {
    const matchesSearch = chart.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || chart.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Charts</h1>
          <p className="text-gray-500">View and manage treatment records</p>
        </div>
        <Link
          href="/provider/chart/new"
          className="px-4 py-2 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600"
        >
          + New Chart
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Charts</p>
          <p className="text-2xl font-bold text-gray-900">156</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-indigo-600">12</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Pending Signature</p>
          <p className="text-2xl font-bold text-amber-500">3</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'signed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === status
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status === 'pending' ? 'Needs Signature' : 'Signed'}
            </button>
          ))}
        </div>
      </div>

      {/* Charts List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Patient</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Service</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Details</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Date</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCharts.map((chart) => (
              <tr key={chart.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{chart.clientName}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">{chart.service}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{chart.units || '-'}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(chart.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    chart.status === 'signed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {chart.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/provider/chart/${chart.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Chart →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCharts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No charts found matching your search.</p>
        </div>
      )}
    </div>
  );
}
