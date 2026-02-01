'use client';

// ============================================================
// APPOINTMENT DETAIL PAGE
// View and manage individual appointment - Connected to Live Data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const STATUSES = [
  { value: 'confirmed', label: 'Confirmed', color: 'bg-gray-100 text-gray-700' },
  { value: 'checked_in', label: 'Checked In', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  { value: 'no_show', label: 'No Show', color: 'bg-red-100 text-red-700' },
];

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const [appointment, setAppointment] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch appointment from API
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        
        // Find the specific appointment
        const apt = data.appointments?.find((a: any) => a.id === params.id);
        if (apt) {
          // Transform to expected format
          setAppointment({
            ...apt,
            scheduled_at: apt.starts_at,
            client: {
              id: apt.client_id,
              first_name: apt.client_name?.split(' ')[0] || '',
              last_name: apt.client_name?.split(' ').slice(1).join(' ') || '',
              email: apt.client_email,
              phone: apt.client_phone,
            },
            service: {
              id: apt.service_id,
              name: apt.service_name,
              duration_minutes: apt.duration,
              price: apt.service_price,
            },
            provider: {
              id: apt.provider_id,
              first_name: apt.provider_name?.split(' ')[0] || '',
              last_name: apt.provider_name?.split(' ').slice(1).join(' ') || '',
            },
          });
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [params.id]);

  const currentStatus = STATUSES.find((s) => s.value === appointment?.status);

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    setSaving(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointment.id, status: newStatus }),
      });

      if (res.ok) {
        setAppointment({ ...appointment, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;
    setSaving(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: appointment.id, 
          status: 'cancelled', 
          cancel_reason: cancelReason 
        }),
      });

      if (res.ok) {
        setAppointment({ ...appointment, status: 'cancelled' });
        setShowCancelModal(false);
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCheckIn = () => handleStatusChange('checked_in');

  // Format date/time
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return { date: '-', time: '-' };
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-32 mb-4" />
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500 mb-4">Appointment not found</p>
        <Link href="/admin/appointments" className="text-pink-600 hover:text-pink-700">
          ← Back to Appointments
        </Link>
      </div>
    );
  }

  const { date, time } = formatDateTime(appointment.scheduled_at);
  const clientName = `${appointment.client?.first_name || ''} ${appointment.client?.last_name || ''}`.trim() || 'Unknown Client';
  const providerName = `${appointment.provider?.first_name || ''} ${appointment.provider?.last_name || ''}`.trim() || 'Unknown Provider';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/appointments"
          className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
        >
          ← Back to Appointments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
            <p className="text-gray-500">{date} at {time}</p>
          </div>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${currentStatus?.color || 'bg-gray-100'}`}>
            {currentStatus?.label || appointment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-6 flex-wrap">
              {/* Client */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {clientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <Link
                      href={`/admin/clients/${appointment.client?.id}`}
                      className="font-semibold text-gray-900 hover:text-pink-600"
                    >
                      {clientName}
                    </Link>
                    {appointment.client?.is_vip && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                        💎 VIP
                      </span>
                    )}
                    <p className="text-sm text-gray-500">{appointment.client?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service</h3>
                <p className="font-semibold text-gray-900">{appointment.service?.name || 'Service'}</p>
                <p className="text-sm text-gray-500">
                  {appointment.service?.duration_minutes || appointment.duration_minutes || 30} min • ${appointment.service?.price || 0}
                </p>
              </div>

              {/* Provider */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Provider</h3>
                <p className="font-semibold text-gray-900">{providerName}</p>
                {appointment.provider?.title && (
                  <p className="text-sm text-gray-500">{appointment.provider.title}</p>
                )}
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                <p className="text-gray-900">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Status Checklist */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700">Appointment booked</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={appointment.status !== 'confirmed' ? 'text-green-500' : 'text-gray-300'}>
                    {appointment.status !== 'confirmed' ? '✓' : '○'}
                  </span>
                  <span className="text-gray-700">Client checked in</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className={appointment.status === 'completed' ? 'text-green-500' : 'text-gray-300'}>
                    {appointment.status === 'completed' ? '✓' : '○'}
                  </span>
                  <span className="text-gray-700">Appointment completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {appointment.status === 'confirmed' && (
                <button
                  onClick={handleCheckIn}
                  disabled={saving}
                  className="w-full px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  ✓ Check In Client
                </button>
              )}
              {(appointment.status === 'checked_in' || appointment.status === 'in_progress') && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  disabled={saving}
                  className="w-full px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  ✓ Mark Completed
                </button>
              )}
              {appointment.status === 'completed' && (
                <Link
                  href={`/pos?appointment=${appointment.id}`}
                  className="block w-full px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  💳 Process Payment
                </Link>
              )}
                <Link
                  href={`/admin/appointments/${appointment.id}/edit`}
                  className="block w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  ✏️ Edit Appointment
                </Link>
                <Link
                  href={`/admin/appointments/${appointment.id}/reschedule`}
                  className="block w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  📅 Reschedule
                </Link>
                <Link
                  href={`/admin/charting?appointment=${appointment.id}`}
                  className="block w-full px-4 py-2.5 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors text-center"
                >
                  📋 Chart Note
                </Link>
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    ✗ Cancel Appointment
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('Are you sure you want to permanently delete this appointment? This cannot be undone.')) {
                        try {
                          const res = await fetch(`/api/appointments/${appointment.id}`, { method: 'DELETE' });
                          if (res.ok) {
                            window.location.href = '/admin/appointments';
                          } else {
                            alert('Failed to delete appointment');
                          }
                        } catch (err) {
                          alert('Failed to delete appointment');
                        }
                      }
                    }}
                    className="w-full px-4 py-2.5 text-red-500 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🗑️ Delete Permanently
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Change Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Change Status</h3>
            <div className="space-y-2">
              {STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={appointment.status === status.value || saving}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    appointment.status === status.value
                      ? `${status.color} font-medium`
                      : 'hover:bg-gray-50 text-gray-700'
                  } disabled:cursor-not-allowed`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Client */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Client</h3>
            <div className="space-y-2">
              {appointment.client?.phone && (
                <>
                  <a
                    href={`tel:${appointment.client.phone}`}
                    className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>📞</span>
                    <span className="text-gray-700">Call</span>
                  </a>
                  <a
                    href={`sms:${appointment.client.phone}`}
                    className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>💬</span>
                    <span className="text-gray-700">Text</span>
                  </a>
                </>
              )}
              {appointment.client?.email && (
                <a
                  href={`mailto:${appointment.client.email}`}
                  className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span>✉️</span>
                  <span className="text-gray-700">Email</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Appointment</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this appointment? The client will be notified.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cancellation Reason
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select reason...</option>
                <option value="client_request">Client requested</option>
                <option value="provider_unavailable">Provider unavailable</option>
                <option value="illness">Client illness</option>
                <option value="weather">Weather/Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {saving ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
