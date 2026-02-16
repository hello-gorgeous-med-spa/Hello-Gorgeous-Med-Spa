'use client';

// ============================================================
// SYSTEM ACCESS - OWNER CONTROLLED
// Credentials panel for all external services
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface SystemAccess {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'verified' | 'needs_attention' | 'not_setup';
  url: string;
  owner: string;
  lastVerified: string | null;
}

export default function SystemAccessPage() {
  const [systems] = useState<SystemAccess[]>([
    { id: 'vercel', name: 'Vercel', category: 'Hosting', description: 'Website and app hosting', status: 'verified', url: 'https://vercel.com/dashboard', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-02-01' },
    { id: 'supabase', name: 'Supabase', category: 'Database', description: 'PostgreSQL database', status: 'verified', url: 'https://supabase.com/dashboard', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-02-01' },
    { id: 'github', name: 'GitHub', category: 'Code Repository', description: 'Source code storage', status: 'verified', url: 'https://github.com', owner: 'hello-gorgeous-med-spa', lastVerified: '2025-01-28' },
    { id: 'stripe', name: 'Stripe', category: 'Payments', description: 'Credit card processing', status: 'verified', url: 'https://dashboard.stripe.com', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-02-02' },
    { id: 'telnyx', name: 'Telnyx', category: 'SMS/Voice', description: 'Text messaging service', status: 'verified', url: 'https://portal.telnyx.com', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-01-30' },
    { id: 'sendgrid', name: 'SendGrid', category: 'Email', description: 'Transactional emails', status: 'needs_attention', url: 'https://app.sendgrid.com', owner: 'needs_verification', lastVerified: null },
    { id: 'cloudflare', name: 'Cloudflare', category: 'DNS', description: 'Domain management', status: 'verified', url: 'https://dash.cloudflare.com', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-01-25' },
    { id: 'namecheap', name: 'Namecheap', category: 'Domain Registrar', description: 'Domain registration', status: 'verified', url: 'https://namecheap.com', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-01-20' },
    { id: 'supabase_storage', name: 'Supabase Storage', category: 'Storage', description: 'File and image storage', status: 'verified', url: 'https://supabase.com/dashboard', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-02-01' },
    { id: 'efax', name: 'eFax', category: 'Fax', description: 'Electronic faxing', status: 'verified', url: 'https://myportal.efax.com', owner: 'danielle@hellogorgeousmedspa.com', lastVerified: '2025-01-28' },
  ]);

  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-700';
      case 'needs_attention': return 'bg-amber-100 text-amber-700';
      case 'not_setup': return 'bg-white text-black';
      default: return 'bg-white text-black';
    }
  };

  const verifiedCount = systems.filter(s => s.status === 'verified').length;
  const needsAttentionCount = systems.filter(s => s.status === 'needs_attention').length;

  return (
    <OwnerLayout title="System Access" description="Credentials and access for all external services">
      {/* Status Banner */}
      <div className={`p-4 rounded-xl mb-6 ${needsAttentionCount > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{needsAttentionCount > 0 ? '⚠️' : '✅'}</span>
          <div>
            <h2 className={`font-semibold ${needsAttentionCount > 0 ? 'text-amber-800' : 'text-green-800'}`}>
              {needsAttentionCount > 0 ? `${needsAttentionCount} systems need attention` : 'All systems verified'}
            </h2>
            <p className={`text-sm ${needsAttentionCount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              {verifiedCount} of {systems.length} systems verified under owner account
            </p>
          </div>
        </div>
      </div>

      {/* Credentials Panel */}
      <div className="bg-white rounded-xl border">
        <div className="p-4 border-b bg-white">
          <h2 className="font-semibold">🔑 Credentials Panel</h2>
          <p className="text-sm text-black">All external services the system depends on</p>
        </div>
        <div className="divide-y">
          {systems.map(system => (
            <div key={system.id} className="p-4 hover:bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-lg">
                    {system.category === 'Hosting' && '🖥️'}
                    {system.category === 'Database' && '🗄️'}
                    {system.category === 'Code Repository' && '📂'}
                    {system.category === 'Payments' && '💳'}
                    {system.category === 'SMS/Voice' && '📱'}
                    {system.category === 'Email' && '📧'}
                    {system.category === 'DNS' && '🌐'}
                    {system.category === 'Domain Registrar' && '🏷️'}
                    {system.category === 'Storage' && '💾'}
                    {system.category === 'Fax' && '📠'}
                  </div>
                  <div>
                    <h3 className="font-medium">{system.name}</h3>
                    <p className="text-xs text-black">{system.category} • {system.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(system.status)}`}>
                    {system.status === 'verified' ? '✔ Owner Verified' : system.status === 'needs_attention' ? '⚠ Needs Attention' : 'Not Setup'}
                  </span>
                  <a
                    href={system.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-purple-200"
                  >
                    Open Dashboard →
                  </a>
                  <button
                    onClick={() => setExpandedSystem(expandedSystem === system.id ? null : system.id)}
                    className="text-black hover:text-black"
                  >
                    {expandedSystem === system.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>
              {expandedSystem === system.id && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-black">Owner Account</span>
                      <p className="font-medium">{system.owner}</p>
                    </div>
                    <div>
                      <span className="text-black">Dashboard URL</span>
                      <p className="font-medium text-pink-600">{system.url}</p>
                    </div>
                    <div>
                      <span className="text-black">Last Verified</span>
                      <p className="font-medium">{system.lastVerified || 'Never'}</p>
                    </div>
                  </div>
                  {system.status === 'needs_attention' && (
                    <div className="mt-3 p-3 bg-amber-100 rounded-lg">
                      <p className="text-sm text-amber-800">
                        ⚠️ This service needs to be verified under the owner's account.
                        Please log in and confirm ownership.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Owner Verification Checklist */}
      <div className="mt-6 bg-purple-50 border border-pink-200 rounded-xl p-6">
        <h3 className="font-semibold text-purple-800 mb-4">✅ Owner Verification Checklist</h3>
        <p className="text-sm text-pink-600 mb-4">
          As the system owner, you should have direct login access to all of the following.
          <strong> Nothing should be under a developer's email.</strong>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Hosting access (Vercel)',
            'Database access (Supabase)',
            'Auth provider access',
            'Storage access',
            'Payment dashboards (Stripe)',
            'Email/SMS dashboards',
            'Domain registrar',
            'DNS management',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">✓</span>
              <span className="text-sm text-black">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-medium text-red-800">❌ Nothing under developer email</h3>
        <p className="text-sm text-red-600 mt-1">
          All production services must be registered under Hello Gorgeous Med Spa's business email.
          If any service is under a developer's personal email, transfer ownership immediately.
        </p>
      </div>
    </OwnerLayout>
  );
}
