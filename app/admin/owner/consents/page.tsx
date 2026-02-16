'use client';

// ============================================================
// CONSENTS & LEGAL - OWNER CONTROLLED
// Consent forms, versioning, enforcement
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface ConsentForm {
  id: string;
  name: string;
  category: string;
  version: number;
  expires_days: number;
  requires_signature: boolean;
  is_active: boolean;
  services_required: string[];
}

export default function ConsentsPage() {
  const [forms, setForms] = useState<ConsentForm[]>([
    { id: '1', name: 'HIPAA Acknowledgment', category: 'Compliance', version: 3, expires_days: 365, requires_signature: true, is_active: true, services_required: ['all'] },
    { id: '2', name: 'Financial Policy', category: 'Compliance', version: 2, expires_days: 365, requires_signature: true, is_active: true, services_required: ['all'] },
    { id: '3', name: 'Neurotoxin Consent', category: 'Treatment', version: 4, expires_days: 365, requires_signature: true, is_active: true, services_required: ['Injectables'] },
    { id: '4', name: 'Dermal Filler Consent', category: 'Treatment', version: 3, expires_days: 365, requires_signature: true, is_active: true, services_required: ['Dermal Fillers'] },
    { id: '5', name: 'Photo Release', category: 'Marketing', version: 1, expires_days: 0, requires_signature: true, is_active: true, services_required: [] },
  ]);

  const [editingForm, setEditingForm] = useState<ConsentForm | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [enforcementRules, setEnforcementRules] = useState({
    block_booking_without_consent: true,
    block_checkout_without_consent: true,
    send_reminder_days_before_expiry: 14,
    allow_override_with_note: false,
  });

  const toggleActive = (id: string) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f));
  };

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Consent settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <OwnerLayout title="Consents & Legal" description="Manage consent forms and enforcement rules">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Consent Forms */}
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Consent Forms</h2>
            <button className="px-4 py-2 bg-[#FF2D8E] text-white rounded-lg text-sm hover:bg-black">
              + Create Form
            </button>
          </div>
          <div className="divide-y">
            {forms.map(form => (
              <div key={form.id} className={`p-4 ${!form.is_active ? 'bg-white opacity-75' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{form.name}</h3>
                      <span className="text-xs bg-white px-2 py-0.5 rounded">v{form.version}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{form.category}</span>
                    </div>
                    <p className="text-sm text-black mt-1">
                      {form.expires_days > 0 ? `Expires: ${form.expires_days} days` : 'No expiration'}
                      {form.requires_signature && ' • Signature required'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm text-black hover:text-black">Edit</button>
                    <button
                      onClick={() => toggleActive(form.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${form.is_active ? 'bg-green-500' : 'bg-white'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${form.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enforcement Rules */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-semibold mb-4">Enforcement Rules</h2>
          <div className="space-y-4">
            {[
              { key: 'block_booking_without_consent', label: 'Block booking if required consent is missing/expired' },
              { key: 'block_checkout_without_consent', label: 'Block checkout if required consent is missing/expired' },
              { key: 'allow_override_with_note', label: 'Allow staff to override with documented reason' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white">
                <input
                  type="checkbox"
                  checked={enforcementRules[item.key as keyof typeof enforcementRules] as boolean}
                  onChange={(e) => setEnforcementRules(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  className="w-5 h-5 text-pink-600"
                />
                <span>{item.label}</span>
              </label>
            ))}
            <div>
              <label className="block text-sm font-medium text-black mb-1">Send Reminder Before Expiry (days)</label>
              <input
                type="number"
                value={enforcementRules.send_reminder_days_before_expiry}
                onChange={(e) => setEnforcementRules(prev => ({ ...prev, send_reminder_days_before_expiry: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Versioning Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-medium text-blue-800">Version Control</h3>
          <p className="text-sm text-blue-600 mt-1">
            All consent form changes create a new version. Previous versions are preserved for legal compliance.
            Clients who signed an older version can be prompted to re-sign when booking.
          </p>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={saveSettings} className="px-6 py-3 bg-[#FF2D8E] text-white rounded-lg hover:bg-black font-medium">
            Save Consent Settings
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
}
