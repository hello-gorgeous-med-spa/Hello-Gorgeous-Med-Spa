"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConsultProductShell } from "@/components/admin/ConsultProductShell";
import { CONSULT_VERTICAL_LABELS, type ConsultVertical } from "@/lib/consults/types";

const SERIF = "var(--font-playfair), Georgia, serif";
const PINK = "#E6007E";
const HOT = "#FF2D8E";

export default function NewConsultPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [vertical, setVertical] = useState<ConsultVertical>("weight_loss");
  const [internalNotes, setInternalNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/consults", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          clientPhone,
          vertical,
          internalNotes,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create consult.");
      router.push(`/admin/proposals/consults/${data.consult.id}`);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create consult.");
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 pb-16">
      <ConsultProductShell hideCta compact />

      <div>
        <Link
          href="/admin/proposals/consults"
          className="text-xs font-bold uppercase tracking-widest text-black/45 hover:text-[#E6007E]"
        >
          ← All consults
        </Link>
        <h1 className="mt-3 text-4xl font-medium text-black" style={{ fontFamily: SERIF }}>
          Open the room
        </h1>
        <p className="mt-2 text-sm text-black/60">
          Pick a vertical — weight loss carries the full screen + education pack.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-[1.75rem] border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_rgba(230,0,126,0.35)] md:p-8"
      >
        <label className="block text-sm font-semibold">
          Vertical
          <select
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2.5"
            value={vertical}
            onChange={(e) => setVertical(e.target.value as ConsultVertical)}
          >
            {(Object.keys(CONSULT_VERTICAL_LABELS) as ConsultVertical[]).map((key) => (
              <option key={key} value={key}>
                {CONSULT_VERTICAL_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Client name *
          <input
            required
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2.5"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2.5"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm font-semibold">
            Phone
            <input
              className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2.5"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Notes
          <textarea
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2.5"
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving || !clientName.trim()}
          className="w-full rounded-full border-2 border-black px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-[4px_4px_0_0_#000] disabled:opacity-40"
          style={{ background: `linear-gradient(125deg, ${HOT}, ${PINK})` }}
        >
          {saving ? "Opening room…" : "Enter consult room"}
        </button>
      </form>
    </div>
  );
}
