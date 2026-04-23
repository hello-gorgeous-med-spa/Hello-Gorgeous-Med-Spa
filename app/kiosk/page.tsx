"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Onsite kiosk: check in by phone, then continue to consent signing when forms are pending.
 * Staff can also open a direct link from Calendar → Get kiosk consent link.
 */
export default function KioskHubPage() {
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [kioskUrl, setKioskUrl] = useState<string | null>(null);
  const [consentCount, setConsentCount] = useState(0);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setKioskUrl(null);
    setConsentCount(0);
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
      if (data.kiosk_url) {
        setKioskUrl(data.kiosk_url);
        setConsentCount(typeof data.consent_outstanding_count === "number" ? data.consent_outstanding_count : 0);
      }
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
        <h1 className="font-serif text-3xl md:text-4xl font-light mb-2">Kiosk check-in</h1>
        <p className="text-white/60 text-sm mb-8 leading-relaxed">
          Enter the mobile number we have on file. If you have forms to sign, you&apos;ll continue on this device
          right after check-in.
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
            {busy ? "Checking…" : "Check in"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-6 text-sm leading-relaxed ${msg.type === "ok" ? "text-emerald-300" : "text-red-300"}`}
            role="status"
          >
            {msg.text}
          </p>
        )}

        {kioskUrl && (
          <div className="mt-8 space-y-3 text-left">
            <p className="text-sm text-white/80">
              {consentCount > 0
                ? `You have ${consentCount} form${consentCount === 1 ? "" : "s"} to sign.`
                : "Complete any remaining steps below."}
            </p>
            <a
              href={kioskUrl}
              className="block w-full text-center rounded-lg bg-white text-black py-3 font-semibold hover:bg-gray-100"
            >
              Sign consent forms →
            </a>
            <p className="text-xs text-white/40">Link expires in about 15 minutes. Ask the front desk if it expires.</p>
          </div>
        )}

        {msg?.type === "ok" && !kioskUrl && (
          <p className="mt-6 text-sm text-white/50">
            No pending consent forms on file for this visit. Have a seat — we&apos;ll be right with you.
          </p>
        )}

        <p className="mt-12 text-white/35 text-xs leading-relaxed">
          Oswego, IL ·{" "}
          <Link href="/checkin" className="text-white/50 underline">
            Simple check-in only
          </Link>{" "}
          · Questions? Call{" "}
          <a href="tel:6306366193" className="text-white/50 underline">
            (630) 636-6193
          </a>
        </p>
      </div>
    </div>
  );
}
