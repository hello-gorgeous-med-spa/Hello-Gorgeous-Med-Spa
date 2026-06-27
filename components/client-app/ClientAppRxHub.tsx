"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  HG_RX_TELEHEALTH_BOOKING_LABEL,
  GLP1_REFILL_PATH,
  HELLO_GORGEOUS_RX_START_PATH,
  HG_RX_TELEHEALTH_BOOKING_URL,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { HELLO_GORGEOUS_RX, RX_RECURRING_JOURNEY } from "@/lib/hello-gorgeous-rx";
import {
  getStoredRxRecords,
  recordsToSummaries,
  removePeptideRxRecord,
  type RxRecordSummary,
  type StoredRxRecord,
} from "@/lib/peptide-rx-records";
import {
  isConsultPaid,
  markConsultPaid,
  startConsultCheckout,
} from "@/lib/peptide-rx-consult-pay";
import { PEPTIDE_CONSULT_FEE_USD, PEPTIDE_CONSULT_PAY_NOTE } from "@/lib/peptide-request-menu";
import {
  TRIFECTA_GLASS,
  trifectaAccent,
  trifectaButtonGradient,
} from "@/lib/trifecta-tokens";

type Props = {
  onClose: () => void;
};

export function ClientAppRxHub({ onClose }: Props) {
  const accent = trifectaAccent(1);
  const [records, setRecords] = useState<RxRecordSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [payBusyRef, setPayBusyRef] = useState<string | null>(null);
  const [payErr, setPayErr] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const stored = getStoredRxRecords();
    if (stored.length === 0) {
      setRecords([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/peptide-request/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokens: stored.map((r) => r.recordToken) }),
      });
      const data = await res.json().catch(() => ({}));
      const remote = (data.records ?? []) as Array<{
        recordToken: string;
        reference: string;
        submittedAt: string;
        requestType: "new" | "refill";
        peptideNames: string[];
        qualified: boolean;
      }>;

      const merged: StoredRxRecord[] = stored.map((local) => {
        const match = remote.find((r) => r.recordToken === local.recordToken);
        if (!match) return local;
        return {
          ...local,
          reference: match.reference || local.reference,
          submittedAt: match.submittedAt || local.submittedAt,
          requestType: match.requestType,
          peptideNames: match.peptideNames.length ? match.peptideNames : local.peptideNames,
          qualified: match.qualified,
        };
      });

      setRecords(recordsToSummaries(merged));
    } catch {
      setRecords(recordsToSummaries(stored));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "1") {
      const ref = params.get("ref")?.trim();
      if (ref) markConsultPaid(ref);
    }
  }, [refresh]);

  async function payConsult(reference: string) {
    setPayErr(null);
    setPayBusyRef(reference);
    const outcome = await startConsultCheckout(reference, "app");
    if (outcome.error) {
      setPayErr(outcome.error);
      setPayBusyRef(null);
    }
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between gap-3 pt-2">
        <button type="button" onClick={onClose} className="text-sm font-semibold text-white/55">
          ← Back
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent.subtitle }}>
          {HELLO_GORGEOUS_RX.name}
        </span>
      </div>

      <div className="rounded-2xl p-5" style={{ ...glass(accent), border: `1px solid ${accent.border}` }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: accent.subtitle }}>
          Your peptide program
        </p>
        <h1 className="text-2xl font-black text-white">Hello Gorgeous RX</h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          Start a protocol, request refills, and keep your submission history — all in one place.
          New protocols: pre-pay ${PEPTIDE_CONSULT_FEE_USD} via Square, then book Fresha telehealth with{" "}
          {HELLO_GORGEOUS_RX.providerName}.
        </p>
      </div>

      <Link
        href={RX_PATIENT_CARE_PATH}
        className="block rounded-2xl p-4 text-center font-bold text-white transition active:scale-[0.99]"
        style={{ background: "rgba(255,255,255,0.08)", border: `2px solid ${accent.border}` }}
      >
        💊 Patient Care Hub — refills, add-ons &amp; guides
      </Link>

      <div className="grid grid-cols-2 gap-2">
        <Link
          href={GLP1_REFILL_PATH}
          className="rounded-xl py-3 text-center text-sm font-semibold text-white"
          style={{ background: trifectaButtonGradient(accent) }}
        >
          Renew GLP-1
        </Link>
        <Link
          href={`${PEPTIDE_REQUEST_PATH}?type=refill`}
          className="rounded-xl py-3 text-center text-sm font-semibold text-white"
          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${accent.border}` }}
        >
          Peptide refill
        </Link>
      </div>

      <Link
        href={HELLO_GORGEOUS_RX_START_PATH}
        className="block rounded-2xl p-5 text-center font-bold text-white transition active:scale-[0.99]"
        style={{ background: trifectaButtonGradient(accent) }}
      >
        ✨ Start Here — pick your peptide
      </Link>

      <div className="grid grid-cols-1 gap-2">
        <a
          href={HG_RX_TELEHEALTH_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl py-3 text-center text-sm font-semibold"
          style={{ border: `1px solid ${accent.border}`, color: accent.subtitle }}
        >
          {HG_RX_TELEHEALTH_BOOKING_LABEL} →
        </a>
      </div>

      <section>
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          My RX records
        </h2>
        <div className="rounded-2xl overflow-hidden" style={{ background: TRIFECTA_GLASS.bg, border: `1px solid ${accent.border}` }}>
          {loading ? (
            <p className="p-4 text-sm text-white/50">Loading your records…</p>
          ) : records.length === 0 ? (
            <div className="p-4 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
              <p>No requests saved yet.</p>
              <p className="mt-2 text-xs">
                After you submit a peptide request, your reference appears here automatically on this device.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {records.map((r) => {
                const needsPay = r.requestType === "new" && r.qualified && !isConsultPaid(r.reference);
                const canBook = r.qualified && (r.requestType === "refill" || isConsultPaid(r.reference));
                return (
                <li key={r.recordToken} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white">
                        {r.peptideNames.join(", ") || "Peptide request"}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: accent.subtitle }}>
                        {r.requestType === "refill" ? "Refill" : "New protocol"} · Ref {r.reference}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                        {formatDate(r.submittedAt)} · {r.statusLabel}
                      </p>
                      {needsPay && (
                        <button
                          type="button"
                          disabled={payBusyRef === r.reference}
                          onClick={() => void payConsult(r.reference)}
                          className="mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-white disabled:opacity-60"
                          style={{ background: trifectaButtonGradient(accent) }}
                        >
                          {payBusyRef === r.reference
                            ? "Starting checkout…"
                            : `Pay $${PEPTIDE_CONSULT_FEE_USD} & book telehealth`}
                        </button>
                      )}
                      {canBook && (
                        <a
                          href={HG_RX_TELEHEALTH_BOOKING_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 block w-full rounded-xl py-2.5 text-center text-sm font-semibold"
                          style={{ border: `1px solid ${accent.border}`, color: accent.subtitle }}
                        >
                          {HG_RX_TELEHEALTH_BOOKING_LABEL} →
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removePeptideRxRecord(r.recordToken);
                        void refresh();
                      }}
                      className="text-[10px] text-white/30 underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );})}
            </ul>
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setShowHowItWorks((v) => !v)}
        className="w-full rounded-xl py-3 text-left px-4 text-sm font-semibold text-white flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        How Hello Gorgeous RX works
        <span style={{ color: accent.subtitle }}>{showHowItWorks ? "⌃" : "⌄"}</span>
      </button>

      {showHowItWorks && (
        <ol className="space-y-3 pl-1">
          {RX_RECURRING_JOURNEY.map((j) => (
            <li key={j.id} className="flex gap-3 text-sm">
              <span>{j.icon}</span>
              <div>
                <p className="font-semibold text-white">{j.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {j.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <p className="text-[11px] text-center leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
        {PEPTIDE_CONSULT_PAY_NOTE}
      </p>
    </div>
  );
}

function glass(accent: ReturnType<typeof trifectaAccent>) {
  return {
    backgroundColor: TRIFECTA_GLASS.bg,
    border: `1px solid ${accent.border}`,
  } as const;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}
