'use client';

// ============================================================
// SANDBOX / PREVIEW MODE
// Test changes without affecting production
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface SandboxChange {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function SandboxPage() {
  const [sandboxActive, setSandboxActive] = useState(false);
  const [changes, setChanges] = useState<SandboxChange[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const activateSandbox = () => {
    setSandboxActive(true);
    setMessage({ type: 'success', text: 'Sandbox mode activated. Changes will not affect production.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const deactivateSandbox = () => {
    if (changes.length > 0) {
      if (!confirm('You have unsaved changes. Discard all changes and exit sandbox?')) return;
    }
    setSandboxActive(false);
    setChanges([]);
  };

  const addTestChange = (type: string, description: string) => {
    const newChange: SandboxChange = {
      id: `change-${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString(),
    };
    setChanges(prev => [newChange, ...prev]);
    setMessage({ type: 'success', text: `Test change added: ${description}` });
    setTimeout(() => setMessage(null), 2000);
  };

  const publishToLive = () => {
    if (changes.length === 0) {
      setMessage({ type: 'error', text: 'No changes to publish' });
      return;
    }
    if (!confirm(`Publish ${changes.length} changes to production?`)) return;
    setMessage({ type: 'success', text: `${changes.length} changes published to production!` });
    setChanges([]);
    setSandboxActive(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const discardChanges = () => {
    if (!confirm('Discard all sandbox changes?')) return;
    setChanges([]);
    setMessage({ type: 'success', text: 'All sandbox changes discarded' });
    setTimeout(() => setMessage(null), 3000);
  };

  const testScenarios = [
    { icon: '📅', label: 'Simulate Booking', description: 'Test the booking flow', action: () => addTestChange('Booking', 'Simulated client booking for Botox') },
    { icon: '💳', label: 'Test Payment', description: 'Process test payment', action: () => addTestChange('Payment', 'Test payment processed: $150.00') },
    { icon: '📋', label: 'Test Rule', description: 'Trigger a booking rule', action: () => addTestChange('Rule', 'Consent rule triggered for Injectable service') },
    { icon: '📝', label: 'Test Consent', description: 'Preview consent form', action: () => addTestChange('Consent', 'Consent form preview generated') },
    { icon: '✉️', label: 'Test SMS', description: 'Send test message', action: () => addTestChange('SMS', 'Test SMS sent to sandbox number') },
    { icon: '🏷️', label: 'Test Pricing', description: 'Calculate test price', action: () => addTestChange('Pricing', 'Price calculated with new rules: $125.00') },
  ];

  return (
    <OwnerLayout title="Sandbox / Preview Mode" description="Test changes without affecting production">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Status Banner */}
      <div className={`p-4 rounded-xl mb-6 ${sandboxActive ? 'bg-amber-100 border-2 border-amber-400' : 'bg-gray-100 border border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sandboxActive ? '🧪' : '🔒'}</span>
            <div>
              <h2 className={`font-semibold ${sandboxActive ? 'text-amber-800' : 'text-gray-700'}`}>
                {sandboxActive ? 'Sandbox Mode Active' : 'Production Mode'}
              </h2>
              <p className={`text-sm ${sandboxActive ? 'text-amber-600' : 'text-gray-500'}`}>
                {sandboxActive ? 'Changes will not affect live data' : 'All changes affect production'}
              </p>
            </div>
          </div>
          {sandboxActive ? (
            <button onClick={deactivateSandbox} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Exit Sandbox
            </button>
          ) : (
            <button onClick={activateSandbox} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
              Activate Sandbox
            </button>
          )}
        </div>
      </div>

      {sandboxActive && (
        <>
          {/* Quick Test Scenarios */}
          <div className="bg-white rounded-xl border mb-6">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold">🧪 Quick Test Scenarios</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4">
              {testScenarios.map(scenario => (
                <button
                  key={scenario.label}
                  onClick={scenario.action}
                  className="p-4 border rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left"
                >
                  <span className="text-2xl block mb-2">{scenario.icon}</span>
                  <h3 className="font-medium text-sm">{scenario.label}</h3>
                  <p className="text-xs text-gray-500">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Actions */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Changes List */}
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <h2 className="font-semibold">📝 Pending Changes</h2>
                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-sm">
                  {changes.length} changes
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {changes.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No changes yet. Use the test scenarios above.
                  </div>
                ) : (
                  <div className="divide-y">
                    {changes.map(change => (
                      <div key={change.id} className="p-3 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{change.type}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(change.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{change.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold">👁️ Preview Client Flow</h2>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <span className="text-4xl block mb-3">📱</span>
                  <p className="text-sm text-gray-600 mb-4">Preview how changes will appear to clients</p>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    Open Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={publishToLive}
              disabled={changes.length === 0}
              className={`flex-1 px-6 py-4 rounded-xl font-medium ${
                changes.length > 0
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✓ Publish to Live ({changes.length} changes)
            </button>
            <button
              onClick={discardChanges}
              disabled={changes.length === 0}
              className={`flex-1 px-6 py-4 rounded-xl font-medium ${
                changes.length > 0
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              ✕ Discard All Changes
            </button>
          </div>
        </>
      )}

      {!sandboxActive && (
        <div className="bg-white rounded-xl border p-8 text-center">
          <span className="text-5xl block mb-4">🧪</span>
          <h3 className="text-xl font-semibold mb-2">Sandbox Mode</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Test configuration changes, simulate bookings, and preview client flows without affecting your live production data.
          </p>
          <button
            onClick={activateSandbox}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            Activate Sandbox Mode
          </button>
        </div>
      )}
    </OwnerLayout>
  );
}
