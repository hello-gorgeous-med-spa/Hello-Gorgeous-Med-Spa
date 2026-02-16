'use client';

// ============================================================
// APPOINTMENT DETAIL PAGE
// View and manage individual appointment - Connected to Live Data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
}

const STATUSES = [
  { value: 'confirmed', label: 'Confirmed', color: 'bg-white text-black' },
  { value: 'checked_in', label: 'Checked In', color: 'bg-blue-100 text-blue-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-pink-100 text-pink-700' },
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
  
  // Consent verification state
  const [consentStatus, setConsentStatus] = useState<{
    hasAllRequired: boolean;
    missingConsents: string[];
    consentDetails: { type: string; name: string; signed: boolean; signedAt: string | null }[];
  } | null>(null);
  const [sendingConsent, setSendingConsent] = useState(false);

  // Fetch appointment from API - using specific endpoint
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Try specific appointment endpoint first
        let apt = null;
        
        try {
          const specificRes = await fetch(`/api/appointments/${params.id}`);
          if (specificRes.ok) {
            const specificData = await specificRes.json();
            apt = specificData.appointment || specificData;
          }
        } catch {
          // Fall back to list endpoint
        }
        
        // Fallback: fetch from list if specific endpoint fails
        if (!apt) {
          const res = await fetch('/api/appointments?limit=500');
          const data = await res.json();
          apt = data.appointments?.find((a: any) => a.id === params.id);
        }
        
        if (apt) {
          // Transform to expected format
          setAppointment({
            ...apt,
            scheduled_at: apt.starts_at,
            client: apt.client || {
              id: apt.client_id,
              first_name: apt.client_name?.split(' ')[0] || apt.client?.first_name || '',
              last_name: apt.client_name?.split(' ').slice(1).join(' ') || apt.client?.last_name || '',
              email: apt.client_email || apt.client?.email,
              phone: apt.client_phone || apt.client?.phone,
            },
            service: apt.service || {
              id: apt.service_id,
              name: apt.service_name,
              duration_minutes: apt.duration_minutes || apt.duration,
              price: apt.service_price,
            },
            provider: apt.provider || {
              id: apt.provider_id,
              first_name: apt.provider_name?.split(' ')[0] || apt.provider?.first_name || '',
              last_name: apt.provider_name?.split(' ').slice(1).join(' ') || apt.provider?.last_name || '',
            },
          });
          
          // Fetch consent status for this client
          const clientId = apt.client_id || apt.client?.id;
          if (clientId) {
            fetch(`/api/consents/verify?clientId=${clientId}`)
              .then(res => res.json())
              .then(data => {
                if (!data.error) {
                  setConsentStatus(data);
                }
              })
              .catch(err => console.error('Error fetching consent status:', err));
          }
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [params.id]);

  // Send consent forms to client
  const sendConsentForms = async () => {
    if (!appointment?.client?.id) return;
    
    setSendingConsent(true);
    try {
      const res = await fetch('/api/consents/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: appointment.client.id,
          formTypes: ['hipaa', 'treatment_consent', 'financial_policy'],
          appointmentId: params.id,
          sendVia: 'sms',
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Consent forms sent to ${appointment.client.phone || appointment.client.email}!`);
      } else {
        alert('Failed to send consent forms: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error sending consent:', err);
      alert('Failed to send consent forms');
    } finally {
      setSendingConsent(false);
    }
  };

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
        <p className="text-black mb-4">Appointment not found</p>
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
          className="text-sm text-black hover:text-black mb-2 inline-block"
        >
          ← Back to Appointments
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Appointment Details</h1>
            <p className="text-black">{date} at {time}</p>
          </div>
          <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${currentStatus?.color || 'bg-white'}`}>
            {currentStatus?.label || appointment.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Card */}
          <div className="bg-white rounded-xl border border-black shadow-sm p-6">
            <div className="flex items-start gap-6 flex-wrap">
              {/* Client */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-black mb-2">Client</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {clientName.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <Link
                      href={`/admin/clients/${appointment.client?.id}`}
                      className="font-semibold text-black hover:text-pink-600"
                    >
                      {clientName}
                    </Link>
                    {appointment.client?.is_vip && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded-full">
                        💎 VIP
                      </span>
                    )}
                    <p className="text-sm text-black">{appointment.client?.phone || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-black mb-2">Service</h3>
                <p className="font-semibold text-black">{appointment.service?.name || 'Service'}</p>
                <p className="text-sm text-black">
                  {appointment.service?.duration_minutes || appointment.duration_minutes || 30} min • ${appointment.service?.price || 0}
                </p>
              </div>

              {/* Provider */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-sm font-medium text-black mb-2">Provider</h3>
                <p className="font-semibold text-black">{providerName}</p>
                {appointment.provider?.title && (
                  <p className="text-sm text-black">{appointment.provider.title}</p>
                )}
              </div>
            </div>

            {/* How booked */}
            {(appointment.booking_source || appointment.source) && (
              <div className="mt-4 pt-4 border-t border-black">
                <p className="text-sm text-black">
                  Booked via: <span className="font-medium text-black">
                    {(appointment.booking_source || appointment.source) === 'online_booking' ? 'Online booking' : (appointment.booking_source || appointment.source) === 'admin_calendar' ? 'Calendar / POS' : String(appointment.booking_source || appointment.source)}
                  </span>
                </p>
              </div>
            )}

            {/* Notes */}
            {appointment.notes && (
              <div className="mt-6 pt-6 border-t border-black">
                <h3 className="text-sm font-medium text-black mb-2">Notes</h3>
                <p className="text-black">{appointment.notes}</p>
              </div>
            )}
          </div>

          {/* Status Checklist */}
          <div className="bg-white rounded-xl border border-black shadow-sm p-6">
            <h3 className="font-semibold text-black mb-4">Appointment Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-black">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-black">Appointment booked</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-black">
                <div className="flex items-center gap-2">
                  <span className={appointment.status !== 'confirmed' ? 'text-green-500' : 'text-black'}>
                    {appointment.status !== 'confirmed' ? '✓' : '○'}
                  </span>
                  <span className="text-black">Client checked in</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className={appointment.status === 'completed' ? 'text-green-500' : 'text-black'}>
                    {appointment.status === 'completed' ? '✓' : '○'}
                  </span>
                  <span className="text-black">Appointment completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Consent Status Card */}
          <div className={`rounded-xl border shadow-sm p-6 ${
            consentStatus?.hasAllRequired 
              ? 'bg-green-50 border-green-200' 
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">Consent Forms</h3>
              {consentStatus?.hasAllRequired ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                  ✓ Complete
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
                  ⚠️ Missing
                </span>
              )}
            </div>
            
            {consentStatus ? (
              <div className="space-y-2">
                {consentStatus.consentDetails?.map((consent) => (
                  <div key={consent.type} className="flex items-center justify-between py-1">
                    <span className="text-sm text-black">{consent.name}</span>
                    {consent.signed ? (
                      <span className="text-xs text-green-600">
                        ✓ {new Date(consent.signedAt!).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600">Not signed</span>
                    )}
                  </div>
                ))}
                
                {!consentStatus.hasAllRequired && (
                  <button
                    onClick={sendConsentForms}
                    disabled={sendingConsent}
                    className="w-full mt-3 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    {sendingConsent ? 'Sending...' : '📱 Send Consent Forms'}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-sm text-black">Loading consent status...</p>
            )}

            {!consentStatus?.hasAllRequired && (
              <p className="text-xs text-amber-700 mt-3">
                ⚠️ Treatment cannot proceed without signed consents
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-black shadow-sm p-5">
            <h3 className="font-semibold text-black mb-4">Actions</h3>
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
                  className="block w-full px-4 py-2.5 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors text-center"
                >
                  ✏️ Edit Appointment
                </Link>
                <Link
                  href={`/admin/appointments/${appointment.id}/reschedule`}
                  className="block w-full px-4 py-2.5 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors text-center"
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
          <div className="bg-white rounded-xl border border-black shadow-sm p-5">
            <h3 className="font-semibold text-black mb-4">Change Status</h3>
            <div className="space-y-2">
              {STATUSES.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={appointment.status === status.value || saving}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    appointment.status === status.value
                      ? `${status.color} font-medium`
                      : 'hover:bg-white text-black'
                  } disabled:cursor-not-allowed`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Client */}
          <div className="bg-white rounded-xl border border-black shadow-sm p-5">
            <h3 className="font-semibold text-black mb-4">Contact Client</h3>
            <div className="space-y-2">
              {appointment.client?.phone && (
                <>
                  <a
                    href={`tel:${appointment.client.phone}`}
                    className="flex items-center gap-3 px-4 py-2.5 border border-black rounded-lg hover:bg-white transition-colors"
                  >
                    <span>📞</span>
                    <span className="text-black">Call</span>
                  </a>
                  <a
                    href={`sms:${appointment.client.phone}`}
                    className="flex items-center gap-3 px-4 py-2.5 border border-black rounded-lg hover:bg-white transition-colors"
                  >
                    <span>💬</span>
                    <span className="text-black">Text</span>
                  </a>
                </>
              )}
              {appointment.client?.email && (
                <a
                  href={`mailto:${appointment.client.email}`}
                  className="flex items-center gap-3 px-4 py-2.5 border border-black rounded-lg hover:bg-white transition-colors"
                >
                  <span>✉️</span>
                  <span className="text-black">Email</span>
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
            <h2 className="text-xl font-bold text-black mb-4">Cancel Appointment</h2>
            <p className="text-black mb-4">
              Are you sure you want to cancel this appointment? The client will be notified.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-1">
                Cancellation Reason
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
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
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg transition-colors"
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
