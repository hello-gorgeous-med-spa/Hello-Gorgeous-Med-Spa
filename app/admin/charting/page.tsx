'use client';

// ============================================================
// CHARTING PAGE
// View and create SOAP chart notes for appointments
// ============================================================

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function ChartingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get('appointment');
  const clientId = searchParams.get('client');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [existingNote, setExistingNote] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    provider_id: '',
    chief_complaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    treatment_performed: '',
    areas_treated: [] as string[],
    products_used: [] as any[],
    consent_obtained: false,
    adverse_reactions: '',
    patient_instructions: '',
    follow_up_date: '',
  });

  // Treatment area options
  const TREATMENT_AREAS = [
    'Forehead', 'Glabella (11s)', 'Crow\'s Feet', 'Brow Lift',
    'Bunny Lines', 'Lip Lines', 'Marionette Lines', 'Chin',
    'Jawline', 'Neck', 'Cheeks', 'Temples', 'Under Eyes',
    'Nasolabial Folds', 'Lips', 'Nose', 'Hands'
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch providers
        const provRes = await fetch('/api/providers');
        const provData = await provRes.json();
        setProviders(provData.providers || []);

        // If appointment ID, fetch appointment details
        if (appointmentId) {
          const apptRes = await fetch(`/api/appointments?date=`);
          const apptData = await apptRes.json();
          const apt = apptData.appointments?.find((a: any) => a.id === appointmentId);
          if (apt) {
            setAppointment(apt);
            setFormData(prev => ({
              ...prev,
              provider_id: apt.provider_id || provData.providers?.[0]?.id || '',
            }));

            // Check for existing note
            const noteRes = await fetch(`/api/chart-notes?appointmentId=${appointmentId}`);
            const noteData = await noteRes.json();
            if (noteData.notes?.length > 0) {
              const note = noteData.notes[0];
              setExistingNote(note);
              setFormData({
                provider_id: note.provider_id || '',
                chief_complaint: note.chief_complaint || '',
                subjective: note.subjective || '',
                objective: note.objective || '',
                assessment: note.assessment || '',
                plan: note.plan || '',
                treatment_performed: note.treatment_performed || '',
                areas_treated: note.areas_treated || [],
                products_used: note.products_used || [],
                consent_obtained: note.consent_obtained || false,
                adverse_reactions: note.adverse_reactions || '',
                patient_instructions: note.patient_instructions || '',
                follow_up_date: note.follow_up_date || '',
              });
            }
          }
        }

        // If client ID (without appointment), fetch client
        if (clientId && !appointmentId) {
          const clientRes = await fetch(`/api/clients?id=${clientId}`);
          const clientData = await clientRes.json();
          if (clientData.clients?.length > 0) {
            setClient(clientData.clients[0]);
          }
        }

      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, clientId]);

  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      areas_treated: prev.areas_treated.includes(area)
        ? prev.areas_treated.filter(a => a !== area)
        : [...prev.areas_treated, area]
    }));
  };

  const handleAddProduct = () => {
    setFormData(prev => ({
      ...prev,
      products_used: [...prev.products_used, { name: '', units: '', lot_number: '' }]
    }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      products_used: prev.products_used.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
    }));
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products_used: prev.products_used.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (sign: boolean = false) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        client_id: appointment?.client_id || clientId,
        appointment_id: appointmentId || null,
      };

      let res;
      if (existingNote) {
        // Update existing note
        res = await fetch('/api/chart-notes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: existingNote.id, ...payload }),
        });
      } else {
        // Create new note
        res = await fetch('/api/chart-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error('Failed to save');

      const data = await res.json();

      // Sign if requested
      if (sign && data.note) {
        await fetch('/api/chart-notes', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.note.id,
            action: 'sign',
            signed_by: formData.provider_id,
          }),
        });
      }

      alert(sign ? 'Chart note signed and saved!' : 'Chart note saved!');
      
      if (appointmentId) {
        router.push(`/admin/appointments/${appointmentId}`);
      } else {
        router.push('/admin/appointments');
      }

    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to save chart note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
      </div>
    );
  }

  // REQUIRE appointment or client - can't chart without context
  if (!appointmentId && !clientId) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-xl border border-black shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-black mb-2">Select an Appointment to Chart</h1>
          <p className="text-black mb-6">
            Chart notes must be linked to a specific appointment or client visit.
          </p>
          
          <div className="space-y-3">
            <Link
              href="/admin/appointments"
              className="block w-full px-6 py-3 bg-[#FF2D8E] text-white font-semibold rounded-lg hover:bg-black transition-colors"
            >
              📅 View Today's Appointments
            </Link>
            <Link
              href="/admin/clients"
              className="block w-full px-6 py-3 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors"
            >
              👥 Search Clients
            </Link>
          </div>

          <p className="text-sm text-black mt-6">
            Tip: Click "Chart" from any appointment to start documentation
          </p>
        </div>
      </div>
    );
  }

  const clientName = appointment?.client_name || `${client?.first_name || ''} ${client?.last_name || ''}`.trim() || 'Unknown Client';
  const isLocked = existingNote?.is_locked || existingNote?.signed_at;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={appointmentId ? `/admin/appointments/${appointmentId}` : '/admin/appointments'}
          className="text-sm text-black hover:text-black mb-2 inline-block"
        >
          ← Back
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">
              {existingNote ? 'Edit Chart Note' : 'New Chart Note'}
            </h1>
            <p className="text-black">SOAP Documentation for {clientName}</p>
          </div>
          {isLocked && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              ✓ Signed & Locked
            </span>
          )}
        </div>
      </div>

      {/* Appointment Info */}
      {appointment && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">Service:</span>{' '}
              <span className="text-blue-900">{appointment.service_name}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Date:</span>{' '}
              <span className="text-blue-900">
                {new Date(appointment.starts_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Provider:</span>{' '}
              <span className="text-blue-900">{appointment.provider_name}</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }}>
        {/* Provider Selection */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-black mb-4">Provider</h2>
          <select
            value={formData.provider_id}
            onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
            disabled={isLocked}
            className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
          >
            <option value="">Select provider...</option>
            {providers.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.first_name || p.firstName} {p.last_name || p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* SOAP Notes */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-black mb-4">SOAP Notes</h2>
          
          <div className="space-y-4">
            {/* Chief Complaint */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Chief Complaint
              </label>
              <input
                type="text"
                value={formData.chief_complaint}
                onChange={(e) => setFormData({ ...formData, chief_complaint: e.target.value })}
                disabled={isLocked}
                placeholder="Primary reason for visit..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>

            {/* Subjective */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                <span className="text-[#FF2D8E] font-bold">S</span> - Subjective
              </label>
              <textarea
                value={formData.subjective}
                onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                disabled={isLocked}
                rows={3}
                placeholder="Patient's symptoms, history, concerns..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>

            {/* Objective */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                <span className="text-[#FF2D8E] font-bold">O</span> - Objective
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                disabled={isLocked}
                rows={3}
                placeholder="Physical findings, observations..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>

            {/* Assessment */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                <span className="text-[#FF2D8E] font-bold">A</span> - Assessment
              </label>
              <textarea
                value={formData.assessment}
                onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                disabled={isLocked}
                rows={3}
                placeholder="Clinical assessment, diagnosis..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>

            {/* Plan */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                <span className="text-[#FF2D8E] font-bold">P</span> - Plan
              </label>
              <textarea
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                disabled={isLocked}
                rows={3}
                placeholder="Treatment plan, next steps..."
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Treatment Details */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-black mb-4">Treatment Details</h2>

          {/* Treatment Performed */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Treatment Performed
            </label>
            <textarea
              value={formData.treatment_performed}
              onChange={(e) => setFormData({ ...formData, treatment_performed: e.target.value })}
              disabled={isLocked}
              rows={2}
              placeholder="Description of treatment..."
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
            />
          </div>

          {/* Areas Treated */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Areas Treated
            </label>
            <div className="flex flex-wrap gap-2">
              {TREATMENT_AREAS.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => !isLocked && handleAreaToggle(area)}
                  disabled={isLocked}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    formData.areas_treated.includes(area)
                      ? 'bg-[#FF2D8E] text-white border-[#FF2D8E]'
                      : 'bg-white text-black border-black hover:border-pink-300'
                  } disabled:opacity-50`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Products Used */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-black">
                Products Used
              </label>
              {!isLocked && (
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  + Add Product
                </button>
              )}
            </div>
            <div className="space-y-2">
              {formData.products_used.map((product, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                    disabled={isLocked}
                    placeholder="Product name"
                    className="flex-1 px-3 py-2 border border-black rounded-lg text-sm disabled:bg-white"
                  />
                  <input
                    type="text"
                    value={product.units}
                    onChange={(e) => handleProductChange(index, 'units', e.target.value)}
                    disabled={isLocked}
                    placeholder="Units/Amount"
                    className="w-24 px-3 py-2 border border-black rounded-lg text-sm disabled:bg-white"
                  />
                  <input
                    type="text"
                    value={product.lot_number}
                    onChange={(e) => handleProductChange(index, 'lot_number', e.target.value)}
                    disabled={isLocked}
                    placeholder="Lot #"
                    className="w-28 px-3 py-2 border border-black rounded-lg text-sm disabled:bg-white"
                  />
                  {!isLocked && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="px-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {formData.products_used.length === 0 && (
                <p className="text-sm text-black py-2">No products added</p>
              )}
            </div>
          </div>
        </div>

        {/* Follow-up & Instructions */}
        <div className="bg-white rounded-xl border border-black shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-black mb-4">Follow-up & Instructions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={formData.follow_up_date}
                onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                disabled={isLocked}
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Adverse Reactions
              </label>
              <input
                type="text"
                value={formData.adverse_reactions}
                onChange={(e) => setFormData({ ...formData, adverse_reactions: e.target.value })}
                disabled={isLocked}
                placeholder="None observed"
                className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Patient Instructions
            </label>
            <textarea
              value={formData.patient_instructions}
              onChange={(e) => setFormData({ ...formData, patient_instructions: e.target.value })}
              disabled={isLocked}
              rows={2}
              placeholder="Post-treatment care instructions..."
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 disabled:bg-white"
            />
          </div>

          <label className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={formData.consent_obtained}
              onChange={(e) => setFormData({ ...formData, consent_obtained: e.target.checked })}
              disabled={isLocked}
              className="w-4 h-4 text-[#FF2D8E] rounded focus:ring-pink-500"
            />
            <span className="text-sm text-black">Informed consent obtained</span>
          </label>
        </div>

        {/* Actions */}
        {!isLocked && (
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2.5 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving || !formData.provider_id}
              className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Signing...' : 'Sign & Lock'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

export default function ChartingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full" />
      </div>
    }>
      <ChartingContent />
    </Suspense>
  );
}
