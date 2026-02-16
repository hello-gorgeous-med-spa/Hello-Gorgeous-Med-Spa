'use client';

// ============================================================
// RESCHEDULE APPOINTMENT PAGE
// Change appointment date/time
// ============================================================

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TIME_SLOTS = [
  '9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM',
  '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
  '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
  '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
  '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM',
  '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM',
  '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM',
  '4:00 PM', '4:15 PM', '4:30 PM', '4:45 PM',
];

export default function RescheduleAppointmentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState<any>(null);

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notify_client: true,
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        const apt = data.appointments?.find((a: any) => a.id === params.id);
        
        if (apt) {
          setAppointment(apt);
          const apptDate = new Date(apt.starts_at);
          setFormData({
            date: apptDate.toISOString().split('T')[0],
            time: apptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            notify_client: true,
          });
        }
      } catch (err) {
        console.error('Error loading appointment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse time to create ISO datetime
      const [time, period] = formData.time.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (period === 'PM' && hour !== 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
      
      const newDateTime = new Date(formData.date);
      newDateTime.setHours(hour, parseInt(minutes), 0, 0);

      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: params.id,
          starts_at: newDateTime.toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Failed to reschedule');

      alert('Appointment rescheduled successfully!');
      router.push(`/admin/appointments/${params.id}`);
    } catch (err) {
      console.error('Error rescheduling:', err);
      alert('Failed to reschedule appointment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto" />
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

  const originalDate = new Date(appointment.starts_at);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/admin/appointments/${params.id}`}
          className="text-sm text-black hover:text-black mb-2 inline-block"
        >
          ← Back to Appointment
        </Link>
        <h1 className="text-2xl font-bold text-black">Reschedule Appointment</h1>
        <p className="text-black">Change date/time for {appointment.client_name}</p>
      </div>

      {/* Current Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Current:</strong> {originalDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {originalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>
        <p className="text-sm text-amber-700 mt-1">
          {appointment.service_name} with {appointment.provider_name}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-black shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* New Date */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">New Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          {/* New Time */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">New Time</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Select time...</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notify Client */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.notify_client}
            onChange={(e) => setFormData({ ...formData, notify_client: e.target.checked })}
            className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
          />
          <span className="text-sm text-black">Send notification to client about the change</span>
        </label>

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
            disabled={saving || !formData.date || !formData.time}
            className="px-6 py-2.5 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Rescheduling...' : 'Confirm Reschedule'}
          </button>
        </div>
      </form>
    </div>
  );
}
