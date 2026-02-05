"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function EmailCapture() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasShown, setHasShown] = useState(false);

  // Don't show on admin, login, portal, pos, or provider routes
  const isAdminRoute = pathname?.startsWith('/admin') || 
                       pathname?.startsWith('/login') || 
                       pathname?.startsWith('/portal') ||
                       pathname?.startsWith('/pos') ||
                       pathname?.startsWith('/provider');

  // Show popup after 5 seconds, only once per session, not on admin routes
  useEffect(() => {
    // Never show on admin/protected routes
    if (isAdminRoute) {
      return;
    }

    // Check if already shown or dismissed
    const dismissed = sessionStorage.getItem("email-popup-dismissed");
    const subscribed = localStorage.getItem("email-subscribed");
    
    if (dismissed || subscribed) {
      setHasShown(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
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
          source: "popup-10off" 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }
      
      localStorage.setItem("email-subscribed", email);
      setStatus("success");
      
      // Close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch {
      setStatus("error");
    }
  };

  // Don't render on admin routes
  if (isAdminRoute) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-br from-black via-pink-950/30 to-black border-2 border-pink-500/50 rounded-3xl overflow-hidden shadow-2xl shadow-pink-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/20 hover:text-white transition z-10"
        >
          ✕
        </button>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-pink-500/20 to-transparent" />

        <div className="relative p-8 md:p-10">
          {status === "success" ? (
            // Success State
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center mb-6">
                <span className="text-5xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You&apos;re In!</h3>
              <p className="text-white/70">
                Check your inbox for your exclusive 10% off code.
              </p>
              <p className="text-pink-400 font-semibold mt-4">
                Welcome to Hello Gorgeous! 💕
              </p>
            </div>
          ) : (
            // Form State
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 mb-4">
                  <span className="text-pink-400 font-semibold text-sm">EXCLUSIVE OFFER</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Get{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">
                    10% Off
                  </span>
                </h3>
                <p className="text-white/70 text-lg">
                  Your first treatment when you join our VIP list
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-pink-500 text-center text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:to-pink-700 transition shadow-lg shadow-pink-500/25 disabled:opacity-50"
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
                <p className="mt-4 text-center text-red-400 text-sm">
                  Oops! Something went wrong. Please try again.
                </p>
              )}

              <div className="mt-6 space-y-3">
                <p className="text-center text-white/50 text-sm">
                  VIP members also get:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                    ✨ Early access to specials
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                    🎁 Birthday rewards
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 text-xs">
                    💌 Exclusive tips
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full mt-6 text-white/40 text-sm hover:text-white/60 transition"
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

// Inline banner version for homepage
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
      <section className="py-8 px-4 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-bold text-lg">
            ✓ You&apos;re on the list! Check your email for your 10% off code.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-600">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg">
              💌 Join the VIP list & get 10% off your first visit
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 md:w-64 px-4 py-3 rounded-full bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-white text-pink-600 font-bold rounded-full hover:bg-white/90 transition disabled:opacity-50"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
