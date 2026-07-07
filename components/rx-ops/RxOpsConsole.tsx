"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  RX_OPS_CAT_META,
  RX_OPS_NAV,
  RX_OPS_PH_COLORS,
  RX_OPS_VIEW_TITLES,
  type RxOpsViewId,
} from "@/components/rx-ops/constants";
import { rxOpsSamplePayload } from "@/lib/rx-ops/sample-data";
import { RX_OPS_STAGE_COLORS } from "@/lib/rx-ops/stages";
import type {
  RxOpsConsolePayload,
  RxOpsFormularyRow,
  RxOpsPaymentRow,
  RxOpsRequest,
  RxOpsRequestDetail,
  RxOpsShipmentRow,
  RxOpsStage,
} from "@/lib/rx-ops/types";
import type { RxMessageThread, RxSecureMessage } from "@/lib/rx-secure-messages";
import type { RxComplianceReport } from "@/lib/rx-compliance/types";

function stagePill(stage: RxOpsStage) {
  const color = RX_OPS_STAGE_COLORS[stage];
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap"
      style={{ background: `${color}1f`, color }}
    >
      {stage}
    </span>
  );
}

function pharmacyBadge(pharmacy: string) {
  const color = RX_OPS_PH_COLORS[pharmacy] || "#6b7280";
  return (
    <span
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-extrabold whitespace-nowrap"
      style={{ background: `${color}17`, color }}
    >
      {pharmacy}
    </span>
  );
}

