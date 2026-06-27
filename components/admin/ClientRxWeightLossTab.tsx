"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { RxClinicEncounterWithClient } from "@/lib/rx-clinic-encounter";
import { RX_CLINIC_ENCOUNTER_TYPES } from "@/lib/rx-clinic-encounter";
import type { RefillDueItem, RefillPrepResult } from "@/lib/rx-clinic-refill";

function formatUsd(n: number): string {
  return `$${n.toFixed(2)}`;
}

function encounterTypeLabel(id: string): string {
  return RX_CLINIC_ENCOUNTER_TYPES.find((t) => t.id === id)?.label ?? id;
}

function urgencyLabel(item: RefillDueItem | RefillPrepResult["due"]): string {
  if (item.urgency === "overdue") {
    const days = "daysUntilDue" in item && item.daysUntilDue != null ? Math.abs(item.daysUntilDue) : 0;
    return days > 0 ? `${days} days overdue` : "Overdue";
  }
  if (item.urgency === "due_soon") {
    const days = "daysUntilDue" in item ? item.daysUntilDue : null;
    return days != null ? `Due in ${days} days` : "Due soon";
  }
  return "On track";
}

export function ClientRxWeightLossTab({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const [rows, setRows] = useState<RxClinicEncounterWithClient[]>([]);
  const [refillPrep, setRefillPrep] = useState<RefillPrepResult | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [encRes, prepRes] = await Promise.all([
        fetch(`/api/admin/rx/clinic-encounters?client_id=${encodeURIComponent(clientId)}&limit=20`),
        fetch(`/api/admin/rx/clinic-refills/prep?client_id=${encodeURIComponent(clientId)}`),
      ]);
      const encData = await encRes.json();
      if (encRes.ok) setRows(encData.rows || []);

      const prepData = await prepRes.json();
      if (prepRes.ok) setRefillPrep(prepData as RefillPrepResult);
      else setRefillPrep(null);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const active = rows.find(
    (r) => r.status === "paid" || r.status === "ready_to_ship" || r.status === "shipped",
  );

  const canRefill = !!refillPrep;

  if (loading) {
    return <div className="animate-pulse h-40 bg-white rounded-xl border border-black/10" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-black">RX / Weight Loss</h2>
          <p className="text-sm text-black/60 mt-1">
            In-person clinic sales — dose, supply cycle, payment, and ship-to-home history for{" "}
            {clientName}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canRefill && (
            <Link
              href={`/admin/rx/clinic-sale?client=${clientId}&refill=1`}
              className="px-4 py-2 rounded-full border-2 border-black font-bold text-sm hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Refill — same dose
            </Link>
          )}
          <Link
            href={`/admin/rx/clinic-sale?client=${clientId}`}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white text-sm font-bold"
          >
            + New clinic sale
          </Link>
        </div>
      </div>

      {refillPrep && refillPrep.due.urgency !== "ok" && (
        <div
          className={`rounded-2xl border-4 border-black p-4 ${
            refillPrep.due.urgency === "overdue" ? "bg-red-50" : "bg-amber-50"
          }`}
        >
          <p className="font-black text-sm uppercase tracking-wider">
            {refillPrep.due.urgency === "overdue" ? "Refill overdue" : "Refill due soon"}
          </p>
          <p className="text-sm mt-1">{urgencyLabel(refillPrep.due)}</p>
          {refillPrep.due.dueAt && (
            <p className="text-xs text-black/60 mt-1">
              Next refill target: {new Date(refillPrep.due.dueAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {active && (
        <div className="rounded-2xl border-4 border-black bg-rose-50 p-5 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">Current protocol</p>
          <p className="text-lg font-black mt-1">
            {active.medication} — {active.dose_label || active.dose_tier_id}
          </p>
          <p className="text-sm text-black/70 mt-1">
            {active.supply_cycle} · {encounterTypeLabel(active.encounter_type)} ·{" "}
            {formatUsd(active.final_total_usd)} · {active.status.replace(/_/g, " ")}
          </p>
          {active.tracking_number && (
            <p className="text-sm font-medium mt-2">
              Tracking: {active.carrier ? `${active.carrier} · ` : ""}
              {active.tracking_number}
            </p>
          )}
          {active.chart_note_id && (
            <Link
              href={`/admin/charting?client=${clientId}`}
              className="inline-block mt-3 text-sm font-bold text-[#E6007E] underline"
            >
              View chart note →
            </Link>
          )}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl border border-black/10 bg-white p-8 text-center text-black/50">
          No clinic RX sales yet. Start one from the button above after an in-person consult.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-black/50 border-b border-black/10">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Visit</th>
                <th className="px-4 py-3">Med / dose</th>
                <th className="px-4 py-3">Cycle</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Pay</th>
                <th className="px-4 py-3">Ship</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-black/5">
                  <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{encounterTypeLabel(r.encounter_type)}</td>
                  <td className="px-4 py-3">
                    {r.medication} {r.dose_label}
                  </td>
                  <td className="px-4 py-3">{r.supply_cycle}</td>
                  <td className="px-4 py-3 font-bold">{formatUsd(r.final_total_usd)}</td>
                  <td className="px-4 py-3 capitalize">{r.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 capitalize">{r.dispatch_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
