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
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
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
    <div className="bg-white rounded-xl border border-black shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-black">Medications</h3>
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
        <div className="mb-4 p-4 bg-white rounded-lg border border-black">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
              placeholder="Medication name *"
              className="px-3 py-2 border border-black rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
              placeholder="Dosage (e.g., 10mg)"
              className="px-3 py-2 border border-black rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              placeholder="Frequency (e.g., Once daily)"
              className="px-3 py-2 border border-black rounded-lg text-sm"
            />
            <input
              type="text"
              value={newMed.prescriber}
              onChange={(e) => setNewMed({ ...newMed, prescriber: e.target.value })}
              placeholder="Prescriber"
              className="px-3 py-2 border border-black rounded-lg text-sm"
            />
          </div>
          <input
            type="text"
            value={newMed.notes}
            onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
            placeholder="Notes (optional)"
            className="w-full px-3 py-2 border border-black rounded-lg text-sm mb-3"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-black text-sm hover:bg-white rounded-lg"
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
          <p className="text-black text-sm">No medications on record</p>
          <p className="text-black text-xs mt-1">Add records here after prescribing in Charm</p>
        </div>
      ) : (
        <div className="space-y-3">
          {medications.map((med) => (
            <div key={med.id} className="flex items-start justify-between p-3 bg-white rounded-lg">
              <div>
                <p className="font-medium text-black">{med.name}</p>
                <p className="text-sm text-black">
                  {med.dosage && `${med.dosage} • `}
                  {med.frequency && `${med.frequency} • `}
                  {med.prescriber && `by ${med.prescriber}`}
                </p>
                {med.notes && <p className="text-xs text-black mt-1">{med.notes}</p>}
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
      <div className="mt-4 pt-4 border-t border-black">
        <p className="text-xs text-black text-center">
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
    <div className="bg-white rounded-xl border border-black shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-black">Chart-to-Cart Sessions</h3>
        <Link
          href="/admin/chart-to-cart/new"
          className="text-sm text-pink-600 hover:text-pink-700 font-medium"
        >
          + New Session
        </Link>
      </div>
      <p className="text-xs text-black mb-4">
        Treatment sessions created here are saved to this client&apos;s profile.
      </p>
      {sessions.length === 0 ? (
        <div className="text-center py-6">
          <span className="text-3xl mb-2 block">🛒</span>
          <p className="text-black text-sm">No Chart-to-Cart sessions yet</p>
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
            <div key={s.id} className="p-3 bg-white rounded-lg border border-black">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-black">{s.treatment_summary || 'Treatment'}</p>
                  <p className="text-xs text-black mt-0.5">
                    {new Date(s.started_at).toLocaleDateString()} • {s.provider || 'Staff'} •
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                      s.status === 'completed' ? 'bg-white text-black' :
                      s.status === 'ready_to_checkout' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {s.status?.replace('_', ' ')}
                    </span>
                  </p>
                  {Array.isArray(s.products) && s.products.length > 0 && (
                    <p className="text-xs text-black mt-1">
                      {s.products.map((p: any) => `${p.name} (${p.quantity})`).join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-black">${Number(s.total || 0).toFixed(2)}</p>
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
        <p className="text-black text-sm">No injection maps yet</p>
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
          className="block p-3 border border-black rounded-lg hover:bg-white transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black text-sm">
                {new Date(map.created_at).toLocaleDateString('en-US', { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                })}
              </p>
              <p className="text-xs text-black">
                {map.points?.length || 0} injection points
              </p>
            </div>
            <span className="text-black">→</span>
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

// Documents tab: fetches client_documents + upload modal
function DocumentsTabContent({
  clientId,
  formatDate,
  consents,
  loadingExtra,
}: {
  clientId: string;
  formatDate: (s: string | null) => string;
  consents: any[];
  loadingExtra: boolean;
}) {
  const [portalDocs, setPortalDocs] = useState<any[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    document_type: 'other',
    category: 'other',
    description: '',
    file: null as File | null,
  });

  const fetchDocs = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/client-documents?client_id=${clientId}`);
      const data = await res.json();
      setPortalDocs(data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setDocsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (clientId) fetchDocs();
  }, [clientId, fetchDocs]);

  const handleUpload = async () => {
    if (!uploadForm.file) {
      alert('Please select a file');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', uploadForm.file);
      fd.append('client_id', clientId);
      fd.append('title', uploadForm.title || uploadForm.file.name);
      fd.append('document_type', uploadForm.document_type);
      fd.append('category', uploadForm.category);
      if (uploadForm.description) fd.append('description', uploadForm.description);
      const res = await fetch('/api/admin/client-documents', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.document) {
        setPortalDocs((prev) => [data.document, ...prev]);
        setShowUploadModal(false);
        setUploadForm({ title: '', document_type: 'other', category: 'other', description: '', file: null });
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const DOC_TYPES = ['intake', 'consent', 'receipt', 'aftercare', 'prescription', 'lab', 'other'];
  const CATEGORIES = ['clinical', 'financial', 'consent', 'intake', 'other'];

  const loading = loadingExtra || docsLoading;
  const allEmpty = consents.length === 0 && portalDocs.length === 0;

  return (
    <div className="bg-white rounded-xl border border-black shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-black">Documents & Forms</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Upload Document
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : allEmpty ? (
        <p className="text-black text-center py-8">No documents on file</p>
      ) : (
        <div className="space-y-6">
          {consents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Signed Consents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {consents.map((consent) => (
                  <div
                    key={consent.id}
                    className="p-4 border border-black rounded-lg hover:border-black transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-black text-sm">
                          {consent.consent_form?.name || 'Document'}
                        </p>
                        <p className="text-xs text-black">Signed {formatDate(consent.signed_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {portalDocs.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-black mb-2">Portal Documents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portalDocs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border border-black rounded-lg hover:border-black transition-colors cursor-pointer block"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📎</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-black text-sm truncate">{doc.title}</p>
                        <p className="text-xs text-black">
                          {doc.document_type} • {formatDate(doc.created_at)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-black mb-4">Upload Document</h2>
            <p className="text-sm text-black mb-4">
              Documents are stored securely and visible to the client in their portal.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">File *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setUploadForm((f) => ({ ...f, file: e.target.files?.[0] || null }))
                  }
                  className="w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Document title"
                  className="w-full px-3 py-2 border border-black rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Type</label>
                <select
                  value={uploadForm.document_type}
                  onChange={(e) => setUploadForm((f) => ({ ...f, document_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Category</label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Description (optional)</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-black rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ title: '', document_type: 'other', category: 'other', description: '', file: null });
                }}
                className="px-4 py-2 text-black hover:bg-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadForm.file}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// Unified Chart - Aesthetic Record style: single view with sub-tabs
function UnifiedChartTabContent({
  clientId,
  clientName,
  appointments,
  consents,
  formatDate,
  loadingExtra,
}: {
  clientId: string;
  clientName: string;
  appointments: any[];
  consents: any[];
  formatDate: (s: string | null) => string;
  loadingExtra: boolean;
}) {
  const [chartSubTab, setChartSubTab] = useState<'appointments' | 'notes' | 'consents' | 'photos' | 'chart-to-cart'>('appointments');
  const subTabs = [
    { id: 'appointments' as const, label: 'Appointments', icon: '📅' },
    { id: 'notes' as const, label: 'Chart Notes', icon: '📋' },
    { id: 'consents' as const, label: 'Consents', icon: '📝' },
    { id: 'photos' as const, label: 'Photos', icon: '📷' },
    { id: 'chart-to-cart' as const, label: 'Chart-to-Cart', icon: '🛒' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-black">
        {subTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setChartSubTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              chartSubTab === t.id
                ? 'bg-[#2D63A4] text-white'
                : 'bg-white text-black hover:bg-white'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {chartSubTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-black overflow-hidden">
          {loadingExtra ? (
            <div className="p-6 space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-12" />)}</div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-black">
              No appointments
              <Link href={`/admin/appointments/new?client=${clientId}`} className="block text-[#FF2D8E] mt-2 font-medium">+ Book</Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white border-b border-black">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Service</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Provider</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-semibold text-black">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white">
                    <td className="px-5 py-3 text-sm">{formatDate(apt.starts_at)}</td>
                    <td className="px-5 py-3">{apt.service_name || '-'}</td>
                    <td className="px-5 py-3 text-black">{apt.provider_name || '-'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>{apt.status}</span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">${apt.service_price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {chartSubTab === 'notes' && (
        <div className="space-y-4">
          <ClientChartNotes clientId={clientId} />
          <div className="flex gap-2">
            <Link href={`/charting?client_id=${clientId}`} className="px-4 py-2 bg-[#2D63A4] text-white text-sm font-medium rounded-lg">New Chart Note</Link>
            <Link href={`/admin/charting/injection-map?client=${clientId}`} className="px-4 py-2 bg-white text-black text-sm font-medium rounded-lg">Injection Map</Link>
          </div>
        </div>
      )}

      {chartSubTab === 'consents' && (
        <div className="bg-white rounded-xl border border-black p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-black">Signed Consents</h3>
            <Link href={`/admin/consents?client=${clientId}`} className="text-sm text-[#2D63A4] font-medium">Sign New →</Link>
          </div>
          {consents.length === 0 ? (
            <p className="text-black text-sm">No signed consents</p>
          ) : (
            <div className="space-y-2">
              {consents.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-black last:border-0">
                  <span className="text-black">{c.consent_form?.name || c.form_type}</span>
                  <span className="text-black text-sm">{formatDate(c.signed_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {chartSubTab === 'photos' && (
        <div className="bg-white rounded-xl border border-black p-8 text-center">
          <span className="text-4xl block mb-4">📷</span>
          <h3 className="font-semibold text-black mb-2">Treatment Photos</h3>
          <p className="text-black text-sm mb-4">Before/after and progress photos</p>
          <Link href={`/admin/clients/${clientId}/photos`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D63A4] text-white font-medium rounded-lg">Open Photos →</Link>
        </div>
      )}

      {chartSubTab === 'chart-to-cart' && (
        <div className="space-y-4">
          <TreatmentSessionsSection clientId={clientId} />
          <Link href="/admin/chart-to-cart/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF2D8E] text-white font-medium rounded-lg">
            <span>🛒</span> New Chart-to-Cart Session
          </Link>
        </div>
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
    <div className="bg-white rounded-xl border border-black shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-black">Chart Notes</h3>
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
          <p className="text-black text-sm">No chart notes yet</p>
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
              className="block border-b border-black pb-3 last:border-0 hover:bg-white -mx-2 px-2 py-1 rounded transition-colors"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-black text-sm">
                  {note.title || note.service_name || 'Chart Note'}
                </p>
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${STATUS_COLORS[note.status] || 'bg-white text-black'}`}>
                  {note.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-black mt-0.5">
                {formatDate(note.created_at)} • {note.created_by_name || 'Staff'}
              </p>
              {note.assessment && (
                <p className="text-xs text-black mt-1 line-clamp-1">{note.assessment}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'payments' | 'chart' | 'documents'>('overview');
  
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

  // Fetch signed consents for this client
  const fetchClientConsents = useCallback(async () => {
    try {
      const res = await fetch(`/api/consents/sign?clientId=${params.id}`);
      const data = await res.json();
      if (data.consents) {
        setConsents(data.consents.map((c: any) => ({
          id: c.id,
          form_type: c.form_type,
          signed_at: c.signed_at,
          consent_form: { name: c.form_type?.replace(/_/g, ' ') || 'Consent' },
        })));
      }
    } catch (err) {
      console.error('Failed to load consents:', err);
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
      fetchClientConsents();
      fetchClientGiftCards();
      setLoadingExtra(false);
    }
  }, [params.id, fetchClientAppointments, fetchClientConsents, fetchClientGiftCards]);

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
        <p className="text-black mb-4">
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
            className="text-sm text-black hover:text-black mb-2 inline-block"
          >
            ← Back to Clients
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {client.first_name?.[0]}{client.last_name?.[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-black">
                  {client.first_name} {client.last_name}
                </h1>
                {client.is_vip && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    💎 VIP Member
                  </span>
                )}
              </div>
              <p className="text-black">
                {age ? `${age} years old • ` : ''}
                Client since {formatDate(client.created_at)} • {client.total_visits || 0} visits
              </p>
              {client.tags && client.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {client.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-white text-black rounded">
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
            className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors"
          >
            Edit
          </button>
          {client.phone && (
            <a href={`tel:${client.phone}`} className="p-2 border border-black text-black rounded-lg hover:bg-white transition-colors">
              📞
            </a>
          )}
          {client.email && (
            <a href={`mailto:${client.email}`} className="p-2 border border-black text-black rounded-lg hover:bg-white transition-colors">
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
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Visits</p>
          <p className="text-2xl font-bold text-black">{client.total_visits || 0}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Spent</p>
          <p className="text-2xl font-bold text-black">${(client.total_spent || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Avg Ticket</p>
          <p className="text-2xl font-bold text-black">
            ${client.total_visits ? Math.round((client.total_spent || 0) / client.total_visits) : 0}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Last Visit</p>
          <p className="text-2xl font-bold text-black">{formatDate(client.last_visit_at)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-black">
        <nav className="flex gap-4">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'appointments', label: `Appointments (${appointments.length})` },
            { id: 'payments', label: `Payments (${payments.length})` },
            { id: 'chart', label: 'Chart' },
            { id: 'documents', label: `Documents (${consents.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-black hover:text-black'
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
          <div className="bg-white rounded-xl border border-black shadow-sm p-5">
            <h3 className="font-semibold text-black mb-4">Contact Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-black">Email</p>
                <p className="text-black">{client.email || '-'}</p>
              </div>
              <div>
                <p className="text-black">Phone</p>
                <p className="text-black">{client.phone || '-'}</p>
              </div>
              <div>
                <p className="text-black">Address</p>
                <p className="text-black">
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
                <p className="text-black">Date of Birth</p>
                <p className="text-black">
                  {client.date_of_birth ? `${formatDate(client.date_of_birth)} (${age} years old)` : '-'}
                </p>
              </div>
              <div>
                <p className="text-black">Emergency Contact</p>
                <p className="text-black">{client.emergency_contact_name || '-'}</p>
                {client.emergency_contact_phone && (
                  <p className="text-black">{client.emergency_contact_phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="bg-white rounded-xl border border-black shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-black">Recent Appointments</h3>
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
              <p className="text-black text-sm py-4">No appointments yet</p>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="border-b border-black pb-3 last:border-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-black">{apt.service_name || 'Service'}</p>
                      <p className="text-sm text-black">${apt.service_price || 0}</p>
                    </div>
                    <p className="text-sm text-black">
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
            <div className="bg-white rounded-xl border border-black shadow-sm p-5">
              <h3 className="font-semibold text-black mb-4">Consents</h3>
              {loadingExtra ? (
                <div className="space-y-2">
                  {[1, 2].map(i => <Skeleton key={i} className="h-10" />)}
                </div>
              ) : consents.length === 0 ? (
                <p className="text-black text-sm">No consents on file</p>
              ) : (
                <div className="space-y-2">
                  {consents.slice(0, 4).map((consent) => (
                    <div key={consent.id} className="flex items-center justify-between py-2">
                      <p className="text-sm text-black">{consent.consent_form?.name || 'Consent'}</p>
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
              <div className="bg-white rounded-xl border border-black shadow-sm p-5">
                <h3 className="font-semibold text-black mb-4">Internal Notes</h3>
                <p className="text-sm text-black">{client.internal_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
          {loadingExtra ? (
            <div className="p-6">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-black">
              No appointments found
              <br />
              <Link href={`/admin/appointments/new?client=${client.id}`} className="text-pink-600 mt-2 inline-block">
                + Book first appointment
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white border-b border-black">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Date</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Service</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Provider</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                  <th className="text-right px-5 py-3 text-sm font-semibold text-black">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-white">
                    <td className="px-5 py-3">
                      <p className="font-medium text-black">{formatDate(apt.starts_at)}</p>
                    </td>
                    <td className="px-5 py-3 text-black">{apt.service_name || '-'}</td>
                    <td className="px-5 py-3 text-black">
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
                    <td className="px-5 py-3 text-right font-medium text-black">
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
                    <h3 className="font-semibold text-black">Gift Cards</h3>
                    <p className="text-sm text-black">Cards owned by or purchased for this client</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-black">Total Balance</p>
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
                <p className="text-black mb-4">No gift cards linked to this client</p>
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
                            gc.status === 'redeemed' ? 'bg-white text-black' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {gc.status}
                          </span>
                        </div>
                        <p className="text-sm text-black mt-1">
                          {gc.purchaser_client_id === params.id ? 'Purchased by this client' : 'Gift for this client'}
                          {gc.expires_at && ` • Expires ${new Date(gc.expires_at).toLocaleDateString()}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">${(gc.current_balance || 0).toFixed(2)}</p>
                        <p className="text-xs text-black">of ${(gc.initial_value || gc.initial_amount || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
            <div className="p-5 border-b border-black">
              <h3 className="font-semibold text-black">Payment History</h3>
            </div>
            {loadingExtra ? (
              <div className="p-6">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 mb-2" />)}
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center text-black">No payments found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-white border-b border-black">
                  <tr>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-black">Date</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-black">Method</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                    <th className="text-right px-5 py-3 text-sm font-semibold text-black">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white">
                      <td className="px-5 py-3 font-medium text-black">{formatDate(payment.created_at)}</td>
                      <td className="px-5 py-3 text-black">{payment.payment_method || 'Card'}</td>
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

      {activeTab === 'chart' && (
        <UnifiedChartTabContent
          clientId={client.id}
          clientName={`${client.first_name} ${client.last_name}`}
          appointments={appointments}
          consents={consents}
          formatDate={formatDate}
          loadingExtra={loadingExtra}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentsTabContent
          clientId={client.id}
          formatDate={formatDate}
          consents={consents}
          loadingExtra={loadingExtra}
        />
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
            <div className="p-6 border-b border-black">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-black">Edit Client</h2>
                <button onClick={() => setShowEditModal(false)} className="text-black hover:text-black text-2xl">×</button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">First Name</label>
                  <input
                    type="text"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Last Name</label>
                  <input
                    type="text"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) => setEditForm({...editForm, date_of_birth: e.target.value})}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Address</label>
                <input
                  type="text"
                  value={editForm.address_line1}
                  onChange={(e) => setEditForm({...editForm, address_line1: e.target.value})}
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">City</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">State</label>
                  <input
                    type="text"
                    value={editForm.state}
                    onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">ZIP</label>
                  <input
                    type="text"
                    value={editForm.postal_code}
                    onChange={(e) => setEditForm({...editForm, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={editForm.emergency_contact_name}
                    onChange={(e) => setEditForm({...editForm, emergency_contact_name: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={editForm.emergency_contact_phone}
                    onChange={(e) => setEditForm({...editForm, emergency_contact_phone: e.target.value})}
                    className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              
              {/* Medical */}
              <div>
                <label className="block text-sm font-medium text-black mb-1">Allergies</label>
                <input
                  type="text"
                  value={editForm.allergies_summary}
                  onChange={(e) => setEditForm({...editForm, allergies_summary: e.target.value})}
                  placeholder="e.g., Penicillin, latex"
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Internal Notes</label>
                <textarea
                  value={editForm.internal_notes}
                  onChange={(e) => setEditForm({...editForm, internal_notes: e.target.value})}
                  rows={3}
                  placeholder="Notes only visible to staff..."
                  className="w-full px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
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
