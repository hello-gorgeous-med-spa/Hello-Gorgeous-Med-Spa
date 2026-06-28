"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { RxE2eCheck, RxE2eReport } from "@/lib/rx-e2e-checklist";

const MANUAL_STEPS = [
  {
    step: 1,
    title: "Submit test GLP-1 refill",
    detail: "Use /glp1-refill with an email you control. Confirm dispatch row auto-created.",
    href: "/glp1-refill",
    external: false,
  },
  {
    step: 2,
    title: "Pay with Square",
    detail: "Complete checkout. Ledger should flip to paid via webhook within minutes.",
    href: "/admin/rx-ledger",
    external: false,
  },
  {
    step: 3,
    title: "Review dispatch",
    detail: "Address, drug, sig prefilled. Approve when clinically cleared.",
    href: "/admin/rx-dispatch",
    external: false,
  },
  {
    step: 4,
    title: "Place BoomRx order & mark sent",
    detail: "Add tracking in staff notes. Patient gets ship SMS + My RX updates.",
    href: "/admin/rx/pharmacy-orders",
    external: false,
  },
  {
    step: 5,
    title: "Patient My RX",
    detail: "Sign into portal — order shows shipped. Refill due date set from supply cycle.",
    href: "/portal/rx",
    external: false,
  },
  {
    step: 6,
    title: "Repeat for peptide",
    detail: "Run /peptide-request through the same path.",
    href: "/peptide-request",
    external: false,
  },
] as const;

function statusBadge(status: RxE2eCheck["status"]) {
  if (status === "pass") return "bg-green-500/20 text-green-300 border-green-500/40";
  if (status === "warn") return "bg-amber-500/20 text-amber-200 border-amber-500/40";
  return "bg-red-500/20 text-red-300 border-red-500/40";
}

export default function RxE2eChecklistPage() {
  const [report, setReport] = useState<RxE2eReport | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx/e2e-status");
      const data = await res.json();
      if (res.ok) setReport(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8 text-white">
      <div>
        <Link href="/admin/rx" className="text-sm text-pink-300 hover:underline">
          ← RX Command
        </Link>
        <h1 className="text-2xl font-black mt-2">Phase 1 — End-to-end checklist</h1>
        <p className="text-sm text-white/60 mt-1">
          Run one GLP-1 and one peptide order pay → dispatch → pharmacy → shipped before going
          live to patients.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-bold">System health</h2>
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs font-semibold text-pink-300 hover:underline"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-white/50">Checking…</p>
        ) : report ? (
          <>
            <p
              className={`text-sm font-semibold mb-4 ${report.ready ? "text-green-300" : "text-amber-200"}`}
            >
              {report.ready
                ? "Infrastructure looks ready for E2E testing."
                : "Fix failed checks before patient go-live."}
            </p>
            <ul className="space-y-2">
              {report.checks.map((check) => (
                <li
                  key={check.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 ${statusBadge(check.status)}`}
                >
                  <div>
                    <p className="text-sm font-semibold">{check.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{check.detail}</p>
                  </div>
                  {check.href ? (
                    <Link href={check.href} className="text-xs font-bold shrink-0 hover:underline">
                      Open →
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-red-300">Could not load health report.</p>
        )}
      </section>

      <section>
        <h2 className="font-bold mb-3">Manual test script</h2>
        <ol className="space-y-3">
          {MANUAL_STEPS.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-white/10 bg-black/30 p-4 flex gap-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-sm font-black text-pink-200">
                {s.step}
              </span>
              <div className="min-w-0">
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-white/55 mt-1">{s.detail}</p>
                <Link href={s.href} className="inline-block mt-2 text-xs font-bold text-pink-300 hover:underline">
                  Go →
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-5">
        <h2 className="font-bold text-pink-100">Phase 3 — Refill cadence (automated)</h2>
        <ul className="mt-3 space-y-2 text-sm text-white/70 list-disc list-inside">
          <li>Refill due dates from shipped clinic sales + shipped online intakes</li>
          <li>My RX banner when due soon or overdue</li>
          <li>Daily cron SMS/email reminders (7-day cooldown per patient)</li>
          <li>Square auto-pay enrolls monthly billing; each charge still flows through dispatch</li>
        </ul>
        <p className="text-xs text-white/45 mt-4">
          Full details in{" "}
          <a href="/docs/rx-owners-manual.md" className="text-pink-300 underline" target="_blank" rel="noopener noreferrer">
            RX Owner&apos;s Manual
          </a>
        </p>
      </section>
    </div>
  );
}
