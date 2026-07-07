"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type RxCommandItem = {
  kind: "intake" | "clinic" | "regen";
  id: string;
  submissionId: string;
  submittedAt: string;
  intakeRef: string;
  slug: string;
  templateTitle: string;
  track: "peptide" | "glp1" | "unknown";
  patientName: string;
  phone: string | null;
  email: string | null;
  qualified: boolean;
  dispatchStatus: string;
  paymentStatus: string | null;
  paymentAmountUsd: number | null;
  paymentUrl: string | null;
  templateId: string | null;
  ledgerId: string | null;
  unreadMessages: number;
  clientId?: string | null;
  encounterStatus?: string | null;
  trackingNumber?: string | null;
};

function payBadge(status: string | null) {
  if (status === "paid") return "bg-green-500/20 text-green-300";
  if (status === "unverified") return "bg-orange-500/20 text-orange-200";
  if (status === "pending") return "bg-amber-500/20 text-amber-200";
  if (!status) return "bg-gray-700 text-gray-400";
  return "bg-red-500/20 text-red-200";
}

type RefillDueItem = {
  clientId: string;
  clientName: string | null;
  medication: string;
  doseLabel: string | null;
  supplyCycle: string;
  urgency: "due_soon" | "overdue";
  daysUntilDue: number;
  dueAt: string;
};

