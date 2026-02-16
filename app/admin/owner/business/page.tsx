'use client';

// ============================================================
// BUSINESS & CLINIC SETTINGS - OWNER CONTROLLED
// Name, locations, hours, closures, legal
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  is_primary: boolean;
  is_active: boolean;
}

interface BusinessHours {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  is_closed: boolean;
}

export default function BusinessSettingsPage() {
  const [businessName, setBusinessName] = useState('Hello Gorgeous Med Spa');
  const [timezone, setTimezone] = useState('America/Chicago');
  const [launchDate, setLaunchDate] = useState('2024-01-01');
  const [legalDisclaimer, setLegalDisclaimer] = useState('Hello Gorgeous Med Spa provides aesthetic treatments. Results may vary. All services are performed by licensed professionals.');
  
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 'loc-1',
      name: 'Main Location',
      address: '123 Main Street',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      phone: '(312) 555-0100',
      email: 'info@hellogorgeousmedspa.com',
      is_primary: true,
      is_active: true,
    },
  ]);

  const [hours, setHours] = useState<BusinessHours[]>([
    { day: 'Monday', is_open: true, open_time: '09:00', close_time: '18:00' },
    { day: 'Tuesday', is_open: true, open_time: '09:00', close_time: '18:00' },
    { day: 'Wednesday', is_open: true, open_time: '09:00', close_time: '18:00' },
    { day: 'Thursday', is_open: true, open_time: '09:00', close_time: '20:00' },
    { day: 'Friday', is_open: true, open_time: '09:00', close_time: '18:00' },
    { day: 'Saturday', is_open: true, open_time: '10:00', close_time: '16:00' },
    { day: 'Sunday', is_open: false, open_time: '', close_time: '' },
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: 'h1', name: 'New Year\'s Day', date: '2024-01-01', is_closed: true },
    { id: 'h2', name: 'Memorial Day', date: '2024-05-27', is_closed: true },
    { id: 'h3', name: 'Independence Day', date: '2024-07-04', is_closed: true },
    { id: 'h4', name: 'Labor Day', date: '2024-09-02', is_closed: true },
    { id: 'h5', name: 'Thanksgiving', date: '2024-11-28', is_closed: true },
    { id: 'h6', name: 'Christmas Day', date: '2024-12-25', is_closed: true },
  ]);

  const [defaultBuffer, setDefaultBuffer] = useState(15);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Business settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateHours = (index: number, field: string, value: any) => {
    setHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  const addHoliday = () => {
    const newHoliday: Holiday = {
      id: `h-${Date.now()}`,
      name: '',
      date: '',
      is_closed: true,
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  const updateHoliday = (id: string, field: string, value: any) => {
    setHolidays(prev => prev.map(h => h.id === id ? { ...h, [field]: value } : h));
  };

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Business Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-black">Business & Clinic Settings</h1>
          <p className="text-black">Configure your business identity and operations</p>
        </div>
        <button onClick={saveSettings} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
          Save All Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-black">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Time Zone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">System Launch Date</label>
            <input
              type="date"
              value={launchDate}
              onChange={(e) => setLaunchDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Default Buffer (minutes)</label>
            <input
              type="number"
              value={defaultBuffer}
              onChange={(e) => setDefaultBuffer(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border rounded-lg"
              min="0"
              max="60"
            />
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-black">Legal Disclaimer</h2>
          <p className="text-sm text-black">Displayed on booking confirmations and client portal</p>
          
          <textarea
            value={legalDisclaimer}
            onChange={(e) => setLegalDisclaimer(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg h-40"
            placeholder="Enter your legal disclaimer..."
          />
        </div>
      </div>

      {/* Locations */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Locations</h2>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Multi-location ready</span>
        </div>

        <div className="space-y-4">
          {locations.map(loc => (
            <div key={loc.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Location Name</label>
                    <input
                      type="text"
                      value={loc.name}
                      onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, name: e.target.value } : l))}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Phone</label>
                    <input
                      type="text"
                      value={loc.phone}
                      onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, phone: e.target.value } : l))}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-black mb-1">Address</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, address: e.target.value } : l))}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">City</label>
                    <input
                      type="text"
                      value={loc.city}
                      onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, city: e.target.value } : l))}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">State</label>
                      <input
                        type="text"
                        value={loc.state}
                        onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, state: e.target.value } : l))}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black mb-1">ZIP</label>
                      <input
                        type="text"
                        value={loc.zip}
                        onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, zip: e.target.value } : l))}
                        className="w-full px-3 py-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  {loc.is_primary && (
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">Primary</span>
                  )}
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={loc.is_active}
                      onChange={(e) => setLocations(prev => prev.map(l => l.id === loc.id ? { ...l, is_active: e.target.checked } : l))}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-black mb-4">Business Hours</h2>
        
        <div className="space-y-3">
          {hours.map((h, idx) => (
            <div key={h.day} className="flex items-center gap-4 p-3 bg-white rounded-lg">
              <div className="w-28">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={h.is_open}
                    onChange={(e) => updateHours(idx, 'is_open', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={`font-medium ${h.is_open ? 'text-black' : 'text-black'}`}>{h.day}</span>
                </label>
              </div>
              {h.is_open ? (
                <>
                  <input
                    type="time"
                    value={h.open_time}
                    onChange={(e) => updateHours(idx, 'open_time', e.target.value)}
                    className="px-3 py-2 border rounded"
                  />
                  <span className="text-black">to</span>
                  <input
                    type="time"
                    value={h.close_time}
                    onChange={(e) => updateHours(idx, 'close_time', e.target.value)}
                    className="px-3 py-2 border rounded"
                  />
                </>
              ) : (
                <span className="text-black">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Holidays */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">Holidays & Closures</h2>
          <button onClick={addHoliday} className="text-sm text-pink-600 hover:text-pink-700">
            + Add Holiday
          </button>
        </div>
        
        <div className="space-y-2">
          {holidays.map(h => (
            <div key={h.id} className="flex items-center gap-4 p-3 bg-white rounded-lg">
              <input
                type="text"
                value={h.name}
                onChange={(e) => updateHoliday(h.id, 'name', e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="Holiday name"
              />
              <input
                type="date"
                value={h.date}
                onChange={(e) => updateHoliday(h.id, 'date', e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={h.is_closed}
                  onChange={(e) => updateHoliday(h.id, 'is_closed', e.target.checked)}
                />
                Closed
              </label>
              <button onClick={() => removeHoliday(h.id)} className="text-red-500 hover:text-red-700">
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
