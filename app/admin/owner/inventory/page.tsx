'use client';

// ============================================================
// INVENTORY & INJECTABLES - OWNER CONTROLLED
// Inventory table with lot tracking and expiration
// ============================================================

import { useState } from 'react';
import OwnerLayout from '../layout-wrapper';

interface Product {
  id: string;
  name: string;
  category: string;
  lot: string;
  expiration: string;
  quantity: number;
  reorderLevel: number;
  status: 'in_stock' | 'low' | 'expired' | 'out';
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Botox 100u', category: 'Neurotoxin', lot: 'BTX-2024-A123', expiration: '2025-06-15', quantity: 45, reorderLevel: 20, status: 'in_stock' },
    { id: '2', name: 'Botox 100u', category: 'Neurotoxin', lot: 'BTX-2024-B456', expiration: '2025-03-01', quantity: 12, reorderLevel: 20, status: 'low' },
    { id: '3', name: 'Juvederm Ultra', category: 'Filler', lot: 'JUV-2024-C789', expiration: '2025-08-20', quantity: 30, reorderLevel: 10, status: 'in_stock' },
    { id: '4', name: 'Juvederm Voluma', category: 'Filler', lot: 'JUV-2024-D012', expiration: '2025-02-15', quantity: 8, reorderLevel: 10, status: 'low' },
    { id: '5', name: 'Restylane Lyft', category: 'Filler', lot: 'RST-2024-E345', expiration: '2024-12-01', quantity: 5, reorderLevel: 5, status: 'expired' },
    { id: '6', name: 'Dysport 300u', category: 'Neurotoxin', lot: 'DYS-2024-F678', expiration: '2025-09-30', quantity: 20, reorderLevel: 10, status: 'in_stock' },
    { id: '7', name: 'Sculptra', category: 'Biostimulator', lot: 'SCP-2024-G901', expiration: '2025-12-01', quantity: 15, reorderLevel: 5, status: 'in_stock' },
  ]);

  const [settings, setSettings] = useState({
    blockExpired: true,
    lowStockThreshold: 30,
    requireLotSelection: true,
    expirationWarningDays: 30,
  });

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const statuses = ['all', 'in_stock', 'low', 'expired', 'out'];

  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const lowStockCount = products.filter(p => p.status === 'low').length;
  const expiredCount = products.filter(p => p.status === 'expired').length;
  const expiringCount = products.filter(p => {
    const expDate = new Date(p.expiration);
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + settings.expirationWarningDays);
    return expDate <= warningDate && p.status !== 'expired';
  }).length;

  const saveSettings = () => {
    setMessage({ type: 'success', text: 'Inventory settings saved!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-700';
      case 'low': return 'bg-amber-100 text-amber-700';
      case 'expired': return 'bg-red-100 text-red-700';
      case 'out': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <OwnerLayout title="Inventory & Injectables" description="Track products, lots, and expiration dates">
      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Alerts */}
      {(lowStockCount > 0 || expiredCount > 0 || expiringCount > 0) && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {lowStockCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">⚠️</span>
                <span className="font-medium text-amber-800">{lowStockCount} products low on stock</span>
              </div>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-orange-500">⏰</span>
                <span className="font-medium text-orange-800">{expiringCount} products expiring soon</span>
              </div>
            </div>
          )}
          {expiredCount > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-red-500">🛑</span>
                <span className="font-medium text-red-800">{expiredCount} products expired</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Inventory Table</h2>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                + Add Product
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st === 'all' ? 'All Status' : st.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">PRODUCT</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">LOT</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">EXP</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">QTY</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${product.status === 'expired' ? 'bg-red-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{product.lot}</td>
                    <td className="px-4 py-3 text-sm">{product.expiration}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{product.quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(product.status)}`}>
                        {product.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-4">⚙️ Controls</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.blockExpired}
                  onChange={(e) => setSettings(prev => ({ ...prev, blockExpired: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <div>
                  <span className="font-medium text-sm">Block Expired Usage</span>
                  <p className="text-xs text-gray-500">Prevent expired products from being used</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireLotSelection}
                  onChange={(e) => setSettings(prev => ({ ...prev, requireLotSelection: e.target.checked }))}
                  className="w-5 h-5 text-purple-600"
                />
                <div>
                  <span className="font-medium text-sm">Require Lot Selection</span>
                  <p className="text-xs text-gray-500">Must select lot when charting</p>
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Percentage below reorder level</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Warning (days)</label>
                <input
                  type="number"
                  value={settings.expirationWarningDays}
                  onChange={(e) => setSettings(prev => ({ ...prev, expirationWarningDays: parseInt(e.target.value) || 30 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="1"
                />
              </div>

              <button onClick={saveSettings} className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save Settings
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">📊 Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Products</span>
                <span className="font-medium">{products.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">In Stock</span>
                <span className="font-medium text-green-600">{products.filter(p => p.status === 'in_stock').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Low Stock</span>
                <span className="font-medium text-amber-600">{lowStockCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Expired</span>
                <span className="font-medium text-red-600">{expiredCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
}
