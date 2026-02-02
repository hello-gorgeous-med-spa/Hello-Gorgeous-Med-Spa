'use client';

// ============================================================
// SYSTEM SETTINGS - OWNER CONTROLLED
// Global business configuration
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

export default function SystemSettingsPage() {
  const [businessName, setBusinessName] = useState('Hello Gorgeous Med Spa');
  const [timezone, setTimezone] = useState('America/Chicago');
  const [currency, setCurrency] = useState('USD');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [defaultBuffer, setDefaultBuffer] = useState(15);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [locations, setLocations] = useState([
    { id: '1', name: 'Main Location', address: '123 Main St', city: 'Chicago', state: 'IL', zip: '60601', phone: '(312) 555-0100', is_primary: true, is_active: true },
  ]);

  const [hours, setHours] = useState([
    { day: 'Monday', is_open: true, open: '09:00', close: '18:00' },
    { day: 'Tuesday', is_open: true, open: '09:00', close: '18:00' },
    { day: 'Wednesday', is_open: true, open: '09:00', close: '18:00' },
    { day: 'Thursday', is_open: true, open: '09:00', close: '20:00' },
    { day: 'Friday', is_open: true, open: '09:00', close: '18:00' },
    { day: 'Saturday', is_open: true, open: '10:00', close: '16:00' },
    { day: 'Sunday', is_open: false, open: '', close: '' },
  ]);

  const [holidays, setHolidays] = useState([
    { id: '1', name: "New Year's Day", date: '2025-01-01', is_closed: true },
    { id: '2', name: 'Memorial Day', date: '2025-05-26', is_closed: true },
    { id: '3', name: 'Independence Day', date: '2025-07-04', is_closed: true },
    { id: '4', name: 'Labor Day', date: '2025-09-01', is_closed: true },
    { id: '5', name: 'Thanksgiving', date: '2025-11-27', is_closed: true },
    { id: '6', name: 'Christmas', date: '2025-12-25', is_closed: true },
  ]);

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'System settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="System Settings" description="Global business configuration">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Settings */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
              <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option value="12h">12-hour (1:00 PM)</option>
                <option value="24h">24-hour (13:00)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Buffer (min)</label>
              <input
                type="number"
                value={defaultBuffer}
                onChange={(e) => setDefaultBuffer(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Locations</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Multi-location Ready</span>
          </div>
          {locations.map(loc => (
            <div key={loc.id} className="p-4 border rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Location Name</label>
                  <input type="text" value={loc.name} className="w-full px-3 py-2 border rounded text-sm" readOnly />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Address</label>
                  <input type="text" value={loc.address} className="w-full px-3 py-2 border rounded text-sm" readOnly />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phone</label>
                  <input type="text" value={loc.phone} className="w-full px-3 py-2 border rounded text-sm" readOnly />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
          <div className="space-y-2">
            {hours.map((h, idx) => (
              <div key={h.day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-28">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.is_open}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[idx].is_open = e.target.checked;
                        setHours(newHours);
                      }}
                      className="w-4 h-4"
                    />
                    <span className={h.is_open ? 'text-gray-900' : 'text-gray-400'}>{h.day}</span>
                  </label>
                </div>
                {h.is_open ? (
                  <>
                    <input type="time" value={h.open} onChange={(e) => { const n = [...hours]; n[idx].open = e.target.value; setHours(n); }} className="px-3 py-2 border rounded" />
                    <span>to</span>
                    <input type="time" value={h.close} onChange={(e) => { const n = [...hours]; n[idx].close = e.target.value; setHours(n); }} className="px-3 py-2 border rounded" />
                  </>
                ) : (
                  <span className="text-gray-400">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Holidays */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Holidays & Closures</h2>
            <button className="text-sm text-purple-600 hover:text-purple-700">+ Add Holiday</button>
          </div>
          <div className="space-y-2">
            {holidays.map(h => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span>{h.name}</span>
                  <span className="text-sm text-gray-500">{h.date}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${h.is_closed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {h.is_closed ? 'Closed' : 'Open'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
            Save All Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
