'use client';

// ============================================================
// APPOINTMENT DETAIL PAGE
// View and manage individual appointment
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Mock data
const MOCK_APPOINTMENT = {
  id: 'a1',
  date: '2026-01-31',
  time: '9:00 AM',
  endTime: '9:30 AM',
  client: {
    id: 'c1',
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@email.com',
    phone: '(630) 555-1234',
    membershipStatus: 'active',
  },
  service: {
    id: 's1',
    name: 'Botox - Full Face',
    duration: 30,
    price: 450,
  },
  provider: {
    id: 'p1',
    name: 'Ryan Kent, APRN',
  },
  status: 'confirmed',
  notes: 'Requested glabella focus',
  createdAt: '2026-01-25 3:45 PM',
  confirmationSent: true,
  reminderSent: true,
  intakeComplete: true,
  consentValid: true,
  depositPaid: false,
  depositAmount: 0,
};

const STATUSES = [
  { value: 'confirmed', label: 'Confirmed', color: 'bg-gray-100 text-gray-700' },
  { value: 'checked_in', label: 'Checked In', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  { value: 'no_show', label: 'No Show', color: 'bg-red-100 text-red-700' },
];

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [appointment, setAppointment] = useState(MOCK_APPOINTMENT);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const currentStatus = STATUSES.find((s) => s.value === appointment.status);

  const handleStatusChange = (newStatus: string) => {
    setAppointment({ ...appointment, status: newStatus });
    // TODO: Save to Supabase
  };

  const handleCancel = () => {
    setAppointment({ ...appointment, status: 'cancelled' });
    setShowCancelModal(false);
    // TODO: Save to Supabase, send notification
  };

  const handleCheckIn = () => {
    setAppointment({ ...appointment, status: 'checked_in' });
    // TODO: Save to Supabase
  };

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
            <p className="text-gray-500">
              {appointment.date} at {appointment.time}
            </p>
          </div>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${currentStatus?.color}`}>
            {currentStatus?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start gap-6">
              {/* Client */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Client</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {appointment.client.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <Link
                      href={`/admin/clients/${appointment.client.id}`}
                      className="font-semibold text-gray-900 hover:text-pink-600"
                    >
                      {appointment.client.name}
                    </Link>
                    {appointment.client.membershipStatus === 'active' && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                        💎 VIP
                      </span>
                    )}
                    <p className="text-sm text-gray-500">{appointment.client.phone}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service</h3>
                <p className="font-semibold text-gray-900">{appointment.service.name}</p>
                <p className="text-sm text-gray-500">
                  {appointment.service.duration} min • ${appointment.service.price}
                </p>
              </div>

              {/* Provider */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Provider</h3>
                <p className="font-semibold text-gray-900">{appointment.provider.name}</p>
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
                  <span className={appointment.confirmationSent ? 'text-green-500' : 'text-gray-300'}>
                    {appointment.confirmationSent ? '✓' : '○'}
                  </span>
                  <span className="text-gray-700">Confirmation sent</span>
                </div>
                {!appointment.confirmationSent && (
                  <button className="text-sm text-pink-600 hover:text-pink-700">Send Now</button>
                )}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={appointment.reminderSent ? 'text-green-500' : 'text-gray-300'}>
                    {appointment.reminderSent ? '✓' : '○'}
                  </span>
                  <span className="text-gray-700">Reminder sent</span>
                </div>
                {!appointment.reminderSent && (
                  <button className="text-sm text-pink-600 hover:text-pink-700">Send Now</button>
                )}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={appointment.intakeComplete ? 'text-green-500' : 'text-amber-500'}>
                    {appointment.intakeComplete ? '✓' : '⚠'}
                  </span>
                  <span className="text-gray-700">Intake form complete</span>
                </div>
                {!appointment.intakeComplete && (
                  <button className="text-sm text-pink-600 hover:text-pink-700">Send Form</button>
                )}
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={appointment.consentValid ? 'text-green-500' : 'text-red-500'}>
                    {appointment.consentValid ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-700">Consent forms valid</span>
                </div>
                {!appointment.consentValid && (
                  <button className="text-sm text-pink-600 hover:text-pink-700">Send Consent</button>
                )}
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className={appointment.depositPaid ? 'text-green-500' : 'text-gray-300'}>
                    {appointment.depositPaid ? '✓' : '○'}
                  </span>
                  <span className="text-gray-700">Deposit collected</span>
                </div>
                {!appointment.depositPaid && (
                  <span className="text-sm text-gray-500">Not required</span>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Activity</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  📅
                </div>
                <div>
                  <p className="text-sm text-gray-900">Appointment created</p>
                  <p className="text-xs text-gray-500">{appointment.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  ✉️
                </div>
                <div>
                  <p className="text-sm text-gray-900">Confirmation email sent</p>
                  <p className="text-xs text-gray-500">{appointment.createdAt}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                  🔔
                </div>
                <div>
                  <p className="text-sm text-gray-900">24-hour reminder sent</p>
                  <p className="text-xs text-gray-500">2026-01-30 9:00 AM</p>
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
                  className="w-full px-4 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  ✓ Check In Client
                </button>
              )}
              {(appointment.status === 'checked_in' || appointment.status === 'in_progress') && (
                <Link
                  href={`/provider/chart/new?client=${appointment.client.id}&appointment=${appointment.id}`}
                  className="block w-full px-4 py-2.5 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors text-center"
                >
                  📝 Start Chart
                </Link>
              )}
              {appointment.status === 'completed' && (
                <Link
                  href={`/admin/payments/new?appointment=${appointment.id}`}
                  className="block w-full px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  💳 Process Payment
                </Link>
              )}
              <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                ✏️ Edit Appointment
              </button>
              <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                📅 Reschedule
              </button>
              {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                >
                  ✗ Cancel Appointment
                </button>
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
                  disabled={appointment.status === status.value}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    appointment.status === status.value
                      ? `${status.color} font-medium`
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
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
              <a
                href={`mailto:${appointment.client.email}`}
                className="flex items-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span>✉️</span>
                <span className="text-gray-700">Email</span>
              </a>
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
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
