'use client';

import { useState, useEffect, useCallback } from 'react';

interface Product {
  sku: string;
  product: string;
  strength: string;
  category: string;
  patient_price: number;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [catalogTotal, setCatalogTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(0);
  const LIMIT = 50;

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: LIMIT.toString(),
        offset: (page * LIMIT).toString(),
      });
      if (search) params.set('search', search);
      if (category && category !== 'All Categories') params.set('category', category);

      const res = await fetch(`/api/regen/ops/catalog?${params}`);
      if (res.ok) {
        const data = await res.json();
        let sorted = data.products || [];
        
        // Client-side sort
        if (sortBy === 'price-low') {
          sorted = sorted.sort((a: Product, b: Product) => a.patient_price - b.patient_price);
        } else if (sortBy === 'price-high') {
          sorted = sorted.sort((a: Product, b: Product) => b.patient_price - a.patient_price);
        } else {
          sorted = sorted.sort((a: Product, b: Product) => a.product.localeCompare(b.product));
        }
        
        setProducts(sorted);
        setTotalProducts(data.total || 0);
        setCatalogTotal(data.catalogTotal || 0);
        if (data.categories) {
          setCategories(['All Categories', ...data.categories]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, sortBy, page]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchCatalog();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = products;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Catalog</h1>
          <p className="text-white/50">
            {catalogTotal > 0 ? `${catalogTotal.toLocaleString()} products` : 'Loading...'} from Formulation Rx
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading ? (
            <>
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-sm">Loading...</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm">Live catalog</span>
            </>
          )}
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
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-teal-400 appearance-none cursor-pointer min-w-[180px]"
          >
            {categories.map((cat) => (
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
        Showing {filteredProducts.length} of {totalProducts.toLocaleString()} product{totalProducts !== 1 ? 's' : ''}
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
