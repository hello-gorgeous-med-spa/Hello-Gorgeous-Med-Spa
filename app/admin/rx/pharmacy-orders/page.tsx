"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { Glp1VialOrderRollup } from "@/lib/glp1-vial-fulfillment";
import type { PharmacyOrderLine } from "@/lib/glp1-vial-fulfillment";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function PharmacyOrdersPage() {
  const [lines, setLines] = useState<PharmacyOrderLine[]>([]);
  const [rollup, setRollup] = useState<Glp1VialOrderRollup[]>([]);
  const [totals, setTotals] = useState({ orderCount: 0, totalVials: 0, totalWholesaleUsd: 0 });
  const [includeShipped, setIncludeShipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = includeShipped ? "?include_shipped=1" : "";
      const res = await fetch(`/api/admin/rx/pharmacy-orders${q}`);
      const data = await res.json();
      if (res.ok) {
        setLines(data.lines || []);
        setRollup(data.rollup || []);
        setTotals(data.totals || { orderCount: 0, totalVials: 0, totalWholesaleUsd: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [includeShipped]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 print:max-w-none">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™
          </p>
          <h1 className="text-3xl font-black text-black">Pharmacy order sheet</h1>
          <p className="text-black/60 mt-1 text-sm max-w-xl">
            Wholesale from your BoomRx tailored pricing (June 2025) + Formulation SKUs when clinic
            sale uses Formulation. GLP-1 refills default to BoomRx; max tirzepatide 12.5 mg/week.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-full border-2 border-black font-bold text-sm"
          >
            Print sheet
          </button>
          <Link href="/admin/rx-dispatch" className="text-sm font-bold text-[#E6007E] underline">
            Dispatch
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 no-print">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={includeShipped}
            onChange={(e) => setIncludeShipped(e.target.checked)}
          />
          Include shipped orders
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Orders to fill", value: String(totals.orderCount) },
          { label: "Total vials to order", value: String(totals.totalVials) },
          { label: "Est. wholesale", value: formatUsd(totals.totalWholesaleUsd) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-black/50">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.label === "Est. wholesale" && loading ? "…" : s.value}</p>
          </div>
        ))}
      </div>

      {rollup.length > 0 && (
        <div className="rounded-2xl border-4 border-black overflow-hidden bg-white">
          <div className="bg-[#E6007E] text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">
            Order summary — vials by dose
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-black/50 border-b border-black/10">
                  <th className="px-4 py-2">Medication</th>
                  <th className="px-4 py-2">Dose</th>
                  <th className="px-4 py-2">Pharmacy</th>
                  <th className="px-4 py-2">Orders</th>
                  <th className="px-4 py-2">SKU / ID</th>
                  <th className="px-4 py-2">Vials</th>
                  <th className="px-4 py-2">Wholesale</th>
                </tr>
              </thead>
              <tbody>
                {rollup.map((r) => (
                  <tr key={r.key} className="border-b border-black/5">
                    <td className="px-4 py-2 font-bold">{r.medication}</td>
                    <td className="px-4 py-2">{r.doseLabel}</td>
                    <td className="px-4 py-2 capitalize text-xs">{r.pharmacyVendor ?? "—"}</td>
                    <td className="px-4 py-2">{r.orderCount}</td>
                    <td className="px-4 py-2 font-mono text-xs">{r.pharmacySku ?? "—"}</td>
                    <td className="px-4 py-2 font-black text-[#E6007E]">{r.totalVials}</td>
                    <td className="px-4 py-2">{formatUsd(r.totalWholesaleUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-2xl border-4 border-black overflow-hidden bg-white">
        <div className="bg-black text-white px-4 py-2 font-bold text-sm uppercase tracking-wider">
          Patient orders
        </div>
        {loading ? (
          <p className="p-8 text-black/50">Loading…</p>
        ) : lines.length === 0 ? (
          <p className="p-8 text-black/50">No paid GLP-1 orders waiting for pharmacy fill.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-black/50 border-b border-black/10">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Patient</th>
                  <th className="px-4 py-2">Ref</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Medication</th>
                  <th className="px-4 py-2">Dose</th>
                  <th className="px-4 py-2">Supply</th>
                  <th className="px-4 py-2">Pharmacy</th>
                  <th className="px-4 py-2">SKU / ID</th>
                  <th className="px-4 py-2">Vials</th>
                  <th className="px-4 py-2">Wholesale</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={`${line.source}-${line.id}`} className="border-b border-black/5 hover:bg-rose-50/40">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(line.orderedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 font-medium">{line.patientName}</td>
                    <td className="px-4 py-2 font-mono text-xs">{line.intakeRef || "—"}</td>
                    <td className="px-4 py-2 capitalize">{line.source}</td>
                    <td className="px-4 py-2">{line.medication}</td>
                    <td className="px-4 py-2">{line.doseLabel || line.fulfillmentError || "—"}</td>
                    <td className="px-4 py-2">{line.supplyCycle === "90-day" ? "90-day" : "30-day"}</td>
                    <td className="px-4 py-2 capitalize text-xs">
                      {line.pharmacy || line.fulfillment?.pharmacyVendor || "—"}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {line.fulfillment?.pharmacySku ?? "—"}
                    </td>
                    <td className="px-4 py-2 font-black text-[#E6007E]">
                      {line.fulfillment?.vialsToOrder ?? "—"}
                    </td>
                    <td className="px-4 py-2">
                      {line.fulfillment ? formatUsd(line.fulfillment.totalWholesaleUsd) : "—"}
                    </td>
                    <td className="px-4 py-2 text-xs">{line.dispatchStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-black/50 no-print">
        BoomRx catalog: <code className="bg-black/5 px-1 rounded">lib/glp1-boomrx-catalog.ts</code>.
        Formulation SKUs: <code className="bg-black/5 px-1 rounded">lib/glp1-formulation-catalog.ts</code>.
        Example — Tirzepatide 12.5 mg 30-day: BoomRx $150 (3mL 60mg); 90-day: $415 combo; Formulation
        SKU 2500: $190 (3 × 1mL B6).
      </p>
    </div>
  );
}
