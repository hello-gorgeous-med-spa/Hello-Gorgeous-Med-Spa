'use client';

// ============================================================
// SYSTEM SETTINGS - OWNER CONTROLLED
// Business settings + Global defaults with warning banners
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

export default function SystemSettingsPage() {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Business Section
  const [business, setBusiness] = useState({
    name: 'Hello Gorgeous Med Spa',
    locations: [{ id: '1', name: 'Main Location', address: '123 Main St, Chicago, IL 60601' }],
    timezone: 'America/Chicago',
    launchDate: '2024-01-15',
    legalDisclaimers: {
      booking: 'By booking, you agree to our cancellation policy.',
      consent: 'All treatments require signed consent forms.',
      payment: 'Payment is due at time of service.',
    },
  });

  // Global Defaults Section
  const [defaults, setDefaults] = useState({
    bufferBefore: 15,
    bufferAfter: 15,
    cancellationWindow: 24,
    noShowFee: 50,
    consentEnforcement: 'strict' as 'strict' | 'warn' | 'none',
    chartingRules: {
      requireSOAP: true,
      requireSignature: true,
      lockAfterSign: true,
      autoSaveInterval: 30,
    },
  });

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'System settings saved successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="System Settings" description="Business configuration and global defaults">
      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-red-500 text-xl">🛑</span>
          <p className="text-red-800 font-medium">Changes here affect the entire system.</p>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* BUSINESS SECTION */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-black">🏢 Business</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Business Name</label>
              <input
                type="text"
                value={business.name}
                onChange={(e) => setBusiness(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Locations</label>
              {business.locations.map(loc => (
                <div key={loc.id} className="flex items-center gap-3 p-3 bg-white rounded-lg mb-2">
                  <input
                    type="text"
                    value={loc.name}
                    className="flex-1 px-3 py-2 border rounded"
                    placeholder="Location name"
                  />
                  <input
                    type="text"
                    value={loc.address}
                    className="flex-2 px-3 py-2 border rounded"
                    placeholder="Address"
                  />
                </div>
              ))}
              <button className="text-sm text-pink-600 hover:text-pink-700">+ Add Location</button>
            </div>

            {/* Time Zone */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Time Zone</label>
              <select
                value={business.timezone}
                onChange={(e) => setBusiness(prev => ({ ...prev, timezone: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
              </select>
            </div>

            {/* Launch Date */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Launch Date</label>
              <input
                type="date"
                value={business.launchDate}
                onChange={(e) => setBusiness(prev => ({ ...prev, launchDate: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Legal Disclaimers */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Legal Disclaimers</label>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-black">Booking Disclaimer</span>
                  <textarea
                    value={business.legalDisclaimers.booking}
                    onChange={(e) => setBusiness(prev => ({ ...prev, legalDisclaimers: { ...prev.legalDisclaimers, booking: e.target.value }}))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <span className="text-xs text-black">Consent Disclaimer</span>
                  <textarea
                    value={business.legalDisclaimers.consent}
                    onChange={(e) => setBusiness(prev => ({ ...prev, legalDisclaimers: { ...prev.legalDisclaimers, consent: e.target.value }}))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div>
                  <span className="text-xs text-black">Payment Disclaimer</span>
                  <textarea
                    value={business.legalDisclaimers.payment}
                    onChange={(e) => setBusiness(prev => ({ ...prev, legalDisclaimers: { ...prev.legalDisclaimers, payment: e.target.value }}))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GLOBAL DEFAULTS SECTION */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-black">⚙️ Global Defaults</h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Buffers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Default Buffer Before (min)</label>
                <input
                  type="number"
                  value={defaults.bufferBefore}
                  onChange={(e) => setDefaults(prev => ({ ...prev, bufferBefore: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Default Buffer After (min)</label>
                <input
                  type="number"
                  value={defaults.bufferAfter}
                  onChange={(e) => setDefaults(prev => ({ ...prev, bufferAfter: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>

            {/* Cancellation & No-Show */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Default Cancellation Window (hours)</label>
                <input
                  type="number"
                  value={defaults.cancellationWindow}
                  onChange={(e) => setDefaults(prev => ({ ...prev, cancellationWindow: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Default No-Show Fee ($)</label>
                <input
                  type="number"
                  value={defaults.noShowFee}
                  onChange={(e) => setDefaults(prev => ({ ...prev, noShowFee: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border rounded-lg"
                  min="0"
                />
              </div>
            </div>

            {/* Consent Enforcement */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Default Consent Enforcement</label>
              <select
                value={defaults.consentEnforcement}
                onChange={(e) => setDefaults(prev => ({ ...prev, consentEnforcement: e.target.value as any }))}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="strict">Strict - Block booking/checkout without consent</option>
                <option value="warn">Warn - Allow with warning</option>
                <option value="none">None - No enforcement</option>
              </select>
            </div>

            {/* Charting Rules */}
            <div>
              <label className="block text-sm font-medium text-black mb-2">Default Charting Rules</label>
              <div className="space-y-2">
                {[
                  { key: 'requireSOAP', label: 'Require SOAP format' },
                  { key: 'requireSignature', label: 'Require provider signature' },
                  { key: 'lockAfterSign', label: 'Lock chart after signature' },
                ].map(item => (
                  <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white">
                    <input
                      type="checkbox"
                      checked={defaults.chartingRules[item.key as keyof typeof defaults.chartingRules] as boolean}
                      onChange={(e) => setDefaults(prev => ({ ...prev, chartingRules: { ...prev.chartingRules, [item.key]: e.target.checked }}))}
                      className="w-5 h-5 text-pink-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
                <div className="mt-2">
                  <label className="block text-sm text-black mb-1">Auto-save interval (seconds)</label>
                  <input
                    type="number"
                    value={defaults.chartingRules.autoSaveInterval}
                    onChange={(e) => setDefaults(prev => ({ ...prev, chartingRules: { ...prev.chartingRules, autoSaveInterval: parseInt(e.target.value) || 30 }}))}
                    className="w-32 px-3 py-2 border rounded-lg"
                    min="10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
