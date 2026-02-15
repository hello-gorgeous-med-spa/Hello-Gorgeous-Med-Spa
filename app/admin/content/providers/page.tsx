'use client';

// ============================================================
// ADMIN - PROVIDERS MANAGEMENT
// Manage provider profiles and media
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Provider {
  id: string;
  name: string;
  slug: string;
  credentials: string | null;
  short_bio: string | null;
  full_bio: string | null;
  philosophy: string | null;
  headshot_url: string | null;
  intro_video_url: string | null;
  booking_url: string | null;
  is_active: boolean;
  display_order: number;
}

export default function ProvidersAdminPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/providers');
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (provider: Partial<Provider>) => {
    try {
      const method = provider.id ? 'PUT' : 'POST';
      const res = await fetch('/api/providers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(provider),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: provider.id ? 'Provider updated!' : 'Provider added!' });
        fetchProviders();
        setShowAddModal(false);
        setEditingProvider(null);
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save provider' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this provider?')) return;

    try {
      const res = await fetch(`/api/providers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Provider deactivated' });
        fetchProviders();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to deactivate provider' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-3xl">👩‍⚕️</span>
            Providers
          </h1>
          <p className="text-gray-500 mt-1">Manage provider profiles, videos, and before/after photos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-medium flex items-center gap-2"
        >
          + Add Provider
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div key={provider.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex gap-4">
                {/* Headshot */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-pink-100 flex-shrink-0">
                  {provider.headshot_url ? (
                    <Image src={provider.headshot_url} alt={provider.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{provider.name}</h3>
                  {provider.credentials && (
                    <p className="text-sm text-pink-600 font-medium">{provider.credentials}</p>
                  )}
                  {provider.short_bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{provider.short_bio}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditingProvider(provider)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Edit Profile
                </button>
                <Link
                  href={`/admin/content/providers/${provider.id}/media`}
                  className="flex-1 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 text-sm font-medium text-center"
                >
                  Manage Media
                </Link>
                <button
                  onClick={() => handleDelete(provider.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                >
                  🗑️
                </button>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-sm text-gray-500">
                <span>Slug: /{provider.slug}</span>
                <span className={provider.is_active ? 'text-green-600' : 'text-red-600'}>
                  {provider.is_active ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {providers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <span className="text-5xl mb-4 block">👩‍⚕️</span>
          <h3 className="text-lg font-medium text-gray-900">No providers yet</h3>
          <p className="text-gray-500 mt-1">Add your first provider to get started</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Add Provider
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingProvider) && (
        <ProviderModal
          provider={editingProvider}
          onClose={() => {
            setShowAddModal(false);
            setEditingProvider(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Provider Modal Component
function ProviderModal({ 
  provider, 
  onClose, 
  onSave 
}: { 
  provider: Provider | null; 
  onClose: () => void; 
  onSave: (p: Partial<Provider>) => void;
}) {
  const [formData, setFormData] = useState({
    id: provider?.id || '',
    name: provider?.name || '',
    slug: provider?.slug || '',
    credentials: provider?.credentials || '',
    short_bio: provider?.short_bio || '',
    full_bio: provider?.full_bio || '',
    philosophy: provider?.philosophy || '',
    headshot_url: provider?.headshot_url || '',
    intro_video_url: provider?.intro_video_url || '',
    booking_url: provider?.booking_url || '',
    display_order: provider?.display_order || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value)
                  });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug *</label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-1">/providers/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credentials</label>
            <input
              type="text"
              value={formData.credentials}
              onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
              placeholder="e.g., RN, BSN, Aesthetic Injector"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
            <textarea
              value={formData.short_bio}
              onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
              placeholder="Brief introduction (shown on provider cards)"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Bio</label>
            <textarea
              value={formData.full_bio}
              onChange={(e) => setFormData({ ...formData, full_bio: e.target.value })}
              placeholder="Detailed biography (shown on profile page)"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Philosophy</label>
            <textarea
              value={formData.philosophy}
              onChange={(e) => setFormData({ ...formData, philosophy: e.target.value })}
              placeholder="Provider's treatment philosophy"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {/* Media URLs */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headshot URL</label>
                <input
                  type="url"
                  value={formData.headshot_url}
                  onChange={(e) => setFormData({ ...formData, headshot_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intro Video URL</label>
                <input
                  type="url"
                  value={formData.intro_video_url}
                  onChange={(e) => setFormData({ ...formData, intro_video_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking URL</label>
                <input
                  type="text"
                  value={formData.booking_url}
                  onChange={(e) => setFormData({ ...formData, booking_url: e.target.value })}
                  placeholder="/book?provider=slug"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              {provider ? 'Save Changes' : 'Add Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
