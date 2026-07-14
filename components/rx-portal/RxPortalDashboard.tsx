"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import { getSession } from "@/lib/hgos/auth";
import {
  hgosRoleToPortalSkin,
  RX_PORTAL_PHARMACY_OPTIONS,
  type RxPortalRoleSkin,
} from "@/lib/rx-portal/nav";
import { rxPortalMyDaySteps, type RxPortalDashboardStats } from "@/lib/rx-portal/dashboard-queues";

type PortalOrder = {
  reference: string;
  createdAt: string;
  status: string;
  patientName?: string | null;
  patientEmail?: string | null;
  totalUsd: number;
  paidAt?: string | null;
  ageHours?: number | null;
  ageLabel?: string;
  detailHref: string;
  queue: {
    needsReview: boolean;
    intakeMissing: boolean;
    telehealthPending: boolean;
    readyToShip: boolean;
    awaitingTracking: boolean;
    shipped: boolean;
    primaryBucket: string;
  };
};

type QueueChip =
  | "all_action"
  | "needs_review"
  | "intake_missing"
  | "telehealth_pending"
  | "ready_to_ship"
  | "awaiting_tracking"
  | "today";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function slaTone(hours: number | null | undefined): string {
  if (hours == null) return "bg-slate-100 text-slate-600";
  if (hours >= 48) return "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200";
  if (hours >= 18) return "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200";
  return "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200";
}

function orderMatchesChip(o: PortalOrder, chip: QueueChip, todayStart: number): boolean {
  switch (chip) {
    case "needs_review":
      return o.queue.needsReview;
    case "intake_missing":
      return o.queue.intakeMissing;
    case "telehealth_pending":
      return o.queue.telehealthPending;
    case "ready_to_ship":
      return o.queue.readyToShip;
    case "awaiting_tracking":
      return o.queue.awaitingTracking;
    case "today":
      return Boolean(o.paidAt && new Date(o.paidAt).getTime() >= todayStart);
    case "all_action":
      return (
        o.queue.needsReview ||
        o.queue.intakeMissing ||
        o.queue.telehealthPending ||
        o.queue.readyToShip ||
        o.queue.awaitingTracking
      );
    default:
      return true;
  }
}

