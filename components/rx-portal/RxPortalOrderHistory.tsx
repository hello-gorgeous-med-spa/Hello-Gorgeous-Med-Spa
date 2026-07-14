"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { RxPortalPipelineStepper } from "@/components/rx-portal/RxPortalPipelineStepper";
import { RxPortalShell } from "@/components/rx-portal/RxPortalShell";
import type { RxPortalShipDestination, RxPortalShipSpeed } from "@/lib/rx-portal/pipeline";

type LineItem = { name: string; qty: number; price?: string };

type PortalOrder = {
  reference: string;
  createdAt: string;
  status: string;
  patientName?: string | null;
  patientEmail?: string | null;
  dob?: string | null;
  totalUsd: number;
  paidAt?: string | null;
  npApprovedAt?: string | null;
  pharmacyOrderedAt?: string | null;
  pharmacySource?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shipSpeed: RxPortalShipSpeed;
  shipDestination: RxPortalShipDestination;
  shipLabel: string;
  statusAt?: string | null;
  items: LineItem[];
  itemCount: number;
  detailHref: string;
  patientStatusHref?: string;
  reorderHref: string;
};

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatDob(dob: string) {
  // Prefer YYYY-MM-DD → Jul 14, 1985
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dob);
  if (m) {
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return formatDate(dob);
}

function DocIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 5V3.5L15.5 8H12a1 1 0 01-1-1z" />
    </svg>
  );
}

function ShipSpeedPill({ speed }: { speed: RxPortalShipSpeed }) {
  const styles =
    speed === "NEXTDAY"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : speed === "GROUND"
        ? "bg-slate-100 text-slate-700 ring-slate-200"
        : "bg-teal-50 text-teal-800 ring-teal-200";
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ring-inset ${styles}`}
    >
      {speed}
    </span>
  );
}

function ShipDestination({ dest }: { dest: RxPortalShipDestination }) {
  return (
    <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-600">
      {dest === "OFFICE" ? (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.447.894L10 15.118l-4.553 1.776A1 1 0 014 16V4zm3 2a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
      )}
      {dest}
    </span>
  );
}

function NewOrderButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/rx-portal/place-order"
      className={`inline-flex items-center gap-1.5 rounded-lg bg-[#2dd4bf] px-4 py-2 text-sm font-bold text-[#0B1F33] shadow-sm hover:bg-teal-300 ${className}`}
    >
      <span className="text-base leading-none">+</span> New Order
    </Link>
  );
}

