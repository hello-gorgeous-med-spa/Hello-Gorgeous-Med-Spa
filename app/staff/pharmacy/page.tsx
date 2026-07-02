'use client';

import { useState, useMemo } from 'react';
import pharmacyData from '@/data/pharmacy-catalog-raw.json';

const MARKUP = 2.5;
const SHIPPING = 30;

type Product = {
  pharmacy: string;
  sku: string | null;
  name: string;
  size: string;
  conc: string;
  budDays: number;
  controlled: boolean;
  coldShip: boolean;
  category: string;
  route: string;
  cost: number;
  id: string;
};

const data = pharmacyData as Product[];

const pharmacies = ['Formulation Rx', 'BoomRx', 'Olympia'] as const;
const categories = [
  'All Categories',
  'GLP-1 / Weight Loss',
  'Peptide Therapy',
  'Hormone Therapy',
  'Sexual Health',
  'Hair Loss',
  'Vitamin Injections',
  'Wellness',
];

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export default function PharmacySelectorPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [supplyDays, setSupplyDays] = useState<30 | 90>(30);
  const [viewMode, setViewMode] = useState<'compare' | 'browse'>('compare');

  const grouped = useMemo(() => {
    const map = new Map<string, Product[]>();
    
    for (const item of data) {
      if (category !== 'All Categories' && item.category !== category) continue;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) continue;
      
      const key = `${item.name}|${item.conc}|${item.size}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    
    return Array.from(map.entries())
      .map(([key, items]) => {
        const [name, conc, size] = key.split('|');
        const byPharmacy: Record<string, Product> = {};
        for (const item of items) {
          byPharmacy[item.pharmacy] = item;
        }
        
        const costs = items.map(i => i.cost);
        const minCost = Math.min(...costs);
        const cheapestPharmacy = items.find(i => i.cost === minCost)?.pharmacy || '';
        
        return {
          name,
          conc,
          size,
          category: items[0].category,
          route: items[0].route,
          coldShip: items.some(i => i.coldShip),
          controlled: items.some(i => i.controlled),
          byPharmacy,
          cheapestPharmacy,
          minCost,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [search, category]);

  const stats = useMemo(() => {
    const compounds = new Set(data.map(d => d.name)).size;
    const crossShop = grouped.filter(g => Object.keys(g.byPharmacy).length > 1).length;
    return { skus: data.length, compounds, crossShop };
  }, [grouped]);

  const retail = (cost: number) => cost * MARKUP;
  const price90 = (cost: number) => retail(cost) * 3 * 0.9;

  return (
    <div 
      className="min-h-screen bg-black text-white select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-900/50 to-black border-b border-pink-500/30 px-4 py-6">
        <p className="text-pink-400 text-xs tracking-widest mb-1">HELLO GORGEOUS · RX SOURCING</p>
        <h1 className="text-2xl font-bold">Pharmacy Selector</h1>
        <p className="text-gray-400 text-sm mt-1">
          Compare Formulation Rx, Olympia &amp; BoomRx — see who&apos;s cheapest, your retail at ×{MARKUP}, and 30/90-day cost in one view.
        </p>
      </header>

      {/* Stats */}
      <div className="flex gap-2 px-4 py-4 border-b border-gray-800 overflow-x-auto">
        <div className="flex-shrink-0 bg-gray-900 rounded-lg px-4 py-2 text-center min-w-[100px]">
          <div className="text-xl font-bold text-white">{stats.skus}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">SKUs</div>
        </div>
        <div className="flex-shrink-0 bg-gray-900 rounded-lg px-4 py-2 text-center min-w-[100px]">
          <div className="text-xl font-bold text-white">{stats.compounds}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Compounds</div>
        </div>
        <div className="flex-shrink-0 bg-pink-900/50 border border-pink-500/50 rounded-lg px-4 py-2 text-center min-w-[100px]">
          <div className="text-xl font-bold text-pink-400">{stats.crossShop}</div>
          <div className="text-xs text-gray-400 uppercase tracking-wide">Cross-Shop</div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-4 space-y-3 border-b border-gray-800 bg-gray-950">
        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('compare')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              viewMode === 'compare' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Compare by compound
          </button>
          <button
            onClick={() => setViewMode('browse')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              viewMode === 'browse' 
                ? 'bg-pink-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Browse by pharmacy
          </button>
        </div>

        {/* Supply Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Supply</span>
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setSupplyDays(30)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                supplyDays === 30 ? 'bg-white text-black' : 'text-gray-400'
              }`}
            >
              30-day
            </button>
            <button
              onClick={() => setSupplyDays(90)}
              className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                supplyDays === 90 ? 'bg-white text-black' : 'text-gray-400'
              }`}
            >
              90-day
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search compounds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
        />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Note */}
      <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          Retail = cost ×{MARKUP} · client pays {fmt(SHIPPING)} ship
        </p>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-800">
        {grouped.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500">
            No products found
          </div>
        ) : (
          grouped.map((item, idx) => (
            <div key={idx} className="px-4 py-4">
              {/* Product Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">
                    {item.conc} · {item.size}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {item.coldShip && (
                      <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">
                        ❄️ Cold Ship
                      </span>
                    )}
                    {item.controlled && (
                      <span className="text-xs bg-red-900/50 text-red-300 px-2 py-0.5 rounded">
                        ⚠️ Controlled
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pharmacy Prices */}
              <div className="grid grid-cols-3 gap-2">
                {pharmacies.map((pharm) => {
                  const product = item.byPharmacy[pharm];
                  const isCheapest = pharm === item.cheapestPharmacy;
                  
                  if (!product) {
                    return (
                      <div
                        key={pharm}
                        className="bg-gray-900/50 rounded-lg p-2 text-center opacity-50"
                      >
                        <div className="text-xs text-gray-600 mb-1 truncate">{pharm}</div>
                        <div className="text-gray-700">—</div>
                      </div>
                    );
                  }

                  const cost = product.cost;
                  const displayPrice = supplyDays === 30 ? retail(cost) : price90(cost);

                  return (
                    <div
                      key={pharm}
                      className={`rounded-lg p-2 text-center ${
                        isCheapest
                          ? 'bg-pink-900/30 border border-pink-500/50'
                          : 'bg-gray-900'
                      }`}
                    >
                      <div className={`text-xs mb-1 truncate ${isCheapest ? 'text-pink-400' : 'text-gray-500'}`}>
                        {pharm.replace(' Rx', '')}
                        {isCheapest && ' ✓'}
                      </div>
                      <div className={`font-bold ${isCheapest ? 'text-pink-400' : 'text-white'}`}>
                        {fmt(displayPrice)}
                      </div>
                      <div className="text-xs text-gray-600">
                        cost: {fmt(cost)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 text-center border-t border-gray-800">
        <p className="text-gray-600 text-sm">
          Hello Gorgeous Med Spa · Internal Use Only
        </p>
      </footer>
    </div>
  );
}