function QueueCard({
  title,
  count,
  href,
  accent,
  emptyHint,
  rows,
}: {
  title: string;
  count: number;
  href: string;
  accent: string;
  emptyHint: string;
  rows: PortalOrder[];
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3.5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <p className={`mt-1 text-3xl font-black ${accent}`}>{count}</p>
        </div>
        <Link href={href} className="text-xs font-bold text-teal-700 hover:underline">
          View all →
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500">{emptyHint}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {rows.map((o) => (
            <li key={o.reference}>
              <Link
                href={o.detailHref}
                className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#0B1F33]">
                    {o.patientName || "Patient"}
                  </p>
                  <p className="truncate font-mono text-[11px] text-slate-500">{o.reference}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-[#0B1F33]">{formatUsd(o.totalUsd)}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${slaTone(o.ageHours)}`}
                  >
                    {o.ageLabel || "—"}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function RxPortalDashboard() {
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [stats, setStats] = useState<RxPortalDashboardStats | null>(null);
  const [q, setQ] = useState("");
  const [chip, setChip] = useState<QueueChip>("all_action");
  const [loading, setLoading] = useState(true);
  const [opsOpen, setOpsOpen] = useState(false);
  const [skin, setSkin] = useState<RxPortalRoleSkin>("staff");

  useEffect(() => {
    void getSession().then((s) => setSkin(hgosRoleToPortalSkin(s?.user.role)));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rx-portal/orders?limit=100");
      const data = await res.json();
      if (res.ok) {
        setOrders((data.orders ?? []) as PortalOrder[]);
        setStats((data.stats as RxPortalDashboardStats) ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const todayStart = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const myDay = useMemo(() => rxPortalMyDaySteps(skin), [skin]);

  const chips = useMemo(() => {
    const base: Array<{ id: QueueChip; label: string; count: number }> = [
      {
        id: "all_action",
        label: "Action needed",
        count:
          (stats?.needsReview ?? 0) +
          (stats?.intakeMissing ?? 0) +
          (stats?.telehealthPending ?? 0) +
          (stats?.readyToShip ?? 0) +
          (stats?.awaitingTracking ?? 0),
      },
      { id: "today", label: "Paid today", count: stats?.paidToday ?? 0 },
    ];
    if (skin === "provider" || skin === "admin") {
      base.push(
        { id: "needs_review", label: "Needs NP review", count: stats?.needsReview ?? 0 },
        {
          id: "telehealth_pending",
          label: "Telehealth pending",
          count: stats?.telehealthPending ?? 0,
        },
      );
    }
    if (skin === "staff" || skin === "admin") {
      base.push(
        { id: "intake_missing", label: "Intake missing", count: stats?.intakeMissing ?? 0 },
        { id: "ready_to_ship", label: "Ready to ship", count: stats?.readyToShip ?? 0 },
        {
          id: "awaiting_tracking",
          label: "Need tracking",
          count: stats?.awaitingTracking ?? 0,
        },
      );
    }
    // Provider also sees ready-to-ship for spot check
    if (skin === "provider") {
      base.push({ id: "ready_to_ship", label: "Ready to ship", count: stats?.readyToShip ?? 0 });
    }
    return base;
  }, [skin, stats]);

  const queuedPreview = useMemo(() => {
    const sortAge = (a: PortalOrder, b: PortalOrder) => (b.ageHours ?? 0) - (a.ageHours ?? 0);
    return {
      needsReview: orders.filter((o) => o.queue.needsReview).sort(sortAge).slice(0, 5),
      readyToShip: orders.filter((o) => o.queue.readyToShip).sort(sortAge).slice(0, 5),
      awaitingTracking: orders
        .filter((o) => o.queue.awaitingTracking)
        .sort(sortAge)
        .slice(0, 5),
      intakeMissing: orders.filter((o) => o.queue.intakeMissing).sort(sortAge).slice(0, 5),
      telehealthPending: orders
        .filter((o) => o.queue.telehealthPending)
        .sort(sortAge)
        .slice(0, 5),
      shipped: orders.filter((o) => o.queue.shipped).slice(0, 5),
    };
  }, [orders]);

  const chipRows = useMemo(() => {
    return orders
      .filter((o) => orderMatchesChip(o, chip, todayStart))
      .sort((a, b) => (b.ageHours ?? 0) - (a.ageHours ?? 0))
      .slice(0, 8);
  }, [orders, chip, todayStart]);

  const queueClear =
    !loading &&
    (stats?.needsReview ?? 0) === 0 &&
    (stats?.intakeMissing ?? 0) === 0 &&
    (stats?.telehealthPending ?? 0) === 0 &&
    (stats?.readyToShip ?? 0) === 0 &&
    (stats?.awaitingTracking ?? 0) === 0;

  return (
    <RxPortalShell
      title="RE GEN Dashboard"
      actions={
        <Link
          href="/rx-portal/place-order"
          className="inline-flex items-center rounded-lg bg-[#2dd4bf] px-4 py-2 text-sm font-bold text-[#0B1F33] hover:bg-teal-300"
        >
          + New Order
        </Link>
      }
    >
      {/* My day script */}
      <div className="mb-5 rounded-2xl border border-teal-200 bg-gradient-to-r from-teal-50 to-white px-5 py-4">
        <p className="text-[11px] font-black uppercase tracking-wider text-teal-800">
          {skin === "provider" ? "Ryan / NP · My day" : skin === "admin" ? "Owner · My day" : "Desk · My day"}
        </p>
        <ol className="mt-2 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
          {myDay.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[11px] font-black text-[#0B1F33]">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Today strip */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Paid today", value: loading ? "—" : String(stats?.paidToday ?? 0) },
          {
            label: "Revenue today",
            value: loading ? "—" : formatUsd(stats?.revenueTodayUsd ?? 0),
          },
          {
            label: "Awaiting your approve",
            value: loading ? "—" : String(stats?.needsReview ?? 0),
          },
          {
            label: "Shipped this week",
            value: loading ? "—" : String(stats?.shippedThisWeek ?? 0),
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {s.label}
            </p>
            <p className="mt-1 text-2xl font-black text-[#0B1F33]">{s.value}</p>
          </div>
        ))}
      </div>

      {stats?.thursdayCutoffRisk ? (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Thursday cutoff:</strong> orders not submitted this afternoon often slip to Monday
          shipping. Prioritize Ready to Ship now.
        </div>
      ) : null}

      {/* Search + chips */}
      <div className="mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const needle = q.trim();
            if (needle) {
              window.location.href = `/rx-portal/orders?q=${encodeURIComponent(needle)}`;
            }
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search patient, order #, tracking #"
            className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0B1F33] px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Search orders
          </button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChip(c.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                chip === c.id
                  ? "bg-[#0B1F33] text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-teal-400"
              }`}
            >
              {c.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  chip === c.id ? "bg-white/20" : "bg-slate-100 text-slate-700"
                }`}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chip-filtered action list */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-black text-[#0B1F33]">
            {chips.find((c) => c.id === chip)?.label ?? "Queue"}
          </h3>
          <Link href="/rx-portal/orders" className="text-xs font-bold text-teal-700 hover:underline">
            Open Order History →
          </Link>
        </div>
        {loading ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">Loading queue…</p>
        ) : queueClear && chip === "all_action" ? (
          <div className="px-4 py-10 text-center">
            <p className="text-base font-bold text-[#0B1F33]">Queue clear</p>
            <p className="mt-1 text-sm text-slate-500">
              Last paid order:{" "}
              {stats?.lastPaidReference ? (
                <>
                  <span className="font-mono font-semibold text-slate-700">
                    {stats.lastPaidReference}
                  </span>
                  {stats.lastPaidPatient ? ` · ${stats.lastPaidPatient}` : ""}{" "}
                  · {formatWhen(stats.lastPaidAt)}
                </>
              ) : (
                "none yet — Square checkouts will appear here when paid."
              )}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link
                href="/rx-portal/place-order"
                className="rounded-lg bg-[#2dd4bf] px-4 py-2 text-sm font-bold text-[#0B1F33]"
              >
                + Place order
              </Link>
              <Link
                href="/rx-portal/orders"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
              >
                Order History
              </Link>
            </div>
          </div>
        ) : chipRows.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">Nothing in this filter.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {chipRows.map((o) => (
              <li key={o.reference}>
                <Link
                  href={o.detailHref}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0B1F33]">{o.patientName || "Patient"}</p>
                    <p className="font-mono text-[11px] text-slate-500">
                      {o.reference} · {o.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${slaTone(o.ageHours)}`}>
                      {o.ageLabel}
                    </span>
                    <span className="font-bold text-[#0B1F33]">{formatUsd(o.totalUsd)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Three primary queue columns */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        {skin === "provider" ? (
          <>
            <QueueCard
              title="Needs NP review"
              count={stats?.needsReview ?? 0}
              href="/rx-portal/orders"
              accent="text-teal-600"
              emptyHint="No orders waiting on NP approval."
              rows={queuedPreview.needsReview}
            />
            <QueueCard
              title="Telehealth pending"
              count={stats?.telehealthPending ?? 0}
              href="/rx-portal/orders"
              accent="text-sky-600"
              emptyHint="No pending telehealth visits."
              rows={queuedPreview.telehealthPending}
            />
            <QueueCard
              title="Ready to ship"
              count={stats?.readyToShip ?? 0}
              href="/rx-portal/orders"
              accent="text-violet-600"
              emptyHint="Nothing ready for pharmacy submit."
              rows={queuedPreview.readyToShip}
            />
          </>
        ) : skin === "admin" ? (
          <>
            <QueueCard
              title="Needs NP review"
              count={stats?.needsReview ?? 0}
              href="/rx-portal/orders"
              accent="text-teal-600"
              emptyHint="No orders waiting on NP approval."
              rows={queuedPreview.needsReview}
            />
            <QueueCard
              title="Ready to ship"
              count={stats?.readyToShip ?? 0}
              href="/rx-portal/orders"
              accent="text-violet-600"
              emptyHint="Nothing ready for pharmacy submit."
              rows={queuedPreview.readyToShip}
            />
            <QueueCard
              title="Need tracking"
              count={stats?.awaitingTracking ?? 0}
              href="/rx-portal/orders"
              accent="text-sky-600"
              emptyHint="Tracking caught up."
              rows={queuedPreview.awaitingTracking}
            />
          </>
        ) : (
          <>
            <QueueCard
              title="Intake missing"
              count={stats?.intakeMissing ?? 0}
              href="/rx-portal/orders"
              accent="text-amber-600"
              emptyHint="All paid orders have intake."
              rows={queuedPreview.intakeMissing}
            />
            <QueueCard
              title="Ready to ship"
              count={stats?.readyToShip ?? 0}
              href="/rx-portal/orders"
              accent="text-teal-600"
              emptyHint="Nothing ready for pharmacy submit."
              rows={queuedPreview.readyToShip}
            />
            <QueueCard
              title="Need tracking"
              count={stats?.awaitingTracking ?? 0}
              href="/rx-portal/orders"
              accent="text-sky-600"
              emptyHint="Tracking caught up."
              rows={queuedPreview.awaitingTracking}
            />
          </>
        )}
      </div>

      {/* Pharmacy deep links */}
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        {RX_PORTAL_PHARMACY_OPTIONS.map((o) => (
          <a
            key={o.id}
            href={o.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-teal-400"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Pharmacy portal
              </p>
              <p className="mt-1 text-base font-black text-[#0B1F33]">{o.label}</p>
            </div>
            <span className="text-sm font-bold text-teal-700">Open →</span>
          </a>
        ))}
      </div>

      {/* Collapsed ops notes */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setOpsOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
          aria-expanded={opsOpen}
        >
          <div>
            <p className="text-sm font-black text-[#0B1F33]">Ops notes</p>
            <p className="text-xs text-slate-500">
              Illinois rules · shipping schedule · cancel windows
            </p>
          </div>
          <span className="text-lg font-bold text-slate-400">{opsOpen ? "−" : "+"}</span>
        </button>
        {opsOpen ? (
          <div className="grid gap-4 border-t border-slate-100 px-5 py-4 lg:grid-cols-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-800">
                Illinois practice
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-amber-950/80">
                Hello Gorgeous RX fulfills eligible <strong>Illinois</strong> prescriptions after NP
                approval. Out-of-state requests need clinical/ops review before promising shipment.
              </p>
            </div>
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-800">
                Shipping schedule
              </h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-sky-950/85">
                <li>
                  <strong>Shipping days:</strong> typically Monday–Thursday via compounding pharmacy.
                </li>
                <li>
                  <strong>Deadlines:</strong> orders not submitted by Thursday afternoon often ship
                  the following Monday.
                </li>
                <li>
                  <strong>Cancellation:</strong> generally cannot cancel after 24 hours once
                  submitted to pharmacy.
                </li>
                <li>
                  <strong>Processing:</strong> sterile compounding often 3–4 business days;
                  non-sterile faster — confirm in FormuConnect / BoomRx.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </RxPortalShell>
  );
}
