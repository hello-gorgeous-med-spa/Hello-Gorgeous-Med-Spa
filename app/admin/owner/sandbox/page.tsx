'use client';

// ============================================================
// SANDBOX / PREVIEW MODE - OWNER CONTROLLED
// Test changes before publishing to production
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface SandboxChange {
  id: string;
  type: 'service' | 'price' | 'consent' | 'rule' | 'schedule' | 'automation';
  action: 'create' | 'update' | 'delete';
  name: string;
  description: string;
  created_at: string;
  status: 'pending' | 'testing' | 'approved' | 'rejected';
}

export default function SandboxModePage() {
  const [sandboxActive, setSandboxActive] = useState(false);
  const [changes, setChanges] = useState<SandboxChange[]>([
    {
      id: 'change-1',
      type: 'service',
      action: 'create',
      name: 'New Facial Treatment',
      description: 'Added new hydrating facial service at $150',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'testing',
    },
    {
      id: 'change-2',
      type: 'price',
      action: 'update',
      name: 'Botox Price Increase',
      description: 'Changed Botox from $12/unit to $14/unit',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
    },
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const publishAll = () => {
    const pending = changes.filter(c => c.status === 'testing' || c.status === 'approved');
    if (pending.length === 0) {
      setMessage({ type: 'error', text: 'No changes ready to publish' });
      return;
    }
    
    setChanges(prev => prev.map(c => 
      (c.status === 'testing' || c.status === 'approved') ? { ...c, status: 'approved' as const } : c
    ));
    setMessage({ type: 'success', text: `${pending.length} change(s) published to production!` });
    setTimeout(() => setMessage(null), 3000);
  };

  const discardAll = () => {
    if (!confirm('Discard all sandbox changes? This cannot be undone.')) return;
    setChanges([]);
    setSandboxActive(false);
    setMessage({ type: 'success', text: 'All sandbox changes discarded' });
    setTimeout(() => setMessage(null), 3000);
  };

  const approveChange = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const rejectChange = (id: string) => {
    setChanges(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service': return '💉';
      case 'price': return '💰';
      case 'consent': return '📝';
      case 'rule': return '📋';
      case 'schedule': return '📅';
      case 'automation': return '⚡';
      default: return '📦';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-700';
      case 'update': return 'bg-blue-100 text-blue-700';
      case 'delete': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'testing': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
            <span>Sandbox</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sandbox / Preview Mode</h1>
          <p className="text-gray-500">Test changes before publishing to production</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Sandbox Status */}
      <div className={`rounded-xl border-2 p-6 ${sandboxActive ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{sandboxActive ? '🧪' : '🔒'}</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Sandbox Mode: {sandboxActive ? 'ACTIVE' : 'INACTIVE'}
              </h2>
              <p className="text-sm text-gray-500">
                {sandboxActive 
                  ? 'Changes are being collected. Test your modifications before going live.'
                  : 'Enable sandbox mode to safely test changes without affecting production.'
                }
              </p>
            </div>
          </div>
          <button
            onClick={() => setSandboxActive(!sandboxActive)}
            className={`px-6 py-3 rounded-lg font-medium ${
              sandboxActive 
                ? 'bg-purple-600 text-white hover:bg-purple-700' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            {sandboxActive ? 'Exit Sandbox' : 'Enter Sandbox Mode'}
          </button>
        </div>

        {sandboxActive && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-purple-700">
                {changes.filter(c => c.status !== 'rejected').length} pending change(s)
              </span>
              <div className="flex-1" />
              <button
                onClick={discardAll}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
              >
                Discard All
              </button>
              <button
                onClick={publishAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Publish to Production
              </button>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How Sandbox Mode Works</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">1️⃣</span>
            </div>
            <p className="text-sm font-medium">Enter Sandbox</p>
            <p className="text-xs text-gray-500">Click to activate sandbox mode</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">2️⃣</span>
            </div>
            <p className="text-sm font-medium">Make Changes</p>
            <p className="text-xs text-gray-500">Edit services, prices, rules safely</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">3️⃣</span>
            </div>
            <p className="text-sm font-medium">Test & Review</p>
            <p className="text-xs text-gray-500">Preview changes before going live</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-xl">4️⃣</span>
            </div>
            <p className="text-sm font-medium">Publish or Discard</p>
            <p className="text-xs text-gray-500">One click to go live or roll back</p>
          </div>
        </div>
      </div>

      {/* Pending Changes */}
      {changes.length > 0 && (
        <div className="bg-white rounded-xl border">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Sandbox Changes</h2>
            <span className="text-sm text-gray-500">{changes.length} total</span>
          </div>
          <div className="divide-y">
            {changes.map(change => (
              <div key={change.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getTypeIcon(change.type)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{change.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded ${getActionColor(change.action)}`}>
                          {change.action}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(change.status)}`}>
                          {change.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{change.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(change.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {change.status !== 'approved' && change.status !== 'rejected' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rejectChange(change.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveChange(change.id)}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Scenarios */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Test Scenarios</h2>
        <p className="text-sm text-gray-500 mb-4">Click to simulate common scenarios in sandbox mode:</p>
        <div className="grid grid-cols-4 gap-3">
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
            <span className="text-xl">📅</span>
            <p className="text-sm font-medium mt-1">Test Booking</p>
            <p className="text-xs text-gray-500">Simulate a new booking flow</p>
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
            <span className="text-xl">💳</span>
            <p className="text-sm font-medium mt-1">Test Payment</p>
            <p className="text-xs text-gray-500">Simulate checkout (no charge)</p>
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
            <span className="text-xl">📱</span>
            <p className="text-sm font-medium mt-1">Test SMS</p>
            <p className="text-xs text-gray-500">Preview reminder messages</p>
          </button>
          <button className="p-3 border rounded-lg hover:bg-gray-50 text-left">
            <span className="text-xl">📝</span>
            <p className="text-sm font-medium mt-1">Test Consent</p>
            <p className="text-xs text-gray-500">Preview consent flow</p>
          </button>
        </div>
      </div>
    </div>
  );
}
