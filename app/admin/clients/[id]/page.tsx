'use client';

// ============================================================
// ADMIN CLIENT DETAIL PAGE
// Full client profile with history and actions
// Connected to Live API Data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ClientInbox } from '@/components/clinical/ClientInbox';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// Medications section component
function MedicationsSection({ clientId, clientName }: { clientId: string; clientName: string }) {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    prescriber: '',
    start_date: '',
    notes: '',
  });

  useEffect(() => {
    // Fetch medications from localStorage for now (can be moved to DB later)
    const stored = localStorage.getItem(`medications_${clientId}`);
    if (stored) {
      setMedications(JSON.parse(stored));
    }
    setLoading(false);
  }, [clientId]);

  const saveMedications = (meds: any[]) => {
    localStorage.setItem(`medications_${clientId}`, JSON.stringify(meds));
    setMedications(meds);
  };

  const addMedication = () => {
    if (!newMed.name) return;
    const med = {
      id: `med-${Date.now()}`,
      ...newMed,
      created_at: new Date().toISOString(),
    };
    saveMedications([med, ...medications]);
    setNewMed({ name: '', dosage: '', frequency: '', prescriber: '', start_date: '', notes: '' });
    setShowAddForm(false);
  };

  const removeMedication = (id: string) => {
    saveMedications(medications.filter(m => m.id !== id));
  };

  if (loading) {
    return <Skeleton className="h-32" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Medications</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm text-pink-600 hover:text-pink-700"
          >
            + Add Record
          </button>
          <a
            href="https://accounts.charmtracker.com/signin"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            💊 Prescribe in Charm
          </a>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="Medication name *"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="Dosage (e.g., 10mg)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              placeholder="Frequency (e.g., Once daily)"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.prescriber}
              onChange={(e) => setNewMed({ ...newMed, prescriber: e.target.value })}
              placeholder="Prescriber"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <input
            type="text"
            value={newMed.notes}
            onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={addMedication}
              disabled={!newMed.name}
              className="px-4 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              Add Medication
            </button>
          </div>
        </div>
      )}

      {/* Medications List */}
      {medications.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-3xl mb-2 block">💊</span>
          <p className="text-gray-500 text-sm">No medications on record</p>
          <p className="text-gray-400 text-xs mt-1">Add records here after prescribing in Charm</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{med.name}</p>
                <p className="text-sm text-gray-600">
                  {med.dosage && `${med.dosage} • `}
                  {med.frequency && `${med.frequency} • `}
                  {med.prescriber && `by ${med.prescriber}`}
                </p>
                {med.notes && <p className="text-xs text-gray-500 mt-1">{med.notes}</p>}
              </div>
              <button
                onClick={() => removeMedication(med.id)}
                className="text-red-400 hover:text-red-600 p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Charm Link */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Use <a href="https://accounts.charmtracker.com/signin" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Charm EHR</a> for official prescriptions (EPCS certified)
        </p>
      </div>
    </div>
  );
}