export default function AdminRxCommandCenterPage() {
  const [items, setItems] = useState<RxCommandItem[]>([]);
  const [dueRefills, setDueRefills] = useState<RefillDueItem[]>([]);
  const [dueCounts, setDueCounts] = useState({ overdue: 0, dueSoon: 0 });
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rx?limit=50");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items || []);
        setDueRefills(data.dueRefills || []);
        setDueCounts(data.dueCounts || { overdue: 0, dueSoon: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const copyPaymentUrl = async (item: RxCommandItem) => {
    if (!item.paymentUrl) {
      setActionMsg("No payment link yet — use Resend pay link");
      return;
    }
    try {
      await navigator.clipboard.writeText(item.paymentUrl);
      setActionMsg(`Copied payment link for ${item.patientName}`);
    } catch {
      setActionMsg("Could not copy — check browser permissions");
    }
    setTimeout(() => setActionMsg(null), 2500);
  };

  const resendPayLink = async (item: RxCommandItem) => {
    setBusyId(item.submissionId);
    setActionMsg(null);
    try {
      const res = await fetch("/api/admin/rx/resend-pay-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: item.submissionId,
          templateId: item.templateId || undefined,
          delivery: "both",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setActionMsg(`Payment link sent to ${item.patientName}`);
      void load();
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : "Could not send payment link");
    } finally {
      setBusyId(null);
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black">
              <span className="text-[#FF2D8E]">RX</span> Command Center
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Intake → pay → dispatch → message — one queue. Ref threads checkout, ledger, and pharmacy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link href="/admin/rx-dispatch" className="text-[#FFB8DC] hover:text-white">
              Dispatch →
            </Link>
            <Link href="/admin/rx-ledger" className="text-[#FFB8DC] hover:text-white">
              Ledger →
            </Link>
            <Link href="/admin/rx-messages" className="text-[#FFB8DC] hover:text-white">
              Messages →
            </Link>
            <Link href="/admin/rx/clinic-sale" className="text-[#FFB8DC] hover:text-white">
              Clinic sale →
            </Link>
            <Link href="/admin/rx/clinic-reports" className="text-[#FFB8DC] hover:text-white">
              Clinic reports →
            </Link>
            <Link href="/admin/rx-invoices" className="text-[#FFB8DC] hover:text-white">
              Invoices →
            </Link>
            <Link href="/admin/rx/ops" className="text-[#FF2D8E] font-semibold hover:text-white">
              RX Ops Console →
            </Link>
            <Link href="/staff/protocols" className="text-emerald-300 font-semibold hover:text-white">
              Protocols &amp; Quick Tools →
            </Link>
            <Link href="/admin/rx/catalog" className="text-[#E6007E] font-semibold hover:text-white">
              RE GEN Catalog →
            </Link>
            <Link href="/admin/rx/regen-orders" className="text-[#FF2D8E] font-semibold hover:text-white">
              RE GEN Fulfillment →
            </Link>
            <Link href="/admin/rx/glp1-pricing" className="text-[#FFB8DC] hover:text-white">
              GLP-1 Pricing →
            </Link>
          </div>
        </div>

        {actionMsg && (
          <p className="mb-4 rounded-lg border border-[#E6007E]/40 bg-[#E6007E]/10 px-4 py-2 text-sm text-[#FFB8DC]">
            {actionMsg}
          </p>
        )}

        {(dueCounts.overdue > 0 || dueCounts.dueSoon > 0) && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="font-black text-amber-100">Clinic refills due</h2>
              <span className="text-xs text-amber-200/80">
                {dueCounts.overdue} overdue · {dueCounts.dueSoon} due within 7 days
              </span>
            </div>
            <div className="space-y-2">
              {dueRefills.slice(0, 8).map((d) => (
                <div
                  key={d.clientId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/20 px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-semibold">{d.clientName || "Client"}</span>
                    <span className="text-gray-400 ml-2">
                      {d.medication} {d.doseLabel} · {d.supplyCycle}
                    </span>
                    <span
                      className={`ml-2 text-[10px] font-bold uppercase ${
                        d.urgency === "overdue" ? "text-red-300" : "text-amber-200"
                      }`}
                    >
                      {d.urgency === "overdue"
                        ? `${Math.abs(d.daysUntilDue)}d overdue`
                        : `${d.daysUntilDue}d left`}
                    </span>
                  </div>
                  <Link
                    href={`/admin/rx/clinic-sale?client=${d.clientId}&refill=1`}
                    className="text-[#FFB8DC] font-bold text-xs hover:underline"
                  >
                    Refill →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500 py-12 text-center">Loading RX queue…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-500 py-12 text-center">No RX intakes yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-[10px] uppercase tracking-wider text-[#FFB8DC]">
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3">Track</th>
                  <th className="px-4 py-3">Pay</th>
                  <th className="px-4 py-3">Dispatch</th>
                  <th className="px-4 py-3">Msg</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{item.patientName}</p>
                      <p className="text-[11px] text-gray-500">{new Date(item.submittedAt).toLocaleString()}</p>
                      {item.kind === "clinic" && (
                        <span className="mt-1 inline-block rounded bg-[#E6007E]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FFB8DC]">
                          In-person
                        </span>
                      )}
                      {item.kind === "regen" && (
                        <span className="mt-1 inline-block rounded bg-[#FF2D8E]/30 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FFB8DC]">
                          RE GEN online
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{item.intakeRef || "—"}</td>
                    <td className="px-4 py-3 text-xs capitalize">{item.track}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${payBadge(item.paymentStatus)}`}>
                        {item.paymentStatus ?? "none"}
                        {item.paymentAmountUsd != null ? ` · $${item.paymentAmountUsd}` : ""}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs uppercase text-[#FFB8DC]">
                      {item.dispatchStatus}
                      {item.trackingNumber ? (
                        <span className="block text-[10px] text-gray-500 normal-case">
                          {item.trackingNumber}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {item.unreadMessages > 0 ? (
                        <span className="rounded-full bg-[#E6007E] px-2 py-0.5 text-[10px] font-bold">
                          {item.unreadMessages}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {item.kind === "clinic" ? (
                          <>
                            <Link
                              href={`/admin/rx/clinic-sale?encounter=${item.id}`}
                              className="text-[#FFB8DC] hover:underline"
                            >
                              Clinic sale
                            </Link>
                            {item.clientId && (
                              <Link
                                href={`/admin/clients/${item.clientId}?tab=rx`}
                                className="text-[#FFB8DC] hover:underline"
                              >
                                Client RX
                              </Link>
                            )}
                          </>
                        ) : item.kind === "regen" ? (
                          <>
                            <Link
                              href={`/admin/rx/regen-orders/${encodeURIComponent(item.intakeRef)}`}
                              className="text-[#FF2D8E] font-bold hover:underline"
                            >
                              Fulfill
                            </Link>
                            <Link
                              href={`/rx/checkout/intake?ref=${encodeURIComponent(item.intakeRef)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FFB8DC] hover:underline"
                            >
                              Intake
                            </Link>
                            <Link
                              href={`/rx/checkout/complete?ref=${encodeURIComponent(item.intakeRef)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FFB8DC] hover:underline"
                            >
                              Order status
                            </Link>
                            <a
                              href={`/portal/rx`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-white"
                            >
                              Patient portal
                            </a>
                          </>
                        ) : (
                          <>
                        <Link
                          href={`/admin/rx-dispatch?ref=${encodeURIComponent(item.intakeRef)}`}
                          className="text-[#FFB8DC] hover:underline"
                        >
                          Dispatch
                        </Link>
                        {item.paymentUrl && item.paymentStatus === "pending" && (
                          <button
                            type="button"
                            onClick={() => void copyPaymentUrl(item)}
                            className="text-[#FFB8DC] hover:underline"
                          >
                            Copy pay link
                          </button>
                        )}
                        {item.paymentStatus !== "paid" && (
                          <button
                            type="button"
                            disabled={busyId === item.submissionId}
                            onClick={() => void resendPayLink(item)}
                            className="text-[#FFB8DC] hover:underline disabled:opacity-50"
                          >
                            {busyId === item.submissionId ? "Sending…" : "Resend pay link"}
                          </button>
                        )}
                        <Link
                          href={`/admin/rx-invoices?ref=${encodeURIComponent(item.intakeRef)}&name=${encodeURIComponent(item.patientName)}&email=${encodeURIComponent(item.email || "")}&phone=${encodeURIComponent(item.phone || "")}`}
                          className="text-[#FFB8DC] hover:underline"
                        >
                          Invoice
                        </Link>
                        <Link href="/admin/rx-messages" className="text-[#FFB8DC] hover:underline">
                          Message
                        </Link>
                        <a
                          href={`/rx/status?ref=${encodeURIComponent(item.intakeRef)}&email=${encodeURIComponent(item.email || "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                        >
                          Patient view
                        </a>
                          </>
                        )}
                        {item.ledgerId && (
                          <Link href="/admin/rx-ledger" className="text-gray-400 hover:text-white">
                            Ledger
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