function money(n: number | null | undefined) {
  if (n == null || Number.isNaN(n)) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function RxOpsConsole() {
  const [view, setView] = useState<RxOpsViewId>("overview");
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState<RxOpsConsolePayload | null>(null);
  const [formCat, setFormCat] = useState("All");
  const [formPh, setFormPh] = useState("All");
  const [formQ, setFormQ] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [detail, setDetail] = useState<RxOpsRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [routePharmacy, setRoutePharmacy] = useState<string | null>(null);
  const [npNote, setNpNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msgThreadId, setMsgThreadId] = useState<string | null>(null);
  const [msgThread, setMsgThread] = useState<RxMessageThread | null>(null);
  const [msgItems, setMsgItems] = useState<RxSecureMessage[]>([]);
  const [msgReply, setMsgReply] = useState("");
  const [msgLoading, setMsgLoading] = useState(false);
  const [compliance, setCompliance] = useState<RxComplianceReport | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx/ops");
      if (res.ok) setLive(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (view !== "overview" || demo) return;
    void fetch("/api/admin/rx/ops/compliance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setCompliance(data))
      .catch(() => setCompliance(null));
  }, [view, demo, live?.generatedAt]);

  const data = useMemo(() => {
    if (demo) {
      const sample = rxOpsSamplePayload(live?.formulary.length || 214);
      return { ...sample, formulary: live?.formulary?.length ? live.formulary : sample.formulary };
    }
    return (
      live ?? {
        generatedAt: new Date().toISOString(),
        requests: [],
        formulary: [],
        refills: [],
        payments: [],
        paymentsSummary: {
          paidCount: 0,
          pendingCount: 0,
          failedCount: 0,
          refundedCount: 0,
          paidAmountUsd: 0,
          pendingAmountUsd: 0,
          refundedAmountUsd: 0,
          revenue30dUsd: 0,
        },
        threads: [],
        shipments: [],
        overview: {
          requestsToReview: 0,
          revenue30dUsd: null,
          activeRefillPlans: 0,
          totalPatients: 0,
          awaitingShipment: 0,
          formularySkuCount: 0,
        },
        squareConnected: false,
      }
    );
  }, [demo, live]);

  const pendingReview = data.requests.filter((r) => r.stage === "Clinical review").length;
  const headings = RX_OPS_VIEW_TITLES[view];

  const filteredFormulary = useMemo(() => {
    const q = formQ.trim().toLowerCase();
    return data.formulary.filter((r: RxOpsFormularyRow) => {
      if (formCat !== "All" && r.category !== formCat) return false;
      if (formPh !== "All" && r.pharmacy !== formPh) return false;
      if (q && !r.product.toLowerCase().includes(q) && !r.compound.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [data.formulary, formCat, formPh, formQ]);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3400);
  };

  const openReview = async (requestId: string) => {
    if (demo || requestId.startsWith("demo:")) {
      flash("Sample data — toggle off to review live RE GEN orders");
      return;
    }
    setSelectedRequest(requestId);
    setDetailLoading(true);
    setRoutePharmacy(null);
    try {
      const res = await fetch(`/api/admin/rx/ops/requests/${encodeURIComponent(requestId)}`);
      const json = await res.json();
      if (res.ok) {
        setDetail(json);
        setNpNote(json.suggestedNote || "");
        setRoutePharmacy(json.routing?.[0]?.pharmacy ?? null);
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const closeReview = () => {
    setSelectedRequest(null);
    setDetail(null);
  };

  const approveRequest = async () => {
    if (!selectedRequest || demo) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/rx/ops/requests/${encodeURIComponent(selectedRequest)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "approve",
            pharmacySource: routePharmacy,
            npNotes: npNote,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Approve failed");
      flash(json.message || `Approved — routed to ${routePharmacy || "pharmacy"}`);
      closeReview();
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not approve");
    } finally {
      setBusy(false);
    }
  };

  const clinicalAction = async (action: "decline" | "info") => {
    if (!selectedRequest || demo) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/admin/rx/ops/requests/${encodeURIComponent(selectedRequest)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            npNotes: npNote,
          }),
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Action failed");
      flash(json.message || (action === "decline" ? "Request declined" : "Info requested"));
      closeReview();
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not save action");
    } finally {
      setBusy(false);
    }
  };

  const canApprove = detail?.allowedActions?.includes("approve") ?? false;
  const canDecline = detail?.allowedActions?.includes("decline") ?? false;
  const canRequestInfo = detail?.allowedActions?.includes("info") ?? false;
  const canSendInvoice = detail?.request.stage === "Awaiting payment";
  const canCompleteTelehealth =
    detail?.request.stage === "Awaiting telehealth" &&
    detail.request.telehealthStatus !== "complete";

  const markTelehealthComplete = async () => {
    if (!selectedRequest || !detail || demo) return;
    const [kind, id] = selectedRequest.split(":");
    if (!kind || !id) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/ops/telehealth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestKind: kind, requestId: id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not mark telehealth complete");
      flash("Telehealth marked complete — clinical review unlocked");
      void load();
      void openReview(selectedRequest);
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not update telehealth");
    } finally {
      setBusy(false);
    }
  };

  const sendInvoiceFromRequest = async () => {
    if (!selectedRequest || !detail || demo) return;
    const [kind, id] = selectedRequest.split(":");
    if (!kind || !id) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/ops/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestKind: kind,
          requestId: id,
          delivery: "both",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not send invoice");
      flash(`Invoice sent · ${money(json.amountUsd)}`);
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not send invoice");
    } finally {
      setBusy(false);
    }
  };

  const resendLedgerInvoice = async (row: RxOpsPaymentRow, delivery: "email" | "sms" | "both") => {
    if (demo) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/ops/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resend: true, ledgerId: row.id, delivery }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Resend failed");
      flash(`Payment link resent to ${row.patientName}`);
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not resend");
    } finally {
      setBusy(false);
    }
  };

  const markLedgerRefunded = async (row: RxOpsPaymentRow) => {
    if (demo) return;
    if (!confirm(`Mark ${money(row.amountUsd)} for ${row.patientName} as refunded?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/rx/ops/ledger/${encodeURIComponent(row.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentStatus: "refunded",
          intakeRef: row.intakeRef,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      flash("Marked refunded in ledger");
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(false);
    }
  };

  function paymentStatusPill(status: string) {
    const colors: Record<string, string> = {
      paid: "#059669",
      pending: "#d97706",
      failed: "#dc2626",
      refunded: "#6b7280",
    };
    const color = colors[status] || "#6b7280";
    return (
      <span
        className="inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase"
        style={{ background: `${color}18`, color }}
      >
        {status}
      </span>
    );
  }

  const refillPlanAction = async (planId: string, status: "active" | "paused" | "cancelled") => {
    if (demo) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/ops/refill-plans", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not update plan");
      flash(status === "paused" ? "Refill plan paused" : status === "active" ? "Plan resumed" : "Plan cancelled");
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not update plan");
    } finally {
      setBusy(false);
    }
  };

  const shipmentAction = async (
    shipmentId: string,
    action: "submit" | "ship",
    trackingNumber?: string,
  ) => {
    if (demo) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/rx/ops/shipments?id=${encodeURIComponent(shipmentId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, trackingNumber, carrier: "USPS" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Shipment action failed");
      flash(action === "submit" ? "Submitted to pharmacy queue" : "Marked shipped");
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not update shipment");
    } finally {
      setBusy(false);
    }
  };

  const openMessageThread = async (threadId: string) => {
    if (demo || threadId.startsWith("demo:")) {
      flash("Sample data — toggle off to open live threads");
      return;
    }
    setMsgThreadId(threadId);
    setMsgLoading(true);
    try {
      const res = await fetch(
        `/api/admin/rx/ops/messages?threadId=${encodeURIComponent(threadId)}`,
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Could not load thread");
      setMsgThread(json.thread);
      setMsgItems(json.messages || []);
      void load();
    } catch (e) {
      flash(e instanceof Error ? e.message : "Could not load thread");
    } finally {
      setMsgLoading(false);
    }
  };

  const sendMessageReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgThreadId || !msgReply.trim() || demo) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/rx/ops/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: msgThreadId, messageBody: msgReply.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Send failed");
      setMsgItems((prev) => [...prev, json.message]);
      setMsgReply("");
      flash("Reply sent — patient notified (no PHI in SMS/email)");
      void load();
    } catch (err) {
      flash(err instanceof Error ? err.message : "Send failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-[#faf7f8] text-[#111] font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[250px] shrink-0 flex-col bg-[#0a0a0a] text-white min-h-full">
        <div className="flex items-center gap-3 border-b border-[#1c1c1c] px-4 py-[18px]">
          <span className="flex h-[42px] w-[42px] items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-sm font-extrabold shadow-lg shadow-pink-500/25">
            HG
          </span>
          <div>
            <p className="text-[15px] font-extrabold tracking-wide">
              Hello Gorgeous <span className="text-[#FF2D8E]">RX</span>
            </p>
            <p className="text-[11px] uppercase tracking-[0.08em] text-pink-300/65">
              Prescription Ops
            </p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2.5 py-3.5">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
            Workspace
          </p>
          <ul className="grid gap-1">
            {RX_OPS_NAV.map((n) => {
              const on = view === n.id;
              const badge = n.id === "requests" && pendingReview > 0 ? pendingReview : null;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => setView(n.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border-none px-3 py-2.5 text-left text-sm font-semibold cursor-pointer ${
                      on
                        ? "bg-[#FF2D8E] text-white shadow-lg shadow-pink-500/25"
                        : "bg-transparent text-white/82 hover:bg-white/5"
                    }`}
                  >
                    <span className="w-[22px] text-center text-lg">{n.icon}</span>
                    <span className="flex-1">{n.name}</span>
                    {badge ? (
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-extrabold text-white ${
                          on ? "bg-white/25" : "bg-emerald-500"
                        }`}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-[#1c1c1c] p-3.5 text-xs text-white/50">
          <Link href="/admin/rx" className="text-[#FFB8DC] hover:text-white font-semibold">
            ← Legacy RX Command
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 bg-white px-6 py-5 md:px-8">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight m-0">{headings.title}</h1>
            <p className="mt-1 text-sm text-black/55 m-0">{headings.sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDemo((d) => !d)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold ${
                demo ? "border-amber-400 bg-amber-50 text-amber-900" : "border-black/15 bg-white"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${demo ? "bg-amber-500" : "bg-emerald-500"}`}
              />
              {demo ? "Sample data: ON" : "Sample data: OFF"}
            </button>
            <span className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[#FF2D8E] bg-[#fff5f9] px-3 py-2 text-xs font-bold text-[#E6007E]">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Provider · clinical
            </span>
          </div>
        </div>

        {demo ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2 text-xs text-amber-900 md:px-8">
            <b>Preview sample data</b> — fictional patients for demonstration. Toggle off for live RE
            GEN / intake / clinic requests.
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto">
          {loading && !live ? (
            <p className="p-10 text-center text-black/50">Loading RX Ops…</p>
          ) : null}

          {view === "overview" ? (
            <div className="p-6 md:p-8">
              {compliance ? (
                <div
                  className={`mb-7 rounded-2xl border-4 p-4 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] ${
                    compliance.readyForGoLive
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-amber-500 bg-amber-50"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-black/45">
                        M9 · Go-live readiness
                      </p>
                      <p className="font-extrabold text-lg">
                        {compliance.readyForGoLive
                          ? "Blocking gates clear"
                          : `${compliance.gates.filter((g) => g.status === "fail").length} blocking gate(s)`}
                      </p>
                      <p className="text-sm text-black/55 mt-0.5">
                        BAAs · pen test · licensing · UAT · infrastructure (HGRX-100–103)
                      </p>
                    </div>
                    <Link
                      href="/admin/rx/go-live"
                      className="rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2.5 text-sm font-bold text-white"
                    >
                      Open checklist →
                    </Link>
                  </div>
                </div>
              ) : null}
              <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    icon: "🩺",
                    label: "Requests to review",
                    value: String(data.overview.requestsToReview),
                    note:
                      data.overview.requestsToReview > 0
                        ? "Awaiting clinical review"
                        : "Queue clear",
                    accent: true,
                  },
                  {
                    icon: "💳",
                    label: "Revenue (recent)",
                    value: data.overview.revenue30dUsd != null ? money(data.overview.revenue30dUsd) : "—",
                    note: data.squareConnected ? "From payment ledger" : "Connect Square",
                  },
                  {
                    icon: "🔁",
                    label: "Active refill plans",
                    value: String(data.overview.activeRefillPlans),
                    note: "Cadence tracked",
                  },
                  {
                    icon: "💊",
                    label: "Formulary SKUs",
                    value: String(data.overview.formularySkuCount),
                    note: "Ready to prescribe",
                  },
                ].map((k) => (
                  <div
                    key={k.label}
                    className={`rounded-2xl bg-white p-4 shadow-sm ${
                      k.accent ? "border-2 border-[#FF2D8E]" : "border border-black/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-semibold text-black/55">
                      <span>{k.icon}</span>
                      {k.label}
                    </div>
                    <p
                      className={`mt-1 font-serif text-3xl font-extrabold ${
                        k.accent ? "text-[#FF2D8E]" : "text-black"
                      }`}
                    >
                      {k.value}
                    </p>
                    <p className="text-xs font-semibold text-black/50">{k.note}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="font-serif text-lg font-bold">How a prescription flows</h2>
                  <p className="mb-4 text-sm text-black/55">Five-step patient journey (HGRX-030).</p>
                  <div className="grid gap-2.5">
                    {[
                      ["1", "Request submitted", "Patient refill or new-protocol form"],
                      ["2", "Telehealth visit", "Fresha $49 consult when required"],
                      ["3", "Invoice paid", "Square link by text or email"],
                      ["4", "Clinical review", "NP approves & routes to pharmacy"],
                      ["5", "Delivered", "FCC · BoomRx · Olympia"],
                    ].map(([n, title, desc]) => (
                      <div
                        key={n}
                        className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3.5 shadow-sm"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black text-sm font-extrabold text-white">
                          {n}
                        </span>
                        <div>
                          <p className="text-sm font-bold">{title}</p>
                          <p className="text-xs text-black/55">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold">Integrations</h2>
                  <p className="mb-4 text-sm text-black/55">M4–M6 from your build ticket.</p>
                  <div className="grid gap-2">
                    {[
                      ["Square", data.squareConnected ? "Connected" : "Not connected", "/admin/settings/payments"],
                      ["RE GEN Catalog", `${data.overview.formularySkuCount} SKUs`, "/admin/rx/catalog"],
                      ["RE GEN Fulfillment", "Online orders", "/admin/rx/regen-orders"],
                      ["RX Dispatch", "Intake copy-packs", "/admin/rx-dispatch"],
                      ["Go-live checklist", compliance?.readyForGoLive ? "Ready" : "Review gates", "/admin/rx/go-live"],
                    ].map(([name, status, href]) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3 text-sm hover:border-[#FF2D8E]"
                      >
                        <span className="font-bold">{name}</span>
                        <span className="text-black/50">{status} →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              {data.shipments.length > 0 ? (
                <div className="mt-8">
                  <h2 className="font-serif text-lg font-bold mb-1">
                    Pharmacy shipments <span className="text-[#FF2D8E]">(M4)</span>
                  </h2>
                  <p className="mb-4 text-sm text-black/55">
                    Unified queue across Formulation Rx, BoomRx & Olympia — submit after NP approval.
                  </p>
                  <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <table className="w-full text-sm">
                      <thead className="bg-[#faf7f8] text-left text-[11px] font-bold uppercase tracking-wide text-black/50">
                        <tr>
                          <th className="px-4 py-3">Patient</th>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Pharmacy</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.shipments.map((s: RxOpsShipmentRow) => (
                          <tr key={s.id} className="border-t border-black/10">
                            <td className="px-4 py-3 font-semibold">{s.patientName}</td>
                            <td className="px-4 py-3 text-black/70">{s.product}</td>
                            <td className="px-4 py-3">{pharmacyBadge(s.pharmacy)}</td>
                            <td className="px-4 py-3 text-xs font-bold">{s.statusLabel}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                {s.status === "queued" || s.status === "failed" ? (
                                  <button
                                    type="button"
                                    disabled={busy || demo}
                                    onClick={() => void shipmentAction(s.id, "submit")}
                                    className="rounded-lg bg-[#FF2D8E] px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
                                  >
                                    Submit
                                  </button>
                                ) : null}
                                {(s.status === "submitted" || s.status === "processing") && !s.trackingNumber ? (
                                  <button
                                    type="button"
                                    disabled={busy || demo}
                                    onClick={() => {
                                      const tracking = window.prompt("Tracking number");
                                      if (tracking) void shipmentAction(s.id, "ship", tracking);
                                    }}
                                    className="rounded-lg border-2 border-black px-3 py-1.5 text-[11px] font-bold disabled:opacity-50"
                                  >
                                    Mark shipped
                                  </button>
                                ) : null}
                                {s.trackingNumber ? (
                                  <span className="text-[11px] text-black/60">{s.trackingNumber}</span>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {view === "requests" ? (
            <div className="p-6 md:p-8">
              {data.requests.length === 0 ? (
                <EmptyState
                  icon="🩺"
                  title="No open requests"
                  body="When a patient submits a refill, RE GEN order, or clinic sale it lands here. Clinical review is where Ryan approves, e-signs, and routes to the pharmacy."
                />
              ) : (
                <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                  <div className="hidden md:grid grid-cols-[2fr_1.6fr_1.3fr_1fr_120px] gap-4 border-b border-black/10 bg-[#faf7f8] px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-black/50">
                    <span>Patient</span>
                    <span>Requested</span>
                    <span>Stage</span>
                    <span>Submitted</span>
                    <span />
                  </div>
                  {data.requests.map((r: RxOpsRequest) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-1 md:grid-cols-[2fr_1.6fr_1.3fr_1fr_120px] gap-3 md:gap-4 border-b border-black/10 px-5 py-4 items-center"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F7] text-sm font-extrabold text-[#E6007E]">
                          {r.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{r.patientName}</p>
                          <p className="text-xs text-black/55 truncate">{r.meta}</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.product}</p>
                        <p className="text-xs text-black/55">{r.reason}</p>
                      </div>
                      <div>{stagePill(r.stage)}</div>
                      <p className="text-sm text-black/60">{r.submittedLabel}</p>
                      <button
                        type="button"
                        onClick={() =>
                          r.stage === "Clinical review"
                            ? void openReview(r.id)
                            : r.actionHref && !demo
                              ? window.open(r.actionHref, "_self")
                              : void openReview(r.id)
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
                          r.stage === "Clinical review"
                            ? "bg-black text-white"
                            : "border border-black/15 bg-white"
                        }`}
                      >
                        {r.stage === "Clinical review" ? "Review" : "View"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {view === "formulary" ? (
            <div className="p-6 md:p-8">
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <input
                  type="search"
                  placeholder="Search product or compound…"
                  value={formQ}
                  onChange={(e) => setFormQ(e.target.value)}
                  className="min-w-[200px] flex-1 max-w-sm rounded-lg border border-black/15 px-3 py-2 text-sm"
                />
                <span className="text-sm font-semibold text-black/55">
                  {filteredFormulary.length} of {data.formulary.length} SKUs
                </span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                {["All", ...Object.keys(RX_OPS_CAT_META)].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormCat(c === "All" ? "All" : c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold border ${
                      formCat === c || (c === "All" && formCat === "All")
                        ? "border-[#FF2D8E] bg-[#FF2D8E] text-white"
                        : "border-black/15 bg-white"
                    }`}
                  >
                    {c === "All" ? "All" : RX_OPS_CAT_META[c]?.label || c}
                  </button>
                ))}
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {["All", "Formulation Rx", "BoomRx", "Olympia"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormPh(p)}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold border ${
                      formPh === p ? "border-black bg-black text-white" : "border-black/15 bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                <div className="hidden lg:grid grid-cols-[2.4fr_1.2fr_1.4fr_1.1fr_0.8fr_0.8fr] gap-3 border-b border-black/10 bg-[#faf7f8] px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-black/50">
                  <span>Product</span>
                  <span>Category</span>
                  <span>Strength · Size</span>
                  <span>Pharmacy</span>
                  <span className="text-right">30-day</span>
                  <span className="text-right">90-day</span>
                </div>
                <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                  {filteredFormulary.map((r) => (
                    <div
                      key={r.id}
                      className="grid grid-cols-1 lg:grid-cols-[2.4fr_1.2fr_1.4fr_1.1fr_0.8fr_0.8fr] gap-2 lg:gap-3 border-b border-black/10 px-5 py-3 text-sm items-center"
                    >
                      <div>
                        <p className="font-semibold leading-snug">{r.product}</p>
                        <div className="mt-1 flex gap-1 flex-wrap">
                          {r.coldShip ? (
                            <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                              ❄ Cold
                            </span>
                          ) : null}
                          {r.controlled ? (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-800">
                              ⚠ Ctrl
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span className="text-xs font-extrabold uppercase text-black/60">
                        {r.categoryLabel}
                      </span>
                      <span className="text-black/70 text-xs">{r.spec}</span>
                      <span>{pharmacyBadge(r.pharmacy)}</span>
                      <span className="lg:text-right font-serif font-bold">{money(r.retail30)}</span>
                      <span className="lg:text-right font-semibold text-[#E6007E]">
                        {money(r.retail90)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-xs text-black/45 max-w-2xl">
                Live catalog from <code>regen-best-prices.json</code> — {data.formulary.length}{" "}
                SKUs across Formulation Rx, BoomRx & Olympia. 90-day = discounted 3-month supply.
              </p>
            </div>
          ) : null}

          {view === "refills" ? (
            <div className="p-6 md:p-8">
              {data.refills.length === 0 ? (
                <EmptyState
                  icon="🔁"
                  title="No refill plans yet"
                  body="Plans appear after a shipped order — 30/90-day cadence with pause/resume (HGRX-070)."
                />
              ) : (
                <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead>
                      <tr className="border-b-2 border-black/10 text-left text-[11px] font-bold uppercase tracking-wide text-black/45">
                        <th className="px-4 py-3">Patient</th>
                        <th className="px-4 py-3">Plan</th>
                        <th className="px-4 py-3">Pharmacy</th>
                        <th className="px-4 py-3">Cadence</th>
                        <th className="px-4 py-3">Next</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.refills.map((r) => (
                        <tr key={r.id} className="border-b border-black/5 last:border-0">
                          <td className="px-4 py-3 font-semibold">{r.patientName}</td>
                          <td className="px-4 py-3">
                            {r.plan}
                            {r.price ? (
                              <span className="block text-xs text-black/50">{r.price}</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">{r.pharmacy}</td>
                          <td className="px-4 py-3">{r.cadence}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{r.nextRefill}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase ${
                                r.status === "Paused"
                                  ? "bg-gray-100 text-gray-600"
                                  : r.status === "Due"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {r.status}
                            </span>
                            {r.telehealthRecheckDue ? (
                              <span className="block text-[10px] font-bold text-[#2563eb] mt-1">
                                ⚕ Recheck due
                              </span>
                            ) : null}
                            {r.draftLedgerId ? (
                              <span className="block text-[10px] font-bold text-[#E6007E] mt-1">
                                Invoice draft ready
                              </span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {r.planStatus === "active" ? (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void refillPlanAction(r.id, "paused")}
                                  className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                >
                                  Pause
                                </button>
                              ) : null}
                              {r.planStatus === "paused" ? (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void refillPlanAction(r.id, "active")}
                                  className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                >
                                  Resume
                                </button>
                              ) : null}
                              {r.planStatus !== "cancelled" ? (
                                <button
                                  type="button"
                                  disabled={busy}
                                  onClick={() => void refillPlanAction(r.id, "cancelled")}
                                  className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              ) : null}
                              <Link
                                href={r.reorderHref}
                                className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E]"
                              >
                                Reorder
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}

          {view === "payments" ? (
            <div className="p-6 md:p-8">
              <div className="mb-5 rounded-2xl bg-black p-6 text-white flex flex-wrap items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl font-black text-black">
                  □
                </span>
                <div className="flex-1 min-w-[200px]">
                  <h2 className="font-serif text-xl font-bold m-0">Square</h2>
                  <p className="text-sm text-white/70 mt-1 m-0">
                    {data.squareConnected
                      ? "Connected — ledger syncs via webhooks (HGRX-050)"
                      : "Connect in Settings to send invoices & sync payouts."}
                  </p>
                </div>
                <Link
                  href="/admin/settings/payments"
                  className="rounded-lg bg-[#FF2D8E] px-5 py-3 text-sm font-extrabold text-white"
                >
                  {data.squareConnected ? "Square settings" : "Connect Square"}
                </Link>
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    label: "Collected (30d)",
                    value: money(data.paymentsSummary.revenue30dUsd),
                    sub: `${data.paymentsSummary.paidCount} paid`,
                  },
                  {
                    label: "Pending invoices",
                    value: money(data.paymentsSummary.pendingAmountUsd),
                    sub: `${data.paymentsSummary.pendingCount} open`,
                  },
                  {
                    label: "Failed",
                    value: String(data.paymentsSummary.failedCount),
                    sub: "needs follow-up",
                  },
                  {
                    label: "Refunded",
                    value: money(data.paymentsSummary.refundedAmountUsd),
                    sub: `${data.paymentsSummary.refundedCount} rows`,
                  },
                ].map((kpi) => (
                  <div
                    key={kpi.label}
                    className="rounded-2xl border-4 border-black bg-white p-4 shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wide text-black/45 m-0">
                      {kpi.label}
                    </p>
                    <p className="font-serif text-2xl font-black mt-1 mb-0">{kpi.value}</p>
                    <p className="text-xs text-black/50 mt-1 m-0">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {data.payments.length === 0 ? (
                <EmptyState
                  icon="💳"
                  title="No transactions yet"
                  body="Send an invoice from a request in Awaiting payment, or use the RX ledger."
                  cta={{ label: "Open RX ledger", href: "/admin/rx-ledger" }}
                />
              ) : (
                <>
                  <div className="overflow-x-auto rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead>
                        <tr className="border-b-2 border-black/10 text-left text-[11px] font-bold uppercase tracking-wide text-black/45">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Patient</th>
                          <th className="px-4 py-3">For</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.payments.map((t) => (
                          <tr key={t.id} className="border-b border-black/5 last:border-0">
                            <td className="px-4 py-3 whitespace-nowrap">{t.date}</td>
                            <td className="px-4 py-3 font-semibold">{t.patientName}</td>
                            <td className="px-4 py-3 text-black/70">{t.forLabel}</td>
                            <td className="px-4 py-3">{paymentStatusPill(t.status)}</td>
                            <td className="px-4 py-3 font-serif font-bold">{money(t.amountUsd)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {t.status === "pending" && t.paymentUrl ? (
                                  <>
                                    <button
                                      type="button"
                                      disabled={busy}
                                      onClick={() => void resendLedgerInvoice(t, "sms")}
                                      className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                    >
                                      Text
                                    </button>
                                    <button
                                      type="button"
                                      disabled={busy}
                                      onClick={() => void resendLedgerInvoice(t, "email")}
                                      className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                    >
                                      Email
                                    </button>
                                  </>
                                ) : null}
                                {t.status === "paid" ? (
                                  <button
                                    type="button"
                                    disabled={busy}
                                    onClick={() => void markLedgerRefunded(t)}
                                    className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E] disabled:opacity-50 cursor-pointer"
                                  >
                                    Refund
                                  </button>
                                ) : null}
                                {t.paymentUrl ? (
                                  <a
                                    href={t.paymentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-md border border-black/15 px-2 py-1 text-[11px] font-bold hover:border-[#E6007E]"
                                  >
                                    Link
                                  </a>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm">
                    <Link href="/admin/rx-ledger" className="font-bold text-[#E6007E] underline">
                      Full compliance ledger →
                    </Link>
                  </p>
                </>
              )}
            </div>
          ) : null}

          {view === "messages" ? (
            <div className="p-6 md:p-8">
              {data.threads.length === 0 ? (
                <EmptyState
                  icon="💬"
                  title="No messages yet"
                  body="Secure threads from the care hub — patients message via the RX portal."
                  cta={{ label: "Open RX Messages", href: "/admin/rx-messages" }}
                />
              ) : (
                <div className="grid gap-4 lg:grid-cols-[280px_1fr] min-h-[480px]">
                  <div className="rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] overflow-hidden">
                    <div className="border-b-2 border-black/10 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-black/45">
                      Inbox ({data.threads.filter((t) => t.unread).length} unread)
                    </div>
                    <div className="max-h-[440px] overflow-y-auto">
                      {data.threads.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => void openMessageThread(t.id)}
                          className={`w-full border-b border-black/5 px-4 py-3 text-left transition hover:bg-rose-50/80 ${
                            msgThreadId === t.id ? "bg-[#FFF0F7]" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm truncate">{t.patientName}</span>
                            {t.unread ? (
                              <span className="shrink-0 rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold text-white">
                                new
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-xs text-black/50 truncate">{t.preview}</p>
                          <p className="mt-1 text-[10px] font-semibold text-black/35">
                            Ref {t.intakeRef} · {t.time}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.25)] flex flex-col min-h-[440px]">
                    {!msgThreadId ? (
                      <div className="flex flex-1 items-center justify-center p-8 text-center text-black/45 text-sm">
                        Select a thread to view and reply. Replies are logged to chart + audit trail
                        (HGRX-080).
                      </div>
                    ) : msgLoading ? (
                      <div className="flex flex-1 items-center justify-center text-sm text-black/45">
                        Loading thread…
                      </div>
                    ) : (
                      <>
                        <div className="border-b-2 border-black/10 px-4 py-3">
                          <p className="font-extrabold">
                            {msgThread?.patientName || "Patient"}
                          </p>
                          <p className="text-xs text-black/50">
                            Ref {msgThread?.intakeRef} · {msgThread?.patientEmail}
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[300px]">
                          {msgItems.map((m) => (
                            <div
                              key={m.id}
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                                m.senderType === "staff"
                                  ? "ml-auto bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-white"
                                  : "bg-black/5 text-black/85"
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{m.body}</p>
                              <p
                                className={`mt-1 text-[10px] ${
                                  m.senderType === "staff" ? "text-white/70" : "text-black/40"
                                }`}
                              >
                                {m.senderType === "staff" ? m.sentBy || "Staff" : "Patient"} ·{" "}
                                {new Date(m.createdAt).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <form
                          onSubmit={(e) => void sendMessageReply(e)}
                          className="border-t-2 border-black/10 p-4"
                        >
                          <textarea
                            value={msgReply}
                            onChange={(e) => setMsgReply(e.target.value)}
                            rows={3}
                            placeholder="Secure reply — patient gets portal link only (no PHI in SMS/email)…"
                            className="w-full rounded-xl border-2 border-black/15 px-3 py-2 text-sm focus:border-[#E6007E] focus:outline-none"
                          />
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-[10px] text-black/40">
                              HGRX-081 · Chart + audit on send
                            </p>
                            <button
                              type="submit"
                              disabled={busy || !msgReply.trim()}
                              className="rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer"
                            >
                              Send reply
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              )}
              <p className="mt-4 text-sm">
                <Link href="/admin/rx-messages" className="font-bold text-[#E6007E] underline">
                  Full messaging inbox →
                </Link>
              </p>
            </div>
          ) : null}

          {view === "patients" ? (
            <div className="p-6 md:p-8">
              <EmptyState
                icon="👥"
                title="Patient charts (EHR-lite)"
                body="HGRX-020 wires demographics, allergies, meds & order history. For now, use Clients + per-request review."
                cta={{ label: "Open Clients", href: "/admin/clients" }}
              />
            </div>
          ) : null}

          {view === "team" ? (
            <div className="p-6 md:p-8">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Dani",
                    role: "Owner",
                    initials: "D",
                    perms: ["All patient records", "Payments & Square", "Formulary edits", "Team access"],
                  },
                  {
                    name: "Ryan Kent, FNP-BC",
                    role: "Prescriber",
                    initials: "RK",
                    perms: ["Clinical review & e-sign", "Patient charts", "Messages & refills", "—"],
                  },
                  {
                    name: "Front Desk",
                    role: "Staff",
                    initials: "FD",
                    perms: ["Intake & scheduling", "Send invoices", "Patient messages", "—"],
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-sm font-bold text-white">
                        {t.initials}
                      </span>
                      <div>
                        <p className="font-extrabold">{t.name}</p>
                        <p className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">
                          {t.role}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-4 grid gap-1.5 text-sm text-black/70">
                      {t.perms.map((p) => (
                        <li key={p}>✓ {p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-black/45">
                RBAC enforcement (HGRX-004) uses existing admin roles — Owner / Provider / Front Desk
                matrix from your build ticket.
              </p>
            </div>
          ) : null}
        </div>
      </main>

      {/* Clinical review drawer */}
      {selectedRequest ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px] border-none cursor-pointer"
            onClick={closeReview}
          />
          <div className="relative flex h-full w-full max-w-[580px] flex-col overflow-y-auto bg-white shadow-2xl">
            {detailLoading || !detail ? (
              <p className="p-8 text-black/50">Loading clinical review…</p>
            ) : (
              <>
                <div className="sticky top-0 z-10 border-b-2 border-black bg-white px-6 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F7] text-lg font-extrabold text-[#E6007E]">
                        {detail.request.initials}
                      </span>
                      <div>
                        <h2 className="font-serif text-xl font-bold m-0">
                          {detail.request.patientName}
                        </h2>
                        <p className="text-sm text-black/60 m-0">
                          {detail.request.meta} · {detail.request.submittedLabel}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeReview}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 border-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-5 p-6">
                  <div className="rounded-2xl border border-black/10 bg-[#faf7f8] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-black/45">
                      Requested treatment
                    </p>
                    <p className="font-serif text-lg font-bold">{detail.request.product}</p>
                    <p className="text-sm text-black/60">{detail.request.reason}</p>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold mb-2">Automated screening</h3>
                    <div className="grid gap-2">
                      {detail.screening.map((f) => (
                        <div
                          key={f.text}
                          className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
                            f.ok
                              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                              : "border-amber-200 bg-amber-50 text-amber-900"
                          }`}
                        >
                          <span>{f.icon}</span>
                          {f.text}
                        </div>
                      ))}
                    </div>
                  </div>
                  {detail.intake.length > 0 ? (
                    <div>
                      <h3 className="font-serif font-bold mb-2">Intake questionnaire</h3>
                      <div className="overflow-hidden rounded-xl border border-black/10">
                        {detail.intake.map((a) => (
                          <div key={a.q} className="border-b border-black/10 px-4 py-3 last:border-0">
                            <p className="text-sm text-black/55">{a.q}</p>
                            <p className="text-sm font-semibold">{a.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {detail.shipTo ? (
                    <div className="rounded-xl border border-black/10 p-4 text-sm">
                      <p className="font-bold text-[11px] uppercase text-black/45">Ship to</p>
                      <p className="whitespace-pre-line mt-1">{detail.shipTo}</p>
                    </div>
                  ) : null}
                  {detail.request.telehealthRequired && detail.request.telehealthStatus !== "not_required" ? (
                    <div className="rounded-2xl border-2 border-[#2563eb] bg-[#eff6ff] p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[#2563eb] m-0">
                        NP telehealth (Fresha)
                      </p>
                      <p className="text-sm text-black/70 mt-2 mb-3">
                        {detail.request.telehealthStatus === "complete"
                          ? "Visit complete — ready for clinical approval."
                          : detail.request.telehealthStatus === "scheduled"
                            ? `Scheduled${detail.telehealthScheduledAt ? ` · ${new Date(detail.telehealthScheduledAt).toLocaleString()}` : ""}`
                            : "$49 consult required before NP can approve and ship."}
                      </p>
                      {detail.request.telehealthStatus !== "complete" ? (
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={detail.telehealthBookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-[#2563eb] px-4 py-2 text-xs font-bold text-white"
                          >
                            Open Fresha booking
                          </a>
                          {canCompleteTelehealth ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void markTelehealthComplete()}
                              className="rounded-lg border-2 border-black px-4 py-2 text-xs font-bold disabled:opacity-50 cursor-pointer"
                            >
                              Mark visit complete
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <div>
                    <h3 className="font-serif font-bold mb-1">Route to pharmacy</h3>
                    <p className="text-xs text-black/50 mb-2">
                      Lowest 30-day catalog options for this compound.
                    </p>
                    <div className="grid gap-2">
                      {detail.routing.map((p) => (
                        <button
                          key={p.pharmacy}
                          type="button"
                          onClick={() => setRoutePharmacy(p.pharmacy)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left cursor-pointer ${
                            routePharmacy === p.pharmacy
                              ? "border-[#FF2D8E] bg-[#FFF0F7]"
                              : "border-black/10 bg-white"
                          }`}
                        >
                          {pharmacyBadge(p.pharmacy)}
                          <span className="flex-1 text-xs text-black/50">
                            {p.cold ? "Cold ship" : ""}
                            {p.controlled ? " · Controlled" : ""}
                          </span>
                          <span className="font-serif font-bold">{money(p.priceUsd)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold mb-2">Provider note & SIG</h3>
                    <textarea
                      value={npNote}
                      onChange={(e) => setNpNote(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border-2 border-black p-3 text-sm"
                      placeholder="Clinical rationale, dose & directions…"
                    />
                  </div>
                </div>
                <div className="sticky bottom-0 border-t border-black/10 bg-white p-4 space-y-2">
                  {canSendInvoice ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void sendInvoiceFromRequest()}
                      className="w-full rounded-lg bg-black py-3.5 text-sm font-extrabold uppercase tracking-wide text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {busy ? "Sending…" : "💳 Send Square invoice (text + email)"}
                    </button>
                  ) : null}
                  {canApprove ? (
                    <button
                      type="button"
                      disabled={busy || !routePharmacy}
                      onClick={() => void approveRequest()}
                      className="w-full rounded-lg bg-[#FF2D8E] py-3.5 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg shadow-pink-500/30 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {busy
                        ? "Saving…"
                        : `✓ Approve & route to ${routePharmacy || "pharmacy"}`}
                    </button>
                  ) : null}
                  <div className="grid grid-cols-2 gap-2">
                    {canRequestInfo ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void clinicalAction("info")}
                        className="rounded-lg border-2 border-[#7c3aed] bg-white py-3 text-xs font-bold uppercase tracking-wide text-[#7c3aed] disabled:opacity-50 cursor-pointer"
                      >
                        Request info
                      </button>
                    ) : null}
                    {canDecline ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void clinicalAction("decline")}
                        className="rounded-lg border-2 border-[#b42318] bg-white py-3 text-xs font-bold uppercase tracking-wide text-[#b42318] disabled:opacity-50 cursor-pointer"
                      >
                        Decline
                      </button>
                    ) : null}
                  </div>
                  <p className="text-center text-[11px] text-black/45">
                    E-signature under Ryan Kent, FNP-BC · immutable Rx record logged
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  cta,
}: {
  icon: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-8 py-16 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0F7] text-3xl">
        {icon}
      </div>
      <p className="font-serif text-xl font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/55">{body}</p>
      {cta ? (
        <Link
          href={cta.href}
          className="mt-6 inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-bold text-white"
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
      <div
        className="hidden md:grid gap-4 border-b border-black/10 bg-[#faf7f8] px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-black/50"
        style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
      >
        {headers.map((h) => (
          <span key={h}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="grid gap-2 border-b border-black/10 px-5 py-3 text-sm last:border-0"
          style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
        >
          {row.map((cell, j) => (
            <span key={j} className="truncate">
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
