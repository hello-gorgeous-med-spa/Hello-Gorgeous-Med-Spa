"use client";

import React, { useCallback, useState } from "react";

export type LeadGateSource = "face_blueprint" | "journey" | "hormone" | "lip_studio";

const STORAGE_PREFIX = "hg.lead.";

function getStoredUnlock(source: LeadGateSource): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(STORAGE_PREFIX + source) === "1";
  } catch {
    return false;
  }
}

function setStoredUnlock(source: LeadGateSource): void {
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + source, "1");
  } catch {
    // ignore
  }
}

export interface LeadGateProps {
  source: LeadGateSource;
  featureName: string;
  onUnlock: () => void;
  children?: React.ReactNode;
  /** If true, gate is skipped (e.g. already unlocked from storage) */
  unlocked?: boolean;
  /** Shown so visitors see what they get before clicking Start now */
  features?: string[];
  /** Hero line (e.g. "See your aesthetic potential") */
  heroTitle?: string;
  /** Subline under heroTitle */
  heroSubtitle?: string;
}

const FEATURE_HEADLINES: Record<LeadGateSource, string> = {
  face_blueprint: "Get your free Face Blueprint™",
  journey: "Get your personalized HG Roadmap™",
  hormone: "Get your Harmony AI™ hormone blueprint",
  lip_studio: "Try our Lip Enhancement Studio™",
};

export function LeadGate({
  source,
  featureName,
  onUnlock,
  children,
  unlocked,
  features,
  heroTitle,
  heroSubtitle,
}: LeadGateProps) {
  const [stored] = useState(() => getStoredUnlock(source));
  const [unlockedLocal, setUnlockedLocal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const isUnlocked = unlocked || stored || unlockedLocal;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setStatus("loading");
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            phone: phone.trim(),
            source,
            marketing_opt_in: optIn,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setError(data?.error || "Something went wrong. Please try again.");
          return;
        }
        setStoredUnlock(source);
        setUnlockedLocal(true);
        onUnlock();
      } catch {
        setStatus("error");
        setError("Network error. Please try again.");
      }
    },
    [source, email, phone, optIn, onUnlock]
  );

  if (isUnlocked && children) {
    return <>{children}</>;
  }

  if (isUnlocked) {
    return null;
  }

  const headline = FEATURE_HEADLINES[source] || featureName;

  return (
    <>
      {/* Full page visible but non-interactive and slightly dimmed */}
      <div className="relative min-h-screen bg-white">
        <div
          className="min-h-screen bg-white transition-opacity duration-300 pointer-events-none"
          style={{ opacity: 0.5 }}
          aria-hidden="true"
        >
          {children}
        </div>
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Overlay: branded section with Start now → email form */}
      <div
        className="fixed inset-0 z-20 flex items-center justify-center px-4 py-8 overflow-y-auto bg-black/40"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-gate-title"
      >
        <div
          className="relative w-full max-w-lg rounded-2xl border border-black/10 bg-white shadow-xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {!showForm ? (
            /* Step 1: Hero + features + Start now */
            <div className="p-8 md:p-10">
              <p className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider mb-2">
                {featureName}
              </p>
              {(heroTitle || heroSubtitle) && (
                <div className="mb-6">
                  {heroTitle && (
                    <h1
                      id="lead-gate-title"
                      className="text-2xl md:text-3xl font-bold text-black leading-tight"
                    >
                      {heroTitle}
                    </h1>
                  )}
                  {heroSubtitle && (
                    <p className="mt-2 text-black/80 text-base">
                      {heroSubtitle}
                    </p>
                  )}
                </div>
              )}
              {!heroTitle && !heroSubtitle && (
                <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
                  {headline}
                </h2>
              )}
              {features && features.length > 0 && (
                <ul className="space-y-2 text-sm text-black/80 mb-8">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FF2D8E] shrink-0 mt-0.5">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full rounded-xl bg-[#FF2D8E] text-white font-semibold py-4 px-6 text-lg hover:bg-[#E6007E] transition-colors"
              >
                Start now
              </button>
            </div>
          ) : (
            /* Step 2: Email capture in same branding */
            <div className="p-8 md:p-10">
              <p className="text-[#FF2D8E] text-sm font-semibold uppercase tracking-wider mb-2">
                {featureName}
              </p>
              <h2 className="text-xl font-bold text-black mb-1">
                Almost there
              </h2>
              <p className="text-black/70 text-sm mb-6">
                Enter your details to continue. We&apos;ll send tips and updates—no spam.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="lead-email"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Email *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    Phone *
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="w-full rounded-xl border-2 border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20"
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={optIn}
                    onChange={(e) => setOptIn(e.target.checked)}
                    className="mt-1 rounded border-black/30 text-[#FF2D8E] focus:ring-[#FF2D8E]"
                  />
                  <span className="text-sm text-black/80">
                    I agree to receive updates, tips, and special offers from Hello Gorgeous Med Spa by email and optional SMS. I can unsubscribe at any time.
                  </span>
                </label>
                {error && (
                  <p className="text-[#FF2D8E] text-sm">{error}</p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 rounded-xl border-2 border-black/20 text-black font-semibold py-3 px-4 hover:bg-black/5 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex-1 rounded-xl bg-[#FF2D8E] text-white font-semibold py-3 px-4 hover:bg-[#E6007E] disabled:opacity-70 transition-colors"
                  >
                    {status === "loading" ? "Continuing…" : "Continue"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
