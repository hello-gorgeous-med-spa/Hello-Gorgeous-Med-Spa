'use client';

// ============================================================
// CLIENT PORTAL - MY APPOINTMENTS
// View and manage upcoming appointments with policy enforcement
// ============================================================

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  canCancelAppointment, 
  canRescheduleAppointment,
  formatCancellationPolicyForClient,
  DEFAULT_CANCELLATION_POLICY,
} from '@/lib/hgos/policies';

interface Appointment {
  id: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  datetime: Date;
  status: string;
  location: string;
  price: number;
}

// Mock data - connected to Supabase in production
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    service: 'Botox - Full Face',
    provider: 'Ryan Kent, RN',
    date: '2026-02-05',
    time: '10:00 AM',
    datetime: new Date('2026-02-05T10:00:00'),
    status: 'confirmed',
    location: 'Hello Gorgeous Med Spa',
    price: 450,
  },
  {
    id: '2',
    service: 'Lip Filler Touch-Up',
    provider: 'Ryan Kent, RN',
    date: '2026-02-15',
    time: '2:30 PM',
    datetime: new Date('2026-02-15T14:30:00'),
    status: 'pending',
    location: 'Hello Gorgeous Med Spa',
    price: 650,
  },
];

const PAST_APPOINTMENTS = [
  {
    id: '3',
    service: 'Botox - Forehead',
    provider: 'Ryan Kent, RN',
    date: '2026-01-10',
    time: '11:00 AM',
    status: 'completed',
  },
  {
    id: '4',
    service: 'Initial Consultation',
    provider: 'Danielle Glazier-Alcala',
    date: '2025-12-15',
    time: '9:00 AM',
    status: 'completed',
  },
];

export default function PortalAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate cancellation/reschedule status for each appointment
  const appointmentsWithStatus = useMemo(() => {
    return MOCK_APPOINTMENTS.map(apt => ({
      ...apt,
      cancelStatus: canCancelAppointment(apt.datetime, DEFAULT_CANCELLATION_POLICY),
      rescheduleStatus: canRescheduleAppointment(apt.datetime, DEFAULT_CANCELLATION_POLICY),
    }));
  }, []);

  const handleCancelClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowRescheduleModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    
    setIsProcessing(true);
    
    // TODO: Call API to cancel appointment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsProcessing(false);
    setShowCancelModal(false);
    setSelectedAppointment(null);
    setCancelReason('');
    
    // Show success message
    alert('Your appointment has been cancelled. You will receive a confirmation email shortly.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500">View and manage your bookings</p>
        </div>
        <Link
          href="/book"
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
        >
          + Book New
        </Link>
      </div>

      {/* Cancellation Policy Notice */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-2">📋 Cancellation Policy</h3>
        <p className="text-sm text-gray-600">
          {formatCancellationPolicyForClient(DEFAULT_CANCELLATION_POLICY)}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'upcoming'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Upcoming ({MOCK_APPOINTMENTS.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'past'
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Past ({PAST_APPOINTMENTS.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {activeTab === 'upcoming' ? (
          appointmentsWithStatus.length > 0 ? (
            appointmentsWithStatus.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{apt.service}</h3>
                    <p className="text-gray-500">{apt.provider}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1">
                        <span>📅</span> {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🕐</span> {apt.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">📍 {apt.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      apt.status === 'confirmed' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                    <div className="mt-4 flex gap-2">
                      {apt.rescheduleStatus.allowed ? (
                        <button 
                          onClick={() => handleRescheduleClick(apt)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Reschedule
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 text-sm text-gray-400" title={apt.rescheduleStatus.reason}>
                          Reschedule
                        </span>
                      )}
                      {apt.cancelStatus.allowed ? (
                        <button 
                          onClick={() => handleCancelClick(apt)}
                          className={`px-3 py-1.5 text-sm rounded-lg ${
                            apt.cancelStatus.fee > 0
                              ? 'text-amber-600 hover:bg-amber-50'
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          Cancel {apt.cancelStatus.fee > 0 && `(${apt.cancelStatus.fee}% fee)`}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 text-sm text-gray-400">
                          Cannot Cancel
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-4xl mb-4">📅</p>
              <p className="text-gray-500">No upcoming appointments</p>
              <Link href="/book" className="text-pink-500 hover:underline mt-2 inline-block">
                Book your next visit
              </Link>
            </div>
          )
        ) : (
          PAST_APPOINTMENTS.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-xl border border-gray-100 p-6 opacity-75"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{apt.service}</h3>
                  <p className="text-gray-500 text-sm">{apt.provider}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {apt.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-600">
                    Completed
                  </span>
                  <Link
                    href="/book"
                    className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg"
                  >
                    Book Again
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cancel Appointment</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your {selectedAppointment.service} appointment on{' '}
              {new Date(selectedAppointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}?
            </p>

            {/* Fee Warning */}
            {canCancelAppointment(selectedAppointment.datetime).fee > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800 font-medium">
                  ⚠️ Late Cancellation Fee
                </p>
                <p className="text-sm text-amber-700">
                  Because you are cancelling with less than 24 hours notice, a{' '}
                  {canCancelAppointment(selectedAppointment.datetime).fee}% fee (${Math.round(selectedAppointment.price * canCancelAppointment(selectedAppointment.datetime).fee / 100)}) will be charged.
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              >
                <option value="">Select a reason...</option>
                <option value="schedule_conflict">Schedule conflict</option>
                <option value="feeling_unwell">Feeling unwell</option>
                <option value="emergency">Personal emergency</option>
                <option value="financial">Financial reasons</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppointment(null);
                  setCancelReason('');
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
                disabled={isProcessing}
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason || isProcessing}
                className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reschedule Appointment</h2>
            <p className="text-gray-600 mb-4">
              Choose a new date and time for your {selectedAppointment.service} appointment.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                  <option>9:00 AM</option>
                  <option>10:00 AM</option>
                  <option>11:00 AM</option>
                  <option>1:00 PM</option>
                  <option>2:00 PM</option>
                  <option>3:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Reschedule request submitted! We will confirm your new time shortly.');
                  setShowRescheduleModal(false);
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Request New Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
