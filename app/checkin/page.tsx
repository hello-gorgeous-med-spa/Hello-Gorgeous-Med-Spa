"use client";

import { useState } from "react";

export default function VirtualCheckInPage() {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/public/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "err", text: data.error || "Could not check in." });
        return;
      }
      setMsg({ type: "ok", text: data.message || "You are checked in." });
      setPhone("");
    } catch {
      setMsg({ type: "err", text: "Network error. Try again or see the front desk." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md w-full text-center">
        <p className="text-[#FF1493] text-xs tracking-[0.2em] uppercase mb-3">Hello Gorgeous Med Spa</p>
        <h1 className="font-serif text-3xl md:text-4xl font-light mb-2">Virtual check-in</h1>
        <p className="text-white/60 text-sm mb-10 leading-relaxed">
          Enter the mobile number we have on file. We will confirm today&apos;s appointment and let the team know
          you&apos;re here.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <label className="block text-xs uppercase tracking-wider text-white/50">Mobile phone</label>
          <input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. (630) 555-0199"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#FF1493]"
            disabled={busy}
          />
          <button
            type="submit"
            disabled={busy || !phone.trim()}
            className="w-full rounded-lg bg-[#FF1493] text-white py-3 font-medium disabled:opacity-40"
          >
            {busy ? "Checking…" : "I'm here — check me in"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-8 text-sm leading-relaxed ${msg.type === "ok" ? "text-emerald-300" : "text-red-300"}`}
            role="status"
          >
            {msg.text}
          </p>
        )}

        <p className="mt-12 text-white/35 text-xs leading-relaxed">
          Oswego, IL · Questions? Call{" "}
          <a href="tel:6306366193" className="text-white/50 underline">
            (630) 636-6193
          </a>
        </p>
      </div>
    </div>
  );
}