export function RxPortalOrderHistory() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<PortalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rx-portal/orders?limit=100");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load orders");
      setOrders((data.orders ?? []) as PortalOrder[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return orders;
    return orders.filter((o) => {
      const hay = [
        o.reference,
        o.patientName,
        o.patientEmail,
        o.trackingNumber,
        o.status,
        ...(o.items ?? []).map((i) => i.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [orders, q]);

  const toggle = (ref: string) =>
    setExpanded((prev) => ({ ...prev, [ref]: !prev[ref] }));

  return (
    <RxPortalShell title="Order History" actions={<NewOrderButton />}>
      <div className="mb-4">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by patient, order #, tracking #…"
          className="w-full max-w-xl rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading orders…</p>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-black text-[#0B1F33]">Order History</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                {filtered.length} RE GEN order{filtered.length === 1 ? "" : "s"}
                {q.trim() ? " matching search" : ""}
              </p>
            </div>
            <NewOrderButton />
          </div>

          {filtered.length === 0 ? (
            <div className="px-6 py-14 text-center text-slate-500">No orders match.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th className="w-8 px-3 py-3" aria-hidden />
                    <th className="px-3 py-3">Order #</th>
                    <th className="px-3 py-3">Date</th>
                    <th className="px-3 py-3">Patient</th>
                    <th className="px-3 py-3">Ship</th>
                    <th className="px-3 py-3">Total</th>
                    <th className="px-3 py-3">Rx Status</th>
                    <th className="px-3 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const open = Boolean(expanded[o.reference]);
                    const delivered = Boolean(o.deliveredAt);
                    const inTransit = Boolean(o.trackingNumber) && !delivered;
                    return (
                      <Fragment key={o.reference}>
                        <tr className="border-b border-slate-100 align-top hover:bg-slate-50/50">
                          <td className="px-2 py-4">
                            <button
                              type="button"
                              onClick={() => toggle(o.reference)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              aria-expanded={open}
                              aria-label={open ? "Collapse order" : "Expand order"}
                            >
                              <svg
                                className={`h-3.5 w-3.5 transition ${open ? "rotate-90" : ""}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </td>
                          <td className="px-3 py-4">
                            <p className="font-mono text-[12px] font-bold text-[#0B1F33]">
                              {o.reference}
                            </p>
                            {o.itemCount > 1 ? (
                              <span className="mt-1 inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-violet-700 ring-1 ring-inset ring-violet-200">
                                {o.itemCount} items
                              </span>
                            ) : null}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                            {formatDate(o.createdAt)}
                          </td>
                          <td className="px-3 py-4">
                            <p className="font-semibold text-[#0B1F33]">
                              {o.patientName || "—"}
                            </p>
                            {o.dob ? (
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                DOB: {formatDob(o.dob)}
                              </p>
                            ) : o.patientEmail ? (
                              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                {o.patientEmail}
                              </p>
                            ) : null}
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex flex-col items-start gap-0.5">
                              <ShipSpeedPill speed={o.shipSpeed ?? "TWODAY"} />
                              <ShipDestination dest={o.shipDestination ?? "PATIENT"} />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 font-bold text-[#0B1F33]">
                            {formatUsd(o.totalUsd)}
                          </td>
                          <td className="px-3 py-4">
                            <RxPortalPipelineStepper
                              signals={{
                                status: o.status,
                                paidAt: o.paidAt,
                                npApprovedAt: o.npApprovedAt,
                                pharmacyOrderedAt: o.pharmacyOrderedAt,
                                shippedAt: o.shippedAt,
                                deliveredAt: o.deliveredAt,
                                trackingNumber: o.trackingNumber,
                              }}
                              pharmacySource={o.pharmacySource}
                              statusAt={o.statusAt}
                            />
                          </td>
                          <td className="px-3 py-4">
                            <div className="flex w-[168px] flex-col gap-1.5">
                              <div className="flex gap-1.5">
                                <Link
                                  href={o.detailHref}
                                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-[#2dd4bf] px-2 py-1.5 text-[11px] font-bold text-[#0B1F33] hover:bg-teal-300"
                                >
                                  <DocIcon className="h-3.5 w-3.5" />
                                  Invoice
                                </Link>
                                <Link
                                  href={o.patientStatusHref || o.detailHref}
                                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-[#0B1F33] px-2 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800"
                                >
                                  <DocIcon className="h-3.5 w-3.5" />
                                  Rx
                                </Link>
                              </div>
                              <Link
                                href={o.reorderHref || "/rx-portal/place-order"}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-sky-600 px-2 py-1.5 text-[11px] font-bold text-white hover:bg-sky-500"
                              >
                                <svg
                                  className="h-3.5 w-3.5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Reorder
                              </Link>
                              {o.trackingNumber ? (
                                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                                  <a
                                    href={o.trackingUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate text-[10px] font-semibold text-sky-600 underline-offset-2 hover:underline"
                                  >
                                    {o.trackingNumber}
                                  </a>
                                  <span
                                    className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                                      delivered
                                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                        : "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200"
                                    }`}
                                  >
                                    {delivered ? "Delivered" : inTransit ? "In Transit" : "Shipped"}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400">No tracking yet</p>
                              )}
                            </div>
                          </td>
                        </tr>
                        {open ? (
                          <tr className="border-b border-slate-100 bg-slate-50/70">
                            <td colSpan={8} className="px-8 py-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Line items
                                  </p>
                                  {(o.items?.length ?? 0) === 0 ? (
                                    <p className="mt-2 text-sm text-slate-500">No item detail stored.</p>
                                  ) : (
                                    <ul className="mt-2 space-y-1.5">
                                      {o.items.map((item, idx) => (
                                        <li
                                          key={`${item.name}-${idx}`}
                                          className="flex justify-between gap-3 text-sm text-slate-700"
                                        >
                                          <span>
                                            <span className="font-semibold text-[#0B1F33]">
                                              {item.name}
                                            </span>
                                            {item.qty > 1 ? (
                                              <span className="text-slate-500"> × {item.qty}</span>
                                            ) : null}
                                          </span>
                                          {item.price ? (
                                            <span className="font-medium text-slate-600">
                                              {item.price}
                                            </span>
                                          ) : null}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <div className="text-sm text-slate-600">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    Fulfillment
                                  </p>
                                  <dl className="mt-2 space-y-1">
                                    <div className="flex justify-between gap-2">
                                      <dt>Status</dt>
                                      <dd className="font-semibold text-[#0B1F33]">{o.status}</dd>
                                    </div>
                                    {o.pharmacySource ? (
                                      <div className="flex justify-between gap-2">
                                        <dt>Pharmacy</dt>
                                        <dd className="font-semibold text-[#0B1F33]">
                                          {o.pharmacySource}
                                        </dd>
                                      </div>
                                    ) : null}
                                    {o.patientEmail ? (
                                      <div className="flex justify-between gap-2">
                                        <dt>Email</dt>
                                        <dd className="truncate font-medium">{o.patientEmail}</dd>
                                      </div>
                                    ) : null}
                                  </dl>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    <Link
                                      href={o.detailHref}
                                      className="text-xs font-bold text-teal-700 hover:underline"
                                    >
                                      Open full order →
                                    </Link>
                                    {o.patientStatusHref ? (
                                      <Link
                                        href={o.patientStatusHref}
                                        className="text-xs font-bold text-sky-700 hover:underline"
                                      >
                                        Patient status page →
                                      </Link>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </RxPortalShell>
  );
}
