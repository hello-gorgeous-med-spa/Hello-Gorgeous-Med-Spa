"use client";

import { FormSuccessNotice } from "@/components/forms/FormSuccessNotice";
import { useState } from "react";

/** VIP signup overlay — disabled. */
export function EmailCapture() {
  return null;
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
          <p className="font-bold text-xl mb-3">✓ You&apos;re on the list!</p>
          <FormSuccessNotice variant="light" className="max-w-md mx-auto text-left" />
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
