'use client';

// ============================================================
// FEATURE FLAGS & KILL SWITCHES - OWNER CONTROLLED
// Enable/disable features instantly without deploy
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  is_critical: boolean;
  last_changed?: string;
  changed_by?: string;
}

export default function FeatureFlagsPage() {
  const [features, setFeatures] = useState<FeatureFlag[]>([
    // Booking
    { id: 'online_booking', name: 'Online Booking', description: 'Allow clients to book appointments online', category: 'Booking', is_enabled: true, is_critical: true },
    { id: 'same_day_booking', name: 'Same-Day Booking', description: 'Allow appointments to be booked for today', category: 'Booking', is_enabled: true, is_critical: false },
    { id: 'waitlist', name: 'Waitlist', description: 'Enable waitlist for fully booked slots', category: 'Booking', is_enabled: true, is_critical: false },
    
    // Payments
    { id: 'online_payments', name: 'Online Payments', description: 'Accept payments via Stripe', category: 'Payments', is_enabled: true, is_critical: true },
    { id: 'deposits', name: 'Deposit Collection', description: 'Require deposits for bookings', category: 'Payments', is_enabled: true, is_critical: false },
    { id: 'memberships', name: 'Membership Billing', description: 'Recurring membership payments', category: 'Payments', is_enabled: true, is_critical: false },
    { id: 'gift_cards', name: 'Gift Cards', description: 'Sell and redeem gift cards', category: 'Payments', is_enabled: true, is_critical: false },
    
    // Communications
    { id: 'sms_notifications', name: 'SMS Notifications', description: 'Send SMS reminders and updates', category: 'Communications', is_enabled: true, is_critical: true },
    { id: 'email_notifications', name: 'Email Notifications', description: 'Send email confirmations', category: 'Communications', is_enabled: true, is_critical: false },
    { id: 'review_requests', name: 'Review Requests', description: 'Auto-request reviews after visits', category: 'Communications', is_enabled: true, is_critical: false },
    { id: 'marketing_sms', name: 'Marketing SMS', description: 'Send promotional SMS campaigns', category: 'Communications', is_enabled: true, is_critical: false },
    
    // Clinical
    { id: 'charting', name: 'Clinical Charting', description: 'SOAP notes and clinical documentation', category: 'Clinical', is_enabled: true, is_critical: true },
    { id: 'photo_capture', name: 'Before/After Photos', description: 'Capture and store clinical photos', category: 'Clinical', is_enabled: true, is_critical: false },
    { id: 'consent_collection', name: 'Digital Consents', description: 'Collect digital signatures', category: 'Clinical', is_enabled: true, is_critical: true },
    { id: 'lot_tracking', name: 'Lot Tracking', description: 'Track product lot numbers', category: 'Clinical', is_enabled: true, is_critical: false },
    
    // Client Portal
    { id: 'client_portal', name: 'Client Portal', description: 'Client self-service portal', category: 'Client Portal', is_enabled: true, is_critical: false },
    { id: 'self_booking', name: 'Self-Rescheduling', description: 'Clients can reschedule themselves', category: 'Client Portal', is_enabled: true, is_critical: false },
    { id: 'document_access', name: 'Document Access', description: 'Clients can view their documents', category: 'Client Portal', is_enabled: true, is_critical: false },
    
    // Admin
    { id: 'reporting', name: 'Advanced Reporting', description: 'Financial and operational reports', category: 'Admin', is_enabled: true, is_critical: false },
    { id: 'audit_logging', name: 'Audit Logging', description: 'Log all system actions', category: 'Admin', is_enabled: true, is_critical: true },
    { id: 'sandbox_mode', name: 'Sandbox Mode', description: 'Test features without affecting production', category: 'Admin', is_enabled: true, is_critical: false },
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmDisable, setConfirmDisable] = useState<string | null>(null);

  const toggleFeature = (id: string) => {
    const feature = features.find(f => f.id === id);
    
    if (feature?.is_critical && feature.is_enabled) {
      setConfirmDisable(id);
      return;
    }
    
    executeToggle(id);
  };

  const executeToggle = (id: string) => {
    setFeatures(prev => prev.map(f => f.id === id ? {
      ...f,
      is_enabled: !f.is_enabled,
      last_changed: new Date().toISOString(),
      changed_by: 'Danielle (Owner)',
    } : f));
    
    const feature = features.find(f => f.id === id);
    setMessage({
      type: 'success',
      text: `${feature?.name} ${feature?.is_enabled ? 'disabled' : 'enabled'} successfully`,
    });
    setConfirmDisable(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const categories = [...new Set(features.map(f => f.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Feature Flags</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Flags & Kill Switches</h1>
          <p className="text-gray-500">Enable or disable features instantly • No deploy required</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDisable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-bold text-red-700 mb-2">⚠️ Critical Feature Warning</h2>
            <p className="text-gray-600 mb-4">
              You are about to disable a critical system feature. This may significantly impact operations.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Feature: <strong>{features.find(f => f.id === confirmDisable)?.name}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDisable(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button onClick={() => executeToggle(confirmDisable)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Disable Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Total Features</p>
          <p className="text-2xl font-bold text-gray-900">{features.length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Enabled</p>
          <p className="text-2xl font-bold text-green-600">{features.filter(f => f.is_enabled).length}</p>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-sm text-gray-500">Disabled</p>
          <p className="text-2xl font-bold text-red-600">{features.filter(f => !f.is_enabled).length}</p>
        </div>
      </div>

      {/* Features by Category */}
      {categories.map(category => (
        <div key={category} className="bg-white rounded-xl border overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-900">{category}</h2>
          </div>
          <div className="divide-y">
            {features.filter(f => f.category === category).map(feature => (
              <div key={feature.id} className={`p-4 flex items-center justify-between ${!feature.is_enabled ? 'bg-gray-50' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-medium ${feature.is_enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                      {feature.name}
                    </h3>
                    {feature.is_critical && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Critical</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                  {feature.last_changed && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last changed: {new Date(feature.last_changed).toLocaleString()} by {feature.changed_by}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleFeature(feature.id)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${feature.is_enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow ${feature.is_enabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Emergency Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">🚨 Emergency Shutdown</h2>
        <p className="text-sm text-red-600 mb-4">
          Use only in emergencies. These actions will immediately affect all users.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setFeatures(prev => prev.map(f => f.id === 'online_booking' ? { ...f, is_enabled: false, last_changed: new Date().toISOString(), changed_by: 'Danielle (Owner)' } : f));
              setMessage({ type: 'success', text: 'Online booking disabled!' });
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Stop All Bookings
          </button>
          <button
            onClick={() => {
              setFeatures(prev => prev.map(f => f.id === 'online_payments' ? { ...f, is_enabled: false, last_changed: new Date().toISOString(), changed_by: 'Danielle (Owner)' } : f));
              setMessage({ type: 'success', text: 'Online payments disabled!' });
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Stop All Payments
          </button>
          <button
            onClick={() => {
              setFeatures(prev => prev.map(f => f.id === 'sms_notifications' ? { ...f, is_enabled: false, last_changed: new Date().toISOString(), changed_by: 'Danielle (Owner)' } : f));
              setMessage({ type: 'success', text: 'SMS notifications disabled!' });
            }}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Stop All SMS
          </button>
        </div>
      </div>
    </div>
  );
}
