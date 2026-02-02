'use client';

// ============================================================
// SYSTEM ACCESS & KEYS - OWNER CONTROLLED
// All credentials the owner must personally control
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface SystemAccess {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'verified' | 'needs_attention' | 'not_setup';
  owner_email?: string;
  url?: string;
  notes?: string;
}

export default function SystemAccessPage() {
  const [accessItems] = useState<SystemAccess[]>([
    // Hosting & Infrastructure
    {
      id: 'vercel',
      name: 'Vercel (Hosting)',
      description: 'Website hosting and deployment',
      category: 'Infrastructure',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      url: 'https://vercel.com/dashboard',
      notes: 'Owner has full admin access to deployment settings',
    },
    {
      id: 'supabase',
      name: 'Supabase (Database)',
      description: 'Database, authentication, and storage',
      category: 'Infrastructure',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      url: 'https://app.supabase.com/projects',
      notes: 'Contains all patient data. Enable 2FA!',
    },
    {
      id: 'github',
      name: 'GitHub (Code Repository)',
      description: 'Source code and version control',
      category: 'Infrastructure',
      status: 'needs_attention',
      url: 'https://github.com/hello-gorgeous-med-spa',
      notes: 'Request ownership transfer from developer',
    },

    // Payments
    {
      id: 'stripe',
      name: 'Stripe (Payments)',
      description: 'Payment processing and payouts',
      category: 'Payments',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      url: 'https://dashboard.stripe.com',
      notes: 'Bank account connected. Payouts go to business account.',
    },

    // Communications
    {
      id: 'telnyx',
      name: 'Telnyx (SMS)',
      description: 'SMS/MMS messaging service',
      category: 'Communications',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      url: 'https://portal.telnyx.com',
      notes: '10DLC registration required for compliance',
    },
    {
      id: 'email',
      name: 'Email Provider',
      description: 'Transactional email delivery',
      category: 'Communications',
      status: 'needs_attention',
      notes: 'Consider adding SendGrid or Resend for email delivery',
    },

    // Domain & DNS
    {
      id: 'domain',
      name: 'Domain Registrar',
      description: 'hellogorgeousmedspa.com ownership',
      category: 'Domain',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      notes: 'Ensure auto-renewal is enabled',
    },
    {
      id: 'dns',
      name: 'DNS Settings',
      description: 'Domain name server configuration',
      category: 'Domain',
      status: 'verified',
      url: 'https://vercel.com/dashboard',
      notes: 'Managed through Vercel',
    },

    // Storage
    {
      id: 'storage',
      name: 'File Storage',
      description: 'Photos, documents, and uploads',
      category: 'Storage',
      status: 'verified',
      url: 'https://app.supabase.com/projects',
      notes: 'Managed through Supabase Storage',
    },

    // Compliance
    {
      id: 'efax',
      name: 'eFax',
      description: 'HIPAA-compliant faxing',
      category: 'Compliance',
      status: 'verified',
      owner_email: 'danielle@hellogorgeousmedspa.com',
      url: 'https://myportal.efax.com',
    },
  ]);

  const categories = [...new Set(accessItems.map(a => a.category))];
  
  const statusCounts = {
    verified: accessItems.filter(a => a.status === 'verified').length,
    needs_attention: accessItems.filter(a => a.status === 'needs_attention').length,
    not_setup: accessItems.filter(a => a.status === 'not_setup').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓ Verified</span>;
      case 'needs_attention':
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">⚠️ Needs Attention</span>;
      case 'not_setup':
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">❌ Not Setup</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>System Access</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">System Access & Keys</h1>
          <p className="text-gray-500">All accounts and credentials you must personally control</p>
        </div>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">🔐</span>
          <div>
            <h2 className="text-lg font-semibold text-red-800">CRITICAL: Owner Must Control These Accounts</h2>
            <p className="text-sm text-red-600 mt-1">
              The following accounts contain your business data, process your payments, and control your system.
              <strong> You must be the primary owner of each account</strong> — not a developer, not an employee.
            </p>
            <ul className="text-sm text-red-600 mt-2 space-y-1">
              <li>• All accounts must use your business email</li>
              <li>• Enable 2-factor authentication on all accounts</li>
              <li>• Never share passwords or API keys</li>
              <li>• Review access quarterly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-600">Verified</p>
          <p className="text-2xl font-bold text-green-800">{statusCounts.verified}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-600">Needs Attention</p>
          <p className="text-2xl font-bold text-amber-800">{statusCounts.needs_attention}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">Not Setup</p>
          <p className="text-2xl font-bold text-red-800">{statusCounts.not_setup}</p>
        </div>
      </div>

      {/* Access Items by Category */}
      {categories.map(category => (
        <div key={category} className="bg-white rounded-xl border">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">{category}</h2>
          </div>
          <div className="divide-y">
            {accessItems.filter(a => a.category === category).map(item => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    
                    {item.owner_email && (
                      <p className="text-xs text-gray-400 mt-2">
                        <span className="font-medium">Owner Email:</span> {item.owner_email}
                      </p>
                    )}
                    
                    {item.notes && (
                      <p className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                        💡 {item.notes}
                      </p>
                    )}
                  </div>
                  
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      Open Dashboard →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Checklist */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Owner Verification Checklist</h2>
        <div className="space-y-3">
          {[
            'I am the primary owner on Vercel (hosting)',
            'I am the primary owner on Supabase (database)',
            'I am the primary owner on Stripe (payments)',
            'I am the primary owner on Telnyx (SMS)',
            'I own the domain hellogorgeousmedspa.com',
            'I have enabled 2FA on all accounts',
            'No developer has admin access to payments',
            'I can access all dashboards without developer help',
          ].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" className="w-5 h-5 text-green-500 rounded" />
              <span className="text-sm">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Action Required */}
      {statusCounts.needs_attention > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-amber-800 mb-2">Action Required</h2>
          <p className="text-sm text-amber-600 mb-4">
            The following items need your attention:
          </p>
          <ul className="space-y-2">
            {accessItems.filter(a => a.status === 'needs_attention').map(item => (
              <li key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.notes}</p>
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-600">
                    Fix Now →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
