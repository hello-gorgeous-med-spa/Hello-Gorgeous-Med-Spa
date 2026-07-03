"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type OrderItem = {
  name?: string;
  quantity?: number;
  priceUsd?: number;
};

type OrderDetail = {
  reference: string;
  status: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  goal: string | null;
  items: OrderItem[];
  subtotal_usd: number | string | null;
  shipping_usd?: number | string | null;
  paid_at: string | null;
  intake_completed_at: string | null;
  intake_data?: Record<string, unknown> | null;
  telehealth_required?: boolean | null;
  telehealth_completed_at: string | null;
  np_approved_at: string | null;
  np_notes: string | null;
  pharmacy_ordered_at: string | null;
  pharmacy_source: string | null;
  tracking_number: string | null;
  shipped_at: string | null;
};

type Summary = {
  needsReview: boolean;
  readyToShip: boolean;
  telehealthRequired: boolean;
  totalUsd: number;
  title: string;
};

export default function RegenOrderFulfillmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ref = decodeURIComponent(String(params.ref || ""));

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [npNotes, setNpNotes] = useState("");
  const [pharmacySource, setPharmacySource] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("USPS");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/rx/regen-orders/${encodeURIComponent(ref)}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setSummary(data.summary);
        setNpNotes(data.order?.np_notes || "");
        setPharmacySource(data.order?.pharmacy_source || "");
        setTrackingNumber(data.order?.tracking_number || "");
      }
    } finally {
      setLoading(false);
    }
  }, [ref]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, string>) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/rx/regen-orders/${encodeURIComponent(ref)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          npNotes: npNotes || undefined,
          pharmacySource: pharmacySource || undefined,
          trackingNumber: trackingNumber || undefined,
          carrier: carrier || undefined,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setMessage(
        data.notified
          ? "Saved — patient notified by SMS."
          : "Saved.",
      );
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <p className="text-gray-500">Loading order…</p>
      </div>
    );
  }

  if (!order || !summary) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <p className="text-red-300">Order not found.</p>
        <Link href="/admin/rx/regen-orders" className="text-[#FFB8DC] text-sm mt-4 inline-block">
          ← Back to queue
        </Link>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const teleRequired = order.telehealth_required !== false;
  const canApprove =
    Boolean(order.intake_completed_at) &&
    (!teleRequired || Boolean(order.telehealth_completed_at)) &&
    !order.np_approved_at;
  const canShip =
    Boolean(order.np_approved_at) &&
    !order.shipped_at &&
    (order.status === "approved" || order.status === "ordered" || Boolean(order.pharmacy_ordered_at));

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/rx/regen-orders"
          className="text-xs text-[#FFB8DC] hover:text-white mb-4 inline-block"
        >
          ← Fulfillment queue
        </Link>

        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFB8DC]">RE GEN order</p>
          <h1 className="text-2xl font-black font-mono">{order.reference}</h1>
          <p className="text-gray-400 mt-1">{summary.title}</p>
          <p className="text-sm text-gray-500 mt-1">
            {order.customer_name} · {order.customer_phone || "no phone"} · {order.customer_email || "no email"}
          </p>
        </div>

        {message && (
          <p className="mb-4 rounded-lg border border-[#E6007E]/40 bg-[#E6007E]/10 px-4 py-2 text-sm text-[#FFB8DC]">
            {message}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {[
            { label: "Payment", done: Boolean(order.paid_at) },
            { label: "Intake", done: Boolean(order.intake_completed_at) },
            ...(teleRequired ? [{ label: "Telehealth", done: Boolean(order.telehealth_completed_at) }] : []),
            { label: "NP approved", done: Boolean(order.np_approved_at) },
            { label: "Pharmacy ordered", done: Boolean(order.pharmacy_ordered_at) },
            { label: "Shipped", done: Boolean(order.shipped_at) },
          ].map((step) => (
            <div
              key={step.label}
              className={`rounded-lg border px-4 py-3 text-sm ${
                step.done ? "border-green-500/40 bg-green-500/10" : "border-white/10 bg-white/5"
              }`}
            >
              <span className={step.done ? "text-green-300" : "text-gray-400"}>
                {step.done ? "✓" : "○"} {step.label}
              </span>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFB8DC] mb-3">Line items</h2>
          <ul className="space-y-2 text-sm">
            {items.map((item, i) => (
              <li key={i} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                <span>
                  {item.name} {item.quantity ? `×${item.quantity}` : ""}
                </span>
                {item.priceUsd != null ? <span className="text-gray-400">${item.priceUsd}</span> : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-right font-bold">Total ${summary.totalUsd.toFixed(2)}</p>
        </section>

        {order.intake_data && Object.keys(order.intake_data).length > 0 ? (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFB8DC] mb-3">Intake flags</h2>
            <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(
                {
                  qualified: order.intake_data.qualified,
                  provider_flags: order.intake_data.provider_flags,
                  bmi: order.intake_data.bmi,
                },
                null,
                2,
              )}
            </pre>
            <Link
              href={`/rx/checkout/intake?ref=${encodeURIComponent(ref)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#FFB8DC] mt-3 inline-block hover:underline"
            >
              View intake form →
            </Link>
          </section>
        ) : null}

        <section className="rounded-xl border border-white/10 p-5 mb-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#FFB8DC]">Staff actions</h2>

          {teleRequired && !order.telehealth_completed_at && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("telehealth_complete")}
              className="w-full rounded-lg border border-white/20 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              Mark telehealth complete
            </button>
          )}

          <div>
            <label className="block text-xs text-gray-400 mb-1">NP notes (optional)</label>
            <textarea
              value={npNotes}
              onChange={(e) => setNpNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
              placeholder="Clinical notes for internal record"
            />
          </div>

          {canApprove && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("approve")}
              className="w-full rounded-lg bg-[#E6007E] py-3 text-sm font-bold hover:bg-[#FF2D8E] disabled:opacity-50"
            >
              NP approve — notify patient by SMS
            </button>
          )}

          {order.np_approved_at && !order.pharmacy_ordered_at && (
            <>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Pharmacy / vendor</label>
                <input
                  value={pharmacySource}
                  onChange={(e) => setPharmacySource(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
                  placeholder="e.g. BoomRx, Olympia, Formulation"
                />
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void runAction("pharmacy_ordered")}
                className="w-full rounded-lg border border-[#FFB8DC] py-3 text-sm font-semibold text-[#FFB8DC] hover:bg-white/10 disabled:opacity-50"
              >
                Mark pharmacy ordered
              </button>
            </>
          )}

          {canShip && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Tracking number</label>
                  <input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm font-mono"
                    placeholder="9400…"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Carrier</label>
                  <input
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-sm"
                    placeholder="USPS"
                  />
                </div>
              </div>
              <button
                type="button"
                disabled={busy || !trackingNumber.trim()}
                onClick={() => void runAction("ship")}
                className="w-full rounded-lg bg-green-600 py-3 text-sm font-bold hover:bg-green-500 disabled:opacity-50"
              >
                Mark shipped — SMS tracking to patient
              </button>
            </>
          )}

          {order.shipped_at && order.status !== "delivered" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void runAction("delivered")}
              className="w-full rounded-lg border border-white/20 py-3 text-sm font-semibold hover:bg-white/10 disabled:opacity-50"
            >
              Mark delivered
            </button>
          )}
        </section>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href={`/rx/checkout/complete?ref=${encodeURIComponent(ref)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            Patient status page →
          </Link>
          <button
            type="button"
            onClick={() => router.push("/admin/rx")}
            className="text-gray-400 hover:text-white"
          >
            Command Center
          </button>
        </div>
      </div>
    </div>
  );
}
