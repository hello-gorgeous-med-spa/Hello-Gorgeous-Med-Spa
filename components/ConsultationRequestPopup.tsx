"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/components/GoogleAnalytics";
import { BOOKING_URL } from "@/lib/flows";

const STORAGE_KEY = "hg_consult_popup_dismissed";
const SHOW_AFTER_MS = 4000;
const SCROLL_THRESHOLD = 0.35;
const COOKIE_DAYS = 7;

const AREA_OPTIONS = [
  { value: "", label: "What are you interested in?" },
  { value: "injectables", label: "Botox & Fillers" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "skin", label: "Skin & Facials" },
  { value: "hormones", label: "Hormones & Energy" },
  { value: "iv-therapy", label: "IV Therapy" },
  { value: "exploring", label: "Just exploring" },
];

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const { at } = JSON.parse(raw);
    const elapsed = Date.now() - at;
    return elapsed > COOKIE_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() }));
  } catch {}
}

export function ConsultationRequestPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [patientType, setPatientType] = useState<"new" | "existing">("new");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    const path = window.location.pathname || "";
    if (path.startsWith("/admin") || path.startsWith("/portal") || path.startsWith("/login")) {
      return;
    }
    if (!shouldShow()) return;

    let shown = false;
    const tryShow = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    const t = setTimeout(tryShow, SHOW_AFTER_MS);

    const onScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (scrollPct >= SCROLL_THRESHOLD) tryShow();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted]);

  const handleClose = () => {
    dismiss();
    setVisible(false);
  };

  const handleBookClick = () => {
    trackEvent("popup_cta", { action: "book", patientType, area });
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          source: "popup-consult",
          concern: area || undefined,
          patientType: patientType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      trackEvent("popup_cta", { action: "form_submit", patientType, area });
      setStatus("success");
      setTimeout(() => handleClose(), 2500);
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:p-6 sm:items-center"
      role="dialog"
      aria-label="How can we help you?"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl border-2 border-pink-500/30 bg-gradient-to-b from-gray-900 to-black p-6 shadow-2xl shadow-pink-500/10">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-400 hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center mb-4">
              <span className="text-4xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-white">We&apos;ll be in touch!</h3>
            <p className="mt-2 text-gray-300 text-sm">
              A team member will reach out soon to help with your consultation.
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white">
              How can we help you?
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Request a consultation or book online.
            </p>

            {/* Patient type */}
            <div className="mt-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">I am</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPatientType("new")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border-2 transition-colors ${
                    patientType === "new"
                      ? "border-pink-500 bg-pink-500/10 text-pink-400"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  New patient
                </button>
                <button
                  type="button"
                  onClick={() => setPatientType("existing")}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border-2 transition-colors ${
                    patientType === "existing"
                      ? "border-pink-500 bg-pink-500/10 text-pink-400"
                      : "border-gray-600 text-gray-400 hover:border-gray-500"
                  }`}
                >
                  Existing patient
                </button>
              </div>
            </div>

            {/* Area of interest */}
            <div className="mt-4">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white focus:outline-none focus:border-pink-500 text-sm"
              >
                {AREA_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-gray-900">
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {!showForm ? (
              /* Primary CTAs */
              <div className="mt-6 space-y-3">
                <Link
                  href={BOOKING_URL}
                  onClick={handleBookClick}
                  className="block w-full py-3.5 px-4 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-center text-sm uppercase tracking-wider transition-colors"
                >
                  Book a consultation
                </Link>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="block w-full py-3 px-4 rounded-lg border-2 border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white font-medium text-sm transition-colors"
                >
                  Not ready? Tell us what you&apos;re interested in
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="block w-full text-center text-sm text-gray-500 hover:text-gray-300"
                >
                  No thanks
                </button>
              </div>
            ) : (
              /* Expanded form */
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 text-sm"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email *"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 text-sm"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional)"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500 text-sm"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3.5 px-4 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold text-sm disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Request consultation"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="block w-full text-center text-sm text-gray-500 hover:text-gray-300"
                >
                  ← Back
                </button>
                {status === "error" && (
                  <p className="text-center text-red-400 text-sm">
                    Something went wrong. Please try again or call us.
                  </p>
                )}
              </form>
            )}

            <p className="mt-5 text-[10px] text-gray-500 leading-tight">
              By submitting you agree to receive marketing. Reply STOP to opt out.{" "}
              <Link href="/privacy" className="underline hover:text-gray-400">
                Privacy
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
