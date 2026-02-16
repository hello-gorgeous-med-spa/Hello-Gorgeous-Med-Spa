// ============================================================
// CHART-TO-CART - Products & Pricing Management
// Manage inventory and pricing for charting
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  cost: number;
  unit: string;
  stock: number;
  reorderPoint: number;
  isActive: boolean;
}

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '📦' },
  { id: 'neurotoxins', name: 'Neurotoxins', icon: '💉' },
  { id: 'fillers', name: 'Dermal Fillers', icon: '💋' },
  { id: 'skincare', name: 'Skincare', icon: '✨' },
  { id: 'iv-therapy', name: 'IV Therapy', icon: '💧' },
  { id: 'supplies', name: 'Medical Supplies', icon: '🩹' },
];

// Sample products data
const SAMPLE_PRODUCTS: Product[] = [
  { id: '1', name: 'Botox Cosmetic', category: 'neurotoxins', sku: 'BOT-100', price: 15, cost: 8, unit: 'Unit', stock: 500, reorderPoint: 100, isActive: true },
  { id: '2', name: 'Dysport', category: 'neurotoxins', sku: 'DYS-500', price: 5, cost: 2.50, unit: 'Unit', stock: 800, reorderPoint: 200, isActive: true },
  { id: '3', name: 'Jeuveau', category: 'neurotoxins', sku: 'JEU-100', price: 10, cost: 6, unit: 'Unit', stock: 300, reorderPoint: 100, isActive: true },
  { id: '4', name: 'Xeomin', category: 'neurotoxins', sku: 'XEO-100', price: 12, cost: 7, unit: 'Unit', stock: 200, reorderPoint: 50, isActive: true },
  { id: '5', name: 'Restylane Lyft', category: 'fillers', sku: 'RST-LYFT', price: 750, cost: 350, unit: 'Syringe', stock: 25, reorderPoint: 10, isActive: true },
  { id: '6', name: 'Restylane Defyne', category: 'fillers', sku: 'RST-DEF', price: 699, cost: 320, unit: 'Syringe', stock: 30, reorderPoint: 10, isActive: true },
  { id: '7', name: 'Restylane Contour', category: 'fillers', sku: 'RST-CON', price: 762.50, cost: 360, unit: 'Syringe', stock: 20, reorderPoint: 8, isActive: true },
  { id: '8', name: 'Juvederm Voluma XC', category: 'fillers', sku: 'JUV-VOL', price: 850, cost: 400, unit: 'Syringe', stock: 15, reorderPoint: 5, isActive: true },
  { id: '9', name: 'Juvederm Volbella XC', category: 'fillers', sku: 'JUV-VBL', price: 650, cost: 300, unit: 'Syringe', stock: 18, reorderPoint: 5, isActive: true },
  { id: '10', name: 'Revanesse Versa+', category: 'fillers', sku: 'REV-VERSA', price: 725, cost: 340, unit: 'Syringe', stock: 22, reorderPoint: 8, isActive: true },
  { id: '11', name: "Myers' Cocktail IV", category: 'iv-therapy', sku: 'IV-MYERS', price: 175, cost: 35, unit: 'Treatment', stock: 50, reorderPoint: 20, isActive: true },
  { id: '12', name: 'Beauty Glow IV', category: 'iv-therapy', sku: 'IV-BEAUTY', price: 200, cost: 45, unit: 'Treatment', stock: 50, reorderPoint: 20, isActive: true },
];

export default function ProductsPricingPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePriceChange = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, price: newPrice } : p
    ));
  };

  const lowStockProducts = products.filter(p => p.stock <= p.reorderPoint);
  const totalValue = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-black mb-2">
            <Link href="/admin/chart-to-cart" className="hover:text-pink-600">Chart-to-Cart</Link>
            <span>→</span>
            <span>Products & Pricing</span>
          </div>
          <h1 className="text-2xl font-bold text-black flex items-center gap-3">
            <span className="text-3xl">💊</span>
            Products & Pricing
          </h1>
          <p className="text-black mt-1">Manage inventory and pricing for treatment charting</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-[#FF2D8E] text-white rounded-xl hover:bg-black transition-colors font-medium flex items-center gap-2"
        >
          <span>➕</span> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Total Products</p>
              <p className="text-3xl font-bold text-black mt-1">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{lowStockProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Inventory Value</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${totalValue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black">Categories</p>
              <p className="text-3xl font-bold text-black mt-1">{CATEGORIES.length - 1}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏷️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-black shadow-sm mb-6">
        <div className="p-4 flex items-center gap-4 border-b border-black">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="flex-1 px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-[#FF2D8E]"
            />
          </div>
        </div>
        
        {/* Category Pills */}
        <div className="p-3 flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-pink-100 text-pink-700'
                  : 'bg-white text-black hover:bg-white'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-black shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-black">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">Product</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-black">SKU</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-black">Cost</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-black">Price</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-black">Margin</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-black">Stock</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-black">Status</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {filteredProducts.map((product) => {
              const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
              const isLowStock = product.stock <= product.reorderPoint;
              
              return (
                <tr key={product.id} className="hover:bg-white">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-black">{product.name}</p>
                      <p className="text-xs text-black capitalize">{product.category.replace('-', ' ')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-black font-mono text-sm">{product.sku}</td>
                  <td className="px-6 py-4 text-right text-black">${product.cost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-semibold text-black">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-black">/{product.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${Number(margin) > 50 ? 'text-green-600' : 'text-black'}`}>
                      {margin}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stock} {product.unit}s
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-white text-black'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-black">No products found</p>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="mt-6 bg-red-50 rounded-xl border border-red-100 p-6">
          <h3 className="font-semibold text-red-900 flex items-center gap-2 mb-4">
            <span>⚠️</span> Low Stock Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border border-red-200">
                <p className="font-medium text-black">{product.name}</p>
                <p className="text-sm text-red-600 mt-1">
                  Only {product.stock} {product.unit}s left (reorder at {product.reorderPoint})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6 border-b border-black">
              <h3 className="text-lg font-semibold">Edit Product</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.cost}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cost: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Reorder Point</label>
                  <input
                    type="number"
                    value={editingProduct.reorderPoint}
                    onChange={(e) => setEditingProduct({ ...editingProduct, reorderPoint: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-black rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-white flex justify-end gap-3">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-black hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
                  setEditingProduct(null);
                }}
                className="px-6 py-2 bg-[#FF2D8E] text-white rounded-lg hover:bg-black"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
