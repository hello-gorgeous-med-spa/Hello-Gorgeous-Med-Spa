'use client';

// ============================================================
// PROMOTION & COUPON CREATOR - Create Discounts Without Code
// Set discount codes, rules, expiration dates
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface Promotion {
  id: string;
  name: string;
  code: string;
  type: 'percentage' | 'fixed' | 'bogo';
  value: number;
  min_purchase: number;
  max_discount?: number;
  applies_to: 'all' | 'services' | 'products' | 'specific';
  specific_items?: string[];
  start_date: string;
  end_date: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  is_single_use: boolean;
  new_clients_only: boolean;
}

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    name: 'New Client Special',
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    min_purchase: 0,
    applies_to: 'all',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    usage_count: 45,
    is_active: true,
    is_single_use: true,
    new_clients_only: true,
  },
  {
    id: 'promo-2',
    name: 'Holiday Special',
    code: 'HOLIDAY50',
    type: 'fixed',
    value: 50,
    min_purchase: 200,
    applies_to: 'services',
    start_date: '2024-12-01',
    end_date: '2024-12-31',
    usage_limit: 100,
    usage_count: 23,
    is_active: true,
    is_single_use: false,
    new_clients_only: false,
  },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(DEFAULT_PROMOTIONS);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewPromo = () => {
    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      name: '',
      code: '',
      type: 'percentage',
      value: 10,
      min_purchase: 0,
      applies_to: 'all',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usage_count: 0,
      is_active: true,
      is_single_use: false,
      new_clients_only: false,
    };
    setEditingPromo(newPromo);
    setIsCreating(true);
  };

  const savePromo = () => {
    if (!editingPromo?.name || !editingPromo?.code) {
      setMessage({ type: 'error', text: 'Name and code are required' });
      return;
    }

    if (isCreating) {
      setPromotions(prev => [...prev, editingPromo]);
      setMessage({ type: 'success', text: 'Promotion created!' });
    } else {
      setPromotions(prev => prev.map(p => p.id === editingPromo.id ? editingPromo : p));
      setMessage({ type: 'success', text: 'Promotion updated!' });
    }

    setEditingPromo(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const toggleActive = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p));
  };

  const deletePromo = (id: string) => {
    if (confirm('Delete this promotion?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (editingPromo) {
      setEditingPromo({ ...editingPromo, code });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Promotions</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions & Coupons</h1>
          <p className="text-gray-500">Create discount codes without code changes</p>
        </div>
        {!editingPromo && (
          <button
            onClick={createNewPromo}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            + Create Promotion
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Editor */}
      {editingPromo ? (
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Create Promotion' : 'Edit Promotion'}</h2>
            <button onClick={() => { setEditingPromo(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Name *</label>
              <input
                type="text"
                value={editingPromo.name}
                onChange={(e) => setEditingPromo({ ...editingPromo, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="e.g., Summer Sale"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingPromo.code}
                  onChange={(e) => setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })}
                  className="flex-1 px-4 py-2 border rounded-lg uppercase"
                  placeholder="SUMMER20"
                />
                <button onClick={generateCode} className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
                  Generate
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                value={editingPromo.type}
                onChange={(e) => setEditingPromo({ ...editingPromo, type: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
                <option value="bogo">Buy One Get One</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingPromo.type === 'percentage' ? 'Percentage' : editingPromo.type === 'fixed' ? 'Amount ($)' : 'Free Item Value'}
              </label>
              <input
                type="number"
                value={editingPromo.value}
                onChange={(e) => setEditingPromo({ ...editingPromo, value: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                max={editingPromo.type === 'percentage' ? 100 : undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Purchase ($)</label>
              <input
                type="number"
                value={editingPromo.min_purchase}
                onChange={(e) => setEditingPromo({ ...editingPromo, min_purchase: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={editingPromo.start_date}
                onChange={(e) => setEditingPromo({ ...editingPromo, start_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={editingPromo.end_date}
                onChange={(e) => setEditingPromo({ ...editingPromo, end_date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applies To</label>
              <select
                value={editingPromo.applies_to}
                onChange={(e) => setEditingPromo({ ...editingPromo, applies_to: e.target.value as any })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="all">All Services & Products</option>
                <option value="services">Services Only</option>
                <option value="products">Products Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (optional)</label>
              <input
                type="number"
                value={editingPromo.usage_limit || ''}
                onChange={(e) => setEditingPromo({ ...editingPromo, usage_limit: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPromo.is_single_use}
                onChange={(e) => setEditingPromo({ ...editingPromo, is_single_use: e.target.checked })}
                className="w-4 h-4 text-pink-500 rounded"
              />
              <span className="text-sm">Single use per client</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPromo.new_clients_only}
                onChange={(e) => setEditingPromo({ ...editingPromo, new_clients_only: e.target.checked })}
                className="w-4 h-4 text-pink-500 rounded"
              />
              <span className="text-sm">New clients only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingPromo.is_active}
                onChange={(e) => setEditingPromo({ ...editingPromo, is_active: e.target.checked })}
                className="w-4 h-4 text-pink-500 rounded"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingPromo(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={savePromo} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        /* Promotions List */
        <div className="bg-white rounded-xl border divide-y">
          {promotions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No promotions yet</p>
              <button onClick={createNewPromo} className="mt-4 text-pink-600 hover:text-pink-700">
                Create your first promotion
              </button>
            </div>
          ) : (
            promotions.map(promo => (
              <div key={promo.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{promo.name}</h3>
                      <code className="px-2 py-0.5 bg-gray-100 rounded text-sm font-mono">{promo.code}</code>
                      <span className={`text-xs px-2 py-0.5 rounded ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {promo.type === 'percentage' ? `${promo.value}% off` : promo.type === 'fixed' ? `$${promo.value} off` : 'Buy One Get One'}
                      {promo.min_purchase > 0 && ` • Min $${promo.min_purchase}`}
                      {promo.usage_limit && ` • ${promo.usage_count}/${promo.usage_limit} used`}
                      {promo.new_clients_only && ' • New clients only'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Valid: {new Date(promo.start_date).toLocaleDateString()} - {new Date(promo.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingPromo(promo)} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
                      Edit
                    </button>
                    <button onClick={() => deletePromo(promo.id)} className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded">
                      Delete
                    </button>
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${promo.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${promo.is_active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
