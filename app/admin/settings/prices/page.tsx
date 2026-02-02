'use client';

// ============================================================
// PRICE MANAGER - Change All Service Prices Without Code
// Centralized pricing control with bulk editing
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServicePrice {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  price_display: string;
  duration_minutes: number;
  is_active: boolean;
}

export default function PriceManagerPage() {
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editedPrices, setEditedPrices] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.services) {
        setServices(data.services.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: s.category?.name || 'Uncategorized',
          price_cents: s.price_cents || 0,
          price_display: s.price_display || '$0',
          duration_minutes: s.duration_minutes || 30,
          is_active: s.is_active !== false,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices = services.filter(s => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updatePrice = (serviceId: string, newPriceCents: number) => {
    setEditedPrices(prev => ({ ...prev, [serviceId]: newPriceCents }));
  };

  const hasChanges = Object.keys(editedPrices).length > 0;

  const saveAllPrices = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const updates = Object.entries(editedPrices).map(([id, price_cents]) => ({
        id,
        price_cents,
        price_display: `$${(price_cents / 100).toFixed(price_cents % 100 === 0 ? 0 : 2)}`,
      }));

      // Save each updated price
      for (const update of updates) {
        await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update),
        });
      }

      // Update local state
      setServices(prev => prev.map(s => {
        if (editedPrices[s.id] !== undefined) {
          const price_cents = editedPrices[s.id];
          return {
            ...s,
            price_cents,
            price_display: `$${(price_cents / 100).toFixed(price_cents % 100 === 0 ? 0 : 2)}`,
          };
        }
        return s;
      }));

      setEditedPrices({});
      setMessage({ type: 'success', text: `${updates.length} price(s) updated successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save prices' });
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setEditedPrices({});
  };

  const applyBulkChange = (percentage: number) => {
    const newPrices: Record<string, number> = {};
    filteredServices.forEach(s => {
      const currentPrice = editedPrices[s.id] ?? s.price_cents;
      const newPrice = Math.round(currentPrice * (1 + percentage / 100));
      newPrices[s.id] = newPrice;
    });
    setEditedPrices(prev => ({ ...prev, ...newPrices }));
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Price Manager</h1>
          <p className="text-gray-500">Loading services...</p>
        </div>
        <div className="bg-white rounded-xl border p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/settings" className="hover:text-pink-600">Settings</Link>
            <span>/</span>
            <span>Price Manager</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Price Manager</h1>
          <p className="text-gray-500">{services.length} services • Change prices without code</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-amber-600">
              {Object.keys(editedPrices).length} unsaved change(s)
            </span>
            <button
              onClick={discardChanges}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Discard
            </button>
            <button
              onClick={saveAllPrices}
              disabled={saving}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Prices'}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Filters & Bulk Actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Bulk adjust:</span>
          <button
            onClick={() => applyBulkChange(-10)}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            -10%
          </button>
          <button
            onClick={() => applyBulkChange(-5)}
            className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
          >
            -5%
          </button>
          <button
            onClick={() => applyBulkChange(5)}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
          >
            +5%
          </button>
          <button
            onClick={() => applyBulkChange(10)}
            className="px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100"
          >
            +10%
          </button>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Service</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Category</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Duration</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Current Price</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">New Price</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredServices.map(service => {
              const currentPrice = service.price_cents;
              const editedPrice = editedPrices[service.id];
              const hasEdit = editedPrice !== undefined;
              const displayPrice = hasEdit ? editedPrice : currentPrice;

              return (
                <tr key={service.id} className={`hover:bg-gray-50 ${hasEdit ? 'bg-amber-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${service.is_active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {service.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{service.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{service.duration_minutes} min</td>
                  <td className="px-4 py-3">
                    <span className={hasEdit ? 'line-through text-gray-400' : 'text-gray-900'}>
                      {formatPrice(currentPrice)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={(displayPrice / 100).toFixed(2)}
                        onChange={(e) => {
                          const dollars = parseFloat(e.target.value) || 0;
                          updatePrice(service.id, Math.round(dollars * 100));
                        }}
                        className={`w-24 px-2 py-1 border rounded text-right ${hasEdit ? 'border-amber-400 bg-white' : ''}`}
                        step="0.01"
                        min="0"
                      />
                      {hasEdit && (
                        <button
                          onClick={() => {
                            const newEdited = { ...editedPrices };
                            delete newEdited[service.id];
                            setEditedPrices(newEdited);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ↩
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {service.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No services found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
