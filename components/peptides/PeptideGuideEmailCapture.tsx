"use client";

import { useCallback, useState } from "react";

export function PeptideGuideEmailCapture() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setStatus("loading");
      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            phone: phone.trim() || undefined,
            source: "peptide_guide",
            marketing_opt_in: optIn,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        setStatus("done");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    },
    [email, phone, optIn],
  );

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-[#16a34a]/40 bg-[#16a34a]/10 p-5 text-center">
        <p className="font-bold text-[#16a34a]">You&apos;re on the list ✓</p>
        <p className="mt-1 text-sm text-white/75">
          We&apos;ll send peptide updates and Oswego RX news. Downloads above stay free anytime — no login needed.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-2xl border border-dashed border-[#FF2D8E]/40 bg-[#140109] p-5"
    >
      <p className="text-sm font-bold text-white">
        Want peptide updates? <span className="text-[#FF2D8E]">Optional</span> — downloads stay free without signing up.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="min-h-[44px] flex-1 rounded-xl border border-white/20 bg-[#0a0206] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone (optional)"
          className="min-h-[44px] flex-1 rounded-xl border border-white/20 bg-[#0a0206] px-4 text-sm text-white placeholder:text-white/40 focus:border-[#FF2D8E] focus:outline-none focus:ring-2 focus:ring-[#FF2D8E]/20"
        />
      </div>
      <label className="mt-3 flex items-start gap-2 text-xs text-white/75">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#FF2D8E]"
          required
        />
        <span>
          I agree to receive Hello Gorgeous updates about peptides, GLP-1, and med spa offers. Reply STOP to any text
          to opt out.
        </span>
      </label>
      {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#FF2D8E] px-6 text-sm font-extrabold text-black transition hover:bg-white disabled:opacity-50"
      >
        {status === "loading" ? "Joining…" : "Join peptide list →"}
      </button>
    </form>
  );
}
