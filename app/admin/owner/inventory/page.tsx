'use client';

// ============================================================
// INVENTORY MANAGEMENT - OWNER CONTROLLED
// Products, lots, expiration, alerts
// ============================================================

import { useState } from 'react';
import Link from 'next/link';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  reorder_level: number;
  lots: LotInfo[];
  is_active: boolean;
}

interface LotInfo {
  id: string;
  lot_number: string;
  quantity: number;
  expiration_date: string;
  received_date: string;
}

const CATEGORIES = ['Neurotoxins', 'Fillers', 'Skincare', 'IV Supplies', 'Consumables', 'Equipment'];

export default function InventoryManagementPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      name: 'Botox Cosmetic',
      category: 'Neurotoxins',
      sku: 'BTX-100',
      quantity: 500,
      unit: 'units',
      cost_per_unit: 4.50,
      reorder_level: 100,
      lots: [
        { id: 'lot-1', lot_number: 'C4484A1', quantity: 300, expiration_date: '2024-12-15', received_date: '2024-01-15' },
        { id: 'lot-2', lot_number: 'C4485B2', quantity: 200, expiration_date: '2025-03-20', received_date: '2024-02-01' },
      ],
      is_active: true,
    },
    {
      id: 'inv-2',
      name: 'Dysport',
      category: 'Neurotoxins',
      sku: 'DYS-300',
      quantity: 900,
      unit: 'units',
      cost_per_unit: 2.80,
      reorder_level: 300,
      lots: [
        { id: 'lot-3', lot_number: 'L123456', quantity: 900, expiration_date: '2025-06-30', received_date: '2024-01-20' },
      ],
      is_active: true,
    },
    {
      id: 'inv-3',
      name: 'Juvederm Ultra Plus XC',
      category: 'Fillers',
      sku: 'JUV-UPX',
      quantity: 15,
      unit: 'syringes',
      cost_per_unit: 180.00,
      reorder_level: 5,
      lots: [
        { id: 'lot-4', lot_number: 'JV2024A', quantity: 15, expiration_date: '2025-09-15', received_date: '2024-02-10' },
      ],
      is_active: true,
    },
  ]);

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddLot, setShowAddLot] = useState(false);
  const [newLot, setNewLot] = useState({ lot_number: '', quantity: 0, expiration_date: '' });
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const createNewItem = () => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: '',
      category: 'Consumables',
      sku: '',
      quantity: 0,
      unit: 'units',
      cost_per_unit: 0,
      reorder_level: 10,
      lots: [],
      is_active: true,
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const saveItem = () => {
    if (!editingItem?.name) {
      setMessage({ type: 'error', text: 'Product name is required' });
      return;
    }

    if (isCreating) {
      setInventory(prev => [...prev, editingItem]);
      setMessage({ type: 'success', text: 'Product added to inventory!' });
    } else {
      setInventory(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
      setMessage({ type: 'success', text: 'Inventory updated!' });
    }

    setEditingItem(null);
    setIsCreating(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const addLot = () => {
    if (!editingItem || !newLot.lot_number || !newLot.expiration_date) {
      setMessage({ type: 'error', text: 'Lot number and expiration date are required' });
      return;
    }

    const lot: LotInfo = {
      id: `lot-${Date.now()}`,
      lot_number: newLot.lot_number,
      quantity: newLot.quantity,
      expiration_date: newLot.expiration_date,
      received_date: new Date().toISOString().split('T')[0],
    };

    setEditingItem({
      ...editingItem,
      lots: [...editingItem.lots, lot],
      quantity: editingItem.quantity + lot.quantity,
    });

    setNewLot({ lot_number: '', quantity: 0, expiration_date: '' });
    setShowAddLot(false);
  };

  const removeLot = (lotId: string) => {
    if (!editingItem) return;
    const lot = editingItem.lots.find(l => l.id === lotId);
    setEditingItem({
      ...editingItem,
      lots: editingItem.lots.filter(l => l.id !== lotId),
      quantity: editingItem.quantity - (lot?.quantity || 0),
    });
  };

  const isExpiringSoon = (date: string) => {
    const expDate = new Date(date);
    const now = new Date();
    const daysUntil = Math.floor((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30;
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  const filteredInventory = inventory.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'low_stock') return item.quantity <= item.reorder_level;
    if (filter === 'expiring') return item.lots.some(l => isExpiringSoon(l.expiration_date));
    return item.category === filter;
  });

  const lowStockCount = inventory.filter(i => i.quantity <= i.reorder_level).length;
  const expiringCount = inventory.filter(i => i.lots.some(l => isExpiringSoon(l.expiration_date) && !isExpired(l.expiration_date))).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/admin/owner" className="hover:text-pink-600">Owner Mode</Link>
            <span>/</span>
            <span>Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">{inventory.length} products • Lot tracking enabled</p>
        </div>
        {!editingItem && (
          <button onClick={createNewItem} className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
            + Add Product
          </button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Alerts */}
      <div className="grid grid-cols-2 gap-4">
        {lowStockCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">⚠️</span>
              <span className="font-medium text-amber-800">{lowStockCount} product(s) low on stock</span>
            </div>
            <button onClick={() => setFilter('low_stock')} className="text-sm text-amber-600 mt-2 hover:underline">
              View low stock items →
            </button>
          </div>
        )}
        {expiringCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-600">🚨</span>
              <span className="font-medium text-red-800">{expiringCount} product(s) expiring within 30 days</span>
            </div>
            <button onClick={() => setFilter('expiring')} className="text-sm text-red-600 mt-2 hover:underline">
              View expiring items →
            </button>
          </div>
        )}
      </div>

      {editingItem ? (
        /* Editor */
        <div className="bg-white rounded-xl border p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">{isCreating ? 'Add Product' : 'Edit Product'}</h2>
            <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="text-gray-500">✕</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input
                type="text"
                value={editingItem.sku}
                onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                type="text"
                value={editingItem.unit}
                onChange={(e) => setEditingItem({ ...editingItem, unit: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="units, syringes, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Unit ($)</label>
              <input
                type="number"
                value={editingItem.cost_per_unit}
                onChange={(e) => setEditingItem({ ...editingItem, cost_per_unit: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
              <input
                type="number"
                value={editingItem.reorder_level}
                onChange={(e) => setEditingItem({ ...editingItem, reorder_level: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>

          {/* Lot Tracking */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Lot Tracking</label>
              <button onClick={() => setShowAddLot(true)} className="text-sm text-pink-600 hover:text-pink-700">
                + Add Lot
              </button>
            </div>

            {showAddLot && (
              <div className="p-4 bg-gray-50 rounded-lg mb-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newLot.lot_number}
                    onChange={(e) => setNewLot({ ...newLot, lot_number: e.target.value })}
                    placeholder="Lot Number"
                    className="px-3 py-2 border rounded"
                  />
                  <input
                    type="number"
                    value={newLot.quantity || ''}
                    onChange={(e) => setNewLot({ ...newLot, quantity: parseInt(e.target.value) || 0 })}
                    placeholder="Quantity"
                    className="px-3 py-2 border rounded"
                    min="0"
                  />
                  <input
                    type="date"
                    value={newLot.expiration_date}
                    onChange={(e) => setNewLot({ ...newLot, expiration_date: e.target.value })}
                    className="px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addLot} className="px-3 py-1.5 bg-pink-500 text-white rounded text-sm">Add Lot</button>
                  <button onClick={() => setShowAddLot(false)} className="px-3 py-1.5 text-gray-600 text-sm">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {editingItem.lots.map(lot => (
                <div key={lot.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  isExpired(lot.expiration_date) ? 'bg-red-50 border border-red-200' :
                  isExpiringSoon(lot.expiration_date) ? 'bg-amber-50 border border-amber-200' :
                  'bg-gray-50'
                }`}>
                  <div>
                    <span className="font-mono font-medium">{lot.lot_number}</span>
                    <span className="text-gray-500 mx-2">•</span>
                    <span>{lot.quantity} {editingItem.unit}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${isExpired(lot.expiration_date) ? 'text-red-600 font-medium' : isExpiringSoon(lot.expiration_date) ? 'text-amber-600' : 'text-gray-500'}`}>
                      Exp: {lot.expiration_date}
                      {isExpired(lot.expiration_date) && ' (EXPIRED)'}
                    </span>
                    <button onClick={() => removeLot(lot.id)} className="text-red-500 hover:text-red-700">🗑</button>
                  </div>
                </div>
              ))}
              {editingItem.lots.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No lots tracked yet</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
            <strong>Total Quantity:</strong> {editingItem.quantity} {editingItem.unit}
            <span className="mx-2">•</span>
            <strong>Total Value:</strong> ${(editingItem.quantity * editingItem.cost_per_unit).toFixed(2)}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => { setEditingItem(null); setIsCreating(false); }} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button onClick={saveItem} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
              {isCreating ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>
              All ({inventory.length})
            </button>
            <button onClick={() => setFilter('low_stock')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'low_stock' ? 'bg-pink-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
              Low Stock ({lowStockCount})
            </button>
            <button onClick={() => setFilter('expiring')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'expiring' ? 'bg-pink-500 text-white' : 'bg-red-100 text-red-700'}`}>
              Expiring ({expiringCount})
            </button>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm ${filter === cat ? 'bg-pink-500 text-white' : 'bg-gray-100'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Inventory List */}
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Product</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Category</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Quantity</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Lots</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Value</th>
                  <th className="text-left px-4 py-3 text-sm font-semibold">Status</th>
                  <th className="text-right px-4 py-3 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInventory.map(item => {
                  const hasExpiring = item.lots.some(l => isExpiringSoon(l.expiration_date) && !isExpired(l.expiration_date));
                  const hasExpired = item.lots.some(l => isExpired(l.expiration_date));
                  const isLow = item.quantity <= item.reorder_level;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className="px-4 py-3">
                        <span className={isLow ? 'text-amber-600 font-medium' : ''}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.lots.length} lot(s)</td>
                      <td className="px-4 py-3 text-sm">${(item.quantity * item.cost_per_unit).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {hasExpired && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Expired</span>}
                          {hasExpiring && !hasExpired && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Expiring</span>}
                          {isLow && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Low</span>}
                          {!hasExpired && !hasExpiring && !isLow && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">OK</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setEditingItem(item)} className="text-sm text-pink-600 hover:text-pink-700">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
