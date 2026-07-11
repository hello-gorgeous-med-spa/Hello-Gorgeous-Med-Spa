"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { formatUsd } from "@/lib/payroll/calculate";
import type { PayrollPreviewResult } from "@/lib/payroll/preview";
import type { StaffPayPreview } from "@/lib/payroll/types";

function payoutLabel(channel: StaffPayPreview["payoutChannel"]): string {
  if (channel === "square_payroll_w2") return "Square Payroll · W-2";
  if (channel === "square_payroll_1099") return "Square Payroll · 1099";
  return "Owner draw";
}

export default function AdminPayrollPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PayrollPreviewResult | null>(null);
  const [ryanReviews, setRyanReviews] = useState(0);
  const [marissaReviews, setMarissaReviews] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({
        ryanReviews: String(ryanReviews),
        marissaReviews: String(marissaReviews),
      });
      const res = await fetch(`/api/admin/payroll/preview?${q}`, { cache: "no-store" });
      const json = (await res.json()) as PayrollPreviewResult & { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to load payroll preview");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [ryanReviews, marissaReviews]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto text-black">
      <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
        <Link href="/admin/staff" className="text-[#E6007E] font-medium hover:underline">
          ← Staff
        </Link>
        <span>/</span>
        <span className="font-semibold">Weekly payroll</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-black">Weekly payroll preview</h1>
        <p className="text-sm text-black/70 mt-1 max-w-2xl">
          Pay rules from signed agreements · <strong>Monday–Sunday</strong> pay periods · Run payouts in{" "}
          <strong>Square Payroll</strong> (W-2 + Ryan 1099). Danielle is owner draw — not in this run.
        </p>
      </div>

      <section className="grid sm:grid-cols-2 gap-3 mb-6">
        <label className="block text-sm border-2 border-black rounded-xl p-3 bg-white">
          <span className="font-semibold">Ryan — Google reviews this week</span>
          <input
            type="number"
            min={0}
            value={ryanReviews}
            onChange={(e) => setRyanReviews(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full border border-black/20 rounded px-2 py-1"
          />
        </label>
        <label className="block text-sm border-2 border-black rounded-xl p-3 bg-white">
          <span className="font-semibold">Marissa — Google reviews this week</span>
          <input
            type="number"
            min={0}
            value={marissaReviews}
            onChange={(e) => setMarissaReviews(parseInt(e.target.value, 10) || 0)}
            className="mt-1 w-full border border-black/20 rounded px-2 py-1"
          />
        </label>
      </section>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-4 py-2 rounded-full border-2 border-black bg-[#FF2D8E] text-white font-semibold text-sm disabled:opacity-50"
        >
          {loading ? "Loading…" : "Refresh from Square"}
        </button>
        <a
          href="https://squareup.com/dashboard/payroll"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full border-2 border-black bg-white font-semibold text-sm"
        >
          Open Square Payroll →
        </a>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700 border border-red-300 bg-red-50 rounded-lg p-3">{error}</p>
      )}

      {data && (
        <>
          <p className="text-sm text-black/70 mb-4">
            <strong>{data.period.label}</strong>
            {data.squareError ? ` · ⚠ ${data.squareError}` : ""}
            {data.meta
              ? ` · ${data.meta.timecardCount} timecards · ${data.meta.paymentCount} payments · ${data.meta.regenAttributedCount ?? 0} RE GEN attributed`
              : ""}
          </p>

          <div className="space-y-4">
            {data.staff.map((person) => (
              <article
                key={person.planId}
                className="rounded-3xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.3)] p-5"
              >
                <div className="flex flex-wrap justify-between gap-2 mb-3">
                  <div>
                    <h2 className="text-lg font-black">{person.displayName}</h2>
                    <p className="text-sm text-black/70">{person.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-black/50">{payoutLabel(person.payoutChannel)}</p>
                    <p className="text-2xl font-black text-[#E6007E]">{formatUsd(person.totalCents)}</p>
                  </div>
                </div>

                <ul className="text-sm space-y-2 border-t border-black/10 pt-3">
                  {person.lineItems.map((line) => (
                    <li key={line.code + line.label} className="flex justify-between gap-4">
                      <span>
                        <span className="font-medium">{line.label}</span>
                        {line.detail ? (
                          <span className="block text-xs text-black/55">{line.detail}</span>
                        ) : null}
                      </span>
                      <span className="font-semibold whitespace-nowrap">{formatUsd(line.amountCents)}</span>
                    </li>
                  ))}
                </ul>

                {person.warnings.length > 0 && (
                  <ul className="mt-3 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-2 space-y-1">
                    {person.warnings.map((w) => (
                      <li key={w}>⚠ {w}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          <section className="mt-8 rounded-2xl border-2 border-black/15 bg-rose-50/80 p-4 text-sm text-black/80">
            <h3 className="font-bold mb-2">Next: commission attribution</h3>
            <p>
              Square payments don&apos;t always include who closed the sale. For accurate commission, assign the team
              member at checkout in Square POS, or we&apos;ll wire order-level attribution in the next phase.
            </p>
          </section>
        </>
      )}
    </div>
  );
}
