"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type {
  CommissionPayout,
  PeriodCommissionPreview,
} from "@/lib/payroll/commission-payouts";

type StaffOption = { userId: string; displayName: string; email: string };

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function isoDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

const STATUS_CLS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-300",
  void: "bg-black/10 text-black/50 border-black/20",
};

export default function CommissionPayoutsPage() {
  const [payouts, setPayouts] = useState<CommissionPayout[]>([]);
  const [canManage, setCanManage] = useState(false);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [staffUserId, setStaffUserId] = useState("");
  const [periodStart, setPeriodStart] = useState(isoDateDaysAgo(14));
  const [periodEnd, setPeriodEnd] = useState(isoDateDaysAgo(0));
  const [preview, setPreview] = useState<PeriodCommissionPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx/commission-payouts");
      const data = await res.json();
      if (res.ok) {
        setPayouts(data.payouts ?? []);
        setCanManage(Boolean(data.canManage));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!canManage) return;
    (async () => {
      const res = await fetch("/api/admin/rx/sales-staff");
      const data = await res.json();
      if (res.ok) setStaff(data.staff ?? []);
    })();
  }, [canManage]);

  async function runPreview() {
    if (!staffUserId) return;
    setBusy(true);
    setMessage(null);
    setPreview(null);
    try {
      const res = await fetch(
        `/api/admin/rx/commission-payouts?previewStaff=${encodeURIComponent(staffUserId)}&start=${periodStart}&end=${periodEnd}`,
      );
      const data = await res.json();
      if (res.ok) setPreview(data.preview);
      else setMessage(data.error || "Preview failed");
    } finally {
      setBusy(false);
    }
  }

  async function recordPayout() {
    if (!preview) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rx/commission-payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffUserId: preview.staffUserId,
          periodStart: preview.periodStart,
          periodEnd: preview.periodEnd,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPreview(null);
        setMessage(`Recorded pending payout for ${data.payout.staffDisplayName}.`);
        void load();
      } else {
        setMessage(data.error || "Failed to record payout");
      }
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: "paid" | "void") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/commission-payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) void load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#E6007E] uppercase tracking-wider">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">Commission payouts</h1>
          <p className="text-black/60 mt-1 text-sm max-w-xl">
            {canManage
              ? "Close a period per staff member — the system computes credited sales and commission, you record it and mark it paid."
              : "Your commission payout history — what was closed, when, and what was paid."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx/regen-sales" className="font-bold text-[#E6007E] underline">
            Sales report
          </Link>
          <Link href="/admin/payroll" className="font-bold text-[#E6007E] underline">
            Payroll
          </Link>
        </div>
      </div>

      {canManage && (
        <section className="rounded-2xl border-4 border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] space-y-4">
          <h2 className="font-black text-lg">Close a period</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="text-sm font-bold">
              Staff
              <select
                value={staffUserId}
                onChange={(e) => setStaffUserId(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-black/20 px-3 py-2 font-medium"
              >
                <option value="">Select…</option>
                {staff.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold">
              From
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-black/20 px-3 py-2 font-medium"
              />
            </label>
            <label className="text-sm font-bold">
              Through
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="mt-1 w-full rounded-xl border-2 border-black/20 px-3 py-2 font-medium"
              />
            </label>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => void runPreview()}
                disabled={busy || !staffUserId}
                className="w-full rounded-xl border-2 border-black bg-white px-4 py-2 font-black hover:bg-rose-50 disabled:opacity-40"
              >
                Compute
              </button>
            </div>
          </div>

          {preview && (
            <div className="rounded-xl border-2 border-[#E6007E] bg-rose-50 p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black">{preview.staffDisplayName}</p>
                <p className="text-sm text-black/65">
                  {preview.periodStart} → {preview.periodEnd} · {preview.saleCount} sale
                  {preview.saleCount === 1 ? "" : "s"} · {formatUsd(preview.salesTotalUsd)} collected
                  {preview.commissionRate != null &&
                    ` · ${(preview.commissionRate * 100).toFixed(0)}%`}
                </p>
                <p className="text-lg font-black text-[#E6007E]">
                  Commission: {formatUsd(preview.commissionUsd)}
                </p>
                {preview.commissionRate == null && (
                  <p className="text-xs text-amber-700 font-bold">
                    No commission plan found for this staff member — record will be $0.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => void recordPayout()}
                disabled={busy}
                className="rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2.5 font-black text-white disabled:opacity-40"
              >
                Record pending payout
              </button>
            </div>
          )}
          {message && <p className="text-sm font-bold text-black/70">{message}</p>}
        </section>
      )}

      <section className="rounded-2xl border-4 border-black bg-white p-5">
        <h2 className="font-black text-lg mb-4">Payout history</h2>
        {loading ? (
          <p className="text-black/50">Loading…</p>
        ) : payouts.length === 0 ? (
          <p className="text-sm text-black/50">No payouts recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black/50 border-b border-black/10">
                  <th className="py-2 pr-4">Staff</th>
                  <th className="py-2 pr-4">Period</th>
                  <th className="py-2 pr-4">Sales</th>
                  <th className="py-2 pr-4">Commission</th>
                  <th className="py-2 pr-4">Status</th>
                  {canManage && <th className="py-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="py-2 pr-4 font-bold">{p.staffDisplayName || p.staffEmail}</td>
                    <td className="py-2 pr-4">
                      {p.periodStart} → {p.periodEnd}
                    </td>
                    <td className="py-2 pr-4">{formatUsd(p.salesTotalUsd)}</td>
                    <td className="py-2 pr-4 font-black text-[#E6007E]">
                      {formatUsd(p.commissionUsd)}
                      {p.commissionRate != null && (
                        <span className="text-xs font-medium text-black/45">
                          {" "}
                          ({(p.commissionRate * 100).toFixed(0)}%)
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_CLS[p.status]}`}
                      >
                        {p.status}
                        {p.status === "paid" && p.paidAt
                          ? ` · ${new Date(p.paidAt).toLocaleDateString()}`
                          : ""}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-2">
                        {p.status === "pending" && (
                          <span className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => void setStatus(p.id, "paid")}
                              disabled={busy}
                              className="rounded-lg border-2 border-emerald-600 px-2.5 py-1 text-xs font-black text-emerald-700 hover:bg-emerald-50"
                            >
                              Mark paid
                            </button>
                            <button
                              type="button"
                              onClick={() => void setStatus(p.id, "void")}
                              disabled={busy}
                              className="rounded-lg border-2 border-black/20 px-2.5 py-1 text-xs font-bold text-black/50 hover:bg-black/5"
                            >
                              Void
                            </button>
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
