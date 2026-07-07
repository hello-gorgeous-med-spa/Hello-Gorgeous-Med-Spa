"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { RxComplianceGate, RxComplianceReport } from "@/lib/rx-compliance/types";
import type { RxE2eCheck } from "@/lib/rx-e2e-checklist";

const MANUAL_STEPS = [
  {
    step: 1,
    title: "Submit test GLP-1 refill",
    detail: "Use /glp1-refill with an email you control. Confirm dispatch row auto-created.",
    href: "/glp1-refill",
  },
  {
    step: 2,
    title: "Pay with Square",
    detail: "Complete checkout. Ledger should flip to paid via webhook within minutes.",
    href: "/admin/rx-ledger",
  },
  {
    step: 3,
    title: "Review dispatch",
    detail: "Address, drug, sig prefilled. Approve when clinically cleared.",
    href: "/admin/rx-dispatch",
  },
  {
    step: 4,
    title: "Place pharmacy order & mark shipped",
    detail: "Add tracking in RX Ops shipments queue. Patient gets ship SMS + My RX updates.",
    href: "/admin/rx/ops",
  },
  {
    step: 5,
    title: "Patient My RX",
    detail: "Sign into portal — order shows shipped. Refill due date set from supply cycle.",
    href: "/portal/rx",
  },
  {
    step: 6,
    title: "Repeat for peptide",
    detail: "Run /peptide-request through the same path.",
    href: "/peptide-request",
  },
] as const;

function gateBadge(status: RxComplianceGate["status"]) {
  if (status === "pass") return "bg-green-500/20 text-green-300 border-green-500/40";
  if (status === "warn") return "bg-amber-500/20 text-amber-200 border-amber-500/40";
  return "bg-red-500/20 text-red-300 border-red-500/40";
}

function infraBadge(status: RxE2eCheck["status"]) {
  if (status === "pass") return "bg-green-500/20 text-green-300 border-green-500/40";
  if (status === "warn") return "bg-amber-500/20 text-amber-200 border-amber-500/40";
  return "bg-red-500/20 text-red-300 border-red-500/40";
}

