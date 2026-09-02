"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import type { PartnerDashboard, PartnerLocation, PartnerPayout } from "@/lib/partner-network";
import { PARTNER_FEES, partnerDoorPath } from "@/lib/partner-network";

function usd(n: number): string {
  return `$${n.toFixed(0)}`;
}

function kindLabel(kind: string): string {
  switch (kind) {
    case "spa_first_order":
      return "Spa $100";
    case "md_override":
      return "MD $25";
    case "kickoff":
      return "Kickoff $250";
    case "md_retainer":
      return "MD retainer";
    case "network_retainer":
      return "Network retainer";
    default:
      return kind;
  }
}

const STATUS_CLS: Record<string, string> = {
  draft: "bg-black/10 text-black/70",
  live: "bg-emerald-100 text-emerald-800",
  paused: "bg-amber-100 text-amber-800",
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  void: "bg-black/10 text-black/40",
};

export default function PartnerNetworkAdminPage() {
  const [dashboard, setDashboard] = useState<PartnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [directedByMd, setDirectedByMd] = useState(true);
  const [editing, setEditing] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx/partner-network");
      const data = await res.json();
      if (res.ok) setDashboard(data.dashboard);
      else setMessage(data.error || "Could not load network");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function createLocation(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rx/partner-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, city: city || null, directedByMd }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Create failed");
      setName("");
      setCity("");
      setMessage(`Added ${data.location.name} — QR ${partnerDoorPath(data.location.slug)}`);
      void load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function patchLocation(id: string, patch: Record<string, unknown>) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rx/partner-network", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      void load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveName(loc: PartnerLocation) {
    const next = (editing[loc.id] ?? loc.name).trim();
    if (!next || next === loc.name) return;
    await patchLocation(loc.id, { name: next });
  }

  async function kickoff(id: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rx/partner-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "kickoff", locationId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kickoff failed");
      setMessage("Kickoff $250 recorded for Dr. Arora");
      void load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kickoff failed");
    } finally {
      setBusy(false);
    }
  }

  async function retainers() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/rx/partner-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retainers" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Retainer failed");
      const n = Array.isArray(data.created) ? data.created.length : 0;
      setMessage(n ? `Recorded ${n} retainer line(s) for this month` : "This month already has retainers");
      void load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Retainer failed");
    } finally {
      setBusy(false);
    }
  }

  async function patchPayout(payout: PartnerPayout, status: "paid" | "void" | "pending") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/partner-network/payouts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: payout.id, status }),
      });
      if (res.ok) void load();
    } finally {
      setBusy(false);
    }
  }

  function copyDoor(slug: string) {
    const url = `${window.location.origin}${partnerDoorPath(slug)}`;
    void navigator.clipboard.writeText(url).then(
      () => setMessage(`Copied ${url}`),
      () => setMessage(url),
    );
  }

  if (loading && !dashboard) {
    return <p className="p-8 text-black/60">Loading partner network…</p>;
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-black">Partner network</h1>
        <p className="mt-2 text-black/70">{message || "Run the partner_referral_network migration, then refresh."}</p>
      </div>
    );
  }

  const { network, locations, payouts, attributions } = dashboard;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#E6007E]">
            Hello Gorgeous RX™ · RE GEN
          </p>
          <h1 className="text-3xl font-black text-black">{network.name}</h1>
          <p className="mt-1 max-w-2xl text-sm text-black/60">
            Referral doors only. {network.mdName} is Medical Director at {usd(network.mdFeeUsd)}
            /mo. Ryan reviews every chart. Spas get {usd(network.spaFirstOrderUsd)} on first paid
            med. His spas also trigger a {usd(network.overrideUsd)} override. Network retainer{" "}
            {usd(network.networkFeeUsd)}/mo once a door he directs is live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/admin/rx/partner-network/print" className="font-bold text-[#E6007E] underline">
            Print QR cards
          </Link>
          <Link href="/admin/rx" className="font-bold text-[#E6007E] underline">
            RX command
          </Link>
        </div>
      </div>

      {message ? (
        <p className="rounded-xl border-2 border-black bg-rose-50 px-4 py-2 text-sm font-medium">{message}</p>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Live doors", value: String(dashboard.liveDoorCount) },
          { label: "Pending to spas", value: usd(dashboard.pendingSpaUsd) },
          { label: "Pending to MD", value: usd(dashboard.pendingMdUsd) },
          {
            label: "Network retainer",
            value: dashboard.networkRetainerDue ? `${usd(network.networkFeeUsd)} due` : "Not yet (no live door)",
          },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.25)]"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">{c.label}</p>
            <p className="mt-1 text-xl font-black">{c.value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => void retainers()}
          className="rounded-xl border-2 border-black bg-black px-4 py-2 text-sm font-black text-white disabled:opacity-40"
        >
          Record this month&apos;s retainers
        </button>
        <p className="self-center text-xs text-black/50">
          {usd(PARTNER_FEES.mdRetainerUsd)} MD
          {dashboard.networkRetainerDue ? ` + ${usd(PARTNER_FEES.networkRetainerUsd)} network` : ""}. Idempotent.
        </p>
      </div>

      <section className="rounded-3xl border-4 border-black bg-white p-5 shadow-[8px_8px_0_0_rgba(230,0,126,0.2)]">
        <h2 className="text-lg font-black">Add a door</h2>
        <form onSubmit={createLocation} className="mt-3 grid gap-3 sm:grid-cols-4">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Spa name"
            className="rounded-xl border-2 border-black/20 px-3 py-2 font-medium sm:col-span-2"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="rounded-xl border-2 border-black/20 px-3 py-2 font-medium"
          />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={directedByMd}
              onChange={(e) => setDirectedByMd(e.target.checked)}
            />
            He directs this spa
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl border-2 border-black bg-[#E6007E] px-4 py-2 font-black text-white disabled:opacity-40 sm:col-span-4"
          >
            Create QR door
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black">Doors</h2>
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="rounded-2xl border-4 border-black bg-white p-4 shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-[16rem] flex-1">
                <input
                  value={editing[loc.id] ?? loc.name}
                  onChange={(e) => setEditing((s) => ({ ...s, [loc.id]: e.target.value }))}
                  onBlur={() => void saveName(loc)}
                  className="w-full text-lg font-black"
                />
                <p className="text-sm text-black/55">
                  {loc.city || "City TBD"} · <code className="font-mono">/go/{loc.slug}</code>
                  {loc.directedByMd ? " · his spa ($25 override)" : " · day spa (no MD override)"}
                  {loc.kickoffAt ? " · kickoff done" : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${STATUS_CLS[loc.status] || ""}`}
              >
                {loc.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                onClick={() => copyDoor(loc.slug)}
                className="rounded-lg border-2 border-black px-3 py-1 font-bold"
              >
                Copy URL
              </button>
              {loc.status !== "live" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void patchLocation(loc.id, { status: "live" })}
                  className="rounded-lg border-2 border-black bg-emerald-600 px-3 py-1 font-bold text-white"
                >
                  Mark live
                </button>
              ) : (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void patchLocation(loc.id, { status: "paused" })}
                  className="rounded-lg border-2 border-black px-3 py-1 font-bold"
                >
                  Pause
                </button>
              )}
              {!loc.kickoffAt ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void kickoff(loc.id)}
                  className="rounded-lg border-2 border-black px-3 py-1 font-bold"
                >
                  Record kickoff $250
                </button>
              ) : null}
              <p className="self-center text-xs text-black/45">{loc.scanCount} scans</p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-black">Payout ledger</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border-4 border-black bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-black text-xs uppercase tracking-wider text-[#E6007E]">
                <th className="px-3 py-2">When</th>
                <th className="px-3 py-2">Kind</th>
                <th className="px-3 py-2">Payee</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-black/50">
                    No payouts yet. They appear when a referred patient pays for medication, or when
                    you record kickoff / retainers.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="border-t border-black/10">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">{kindLabel(p.kind)}</td>
                    <td className="px-3 py-2">
                      {p.payeeName}
                      {p.locationName ? ` · ${p.locationName}` : ""}
                    </td>
                    <td className="px-3 py-2 font-bold">{usd(p.amountUsd)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_CLS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {p.status === "pending" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patchPayout(p, "paid")}
                          className="font-bold text-[#E6007E] underline"
                        >
                          Mark paid
                        </button>
                      ) : p.status === "paid" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void patchPayout(p, "void")}
                          className="text-black/40 underline"
                        >
                          Void
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-black">Attributed patients</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {attributions.length === 0 ? (
            <li className="text-black/50">No paid attributed patients yet.</li>
          ) : (
            attributions.map((a) => (
              <li key={a.id} className="rounded-xl border-2 border-black/10 bg-white px-3 py-2">
                <strong>{a.customerName || a.customerEmail || "Patient"}</strong>
                {a.locationName ? ` · ${a.locationName}` : ""}
                {a.orderReference ? ` · ${a.orderReference}` : ""}
                {a.firstPaidMedAt ? " · first med paid" : " · scan only"}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
