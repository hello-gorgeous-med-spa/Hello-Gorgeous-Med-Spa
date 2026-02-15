'use client';

// ============================================================
// CLIENT PORTAL - MY APPOINTMENTS
// View and manage upcoming appointments - Connected to Live Data
// ============================================================

import { useState, useEffect, useMemo } from 'react';
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
  isTelehealth?: boolean;
  telehealthLink?: string;
}

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function PortalAppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Data states
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [pastAppointments, setPastAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lookup states (for guests to find their appointments)
  const [showLookup, setShowLookup] = useState(false);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Fetch client's appointments from API
  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        
        // Get client ID/email from session or portal email (wellness signup)
        const clientId = typeof window !== 'undefined' ? sessionStorage.getItem('client_id') : null;
        const clientEmail = typeof window !== 'undefined' ? (sessionStorage.getItem('client_email') || localStorage.getItem('hg_portal_email')) : null;
        
        if (!clientId && !clientEmail) {
          // No client session - show empty state
          setUpcomingAppointments([]);
          setPastAppointments([]);
          setLoading(false);
          return;
        }

        // Fetch appointments for this client
        const params = new URLSearchParams();
        if (clientId) params.set('client_id', clientId);
        else if (clientEmail) params.set('email', clientEmail);
        
        const response = await fetch(`/api/appointments?${params.toString()}`);
        const data = await response.json();
        
        if (data.appointments) {
          const now = new Date();
          
          // Transform and split into upcoming/past
          const upcoming: Appointment[] = [];
          const past: Appointment[] = [];
          
          for (const apt of data.appointments) {
            const aptDate = new Date(apt.starts_at);
            const isTelehealth = (apt.type || '').toLowerCase().includes('telehealth') || (apt.type || '').toLowerCase().includes('video');
            const formatted: Appointment = {
              id: apt.id,
              service: apt.service_name || apt.service?.name || 'Service',
              provider: apt.provider_name || 'Provider',
              date: apt.starts_at.split('T')[0],
              time: aptDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              datetime: aptDate,
              status: apt.status,
              location: isTelehealth ? 'Video visit' : '74 W. Washington St, Oswego, IL',
              price: apt.service_price || (apt.service?.price_cents ? apt.service.price_cents / 100 : 0),
              isTelehealth,
              telehealthLink: apt.telehealth_link || apt.telehealth_url,
            };
            
            if (apt.status === 'cancelled' || apt.status === 'completed' || apt.status === 'no_show' || aptDate < now) {
              past.push(formatted);
            } else {
              upcoming.push(formatted);
            }
          }
          
          // Sort: upcoming by date ascending, past by date descending
          upcoming.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
          past.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
          
          setUpcomingAppointments(upcoming);
          setPastAppointments(past);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAppointments();
  }, []);


  // Calculate cancellation/reschedule status for each appointment
  const appointmentsWithStatus = useMemo(() => {
    return upcomingAppointments.map(apt => ({
      ...apt,
      cancelStatus: canCancelAppointment(apt.datetime, DEFAULT_CANCELLATION_POLICY),
      rescheduleStatus: canRescheduleAppointment(apt.datetime, DEFAULT_CANCELLATION_POLICY),
    }));
  }, [upcomingAppointments]);

  const handleCancelClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setShowRescheduleModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;
    setIsProcessing(true);

    try {
      // Cancel via API
      const res = await fetch(`/api/appointments/${selectedAppointment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', cancellation_reason: cancelReason }),
      });

      if (res.ok) {
        // Remove from list
        setUpcomingAppointments(prev => prev.filter(a => a.id !== selectedAppointment.id));
        setShowCancelModal(false);
        setSelectedAppointment(null);
        setCancelReason('');
      } else {
        console.error('Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Lookup appointments by email/phone
  const handleLookup = async () => {
    if (!lookupEmail && !lookupPhone) {
      setLookupError('Please enter your email or phone number');
      return;
    }
    
    setLookupLoading(true);
    setLookupError('');
    
    try {
      // First lookup client by email/phone
      const searchParam = lookupEmail || lookupPhone;
      const clientRes = await fetch(`/api/clients?search=${encodeURIComponent(searchParam)}`);
      const clientData = await clientRes.json();
      
      if (clientData.clients && clientData.clients.length > 0) {
        const client = clientData.clients[0];
        
        // Store in session for future use
        sessionStorage.setItem('client_id', client.id);
        sessionStorage.setItem('client_email', client.email || '');
        
        // Fetch their appointments
        const aptRes = await fetch(`/api/appointments?client_id=${client.id}`);
        const aptData = await aptRes.json();
        
        if (aptData.appointments) {
          const now = new Date();
          const upcoming: Appointment[] = [];
          const past: Appointment[] = [];
          
          for (const apt of aptData.appointments) {
            const aptDate = new Date(apt.starts_at);
            const isTelehealth = (apt.type || '').toLowerCase().includes('telehealth') || (apt.type || '').toLowerCase().includes('video');
            const formatted: Appointment = {
              id: apt.id,
              service: apt.service_name || apt.service?.name || 'Service',
              provider: apt.provider_name || 'Provider',
              date: apt.starts_at.split('T')[0],
              time: aptDate.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              }),
              datetime: aptDate,
              status: apt.status,
              location: isTelehealth ? 'Video visit' : '74 W. Washington St, Oswego, IL',
              price: apt.service_price || 0,
              isTelehealth,
              telehealthLink: apt.telehealth_link || apt.telehealth_url,
            };
            
            if (apt.status === 'cancelled' || apt.status === 'completed' || apt.status === 'no_show' || aptDate < now) {
              past.push(formatted);
            } else {
              upcoming.push(formatted);
            }
          }
          
          upcoming.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
          past.sort((a, b) => b.datetime.getTime() - a.datetime.getTime());
          
          setUpcomingAppointments(upcoming);
          setPastAppointments(past);
          setShowLookup(false);
        }
      } else {
        setLookupError('No appointments found for this email/phone. Try booking a new appointment!');
      }
    } catch (error) {
      setLookupError('Error looking up appointments. Please try again.');
    } finally {
      setLookupLoading(false);
    }
  };

  // Check if we have any appointments loaded
  const hasAppointments = upcomingAppointments.length > 0 || pastAppointments.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-500">View and manage your upcoming treatments</p>
      </div>

      {/* Appointment Lookup (shown when no appointments loaded) */}
      {!loading && !hasAppointments && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Find Your Appointments</h3>
          <p className="text-gray-600 text-sm mb-4">
            Enter your email or phone number to view and manage your appointments.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <div className="text-center text-gray-400 text-sm">or</div>
            <input
              type="tel"
              placeholder="Phone number"
              value={lookupPhone}
              onChange={(e) => setLookupPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            {lookupError && (
              <p className="text-red-600 text-sm">{lookupError}</p>
            )}
            <button
              onClick={handleLookup}
              disabled={lookupLoading}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 disabled:opacity-50"
            >
              {lookupLoading ? 'Looking up...' : 'Find My Appointments'}
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">Don't have an appointment yet?</p>
            <Link
              href="/book"
              className="text-pink-600 font-medium hover:text-pink-700"
            >
              Book Now →
            </Link>
          </div>
        </div>
      )}

      {/* Policy Notice */}
      {hasAppointments && (
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
          <h3 className="font-semibold text-pink-900 mb-2">📋 Cancellation Policy</h3>
          <p className="text-sm text-pink-800">{formatCancellationPolicyForClient(DEFAULT_CANCELLATION_POLICY)}</p>
        </div>
      )}

      {/* Tabs - only show when appointments exist */}
      {hasAppointments && (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'past'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Past ({pastAppointments.length})
          </button>
        </div>
      )}

      {/* Upcoming Appointments */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-40" />
            ))
          ) : appointmentsWithStatus.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <span className="text-4xl mb-4 block">📅</span>
              <h3 className="font-semibold text-gray-900 mb-2">No upcoming appointments</h3>
              <p className="text-gray-500 mb-4">Ready for your next treatment?</p>
              <Link
                href="/portal/book"
                className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-600 transition-colors"
              >
                Book Now
              </Link>
            </div>
          ) : (
            appointmentsWithStatus.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{apt.service}</h3>
                      <p className="text-gray-500">{apt.provider}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📅</span>
                      <span className="text-gray-900">{formatDate(apt.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">🕐</span>
                      <span className="text-gray-900">{apt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">📍</span>
                      <span className="text-gray-900">{apt.location}</span>
                      {apt.isTelehealth && (
                        <a
                          href={apt.telehealthLink || '/telehealth'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200"
                        >
                          Join Video →
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">💰</span>
                      <span className="text-gray-900">${apt.price}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex gap-3">
                  <button
                    onClick={() => handleRescheduleClick(apt)}
                    disabled={!apt.rescheduleStatus.allowed}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      apt.rescheduleStatus.allowed
                        ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleCancelClick(apt)}
                    disabled={!apt.cancelStatus.allowed}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      apt.cancelStatus.allowed
                        ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Cancel
                  </button>
                  {(!apt.cancelStatus.allowed || !apt.rescheduleStatus.allowed) && (
                    <span className="text-xs text-gray-500 self-center ml-auto">
                      {apt.cancelStatus.reason || apt.rescheduleStatus.reason}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Past Appointments */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20" />
            ))
          ) : pastAppointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No past appointments</p>
            </div>
          ) : (
            pastAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{apt.service}</h3>
                  <p className="text-sm text-gray-500">{apt.provider} • {formatDate(apt.date)}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                  apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {apt.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cancel Appointment</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel your <strong>{selectedAppointment.service}</strong> appointment on{' '}
              <strong>{formatDate(selectedAppointment.date)}</strong>?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
              >
                <option value="">Select reason...</option>
                <option value="schedule_conflict">Schedule conflict</option>
                <option value="illness">Illness</option>
                <option value="emergency">Emergency</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCancelModal(false); setSelectedAppointment(null); }}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reschedule Appointment</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-medium">{selectedAppointment.service}</p>
              <p className="text-sm text-gray-500">{formatDate(selectedAppointment.date)} at {selectedAppointment.time}</p>
            </div>

            <div className="space-y-3 mb-4">
              <p className="text-gray-600 text-sm">
                Choose how you'd like to reschedule:
              </p>
              
              <Link
                href="/book"
                className="block w-full px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 text-center font-medium"
              >
                Book New Time Online
              </Link>
              
              <a
                href="tel:6306366193"
                className="block w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
              >
                📞 Call (630) 636-6193
              </a>
              
              <a
                href="sms:6306366193?body=Hi, I'd like to reschedule my appointment"
                className="block w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-center"
              >
                💬 Text Us
              </a>
            </div>

            <p className="text-xs text-gray-500 text-center mb-4">
              After booking your new time, you can cancel this appointment.
            </p>

            <button
              onClick={() => { setShowRescheduleModal(false); setSelectedAppointment(null); }}
              className="w-full px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Book CTA */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center">
        <h3 className="text-xl font-bold mb-2">Need Another Appointment?</h3>
        <p className="text-pink-100 mb-4">Book online 24/7</p>
        <Link
          href="/portal/book"
          className="inline-block bg-white text-pink-600 px-6 py-2.5 rounded-full font-semibold hover:bg-pink-50 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
