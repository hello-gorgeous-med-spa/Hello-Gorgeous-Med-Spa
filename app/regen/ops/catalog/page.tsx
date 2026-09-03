'use client';

import { useState, useMemo } from 'react';

interface Product {
  sku: string;
  product: string;
  strength: string;
  category: string;
  patient_price: number;
}

// This will be populated from the Formulation Rx catalog
const CATEGORIES = [
  'All Categories',
  'Weight Management',
  'Hormone Therapy',
  'Sexual Health',
  'Peptide',
  'Anti-Aging',
  'Hair Loss',
  'Injectable Nutrients',
  'Dermatology',
  'Wellness',
  'IV Therapy',
  'Retail Generic',
];

// Sample data - will be replaced with real Formulation Rx catalog
const SAMPLE_PRODUCTS: Product[] = [
  { sku: '2488', product: 'Semaglutide / B6 (Pyridoxine)', strength: '1mL Vial · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 75 },
  { sku: '2489', product: 'Semaglutide / B6 (Pyridoxine)', strength: '2mL Vial · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 125 },
  { sku: '2490', product: 'Semaglutide / B6 (Pyridoxine)', strength: '3mL · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 165 },
  { sku: '2491', product: 'Semaglutide / B6 (Pyridoxine)', strength: '4mL · 2.5mg/10mg/mL', category: 'Weight Management', patient_price: 200 },
  { sku: '2498', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '1mL Vial · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 135 },
  { sku: '2499', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '2mL · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 225 },
  { sku: '2500', product: 'Tirzepatide / B6 (Pyridoxine)', strength: '3mL · 12.5mg/10mg/mL', category: 'Weight Management', patient_price: 315 },
  { sku: '4041', product: 'B12 Methylcobalamin', strength: '10mL · 5mg/mL', category: 'Injectable Nutrients', patient_price: 30 },
  { sku: '4042', product: 'B12 Methylcobalamin', strength: '30mL · 5mg/mL', category: 'Injectable Nutrients', patient_price: 65 },
  { sku: '4039', product: 'Biotin', strength: '10mL · 10mg/mL', category: 'Injectable Nutrients', patient_price: 57 },
  { sku: '4033', product: 'Glutathione', strength: '30mL · 200mg/mL', category: 'Injectable Nutrients', patient_price: 58 },
  { sku: '3839', product: 'NAD+ Sterile Injection Solution', strength: '10mL vial · 200mg/mL', category: 'Anti-Aging', patient_price: 140 },
  { sku: '3640', product: 'NAD Injectable Solution', strength: '20mL (10 vials) · 50mg/ml', category: 'Anti-Aging', patient_price: 300 },
  { sku: '2884', product: 'Sermorelin Injection', strength: '6mL Vial · 1mg/mL', category: 'Peptide', patient_price: 65 },
  { sku: '2885', product: 'Sermorelin Injection', strength: '6mL Vial · 1.5mg/mL', category: 'Peptide', patient_price: 85 },
  { sku: '3502', product: 'PT-141 (Bremelanotide)', strength: '10mL Vial · 2mg/mL', category: 'Peptide', patient_price: 125 },
  { sku: '2896', product: 'Tesamorelin Sterile Injection', strength: '3mL Vial · 5mg/mL', category: 'Peptide', patient_price: 320 },
  { sku: '3096', product: 'Dutasteride Capsules', strength: '30 Capsules · 2.5mg', category: 'Hair Loss', patient_price: 55 },
  { sku: '3098', product: 'Finasteride / Tretinoin / Fluocinolone', strength: '30mL Topical · 0.25%/0.01%/0.01%', category: 'Hair Loss', patient_price: 60 },
  { sku: '2785', product: 'Anastrozole Capsules', strength: '30 Capsules · 0.5mg', category: 'Hormone Therapy', patient_price: 49 },
  { sku: '2575', product: 'Bi-Est (E3/E2) 50/50 Sublingual', strength: '30 Tablets · 1mg', category: 'Hormone Therapy', patient_price: 56 },
  { sku: '4031', product: 'Myers Cocktail', strength: '10mL · Mag/Ca/B-complex/C premix', category: 'Injectable Nutrients', patient_price: 62 },
  { sku: '4034', product: 'Tri-Immune Boost', strength: '30mL · Ascorbic/Glutathione/Zinc', category: 'Injectable Nutrients', patient_price: 65 },
];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let products = SAMPLE_PRODUCTS;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.product.toLowerCase().includes(searchLower) ||
          p.strength.toLowerCase().includes(searchLower) ||
          p.sku.includes(search)
      );
    }

    // Filter by category
    if (category !== 'All Categories') {
      products = products.filter((p) => p.category === category);
    }

    // Sort
    products = [...products].sort((a, b) => {
      if (sortBy === 'price-low') return a.patient_price - b.patient_price;
      if (sortBy === 'price-high') return b.patient_price - a.patient_price;
      return a.product.localeCompare(b.product);
    });

    return products;
  }, [search, category, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Catalog</h1>
          <p className="text-white/50">4,974 products from Formulation Rx</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-sm">Live sync</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, SKUs..."
                className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none cursor-pointer min-w-[180px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none cursor-pointer"
          >
            <option value="name" className="bg-slate-800">Sort: Name</option>
            <option value="price-low" className="bg-slate-800">Price: Low to High</option>
            <option value="price-high" className="bg-slate-800">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-white/50 text-sm">
        Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {category !== 'All Categories' && ` in ${category}`}
        {search && ` matching "${search}"`}
      </p>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.sku}
            className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-teal-500/50 transition-all cursor-pointer group"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60 font-mono">
                SKU: {product.sku}
              </span>
              <span className="px-2 py-1 bg-teal-500/20 rounded text-xs text-teal-300 font-medium">
                {product.category}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1 group-hover:text-teal-300 transition-colors">
              {product.product}
            </h3>
            <p className="text-white/50 text-sm mb-4">{product.strength}</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-xs">Wholesale Price</p>
                <p className="text-2xl font-bold text-teal-400">${product.patient_price}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to order logic
                }}
                className="px-4 py-2 bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-400 transition-colors"
              >
                Add to Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/50 text-lg">No products found</p>
          <p className="text-white/30 text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-slate-800 rounded-3xl p-8 max-w-lg w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="px-2 py-1 bg-teal-500/20 rounded text-xs text-teal-300 font-medium">
                  {selectedProduct.category}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{selectedProduct.product}</h2>
                <p className="text-white/50 mt-1">{selectedProduct.strength}</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-white/70">SKU</span>
                <span className="text-white font-mono">{selectedProduct.sku}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-white/70">Wholesale Price</span>
                <span className="text-2xl font-bold text-teal-400">${selectedProduct.patient_price}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="text-white/70">Your Retail Price (2.5x + $25)</span>
                <span className="text-xl font-bold text-white">
                  ${(selectedProduct.patient_price * 2.5 + 25).toFixed(0)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
              >
                Close
              </button>
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-400 hover:to-teal-500 transition-all">
                Add to Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
