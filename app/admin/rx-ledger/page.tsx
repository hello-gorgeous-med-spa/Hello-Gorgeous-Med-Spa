"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  RX_LEDGER_SOURCES,
  RX_LEDGER_STATUSES,
  RX_LEDGER_TRACKS,
  type RxLedgerPaymentStatus,
  type RxLedgerSource,
  type RxPaymentLedgerRow,
} from "@/lib/rx-payment-ledger";
import type { RxInvoiceTrack } from "@/lib/rx-invoice-templates";

type LedgerStats = {
  total: number;
  pending: number;
  paid: number;
  pendingAmountUsd: number;
  paidAmountUsd: number;
};

const STATUS_COLORS: Record<RxLedgerPaymentStatus, string> = {
  pending: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  paid: "bg-green-500/20 text-green-200 border-green-500/40",
  failed: "bg-red-500/20 text-red-200 border-red-500/40",
  refunded: "bg-purple-500/20 text-purple-200 border-purple-500/40",
  unknown: "bg-gray-500/20 text-gray-300 border-gray-500/40",
};

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}


function shortDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

export default function RxLedgerPage() {
  const [rows, setRows] = useState<RxPaymentLedgerRow[]>([]);
  const [stats, setStats] = useState<LedgerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tableReady, setTableReady] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<RxLedgerPaymentStatus | "all">("all");
  const [trackFilter, setTrackFilter] = useState<RxInvoiceTrack | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<RxLedgerSource | "all">("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [chartDraft, setChartDraft] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (statusFilter !== "all") p.set("status", statusFilter);
    if (trackFilter !== "all") p.set("track", trackFilter);
    if (sourceFilter !== "all") p.set("source", sourceFilter);
    if (debouncedSearch) p.set("search", debouncedSearch);
    if (dateFrom) p.set("dateFrom", dateFrom);
    if (dateTo) p.set("dateTo", dateTo);
    p.set("limit", "300");
    return p.toString();
  }, [statusFilter, trackFilter, sourceFilter, debouncedSearch, dateFrom, dateTo]);

  const loadLedger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/rx-ledger?${queryString}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not load ledger");
        return;
      }
      setRows(data.rows || []);
      setStats(data.stats || null);
      setTableReady(data.tableReady !== false);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    loadLedger();
  }, [loadLedger]);

  const exportCsv = () => {
    window.open(`/api/admin/rx-ledger/export?${queryString}`, "_blank");
  };

  const startEditChart = (row: RxPaymentLedgerRow) => {
    setEditingId(row.id);
    setChartDraft(row.chart_note || "");
  };

  const saveChartNote = async (row: RxPaymentLedgerRow) => {
    setSavingId(row.id);
    try {
      const res = await fetch(`/api/admin/rx-ledger/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chartNote: chartDraft.trim() || null }),
      });
      const data = await res.json();
      if (res.ok && data.row) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? data.row : r)));
        setEditingId(null);
      }
    } finally {
      setSavingId(null);
    }
  };

  const markStatus = async (row: RxPaymentLedgerRow, paymentStatus: RxLedgerPaymentStatus) => {
    setSavingId(row.id);
    try {
      const res = await fetch(`/api/admin/rx-ledger/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      const data = await res.json();
      if (res.ok && data.row) {
        setRows((prev) => prev.map((r) => (r.id === row.id ? data.row : r)));
        await loadLedger();
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 pb-24">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-[#FF2D8E]">RX</span> Payment Ledger
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Compliance spreadsheet — every Square invoice &amp; payment link for GLP-1, peptides &amp; fees.
              Chart notes, status, CSV export.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Link href="/admin/rx-invoices" className="text-xs text-[#FFB8DC] hover:text-white">
              Send invoice →
            </Link>
            <Link href="/admin/rx-dispatch" className="text-xs text-[#FFB8DC] hover:text-white">
              RX Dispatch →
            </Link>
            <Link href="/admin" className="text-xs text-gray-500 hover:text-white">
              ← Admin
            </Link>
          </div>
        </div>

        {!tableReady ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 mb-4">
            Ledger table not migrated yet — run Supabase migrations, then refresh.
          </div>
        ) : null}

        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="rounded-xl border-2 border-gray-800 bg-gray-900 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Rows</p>
              <p className="text-xl font-black">{stats.total}</p>
            </div>
            <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-amber-300/70">Pending</p>
              <p className="text-xl font-black text-amber-200">
                {stats.pending}{" "}
                <span className="text-sm font-bold opacity-80">
                  ({formatUsd(stats.pendingAmountUsd)})
                </span>
              </p>
            </div>
            <div className="rounded-xl border-2 border-green-500/30 bg-green-500/5 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-green-300/70">Paid (view)</p>
              <p className="text-xl font-black text-green-200">
                {stats.paid}{" "}
                <span className="text-sm font-bold opacity-80">({formatUsd(stats.paidAmountUsd)})</span>
              </p>
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl border-2 border-[#E6007E] bg-[#E6007E]/15 px-4 py-3 text-left hover:bg-[#E6007E]/25 transition"
            >
              <p className="text-[10px] uppercase tracking-widest text-[#FFB8DC]">Export</p>
              <p className="text-sm font-black">Download CSV ↓</p>
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RxLedgerPaymentStatus | "all")}
            className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs font-bold"
          >
            <option value="all">All statuses</option>
            {RX_LEDGER_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value as RxInvoiceTrack | "all")}
            className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs font-bold"
          >
            <option value="all">All tracks</option>
            {RX_LEDGER_TRACKS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as RxLedgerSource | "all")}
            className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs font-bold"
          >
            <option value="all">All sources</option>
            {RX_LEDGER_SOURCES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs"
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-xs"
            aria-label="To date"
          />
          <button
            type="button"
            onClick={loadLedger}
            className="rounded-lg border border-gray-600 px-3 py-2 text-xs font-bold hover:border-gray-400"
          >
            Refresh
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client, ref, template, chart note…"
          className="w-full rounded-xl bg-gray-900 border border-gray-700 px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-[#E6007E] mb-4"
        />

        {error ? (
          <p className="text-sm text-red-300 mb-4">{error}</p>
        ) : loading ? (
          <p className="text-sm text-gray-500 py-12 text-center">Loading ledger…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center">
            No rows yet — send an RX invoice or run a patient checkout to populate.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="bg-gray-900 text-left text-[10px] uppercase tracking-wider text-[#FFB8DC] border-b-2 border-black">
                  <th className="px-3 py-3 font-bold">Date</th>
                  <th className="px-3 py-3 font-bold">Client</th>
                  <th className="px-3 py-3 font-bold">Ref</th>
                  <th className="px-3 py-3 font-bold">Item</th>
                  <th className="px-3 py-3 font-bold text-right">Amount</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                  <th className="px-3 py-3 font-bold">Source</th>
                  <th className="px-3 py-3 font-bold min-w-[200px]">Chart note</th>
                  <th className="px-3 py-3 font-bold">Link</th>
                  <th className="px-3 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-gray-800/80 ${
                      idx % 2 === 0 ? "bg-gray-950" : "bg-gray-900/40"
                    }`}
                  >
                    <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                      {shortDate(row.created_at)}
                      {row.paid_at ? (
                        <span className="block text-green-400/80">Paid {shortDate(row.paid_at)}</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-bold text-sm">{row.client_name || "—"}</p>
                      <p className="text-[11px] text-gray-500 truncate max-w-[140px]">
                        {[row.client_email, row.client_phone].filter(Boolean).join(" · ") || "—"}
                      </p>
                      {row.client_id ? (
                        <Link
                          href={`/admin/clients/${row.client_id}`}
                          className="text-[10px] text-[#FFB8DC] hover:underline"
                        >
                          Chart →
                        </Link>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-xs font-mono text-gray-300">
                      {row.intake_ref || "—"}
                    </td>
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-xs">{row.template_name || row.line_label}</p>
                      <p className="text-[11px] text-gray-500">{row.line_label}</p>
                      {row.track ? (
                        <span className="text-[10px] text-[#FFB8DC]/70">{row.track}</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 text-right font-black text-[#FF2D8E] whitespace-nowrap">
                      {formatUsd(row.amount_usd)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          STATUS_COLORS[row.payment_status]
                        }`}
                      >
                        {row.payment_status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[11px] text-gray-400">
                      {RX_LEDGER_SOURCES.find((s) => s.id === row.source)?.label ?? row.source}
                      {row.sent_by ? (
                        <span className="block text-[10px] text-gray-600">{row.sent_by}</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      {editingId === row.id ? (
                        <div className="space-y-1">
                          <textarea
                            value={chartDraft}
                            onChange={(e) => setChartDraft(e.target.value)}
                            rows={2}
                            className="w-full rounded-lg bg-gray-800 border border-gray-600 px-2 py-1 text-xs focus:outline-none focus:border-[#E6007E]"
                            placeholder="Charted in Jane / compliance note…"
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={savingId === row.id}
                              onClick={() => saveChartNote(row)}
                              className="text-[10px] font-bold text-green-400 hover:text-green-300"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-[10px] text-gray-500 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditChart(row)}
                          className="text-left text-xs text-gray-300 hover:text-white w-full"
                        >
                          {row.chart_note || (
                            <span className="text-gray-600 italic">Add chart note…</span>
                          )}
                        </button>
                      )}
                      {row.staff_note ? (
                        <p className="text-[10px] text-gray-600 mt-1 truncate" title={row.staff_note}>
                          Staff: {row.staff_note}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.payment_url ? (
                        <a
                          href={row.payment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#FFB8DC] underline break-all"
                        >
                          Square
                        </a>
                      ) : (
                        "—"
                      )}
                      {row.square_payment_id ? (
                        <p className="text-[10px] text-gray-600 font-mono truncate max-w-[80px]">
                          {row.square_payment_id.slice(0, 8)}…
                        </p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {row.payment_status !== "paid" ? (
                        <button
                          type="button"
                          disabled={savingId === row.id}
                          onClick={() => markStatus(row, "paid")}
                          className="text-[10px] font-bold text-green-400 hover:text-green-300 mr-2"
                        >
                          Mark paid
                        </button>
                      ) : null}
                      {row.payment_status === "pending" ? (
                        <button
                          type="button"
                          disabled={savingId === row.id}
                          onClick={() => markStatus(row, "failed")}
                          className="text-[10px] text-red-400/80 hover:text-red-300"
                        >
                          Failed
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-[11px] text-gray-600 mt-4 max-w-2xl">
          Rows auto-log when staff send RX invoices or patients pay on refill/consult forms. Square
          webhooks mark paid when order IDs match. Use chart notes for compliance documentation; export
          CSV for audits.
        </p>
      </div>
    </div>
  );
}
