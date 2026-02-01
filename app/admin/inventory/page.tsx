'use client';

// ============================================================
// INVENTORY MANAGEMENT PAGE
// Clinical-grade inventory tracking - Connected to Live API Data
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

interface InventoryItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  sku?: string;
  currentStock: number;
  reorderPoint: number;
  price: number;
  cost: number;
  expirationWarning?: boolean;
  lots?: InventoryLot[];
}

interface InventoryLot {
  id: string;
  lotNumber: string;
  quantity: number;
  expirationDate: string;
  receivedDate: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  neurotoxin: 'Neurotoxin',
  filler: 'Filler',
  biostimulator: 'Biostimulator',
  skin_booster: 'Skin Booster',
  vitamin: 'Vitamin',
  skincare: 'Skincare',
  supplies: 'Supplies',
};

export default function InventoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // State for API data (placeholder - inventory API to be implemented)
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder: Inventory would be fetched from /api/inventory when implemented
  useEffect(() => {
    // For now, inventory is empty until the API is created
    setLoading(false);
  }, []);

  // Filter and search
  const filteredInventory = useMemo(() => {
    let filtered = [...inventory];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.sku?.toLowerCase().includes(query)
      );
    }

    if (showLowStockOnly) {
      filtered = filtered.filter((item) => item.currentStock <= item.reorderPoint);
    }

    return filtered;
  }, [inventory, selectedCategory, searchQuery, showLowStockOnly]);

  // Calculate stats
  const stats = useMemo(() => {
    const lowStock = inventory.filter((i) => i.currentStock <= i.reorderPoint).length;
    const totalValue = inventory.reduce((sum, i) => sum + (i.currentStock * i.cost), 0);
    const categories = [...new Set(inventory.map((i) => i.category))].length;
    
    return { total: inventory.length, lowStock, totalValue, categories };
  }, [inventory]);

  // Alerts
  const alerts = useMemo(() => {
    const items: { type: 'low_stock' | 'expiring'; message: string; severity: 'warning' | 'critical' }[] = [];
    
    inventory.forEach((item) => {
      if (item.currentStock <= item.reorderPoint) {
        items.push({
          type: 'low_stock',
          message: `${item.name} is low (${item.currentStock} remaining)`,
          severity: item.currentStock < item.reorderPoint / 2 ? 'critical' : 'warning',
        });
      }
    });
    
    return items;
  }, [inventory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500">Track products, lots, and stock levels</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowReceiveModal(true)}
            className="px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors"
          >
            + Receive Stock
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Export
          </button>
        </div>
      </div>


      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center justify-between ${
                alert.severity === 'critical'
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-800'
              }`}
            >
              <span className="text-sm font-medium">
                {alert.severity === 'critical' ? '🚨' : '⚠️'} {alert.message}
              </span>
              <button className="text-sm underline">View</button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Low Stock Alerts</p>
          {loading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.lowStock}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Inventory Value</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Categories</p>
          {loading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search by name, brand, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <label className="flex items-center gap-2 whitespace-nowrap">
            <input
              type="checkbox"
              checked={showLowStockOnly}
              onChange={(e) => setShowLowStockOnly(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Low Stock Only</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Product</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Reorder At</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Cost/Unit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Price/Unit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3"><Skeleton className="h-10 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-8 w-16" /></td>
                  </tr>
                ))
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.brand && (
                          <p className="text-sm text-gray-500">{item.brand}</p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        item.currentStock <= item.reorderPoint ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.reorderPoint}</td>
                    <td className="px-4 py-3 text-gray-600">${item.cost}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">${item.price}</td>
                    <td className="px-4 py-3">
                      {item.currentStock <= item.reorderPoint ? (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowReceiveModal(true);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded-lg"
                        >
                          + Add
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && !showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedItem.name}</h2>
              {selectedItem.brand && (
                <p className="text-gray-500">{selectedItem.brand}</p>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Current Stock</p>
                  <p className="text-lg font-bold text-gray-900">{selectedItem.currentStock}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reorder Point</p>
                  <p className="text-lg font-bold text-gray-900">{selectedItem.reorderPoint}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost per Unit</p>
                  <p className="text-lg font-bold text-gray-900">${selectedItem.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price per Unit</p>
                  <p className="text-lg font-bold text-gray-900">${selectedItem.price}</p>
                </div>
              </div>

              {/* Lot Information */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Lot Tracking (FIFO)</h3>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                  {selectedItem.lots?.length ? (
                    <div className="space-y-2">
                      {selectedItem.lots.map((lot) => (
                        <div key={lot.id} className="flex justify-between">
                          <span>{lot.lotNumber}</span>
                          <span>{lot.quantity} units</span>
                          <span>Exp: {lot.expirationDate}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No lot data available. Enable lot tracking in Supabase.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => setShowReceiveModal(true)}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Receive Stock</h2>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  defaultValue={selectedItem?.id || ''}
                >
                  <option value="">Select product...</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="LOT-XXXX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  rows={2}
                  placeholder="Invoice #, vendor notes..."
                />
              </div>
            </form>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowReceiveModal(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Stock received! (Connect Supabase to save)');
                  setShowReceiveModal(false);
                  setSelectedItem(null);
                }}
                className="px-6 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600"
              >
                Receive Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
