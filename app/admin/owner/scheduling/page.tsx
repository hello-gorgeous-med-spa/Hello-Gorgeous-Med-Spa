'use client';

// ============================================================
// SCHEDULING ENGINE - OWNER CONTROLLED
// Provider availability, buffers, capacity
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';

interface ProviderSchedule {
  provider_id: string;
  provider_name: string;
  schedule: { day: string; is_working: boolean; start: string; end: string }[];
  time_off: { id: string; start: string; end: string; reason: string }[];
}

export default function SchedulingEnginePage() {
  const [providers, setProviders] = useState<ProviderSchedule[]>([
    {
      provider_id: 'p1',
      provider_name: 'Ryan Kent',
      schedule: [
        { day: 'Monday', is_working: true, start: '09:00', end: '17:00' },
        { day: 'Tuesday', is_working: true, start: '09:00', end: '17:00' },
        { day: 'Wednesday', is_working: true, start: '09:00', end: '17:00' },
        { day: 'Thursday', is_working: true, start: '09:00', end: '19:00' },
        { day: 'Friday', is_working: true, start: '09:00', end: '17:00' },
        { day: 'Saturday', is_working: false, start: '', end: '' },
        { day: 'Sunday', is_working: false, start: '', end: '' },
      ],
      time_off: [],
    },
    {
      provider_id: 'p2',
      provider_name: 'Danielle Alcala',
      schedule: [
        { day: 'Monday', is_working: true, start: '10:00', end: '18:00' },
        { day: 'Tuesday', is_working: true, start: '10:00', end: '18:00' },
        { day: 'Wednesday', is_working: true, start: '10:00', end: '18:00' },
        { day: 'Thursday', is_working: true, start: '10:00', end: '20:00' },
        { day: 'Friday', is_working: true, start: '10:00', end: '18:00' },
        { day: 'Saturday', is_working: true, start: '10:00', end: '16:00' },
        { day: 'Sunday', is_working: false, start: '', end: '' },
      ],
      time_off: [],
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState(providers[0].provider_id);
  const [bookingWindow, setBookingWindow] = useState({ min_hours: 2, max_days: 60 });
  const [capacitySettings, setCapacitySettings] = useState({ allow_overbooking: false, max_daily_appointments: 20 });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const selectedProviderData = providers.find(p => p.provider_id === selectedProvider);

  const updateSchedule = (dayIndex: number, field: string, value: any) => {
    setProviders(prev => prev.map(p => {
      if (p.provider_id === selectedProvider) {
        const newSchedule = [...p.schedule];
        newSchedule[dayIndex] = { ...newSchedule[dayIndex], [field]: value };
        return { ...p, schedule: newSchedule };
      }
      return p;
    }));
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Scheduling settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Scheduling Engine" description="Provider availability and booking rules">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Provider Selector */}
        <div className="flex gap-3">
          {providers.map(p => (
            <button
              key={p.provider_id}
              onClick={() => setSelectedProvider(p.provider_id)}
              className={`px-4 py-2 rounded-lg border-2 ${
                selectedProvider === p.provider_id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.provider_name}
            </button>
          ))}
        </div>

        {/* Weekly Schedule */}
        {selectedProviderData && (
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Schedule - {selectedProviderData.provider_name}</h2>
            <div className="space-y-2">
              {selectedProviderData.schedule.map((day, idx) => (
                <div key={day.day} className={`flex items-center gap-4 p-3 rounded-lg ${day.is_working ? 'bg-gray-50' : 'bg-gray-100'}`}>
                  <div className="w-28">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={day.is_working}
                        onChange={(e) => updateSchedule(idx, 'is_working', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className={day.is_working ? 'font-medium' : 'text-gray-400'}>{day.day}</span>
                    </label>
                  </div>
                  {day.is_working ? (
                    <>
                      <input type="time" value={day.start} onChange={(e) => updateSchedule(idx, 'start', e.target.value)} className="px-3 py-2 border rounded" />
                      <span>to</span>
                      <input type="time" value={day.end} onChange={(e) => updateSchedule(idx, 'end', e.target.value)} className="px-3 py-2 border rounded" />
                    </>
                  ) : (
                    <span className="text-gray-400">Not working</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Window */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Booking Window</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Notice (hours)</label>
              <input
                type="number"
                value={bookingWindow.min_hours}
                onChange={(e) => setBookingWindow(prev => ({ ...prev, min_hours: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
              <p className="text-xs text-gray-500 mt-1">How far in advance clients must book</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Advance (days)</label>
              <input
                type="number"
                value={bookingWindow.max_days}
                onChange={(e) => setBookingWindow(prev => ({ ...prev, max_days: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">How far ahead clients can book</p>
            </div>
          </div>
        </div>

        {/* Capacity Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Capacity Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={capacitySettings.allow_overbooking}
                onChange={(e) => setCapacitySettings(prev => ({ ...prev, allow_overbooking: e.target.checked }))}
                className="w-5 h-5"
              />
              <div>
                <p className="font-medium">Allow Overbooking</p>
                <p className="text-sm text-gray-500">Permit bookings beyond capacity (requires manual approval)</p>
              </div>
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Daily Appointments per Provider</label>
              <input
                type="number"
                value={capacitySettings.max_daily_appointments}
                onChange={(e) => setCapacitySettings(prev => ({ ...prev, max_daily_appointments: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Save Scheduling Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
