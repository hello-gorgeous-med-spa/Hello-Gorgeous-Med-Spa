"use client";

import { useState } from "react";
import Link from "next/link";
import type { FunnelDefinition } from "@/lib/funnels";

export function ConsultationFunnelForm({ funnel }: { funnel: FunnelDefinition }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    concernType: "",
    treatmentInterest: "",
    urgency: "",
    budgetRange: "",
    contactPreference: "sms",
  });

  const setField = (key: keyof typeof form, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/public/funnels/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ funnel: funnel.slug, ...form }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.error || "Could not submit funnel.");
      setStatus("done");
      setMessage("Thanks — we captured your intake and routed it to consultation workflows.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Submission failed.");
    }
  }

  return (
    <div className="rounded-2xl border-2 border-black bg-white p-5">
      <h2 className="text-2xl font-black text-black">{funnel.title}</h2>
      <p className="mt-2 text-black/75">{funnel.intro}</p>
      <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submit}>
        <input required value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="Full name" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input required type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="Email" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input required value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="Phone" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input required value={form.concernType} onChange={(e) => setField("concernType", e.target.value)} placeholder="Concern type" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input required value={form.treatmentInterest} onChange={(e) => setField("treatmentInterest", e.target.value)} placeholder="Treatment interest" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <select required value={form.urgency} onChange={(e) => setField("urgency", e.target.value)} className="rounded border border-black/20 px-3 py-2 text-sm">
          <option value="">Urgency</option>
          <option value="asap">ASAP</option>
          <option value="30-days">Within 30 days</option>
          <option value="90-days">Within 90 days</option>
          <option value="researching">Researching</option>
        </select>
        <select required value={form.budgetRange} onChange={(e) => setField("budgetRange", e.target.value)} className="rounded border border-black/20 px-3 py-2 text-sm">
          <option value="">Budget range</option>
          <option value="under-1000">Under $1,000</option>
          <option value="1000-3000">$1,000-$3,000</option>
          <option value="3000-7000">$3,000-$7,000</option>
          <option value="7000-plus">$7,000+</option>
        </select>
        <select required value={form.contactPreference} onChange={(e) => setField("contactPreference", e.target.value)} className="rounded border border-black/20 px-3 py-2 text-sm">
          <option value="sms">Contact by SMS</option>
          <option value="email">Contact by Email</option>
          <option value="call">Contact by Call</option>
        </select>

        <button type="submit" disabled={status === "saving"} className="md:col-span-2 rounded-lg bg-[#E6007E] px-6 py-3 font-semibold text-white disabled:opacity-60">
          {status === "saving" ? "Submitting..." : "Submit intake"}
        </button>
      </form>

      {message ? <p className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-black/75"}`}>{message}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {funnel.recommendedServiceLinks.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-full border border-black/20 px-3 py-1 text-xs font-medium text-[#E6007E]">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
