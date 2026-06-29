"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PortalRxCareTeam } from "@/components/portal/PortalRxCareTeam";
import { PortalRxWeightProgress } from "@/components/portal/PortalRxWeightProgress";
import { useRxPushNotifications } from "@/lib/hooks/use-rx-push-notifications";
import { usePortalAuth } from "@/lib/portal/useAuth";
import { RX_CARE_TEXT_DISPLAY, RX_CARE_TEXT_SMS } from "@/lib/rx-contact";
import type { RxPortalDashboard, RxPortalOrder } from "@/lib/rx-portal-dashboard";
import type { PortalRxAutopayStatus } from "@/lib/rx-portal-messages";

function StepSummary({ order }: { order: RxPortalOrder }) {
  if (!order.status) {
    return <p className="text-xs text-black/55">In-clinic order — contact us for status</p>;
  }

  const action = order.status.steps.find((s) => s.status === "action_needed");
  const pending = order.status.steps.find((s) => s.status === "pending");

  if (action) {
    return (
      <p className="text-xs font-semibold text-[#E6007E]">
        Action needed: {action.label}
      </p>
    );
  }
  if (pending) {
    return <p className="text-xs text-black/55">{pending.label} — in progress</p>;
  }
  return <p className="text-xs text-green-700 font-medium">Processing complete</p>;
}

