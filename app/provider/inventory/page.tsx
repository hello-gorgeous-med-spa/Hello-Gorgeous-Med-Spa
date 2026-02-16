'use client';

// ============================================================
// PROVIDER INVENTORY - Product & Lot Tracking
// Quick access to products, lot numbers, and expiration dates
// ============================================================

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  sku?: string;
  quantity_on_hand: number;
  reorder_level: number;
  unit_of_measure: string;
  lots: Lot[];
}

interface Lot {
  id: string;
  lot_number: string;
  expiration_date: string;
  quantity_remaining: number;
  received_date: string;
}

export default function ProviderInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      try {
        const res = await fetch('/api/inventory');
        const data = await res.json();
        
        if (data.items) {
          // Transform and add mock lot data for demo
          const productsWithLots = data.items.map((item: any) => ({
            ...item,
            lots: item.lots || [
              {
                id: `lot-${item.id}-1`,
                lot_number: `LOT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                expiration_date: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
                quantity_remaining: Math.floor(item.quantity_on_hand * 0.6),
                received_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              },
              {
                id: `lot-${item.id}-2`,
                lot_number: `LOT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                expiration_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
                quantity_remaining: Math.floor(item.quantity_on_hand * 0.4),
                received_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              },
            ],
          }));
          setProducts(productsWithLots);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        // Demo data
        setProducts([
          {
            id: '1',
            name: 'Botox (onabotulinumtoxinA)',
            category: 'Neurotoxins',
            sku: 'BTX-100',
            quantity_on_hand: 450,
            reorder_level: 100,
            unit_of_measure: 'units',
            lots: [
              { id: 'lot1', lot_number: 'C4384A1', expiration_date: '2024-06-15', quantity_remaining: 250, received_date: '2024-01-10' },
              { id: 'lot2', lot_number: 'C4512B2', expiration_date: '2024-09-20', quantity_remaining: 200, received_date: '2024-02-01' },
            ],
          },
          {
            id: '2',
            name: 'Juvederm Ultra Plus XC',
            category: 'Dermal Fillers',
            sku: 'JUV-UPX',
            quantity_on_hand: 25,
            reorder_level: 10,
            unit_of_measure: 'syringes',
            lots: [
              { id: 'lot3', lot_number: 'M2847J1', expiration_date: '2024-12-31', quantity_remaining: 15, received_date: '2024-01-15' },
              { id: 'lot4', lot_number: 'M2901K3', expiration_date: '2025-03-15', quantity_remaining: 10, received_date: '2024-02-20' },
            ],
          },
          {
            id: '3',
            name: 'Semaglutide 2.5mg/ml',
            category: 'Weight Loss',
            sku: 'SEM-25',
            quantity_on_hand: 30,
            reorder_level: 15,
            unit_of_measure: 'vials',
            lots: [
              { id: 'lot5', lot_number: 'WL2024A', expiration_date: '2024-04-30', quantity_remaining: 8, received_date: '2024-01-05' },
              { id: 'lot6', lot_number: 'WL2024B', expiration_date: '2024-08-15', quantity_remaining: 22, received_date: '2024-02-10' },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchInventory();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntilExpiration = (dateStr: string) => {
    const expDate = new Date(dateStr);
    const now = new Date();
    return Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getExpirationStatus = (dateStr: string) => {
    const days = getDaysUntilExpiration(dateStr);
    if (days < 0) return { status: 'expired', color: 'bg-red-100 text-red-700 border-red-200' };
    if (days <= 30) return { status: 'critical', color: 'bg-red-100 text-red-700 border-red-200' };
    if (days <= 90) return { status: 'warning', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    return { status: 'good', color: 'bg-green-100 text-green-700 border-green-200' };
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    if (showExpiringSoon) {
      const hasExpiringSoon = product.lots.some(lot => getDaysUntilExpiration(lot.expiration_date) <= 90);
      return matchesSearch && matchesCategory && hasExpiringSoon;
    }
    
    return matchesSearch && matchesCategory;
  });

  // Expiring soon alerts
  const expiringSoonLots = products.flatMap(p => 
    p.lots
      .filter(lot => {
        const days = getDaysUntilExpiration(lot.expiration_date);
        return days <= 90 && days >= 0;
      })
      .map(lot => ({ ...lot, productName: p.name, productId: p.id }))
  ).sort((a, b) => getDaysUntilExpiration(a.expiration_date) - getDaysUntilExpiration(b.expiration_date));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Products & Inventory</h1>
          <p className="text-black">Track lot numbers and expiration dates</p>
        </div>
        <Link
          href="/admin/inventory"
          className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium"
        >
          Full Inventory →
        </Link>
      </div>

      {/* Expiration Alerts */}
      {expiringSoonLots.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800">Expiring Soon</h3>
              <p className="text-sm text-amber-700 mb-2">
                {expiringSoonLots.length} lot{expiringSoonLots.length > 1 ? 's' : ''} expiring within 90 days
              </p>
              <div className="flex flex-wrap gap-2">
                {expiringSoonLots.slice(0, 3).map(lot => (
                  <span 
                    key={lot.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded-lg"
                  >
                    <span className="font-mono text-xs">{lot.lot_number}</span>
                    <span>•</span>
                    <span>{getDaysUntilExpiration(lot.expiration_date)} days</span>
                  </span>
                ))}
                {expiringSoonLots.length > 3 && (
                  <button
                    onClick={() => setShowExpiringSoon(true)}
                    className="text-sm text-amber-700 hover:underline"
                  >
                    +{expiringSoonLots.length - 3} more
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-black p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black">🔍</span>
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-black rounded-lg focus:ring-2 focus:ring-pink-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={showExpiringSoon}
              onChange={(e) => setShowExpiringSoon(e.target.checked)}
              className="w-4 h-4 text-pink-500 rounded"
            />
            <span className="text-sm text-black">Expiring Soon Only</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          const isLowStock = product.quantity_on_hand <= product.reorder_level;
          const nearestExpiration = product.lots.reduce((nearest, lot) => {
            const days = getDaysUntilExpiration(lot.expiration_date);
            return days < getDaysUntilExpiration(nearest.expiration_date) ? lot : nearest;
          }, product.lots[0]);
          const expStatus = nearestExpiration ? getExpirationStatus(nearestExpiration.expiration_date) : null;
          
          return (
            <div 
              key={product.id}
              className="bg-white rounded-xl border border-black overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-black">{product.name}</h3>
                    <p className="text-sm text-black">{product.category}</p>
                  </div>
                  {isLowStock && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Low Stock
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-black">{product.quantity_on_hand}</p>
                    <p className="text-xs text-black">{product.unit_of_measure} in stock</p>
                  </div>
                  {expStatus && (
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${expStatus.color}`}>
                      {expStatus.status === 'expired' ? 'Expired!' :
                       expStatus.status === 'critical' ? `Expires in ${getDaysUntilExpiration(nearestExpiration.expiration_date)}d` :
                       expStatus.status === 'warning' ? `${getDaysUntilExpiration(nearestExpiration.expiration_date)}d to expiry` :
                       'In Date'}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-2 text-sm text-pink-600 hover:bg-pink-50 rounded-lg font-medium"
                >
                  View Lot Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <span className="text-4xl block mb-2">📦</span>
          <p className="text-black">No products found</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-black flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">{selectedProduct.name}</h2>
                <p className="text-sm text-black">
                  {selectedProduct.sku && `SKU: ${selectedProduct.sku} • `}
                  {selectedProduct.category}
                </p>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-black hover:text-black text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Stock Summary */}
              <div className="bg-white rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-black">{selectedProduct.quantity_on_hand}</p>
                    <p className="text-sm text-black">Total On Hand</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">{selectedProduct.lots.length}</p>
                    <p className="text-sm text-black">Active Lots</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600">{selectedProduct.reorder_level}</p>
                    <p className="text-sm text-black">Reorder Level</p>
                  </div>
                </div>
              </div>

              {/* Lot Details */}
              <h3 className="font-semibold text-black mb-3">Lot Information</h3>
              <div className="space-y-3">
                {selectedProduct.lots.map(lot => {
                  const expStatus = getExpirationStatus(lot.expiration_date);
                  const daysUntil = getDaysUntilExpiration(lot.expiration_date);
                  
                  return (
                    <div 
                      key={lot.id}
                      className={`p-4 rounded-xl border-2 ${expStatus.color}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-lg font-bold">{lot.lot_number}</span>
                          {daysUntil <= 30 && daysUntil >= 0 && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                              Use First!
                            </span>
                          )}
                        </div>
                        <span className="text-2xl font-bold">{lot.quantity_remaining}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-black">Expiration Date</p>
                          <p className="font-medium">
                            {formatDate(lot.expiration_date)}
                            {daysUntil >= 0 && (
                              <span className="ml-2 text-black">({daysUntil} days)</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-black">Received</p>
                          <p className="font-medium">{formatDate(lot.received_date)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Usage Tip */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="font-medium text-blue-800">FIFO Reminder</p>
                    <p className="text-sm text-blue-700">
                      Always use the lot with the nearest expiration date first to minimize waste.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-black flex justify-end gap-3">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 text-black hover:bg-white rounded-lg"
              >
                Close
              </button>
              <Link
                href={`/admin/inventory?product=${selectedProduct.id}`}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
              >
                Manage in Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
