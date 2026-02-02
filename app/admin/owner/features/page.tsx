'use client';

// ============================================================
// FEATURE FLAGS - SAFETY PANEL
// Toggle features ON/OFF with environment selector
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  status: boolean;
  environment: 'live' | 'sandbox' | 'both';
  isCritical: boolean;
}

export default function FeatureFlagsPage() {
  const [features, setFeatures] = useState<Feature[]>([
    { id: 'online_booking', name: 'Online Booking', description: 'Allow clients to book appointments online', category: 'Booking', status: true, environment: 'both', isCritical: true },
    { id: 'payments', name: 'Payment Processing', description: 'Process credit card payments via Stripe', category: 'Payments', status: true, environment: 'live', isCritical: true },
    { id: 'sms_reminders', name: 'SMS Reminders', description: 'Send appointment reminders via text', category: 'Communications', status: true, environment: 'both', isCritical: false },
    { id: 'email_notifications', name: 'Email Notifications', description: 'Send email confirmations and receipts', category: 'Communications', status: true, environment: 'both', isCritical: false },
    { id: 'review_requests', name: 'Review Requests', description: 'Automatically request reviews after visits', category: 'Marketing', status: true, environment: 'both', isCritical: false },
    { id: 'charting', name: 'Clinical Charting', description: 'SOAP notes and clinical documentation', category: 'Clinical', status: true, environment: 'both', isCritical: true },
    { id: 'client_portal', name: 'Client Portal', description: 'Allow clients to view their history', category: 'Client', status: true, environment: 'both', isCritical: false },
    { id: 'memberships', name: 'Membership Billing', description: 'Recurring membership payments', category: 'Payments', status: true, environment: 'live', isCritical: false },
    { id: 'gift_cards', name: 'Gift Cards', description: 'Sell and redeem gift cards', category: 'Payments', status: true, environment: 'both', isCritical: false },
    { id: 'inventory_tracking', name: 'Inventory Tracking', description: 'Track product lots and expiration', category: 'Clinical', status: true, environment: 'both', isCritical: false },
    { id: 'photo_capture', name: 'Before/After Photos', description: 'Capture treatment photos', category: 'Clinical', status: true, environment: 'both', isCritical: false },
    { id: 'waitlist', name: 'Waitlist', description: 'Allow clients to join waitlist', category: 'Booking', status: false, environment: 'both', isCritical: false },
    { id: 'telehealth', name: 'Telehealth', description: 'Video consultations', category: 'Clinical', status: false, environment: 'sandbox', isCritical: false },
    { id: 'marketing_sms', name: 'Marketing SMS', description: 'Promotional text campaigns', category: 'Marketing', status: true, environment: 'both', isCritical: false },
  ]);

  const [showConfirm, setShowConfirm] = useState<{ feature: Feature; action: boolean } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', ...new Set(features.map(f => f.category))];
  const filteredFeatures = filterCategory === 'all' ? features : features.filter(f => f.category === filterCategory);

  const toggleFeature = (feature: Feature) => {
    if (feature.isCritical && feature.status) {
      setShowConfirm({ feature, action: false });
    } else {
      confirmToggle(feature.id, !feature.status);
    }
  };

  const confirmToggle = (featureId: string, newStatus: boolean) => {
    setFeatures(prev => prev.map(f => f.id === featureId ? { ...f, status: newStatus } : f));
    const feature = features.find(f => f.id === featureId);
    setMessage({ type: 'success', text: `${feature?.name} has been ${newStatus ? 'enabled' : 'disabled'}` });
    setShowConfirm(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const changeEnvironment = (featureId: string, env: 'live' | 'sandbox' | 'both') => {
    setFeatures(prev => prev.map(f => f.id === featureId ? { ...f, environment: env } : f));
  };

  return (
    <OwnerLayout title="Feature Flags" description="Safety panel - Toggle features ON/OFF">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 text-xl">⚠️</span>
          <p className="text-amber-800 font-medium">Disabling features may affect active users.</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === cat 
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' 
                : 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-200'
            }`}
          >
            {cat === 'all' ? 'All Features' : cat}
          </button>
        ))}
      </div>

      {/* Feature List */}
      <div className="bg-white rounded-xl border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">FEATURE</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">DESCRIPTION</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">ENVIRONMENT</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredFeatures.map(feature => (
              <tr key={feature.id} className={`hover:bg-gray-50 ${!feature.status ? 'bg-gray-50' : ''}`}>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {feature.isCritical && <span className="text-red-500" title="Critical Feature">🔴</span>}
                    <span className="font-medium text-sm">{feature.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">{feature.description}</td>
                <td className="px-4 py-4">
                  <select
                    value={feature.environment}
                    onChange={(e) => changeEnvironment(feature.id, e.target.value as any)}
                    className="px-3 py-1.5 border rounded text-sm"
                  >
                    <option value="live">Live Only</option>
                    <option value="sandbox">Sandbox Only</option>
                    <option value="both">Both</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => toggleFeature(feature)}
                    className={`w-14 h-7 rounded-full transition-colors relative ${feature.status ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${feature.status ? 'right-1' : 'left-1'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Enabled Features</p>
          <p className="text-2xl font-bold text-green-600">{features.filter(f => f.status).length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Disabled Features</p>
          <p className="text-2xl font-bold text-gray-400">{features.filter(f => !f.status).length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Critical Features</p>
          <p className="text-2xl font-bold text-red-600">{features.filter(f => f.isCritical && f.status).length}</p>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛑</span>
              <h3 className="text-lg font-semibold text-red-600">Disable Critical Feature?</h3>
            </div>
            <p className="text-gray-600 mb-2">
              You are about to disable <strong>{showConfirm.feature.name}</strong>.
            </p>
            <p className="text-red-600 text-sm mb-4">
              This is a critical feature and disabling it may affect active users and system functionality.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowConfirm(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button
                onClick={() => confirmToggle(showConfirm.feature.id, false)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Yes, Disable Feature
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
