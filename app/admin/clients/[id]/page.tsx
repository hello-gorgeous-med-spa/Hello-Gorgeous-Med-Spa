'use client';

// ============================================================
// ADMIN CLIENT DETAIL PAGE
// Full client profile with history and actions
// Connected to Live API Data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export default function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'payments' | 'clinical' | 'documents'>('overview');
  
  // State for API data
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Additional data states
  const [appointments, setAppointments] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address_line1: '',
    city: '',
    state: '',
    postal_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    allergies_summary: '',
    internal_notes: '',
  });

  // Fetch client from API by ID (direct lookup)
  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clients?id=${params.id}`);
      const data = await res.json();
      
      if (data.client) {
        setClient(data.client);
      } else {
        setError(data.error || 'Client not found');
      }
    } catch (err) {
      setError('Failed to load client');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  // Fetch appointments for this client
  const fetchClientAppointments = useCallback(async () => {
    try {
      const res = await fetch(`/api/appointments?client_id=${params.id}`);
      const data = await res.json();
      if (data.appointments) {
        setAppointments(data.appointments);
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    if (params.id) {
      fetchClientAppointments();
      setLoadingExtra(false);
    }
  }, [params.id, fetchClientAppointments]);

  // Calculate age
  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (isoString: string | null) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="w-48 h-6 mb-2" />
            <Skeleton className="w-64 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          {error || 'Client not found'}
        </p>
        <Link href="/admin/clients" className="text-pink-600 hover:text-pink-700">
          ← Back to Clients
        </Link>
      </div>
    );
  }

  const age = calculateAge(client.date_of_birth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/clients"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← Back to Clients
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {client.first_name?.[0]}{client.last_name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {client.first_name} {client.last_name}
                </h1>
                {client.is_vip && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    💎 VIP Member
                  </span>
                )}
              </div>
              <p className="text-gray-500">
                {age ? `${age} years old • ` : ''}
                Client since {formatDate(client.created_at)} • {client.total_visits || 0} visits
              </p>
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/appointments/new?client=${client.id}`}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            Book Appointment
          </Link>
          <button 
            onClick={() => {
              setEditForm({
                first_name: client.first_name || '',
                last_name: client.last_name || '',
                email: client.email || '',
                phone: client.phone || '',
                date_of_birth: client.date_of_birth || '',
                address_line1: client.address_line1 || '',
                city: client.city || '',
                state: client.state || '',
                postal_code: client.postal_code || '',
                emergency_contact_name: client.emergency_contact_name || '',
                emergency_contact_phone: client.emergency_contact_phone || '',
                allergies_summary: client.allergies_summary || '',
                internal_notes: client.internal_notes || '',
              });
              setShowEditModal(true);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          {client.phone && (
            <a href={`tel:${client.phone}`} className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              📞
            </a>
          )}
          {client.email && (
            <a href={`mailto:${client.email}`} className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              ✉️
            </a>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {client.allergies_summary && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold">Allergies:</span>
            <span>{client.allergies_summary}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Visits</p>
          <p className="text-2xl font-bold text-gray-900">{client.total_visits || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">${(client.total_spent || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Avg Ticket</p>
          <p className="text-2xl font-bold text-gray-900">
            ${client.total_visits ? Math.round((client.total_spent || 0) / client.total_visits) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Last Visit</p>
          <p className="text-2xl font-bold text-gray-900">{formatDate(client.last_visit_at)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: `Appointments (${appointments.length})` },
            { id: 'payments', label: `Payments (${payments.length})` },
            { id: 'clinical', label: 'Clinical' },
            { id: 'documents', label: `Documents (${consents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900">{client.email || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="text-gray-900">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="text-gray-900">
                  {client.address_line1 ? (
                    <>
                      {client.address_line1}
                      {client.address_line2 && <><br />{client.address_line2}</>}
                      <br />
                      {client.city}, {client.state} {client.postal_code}
                    </>
                  ) : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="text-gray-900">
                  {client.date_of_birth ? `${formatDate(client.date_of_birth)} (${age} years old)` : '-'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Emergency Contact</p>
                <p className="text-gray-900">{client.emergency_contact_name || '-'}</p>
                {client.emergency_contact_phone && (
                  <p className="text-gray-500">{client.emergency_contact_phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Recent Appointments</h3>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                View All →
              </button>
            </div>
            {loadingExtra ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-gray-500 text-sm py-4">No appointments yet</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{apt.service_name || 'Service'}</p>
                      <p className="text-sm text-gray-900">${apt.service_price || 0}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(apt.starts_at)} • {apt.provider_name || 'Provider'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consents & Notes */}
          <div className="space-y-6">
            {/* Consents */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Consents</h3>
              {loadingExtra ? (
                <div className="space-y-2">
                  {[1, 2].map(i => <Skeleton key={i} className="h-10" />)}
                </div>
              ) : consents.length === 0 ? (
                <p className="text-gray-500 text-sm">No consents on file</p>
              ) : (
                <div className="space-y-2">
                  {consents.slice(0, 4).map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between py-2">
                      <p className="text-sm text-gray-900">{consent.consent_form?.name || 'Consent'}</p>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        ✓ Valid
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Notes */}
            {client.internal_notes && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Internal Notes</h3>
                <p className="text-sm text-gray-600">{client.internal_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingExtra ? (
            <div className="p-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No appointments found
              <br />
              <Link href={`/admin/appointments/new?client=${client.id}`} className="text-pink-600 mt-2 inline-block">
                + Book first appointment
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Service</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Provider</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{formatDate(apt.starts_at)}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-900">{apt.service_name || '-'}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {apt.provider_name || 'Provider'}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900">
                      ${apt.service_price || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loadingExtra ? (
            <div className="p-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No payments found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Method</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-900">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{formatDate(payment.created_at)}</td>
                    <td className="px-5 py-3 text-gray-600">{payment.payment_method || 'Card'}</td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        {payment.status || 'completed'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-green-600">
                      +${(payment.total_amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'clinical' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medical Summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Medical Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Allergies</p>
                {client.allergies_summary ? (
                  <p className="text-sm text-red-700 bg-red-50 px-2 py-1 rounded inline-block">
                    {client.allergies_summary}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400">None on file</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Medications</p>
                {client.medications_summary ? (
                  <p className="text-sm text-gray-900">{client.medications_summary}</p>
                ) : (
                  <p className="text-sm text-gray-400">None on file</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Medical Conditions</p>
                {client.medical_conditions_summary ? (
                  <p className="text-sm text-gray-900">{client.medical_conditions_summary}</p>
                ) : (
                  <p className="text-sm text-gray-400">None on file</p>
                )}
              </div>
            </div>
          </div>

          {/* Chart History */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Chart History</h3>
              <Link
                href={`/admin/charts?client=${client.id}`}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                + New Chart
              </Link>
            </div>
            <div className="space-y-3">
              {appointments.filter((a) => a.status === 'completed').slice(0, 4).map((apt) => (
                <Link
                  key={apt.id}
                  href={`/admin/charts/${apt.id}`}
                  className="block border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{apt.service_name || 'Service'}</p>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      ✓ Signed
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(apt.starts_at)} • {apt.provider_name || 'Provider'}
                  </p>
                </Link>
              ))}
              {appointments.filter((a) => a.status === 'completed').length === 0 && (
                <p className="text-gray-500 text-sm">No completed appointments yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Documents & Forms</h3>
            <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors">
              + Upload Document
            </button>
          </div>
          
          {loadingExtra ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : consents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No documents on file</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {consents.map((consent) => (
                <div key={consent.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{consent.consent_form?.name || 'Document'}</p>
                      <p className="text-xs text-gray-500">Signed {formatDate(consent.signed_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Edit Client</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address_line1}
                  onChange={(e) => setEditForm({...editForm, address_line1: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                  <input
                    type="text"
                    value={editForm.postal_code}
                    onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editForm.emergency_contact_name}
                    onChange={(e) => setEditForm({...editForm, emergency_contact_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editForm.emergency_contact_phone}
                    onChange={(e) => setEditForm({...editForm, emergency_contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              {/* Medical */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <input
                  type="text"
                  value={editForm.allergies_summary}
                  onChange={(e) => setEditForm({...editForm, allergies_summary: e.target.value})}
                  placeholder="e.g., Penicillin, latex"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={editForm.internal_notes}
                  onChange={(e) => setEditForm({...editForm, internal_notes: e.target.value})}
                  rows={3}
                  placeholder="Notes only visible to staff..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setEditSaving(true);
                  try {
                    const res = await fetch(`/api/clients/${params.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editForm),
                    });
                    if (res.ok) {
                      // Update local state
                      setClient({ ...client, ...editForm });
                      setShowEditModal(false);
                      alert('Client updated successfully!');
                    } else {
                      const data = await res.json();
                      alert('Error: ' + (data.error || 'Failed to update'));
                    }
                  } catch (err) {
                    alert('Failed to save changes');
                  } finally {
                    setEditSaving(false);
                  }
                }}
                disabled={editSaving}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
