"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function StaffLoginForm() {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const sp = useSearchParams();
  const next = sp.get("next") || "/staff";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/staff/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
        credentials: "include",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErr(typeof j.error === "string" ? j.error : "Invalid PIN");
        return;
      }
      const dest = next.startsWith("/staff") ? next : "/staff";
      window.location.href = dest;
    } catch {
      setErr("Network error — try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-sm w-full space-y-5 rounded-2xl border-2 border-pink-500/40 bg-gray-900/90 p-8 shadow-xl backdrop-blur"
    >
      <div className="text-center">
        <img
          src="/images/regen/regen-logo.png"
          alt="Hello Gorgeous staff"
          className="mx-auto mb-4 h-16 rounded-lg"
        />
        <h1 className="text-xl font-bold text-white">Staff access</h1>
        <p className="mt-2 text-sm text-pink-200/70">Enter the team PIN to open training &amp; protocols.</p>
      </div>
      <input
        type="password"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="one-time-code"
        maxLength={12}
        className="w-full rounded-xl border-2 border-white/15 bg-black/40 px-4 py-3 text-center text-lg tracking-[0.3em] text-white outline-none focus:border-[#E6007E]"
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        placeholder="••••••"
        autoFocus
      />
      {err ? <p className="text-center text-sm text-red-400">{err}</p> : null}
      <button
        type="submit"
        disabled={busy || pin.length < 4}
        className="w-full rounded-xl bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] py-3 font-bold text-white disabled:opacity-50"
      >
        {busy ? "Checking…" : "Unlock staff hub"}
      </button>
      <p className="text-center text-[11px] text-white/40">
        Admin users signed in at /login can access staff tools without this PIN.
      </p>
    </form>
  );
}

export default function StaffLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-purple-950 to-black p-6">
      <Suspense fallback={<div className="text-sm text-pink-300/70">Loading…</div>}>
        <StaffLoginForm />
      </Suspense>
    </main>
  );
}
