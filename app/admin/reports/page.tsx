'use client';

// ============================================================
// REPORTS & ANALYTICS PAGE
// Real-time business intelligence - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useReports } from '@/lib/supabase/hooks';
import { isSupabaseConfigured } from '@/lib/supabase/client';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'providers' | 'clients'>('overview');
  
  // Calculate date range
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    let start = new Date();
    
    switch (dateRange) {
      case 'today':
        start = new Date();
        break;
      case 'week':
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  }, [dateRange]);

  // Fetch report data based on active tab
  const { report, loading, error } = useReports(
    activeTab === 'overview' ? 'overview' :
    activeTab === 'services' ? 'services' :
    activeTab === 'providers' ? 'providers' : 'clients',
    startDate,
    endDate
  );

  // Export handler
  const handleExport = (format: 'csv' | 'pdf') => {
    alert(`Export ${format.toUpperCase()} - Feature coming soon`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500">Track performance and business metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Demo Mode - Connect Supabase to see real analytics
        </div>
      )}

      {/* Date Range & Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Date Range */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  dateRange === range
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>

          {/* Report Tabs */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            {(['overview', 'services', 'providers', 'clients'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              {loading ? (
                <Skeleton className="h-9 w-32" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  ${(report?.revenue?.total || 0).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-green-600 mt-1">
                {report?.revenue?.transactionCount || 0} transactions
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-1">Avg Ticket</p>
              {loading ? (
                <Skeleton className="h-9 w-24" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  ${(report?.revenue?.avgTicket || 0).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">per transaction</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-1">Appointments</p>
              {loading ? (
                <Skeleton className="h-9 w-20" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {report?.appointments?.total || 0}
                </p>
              )}
              <p className="text-sm text-green-600 mt-1">
                {report?.appointments?.completionRate || 0}% completion rate
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm text-gray-500 mb-1">New Clients</p>
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {report?.clients?.new || 0}
                </p>
              )}
              <p className="text-sm text-purple-600 mt-1">this period</p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointment Breakdown */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Appointment Status</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {report?.appointments?.completed || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">No Shows</span>
                    <span className="font-semibold text-red-600">
                      {report?.appointments?.noShows || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-semibold text-gray-600">
                      {report?.appointments?.cancelled || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-gray-600">No Show Rate</span>
                    <span className="font-semibold text-amber-600">
                      {report?.appointments?.noShowRate || 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tips & Discounts */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Revenue</span>
                    <span className="font-semibold text-gray-900">
                      ${((report?.revenue?.total || 0) - (report?.revenue?.tips || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tips</span>
                    <span className="font-semibold text-green-600">
                      +${(report?.revenue?.tips || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      ${(report?.revenue?.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Revenue by Service</h2>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : report?.services?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No service data for this period
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(report?.services || []).map((service: any, index: number) => (
                <div key={service.id} className="px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.count} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${service.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">
                      ${Math.round(service.revenue / service.count).toLocaleString()} avg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === 'providers' && (
        <div className="bg-white rounded-xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Provider Performance</h2>
          </div>
          
          {loading ? (
            <div className="p-5 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : report?.providers?.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No provider data for this period
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(report?.providers || []).map((provider: any) => (
                <div key={provider.id} className="px-5 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {provider.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{provider.name}</p>
                        <p className="text-sm text-gray-500">{provider.appointments} appointments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${provider.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{provider.completed} completed</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">
                      Completion: <span className="font-medium text-gray-900">
                        {provider.appointments ? Math.round((provider.completed / provider.appointments) * 100) : 0}%
                      </span>
                    </span>
                    <span className="text-gray-500">
                      No Shows: <span className="font-medium text-red-600">{provider.noShows}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clients Tab */}
      {activeTab === 'clients' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* New Clients */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">New Clients</h2>
              <p className="text-sm text-gray-500">{report?.newClients?.total || 0} this period</p>
            </div>
            
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                {/* By Source */}
                <div className="p-5 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-3">Acquisition Source</p>
                  <div className="space-y-2">
                    {Object.entries(report?.newClients?.bySource || {}).map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-gray-600 capitalize">{source.replace('_', ' ')}</span>
                        <span className="font-medium text-gray-900">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent New Clients */}
                <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                  {(report?.newClients?.list || []).slice(0, 10).map((client: any) => (
                    <Link
                      key={client.id}
                      href={`/admin/clients/${client.id}`}
                      className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(client.created_at).toLocaleDateString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Top Clients by Lifetime Value</h2>
            </div>
            
            {loading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {(report?.topClients || []).map((client: any, index: number) => (
                  <Link
                    key={client.id}
                    href={`/admin/clients/${client.id}`}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-gray-400">#{index + 1}</span>
                      <span className="font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(client.total_spent || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{client.total_visits || 0} visits</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
