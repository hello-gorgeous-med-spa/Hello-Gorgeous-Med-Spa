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
  /** Shown above the form when gated so visitors see what they get before entering email */
  features?: string[];
  /** Optional hero line shown above the gate card when gated (e.g. "See your aesthetic potential") */
  heroTitle?: string;
  /** Optional subline under heroTitle */
  heroSubtitle?: string;
}

const FEATURE_HEADLINES: Record<LeadGateSource, string> = {
  face_blueprint: "Get your free Face Blueprint™",
  journey: "Get your personalized HG Roadmap™",
  hormone: "Get your Harmony AI™ hormone blueprint",
  lip_studio: "Try our Lip Enhancement Studio™",
};

export function LeadGate({ source, featureName, onUnlock, children, unlocked, features, heroTitle, heroSubtitle }: LeadGateProps) {
  const [stored] = useState(() => getStoredUnlock(source));
  const [unlockedLocal, setUnlockedLocal] = useState(false);
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
    <div className="min-h-screen bg-white">
      {(heroTitle || heroSubtitle) && (
        <section className="bg-white py-10 md:py-14 border-b border-black/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            {heroTitle && (
              <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
                {heroTitle}
              </h1>
            )}
            {heroSubtitle && (
              <p className="mt-3 text-black/80 text-lg max-w-xl mx-auto">
                {heroSubtitle}
              </p>
            )}
          </div>
        </section>
      )}
      <div className="min-h-[30vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="rounded-2xl border border-[#FF2D8D]/20 bg-white p-8 shadow-sm">
          <p className="text-[#FF2D8D] text-sm font-semibold uppercase tracking-wider mb-2">
            {featureName}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-black mb-2">
            {headline}
          </h2>
          <p className="text-black/70 text-sm mb-6">
            Enter your email and phone and opt in below to continue. We&apos;ll send you tips, updates, and special offers—no spam.
          </p>
          {features && features.length > 0 && (
            <div className="mb-6 rounded-xl bg-pink-50/50 border border-[#FF2D8D]/10 p-4">
              <h3 className="text-sm font-semibold text-black mb-2">What you&apos;ll get</h3>
              <ul className="space-y-1.5 text-sm text-black/80">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#FF2D8D] mt-0.5 shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="lead-email" className="block text-sm font-medium text-black mb-1">
                Email *
              </label>
              <input
                id="lead-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:border-[#FF2D8D] focus:ring-1 focus:ring-[#FF2D8D]"
              />
            </div>
            <div>
              <label htmlFor="lead-phone" className="block text-sm font-medium text-black mb-1">
                Phone *
              </label>
              <input
                id="lead-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full rounded-lg border border-black/20 px-4 py-3 text-black placeholder:text-black/40 focus:border-[#FF2D8D] focus:ring-1 focus:ring-[#FF2D8D]"
              />
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="mt-1 rounded border-black/30 text-[#FF2D8D] focus:ring-[#FF2D8D]"
              />
              <span className="text-sm text-black/80">
                I agree to receive updates, tips, and special offers from Hello Gorgeous Med Spa by email and optional SMS. I can unsubscribe at any time.
              </span>
            </label>
            {error && (
              <p className="text-[#FF2D8D] text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-[#FF2D8D] text-white font-semibold py-3 px-4 hover:opacity-90 disabled:opacity-70 transition-opacity"
            >
              {status === "loading" ? "Continuing…" : "Continue"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
