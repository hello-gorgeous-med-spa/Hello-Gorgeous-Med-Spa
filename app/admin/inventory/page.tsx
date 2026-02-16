'use client';

// ============================================================
// INVENTORY MANAGEMENT PAGE
// Clinical-grade inventory tracking - Connected to Live API Data
// ============================================================

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Breadcrumb, ExportButton, NoDataEmptyState } from '@/components/ui';

// Skeleton component
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-white rounded ${className}`} />;
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
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for API data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'supplies',
    sku: '',
    reorder_point: 10,
    price_per_unit: 0,
    cost_per_unit: 0,
  });

  const [receiveForm, setReceiveForm] = useState({
    product_id: '',
    quantity: 0,
    lot_number: '',
    expiration_date: '',
    cost_per_unit: 0,
    notes: '',
  });

  // Fetch inventory from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (showLowStockOnly) params.append('lowStockOnly', 'true');
        if (searchQuery) params.append('search', searchQuery);

        const res = await fetch(`/api/inventory?${params}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        // Map API response to component format
        const items = (data.inventory || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand,
          category: item.category,
          sku: item.sku,
          currentStock: item.currentStock || 0,
          reorderPoint: item.reorder_point || 10,
          price: item.price_per_unit || 0,
          cost: item.cost_per_unit || 0,
          lots: item.lots,
        }));
        
        setInventory(items);
        setError(null);
      } catch (err) {
        console.error('Error loading inventory:', err);
        setError('Failed to load inventory');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [selectedCategory, showLowStockOnly, searchQuery]);

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

  // Add new product
  const handleAddProduct = async () => {
    if (!productForm.name) return;
    setSaving(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Product added!' });
        setShowAddProductModal(false);
        setProductForm({ name: '', brand: '', category: 'supplies', sku: '', reorder_point: 10, price_per_unit: 0, cost_per_unit: 0 });
        // Refresh inventory
        const refreshRes = await fetch('/api/inventory');
        const data = await refreshRes.json();
        setInventory((data.inventory || []).map((item: any) => ({
          id: item.id, name: item.name, brand: item.brand, category: item.category,
          sku: item.sku, currentStock: item.currentStock || 0, reorderPoint: item.reorder_point || 10,
          price: item.price_per_unit || 0, cost: item.cost_per_unit || 0, lots: item.lots,
        })));
      } else {
        setMessage({ type: 'error', text: 'Failed to add product' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add product' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Edit product
  const handleEditProduct = async () => {
    if (!selectedItem) return;
    setSaving(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedItem.id, ...productForm }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Product updated!' });
        setShowEditProductModal(false);
        setSelectedItem(null);
        // Refresh
        const refreshRes = await fetch('/api/inventory');
        const data = await refreshRes.json();
        setInventory((data.inventory || []).map((item: any) => ({
          id: item.id, name: item.name, brand: item.brand, category: item.category,
          sku: item.sku, currentStock: item.currentStock || 0, reorderPoint: item.reorder_point || 10,
          price: item.price_per_unit || 0, cost: item.cost_per_unit || 0, lots: item.lots,
        })));
      } else {
        setMessage({ type: 'error', text: 'Failed to update product' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update product' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Receive stock
  const handleReceiveStock = async () => {
    if (!receiveForm.product_id || receiveForm.quantity <= 0) return;
    setSaving(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: receiveForm.product_id,
          action: 'receive_stock',
          quantity: receiveForm.quantity,
          lot_number: receiveForm.lot_number,
          expiration_date: receiveForm.expiration_date,
          cost_per_unit: receiveForm.cost_per_unit,
          notes: receiveForm.notes,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessage({ type: 'success', text: `Stock received! New total: ${data.newStock}` });
        setShowReceiveModal(false);
        setSelectedItem(null);
        setReceiveForm({ product_id: '', quantity: 0, lot_number: '', expiration_date: '', cost_per_unit: 0, notes: '' });
        // Refresh
        const refreshRes = await fetch('/api/inventory');
        const refreshData = await refreshRes.json();
        setInventory((refreshData.inventory || []).map((item: any) => ({
          id: item.id, name: item.name, brand: item.brand, category: item.category,
          sku: item.sku, currentStock: item.currentStock || 0, reorderPoint: item.reorder_point || 10,
          price: item.price_per_unit || 0, cost: item.cost_per_unit || 0, lots: item.lots,
        })));
      } else {
        setMessage({ type: 'error', text: 'Failed to receive stock' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to receive stock' });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Delete product
  const handleDeleteProduct = async (item: InventoryItem) => {
    if (!window.confirm(`Delete ${item.name}? This will hide it from the inventory list.`)) return;
    try {
      const res = await fetch(`/api/inventory?id=${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        setInventory(prev => prev.filter(i => i.id !== item.id));
        setMessage({ type: 'success', text: 'Product deleted' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  // Export columns
  const exportColumns = [
    { key: 'name', label: 'Product Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'sku', label: 'SKU' },
    { key: 'currentStock', label: 'Current Stock' },
    { key: 'reorderPoint', label: 'Reorder At' },
    { key: 'cost', label: 'Cost/Unit', format: (v: number) => `$${v}` },
    { key: 'price', label: 'Price/Unit', format: (v: number) => `$${v}` },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Inventory</h1>
          <p className="text-black">Track products, lots, and stock levels</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            data={inventory}
            filename="inventory"
            columns={exportColumns}
          />
          <button
            onClick={() => {
              setProductForm({ name: '', brand: '', category: 'supplies', sku: '', reorder_point: 10, price_per_unit: 0, cost_per_unit: 0 });
              setShowAddProductModal(true);
            }}
            className="px-4 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black transition-colors"
          >
            + Add Product
          </button>
          <button
            onClick={() => {
              setReceiveForm({ product_id: '', quantity: 0, lot_number: '', expiration_date: '', cost_per_unit: 0, notes: '' });
              setShowReceiveModal(true);
            }}
            className="px-4 py-2 border border-black text-black font-medium rounded-lg hover:bg-white transition-colors"
          >
            Receive Stock
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}


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
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Total Products</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-black">{stats.total}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Low Stock Alerts</p>
          {loading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className={`text-2xl font-bold ${stats.lowStock > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {stats.lowStock}
            </p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Inventory Value</p>
          {loading ? (
            <Skeleton className="h-8 w-24 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-black">${stats.totalValue.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-black p-4">
          <p className="text-sm text-black">Categories</p>
          {loading ? (
            <Skeleton className="h-8 w-12 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-black">{stats.categories}</p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">🔍</span>
              <input
                type="text"
                placeholder="Search by name, brand, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-black rounded-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-black rounded-lg"
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
            <span className="text-sm text-black">Low Stock Only</span>
          </label>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-black overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-black">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Product</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Category</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Reorder At</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Cost/Unit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Price/Unit</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-black">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
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
                  <td colSpan={8} className="px-4 py-4">
                    <NoDataEmptyState type="products" />
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-white">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-black">{item.name}</p>
                        {item.brand && (
                          <p className="text-sm text-black">{item.brand}</p>
                        )}
                        {item.sku && (
                          <p className="text-xs text-black">SKU: {item.sku}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium bg-white text-black rounded-full">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${
                        item.currentStock <= item.reorderPoint ? 'text-red-600' : 'text-black'
                      }`}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black">{item.reorderPoint}</td>
                    <td className="px-4 py-3 text-black">${item.cost}</td>
                    <td className="px-4 py-3 font-medium text-black">${item.price}</td>
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setProductForm({
                              name: item.name,
                              brand: item.brand || '',
                              category: item.category,
                              sku: item.sku || '',
                              reorder_point: item.reorderPoint,
                              price_per_unit: item.price,
                              cost_per_unit: item.cost,
                            });
                            setShowEditProductModal(true);
                          }}
                          className="px-2 py-1 text-sm font-medium text-black hover:bg-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setReceiveForm({ ...receiveForm, product_id: item.id, cost_per_unit: item.cost });
                            setShowReceiveModal(true);
                          }}
                          className="px-2 py-1 text-sm font-medium text-pink-600 hover:bg-pink-50 rounded"
                        >
                          +Stock
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item)}
                          className="px-2 py-1 text-sm text-black hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          Del
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
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">{selectedItem.name}</h2>
              {selectedItem.brand && (
                <p className="text-black">{selectedItem.brand}</p>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-black">Current Stock</p>
                  <p className="text-lg font-bold text-black">{selectedItem.currentStock}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Reorder Point</p>
                  <p className="text-lg font-bold text-black">{selectedItem.reorderPoint}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Cost per Unit</p>
                  <p className="text-lg font-bold text-black">${selectedItem.cost}</p>
                </div>
                <div>
                  <p className="text-sm text-black">Price per Unit</p>
                  <p className="text-lg font-bold text-black">${selectedItem.price}</p>
                </div>
              </div>

              {/* Lot Information */}
              <div>
                <h3 className="font-medium text-black mb-2">Lot Tracking (FIFO)</h3>
                <div className="bg-white rounded-lg p-4 text-sm text-black">
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
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => setShowReceiveModal(true)}
                className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black"
              >
                Add Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Add Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product Name *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  placeholder="e.g., Botox, Juvederm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="e.g., Allergan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">SKU</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={productForm.reorder_point}
                    onChange={(e) => setProductForm({...productForm, reorder_point: parseInt(e.target.value) || 10})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Cost per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.cost_per_unit}
                    onChange={(e) => setProductForm({...productForm, cost_per_unit: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Price per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price_per_unit}
                    onChange={(e) => setProductForm({...productForm, price_per_unit: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => setShowAddProductModal(false)} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button onClick={handleAddProduct} disabled={saving || !productForm.name} className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50">
                {saving ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedItem && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Edit Product</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-2 border border-black rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Brand</label>
                  <input type="text" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} className="w-full px-4 py-2 border border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Category</label>
                  <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-2 border border-black rounded-lg">
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">SKU</label>
                  <input type="text" value={productForm.sku} onChange={(e) => setProductForm({...productForm, sku: e.target.value})} className="w-full px-4 py-2 border border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Reorder Point</label>
                  <input type="number" value={productForm.reorder_point} onChange={(e) => setProductForm({...productForm, reorder_point: parseInt(e.target.value) || 10})} className="w-full px-4 py-2 border border-black rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Cost per Unit ($)</label>
                  <input type="number" step="0.01" value={productForm.cost_per_unit} onChange={(e) => setProductForm({...productForm, cost_per_unit: parseFloat(e.target.value) || 0})} className="w-full px-4 py-2 border border-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Price per Unit ($)</label>
                  <input type="number" step="0.01" value={productForm.price_per_unit} onChange={(e) => setProductForm({...productForm, price_per_unit: parseFloat(e.target.value) || 0})} className="w-full px-4 py-2 border border-black rounded-lg" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => { setShowEditProductModal(false); setSelectedItem(null); }} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button onClick={handleEditProduct} disabled={saving} className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b border-black">
              <h2 className="text-xl font-bold text-black">Receive Stock</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product *</label>
                <select 
                  value={receiveForm.product_id}
                  onChange={(e) => setReceiveForm({...receiveForm, product_id: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                >
                  <option value="">Select product...</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} (Current: {item.currentStock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Quantity *</label>
                  <input
                    type="number"
                    value={receiveForm.quantity || ''}
                    onChange={(e) => setReceiveForm({...receiveForm, quantity: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Lot Number</label>
                  <input
                    type="text"
                    value={receiveForm.lot_number}
                    onChange={(e) => setReceiveForm({...receiveForm, lot_number: e.target.value})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                    placeholder="LOT-XXXX"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={receiveForm.expiration_date}
                    onChange={(e) => setReceiveForm({...receiveForm, expiration_date: e.target.value})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Cost per Unit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={receiveForm.cost_per_unit || ''}
                    onChange={(e) => setReceiveForm({...receiveForm, cost_per_unit: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Notes</label>
                <textarea
                  value={receiveForm.notes}
                  onChange={(e) => setReceiveForm({...receiveForm, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                  rows={2}
                  placeholder="Invoice #, vendor notes..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-black flex justify-end gap-3">
              <button onClick={() => { setShowReceiveModal(false); setSelectedItem(null); }} className="px-4 py-2 text-black font-medium hover:bg-white rounded-lg">Cancel</button>
              <button onClick={handleReceiveStock} disabled={saving || !receiveForm.product_id || receiveForm.quantity <= 0} className="px-6 py-2 bg-[#FF2D8E] text-white font-medium rounded-lg hover:bg-black disabled:opacity-50">
                {saving ? 'Receiving...' : 'Receive Stock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
