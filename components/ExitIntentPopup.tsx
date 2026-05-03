"use client";

import { useEffect, useState, useCallback } from "react";
import { trackEvent } from "@/lib/analytics-events";

const STORAGE_KEY = "hg_exit_intent_dismissed";
const COOLDOWN_DAYS = 14;

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const { at } = JSON.parse(raw);
    const elapsed = Date.now() - at;
    return elapsed > COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return true;
  }
}

function dismiss() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ at: Date.now() }));
  } catch {}
}

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;
    
    const path = window.location.pathname || "";
    if (
      path.startsWith("/admin") ||
      path.startsWith("/portal") ||
      path.startsWith("/login") ||
      path.startsWith("/book") ||
      path.startsWith("/subscribe") ||
      path.startsWith("/contact")
    ) {
      return;
    }
    
    if (!shouldShow()) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered) return;
      if (e.clientY <= 0 && e.relatedTarget === null) {
        triggered = true;
        setVisible(true);
        trackEvent("exit_intent_shown");
      }
    };

    const handleTouchEnd = () => {
      if (triggered) return;
      if (window.scrollY === 0) {
        triggered = true;
        setTimeout(() => {
          if (!triggered) return;
          setVisible(true);
          trackEvent("exit_intent_shown");
        }, 500);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mounted]);

  const handleClose = useCallback(() => {
    dismiss();
    setVisible(false);
    trackEvent("exit_intent_closed", { converted: status === "success" });
  }, [status]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");
      setStatus("loading");

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            phone: phone.trim() || undefined,
            source: "exit_intent",
            marketing_opt_in: true,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMsg(data?.error || "Something went wrong. Please try again.");
          return;
        }

        setStatus("success");
        trackEvent("exit_intent_converted", { email: email.trim() });
        dismiss();

        setTimeout(() => {
          setVisible(false);
        }, 3000);
      } catch {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    },
    [email, phone]
  );

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Special offer before you go"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] px-6 py-8 text-center">
          <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
            Wait! Before you go...
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white">
            Get $25 Off Your First Visit
          </h3>
          <p className="mt-2 text-white/90 text-sm">
            Plus exclusive offers & treatment tips delivered to your inbox
          </p>
        </div>

        {/* Form body */}
        <div className="bg-white p-6">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-black mb-2">You're in!</h4>
              <p className="text-black/70">
                Check your email for your $25 welcome offer.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="exit-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="exit-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border-2 border-black/10 px-4 py-3.5 text-black placeholder:text-black/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="exit-phone" className="sr-only">
                  Phone number (optional)
                </label>
                <input
                  id="exit-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone (optional, for SMS deals)"
                  className="w-full rounded-xl border-2 border-black/10 px-4 py-3.5 text-black placeholder:text-black/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20 transition-colors"
                />
              </div>
              {errorMsg && (
                <p className="text-red-600 text-sm">{errorMsg}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] text-white font-bold py-4 text-lg hover:from-[#E6007E] hover:to-[#9b0a4d] disabled:opacity-70 transition-all duration-200 shadow-lg shadow-[#FF2D8E]/25"
              >
                {status === "loading" ? "Claiming..." : "Claim My $25 Off"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="w-full text-center text-sm text-black/50 hover:text-black/70 py-2"
              >
                No thanks, I'll pay full price
              </button>
            </form>
          )}
          <p className="mt-4 text-[10px] text-black/50 text-center leading-tight">
            By signing up you agree to receive marketing messages. Unsubscribe anytime. 
            We respect your privacy.
          </p>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
