'use client';

// ============================================================
// PATIENT LOOKUP - Quick Search & Patient Details
// Essential for pre-treatment verification
// ============================================================

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  allergies?: string[];
  medical_history?: string;
  last_visit?: string;
  total_visits?: number;
  total_spent?: number;
  membership_status?: string;
  consent_status?: {
    hipaa: boolean;
    treatment: boolean;
    photo: boolean;
  };
  notes?: string;
}

interface Visit {
  id: string;
  date: string;
  service: string;
  provider: string;
  amount: number;
  notes?: string;
}

function PatientLookupContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [visitHistory, setVisitHistory] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'consents' | 'photos' | 'payments' | 'documents' | 'membership' | 'notes'>('overview');
  const [photos, setPhotos] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [membership, setMembership] = useState<any>(null);

  // Search patients
  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (data.clients) {
        setSearchResults(data.clients.map((c: any) => ({
          id: c.id,
          first_name: c.first_name || '',
          last_name: c.last_name || '',
          email: c.email,
          phone: c.phone,
          date_of_birth: c.date_of_birth,
          allergies: c.allergies || [],
          total_visits: c.visit_count || 0,
          total_spent: c.total_spent || 0,
          membership_status: c.membership_status,
          last_visit: c.last_visit,
        })));
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    } finally {
      setSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Load patient details
  const loadPatientDetails = async (patientId: string) => {
    try {
      const res = await fetch(`/api/clients/${patientId}`);
      const data = await res.json();
      
      if (data.client) {
        setSelectedPatient({
          ...data.client,
          first_name: data.client.first_name || '',
          last_name: data.client.last_name || '',
        });
      }

      // Load visit history
      const historyRes = await fetch(`/api/appointments?client_id=${patientId}&limit=20`);
      const historyData = await historyRes.json();
      
      if (historyData.appointments) {
        setVisitHistory(historyData.appointments.map((a: any) => ({
          id: a.id,
          date: a.starts_at,
          service: a.service_name || 'Service',
          provider: a.provider_name || 'Provider',
          amount: a.service_price || 0,
          notes: a.notes,
        })));
      }

      // Load photos
      try {
        const photosRes = await fetch(`/api/photos?clientId=${patientId}`);
        const photosData = await photosRes.json();
        setPhotos(photosData.photos || []);
      } catch (e) {
        setPhotos([]);
      }

      // Load payments/transactions
      try {
        const paymentsRes = await fetch(`/api/transactions?clientId=${patientId}`);
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData.transactions || []);
      } catch (e) {
        setPayments([]);
      }

      // Load membership info
      try {
        const membershipRes = await fetch(`/api/memberships?clientId=${patientId}`);
        const membershipData = await membershipRes.json();
        setMembership(membershipData.membership || null);
      } catch (e) {
        setMembership(null);
      }

    } catch (error) {
      console.error('Error loading patient:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Lookup</h1>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            autoFocus
          />
          {searching && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </span>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && !selectedPatient && (
          <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
            {searchResults.map((patient) => (
              <button
                key={patient.id}
                onClick={() => {
                  setSelectedPatient(patient);
                  loadPatientDetails(patient.id);
                  setSearchResults([]);
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {patient.first_name?.[0]}{patient.last_name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.phone || patient.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{patient.total_visits} visits</p>
                  {patient.last_visit && (
                    <p className="text-xs text-gray-400">Last: {formatDate(patient.last_visit)}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Patient Details */}
      {selectedPatient && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Patient Info */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                <button
                  onClick={() => {
                    setSelectedPatient(null);
                    setSearchQuery('');
                  }}
                  className="text-white/80 hover:text-white text-sm mb-3"
                >
                  ← Back to Search
                </button>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {selectedPatient.first_name?.[0]}{selectedPatient.last_name?.[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                    {selectedPatient.date_of_birth && (
                      <p className="text-white/80">
                        {calculateAge(selectedPatient.date_of_birth)} years old
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-5 space-y-4">
                {selectedPatient.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">📱</span>
                    <a href={`tel:${selectedPatient.phone}`} className="text-gray-900 hover:text-pink-600">
                      {selectedPatient.phone}
                    </a>
                  </div>
                )}
                {selectedPatient.email && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">✉️</span>
                    <a href={`mailto:${selectedPatient.email}`} className="text-gray-900 hover:text-pink-600">
                      {selectedPatient.email}
                    </a>
                  </div>
                )}
                {selectedPatient.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">🎂</span>
                    <span className="text-gray-900">{formatDate(selectedPatient.date_of_birth)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Allergies Alert */}
            {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">⚠️</span>
                  <h3 className="font-bold text-red-800">Allergies</h3>
                </div>
                <ul className="space-y-1">
                  {selectedPatient.allergies.map((allergy, idx) => (
                    <li key={idx} className="text-red-700 font-medium">• {allergy}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Patient Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedPatient.total_visits || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(selectedPatient.total_spent || 0).toLocaleString()}
                  </p>
                </div>
                {selectedPatient.membership_status && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Membership</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {selectedPatient.membership_status}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/provider/charting?client=${selectedPatient.id}`}
                  className="block w-full px-4 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 text-center"
                >
                  📝 New Chart Note
                </Link>
                <Link
                  href={`/admin/appointments/new?client=${selectedPatient.id}`}
                  className="block w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 text-center"
                >
                  📅 Book Appointment
                </Link>
                <Link
                  href={`/admin/clients/${selectedPatient.id}/photos`}
                  className="block w-full px-4 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 text-center"
                >
                  📷 View Photos
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: '📋' },
                { id: 'history', label: 'Visits', icon: '📅' },
                { id: 'consents', label: 'Consents', icon: '✍️' },
                { id: 'photos', label: 'Photos', icon: '📷' },
                { id: 'payments', label: 'Payments', icon: '💳' },
                { id: 'membership', label: 'Membership', icon: '⭐' },
                { id: 'documents', label: 'Documents', icon: '📁' },
                { id: 'notes', label: 'Notes', icon: '📝' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Consent Status */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Consent Status</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className={`p-3 rounded-lg border ${
                        selectedPatient.consent_status?.hipaa 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <p className="text-sm font-medium">HIPAA</p>
                        <p className={`text-xs ${
                          selectedPatient.consent_status?.hipaa ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedPatient.consent_status?.hipaa ? '✓ Complete' : '✗ Required'}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        selectedPatient.consent_status?.treatment 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-amber-50 border-amber-200'
                      }`}>
                        <p className="text-sm font-medium">Treatment</p>
                        <p className={`text-xs ${
                          selectedPatient.consent_status?.treatment ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {selectedPatient.consent_status?.treatment ? '✓ Complete' : '⚠ Pending'}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg border ${
                        selectedPatient.consent_status?.photo 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        <p className="text-sm font-medium">Photo Release</p>
                        <p className={`text-xs ${
                          selectedPatient.consent_status?.photo ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {selectedPatient.consent_status?.photo ? '✓ Complete' : '— Not signed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Visits */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Recent Visits</h3>
                    {visitHistory.length === 0 ? (
                      <p className="text-gray-500 text-sm">No visit history</p>
                    ) : (
                      <div className="space-y-2">
                        {visitHistory.slice(0, 5).map((visit) => (
                          <div key={visit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{visit.service}</p>
                              <p className="text-sm text-gray-500">{formatDate(visit.date)} • {visit.provider}</p>
                            </div>
                            <p className="font-semibold text-green-600">${visit.amount}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Complete Visit History</h3>
                  {visitHistory.length === 0 ? (
                    <p className="text-gray-500">No visit history found</p>
                  ) : (
                    <div className="space-y-3">
                      {visitHistory.map((visit) => (
                        <div key={visit.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{visit.service}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(visit.date)} • {visit.provider}
                              </p>
                              {visit.notes && (
                                <p className="text-sm text-gray-600 mt-2 italic">{visit.notes}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">${visit.amount}</p>
                              <Link
                                href={`/provider/charting?appointment=${visit.id}`}
                                className="text-xs text-pink-600 hover:underline"
                              >
                                View Chart →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Consents Tab */}
              {activeTab === 'consents' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Consent Forms</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">HIPAA Authorization</p>
                          <p className="text-sm text-green-600">Signed on Jan 15, 2024</p>
                        </div>
                        <button className="text-sm text-green-700 hover:underline">View</button>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">General Treatment Consent</p>
                          <p className="text-sm text-green-600">Signed on Jan 15, 2024</p>
                        </div>
                        <button className="text-sm text-green-700 hover:underline">View</button>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Injectable Consent</p>
                          <p className="text-sm text-amber-600">Not signed</p>
                        </div>
                        <button className="px-3 py-1 bg-amber-500 text-white text-sm rounded hover:bg-amber-600">
                          Request
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Before/After Photos</h3>
                    <Link
                      href={`/provider/photos?client=${selectedPatient.id}`}
                      className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600"
                    >
                      + Add Photo
                    </Link>
                  </div>
                  
                  {photos.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-2">📷</span>
                      <p className="text-gray-500 mb-3">No photos on file</p>
                      <Link
                        href={`/provider/photos?client=${selectedPatient.id}`}
                        className="text-pink-600 hover:underline"
                      >
                        Take first photo →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map((photo: any) => (
                        <div key={photo.id} className="relative group rounded-lg overflow-hidden border">
                          <img 
                            src={photo.url || photo.thumbnail_url} 
                            alt={photo.type}
                            className="w-full aspect-square object-cover"
                          />
                          <div className="absolute top-1 left-1">
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                              photo.type === 'before' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                              {photo.type?.toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 opacity-0 group-hover:opacity-100">
                            {photo.treatment_area || 'General'} • {new Date(photo.taken_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
                  
                  {payments.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-2">💳</span>
                      <p className="text-gray-500">No payment records</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {payments.map((payment: any) => (
                        <div key={payment.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">
                                ${(payment.amount_cents / 100).toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDate(payment.created_at)} • {payment.payment_method || 'Card'}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              payment.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                              payment.status === 'refunded' ? 'bg-amber-100 text-amber-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Outstanding Balance */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Outstanding Balance</span>
                      <span className="text-xl font-bold text-gray-900">$0.00</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Membership Tab */}
              {activeTab === 'membership' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Membership & Packages</h3>
                  
                  {membership ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-purple-900">{membership.name}</p>
                            <p className="text-sm text-purple-700">{membership.type}</p>
                          </div>
                          <span className="px-3 py-1 bg-purple-500 text-white text-sm rounded-full font-medium">
                            Active
                          </span>
                        </div>
                        
                        {membership.units_remaining !== undefined && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-purple-700">Units Remaining</span>
                              <span className="font-bold text-purple-900">
                                {membership.units_remaining} / {membership.units_total}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-purple-200 rounded-full">
                              <div 
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${(membership.units_remaining / membership.units_total) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {membership.expires_at && (
                          <p className="text-sm text-purple-600">
                            Expires: {formatDate(membership.expires_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-2">⭐</span>
                      <p className="text-gray-500 mb-3">No active membership</p>
                      <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                        Enroll in Membership
                      </button>
                    </div>
                  )}

                  {/* Loyalty Points */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Loyalty Rewards</h4>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🏆</span>
                        <div>
                          <p className="font-bold text-amber-900">
                            {selectedPatient.loyalty_points || 0} Points
                          </p>
                          <p className="text-sm text-amber-700">
                            ${Math.floor((selectedPatient.loyalty_points || 0) / 100)} in rewards available
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Medical Documents</h3>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                      + Upload
                    </button>
                  </div>
                  
                  {documents.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-4xl block mb-2">📁</span>
                      <p className="text-gray-500">No documents on file</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Labs, clearances, referrals, etc.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {documents.map((doc: any) => (
                        <div key={doc.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {doc.type === 'lab' ? '🧪' : 
                               doc.type === 'clearance' ? '✅' :
                               doc.type === 'referral' ? '📋' : '📄'}
                            </span>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-sm text-gray-500">{formatDate(doc.uploaded_at)}</p>
                            </div>
                          </div>
                          <button className="text-pink-600 hover:text-pink-700 text-sm">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Patient Notes</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-amber-800">
                      ⚠️ Internal notes only - not visible to patient
                    </p>
                  </div>
                  <textarea
                    placeholder="Add notes about this patient..."
                    className="w-full h-40 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                    defaultValue={selectedPatient.notes}
                  />
                  <button className="mt-3 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PatientLookupPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PatientLookupContent />
    </Suspense>
  );
}
