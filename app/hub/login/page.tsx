"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function HubLoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const sp = useSearchParams();
  const next = sp.get("next") || "/hub";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const r = await fetch("/api/hub/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
      credentials: "include",
    });
    const j = await r.json();
    if (!r.ok) {
      setErr(typeof j.error === "string" ? j.error : "Login failed");
      return;
    }
    const dest = next.startsWith("/") ? next : "/hub";
    window.location.href = dest;
  }

  return (
    <form onSubmit={submit} className="max-w-sm w-full space-y-4 border rounded-xl p-8 shadow-sm bg-white">
      <h1 className="text-xl font-semibold">Command Center</h1>
      <p className="text-sm text-black/60">Enter the hub password.</p>
      <input
        type="password"
        className="w-full border rounded px-3 py-2"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        autoComplete="current-password"
        autoFocus
      />
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <button type="submit" className="w-full bg-pink-600 text-white py-2 rounded font-medium">
        Sign in
      </button>
    </form>
  );
}

export default function HubLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f5]">
      <Suspense fallback={<div className="text-sm text-black/50">Loading…</div>}>
        <HubLoginForm />
      </Suspense>
    </main>
  );
}
