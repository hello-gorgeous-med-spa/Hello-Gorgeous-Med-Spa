'use client';

// ============================================================
// PROMOTIONS MANAGER - OWNER MODE CMS
// Offers, banners, campaigns - NO DEV REQUIRED
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../../layout-wrapper';

interface Promotion {
  id: string;
  name: string;
  slug: string;
  headline: string;
  subheadline: string;
  description: string;
  cta_text: string;
  cta_url: string;
  promo_code: string;
  image_url: string;
  display_locations: string[];
  display_as: string;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  priority: number;
  views: number;
  clicks: number;
  created_at: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '',
    headline: '',
    subheadline: '',
    description: '',
    cta_text: 'Learn More',
    cta_url: '',
    promo_code: '',
    image_url: '',
    display_locations: ['homepage'],
    display_as: 'banner',
    starts_at: '',
    ends_at: '',
    is_active: false,
    priority: 0,
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/cms/promotions');
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error('Failed to fetch promotions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      headline: '',
      subheadline: '',
      description: '',
      cta_text: 'Learn More',
      cta_url: '',
      promo_code: '',
      image_url: '',
      display_locations: ['homepage'],
      display_as: 'banner',
      starts_at: '',
      ends_at: '',
      is_active: false,
      priority: 0,
    });
  };

  const handleSave = async () => {
    if (!form.name) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    setSaving(true);
    try {
      const isEditing = !!editingPromo;
      const url = '/api/cms/promotions';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing ? { id: editingPromo.id, ...form } : form;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: 'success', text: isEditing ? 'Promotion updated!' : 'Promotion created!' });
        setShowCreate(false);
        setEditingPromo(null);
        resetForm();
        fetchPromotions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save promotion' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (promo: Promotion) => {
    setForm({
      name: promo.name,
      headline: promo.headline || '',
      subheadline: promo.subheadline || '',
      description: promo.description || '',
      cta_text: promo.cta_text || 'Learn More',
      cta_url: promo.cta_url || '',
      promo_code: promo.promo_code || '',
      image_url: promo.image_url || '',
      display_locations: promo.display_locations || ['homepage'],
      display_as: promo.display_as || 'banner',
      starts_at: promo.starts_at?.split('T')[0] || '',
      ends_at: promo.ends_at?.split('T')[0] || '',
      is_active: promo.is_active,
      priority: promo.priority,
    });
    setEditingPromo(promo);
    setShowCreate(true);
  };

  const handleToggleActive = async (promo: Promotion) => {
    try {
      await fetch('/api/cms/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, action: promo.is_active ? 'deactivate' : 'activate' }),
      });
      fetchPromotions();
    } catch {
      setMessage({ type: 'error', text: 'Failed to toggle promotion' });
    }
  };

  const handleDelete = async (promo: Promotion) => {
    if (!window.confirm(`Delete "${promo.name}"? This cannot be undone.`)) return;

    try {
      await fetch(`/api/cms/promotions?id=${promo.id}`, { method: 'DELETE' });
      fetchPromotions();
      setMessage({ type: 'success', text: 'Promotion deleted' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const activeCount = promotions.filter(p => p.is_active).length;

  return (
    <OwnerLayout title="Offers & Promotions" description="Create and manage promotional content">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
          <button onClick={() => setMessage(null)} className="float-right">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-green-100 rounded-lg">
            <span className="text-green-700 font-medium">{activeCount} Active</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg">
            <span className="text-black">{promotions.length} Total</span>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setEditingPromo(null); setShowCreate(true); }}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          + Create Promotion
        </button>
      </div>

      {/* Promotions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : promotions.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {promotions.map(promo => (
            <div
              key={promo.id}
              className={`bg-white rounded-xl border overflow-hidden ${!promo.is_active ? 'opacity-60' : ''}`}
            >
              {promo.image_url && (
                <div className="h-32 bg-white" style={{ backgroundImage: `url(${promo.image_url})`, backgroundSize: 'cover' }} />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{promo.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-white text-black'}`}>
                    {promo.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {promo.headline && (
                  <p className="text-sm text-black mb-2">{promo.headline}</p>
                )}
                <div className="flex flex-wrap gap-1 mb-3">
                  {promo.display_locations?.map((loc: string) => (
                    <span key={loc} className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded">{loc}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-black">
                  <span>{promo.views || 0} views • {promo.clicks || 0} clicks</span>
                  {promo.ends_at && (
                    <span>Ends {new Date(promo.ends_at).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleToggleActive(promo)}
                    className={`flex-1 py-1 rounded text-xs ${promo.is_active ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}
                  >
                    {promo.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(promo)}
                    className="flex-1 py-1 bg-white rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo)}
                    className="py-1 px-2 bg-red-50 text-red-600 rounded text-xs"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-4xl block mb-3">🎉</span>
          <h3 className="font-medium text-black mb-1">No promotions yet</h3>
          <p className="text-sm text-black mb-4">Create your first promotion to drive engagement</p>
          <button
            onClick={() => { resetForm(); setShowCreate(true); }}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg"
          >
            + Create Promotion
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 my-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{editingPromo ? 'Edit Promotion' : 'Create Promotion'}</h2>
              <button onClick={() => { setShowCreate(false); setEditingPromo(null); }} className="text-black hover:text-black">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Promotion Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Summer Special"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Headline</label>
                <input
                  type="text"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., FREE Vitamin with Botox"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Subheadline</label>
                <input
                  type="text"
                  value={form.subheadline}
                  onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">CTA Text</label>
                <input
                  type="text"
                  value={form.cta_text}
                  onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">CTA URL</label>
                <input
                  type="text"
                  value={form.cta_url}
                  onChange={(e) => setForm({ ...form, cta_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="/book or https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Promo Code</label>
                <input
                  type="text"
                  value={form.promo_code}
                  onChange={(e) => setForm({ ...form, promo_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="SUMMER2024"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Display As</label>
                <select
                  value={form.display_as}
                  onChange={(e) => setForm({ ...form, display_as: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="banner">Top Banner</option>
                  <option value="popup">Popup</option>
                  <option value="inline">Inline Section</option>
                  <option value="floating">Floating Button</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black mb-1">End Date</label>
                <input
                  type="date"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-black mb-2">Display Locations</label>
                <div className="flex flex-wrap gap-2">
                  {['homepage', 'services', 'booking', 'checkout', 'all'].map(loc => (
                    <button
                      key={loc}
                      onClick={() => {
                        const locs = form.display_locations.includes(loc)
                          ? form.display_locations.filter(l => l !== loc)
                          : [...form.display_locations, loc];
                        setForm({ ...form, display_locations: locs });
                      }}
                      className={`px-3 py-1 rounded-full text-sm ${
                        form.display_locations.includes(loc)
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-white text-black'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-3 pt-4 border-t">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm text-black">Activate immediately</label>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowCreate(false); setEditingPromo(null); }} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name}
                className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingPromo ? 'Update Promotion' : 'Create Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}