function OrderCard({ order }: { order: RxPortalOrder }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <div className="border-b border-black/10 bg-[#FFF0F7] px-4 py-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">
            {order.track === "peptide" ? "Peptide" : order.track === "glp1" ? "GLP-1" : "RX"}
          </p>
          <p className="font-bold text-black">{order.title}</p>
          <p className="text-xs text-black/50 mt-0.5">
            {new Date(order.submittedAt).toLocaleDateString()}
            {order.status?.intakeRef ? ` · Ref ${order.status.intakeRef}` : ""}
          </p>
        </div>
        {order.status?.payment?.status === "paid" ? (
          <span className="text-[10px] font-bold uppercase bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Paid
          </span>
        ) : order.paymentUrl ? (
          <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            Pay now
          </span>
        ) : null}
      </div>

      <div className="px-4 py-3 space-y-3">
        <StepSummary order={order} />

        {order.status && (
          <ol className="space-y-1.5">
            {order.status.steps.map((step) => (
              <li key={step.id} className="flex items-center gap-2 text-xs text-black/70">
                <span aria-hidden>
                  {step.status === "complete" ? "✓" : step.status === "action_needed" ? "→" : "…"}
                </span>
                <span className={step.status === "action_needed" ? "font-semibold text-[#E6007E]" : ""}>
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {order.paymentUrl && order.status?.payment?.status !== "paid" && (
            <a
              href={order.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-[#E6007E] px-3 py-2 text-xs font-bold text-white hover:bg-black"
            >
              Pay ${order.status?.payment?.amountUsd?.toFixed(0) ?? ""}
            </a>
          )}
          <Link
            href={order.statusHref}
            className="inline-flex items-center rounded-lg border-2 border-black px-3 py-2 text-xs font-bold hover:border-[#E6007E]"
          >
            Full details
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PortalRxDashboard() {
  const { user, loading: authLoading, authenticated } = usePortalAuth(true);
  const { canPrompt, subscribe, busy, permission } = useRxPushNotifications(authenticated);
  const [data, setData] = useState<(RxPortalDashboard & {
    activeOrders: RxPortalOrder[];
    pastOrders: RxPortalOrder[];
    autopay?: PortalRxAutopayStatus;
  }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    setLoading(true);
    fetch("/api/portal/rx")
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || "Could not load RX dashboard");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load"))
      .finally(() => setLoading(false));
  }, [authenticated]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="animate-spin text-4xl">💊</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
        {error}
      </div>
    );
  }

  const links = data?.links;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#E6007E]">Hello Gorgeous RX™</p>
        <h1 className="text-2xl font-bold text-black mt-1">My prescriptions</h1>
        <p className="text-sm text-black/55 mt-1">
          Track refills, pay invoices, and reorder — like a modern telehealth portal.
        </p>
      </div>

      {canPrompt && (
        <div className="rounded-2xl border-2 border-[#E6007E] bg-gradient-to-r from-[#FFF0F7] to-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-bold text-black">Get refill reminders on this device</p>
            <p className="text-sm text-black/60 mt-1">
              Push alerts when your GLP-1 or peptide refill is due — no app store required.
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void subscribe()}
            className="shrink-0 rounded-lg bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white hover:bg-black disabled:opacity-60"
          >
            {busy ? "Enabling…" : "Turn on notifications"}
          </button>
        </div>
      )}

      {permission === "denied" && (
        <p className="text-xs text-black/45">
          Notifications are blocked in your browser settings — enable them to get refill alerts here.
        </p>
      )}

      {data?.refillDue && (
        <div
          className={`rounded-2xl border-2 px-5 py-4 ${
            data.refillDue.urgency === "overdue"
              ? "border-red-400 bg-red-50"
              : "border-amber-400 bg-amber-50"
          }`}
        >
          <p className="font-bold text-black">
            {data.refillDue.urgency === "overdue" ? "Refill overdue" : "Refill due soon"}
          </p>
          <p className="text-sm text-black/70 mt-1">
            {data.refillDue.medication}
            {data.refillDue.doseLabel ? ` · ${data.refillDue.doseLabel}` : ""} —{" "}
            {data.refillDue.daysUntilDue <= 0
              ? "due now"
              : `due in ${data.refillDue.daysUntilDue} days`}
          </p>
          <Link
            href={data.refillDue.reorderHref}
            className="mt-3 inline-flex rounded-lg bg-[#E6007E] px-4 py-2.5 text-sm font-bold text-white hover:bg-black"
          >
            Start refill →
          </Link>
        </div>
      )}

      {data?.autopay?.active && (
        <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-green-800">Auto-pay active</p>
          <p className="font-bold text-black mt-1">
            {data.autopay.lineLabel || "Monthly RX subscription"}
          </p>
          <p className="text-sm text-black/65 mt-1">
            ${data.autopay.amountUsd?.toFixed(0) ?? "—"}/mo · renews automatically · no separate membership fee
          </p>
          <p className="text-xs text-black/50 mt-2">
            To pause or update billing, message the care team below or text{" "}
            <a href={RX_CARE_TEXT_SMS} className="font-semibold text-[#E6007E] underline">
              {RX_CARE_TEXT_DISPLAY}
            </a>
            .
          </p>
        </div>
      )}

      <PortalRxWeightProgress />
      <PortalRxCareTeam />

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href={links?.glp1Refill || "/glp1-refill"}
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors"
        >
          <p className="font-bold text-black">GLP-1 refill</p>
          <p className="text-xs text-black/55 mt-1">Semaglutide · Tirzepatide</p>
        </Link>
        <Link
          href={links?.peptideRequest || "/peptide-request"}
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors"
        >
          <p className="font-bold text-black">Peptide refill</p>
          <p className="text-xs text-black/55 mt-1">BPC-157 · blends · recovery</p>
        </Link>
        <a
          href={links?.telehealth}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors"
        >
          <p className="font-bold text-black">Book telehealth</p>
          <p className="text-xs text-black/55 mt-1">NP check-in on Fresha</p>
        </a>
        <Link
          href={links?.careHub || "/rx/care"}
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors"
        >
          <p className="font-bold text-black">Care hub</p>
          <p className="text-xs text-black/55 mt-1">Refills, add-ons & guides</p>
        </Link>
        <Link
          href="/rx/guide"
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors"
        >
          <p className="font-bold text-black">Online refill guide</p>
          <p className="text-xs text-black/55 mt-1">Bookmark links · print to save</p>
        </Link>
        <Link
          href="/glp1-weight-loss"
          className="rounded-xl border-2 border-black bg-white p-4 hover:border-[#E6007E] transition-colors sm:col-span-2"
        >
          <p className="font-bold text-black">Why Hello Gorgeous vs big telehealth?</p>
          <p className="text-xs text-black/55 mt-1">
            Local NP · no $149/mo membership · peptides + GLP-1 in one portal
          </p>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-bold text-black mb-3">Active orders</h2>
        {data?.activeOrders?.length ? (
          <div className="space-y-4">
            {data.activeOrders.map((order) => (
              <OrderCard key={`${order.kind}-${order.id}`} order={order} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-black/20 p-8 text-center">
            <p className="text-black/60 text-sm">No active RX orders.</p>
            <p className="text-black/45 text-xs mt-2">
              Start a GLP-1 or peptide refill above — status will appear here after you submit.
            </p>
          </div>
        )}
      </section>

      {data?.pastOrders && data.pastOrders.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowPast((v) => !v)}
            className="text-sm font-semibold text-[#E6007E] hover:underline"
          >
            {showPast ? "Hide" : "Show"} past orders ({data.pastOrders.length})
          </button>
          {showPast && (
            <div className="mt-4 space-y-4 opacity-80">
              {data.pastOrders.map((order) => (
                <OrderCard key={`past-${order.kind}-${order.id}`} order={order} />
              ))}
            </div>
          )}
        </section>
      )}

      <p className="text-xs text-black/45 leading-relaxed">
        Signed in as {user?.email}. Payment is collected at checkout; we email and text if telehealth
        is required before shipping.
      </p>
    </div>
  );
}

export default PortalRxDashboard;
