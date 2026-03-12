'use client';

import Link from 'next/link';
import { CONSENT_FORMS } from '@/lib/hgos/consent-forms';

export default function AdminSettingsConsentFormsPage() {
  const totalForms = CONSENT_FORMS.length;
  const requiredForms = CONSENT_FORMS.filter(f => f.required).length;
  const categories = [...new Set(CONSENT_FORMS.map(f => f.category))];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">← Settings</Link>
        <span className="text-gray-400">/</span>
        <h1 className="text-xl font-bold text-black">Consent Forms</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Forms</p>
          <p className="text-2xl font-bold text-black">{totalForms}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Required</p>
          <p className="text-2xl font-bold text-pink-600">{requiredForms}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-black">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">Status</p>
          <p className="text-2xl font-bold text-green-600">Active</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/admin/owner/consents"
          className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl p-6 text-white hover:from-pink-600 hover:to-pink-700 transition-all group"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="font-semibold text-lg">Manage Consent Forms</h3>
              <p className="text-pink-100 text-sm mt-1">
                View all forms, send to clients, print, download, and track signatures.
              </p>
              <span className="text-white text-sm font-medium mt-3 inline-flex items-center gap-1">
                Open Consent Management →
              </span>
            </div>
          </div>
        </Link>

        <a 
          href="https://www.hellogorgeousmedspa.com/portal/consents"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl border p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl">👁️</span>
            <div>
              <h3 className="font-semibold text-lg group-hover:text-blue-600">Client Portal Preview</h3>
              <p className="text-gray-600 text-sm mt-1">
                See how clients view and sign consent forms in their portal.
              </p>
              <span className="text-blue-600 text-sm font-medium mt-3 inline-block">
                Preview Portal →
              </span>
            </div>
          </div>
        </a>
      </div>

      {/* Form Categories */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Form Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(category => {
            const count = CONSENT_FORMS.filter(f => f.category === category).length;
            return (
              <div key={category} className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 capitalize">{category.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-500">{count} form{count !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 className="font-medium text-blue-800">How Consent Forms Work</h3>
        <ul className="text-sm text-blue-700 mt-2 space-y-1">
          <li>• <strong>Send forms</strong> to clients via email, SMS, or shareable link</li>
          <li>• <strong>Clients sign digitally</strong> from any device</li>
          <li>• <strong>Signatures are stored</strong> securely with timestamp and IP verification</li>
          <li>• <strong>Forms auto-expire</strong> based on your settings (typically 1 year)</li>
        </ul>
      </div>

      {/* Back Link */}
      <div className="pt-4">
        <Link href="/admin/settings" className="text-[#2D63A4] font-medium hover:underline">
          ← Back to Settings
        </Link>
      </div>
    </div>
  );
}
