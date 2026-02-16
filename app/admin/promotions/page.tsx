'use client';

// ============================================================
// PROMOTIONS & COUPONS PAGE
// Create and manage discount codes
// ============================================================

import { useState, useEffect } from 'react';

interface Promotion {
  id: string;
  name: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  usage_limit: number | null;
  usage_count: number;
  start_date: string | null;
  end_date: string | null;
  applies_to: 'all' | 'services' | 'products';
  service_ids: string[] | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');

  const [form, setForm] = useState({
    name: '',
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 10,
    min_purchase: 0,
    usage_limit: '',
    start_date: '',
    end_date: '',
    applies_to: 'all' as 'all' | 'services' | 'products',
    description: '',
  });

  // Load promotions
  useEffect(() => {
    fetchPromotions();
  }, [filterStatus]);

  const fetchPromotions = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      const res = await fetch(`/api/promotions?${params}`);
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error('Error loading promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check if promo is active
  const isPromoActive = (promo: Promotion) => {
    if (!promo.is_active) return false;
    const now = new Date();
    if (promo.end_date && new Date(promo.end_date) < now) return false;
    if (promo.usage_limit && promo.usage_count >= promo.usage_limit) return false;
    return true;
  };

  // Save promotion
  const handleSave = async () => {
    if (!form.name || !form.discount_value) return;
    setSaving(true);
    try {
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        name: form.name,
        code: form.code || undefined,
        discount_type: form.discount_type,
        discount_value: form.discount_value,
        min_purchase: form.min_purchase || 0,
        usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        applies_to: form.applies_to,
        description: form.description || null,
      };

      const res = await fetch('/api/promotions', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: editing ? 'Promotion updated!' : `Promotion created! Code: ${data.promotion?.code || form.code}` });
        setShowModal(false);
        setEditing(null);
        resetForm();
        fetchPromotions();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save promotion' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save promotion' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 5000);
  };

  // Delete promotion
  const handleDelete = async (promo: Promotion) => {
    if (!window.confirm(`Delete "${promo.name}" (${promo.code})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/promotions?id=${promo.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPromotions(prev => prev.filter(p => p.id !== promo.id));
        setMessage({ type: 'success', text: 'Promotion deleted' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete promotion' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Toggle active status
  const toggleActive = async (promo: Promotion) => {
    try {
      const res = await fetch('/api/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: promo.id, is_active: !promo.is_active }),
      });
      if (res.ok) {
        setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, is_active: !p.is_active } : p));
      }
    } catch (err) {
      console.error('Error toggling promo:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: '',
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase: 0,
      usage_limit: '',
      start_date: '',
      end_date: '',
      applies_to: 'all',
      description: '',
    });
  };

  // Open edit modal
  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    setForm({
      name: promo.name,
      code: promo.code,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_purchase: promo.min_purchase,
      usage_limit: promo.usage_limit?.toString() || '',
      start_date: promo.start_date?.split('T')[0] || '',
      end_date: promo.end_date?.split('T')[0] || '',
      applies_to: promo.applies_to,
      description: promo.description || '',
    });
    setShowModal(true);
  };

  // Stats
  const activeCount = promotions.filter(isPromoActive).length;
  const totalUsage = promotions.reduce((sum, p) => sum + (p.usage_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Promotions & Coupons</h1>
          <p className="text-black">Create and manage discount codes</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditing(null); setShowModal(true); }}
          className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
        >
          + Create Promotion
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Promotions</p>
          <p className="text-2xl font-bold text-black">{promotions.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Active</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Uses</p>
          <p className="text-2xl font-bold text-black">{totalUsage}</p>
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Expired/Inactive</p>
          <p className="text-2xl font-bold text-black">{promotions.length - activeCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-black rounded-lg"
        >
          <option value="all">All Promotions</option>
          <option value="active">Active Only</option>
          <option value="expired">Expired/Inactive</option>
        </select>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-black">Loading promotions...</div>
        ) : promotions.length === 0 ? (
          <div className="p-12 text-center text-black">
            <span className="text-4xl block mb-4">🏷️</span>
            <p>No promotions yet</p>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="mt-4 text-pink-600 font-medium"
            >
              Create your first promotion
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-black">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Code</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Name</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Discount</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Usage</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Valid</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-black">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {promotions.map(promo => (
                  <tr key={promo.id} className="hover:bg-white">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-semibold text-pink-600 bg-pink-50 px-2 py-1 rounded">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-black">{promo.name}</p>
                      {promo.description && (
                        <p className="text-xs text-black">{promo.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-black">
                        {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `$${promo.discount_value}`}
                      </span>
                      {promo.min_purchase > 0 && (
                        <p className="text-xs text-black">Min ${promo.min_purchase}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-black">{promo.usage_count}</span>
                      {promo.usage_limit && (
                        <span className="text-black">/{promo.usage_limit}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-black">
                      {promo.start_date || promo.end_date ? (
                        <>
                          {promo.start_date && new Date(promo.start_date).toLocaleDateString()}
                          {promo.start_date && promo.end_date && ' - '}
                          {promo.end_date && new Date(promo.end_date).toLocaleDateString()}
                        </>
                      ) : (
                        'No expiry'
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleActive(promo)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isPromoActive(promo) ? 'bg-green-100 text-green-700' : 'bg-white text-black'
                        }`}
                      >
                        {isPromoActive(promo) ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(promo)}
                          className="px-2 py-1 text-sm text-black hover:bg-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(promo)}
                          className="px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">{editing ? 'Edit Promotion' : 'Create Promotion'}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Promotion Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="e.g., Valentine's Day 20% Off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Promo Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-black rounded-lg font-mono"
                  placeholder="Auto-generated if empty"
                  disabled={!!editing}
                />
                <p className="text-xs text-black mt-1">Leave empty to auto-generate a code</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Discount Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder={form.discount_type === 'percentage' ? 'e.g., 20' : 'e.g., 50'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Min Purchase ($)</label>
                  <input
                    type="number"
                    value={form.min_purchase || ''}
                    onChange={(e) => setForm({ ...form, min_purchase: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="0 = no minimum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usage_limit}
                    onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="Unlimited if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Start Date</label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">End Date</label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={2}
                  placeholder="Internal notes or terms..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.discount_value}
                className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Update' : 'Create Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
