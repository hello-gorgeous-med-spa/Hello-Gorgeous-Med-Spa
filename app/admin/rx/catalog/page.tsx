"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CatalogProduct = {
  id: string;
  name: string;
  compound: string;
  category: string;
  form: string;
  concentration: string;
  size: string;
  pharmacy: string;
  wholesale: number;
  retail30: number;
  retail90: number;
  savings90: number;
  coldShip: boolean;
  controlled: boolean;
  crossShop: boolean;
};

type CatalogData = {
  generatedAt: string;
  markup: number;
  discount90Day: number;
  shippingFlat: number;
  totalProducts: number;
  byPharmacy: Record<string, number>;
  byCategory: Record<string, number>;
  products: CatalogProduct[];
};

const categoryLabels: Record<string, string> = {
  "weight-loss": "Weight Loss",
  "peptides": "Peptides",
  "vitamins": "Vitamins",
  "hormones": "Hormones",
  "sexual-health": "Sexual Health",
  "hair-skin": "Hair & Skin",
  "wellness": "Wellness",
};

const pharmacyColors: Record<string, string> = {
  "Formulation Rx": "text-pink-400",
  "BoomRx": "text-amber-400",
  "Olympia": "text-blue-400",
};

function formatMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminRxCatalogPage() {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPharmacy, setFilterPharmacy] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/rx/catalog")
      .then((res) => res.json())
      .then((data) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading catalog...</div>
    );
  }

  if (!catalog) {
    return (
      <div className="p-8 text-center text-red-400">Failed to load catalog</div>
    );
  }

  const filteredProducts = catalog.products.filter((p) => {
    if (filterCategory !== "all" && p.category !== filterCategory) return false;
    if (filterPharmacy !== "all" && p.pharmacy !== filterPharmacy) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.compound.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">RE GEN Product Catalog</h1>
          <p className="text-gray-400 text-sm mt-1">
            {catalog.totalProducts} products from your pharmacy bible
          </p>
        </div>
        <Link
          href="/admin/rx"
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          ← Back to RX Command
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-white">{catalog.totalProducts}</div>
          <div className="text-sm text-gray-400">Total Products</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-pink-400">{catalog.markup}×</div>
          <div className="text-sm text-gray-400">Markup</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-green-400">{(catalog.discount90Day * 100).toFixed(0)}%</div>
          <div className="text-sm text-gray-400">90-Day Discount</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-white">${catalog.shippingFlat}</div>
          <div className="text-sm text-gray-400">Flat Shipping</div>
        </div>
      </div>

      {/* Pharmacy Breakdown */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">By Pharmacy</h2>
        <div className="flex flex-wrap gap-4">
          {Object.entries(catalog.byPharmacy).map(([pharmacy, count]) => (
            <div key={pharmacy} className="flex items-center gap-2">
              <span className={`font-medium ${pharmacyColors[pharmacy] || "text-gray-300"}`}>
                {pharmacy}
              </span>
              <span className="text-gray-500">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value="all">All Categories</option>
          {Object.entries(catalog.byCategory).map(([cat, count]) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat] || cat} ({count})
            </option>
          ))}
        </select>
        <select
          value={filterPharmacy}
          onChange={(e) => setFilterPharmacy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
        >
          <option value="all">All Pharmacies</option>
          {Object.entries(catalog.byPharmacy).map(([pharm, count]) => (
            <option key={pharm} value={pharm}>
              {pharm} ({count})
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-400 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Pharmacy</th>
                <th className="px-4 py-3 text-left">Size</th>
                <th className="px-4 py-3 text-right">Wholesale</th>
                <th className="px-4 py-3 text-right">30-Day</th>
                <th className="px-4 py-3 text-right">90-Day</th>
                <th className="px-4 py-3 text-right">Margin</th>
                <th className="px-4 py-3 text-center">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((p) => {
                const margin30 = p.retail30 - p.wholesale;
                return (
                  <tr key={p.id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-gray-500 text-xs">{p.concentration}</div>
                    </td>
                    <td className={`px-4 py-3 ${pharmacyColors[p.pharmacy] || "text-gray-300"}`}>
                      {p.pharmacy}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{p.size}</td>
                    <td className="px-4 py-3 text-right text-gray-400">
                      {formatMoney(p.wholesale)}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {formatMoney(p.retail30)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-green-400 font-medium">{formatMoney(p.retail90)}</div>
                      <div className="text-green-600 text-xs">save {formatMoney(p.savings90)}</div>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium">
                      {formatMoney(margin30)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {p.coldShip && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                            ❄️ Cold
                          </span>
                        )}
                        {p.controlled && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded">
                            ⚠️ Ctrl
                          </span>
                        )}
                        {p.crossShop && (
                          <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded">
                            ⚡ Cross
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-sm text-gray-500 flex items-center justify-between">
        <div>
          Showing {filteredProducts.length} of {catalog.totalProducts} products
        </div>
        <div>
          Last updated: {new Date(catalog.generatedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
