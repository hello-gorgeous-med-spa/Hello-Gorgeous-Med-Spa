"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  peptides: "Peptides",
  vitamins: "Vitamins",
  hormones: "Hormones",
  "sexual-health": "Sexual Health",
  "hair-skin": "Hair & Skin",
  wellness: "Wellness",
};

const pharmacyColors: Record<string, string> = {
  "Formulation Rx": "text-[#E6007E]",
  BoomRx: "text-amber-700",
  Olympia: "text-blue-700",
};

function formatMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminRxCatalogPage() {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("peptides");
  const [filterPharmacy, setFilterPharmacy] = useState<string>("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx/catalog");
      const data = await res.json();
      if (res.ok) setCatalog(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredProducts = useMemo(() => {
    if (!catalog) return [];
    return catalog.products.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (filterPharmacy !== "all" && p.pharmacy !== filterPharmacy) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.compound.toLowerCase().includes(q) ||
          p.pharmacy.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [catalog, filterCategory, filterPharmacy, search]);

  const exportCsv = () => {
    const q = new URLSearchParams({ format: "csv" });
    if (filterCategory !== "all") q.set("category", filterCategory);
    window.open(`/api/admin/rx/catalog?${q}`, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8 text-center text-black/50">
        Loading RE GEN catalog…
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-8 text-center text-red-600">
        Failed to load catalog. Run <code>node scripts/build-regen-catalog.js</code>.
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            RE GEN · Pharmacy bible
          </p>
          <h1 className="text-3xl font-black text-black">Product catalog &amp; pricing</h1>
          <p className="text-black/60 mt-1 text-sm max-w-2xl">
            All {catalog.totalProducts} products — wholesale, 30-day &amp; 90-day retail, and{" "}
            <strong>pharmacy vendor</strong> for each SKU. Source:{" "}
            <code className="text-xs">data/regen-best-prices.json</code>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="px-4 py-2 rounded-full border-2 border-black font-bold text-sm bg-white hover:bg-[#FFF0F7]"
          >
            Export CSV
          </button>
          <Link
            href="/admin/rx/glp1-pricing"
            className="px-4 py-2 rounded-full border-2 border-black font-bold text-sm self-center"
          >
            GLP-1 margins →
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4 text-sm space-y-1">
        <p className="font-bold">Pricing policy</p>
        <ul className="list-disc pl-5 text-black/80 space-y-0.5">
          <li>
            <strong>Retail 30-day</strong> — cheapest pharmacy wholesale × {catalog.markup}
          </li>
          <li>
            <strong>Retail 90-day</strong> — (30-day × 3) × {(1 - catalog.discount90Day).toFixed(2)}{" "}
            ({(catalog.discount90Day * 100).toFixed(0)}% off)
          </li>
          <li>
            <strong>Shipping</strong> — ${catalog.shippingFlat} flat at checkout
          </li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total SKUs", value: String(catalog.totalProducts) },
          { label: "Peptides", value: String(catalog.byCategory.peptides ?? 0) },
          { label: "Markup", value: `${catalog.markup}×` },
          { label: "90-day discount", value: `${(catalog.discount90Day * 100).toFixed(0)}%` },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
          >
            <p className="text-xs uppercase tracking-wide text-black/50">{c.label}</p>
            <p className="text-2xl font-black">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-black/50 mb-2">By pharmacy</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {Object.entries(catalog.byPharmacy).map(([pharmacy, count]) => (
            <button
              key={pharmacy}
              type="button"
              onClick={() =>
                setFilterPharmacy((prev) => (prev === pharmacy ? "all" : pharmacy))
              }
              className={`font-bold ${pharmacyColors[pharmacy] || "text-black"} ${
                filterPharmacy === pharmacy ? "underline decoration-2" : ""
              }`}
            >
              {pharmacy} ({count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ["peptides", "Peptides"],
            ["weight-loss", "Weight Loss"],
            ["hormones", "Hormones"],
            ["vitamins", "Vitamins"],
            ["wellness", "Wellness"],
            ["sexual-health", "Sexual Health"],
            ["hair-skin", "Hair & Skin"],
            ["all", "All"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilterCategory(id)}
            className={`px-4 py-2 rounded-full border-2 font-bold text-sm ${
              filterCategory === id
                ? "border-[#E6007E] bg-[#E6007E] text-white"
                : "border-black bg-white"
            }`}
          >
            {label}
            {id !== "all" && catalog.byCategory[id] ? ` (${catalog.byCategory[id]})` : ""}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search product, compound, or pharmacy…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] border-2 border-black rounded-lg px-3 py-2 text-sm font-medium"
        />
        <select
          value={filterPharmacy}
          onChange={(e) => setFilterPharmacy(e.target.value)}
          className="border-2 border-black rounded-lg px-3 py-2 text-sm font-medium"
        >
          <option value="all">All pharmacies</option>
          {Object.entries(catalog.byPharmacy).map(([pharm, count]) => (
            <option key={pharm} value={pharm}>
              {pharm} ({count})
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-black text-white text-left">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Pharmacy / vendor</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2 text-right">Wholesale</th>
              <th className="px-3 py-2 text-right">30-day</th>
              <th className="px-3 py-2 text-right">90-day</th>
              <th className="px-3 py-2 text-right">Margin</th>
              <th className="px-3 py-2 text-center">Flags</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-black/50">
                  No products match your filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const margin30 = p.retail30 - p.wholesale;
                return (
                  <tr key={p.id} className="border-t border-black/10 hover:bg-rose-50/40">
                    <td className="px-3 py-2">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-black/50">
                        {p.concentration}
                        {p.form ? ` · ${p.form}` : ""}
                      </p>
                    </td>
                    <td className={`px-3 py-2 font-bold ${pharmacyColors[p.pharmacy] || ""}`}>
                      {p.pharmacy}
                      {p.crossShop ? (
                        <span className="ml-1 text-[10px] font-bold uppercase text-[#E6007E]">
                          cross
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{p.size}</td>
                    <td className="px-3 py-2 text-right font-mono text-xs text-black/60">
                      {formatMoney(p.wholesale)}
                    </td>
                    <td className="px-3 py-2 text-right font-bold">{formatMoney(p.retail30)}</td>
                    <td className="px-3 py-2 text-right">
                      <p className="font-bold text-green-700">{formatMoney(p.retail90)}</p>
                      <p className="text-[10px] text-green-600">save {formatMoney(p.savings90)}</p>
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-green-700">
                      {formatMoney(margin30)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {p.coldShip ? (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] rounded font-bold">
                            cold
                          </span>
                        ) : null}
                        {p.controlled ? (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-[10px] rounded font-bold">
                            ctrl
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-black/50 flex flex-wrap justify-between gap-2">
        <span>
          Showing {filteredProducts.length} of {catalog.totalProducts} products
          {filterCategory !== "all" ? ` · ${categoryLabels[filterCategory] || filterCategory}` : ""}
        </span>
        <span>Updated {new Date(catalog.generatedAt).toLocaleString()}</span>
      </p>
    </div>
  );
}
