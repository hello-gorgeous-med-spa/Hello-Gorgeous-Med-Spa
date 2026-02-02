'use client';

// ============================================================
// INVENTORY & INJECTABLES - OWNER CONTROLLED
// ALL DATA FROM DATABASE - NO STATIC VALUES
// ============================================================

import { useState, useEffect } from 'react';
import OwnerLayout from '../layout-wrapper';
import {
  CardSkeleton,
  TableSkeleton,
  EmptyState,
  ErrorState,
  formatDate,
} from '@/lib/hooks/useOwnerMetrics';

interface Product {
  id: string;
  name: string;
  category: string;
  lot_number: string;
  expiration_date: string | null;
  quantity: number;
  reorder_level: number;
  unit_cost: number;
  status: 'in_stock' | 'low' | 'expired' | 'out';
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch inventory');
        }
        
        // Process products to determine status
        const now = new Date();
        const processedProducts = (data.items || data || []).map((item: any) => {
          let status: 'in_stock' | 'low' | 'expired' | 'out' = 'in_stock';
          
          if (item.quantity <= 0) {
            status = 'out';
          } else if (item.expiration_date && new Date(item.expiration_date) < now) {
            status = 'expired';
          } else if (item.quantity <= (item.reorder_level || 10)) {
            status = 'low';
          }
          
          return {
            id: item.id,
            name: item.name || item.product_name || 'Unknown Product',
            category: item.category || 'Uncategorized',
            lot_number: item.lot_number || item.lot || '—',
            expiration_date: item.expiration_date,
            quantity: item.quantity || 0,
            reorder_level: item.reorder_level || 10,
            unit_cost: item.unit_cost || 0,
            status,
          };
        });
        
        setProducts(processedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchInventory();
  }, []);

  const categories = ['all', ...new Set(products.map(p => p.category))];
  const statuses = ['all', 'in_stock', 'low', 'expired', 'out'];

  const filteredProducts = products.filter(p => {
    if (filterCategory !== 'all' && p.category !== filterCategory) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  // Calculate stats from REAL data
  const lowStockCount = products.filter(p => p.status === 'low').length;
  const expiredCount = products.filter(p => p.status === 'expired').length;
  const expiringCount = products.filter(p => {
    if (!p.expiration_date) return false;
    const expDate = new Date(p.expiration_date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expDate <= thirtyDaysFromNow && expDate > new Date() && p.status !== 'expired';
  }).length;

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

      {/* Error State */}
      {error && !isLoading && (
        <ErrorState error={error} onRetry={() => window.location.reload()} />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="bg-white rounded-xl border p-4">
            <TableSkeleton rows={5} />
          </div>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && (
        <>
          {/* Alerts - REAL DATA */}
          {(lowStockCount > 0 || expiredCount > 0 || expiringCount > 0) && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {lowStockCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500">⚠️</span>
                    <span className="font-medium text-amber-800">{lowStockCount} product{lowStockCount > 1 ? 's' : ''} low on stock</span>
                  </div>
                </div>
              )}
              {expiringCount > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">⏰</span>
                    <span className="font-medium text-orange-800">{expiringCount} product{expiringCount > 1 ? 's' : ''} expiring soon</span>
                  </div>
                </div>
              )}
              {expiredCount > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">🛑</span>
                    <span className="font-medium text-red-800">{expiredCount} product{expiredCount > 1 ? 's' : ''} expired</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Inventory Table - REAL DATA */}
            <div className="col-span-2">
              <div className="bg-white rounded-xl border">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold">Inventory ({products.length} items)</h2>
                  <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm hover:bg-pink-600">
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

                {filteredProducts.length > 0 ? (
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
                          <td className="px-4 py-3 text-sm font-mono text-gray-600">{product.lot_number}</td>
                          <td className="px-4 py-3 text-sm">
                            {product.expiration_date ? formatDate(product.expiration_date) : '—'}
                          </td>
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
                ) : (
                  <EmptyState 
                    icon="📦"
                    title="No inventory items"
                    description={products.length > 0 ? "No items match your filter" : "Add products to track inventory"}
                  />
                )}
              </div>
            </div>

            {/* Stats Sidebar - REAL DATA */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border p-4">
                <h3 className="font-semibold mb-3">📊 Inventory Stats</h3>
                <div className="space-y-3">
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
                    <span className="text-gray-500">Expiring Soon</span>
                    <span className="font-medium text-orange-600">{expiringCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expired</span>
                    <span className="font-medium text-red-600">{expiredCount}</span>
                  </div>
                </div>
              </div>

              {products.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h3 className="font-medium text-blue-800">Getting Started</h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Add your first inventory item to start tracking products, lots, and expiration dates.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </OwnerLayout>
  );
}
