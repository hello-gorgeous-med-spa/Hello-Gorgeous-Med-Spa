"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/components/GoogleAnalytics";
import { usePathname } from "next/navigation";

const CONCERN_OPTIONS = [
  { value: "", label: "What brings you here? (optional)" },
  { value: "botox-fillers", label: "Botox / Fillers" },
  { value: "weight-loss", label: "Weight Loss" },
  { value: "hormones", label: "Hormones / Energy" },
  { value: "skin", label: "Skin / Facials" },
  { value: "just-looking", label: "Just browsing" },
];
const TIMEFRAME_OPTIONS = [
  { value: "", label: "When? (optional)" },
  { value: "asap", label: "ASAP" },
  { value: "2-4-weeks", label: "2-4 weeks" },
  { value: "1-3-months", label: "1-3 months" },
  { value: "researching", label: "Just researching" },
];

export function EmailCapture() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [concern, setConcern] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasShown, setHasShown] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin') || 
                       pathname?.startsWith('/login') || 
                       pathname?.startsWith('/portal') ||
                       pathname?.startsWith('/pos') ||
                       pathname?.startsWith('/provider');

  useEffect(() => {
    if (isAdminRoute) return;

    const dismissed = sessionStorage.getItem("email-popup-dismissed");
    const subscribed = localStorage.getItem("email-subscribed");
    
    if (dismissed || subscribed) {
      setHasShown(true);
      return;
    }

    const tryShow = () => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    const timer = setTimeout(tryShow, 6000);

    const onScroll = () => {
      const scrollPct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);
      if (scrollPct >= 0.4) tryShow();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasShown, isAdminRoute]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("email-popup-dismissed", "true");
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
          source: "popup-10off",
          concern: concern || undefined,
          timeframe: timeframe || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      trackEvent("subscribe", { source: "popup-10off" });
      localStorage.setItem("email-subscribed", email);
      setStatus("success");
      
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch {
      setStatus("error");
    }
  };

  if (isAdminRoute) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div 
        className="relative w-full max-w-lg bg-white border-2 border-black rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#FF2D8E] transition z-10"
        >
          ✕
        </button>

        <div className="p-8 md:p-10">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FF2D8E] flex items-center justify-center mb-6">
                <span className="text-4xl text-white">✓</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">You&apos;re In!</h3>
              <p>Check your inbox for your exclusive 10% off code.</p>
              <p className="text-[#FF2D8E] font-bold mt-4">Welcome to Hello Gorgeous! 💕</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <span className="inline-block px-4 py-2 rounded-full border-2 border-[#FF2D8E] text-[#FF2D8E] font-bold text-sm mb-4">
                  EXCLUSIVE OFFER
                </span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-3">
                  Get <span className="text-[#FF2D8E]">10% Off</span>
                </h3>
                <p className="text-lg">Your first treatment when you join our VIP list</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-5 py-4 rounded-xl border-2 border-black text-black placeholder:text-black/50 focus:outline-none focus:border-[#FF2D8E] text-center text-lg"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={concern}
                    onChange={(e) => setConcern(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-black text-black focus:outline-none focus:border-[#FF2D8E] text-sm"
                  >
                    {CONCERN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-4 py-3 rounded-xl border-2 border-black text-black focus:outline-none focus:border-[#FF2D8E] text-sm"
                  >
                    {TIMEFRAME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full text-lg"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    "Claim My 10% Off"
                  )}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-4 text-center text-[#FF2D8E] font-bold text-sm">
                  Oops! Something went wrong. Please try again.
                </p>
              )}

              <div className="mt-8 space-y-3">
                <p className="text-center text-sm font-bold">VIP members also get:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 rounded-full border-2 border-black text-sm">
                    ✨ Early access
                  </span>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-sm">
                    🎁 Birthday rewards
                  </span>
                  <span className="px-3 py-1 rounded-full border-2 border-black text-sm">
                    💌 Exclusive tips
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full mt-6 text-black/50 text-sm hover:text-[#FF2D8E] transition"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Hot Pink CTA Strip Banner for homepage
export function EmailBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;

    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(),
          source: "homepage-banner" 
        }),
      });
      localStorage.setItem("email-subscribed", email);
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <section className="section-pink py-12">
        <div className="container text-center">
          <p className="font-bold text-xl">
            ✓ You&apos;re on the list! Check your email for your 10% off code.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-pink py-12">
      <div className="container">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-6">
          <p className="font-bold text-xl text-center md:text-left">
            💌 Join the VIP list & get 10% off your first visit
          </p>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 md:w-64 px-5 py-3 rounded-lg bg-white text-black placeholder:text-black/50 focus:outline-none border-2 border-white"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-white px-8"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
