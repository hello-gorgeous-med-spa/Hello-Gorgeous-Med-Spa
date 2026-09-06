"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";

const BRAND = { teal: "#0D9488", pink: "#E91E8C", dark: "#0A0A0A" };

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/regen/affiliates/login?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json()).error || "Link expired");
        router.replace("/affiliates/dashboard");
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token, router]);

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/regen/affiliates/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not send the link");
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: "#FAF9F6" }}>
      <RegenPublicNav />
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.teal }}>Partners</p>
        <h1 className="mt-2 font-serif text-4xl font-black">Partner login</h1>
        <p className="mt-3 text-white/60">We email a one-time link. No password to remember.</p>
        {sent ? (
          <p className="mt-8 rounded-2xl bg-white/5 p-5 text-sm">Check {email} for your dashboard link.</p>
        ) : (
          <form onSubmit={sendLink} className="mt-8 space-y-4">
            <input
              type="email"
              required
              placeholder="you@studio.com"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <button disabled={loading} className="w-full rounded-full py-3 text-sm font-extrabold text-white" style={{ background: BRAND.pink }}>
              {loading ? "Sending…" : "Email me a link"}
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-white/45">
          New here? <Link href="/affiliates/apply" style={{ color: BRAND.teal }}>Apply to partner</Link>
        </p>
      </div>
    </div>
  );
}

export function RegenAffiliateLogin() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}
