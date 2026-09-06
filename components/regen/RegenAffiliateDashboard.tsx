"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BRAND = { teal: "#0D9488", pink: "#E91E8C", dark: "#0f1414" };

type Me = {
  affiliate: {
    legal_name: string;
    code: string;
    status: string;
    partner_type: string;
    referralUrl: string;
    business_name?: string;
  };
  stats: {
    clicks: number;
    signups: number;
    pendingCommission: number;
    paidCommission: number;
    payoutMinimum: number;
    holdingDays: number;
  };
  commissions: { id: string; kind: string; status: string; amount_usd: number; notes?: string; created_at: string }[];
};

export function RegenAffiliateDashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/regen/affiliates/me")
      .then(async (res) => {
        if (res.status === 401) {
          window.location.href = "/affiliates/login";
          return;
        }
        if (!res.ok) throw new Error((await res.json()).error || "Failed");
        setMe(await res.json());
      })
      .catch((err) => setError(err.message));
  }, []);

  async function copy(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  if (error) {
    return <div className="p-10 text-red-600">{error}</div>;
  }
  if (!me) {
    return <div className="p-10 text-black/50">Loading your dashboard…</div>;
  }

  const pending = me.affiliate.status !== "active";

  return (
    <div className="min-h-screen bg-[#f6f6f4] text-[#101615]">
      <nav className="flex items-center justify-between px-6 py-4 text-[#f4ead9]" style={{ background: BRAND.dark }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-extrabold tracking-[0.12em]">REGEN<span style={{ color: BRAND.pink }}>RX</span></span>
          <span className="border-l border-white/20 pl-3 text-xs text-white/50">Partner Dashboard</span>
        </div>
        <Link href="/affiliates" className="text-xs text-white/60">Program</Link>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-serif text-3xl font-black">Welcome back, {me.affiliate.legal_name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-black/55">
          {pending
            ? "Danielle is reviewing your application. Your link will start counting when you are approved."
            : "Here's how your referrals are performing."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Link clicks" value={String(me.stats.clicks)} />
          <Stat label="Signups" value={String(me.stats.signups)} accent />
          <Stat label="Paid out" value={`$${me.stats.paidCommission.toFixed(0)}`} />
          <Stat label="Pending commission" value={`$${me.stats.pendingCommission.toFixed(0)}`} dark />
        </div>

        <div className="mt-6 rounded-3xl p-8 text-white" style={{ background: "linear-gradient(135deg,#0c3d3a,#0f1414)" }}>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em]" style={{ color: BRAND.teal }}>Your referral link</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code className="min-w-[240px] flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm">{me.affiliate.referralUrl}</code>
            <button type="button" onClick={() => copy("link", me.affiliate.referralUrl)} className="rounded-xl px-5 py-3 text-sm font-extrabold text-black" style={{ background: BRAND.teal }}>
              {copied === "link" ? "Copied" : "Copy link"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-white/55">Discount / tracking code</span>
            <span className="rounded-lg border px-3 py-1 font-extrabold" style={{ borderColor: BRAND.pink, color: "#fff" }}>{me.affiliate.code}</span>
            <button type="button" onClick={() => copy("code", me.affiliate.code)} className="text-sm font-bold" style={{ color: BRAND.teal }}>
              {copied === "code" ? "Copied" : "Copy code"}
            </button>
          </div>
          <p className="mt-4 text-xs text-white/40">
            Status: {me.affiliate.status}. Holding period {me.stats.holdingDays} days. Payouts on the 15th with a ${me.stats.payoutMinimum} minimum. You never see a patient&apos;s health information.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-black/45">Recent activity</p>
          {me.commissions.length === 0 ? (
            <p className="mt-4 text-sm text-black/50">No commissions yet. Share your link with Illinois adults 21+ — no outcome promises, no brand-name ads.</p>
          ) : (
            <ul className="mt-4 divide-y divide-black/5">
              {me.commissions.map((row) => (
                <li key={row.id} className="flex items-center justify-between py-3 text-sm">
                  <span>{row.notes || row.kind}</span>
                  <span className="font-bold">${Number(row.amount_usd).toFixed(2)} · {row.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, accent, dark }: { label: string; value: string; accent?: boolean; dark?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${dark ? "border-transparent text-white" : "border-black/10 bg-white"}`} style={dark ? { background: "#0f1414" } : undefined}>
      <p className={`text-[11px] uppercase tracking-wide ${dark ? "text-white/50" : "text-black/45"}`}>{label}</p>
      <p className="mt-1 font-serif text-3xl font-black" style={{ color: accent ? BRAND.teal : dark ? BRAND.pink : undefined }}>{value}</p>
    </div>
  );
}