// Chart-to-Cart treatment sessions for this client (persisted; stays in client profile)
function TreatmentSessionsSection({ clientId }: { clientId: string }) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/chart-to-cart/sessions?client_id=${clientId}&limit=20`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to load treatment sessions:', err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (loading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Chart-to-Cart Sessions</h3>
        <Link
          href="/admin/chart-to-cart/new"
          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          + New Session
        </Link>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Treatment sessions created here are saved to this client&apos;s profile.
      </p>
      {sessions.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-3xl mb-2 block">🛒</span>
          <p className="text-gray-500 text-sm">No Chart-to-Cart sessions yet</p>
          <Link
            href="/admin/chart-to-cart/new"
            className="inline-block mt-2 text-pink-600 hover:text-pink-700 text-sm font-medium"
          >
            Start a treatment session →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{s.treatment_summary || 'Treatment'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(s.started_at).toLocaleDateString()} • {s.provider || 'Staff'} •
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                      s.status === 'completed' ? 'bg-gray-200 text-gray-700' :
                      s.status === 'ready_to_checkout' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </p>
                  {Array.isArray(s.products) && s.products.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {s.products.map((p: any) => `${p.name} (${p.quantity})`).join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-gray-900">${Number(s.total || 0).toFixed(2)}</p>
                  <Link
                    href="/admin/chart-to-cart"
                    className="text-xs text-pink-600 hover:text-pink-700"
                  >
                    View in Chart-to-Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Injection Maps Preview component
function InjectionMapsPreview({ clientId }: { clientId: string }) {
  const [maps, setMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMaps() {
      try {
        const res = await fetch(`/api/injection-maps?client_id=${clientId}`);
        const data = await res.json();
        setMaps(data.maps || []);
      } catch (err) {
        console.error('Failed to load injection maps:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaps();
  }, [clientId]);

  if (loading) {
    return <Skeleton className="h-16" />;
  }

  if (maps.length === 0) {
    return (
      <div className="text-center py-4">
        <span className="text-3xl mb-2 block">💉</span>
        <p className="text-gray-500 text-sm">No injection maps yet</p>
        <Link
          href={`/admin/charting/injection-map?client=${clientId}`}
          className="text-pink-600 text-sm hover:text-pink-700 mt-1 inline-block"
        >
          Create first map →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {maps.slice(0, 3).map((map) => (
        <Link
          key={map.id}
          href={`/admin/charting/injection-map?map=${map.id}&client=${clientId}`}
          className="block p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {new Date(map.created_at).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                })}
              </p>
              <p className="text-xs text-gray-500">
                {map.points?.length || 0} injection points
              </p>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </Link>
      ))}
      {maps.length > 3 && (
        <Link
          href={`/admin/charting/injection-map?client=${clientId}`}
          className="block text-center text-sm text-pink-600 hover:text-pink-700 pt-2"
        >
          View all {maps.length} maps →
        </Link>
      )}
    </div>
  );
}

// Client Chart Notes component
function ClientChartNotes({ clientId }: { clientId: string }) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch(`/api/chart-notes?client_id=${clientId}&limit=5`);
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (err) {
        console.error('Failed to load chart notes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, [clientId]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const STATUS_COLORS: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    final: 'bg-green-100 text-green-800',
    locked: 'bg-blue-100 text-blue-800',
    amended: 'bg-purple-100 text-purple-800',
  };

  if (loading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Chart Notes</h3>
        <Link
          href={`/charting?client_id=${clientId}`}
          className="text-sm text-pink-600 hover:text-pink-700"
        >
          View All →
        </Link>
      </div>
      {notes.length === 0 ? (
        <div className="text-center py-4">
          <span className="text-3xl mb-2 block">📋</span>
          <p className="text-gray-500 text-sm">No chart notes yet</p>
          <Link
            href={`/charting?client=${clientId}`}
            className="text-pink-600 text-sm hover:text-pink-700 mt-1 inline-block"
          >
            Create first note →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={note.status === 'draft' ? `/charting/${note.id}/edit` : `/charting?note=${note.id}`}
              className="block border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 text-sm">
                  {note.title || note.service_name || 'Chart Note'}
                </p>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[note.status] || 'bg-gray-100 text-gray-800'}`}>
                  {note.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(note.created_at)} • {note.created_by_name || 'Staff'}
              </p>
              {note.assessment && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{note.assessment}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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
  const [giftCards, setGiftCards] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  
  // Inbox state
  const [showInbox, setShowInbox] = useState(false);
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

  // Fetch gift cards for this client
  const fetchClientGiftCards = useCallback(async () => {
    try {
      const res = await fetch(`/api/gift-cards?client_id=${params.id}`);
      const data = await res.json();
      if (data.giftCards) {
        setGiftCards(data.giftCards);
      }
    } catch (err) {
      console.error('Failed to load gift cards:', err);
    }
  }, [params.id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  useEffect(() => {
    if (params.id) {
      fetchClientAppointments();
      fetchClientGiftCards();
      setLoadingExtra(false);
    }
  }, [params.id, fetchClientAppointments, fetchClientGiftCards]);

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

        <div className="flex items-center gap-2 flex-wrap">
          {/* 2-Way Inbox Button */}
          <button
            onClick={() => setShowInbox(true)}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
            title="Send SMS"
          >
            💬 Inbox
          </button>
          <a
            href="https://accounts.charmtracker.com/signin"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors flex items-center gap-2"
            title="Open Charm EHR"
          >
            🏥 Charm EHR
          </a>
          <a
            href="https://accounts.charmtracker.com/signin"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
            title="E-Prescribe in Charm"
          >
            💊 Prescribe
          </a>
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
        <div className="space-y-6">
          {/* Gift Cards Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎁</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gift Cards</h3>
                    <p className="text-sm text-gray-500">Cards owned by or purchased for this client</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Balance</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${giftCards.filter(gc => gc.status === 'active').reduce((sum, gc) => sum + (gc.current_balance || 0), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            {loadingExtra ? (
              <div className="p-6">
                {[1, 2].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
              </div>
            ) : giftCards.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No gift cards linked to this client</p>
                <Link
                  href="/admin/gift-cards"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>🎁</span> Sell Gift Card
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-purple-100">
                {giftCards.map((gc) => (
                  <div key={gc.id} className="p-4 hover:bg-white/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-lg">
                            {gc.code}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            gc.status === 'active' ? 'bg-green-100 text-green-700' :
                            gc.status === 'redeemed' ? 'bg-gray-100 text-gray-600' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {gc.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {gc.purchaser_client_id === params.id ? 'Purchased by this client' : 'Gift for this client'}
                          {gc.expires_at && ` • Expires ${new Date(gc.expires_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${(gc.current_balance || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">of ${(gc.initial_value || gc.initial_amount || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Payment History</h3>
            </div>
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
        </div>
      )}

      {activeTab === 'clinical' && (
        <div className="space-y-6">
          {/* Chart-to-Cart sessions (stays in client profile) */}
          <TreatmentSessionsSection clientId={client.id} />

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Clinical Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/charting/injection-map?client=${client.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <span>💉</span>
                <span className="font-medium text-gray-700">New Injection Map</span>
              </Link>
              <Link
                href={`/charting?client=${client.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <span>📋</span>
                <span className="font-medium text-gray-700">New Chart Note</span>
              </Link>
              <Link
                href={`/admin/consents?client=${client.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span>📝</span>
                <span className="font-medium text-gray-700">Sign Consent</span>
              </Link>
              <Link
                href="/admin/chart-to-cart/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
              >
                <span>🛒</span>
                <span className="font-medium text-gray-700">Chart-to-Cart Session</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Medications */}
            <MedicationsSection 
              clientId={client.id} 
              clientName={`${client.first_name} ${client.last_name}`} 
            />

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

            {/* Chart Notes */}
            <ClientChartNotes clientId={client.id} />

            {/* Injection Maps */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Injection Maps</h3>
                <Link
                  href={`/admin/charting/injection-map?client=${client.id}`}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  + New Map
                </Link>
              </div>
              <InjectionMapsPreview clientId={client.id} />
            </div>

            {/* Consents & Forms */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Consents & Forms</h3>
                <Link
                  href={`/admin/consents?client=${client.id}`}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  View All →
                </Link>
              </div>
              {consents.length === 0 ? (
                <p className="text-gray-500 text-sm">No signed consents yet</p>
              ) : (
                <div className="space-y-2">
                  {consents.slice(0, 3).map((consent) => (
                    <div key={consent.id} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-700">{consent.consent_form?.name || 'Consent Form'}</span>
                      <span className="text-gray-400 text-xs">• {formatDate(consent.signed_at)}</span>
                    </div>
                  ))}
                </div>
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

      {/* 2-Way Inbox Modal */}
      {showInbox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md h-[600px] overflow-hidden flex flex-col">
            <ClientInbox
              clientId={client.id}
              clientName={`${client.first_name} ${client.last_name}`}
              clientPhone={client.phone}
              onClose={() => setShowInbox(false)}
              isModal={true}
            />
          </div>
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
