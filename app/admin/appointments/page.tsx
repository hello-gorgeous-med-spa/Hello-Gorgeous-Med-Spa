'use client';

// ============================================================
// ADMIN APPOINTMENTS PAGE
// View, filter, edit, and manage all appointments
// Connected to Live API Data
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// Status configuration
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-100' },
  confirmed: { label: 'Confirmed', color: 'text-blue-700', bg: 'bg-blue-100' },
  checked_in: { label: 'Checked In', color: 'text-green-700', bg: 'bg-green-100' },
  in_progress: { label: 'In Progress', color: 'text-purple-700', bg: 'bg-purple-100' },
  completed: { label: 'Completed', color: 'text-gray-600', bg: 'bg-gray-100' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-100' },
  no_show: { label: 'No Show', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function AdminAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProvider, setFilterProvider] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State for API data
  const [appointments, setAppointments] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments from API
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/appointments?date=${selectedDate}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load appointments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Fetch providers from API
  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      if (data.providers) {
        setProviders(data.providers);
      }
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const refetch = fetchAppointments;

  // Filter and search appointments
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by provider
    if (filterProvider !== 'all') {
      filtered = filtered.filter(apt => apt.provider?.id === filterProvider);
    }

    // Search by client name
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(apt =>
        `${apt.client?.first_name} ${apt.client?.last_name}`.toLowerCase().includes(query) ||
        apt.service?.name?.toLowerCase().includes(query)
      );
    }

    // Sort by time (use starts_at from API)
    filtered.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());

    return filtered;
  }, [appointments, filterStatus, filterProvider, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const checkedIn = appointments.filter(a => a.status === 'checked_in').length;
    const inProgress = appointments.filter(a => a.status === 'in_progress').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show').length;
    const revenue = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.service?.price || 0), 0);

    return { total, completed, checkedIn, inProgress, cancelled, revenue };
  }, [appointments]);

  // Format time
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Date navigation
  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">View and manage all appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/calendar"
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            📅 Calendar View
          </Link>
          <Link
            href="/admin/appointments/new"
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + New Appointment
          </Link>
        </div>
      </div>


      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error loading appointments</p>
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={refetch} className="mt-2 text-sm text-red-600 underline">
            Try again
          </button>
        </div>
      )}

      {/* Date Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <button
              onClick={() => changeDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg font-medium"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Provider Filter */}
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Providers</option>
              {providers.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.first_name || p.firstName} {p.last_name || p.lastName}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>

            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 w-48"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Checked In</p>
          <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-pink-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Time</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Client</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Service</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Provider</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Price</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="w-20 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-40 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-28 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-24 h-6 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-16 h-4" /></td>
                    <td className="px-4 py-3"><Skeleton className="w-20 h-8" /></td>
                  </tr>
                ))
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-gray-500 mb-2">
                      {appointments.length === 0
                        ? 'No appointments scheduled for this date'
                        : 'No appointments match your filters'
                      }
                    </p>
                    <Link href="/admin/appointments/new" className="text-pink-600 hover:text-pink-700 font-medium">
                      + Book an appointment
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const statusConfig = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          {formatTime(apt.starts_at)}
                        </span>
                        <p className="text-xs text-gray-500">{apt.duration || 30} min</p>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/clients/${apt.client_id}`}
                          className="font-medium text-gray-900 hover:text-pink-600"
                        >
                          {apt.client_name || 'Unknown'}
                        </Link>
                        {apt.client_phone && (
                          <p className="text-sm text-gray-500">{apt.client_phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900">{apt.service_name || 'Service'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600">
                          {apt.provider_name || 'Provider'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">
                          ${apt.service_price || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/appointments/${apt.id}`}
                            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/charts?appointment=${apt.id}`}
                            className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg"
                          >
                            Chart
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {filteredAppointments.length} of {appointments.length} appointments
          </p>
        </div>
      </div>
    </div>
  );
}
