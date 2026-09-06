"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { RegenPublicNav } from "@/components/regen/RegenPublicNav";
import {
  AFFILIATE_AGREEMENT_SECTIONS,
  AFFILIATE_AGREEMENT_VERSION,
  AFFILIATE_TYPES,
  type AffiliatePartnerType,
} from "@/lib/regen-affiliates";

const BRAND = { teal: "#0D9488", pink: "#E91E8C", dark: "#0A0A0A", cream: "#FAF9F6" };

export function RegenAffiliateApply() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "sign">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    legalName: "",
    email: "",
    phone: "",
    businessName: "",
    website: "",
    audience: "",
    partnerType: "med_spa" as AffiliatePartnerType,
    illinoisAck: false,
    signature: "",
    agreed: false,
  });

  const readyToSign = scrolled && form.agreed && form.signature.trim().length > 1;

  async function submit() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/regen/affiliates/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(json.error || "Could not submit");
      return;
    }
    router.push("/affiliates/dashboard");
  }

  return (
    <div className="min-h-screen" style={{ background: BRAND.dark, color: BRAND.cream }}>
      <RegenPublicNav />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Link href="/affiliates" className="text-sm" style={{ color: BRAND.teal }}>
          ← Back to partner program
        </Link>
        {step === "form" ? (
          <>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.pink }}>
              Apply
            </p>
            <h1 className="mt-2 font-serif text-4xl font-black">Tell us who you are.</h1>
            <p className="mt-3 text-white/60">Danielle reviews every partner. Illinois adults 21+ only.</p>
            <div className="mt-8 space-y-4">
              <label className="block text-sm font-bold">Full legal name
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.legalName} onChange={(e) => setForm({ ...form, legalName: e.target.value })} />
              </label>
              <label className="block text-sm font-bold">Email
                <input type="email" className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label className="block text-sm font-bold">Phone
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </label>
              <label className="block text-sm font-bold">Business or handle
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} />
              </label>
              <label className="block text-sm font-bold">Website or Instagram
                <input className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </label>
              <fieldset className="space-y-2">
                <legend className="text-sm font-bold">Partner type</legend>
                {AFFILIATE_TYPES.map((type) => (
                  <label key={type.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3">
                    <input type="radio" name="type" checked={form.partnerType === type.id} onChange={() => setForm({ ...form, partnerType: type.id })} />
                    <span>
                      <b>{type.label}</b>
                      <span className="block text-xs text-white/50">{type.blurb}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" checked={form.illinoisAck} onChange={(e) => setForm({ ...form, illinoisAck: e.target.checked })} />
                I will only refer Illinois adults 21+ and I will not promise a prescription or a result.
              </label>
              <button
                type="button"
                disabled={!form.legalName || !form.email.includes("@") || !form.illinoisAck}
                onClick={() => setStep("sign")}
                className="w-full rounded-full py-3 text-sm font-extrabold text-white disabled:opacity-40"
                style={{ background: BRAND.pink }}
              >
                Continue to Code of Conduct
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em]" style={{ color: BRAND.pink }}>
              Code of Conduct {AFFILIATE_AGREEMENT_VERSION}
            </p>
            <h1 className="mt-2 font-serif text-3xl font-black">Read it all the way through.</h1>
            <div
              className="mt-6 h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-white p-6 text-black"
              onScroll={(e) => {
                const el = e.currentTarget;
                if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) setScrolled(true);
              }}
            >
              {AFFILIATE_AGREEMENT_SECTIONS.map((section) => (
                <div key={section.title} className="mb-5">
                  <p className="font-bold">{section.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-black/70">{section.body}</p>
                </div>
              ))}
            </div>
            <label className="mt-6 block text-sm font-bold">Full legal name
              <input className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3" value={form.signature} onChange={(e) => setForm({ ...form, signature: e.target.value })} />
            </label>
            <label className="mt-4 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={form.agreed} onChange={(e) => setForm({ ...form, agreed: e.target.checked })} />
              I have read, understood, and agree to abide by the REGEN RX Partner Code of Conduct.
            </label>
            <div className="mt-4 flex gap-6 text-xs text-white/45">
              <span style={{ color: scrolled ? BRAND.teal : undefined }}>{scrolled ? "✓" : "○"} Read complete</span>
              <span style={{ color: form.agreed ? BRAND.teal : undefined }}>{form.agreed ? "✓" : "○"} Acknowledge box</span>
              <span style={{ color: form.signature.trim().length > 1 ? BRAND.teal : undefined }}>{form.signature.trim().length > 1 ? "✓" : "○"} Name entered</span>
            </div>
            {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
            <button
              type="button"
              disabled={!readyToSign || loading}
              onClick={submit}
              className="mt-6 w-full rounded-full py-3 text-sm font-extrabold text-white disabled:opacity-40"
              style={{ background: readyToSign ? BRAND.pink : "#333" }}
            >
              {loading ? "Signing…" : "Sign and continue"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
