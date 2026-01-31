'use client';

// ============================================================
// ADMIN APPOINTMENTS PAGE
// View, filter, edit, and manage all appointments
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

// Mock data - will be replaced with Supabase
const MOCK_APPOINTMENTS = [
  {
    id: '1',
    date: '2026-01-31',
    time: '9:00 AM',
    endTime: '9:30 AM',
    client: { id: 'c1', name: 'Jennifer Martinez', phone: '(630) 555-1234', isNew: false },
    service: 'Botox - Full Face',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'completed',
    amount: 450,
    notes: '',
    charted: true,
  },
  {
    id: '2',
    date: '2026-01-31',
    time: '9:45 AM',
    endTime: '10:30 AM',
    client: { id: 'c2', name: 'Amanda Chen', phone: '(630) 555-2345', isNew: true },
    service: 'New Client Consultation',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'in_progress',
    amount: 0,
    notes: 'First visit - interested in Botox & fillers',
    charted: false,
  },
  {
    id: '3',
    date: '2026-01-31',
    time: '10:30 AM',
    endTime: '11:00 AM',
    client: { id: 'c3', name: 'Sarah Johnson', phone: '(630) 555-3456', isNew: false },
    service: 'Lip Filler (1 syringe)',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'checked_in',
    amount: 650,
    notes: '',
    charted: false,
  },
  {
    id: '4',
    date: '2026-01-31',
    time: '11:15 AM',
    endTime: '12:15 PM',
    client: { id: 'c4', name: 'Michelle Williams', phone: '(630) 555-4567', isNew: false },
    service: 'Semaglutide Follow-up',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'confirmed',
    amount: 400,
    notes: 'Week 8 check-in',
    charted: false,
  },
  {
    id: '5',
    date: '2026-01-31',
    time: '1:00 PM',
    endTime: '1:45 PM',
    client: { id: 'c5', name: 'Rachel Brown', phone: '(630) 555-5678', isNew: false },
    service: 'Dermaplaning + Chemical Peel',
    provider: { id: 'p2', name: 'Staff' },
    status: 'confirmed',
    amount: 175,
    notes: '',
    charted: false,
  },
  {
    id: '6',
    date: '2026-01-31',
    time: '2:00 PM',
    endTime: '2:30 PM',
    client: { id: 'c6', name: 'Emily Davis', phone: '(630) 555-6789', isNew: false },
    service: 'Botox Touch-up',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'confirmed',
    amount: 200,
    notes: 'Touch-up from 2 weeks ago',
    charted: false,
  },
  {
    id: '7',
    date: '2026-01-30',
    time: '10:00 AM',
    endTime: '10:30 AM',
    client: { id: 'c7', name: 'Lisa Thompson', phone: '(630) 555-7890', isNew: false },
    service: 'Botox - Full Face',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'completed',
    amount: 400,
    notes: '',
    charted: false,
  },
  {
    id: '8',
    date: '2026-01-30',
    time: '11:00 AM',
    endTime: '11:45 AM',
    client: { id: 'c8', name: 'Karen White', phone: '(630) 555-8901', isNew: false },
    service: 'Filler - Cheeks',
    provider: { id: 'p1', name: 'Ryan Kent, APRN' },
    status: 'completed',
    amount: 850,
    notes: '',
    charted: false,
  },
];

const PROVIDERS = [
  { id: 'p1', name: 'Ryan Kent, APRN' },
  { id: 'p2', name: 'Staff' },
];

const STATUSES = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    in_progress: 'bg-purple-100 text-purple-700',
    checked_in: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-red-100 text-red-700',
  };
  const labels: Record<string, string> = {
    completed: '✓ Completed',
    in_progress: 'In Progress',
    checked_in: 'Checked In',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.confirmed}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AdminAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-01-31');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  // Filter appointments
  const filteredAppointments = MOCK_APPOINTMENTS.filter((apt) => {
    if (selectedDate && apt.date !== selectedDate) return false;
    if (selectedProvider !== 'all' && apt.provider.id !== selectedProvider) return false;
    if (selectedStatus !== 'all' && apt.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        apt.client.name.toLowerCase().includes(query) ||
        apt.service.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const totalRevenue = filteredAppointments
    .filter((a) => a.status === 'completed')
    .reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage all appointments and scheduling</p>
        </div>
        <Link
          href="/admin/appointments/new"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search client or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          {/* Date */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Provider */}
          <div>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">All Providers</option>
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <p className="text-2xl font-bold text-gray-900">{filteredAppointments.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {filteredAppointments.filter((a) => a.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Uncharged</p>
          <p className="text-2xl font-bold text-amber-600">
            {filteredAppointments.filter((a) => !a.charted && a.status === 'completed').length}
          </p>
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
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedAppointment === apt.id ? 'bg-pink-50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{apt.time}</p>
                    <p className="text-xs text-gray-500">{apt.endTime}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/clients/${apt.client.id}`}
                        className="font-medium text-gray-900 hover:text-pink-600"
                      >
                        {apt.client.name}
                      </Link>
                      {apt.client.isNew && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{apt.client.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-900">{apt.service}</p>
                    {apt.notes && (
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{apt.notes}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{apt.provider.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(apt.status)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {apt.amount > 0 ? (
                      <p className="font-medium text-gray-900">${apt.amount}</p>
                    ) : (
                      <p className="text-gray-400">—</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => {}}
                          className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {(apt.status === 'checked_in' || apt.status === 'in_progress') && (
                        <Link
                          href={`/provider/chart/new?client=${apt.client.id}&appointment=${apt.id}`}
                          className="px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          Chart
                        </Link>
                      )}
                      {apt.status === 'completed' && !apt.charted && (
                        <Link
                          href={`/provider/chart/new?client=${apt.client.id}&appointment=${apt.id}`}
                          className="px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        >
                          Chart
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedAppointment(apt.id)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                      >
                        Edit
                      </button>
                      {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                        <button
                          onClick={() => {}}
                          className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
