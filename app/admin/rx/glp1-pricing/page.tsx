"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Glp1InsurancePriceRow, Glp1PriceListRow } from "@/lib/glp1-price-list";
import type { Glp1OrderProfitRow, Glp1OrderProfitTotals } from "@/lib/glp1-order-profit";
import type { PeptidePriceListRow } from "@/lib/peptide-price-list";

type Tab = "glp1" | "peptides" | "order-profit";

function formatUsd(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `$${n.toFixed(2)}`;
}

function formatPct(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toFixed(1)}%`;
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export default function Glp1PricingPage() {
  const [tab, setTab] = useState<Tab>("glp1");
  const [loading, setLoading] = useState(true);
  const [includeShipped, setIncludeShipped] = useState(false);
  const [cycleFilter, setCycleFilter] = useState<"all" | "30-day" | "90-day">("all");
  const [medFilter, setMedFilter] = useState<"all" | "Semaglutide" | "Tirzepatide">("all");
  const [peptideFilter, setPeptideFilter] = useState("");

  const [priceList, setPriceList] = useState<Glp1PriceListRow[]>([]);
  const [peptidePriceList, setPeptidePriceList] = useState<PeptidePriceListRow[]>([]);
  const [insuranceRows, setInsuranceRows] = useState<Glp1InsurancePriceRow[]>([]);
  const [orderProfit, setOrderProfit] = useState<Glp1OrderProfitRow[]>([]);
  const [profitTotals, setProfitTotals] = useState<Glp1OrderProfitTotals | null>(null);
  const [summary, setSummary] = useState<{ avgBoomrxMargin90: number | null; avgBoomrxMargin30: number | null } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = includeShipped ? "?include_shipped=1" : "";
      const res = await fetch(`/api/admin/rx/glp1-pricing${q}`);
      const data = await res.json();
      if (res.ok) {
        setPriceList(data.priceList || []);
        setPeptidePriceList(data.peptidePriceList || []);
        setInsuranceRows(data.insuranceRows || []);
        setOrderProfit(data.orderProfit || []);
        setProfitTotals(data.profitTotals || null);
        setSummary(data.summary || null);
      }
    } finally {
      setLoading(false);
    }
  }, [includeShipped]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredPriceList = useMemo(() => {
    return priceList.filter((r) => {
      if (cycleFilter !== "all" && r.supplyCycle !== cycleFilter) return false;
      if (medFilter !== "all" && r.medication !== medFilter) return false;
      return true;
    });
  }, [priceList, cycleFilter, medFilter]);

  const filteredPeptideList = useMemo(() => {
    const q = peptideFilter.trim().toLowerCase();
    return peptidePriceList.filter((r) => {
      if (cycleFilter !== "all" && r.supplyCycle !== cycleFilter) return false;
      if (q && !r.peptideName.toLowerCase().includes(q) && !r.category.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [peptidePriceList, cycleFilter, peptideFilter]);

  const exportCsv = (sheet: "glp1" | "peptides" | "orders") => {
    const q = new URLSearchParams({
      format: "csv",
      sheet: sheet === "orders" ? "orders" : sheet === "peptides" ? "peptides" : "price-list",
    });
    if (includeShipped) q.set("include_shipped", "1");
    window.open(`/api/admin/rx/glp1-pricing?${q}`, "_blank");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™
          </p>
          <h1 className="text-3xl font-black text-black">RX price list &amp; profit</h1>
          <p className="text-black/60 mt-1 text-sm max-w-2xl">
            GLP-1 dose tiers + all orderable peptides — 30-day and 90-day checkout totals with BoomRx
            wholesale from your tailored PDF. Items marked &quot;est&quot; use estimated COGS until confirmed on BoomRx.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              exportCsv(tab === "order-profit" ? "orders" : tab === "peptides" ? "peptides" : "glp1")
            }
            className="px-4 py-2 rounded-full border-2 border-black font-bold text-sm"
          >
            Export CSV
          </button>
          <Link href="/admin/rx/pharmacy-orders" className="text-sm font-bold text-[#E6007E] underline self-center">
            Pharmacy orders
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4 text-sm space-y-1">
        <p className="font-bold">Current policy</p>
        <ul className="list-disc pl-5 text-black/80 space-y-0.5">
          <li>
            <strong>Patient retail (menu)</strong> — BoomRx wholesale × 2.5 per month (product only)
          </li>
          <li>
            <strong>Website checkout</strong> — product total + $35 cold-chain shipping. 90-day product
            gets an extra 10% off before shipping.
          </li>
          <li>
            <strong>Order pharmacy</strong> — <strong>BoomRx</strong> for online refills &amp; 90-day
            packs (your tailored PDF pricing)
          </li>
          <li>
            <strong>Clinic alternative</strong> — Formulation SKUs 2498–2500 for tirzepatide when
            selected on clinic sale
          </li>
        </ul>
        {summary && (
          <p className="text-black/60 pt-1">
            Avg BoomRx margin on website charge: 30-day {formatPct(summary.avgBoomrxMargin30)} · 90-day{" "}
            {formatPct(summary.avgBoomrxMargin90)}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 no-print">
        {(
          [
            ["glp1", "GLP-1"],
            ["peptides", "Peptides"],
            ["order-profit", "Order profit (GLP-1)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 rounded-full border-2 font-bold text-sm ${
              tab === id ? "border-[#E6007E] bg-[#E6007E] text-white" : "border-black bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "glp1" && (
        <>
          <div className="flex flex-wrap gap-3 no-print">
            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value as typeof cycleFilter)}
              className="border-2 border-black rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              <option value="all">All supply cycles</option>
              <option value="90-day">90-day only</option>
              <option value="30-day">30-day only</option>
            </select>
            <select
              value={medFilter}
              onChange={(e) => setMedFilter(e.target.value as typeof medFilter)}
              className="border-2 border-black rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              <option value="all">All medications</option>
              <option value="Tirzepatide">Tirzepatide</option>
              <option value="Semaglutide">Semaglutide</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <table className="w-full text-sm min-w-[1100px]">
              <thead className="bg-black text-white text-left">
                <tr>
                  <th className="px-3 py-2">Med</th>
                  <th className="px-3 py-2">Dose</th>
                  <th className="px-3 py-2">Cycle</th>
                  <th className="px-3 py-2">Retail/mo</th>
                  <th className="px-3 py-2">Website charge</th>
                  <th className="px-3 py-2">Ship</th>
                  <th className="px-3 py-2">Order via</th>
                  <th className="px-3 py-2 bg-[#2d1020]">BoomRx COGS</th>
                  <th className="px-3 py-2 bg-[#2d1020]">BoomRx profit</th>
                  <th className="px-3 py-2 bg-[#2d1020]">Margin</th>
                  <th className="px-3 py-2">Formulation COGS</th>
                  <th className="px-3 py-2">F. profit</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-8 text-center text-black/50">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  filteredPriceList.map((r) => (
                    <tr
                      key={`${r.tierId}-${r.supplyCycle}`}
                      className={`border-t border-black/10 ${
                        r.supplyCycle === "90-day" ? "bg-rose-50/50" : ""
                      }`}
                    >
                      <td className="px-3 py-2 font-medium">{r.medication.replace("Tirzepatide", "Tirz").replace("Semaglutide", "Sema")}</td>
                      <td className="px-3 py-2">{r.doseLabel}</td>
                      <td className="px-3 py-2 font-bold">{r.supplyCycle === "90-day" ? "90-day ★" : "30-day"}</td>
                      <td className="px-3 py-2">{formatUsd(r.retailMonthlyUsd)}</td>
                      <td className="px-3 py-2 font-bold text-[#E6007E]">{formatUsd(r.websiteChargeUsd)}</td>
                      <td className="px-3 py-2">{formatUsd(r.shippingUsd)}</td>
                      <td className="px-3 py-2 capitalize">{r.preferredVendor}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {formatUsd(r.boomrx.wholesaleUsd)}
                        {r.boomrx.sku && (
                          <span className="block text-black/50">{r.boomrx.sku}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-bold text-green-700">
                        {formatUsd(r.boomrx.grossProfitUsd)}
                      </td>
                      <td className="px-3 py-2">{formatPct(r.boomrx.marginPct)}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {r.formulation ? (
                          <>
                            {formatUsd(r.formulation.wholesaleUsd)}
                            <span className="block text-black/50">SKU {r.formulation.sku}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.formulation ? formatUsd(r.formulation.grossProfitUsd) : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {insuranceRows.length > 0 && (
            <div className="rounded-2xl border-2 border-black p-4 bg-white">
              <h2 className="font-black text-lg mb-2">Insurance oversight (no med COGS)</h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {insuranceRows.map((r) => (
                  <div key={r.supplyCycle} className="border border-black/15 rounded-xl p-3">
                    <p className="font-bold">{r.supplyCycle}</p>
                    <p>{formatUsd(r.retailMonthlyUsd)}/mo oversight → charge {formatUsd(r.websiteChargeUsd)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "peptides" && (
        <>
          <div className="flex flex-wrap gap-3 no-print">
            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value as typeof cycleFilter)}
              className="border-2 border-black rounded-lg px-3 py-1.5 text-sm font-medium"
            >
              <option value="all">All supply cycles</option>
              <option value="90-day">90-day only</option>
              <option value="30-day">30-day only</option>
            </select>
            <input
              type="search"
              placeholder="Filter peptide…"
              value={peptideFilter}
              onChange={(e) => setPeptideFilter(e.target.value)}
              className="border-2 border-black rounded-lg px-3 py-1.5 text-sm font-medium min-w-[180px]"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-black text-white text-left">
                <tr>
                  <th className="px-3 py-2">Peptide</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Cycle</th>
                  <th className="px-3 py-2">Retail/mo</th>
                  <th className="px-3 py-2">Website charge</th>
                  <th className="px-3 py-2">BoomRx COGS</th>
                  <th className="px-3 py-2">Profit</th>
                  <th className="px-3 py-2">Margin</th>
                  <th className="px-3 py-2">PDF</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-black/50">
                      Loading…
                    </td>
                  </tr>
                ) : (
                  filteredPeptideList.map((r) => (
                    <tr
                      key={`${r.peptideMenuId}-${r.supplyCycle}`}
                      className={`border-t border-black/10 ${r.supplyCycle === "90-day" ? "bg-rose-50/50" : ""}`}
                    >
                      <td className="px-3 py-2 font-medium">{r.peptideName}</td>
                      <td className="px-3 py-2 text-xs">{r.category}</td>
                      <td className="px-3 py-2 font-bold">{r.supplyCycle === "90-day" ? "90-day ★" : "30-day"}</td>
                      <td className="px-3 py-2">{formatUsd(r.retailMonthlyUsd)}</td>
                      <td className="px-3 py-2 font-bold text-[#E6007E]">{formatUsd(r.websiteChargeUsd)}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {formatUsd(r.boomrxWholesaleUsd)}
                        {r.boomrxSku && <span className="block text-black/50">{r.boomrxSku}</span>}
                      </td>
                      <td className="px-3 py-2 font-bold text-green-700">{formatUsd(r.grossProfitUsd)}</td>
                      <td className="px-3 py-2">{formatPct(r.marginPct)}</td>
                      <td className="px-3 py-2 text-xs">{r.inPdf ? "PDF" : "est"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-black/50">
            90-day wholesale = 3× monthly BoomRx vial from your PDF. Combined multi-peptide refills add one $35
            shipping fee at checkout (same as GLP-1).
          </p>
        </>
      )}

      {tab === "order-profit" && (
        <>
          <div className="flex flex-wrap gap-3 items-center no-print">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={includeShipped}
                onChange={(e) => setIncludeShipped(e.target.checked)}
              />
              Include shipped orders
            </label>
          </div>

          {profitTotals && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: "Paid orders", value: String(profitTotals.orderCount) },
                { label: "Website", value: String(profitTotals.onlineCount) },
                { label: "Clinic", value: String(profitTotals.clinicCount) },
                { label: "Revenue collected", value: formatUsd(profitTotals.revenueUsd) },
                { label: "Gross profit", value: formatUsd(profitTotals.grossProfitUsd) },
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
          )}

          <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)]">
            <table className="w-full text-sm min-w-[1000px]">
              <thead className="bg-black text-white text-left">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Patient</th>
                  <th className="px-3 py-2">Med / dose</th>
                  <th className="px-3 py-2">Cycle</th>
                  <th className="px-3 py-2">Revenue</th>
                  <th className="px-3 py-2">Wholesale</th>
                  <th className="px-3 py-2">Profit</th>
                  <th className="px-3 py-2">Margin</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-black/50">
                      Loading…
                    </td>
                  </tr>
                ) : orderProfit.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-black/50">
                      No paid GLP-1 orders yet — profit rows appear when clients pay via website refill or
                      clinic sale.
                    </td>
                  </tr>
                ) : (
                  orderProfit.map((r) => (
                    <tr key={r.id} className="border-t border-black/10 hover:bg-rose-50/30">
                      <td className="px-3 py-2 whitespace-nowrap">{shortDate(r.orderedAt)}</td>
                      <td className="px-3 py-2 capitalize">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            r.source === "online"
                              ? "bg-[#E6007E]/15 text-[#E6007E]"
                              : "bg-black/10"
                          }`}
                        >
                          {r.source}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-medium">{r.patientName}</span>
                        {r.intakeRef && (
                          <span className="block text-xs text-black/45">{r.intakeRef}</span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {r.medication}
                        <span className="block text-xs text-black/60">{r.doseLabel ?? "—"}</span>
                      </td>
                      <td className="px-3 py-2">{r.supplyCycle}</td>
                      <td className="px-3 py-2 font-bold">{formatUsd(r.revenueUsd)}</td>
                      <td className="px-3 py-2">{formatUsd(r.wholesaleUsd)}</td>
                      <td className="px-3 py-2 font-bold text-green-700">
                        {formatUsd(r.grossProfitUsd)}
                      </td>
                      <td className="px-3 py-2">{formatPct(r.marginPct)}</td>
                      <td className="px-3 py-2 capitalize text-xs">{r.dispatchStatus}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-black/50 max-w-2xl">
            Website orders default to BoomRx wholesale. Clinic rows use the pharmacy selected on the
            encounter. Revenue is the actual payment captured; wholesale is the pharmacy pack cost from
            your BoomRx PDF or Formulation SKU list.
          </p>
        </>
      )}
    </div>
  );
}
