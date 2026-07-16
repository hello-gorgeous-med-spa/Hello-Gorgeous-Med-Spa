"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { rememberRegenOrderRef } from "@/lib/client-app-regen-orders";
import { HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import type { RegenPublicOrderStatus } from "@/lib/regen/order-status-public";

function formatVisitDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type Props = {
  orderRef: string;
  variant?: "app" | "checkout";
  pollMs?: number;
};

export function RegenOrderTrackerCard({ orderRef, variant = "app", pollMs = 0 }: Props) {
  const [order, setOrder] = useState<RegenPublicOrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/regen/order-status?ref=${encodeURIComponent(orderRef)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not load order status");
        return;
      }
      setOrder(data.order ?? null);
      setErr(null);
    } catch {
      setErr("Network error loading order status");
    } finally {
      setLoading(false);
    }
  }, [orderRef]);

  useEffect(() => {
    rememberRegenOrderRef(orderRef);
    void refresh();
  }, [orderRef, refresh]);

  useEffect(() => {
    if (!pollMs || pollMs <= 0) return;
    const id = window.setInterval(() => void refresh(), pollMs);
    return () => window.clearInterval(id);
  }, [pollMs, refresh]);

  const isApp = variant === "app";
  const cardClass = isApp
    ? "rounded-2xl p-4 backdrop-blur-sm"
    : "rounded-2xl border-2 border-black bg-white p-5 text-left shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]";

  if (loading) {
    return (
      <div className={cardClass} style={isApp ? { backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } : undefined}>
        <p className={isApp ? "text-sm text-white/50" : "text-sm text-black/50"}>Loading order {orderRef}…</p>
      </div>
    );
  }

  if (err || !order) {
    return (
      <div className={cardClass} style={isApp ? { backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" } : undefined}>
        <p className={isApp ? "text-sm text-red-300" : "text-sm text-red-600"}>{err || "Order not found"}</p>
      </div>
    );
  }

  const visit = order.telehealthVisit;

  return (
    <div
      className={cardClass}
      style={
        isApp
          ? {
              background: "linear-gradient(135deg, rgba(230,0,126,0.18), rgba(255,45,142,0.08))",
              border: "2px solid rgba(230,0,126,0.4)",
            }
          : undefined
      }
    >
      <p className={`text-[10px] font-bold uppercase tracking-widest ${isApp ? "text-[#FFB8DC]" : "text-[#E6007E]"}`}>
        RE GEN order · {order.reference}
      </p>
      <p className={`mt-1 font-bold ${isApp ? "text-white" : "text-black"}`}>{order.title}</p>

      {visit && !order.telehealthCompletedAt ? (
        <div
          className={`mt-4 rounded-xl px-4 py-3 ${isApp ? "bg-black/30 border border-white/10" : "bg-[#FFF0F7] border border-[#E6007E]/25"}`}
        >
          <p className={`text-[10px] uppercase tracking-wider ${isApp ? "text-emerald-300" : "text-emerald-700"}`}>
            Telehealth scheduled
          </p>
          <p className={`mt-1 font-semibold ${isApp ? "text-white" : "text-black"}`}>
            {visit.serviceName}
          </p>
          <p className={`mt-0.5 text-sm ${isApp ? "text-white/70" : "text-black/65"}`}>
            {formatVisitDate(visit.startsAt)}
            {visit.providerName ? ` · ${visit.providerName}` : ""}
          </p>
          <p className={`mt-2 text-xs leading-relaxed ${isApp ? "text-white/55" : "text-black/55"}`}>
            Your video link is in your <strong>Fresha confirmation email</strong> — no Charm account needed.
            Add this visit to your calendar from that email.
          </p>
        </div>
      ) : order.telehealthRequired && order.intakeComplete && !order.telehealthCompletedAt ? (
        <div className={`mt-4 text-sm ${isApp ? "text-white/65" : "text-black/65"}`}>
          Book NP telehealth on Fresha to finish your order. Mention order ref{" "}
          <span className="font-mono font-bold">{order.reference}</span> in the notes.
        </div>
      ) : null}

      {order.nextAction ? (
        order.nextAction.external ? (
          <a
            href={order.nextAction.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 ${isApp ? "" : "bg-[#E6007E] hover:bg-black"}`}
            style={isApp ? { background: "linear-gradient(90deg, #FF2D8E, #E6007E)" } : undefined}
          >
            {order.nextAction.label} →
          </a>
        ) : (
          <Link
            href={order.nextAction.href}
            className={`mt-4 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 ${isApp ? "" : "bg-[#E6007E] hover:bg-black"}`}
            style={isApp ? { background: "linear-gradient(90deg, #FF2D8E, #E6007E)" } : undefined}
          >
            {order.nextAction.label} →
          </Link>
        )
      ) : null}

      {!visit && order.intakeComplete && order.telehealthRequired && !order.telehealthCompletedAt ? (
        <a
          href={HG_RX_TELEHEALTH_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 block text-center text-xs font-semibold underline ${isApp ? "text-[#FFB8DC]" : "text-[#E6007E]"}`}
        >
          Open Square telehealth booking
        </a>
      ) : null}
    </div>
  );
}
