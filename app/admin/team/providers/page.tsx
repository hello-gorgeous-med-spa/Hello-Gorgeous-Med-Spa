'use client';

// ============================================================
// ADMIN PROVIDER MANAGEMENT PAGE
// Add, edit, activate/deactivate providers
// ============================================================

import { useState, useEffect, useCallback } from 'react';

interface Provider {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  title?: string;
  credentials?: string;
  color: string;
  is_active: boolean;
  is_provider: boolean; // Custom flag to mark as bookable provider
}

const COLORS = [
  { name: 'Pink', value: '#EC4899' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
];

export default function ProviderManagementPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    credentials: '',
    color: '#EC4899',
  });

  // Fetch providers from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/providers');
        const data = await res.json();
        if (data.providers) {
          setProviders(data.providers.map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            name: `${p.first_name} ${p.last_name}`,
            email: p.email,
            credentials: p.credentials,
            color: p.color_hex || '#EC4899',
            is_active: p.is_active,
            is_provider: true,
          })));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        // Fallback
        setProviders([
          { id: '1', name: 'Danielle Alcala', title: 'Owner & Aesthetic Specialist', credentials: 'Owner', color: '#EC4899', is_active: true, is_provider: true },
          { id: '2', name: 'Ryan Kent', title: 'APRN, FNP-BC', credentials: 'APRN, FNP-BC', color: '#8B5CF6', is_active: true, is_provider: true },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Toggle provider active status (placeholder - would need providers API PUT)
  const toggleActive = async (provider: Provider) => {
    // Update locally for now
    setProviders(prev => prev.map(p => 
      p.id === provider.id ? { ...p, is_active: !p.is_active } : p
    ));

    setMessage({ 
      type: 'success', 
      text: `${provider.name} ${!provider.is_active ? 'activated' : 'deactivated'}` 
    });
    setTimeout(() => setMessage(null), 3000);
  };

  // Update provider details (placeholder)
  const updateProvider = async () => {
    if (!editingProvider) return;

    setSaving(true);
    
    // Update locally
    setProviders(prev => prev.map(p => 
      p.id === editingProvider.id 
        ? { ...p, credentials: formData.credentials, color: formData.color }
        : p
    ));

    setMessage({ type: 'success', text: 'Provider updated!' });
    setEditingProvider(null);
    setTimeout(() => setMessage(null), 3000);
    setSaving(false);
  };

  // Add new provider (placeholder)
  const addProvider = async () => {
    if (!formData.name) return;

    setSaving(true);

    // Add locally
    const newProvider: Provider = {
      id: `new-${Date.now()}`,
      user_id: formData.user_id,
      name: formData.name,
      credentials: formData.credentials,
      color: formData.color,
      is_active: true,
      is_provider: true,
    };

    setProviders(prev => [newProvider, ...prev]);
    setMessage({ type: 'success', text: 'Provider added!' });
    setShowAddModal(false);
    resetForm();
    setTimeout(() => setMessage(null), 3000);
    setSaving(false);
  };

  // Remove provider (just deactivates, doesn't delete)
  const removeProvider = async (provider: Provider) => {
    const confirmed = window.confirm(
      `Remove ${provider.name} as a provider?\n\nThey won't appear in booking or schedules anymore.`
    );
    if (!confirmed) return;

    setProviders(prev => prev.map(p => 
      p.id === provider.id ? { ...p, is_active: false } : p
    ));

    setMessage({ type: 'success', text: `${provider.name} removed from providers` });
    setTimeout(() => setMessage(null), 3000);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      user_id: '',
      name: '',
      credentials: '',
      color: '#EC4899',
    });
  };

  // Open edit modal
  const openEditModal = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      user_id: provider.user_id || '',
      name: provider.name,
      credentials: provider.credentials || '',
      color: provider.color,
    });
  };

  // Get users not already providers
  const availableUsers = allUsers.filter(user => 
    !providers.some(p => p.user_id === user.id)
  );

  // Separate active and inactive
  const activeProviders = providers.filter(p => p.is_active);
  const inactiveProviders = providers.filter(p => !p.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Management</h1>
          <p className="text-gray-500">Manage who can be booked for services</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
        >
          + Add Provider
        </button>
      </div>


      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Active Providers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Active Providers ({activeProviders.length})</h2>
          <p className="text-sm text-gray-500">These providers appear in booking and schedules</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : activeProviders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No active providers. Add one to get started.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activeProviders.map(provider => (
              <div key={provider.id} className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.credentials || 'Provider'}</p>
                    {provider.email && (
                      <p className="text-xs text-gray-400">{provider.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(provider)}
                    className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProvider(provider)}
                    className="px-3 py-1.5 text-sm text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Providers */}
      {inactiveProviders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Inactive Providers ({inactiveProviders.length})</h2>
            <p className="text-sm text-gray-500">These providers are hidden from booking</p>
          </div>

          <div className="divide-y divide-gray-100">
            {inactiveProviders.map(provider => (
              <div key={provider.id} className="px-5 py-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg opacity-50"
                    style={{ backgroundColor: provider.color }}
                  >
                    {provider.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">{provider.name}</p>
                    <p className="text-sm text-gray-400">{provider.credentials || 'Provider'}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleActive(provider)}
                  className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  Reactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Provider Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Add Provider</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Select User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User *</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => {
                    const user = allUsers.find(u => u.id === e.target.value);
                    setFormData({
                      ...formData,
                      user_id: e.target.value,
                      name: user ? `${user.first_name} ${user.last_name}` : '',
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Choose a user...</option>
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.email})
                    </option>
                  ))}
                </select>
                {availableUsers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    All users are already providers. Create a new user first.
                  </p>
                )}
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title / Credentials</label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., APRN, FNP-BC or Esthetician"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={addProvider}
                disabled={saving || !formData.user_id}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Provider'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Edit Provider</h2>
              <button onClick={() => setEditingProvider(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {editingProvider.name}
                </p>
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title / Credentials</label>
                <input
                  type="text"
                  value={formData.credentials}
                  onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., APRN, FNP-BC"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calendar Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={updateProvider}
                disabled={saving}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">How providers work:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li><strong>Active providers</strong> appear in booking and can be assigned to services</li>
          <li><strong>Removing</strong> a provider hides them from booking (doesn't delete data)</li>
          <li>Set <strong>credentials</strong> to show their title (e.g., "APRN" or "Esthetician")</li>
          <li><strong>Color</strong> is used in the calendar and booking flow</li>
        </ul>
      </div>
    </div>
  );
}
