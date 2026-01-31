'use client';

// ============================================================
// ADMIN DASHBOARD HOME
// Command Center Overview - Connected to Live Data
// ============================================================

import Link from 'next/link';
import { useDashboardStats, useTodaysAppointments, useRecentPayments } from '@/lib/supabase/hooks';
import { isSupabaseConfigured } from '@/lib/supabase/client';

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-purple-100 text-purple-700',
    checked_in: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-gray-100 text-gray-600',
    booked: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-red-100 text-red-700',
  };

  const labels: Record<string, string> = {
    completed: '✓ Completed',
    in_progress: 'In Progress',
    checked_in: 'Checked In',
    confirmed: 'Confirmed',
    booked: 'Booked',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}

// Skeleton loading component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminDashboard() {
  // Live data hooks
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { appointments, loading: apptsLoading } = useTodaysAppointments();
  const { payments, loading: paymentsLoading } = useRecentPayments(5);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Format time from ISO string
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format relative time
  const formatRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return formatTime(isoString);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/appointments/new"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + New Appointment
          </Link>
          <Link
            href="/admin/clients/new"
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            + New Client
          </Link>
        </div>
      </div>

      {/* Connection Status */}
      {!isSupabaseConfigured() && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 font-medium">Demo Mode</p>
          <p className="text-sm text-amber-700">
            Supabase is not configured. Showing sample data. Add your Supabase credentials to .env.local to connect to live data.
          </p>
        </div>
      )}

      {/* Error State */}
      {statsError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading data</p>
          <p className="text-sm text-red-700">{statsError}</p>
        </div>
      )}

      {/* Alerts */}
      {(stats.pendingCharts > 0 || stats.expiringConsents > 0) && (
        <div className="space-y-2">
          {stats.pendingCharts > 0 && (
            <Link
              href="/admin/charts?status=unsigned"
              className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800"
            >
              <span className="text-sm font-medium">{stats.pendingCharts} unsigned charts need attention</span>
              <span className="text-sm">→</span>
            </Link>
          )}
          {stats.expiringConsents > 0 && (
            <Link
              href="/admin/consents?status=expiring"
              className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800"
            >
              <span className="text-sm font-medium">{stats.expiringConsents} consent forms expiring this week</span>
              <span className="text-sm">→</span>
            </Link>
          )}
        </div>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Today's Appointments</p>
          {statsLoading ? (
            <Skeleton className="h-9 w-16" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{stats.todaysAppointments}</p>
          )}
          <p className="text-sm text-green-600 mt-1">{stats.completed} completed</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Today's Revenue</p>
          {statsLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">from {stats.completed} services</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">New Clients Today</p>
          {statsLoading ? (
            <Skeleton className="h-9 w-12" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">{stats.newClients}</p>
          )}
          <p className="text-sm text-purple-600 mt-1">Welcome aboard!</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">Weekly Revenue</p>
          {statsLoading ? (
            <Skeleton className="h-9 w-28" />
          ) : (
            <p className="text-3xl font-bold text-gray-900">${stats.weeklyRevenue.toLocaleString()}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">${stats.avgTicket} avg ticket</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Today's Schedule</h2>
            <Link
              href="/admin/calendar"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              View Calendar →
            </Link>
          </div>
          
          {apptsLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No appointments scheduled for today</p>
              <Link
                href="/admin/appointments/new"
                className="mt-2 inline-block text-pink-600 hover:text-pink-700 font-medium"
              >
                + Book an appointment
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {appointments.slice(0, 8).map((apt) => (
                <div key={apt.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-gray-900 w-20">
                        {formatTime(apt.scheduled_at)}
                      </div>
                      <div>
                        <Link
                          href={`/admin/appointments/${apt.id}`}
                          className="font-medium text-gray-900 hover:text-pink-600"
                        >
                          {apt.client?.first_name} {apt.client?.last_name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {apt.service?.name || 'Service'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-500">
                          {apt.provider?.first_name} {apt.provider?.last_name}
                        </p>
                        {apt.service?.price && (
                          <p className="text-sm font-medium text-gray-900">
                            ${apt.service.price}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Payments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Recent Payments</h2>
              <Link
                href="/admin/payments"
                className="text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                View All →
              </Link>
            </div>
            
            {paymentsLoading ? (
              <div className="p-5 space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <div className="p-5 text-center text-gray-500">
                No recent payments
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {payments.map((payment: any) => (
                  <div key={payment.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.client?.first_name} {payment.client?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(payment.created_at)} • {payment.payment_method || 'Card'}
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">
                        +${payment.total_amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/calendar"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>📅</span>
                <span className="font-medium text-gray-700">View Schedule</span>
              </Link>
              <Link
                href="/admin/clients/new"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>👤</span>
                <span className="font-medium text-gray-700">Add New Client</span>
              </Link>
              <Link
                href="/pos"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>💰</span>
                <span className="font-medium text-gray-700">Open POS</span>
              </Link>
              <Link
                href="/admin/reports"
                className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>📈</span>
                <span className="font-medium text-gray-700">View Reports</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
            <h2 className="font-semibold mb-3">System Status</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Database</span>
                <span className={isSupabaseConfigured() ? 'text-green-400' : 'text-amber-400'}>
                  ● {isSupabaseConfigured() ? 'Connected' : 'Demo Mode'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Booking</span>
                <span className="text-green-400">● Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Payments (Stripe)</span>
                <span className="text-amber-400">● Setup Required</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className="text-xs text-gray-400">
                Hello Gorgeous OS v1.3.0
              </p>
              <p className="text-xs text-gray-400">
                {isSupabaseConfigured() ? 'Live Data' : 'Development Mode'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
