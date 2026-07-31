"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CONSULT_VERTICAL_LABELS, type ConsultVertical } from "@/lib/consults/types";

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
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <div>
        <Link href="/admin/proposals/consults" className="text-sm font-bold text-[#E6007E] underline">
          ← Consults
        </Link>
        <h1 className="mt-2 text-3xl font-black">New consult</h1>
        <p className="mt-1 text-sm text-black/65">
          Pick a vertical — weight loss has the full screen + education pack.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="space-y-4 rounded-[1.5rem] border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
      >
        <label className="block text-sm font-semibold">
          Vertical
          <select
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
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
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Phone
          <input
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Notes
          <textarea
            className="mt-1 w-full rounded-xl border-2 border-black/15 px-3 py-2"
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={saving || !clientName.trim()}
          className="w-full rounded-full bg-[#E6007E] px-5 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          {saving ? "Opening room…" : "Open consult room"}
        </button>
      </form>
    </div>
  );
}
