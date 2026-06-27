"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { RxPatientStatus } from "@/lib/rx-patient-status";
import { rxStatusHref, rxStatusQuickLinks } from "@/lib/rx-patient-status";

type Props = {
  initialRef?: string;
  initialEmail?: string;
  compact?: boolean;
};

export function RxPatientStatusCard({ initialRef = "", initialEmail = "", compact = false }: Props) {
  const [intakeRef, setIntakeRef] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [unlocked, setUnlocked] = useState(Boolean(initialRef && initialEmail));
  const [status, setStatus] = useState<RxPatientStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked || !intakeRef.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    fetch(
      `/api/rx/status?ref=${encodeURIComponent(intakeRef)}&email=${encodeURIComponent(email)}`,
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Could not load status");
        setStatus(data.status);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load status"))
      .finally(() => setLoading(false));
  }, [unlocked, intakeRef, email]);

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!intakeRef.trim() || !email.trim()) {
      setError("Enter your reference code and email");
      return;
    }
    setUnlocked(true);
  }

  if (!unlocked) {
    return (
      <form onSubmit={unlock} className={compact ? "space-y-3" : "rounded-2xl border-2 border-black bg-white p-6 space-y-4"}>
        {!compact && (
          <>
            <h2 className="font-serif text-xl font-bold text-black">Track your RX refill</h2>
            <p className="text-sm text-black/65 leading-relaxed">
              See where you are: intake, telehealth, payment, pharmacy approval, and shipping.
            </p>
          </>
        )}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black/55">
            Reference code
          </label>
          <input
            value={intakeRef}
            onChange={(e) => setIntakeRef(e.target.value.toUpperCase())}
            placeholder="From your confirmation"
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E6007E]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-black/55">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-4 py-3 text-sm outline-none focus:border-[#E6007E]"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-xl bg-[#E6007E] px-4 py-3 text-sm font-bold text-white hover:bg-black transition-colors"
        >
          View status
        </button>
      </form>
    );
  }

  const links = rxStatusQuickLinks(intakeRef, email);

  return (
    <div className={compact ? "space-y-3" : "rounded-2xl border-2 border-black bg-white overflow-hidden shadow-[6px_6px_0_0_rgba(230,0,126,0.25)]"}>
      {!compact && (
        <div className="border-b border-black/10 bg-[#FFF0F7] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6007E]">Your RX status</p>
          <p className="mt-1 text-sm font-semibold text-black">
            Ref {intakeRef.toUpperCase()}
            {status?.patientName ? ` · ${status.patientName}` : ""}
          </p>
          {status?.supplyCycle && (
            <p className="text-xs text-black/55 mt-1">Supply: {status.supplyCycle}</p>
          )}
        </div>
      )}

      {loading && <p className="p-4 text-sm text-black/50">Loading your journey…</p>}
      {error && <p className="p-4 text-sm text-red-600">{error}</p>}

      {status && !loading && (
        <ol className="p-4 space-y-3">
          {status.steps.map((step) => (
            <li
              key={step.id}
              className={`rounded-xl border-2 px-4 py-3 ${
                step.status === "complete"
                  ? "border-green-600/30 bg-green-50"
                  : step.status === "action_needed"
                    ? "border-[#E6007E]/40 bg-[#FFF0F7]"
                    : "border-black/10 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-black">{step.label}</p>
                  <p className="text-xs text-black/60 mt-1 leading-relaxed">{step.detail}</p>
                </div>
                <span className="text-lg shrink-0" aria-hidden="true">
                  {step.status === "complete" ? "✓" : step.status === "action_needed" ? "→" : "…"}
                </span>
              </div>
              {step.href && step.status !== "complete" && (
                <a
                  href={step.href}
                  target={step.external ? "_blank" : undefined}
                  rel={step.external ? "noopener noreferrer" : undefined}
                  className="mt-2 inline-block text-xs font-bold text-[#E6007E] underline"
                >
                  {step.external ? "Open link →" : "Continue →"}
                </a>
              )}
            </li>
          ))}
        </ol>
      )}

      <div className="border-t border-black/10 p-4 flex flex-wrap gap-2">
        <Link
          href={links.messages}
          className="rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold hover:border-[#E6007E]"
        >
          Secure message
        </Link>
        <Link
          href={rxStatusHref(intakeRef, email)}
          className="rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold hover:border-[#E6007E]"
        >
          Full status page
        </Link>
        <Link
          href={links.careHub}
          className="rounded-full border-2 border-black px-3 py-1.5 text-xs font-bold hover:border-[#E6007E]"
        >
          RX care hub
        </Link>
      </div>
    </div>
  );
}

export default RxPatientStatusCard;
