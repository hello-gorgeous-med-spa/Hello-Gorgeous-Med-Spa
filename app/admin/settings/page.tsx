'use client';

// ============================================================
// ADMIN SETTINGS PAGE
// Fully functional - saves to database
// ============================================================

import { useState, useEffect } from 'react';
import { SITE } from '@/lib/seo';

interface BusinessSettings {
  business_name: string;
  phone: string;
  email: string;
  address: string;
  timezone: string;
  online_booking_enabled: boolean;
  require_deposit: boolean;
  send_reminders: boolean;
  cancellation_hours: number;
  cancellation_fee_percent: number;
}

interface BusinessHours {
  [day: string]: { open: string; close: string; enabled: boolean };
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState<BusinessSettings>({
    business_name: 'Hello Gorgeous Med Spa',
    phone: '(630) 636-6193',
    email: SITE.email,
    address: '74 W. Washington St, Oswego, IL 60543',
    timezone: 'America/Chicago',
    online_booking_enabled: true,
    require_deposit: false,
    send_reminders: true,
    cancellation_hours: 24,
    cancellation_fee_percent: 50,
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    friday: { open: '9:00 AM', close: '3:00 PM', enabled: true },
    saturday: { open: '10:00 AM', close: '2:00 PM', enabled: false },
    sunday: { open: '', close: '', enabled: false },
  });

  // Load settings from API
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }));
        }
        if (data.businessHours) {
          setBusinessHours(prev => ({ ...prev, ...data.businessHours }));
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, businessHours }),
      });
      
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        alert('Error saving: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateHours = (day: string, field: 'open' | 'close' | 'enabled', value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Settings</h1>
          <p className="text-black">Configure your Hello Gorgeous OS</p>
        </div>
        {saved && (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
            ✓ Settings Saved!
          </span>
        )}
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Business Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Business Name</label>
            <input
              type="text"
              value={settings.business_name}
              onChange={(e) => setSettings({...settings, business_name: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({...settings, address: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Timezone</label>
            <select 
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="America/Chicago">America/Chicago (Central)</option>
              <option value="America/New_York">America/New_York (Eastern)</option>
              <option value="America/Denver">America/Denver (Mountain)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (Pacific)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Business Hours</h2>
        <div className="space-y-3">
          {Object.entries(businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-black capitalize">{day}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hours.enabled}
                  onChange={(e) => updateHours(day, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-pink-500 border-black rounded focus:ring-pink-500"
                />
              </label>
              {hours.enabled ? (
                <>
                  <input
                    type="text"
                    value={hours.open}
                    onChange={(e) => updateHours(day, 'open', e.target.value)}
                    placeholder="9:00 AM"
                    className="w-28 px-3 py-1.5 border border-black rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                  />
                  <span className="text-black">to</span>
                  <input
                    type="text"
                    value={hours.close}
                    onChange={(e) => updateHours(day, 'close', e.target.value)}
                    placeholder="5:00 PM"
                    className="w-28 px-3 py-1.5 border border-black rounded-lg text-sm focus:ring-2 focus:ring-pink-500"
                  />
                </>
              ) : (
                <span className="text-black text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Booking Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Online Booking</p>
              <p className="text-sm text-black">Allow clients to book online</p>
            </div>
            <button 
              type="button"
              onClick={() => setSettings({...settings, online_booking_enabled: !settings.online_booking_enabled})}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.online_booking_enabled ? 'bg-green-500' : 'bg-white'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.online_booking_enabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Require Deposit</p>
              <p className="text-sm text-black">Collect deposit for certain services</p>
            </div>
            <button 
              type="button"
              onClick={() => setSettings({...settings, require_deposit: !settings.require_deposit})}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.require_deposit ? 'bg-green-500' : 'bg-white'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.require_deposit ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-black">Send Reminders</p>
              <p className="text-sm text-black">Automatic appointment reminders</p>
            </div>
            <button 
              type="button"
              onClick={() => setSettings({...settings, send_reminders: !settings.send_reminders})}
              className={`w-12 h-6 rounded-full relative transition-colors ${settings.send_reminders ? 'bg-green-500' : 'bg-white'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.send_reminders ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Cancellation Policy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Free Cancellation Window</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.cancellation_hours}
                onChange={(e) => setSettings({...settings, cancellation_hours: parseInt(e.target.value) || 24})}
                className="w-20 px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <span className="text-black">hours before appointment</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Late Cancellation Fee</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.cancellation_fee_percent}
                onChange={(e) => setSettings({...settings, cancellation_fee_percent: parseInt(e.target.value) || 50})}
                className="w-20 px-3 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
              />
              <span className="text-black">% of service price</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-black shadow-sm p-6">
        <h2 className="font-semibold text-black mb-4">Integrations</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-black rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-medium text-black">Stripe</p>
                <p className="text-sm text-black">Payment processing</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-black rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-medium text-black">Telnyx SMS</p>
                <p className="text-sm text-black">Text messaging</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 border border-black rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🗄️</span>
              <div>
                <p className="font-medium text-black">Supabase</p>
                <p className="text-sm text-black">Database & Auth</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">Connected</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
