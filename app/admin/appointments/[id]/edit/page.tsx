'use client';

// ============================================================
// EDIT APPOINTMENT PAGE
// Modify appointment details
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditAppointmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [providers, setProviders] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    service_id: '',
    provider_id: '',
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointment
        const apptRes = await fetch('/api/appointments');
        const apptData = await apptRes.json();
        const apt = apptData.appointments?.find((a: any) => a.id === params.id);
        
        if (apt) {
          setAppointment(apt);
          setFormData({
            service_id: apt.service_id || '',
            provider_id: apt.provider_id || '',
            notes: apt.notes || '',
          });
        }

        // Fetch services
        const servRes = await fetch('/api/services');
        const servData = await servRes.json();
        setServices(servData.services || []);

        // Fetch providers
        const provRes = await fetch('/api/providers');
        const provData = await provRes.json();
        setProviders(provData.providers || []);

      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          service_id: formData.service_id,
          provider_id: formData.provider_id,
          notes: formData.notes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update');

      router.push(`/admin/appointments/${params.id}`);
    } catch (err) {
      console.error('Error saving:', err);
      alert('Failed to update appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#FF2D8E] border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-black">Appointment not found</p>
        <Link href="/admin/appointments" className="text-pink-600 hover:text-pink-700 mt-2 inline-block">
          ← Back to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/admin/appointments/${params.id}`}
          className="text-sm text-black hover:text-black mb-2 inline-block"
        >
          ← Back to Appointment
        </Link>
        <h1 className="text-2xl font-bold text-black">Edit Appointment</h1>
        <p className="text-black">Update appointment details for {appointment.client_name}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-black shadow-sm p-6 space-y-4">
        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Service</label>
          <select
            value={formData.service_id}
            onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
            className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select service...</option>
            {services.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name} - ${s.price_cents / 100}</option>
            ))}
          </select>
        </div>

        {/* Provider */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Provider</label>
          <select
            value={formData.provider_id}
            onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })}
            className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select provider...</option>
            {providers.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.first_name || p.firstName} {p.last_name || p.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Appointment notes..."
            className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href={`/admin/appointments/${params.id}`}
            className="px-6 py-2.5 text-black font-medium hover:bg-white rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
