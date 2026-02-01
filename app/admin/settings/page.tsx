'use client';

// ============================================================
// ADMIN SETTINGS PAGE
// System configuration
// ============================================================

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    tuesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    wednesday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    thursday: { open: '9:00 AM', close: '5:00 PM', enabled: true },
    friday: { open: '9:00 AM', close: '3:00 PM', enabled: true },
    saturday: { open: '10:00 AM', close: '2:00 PM', enabled: false },
    sunday: { open: '', close: '', enabled: false },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Configure your Hello Gorgeous OS</p>
      </div>

      {/* Business Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Business Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input
              type="text"
              defaultValue="Hello Gorgeous Med Spa"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              defaultValue="(630) 636-6193"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              defaultValue="74 W. Washington St, Oswego, IL 60543"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              defaultValue="hello@hellogorgeousmedspa.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              <option>America/Chicago (Central)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Business Hours</h2>
        <div className="space-y-3">
          {Object.entries(businessHours).map(([day, hours]) => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-700 capitalize">{day}</div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hours.enabled}
                  className="w-4 h-4 text-pink-500 border-gray-300 rounded"
                />
              </label>
              {hours.enabled ? (
                <>
                  <input
                    type="text"
                    value={hours.open}
                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="text"
                    value={hours.close}
                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  />
                </>
              ) : (
                <span className="text-gray-500 text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Booking Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Online Booking</p>
              <p className="text-sm text-gray-500">Allow clients to book online</p>
            </div>
            <button className="w-12 h-6 bg-green-500 rounded-full relative">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Require Deposit</p>
              <p className="text-sm text-gray-500">Collect deposit for certain services</p>
            </div>
            <button className="w-12 h-6 bg-gray-300 rounded-full relative">
              <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Send Reminders</p>
              <p className="text-sm text-gray-500">Automatic appointment reminders</p>
            </div>
            <button className="w-12 h-6 bg-green-500 rounded-full relative">
              <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Integrations</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-medium text-gray-900">Stripe</p>
                <p className="text-sm text-gray-500">Payment processing</p>
              </div>
            </div>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 inline-block"
            >
              Connect
            </a>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-medium text-gray-900">Brevo</p>
                <p className="text-sm text-gray-500">Email marketing</p>
              </div>
            </div>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">Connected</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="px-6 py-2.5 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600"
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
