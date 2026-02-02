'use client';

// ============================================================
// PROVIDERS & STAFF - OWNER CONTROLLED
// Provider management with profile tabs and security
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Provider {
  id: string;
  name: string;
  credentials: string;
  role: 'provider' | 'admin' | 'front_desk' | 'billing';
  status: 'active' | 'inactive' | 'locked';
  email: string;
  servicesAllowed: string[];
  unitLimits: { [serviceId: string]: number };
  salesPermissions: boolean;
  canEditSchedule: boolean;
  canOverride: boolean;
  lastLogin: string;
  activeSessions: number;
}

const SERVICES = ['Botox', 'Juvederm', 'HydraFacial', 'Laser', 'Weight Loss', 'IPL', 'Microneedling'];

export default function ProvidersStaffPage() {
  const [providers, setProviders] = useState<Provider[]>([
    { id: 'p1', name: 'Ryan Kent', credentials: 'NP', role: 'provider', status: 'active', email: 'ryan@hellogorgeousmedspa.com', servicesAllowed: SERVICES, unitLimits: { 'Botox': 50 }, salesPermissions: true, canEditSchedule: true, canOverride: false, lastLogin: '2025-02-02T10:30:00Z', activeSessions: 1 },
    { id: 'p2', name: 'Danielle Alcala', credentials: 'Owner', role: 'admin', status: 'active', email: 'danielle@hellogorgeousmedspa.com', servicesAllowed: SERVICES, unitLimits: {}, salesPermissions: true, canEditSchedule: true, canOverride: true, lastLogin: '2025-02-02T09:15:00Z', activeSessions: 2 },
  ]);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const updateProvider = (updates: Partial<Provider>) => {
    if (!selectedProvider) return;
    const updated = { ...selectedProvider, ...updates };
    setSelectedProvider(updated);
    setProviders(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const revokeAccess = () => {
    if (!selectedProvider) return;
    updateProvider({ status: 'locked' });
    setMessage({ type: 'success', text: `Access revoked for ${selectedProvider.name}` });
    setShowRevokeConfirm(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'schedule', label: 'Schedule Access' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <OwnerLayout title="Providers & Staff" description="Team management with RBAC">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-6">
        {/* Provider List */}
        <div className="w-1/3">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Provider List</h2>
              <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                + Add Staff
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">NAME</th>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">ROLE</th>
                  <th className="px-4 py-2 text-xs font-semibold text-gray-500">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {providers.map(provider => (
                  <tr
                    key={provider.id}
                    onClick={() => { setSelectedProvider(provider); setActiveTab('profile'); }}
                    className={`cursor-pointer hover:bg-gray-50 ${selectedProvider?.id === provider.id ? 'bg-purple-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{provider.name}</p>
                        <p className="text-xs text-gray-500">{provider.credentials}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 capitalize">{provider.role.replace('_', ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        provider.status === 'active' ? 'bg-green-100 text-green-700' :
                        provider.status === 'locked' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provider Profile Panel */}
        <div className="w-2/3">
          {selectedProvider ? (
            <div className="bg-white rounded-xl border">
              <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{selectedProvider.name}</h2>
                  <p className="text-sm text-gray-500">{selectedProvider.email}</p>
                </div>
                {selectedProvider.status === 'active' && (
                  <button
                    onClick={() => setShowRevokeConfirm(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    🔴 Revoke Access
                  </button>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={selectedProvider.name}
                        onChange={(e) => updateProvider({ name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
                      <input
                        type="text"
                        value={selectedProvider.credentials}
                        onChange={(e) => updateProvider({ credentials: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="NP, PA, MD, RN, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        value={selectedProvider.role}
                        onChange={(e) => updateProvider({ role: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                        <option value="front_desk">Front Desk</option>
                        <option value="billing">Billing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={selectedProvider.email}
                        onChange={(e) => updateProvider({ email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* CAPABILITIES TAB */}
                {activeTab === 'capabilities' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Services Allowed</label>
                      <div className="grid grid-cols-2 gap-2">
                        {SERVICES.map(service => (
                          <label key={service} className="flex items-center gap-3 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="checkbox"
                              checked={selectedProvider.servicesAllowed.includes(service)}
                              onChange={(e) => {
                                const newServices = e.target.checked
                                  ? [...selectedProvider.servicesAllowed, service]
                                  : selectedProvider.servicesAllowed.filter(s => s !== service);
                                updateProvider({ servicesAllowed: newServices });
                              }}
                              className="w-4 h-4 text-purple-600"
                            />
                            <span className="text-sm">{service}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit Limits</label>
                      {SERVICES.filter(s => s === 'Botox' || s === 'Juvederm').map(service => (
                        <div key={service} className="flex items-center gap-3 mb-2">
                          <span className="w-32 text-sm">{service}</span>
                          <input
                            type="number"
                            placeholder="No limit"
                            value={selectedProvider.unitLimits[service] || ''}
                            onChange={(e) => {
                              const limit = parseInt(e.target.value) || 0;
                              const newLimits = { ...selectedProvider.unitLimits };
                              if (limit > 0) {
                                newLimits[service] = limit;
                              } else {
                                delete newLimits[service];
                              }
                              updateProvider({ unitLimits: newLimits });
                            }}
                            className="w-24 px-3 py-2 border rounded-lg text-sm"
                            min="0"
                          />
                          <span className="text-xs text-gray-500">units/day</span>
                        </div>
                      ))}
                    </div>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedProvider.salesPermissions}
                        onChange={(e) => updateProvider({ salesPermissions: e.target.checked })}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <span className="font-medium">Sales Permissions</span>
                        <p className="text-xs text-gray-500">Can process payments and view financial data</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* SCHEDULE ACCESS TAB */}
                {activeTab === 'schedule' && (
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedProvider.canEditSchedule}
                        onChange={(e) => updateProvider({ canEditSchedule: e.target.checked })}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <span className="font-medium">Can Edit Own Schedule</span>
                        <p className="text-xs text-gray-500">Provider can modify their own availability</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedProvider.canOverride}
                        onChange={(e) => updateProvider({ canOverride: e.target.checked })}
                        className="w-5 h-5 text-purple-600"
                      />
                      <div>
                        <span className="font-medium">Can Override Booking Rules</span>
                        <p className="text-xs text-gray-500">Provider can book outside normal rules (requires logging)</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* SECURITY TAB */}
                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Last Login</p>
                        <p className="font-medium">{new Date(selectedProvider.lastLogin).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Active Sessions</p>
                        <p className="font-medium">{selectedProvider.activeSessions}</p>
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${selectedProvider.status === 'active' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`font-medium ${selectedProvider.status === 'active' ? 'text-green-700' : 'text-red-700'}`}>
                        Account Status: {selectedProvider.status.toUpperCase()}
                      </p>
                    </div>
                    {selectedProvider.status === 'active' && (
                      <button
                        onClick={() => setShowRevokeConfirm(true)}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        🔴 Revoke Access Immediately
                      </button>
                    )}
                    {selectedProvider.status === 'locked' && (
                      <button
                        onClick={() => updateProvider({ status: 'active' })}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        ✓ Restore Access
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-12 text-center">
              <span className="text-4xl mb-4 block">👥</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Provider</h3>
              <p className="text-gray-500">Click a provider from the list to view and edit their profile.</p>
            </div>
          )}
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {showRevokeConfirm && selectedProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">⚠️ Revoke Access</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to revoke access for <strong>{selectedProvider.name}</strong>?
              They will be immediately logged out of all sessions.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowRevokeConfirm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
              <button onClick={revokeAccess} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Yes, Revoke Access
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
