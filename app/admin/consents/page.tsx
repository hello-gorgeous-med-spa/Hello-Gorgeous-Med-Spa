'use client';

// ============================================================
// ADMIN CONSENTS PAGE  
// Manage consent templates and view signed consents
// ============================================================

import Link from 'next/link';

const CONSENT_TEMPLATES = [
  { id: 'con1', name: 'General Treatment Consent', signedCount: 2847, lastUpdated: '2025-01-01' },
  { id: 'con2', name: 'Neurotoxin (Botox) Consent', signedCount: 1523, lastUpdated: '2025-01-01' },
  { id: 'con3', name: 'Dermal Filler Consent', signedCount: 892, lastUpdated: '2025-01-01' },
  { id: 'con4', name: 'Weight Loss Program Consent', signedCount: 445, lastUpdated: '2025-06-01' },
  { id: 'con5', name: 'HIPAA Privacy Notice', signedCount: 3199, lastUpdated: '2025-01-01' },
];

export default function AdminConsentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consent Forms</h1>
          <p className="text-gray-500">Manage consent templates and view signed consents</p>
        </div>
        <button className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600">
          + Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Templates</p>
          <p className="text-2xl font-bold text-gray-900">{CONSENT_TEMPLATES.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Signed</p>
          <p className="text-2xl font-bold text-green-600">8,906</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Expiring Soon</p>
          <p className="text-2xl font-bold text-amber-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Consent Templates</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {CONSENT_TEMPLATES.map((template) => (
            <div key={template.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{template.name}</p>
                <p className="text-sm text-gray-500">
                  {template.signedCount.toLocaleString()} signed • Last updated {template.lastUpdated}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Preview
                </button>
                <button className="px-3 py-1.5 text-sm text-pink-600 hover:bg-pink-50 rounded-lg">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
