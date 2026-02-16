// ============================================================
// ADMIN: PRESCRIPTION MANAGEMENT (eRX)
// Cloud-based prescription tracking for med spa
// Print/Fax ready prescriptions - integrates with eFax
// ============================================================

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Prescription {
  id: string;
  client_id: string;
  client_name: string;
  client_dob?: string;
  client_phone?: string;
  provider_id?: string;
  provider_name?: string;
  medication_name: string;
  strength?: string;
  form?: string;
  sig: string;
  quantity?: number;
  refills?: number;
  pharmacy_name?: string;
  pharmacy_phone?: string;
  pharmacy_fax?: string;
  notes?: string;
  diagnosis?: string;
  daw?: boolean;
  status: string;
  created_at: string;
  sent_at?: string;
}

interface MedicationTemplate {
  id: string;
  name: string;
  strength: string;
  form: string;
  category: string;
  defaultSig: string;
  defaultQuantity: number;
  defaultRefills: number;
  notes: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
}

interface Provider {
  id: string;
  name: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [templates, setTemplates] = useState<MedicationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent' | 'filled'>('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<MedicationTemplate | null>(null);
  const [formData, setFormData] = useState({
    provider_id: '', medication_name: '', strength: '', form: '', sig: '',
    quantity: '', refills: '0', pharmacy_name: '', pharmacy_phone: '',
    pharmacy_fax: '', diagnosis: '', notes: '', daw: false,
  });
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printRx, setPrintRx] = useState<Prescription | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      const res = await fetch(`/api/prescriptions?${params}`);
      const data = await res.json();
      setPrescriptions(data.prescriptions || []);
      setTemplates(data.templates || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  const fetchClients = async (search: string) => {
    try {
      const res = await fetch(`/api/clients?search=${encodeURIComponent(search)}&limit=20`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (showNewModal) {
      fetch('/api/providers').then(r => r.json()).then(d => {
        const provList = (d.providers || d || []).map((p: any) => ({
          id: p.id, name: p.users ? `${p.users.first_name} ${p.users.last_name}` : p.name || 'Provider'
        }));
        setProviders(provList);
      });
    }
  }, [showNewModal]);

  const applyTemplate = (t: MedicationTemplate) => {
    setSelectedTemplate(t);
    setFormData({ ...formData, medication_name: `${t.name} ${t.strength}`, strength: t.strength,
      form: t.form, sig: t.defaultSig, quantity: t.defaultQuantity.toString(), refills: t.defaultRefills.toString() });
  };

  const handleCreate = async () => {
    if (!selectedClient || !formData.medication_name || !formData.sig) { alert('Fill required fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/prescriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: selectedClient.id, provider_id: formData.provider_id || null,
          medication_name: formData.medication_name, strength: formData.strength, form: formData.form,
          sig: formData.sig, quantity: parseInt(formData.quantity) || null, refills: parseInt(formData.refills) || 0,
          pharmacy_name: formData.pharmacy_name, pharmacy_phone: formData.pharmacy_phone, pharmacy_fax: formData.pharmacy_fax,
          diagnosis: formData.diagnosis, notes: formData.notes, daw: formData.daw }) });
      if (res.ok) { setShowNewModal(false); resetForm(); fetchPrescriptions(); }
      else { const e = await res.json(); alert(e.error || 'Failed'); }
    } catch (err) { alert('Failed'); }
    finally { setSaving(false); }
  };

  const resetForm = () => {
    setSelectedClient(null); setSelectedTemplate(null); setClientSearch('');
    setFormData({ provider_id: '', medication_name: '', strength: '', form: '', sig: '', quantity: '',
      refills: '0', pharmacy_name: '', pharmacy_phone: '', pharmacy_fax: '', diagnosis: '', notes: '', daw: false });
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch('/api/prescriptions', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }) });
      fetchPrescriptions();
    } catch (err) { console.error(err); }
  };

  const printPrescription = () => {
    if (!printRef.current || !printRx) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Rx - ${printRx.client_name}</title>
      <style>body{font-family:Arial;padding:40px;max-width:600px;margin:0 auto}
      .hdr{text-align:center;border-bottom:2px solid #000;padding-bottom:20px;margin-bottom:20px}
      .hdr h1{margin:0;font-size:24px}.hdr p{margin:5px 0;color:#666}
      .rx{font-size:28px;font-weight:bold;margin:20px 0}.med{font-size:18px;font-weight:bold;margin:10px 0}
      .sig{margin:15px 0;padding:10px;background:#f5f5f5}.sigline{border-top:1px solid #000;width:250px;margin-top:40px}</style>
      </head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close(); w.print();
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const uniqueCategories = [...new Set(templates.map(t => t.category))];
  const filteredTemplates = categoryFilter === 'all' ? templates : templates.filter(t => t.category === categoryFilter);
  const statusBadge = (s: string) => {
    const c = { pending: 'bg-yellow-100 text-yellow-700', sent: 'bg-blue-100 text-blue-700', filled: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${c[s as keyof typeof c] || ''}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3"><span className="text-3xl">💊</span>Prescriptions</h1>
          <p className="text-black mt-1">Manage prescriptions • Print for eFax • Track status</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="https://myportal.efax.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-black text-white rounded-xl hover:bg-black font-medium flex items-center gap-2 transition-colors"
            title="Fax prescriptions to pharmacies"
          >
            📠 eFax
          </a>
          <a
            href="https://accounts.charmtracker.com/account/v1/relogin?serviceurl=https%3A%2F%2Faccounts.charmtracker.com%2Fhome%23profile%2Fpersonal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium flex items-center gap-2 transition-colors"
            title="Open Charm EHR"
          >
            🏥 Charm EHR
          </a>
          <button onClick={() => setShowNewModal(true)} className="px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium flex items-center gap-2">+ New Prescription</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[{ l: 'Total', v: prescriptions.length, c: 'gray-900' }, { l: 'Pending', v: prescriptions.filter(r => r.status === 'pending').length, c: 'yellow-600' },
          { l: 'Sent', v: prescriptions.filter(r => r.status === 'sent').length, c: 'blue-600' }, { l: 'Filled', v: prescriptions.filter(r => r.status === 'filled').length, c: 'green-600' }]
          .map((s, i) => <div key={i} className="bg-white rounded-xl border p-5 shadow-sm"><p className="text-sm text-black">{s.l}</p><p className={`text-3xl font-bold text-${s.c} mt-1`}>{s.v}</p></div>)}
      </div>

      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'sent', 'filled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filter === f ? 'bg-pink-500 text-white' : 'bg-white text-black hover:bg-white'}`}>{f}</button>
        ))}
      </div>

      {loading ? <div className="bg-white rounded-xl border p-8 animate-pulse"><div className="h-16 bg-white rounded mb-4"/><div className="h-16 bg-white rounded"/></div>
      : prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <span className="text-6xl">💊</span><h3 className="text-xl font-semibold mt-4">No prescriptions</h3>
          <button onClick={() => setShowNewModal(true)} className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-xl">New Prescription</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-white border-b"><tr>
              {['Patient', 'Medication', 'Sig', 'Qty', 'Date', 'Status', 'Actions'].map(h => <th key={h} className={`px-6 py-4 text-xs font-semibold text-black uppercase ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>)}
            </tr></thead>
            <tbody className="divide-y">
              {prescriptions.map(rx => (
                <tr key={rx.id} className="hover:bg-white">
                  <td className="px-6 py-4"><p className="font-medium">{rx.client_name}</p><p className="text-xs text-black">DOB: {rx.client_dob || 'N/A'}</p></td>
                  <td className="px-6 py-4"><p className="font-medium">{rx.medication_name}</p><p className="text-xs text-black">{rx.form}</p></td>
                  <td className="px-6 py-4"><p className="text-sm text-black max-w-xs truncate">{rx.sig}</p></td>
                  <td className="px-6 py-4"><p>#{rx.quantity || '-'}</p><p className="text-xs text-black">{rx.refills || 0} refills</p></td>
                  <td className="px-6 py-4">{formatDate(rx.created_at)}</td>
                  <td className="px-6 py-4">{statusBadge(rx.status)}</td>
                  <td className="px-6 py-4"><div className="flex justify-end gap-2">
                    <button onClick={() => { setPrintRx(rx); setShowPrintModal(true); }} className="px-3 py-1.5 text-sm bg-white rounded-lg hover:bg-white">🖨️ Print</button>
                    {rx.status === 'pending' && <button onClick={() => updateStatus(rx.id, 'sent')} className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg">Mark Sent</button>}
                    {rx.status === 'sent' && <button onClick={() => updateStatus(rx.id, 'filled')} className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg">Mark Filled</button>}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between">
              <h2 className="text-xl font-bold">New Prescription</h2>
              <button onClick={() => { setShowNewModal(false); resetForm(); }} className="text-black hover:text-black">✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Patient *</label>
                  {!selectedClient ? (
                    <div>
                      <input type="text" value={clientSearch} onChange={(e) => { setClientSearch(e.target.value); if (e.target.value.length >= 2) fetchClients(e.target.value); }} placeholder="Search patient..." className="w-full px-4 py-2 border rounded-xl"/>
                      {clients.length > 0 && clientSearch.length >= 2 && (
                        <div className="mt-2 border rounded-xl max-h-40 overflow-y-auto">
                          {clients.map(c => <button key={c.id} onClick={() => setSelectedClient(c)} className="w-full p-3 text-left hover:bg-pink-50 border-b last:border-0"><p className="font-medium">{c.first_name} {c.last_name}</p><p className="text-xs text-black">DOB: {c.date_of_birth || 'N/A'}</p></button>)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between p-3 bg-pink-50 rounded-xl"><div><p className="font-medium">{selectedClient.first_name} {selectedClient.last_name}</p><p className="text-sm text-black">DOB: {selectedClient.date_of_birth || 'N/A'}</p></div><button onClick={() => setSelectedClient(null)} className="text-pink-600">Change</button></div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prescriber</label>
                  <select value={formData.provider_id} onChange={e => setFormData({...formData, provider_id: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
                    <option value="">Select prescriber</option>
                    {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Quick Templates</label>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <button onClick={() => setCategoryFilter('all')} className={`px-3 py-1 rounded-full text-xs ${categoryFilter === 'all' ? 'bg-pink-500 text-white' : 'bg-white'}`}>All</button>
                    {uniqueCategories.map(cat => <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1 rounded-full text-xs ${categoryFilter === cat ? 'bg-pink-500 text-white' : 'bg-white'}`}>{cat}</button>)}
                  </div>
                  <div className="max-h-48 overflow-y-auto border rounded-xl">
                    {filteredTemplates.map(t => <button key={t.id} onClick={() => applyTemplate(t)} className={`w-full p-3 text-left border-b last:border-0 hover:bg-pink-50 ${selectedTemplate?.id === t.id ? 'bg-pink-50' : ''}`}><p className="font-medium">{t.name} {t.strength}</p><p className="text-xs text-black">{t.notes}</p></button>)}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-2">Medication *</label><input type="text" value={formData.medication_name} onChange={e => setFormData({...formData, medication_name: e.target.value})} placeholder="e.g., Valacyclovir 500mg" className="w-full px-4 py-2 border rounded-xl"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Strength</label><input type="text" value={formData.strength} onChange={e => setFormData({...formData, strength: e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
                  <div><label className="block text-sm font-medium mb-2">Form</label><select value={formData.form} onChange={e => setFormData({...formData, form: e.target.value})} className="w-full px-4 py-2 border rounded-xl"><option value="">Select</option><option value="Tablet">Tablet</option><option value="Capsule">Capsule</option><option value="Cream">Cream</option><option value="Ointment">Ointment</option><option value="Gel">Gel</option><option value="Solution">Solution</option><option value="Injection">Injection</option></select></div>
                </div>
                <div><label className="block text-sm font-medium mb-2">Sig (Directions) *</label><textarea value={formData.sig} onChange={e => setFormData({...formData, sig: e.target.value})} rows={3} className="w-full px-4 py-2 border rounded-xl"/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium mb-2">Quantity</label><input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-2 border rounded-xl"/></div>
                  <div><label className="block text-sm font-medium mb-2">Refills</label><input type="number" value={formData.refills} onChange={e => setFormData({...formData, refills: e.target.value})} min="0" max="12" className="w-full px-4 py-2 border rounded-xl"/></div>
                </div>
                <div><label className="block text-sm font-medium mb-2">Diagnosis</label><input type="text" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} placeholder="ICD-10" className="w-full px-4 py-2 border rounded-xl"/></div>
                <div className="border-t pt-4"><label className="block text-sm font-semibold mb-3">Pharmacy</label>
                  <input type="text" value={formData.pharmacy_name} onChange={e => setFormData({...formData, pharmacy_name: e.target.value})} placeholder="Pharmacy name" className="w-full px-4 py-2 border rounded-xl mb-2"/>
                  <div className="grid grid-cols-2 gap-2"><input type="text" value={formData.pharmacy_phone} onChange={e => setFormData({...formData, pharmacy_phone: e.target.value})} placeholder="Phone" className="px-4 py-2 border rounded-xl"/><input type="text" value={formData.pharmacy_fax} onChange={e => setFormData({...formData, pharmacy_fax: e.target.value})} placeholder="Fax" className="px-4 py-2 border rounded-xl"/></div>
                </div>
                <label className="flex items-center gap-2"><input type="checkbox" checked={formData.daw} onChange={e => setFormData({...formData, daw: e.target.checked})} className="w-4 h-4 rounded"/><span className="text-sm">DAW (Dispense As Written)</span></label>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <button onClick={() => { setShowNewModal(false); resetForm(); }} className="px-4 py-2 text-black">Cancel</button>
              <button onClick={handleCreate} disabled={!selectedClient || !formData.medication_name || !formData.sig || saving} className="px-6 py-2 bg-pink-500 text-white rounded-xl disabled:opacity-50">{saving ? 'Creating...' : 'Create Prescription'}</button>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && printRx && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b flex justify-between"><h2 className="text-xl font-bold">Print Prescription</h2><button onClick={() => setShowPrintModal(false)} className="text-black">✕</button></div>
            <div ref={printRef} className="p-8">
              <div className="text-center border-b-2 border-black pb-4 mb-4"><h1 className="text-2xl font-bold">Hello Gorgeous Med Spa</h1><p className="text-black">74 W. Washington St, Oswego, IL 60543</p><p className="text-black">(630) 636-6193</p></div>
              <p><strong>Patient:</strong> {printRx.client_name}</p>
              <p><strong>DOB:</strong> {printRx.client_dob || 'N/A'}</p>
              <p><strong>Date:</strong> {formatDate(printRx.created_at)}</p>
              <p className="text-3xl font-bold my-4">Rx</p>
              <p className="text-xl font-bold">{printRx.medication_name}</p>
              <div className="my-4 p-3 bg-white rounded"><strong>Sig:</strong> {printRx.sig}</div>
              <p><strong>Quantity:</strong> #{printRx.quantity || 'As directed'}</p>
              <p><strong>Refills:</strong> {printRx.refills || 0}</p>
              {printRx.daw && <p className="font-bold">DAW - Dispense As Written</p>}
              {printRx.pharmacy_name && <div className="mt-6 pt-4 border-t"><p><strong>Pharmacy:</strong> {printRx.pharmacy_name}</p>{printRx.pharmacy_fax && <p>Fax: {printRx.pharmacy_fax}</p>}</div>}
              <div className="mt-12"><p><strong>Prescriber:</strong> {printRx.provider_name || '_________________'}</p><div className="border-t border-black w-64 mt-10 pt-1"><span className="text-sm">Signature</span></div></div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button onClick={() => setShowPrintModal(false)} className="px-4 py-2 text-black">Close</button>
              <button onClick={() => { printPrescription(); updateStatus(printRx.id, 'sent'); }} className="px-6 py-2 bg-pink-500 text-white rounded-xl">🖨️ Print & Mark Sent</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Workflow Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Create prescription → Print → Send via eFax to pharmacy</li>
          <li>• Use Charm EHR for controlled substances that need calling in</li>
          <li>• Mark as &quot;Sent&quot; after faxing, &quot;Filled&quot; when patient confirms</li>
          <li>• Pre-loaded templates: Valtrex, antibiotics, topicals, antiemetics</li>
        </ul>
      </div>
    </div>
  );
}