export default function RxGoLivePage() {
  const [report, setReport] = useState<RxComplianceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newState, setNewState] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/rx/ops/compliance");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load compliance report");
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function patchCompliance(body: Record<string, unknown>) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/rx/ops/compliance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function uatSignoff(role: "owner" | "provider" | "front_desk") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/rx/ops/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-off failed");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-off failed");
    } finally {
      setBusy(false);
    }
  }

  const penTest = report?.securityReviews.find((r) => r.reviewKey === "annual_pen_test");

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 text-white">
      <div>
        <Link href="/admin/rx/ops" className="text-sm text-pink-300 hover:underline">
          ← RX Ops Console
        </Link>
        <h1 className="text-2xl font-black mt-2">M9 — Compliance & go-live</h1>
        <p className="text-sm text-white/60 mt-1">
          HGRX-100–103 gates production. Practice owns BAA and attorney sign-off; engineering tracks
          readiness here.
        </p>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-bold">Go-live readiness</h2>
          <button
            type="button"
            onClick={() => void load()}
            className="text-xs font-semibold text-pink-300 hover:underline"
          >
            Refresh
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-white/50">Loading…</p>
        ) : report ? (
          <>
            <p
              className={`text-sm font-semibold mb-4 ${report.readyForGoLive ? "text-green-300" : "text-amber-200"}`}
            >
              {report.readyForGoLive
                ? "All blocking gates clear — ready for owner cutover sign-off."
                : "Blocking items remain — resolve failed gates before patient go-live."}
            </p>
            <ul className="space-y-2">
              {report.gates.map((gate) => (
                <li
                  key={gate.id}
                  className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 ${gateBadge(gate.status)}`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {gate.ticket} · {gate.label}
                    </p>
                    <p className="text-xs opacity-80 mt-0.5">{gate.detail}</p>
                  </div>
                  {gate.href ? (
                    <Link href={gate.href} className="text-xs font-bold shrink-0 hover:underline">
                      Open →
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-red-300">Could not load report.</p>
        )}
      </section>

      <section id="baa" className="rounded-2xl border border-white/10 bg-black/30 p-5 scroll-mt-20">
        <h2 className="font-bold mb-1">HGRX-100 — Vendor BAAs</h2>
        <p className="text-xs text-white/50 mb-4">
          Execute and file BAAs for every PHI-touching vendor. Mark signed when on file.
        </p>
        <div className="space-y-2">
          {(report?.vendorBaas ?? []).map((v) => (
            <div
              key={v.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm"
            >
              <div>
                <p className="font-semibold">{v.vendorName}</p>
                <p className="text-xs text-white/45">{v.category}</p>
              </div>
              <select
                value={v.status}
                disabled={busy}
                onChange={(e) =>
                  void patchCompliance({
                    action: "vendor_baa",
                    id: v.id,
                    status: e.target.value,
                    signedAt: e.target.value === "signed" ? new Date().toISOString().slice(0, 10) : null,
                  })
                }
                className="rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs"
              >
                <option value="pending">Pending</option>
                <option value="signed">Signed</option>
                <option value="expired">Expired</option>
                <option value="not_required">Not required</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      <section id="security" className="rounded-2xl border border-white/10 bg-black/30 p-5 scroll-mt-20">
        <h2 className="font-bold mb-1">HGRX-101 — Security review / pen test</h2>
        <p className="text-xs text-white/50 mb-4">
          Third-party pen test completed; critical/high findings remediated; report archived.
        </p>
        {penTest ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs">
              Status
              <select
                value={penTest.status}
                disabled={busy}
                onChange={(e) =>
                  void patchCompliance({
                    action: "security_review",
                    id: penTest.id,
                    status: e.target.value,
                    completedAt:
                      e.target.value === "complete" || e.target.value === "remediated"
                        ? new Date().toISOString().slice(0, 10)
                        : null,
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1.5"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="complete">Complete</option>
                <option value="remediated">Remediated</option>
              </select>
            </label>
            <label className="text-xs">
              Vendor
              <input
                defaultValue={penTest.vendorName ?? ""}
                disabled={busy}
                onBlur={(e) =>
                  void patchCompliance({
                    action: "security_review",
                    id: penTest.id,
                    vendorName: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1.5"
              />
            </label>
            <label className="text-xs">
              Critical open
              <input
                type="number"
                min={0}
                defaultValue={penTest.criticalOpen}
                disabled={busy}
                onBlur={(e) =>
                  void patchCompliance({
                    action: "security_review",
                    id: penTest.id,
                    criticalOpen: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1.5"
              />
            </label>
            <label className="text-xs">
              High open
              <input
                type="number"
                min={0}
                defaultValue={penTest.highOpen}
                disabled={busy}
                onBlur={(e) =>
                  void patchCompliance({
                    action: "security_review",
                    id: penTest.id,
                    highOpen: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1.5"
              />
            </label>
          </div>
        ) : null}
      </section>

      <section id="licensing" className="rounded-2xl border border-white/10 bg-black/30 p-5 scroll-mt-20">
        <h2 className="font-bold mb-1">HGRX-102 — Licensing & controlled substances</h2>
        <p className="text-xs text-white/50 mb-4">
          Licensed-state list drives intake eligibility. Controlled SKUs require DEA + PMP before NP
          approval.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(report?.licensedStates ?? []).map((s) => (
            <span
              key={s.stateCode}
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                s.licensed ? "bg-green-500/20 text-green-200" : "bg-white/10 text-white/40"
              }`}
            >
              {s.stateCode}
              {s.licensed ? " ✓" : ""}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            value={newState}
            onChange={(e) => setNewState(e.target.value.toUpperCase())}
            placeholder="ST"
            maxLength={2}
            className="w-16 rounded-lg border border-white/20 bg-black/40 px-2 py-1.5 text-sm uppercase"
          />
          <button
            type="button"
            disabled={busy || newState.length !== 2}
            onClick={() => {
              void patchCompliance({
                action: "licensed_state",
                stateCode: newState,
                licensed: true,
                providerName: "Ryan Kent, FNP-BC",
              }).then(() => setNewState(""));
            }}
            className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-bold disabled:opacity-50"
          >
            Add licensed state
          </button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={report?.controlledSubstances.deaVerified ?? false}
              disabled={busy}
              onChange={(e) =>
                void patchCompliance({
                  action: "controlled_substances",
                  deaVerified: e.target.checked,
                })
              }
            />
            DEA registration verified
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={report?.controlledSubstances.pmpEnabled ?? false}
              disabled={busy}
              onChange={(e) =>
                void patchCompliance({
                  action: "controlled_substances",
                  pmpEnabled: e.target.checked,
                })
              }
            />
            PMP reporting enabled
          </label>
        </div>
      </section>

      <section id="uat" className="rounded-2xl border border-pink-500/30 bg-pink-500/10 p-5 scroll-mt-20">
        <h2 className="font-bold text-pink-100 mb-1">HGRX-103 — UAT sign-off</h2>
        <p className="text-xs text-white/55 mb-4">
          Owner, Provider, and Front Desk confirm end-to-end flow with sample data off in production.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["owner", "provider", "front_desk"] as const).map((role) => {
            const signed = report?.uatSignoffs.find((s) => s.role === role);
            return (
              <div key={role} className="rounded-xl border border-white/15 bg-black/30 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-pink-200">
                  {role.replace(/_/g, " ")}
                </p>
                {signed ? (
                  <p className="mt-2 text-xs text-green-300">
                    ✓ {signed.signedByEmail}
                    <br />
                    {new Date(signed.signedAt).toLocaleString()}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void uatSignoff(role)}
                    className="mt-2 rounded-lg border border-pink-400/50 px-3 py-1.5 text-xs font-bold hover:bg-pink-500/20 disabled:opacity-50"
                  >
                    Sign off UAT
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="infrastructure" className="rounded-2xl border border-white/10 bg-black/30 p-5 scroll-mt-20">
        <h2 className="font-bold mb-3">Infrastructure health</h2>
        <ul className="space-y-2">
          {(report?.infrastructure.checks ?? []).map((check) => (
            <li
              key={check.id}
              className={`flex items-start justify-between gap-3 rounded-xl border px-3 py-2.5 ${infraBadge(check.status)}`}
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
      </section>

      <section>
        <h2 className="font-bold mb-3">Manual UAT script</h2>
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
    </div>
  );
}
