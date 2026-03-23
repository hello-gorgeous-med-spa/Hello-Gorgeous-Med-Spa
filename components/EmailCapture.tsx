"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackEvent } from "@/components/GoogleAnalytics";
import { usePathname } from "next/navigation";

const POPUP_STORAGE_KEY = "hg_vip_popup_dismissed";

export function EmailCapture() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [hasShown, setHasShown] = useState(false);

  const isAdminRoute = pathname?.startsWith('/admin') ||
                       pathname?.startsWith('/login') ||
                       pathname?.startsWith('/portal') ||
                       pathname?.startsWith('/pos') ||
                       pathname?.startsWith('/provider');

  useEffect(() => {
    if (isAdminRoute) return;

    const dismissed = sessionStorage.getItem(POPUP_STORAGE_KEY);
    if (dismissed) {
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
    sessionStorage.setItem(POPUP_STORAGE_KEY, "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !phone.trim() || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/vip-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign: "popup_vip",
          name: `${firstName.trim()} ${lastName.trim()}`,
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to join");
      }

      trackEvent("vip_signup", { source: "popup_vip" });
      setStatus("success");
      setTimeout(() => {
        handleClose();
      }, 3500);
    } catch {
      setStatus("error");
    }
  };

  if (isAdminRoute) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" role="dialog" aria-label="VIP signup">
      <div
        className="relative w-full max-w-lg bg-white border-2 border-[#FF2D8E]/40 rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#FF2D8E] transition z-10"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="p-8 md:p-10">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#FF2D8E] flex items-center justify-center mb-6">
                <span className="text-4xl text-white">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">You&apos;re on the list!</h3>
              <p className="text-black">We&apos;ll reach out with VIP access, launch pricing, and priority booking.</p>
              <p className="text-[#FF2D8E] font-bold mt-4">Thank you! 💕</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-2 rounded-full bg-[#FF2D8E]/10 text-[#FF2D8E] font-bold text-sm mb-4">
                  VIP & TRIFECTA
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                  Be first. Get priority access.
                </h3>
                <p className="text-black/80 text-sm">
                  Morpheus8 Burst, Solaria CO₂ now booking. Quantum RF coming soon — join for priority access.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-black/20 text-black placeholder:text-black/50 focus:outline-none focus:border-[#FF2D8E]"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-black/20 text-black placeholder:text-black/50 focus:outline-none focus:border-[#FF2D8E]"
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/20 text-black placeholder:text-black/50 focus:outline-none focus:border-[#FF2D8E]"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-black/20 text-black placeholder:text-black/50 focus:outline-none focus:border-[#FF2D8E]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-xl bg-[#FF2D8E] text-white font-bold hover:bg-[#E6007E] transition disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Joining...
                    </span>
                  ) : (
                    "Yes — add me to the VIP list"
                  )}
                </button>
              </form>

              {status === "error" && (
                <p className="mt-3 text-center text-red-600 font-medium text-sm">
                  Something went wrong. Please try again or call (630) 636-6193.
                </p>
              )}

              <p className="mt-4 text-center text-xs text-black/60">
                Or learn more:{" "}
                <Link href="/vip-skin-tightening" onClick={handleClose} className="text-[#FF2D8E] font-medium hover:underline">VIP Skin Tightening</Link>
                {" · "}
                <Link href="/solaria-co2-vip" onClick={handleClose} className="text-[#FF2D8E] font-medium hover:underline">Solaria CO₂ VIP</Link>
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="w-full mt-4 text-black/50 text-sm hover:text-[#FF2D8E] transition"
              >
                Maybe later
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
