"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  BOOMRX_STAFF_PORTAL_URL,
  REGEN_PHARMACY_PLACEMENT_COPY,
} from "@/lib/regen/pharmacy-placement";

export type StaffCatalogProduct = {
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
  coldShip: boolean;
  controlled: boolean;
};

export type StaffCatalogData = {
  generatedAt: string;
  totalProducts: number;
  byPharmacy: Record<string, number>;
  products: StaffCatalogProduct[];
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

function formatMoney(n: number) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function StaffPharmacyCatalog({ catalog }: { catalog: StaffCatalogData }) {
  const [filterCategory, setFilterCategory] = useState("peptides");
  const [filterPharmacy, setFilterPharmacy] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return catalog.products.filter((p) => {
      if (filterCategory !== "all" && p.category !== filterCategory) return false;
      if (filterPharmacy !== "all" && p.pharmacy !== filterPharmacy) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.compound.toLowerCase().includes(q) ||
        p.concentration.toLowerCase().includes(q)
      );
    });
  }, [catalog.products, filterCategory, filterPharmacy, search]);

  const pharmacies = Object.keys(catalog.byPharmacy || {});

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b-4 border-black bg-gradient-to-br from-[#2d1020] to-black">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <Link href="/staff" className="text-sm text-[#FFB8DC] hover:underline">
            ← Staff hub
          </Link>
          <h1 className="mt-3 text-3xl font-black">
            Pharmacy <span className="text-[#FF2D8E]">Selector</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            BoomRx Illinois formulary (Jul 2026) + Hello Gorgeous tailored peptide pricing.
            Updated {new Date(catalog.generatedAt).toLocaleDateString("en-US")} ·{" "}
            {catalog.totalProducts} SKUs
          </p>
          <div className="mt-4 rounded-2xl border-2 border-[#E6007E] bg-white/5 p-4 text-sm">
            <p className="font-bold text-[#FFB8DC]">{REGEN_PHARMACY_PLACEMENT_COPY.staffTitle}</p>
            <p className="mt-1 text-white/85">{REGEN_PHARMACY_PLACEMENT_COPY.staffDetail}</p>
            <a
              href={BOOMRX_STAFF_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded-full border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-4 py-2 text-xs font-bold text-white"
            >
              Open BoomRx portal →
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search compound, strength…"
            className="min-w-[200px] flex-1 rounded-xl border-2 border-black bg-white px-4 py-2 text-sm text-black"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm text-black"
          >
            <option value="all">All categories</option>
            {Object.keys(categoryLabels).map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c] || c}
              </option>
            ))}
          </select>
          <select
            value={filterPharmacy}
            onChange={(e) => setFilterPharmacy(e.target.value)}
            className="rounded-xl border-2 border-black bg-white px-3 py-2 text-sm text-black"
          >
            <option value="all">All pharmacies</option>
            {pharmacies.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-400">
          Showing {filtered.length} of {catalog.products.length}
          {filterPharmacy === "BoomRx" ? " · wholesale = BoomRx unit cost" : ""}
        </p>

        <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white text-black shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b-2 border-black bg-rose-50 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Strength</th>
                <th className="px-3 py-2">Pharmacy</th>
                <th className="px-3 py-2 text-right">Wholesale</th>
                <th className="px-3 py-2 text-right">Retail 30d</th>
                <th className="px-3 py-2 text-right">Retail 90d</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 500).map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-rose-50/50">
                  <td className="px-3 py-2 font-medium">
                    {p.name}
                    {p.controlled ? (
                      <span className="ml-1 text-[10px] font-bold text-red-600">CTRL</span>
                    ) : null}
                    {p.coldShip ? (
                      <span className="ml-1 text-[10px] font-bold text-blue-600">COLD</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-600">{p.concentration}</td>
                  <td className="px-3 py-2 text-xs font-semibold">{p.pharmacy}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatMoney(p.wholesale)}</td>
                  <td className="px-3 py-2 text-right font-mono">{formatMoney(p.retail30)}</td>
                  <td className="px-3 py-2 text-right font-mono text-[#E6007E]">
                    {formatMoney(p.retail90)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length > 500 && (
            <p className="p-3 text-center text-xs text-gray-500">
              Showing first 500 — narrow your search to see more.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
