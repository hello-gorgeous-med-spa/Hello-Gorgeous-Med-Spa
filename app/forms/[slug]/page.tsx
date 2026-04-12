"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox";
  required?: boolean;
};

export default function PublicFormPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [title, setTitle] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [signerName, setSignerName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/public/forms/by-slug/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Form not found");
        if (cancelled) return;
        setTitle(data.title || "");
        setFields(Array.isArray(data.fields) ? data.fields : []);
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Could not load form");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const responses: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.id];
      if (f.type === "checkbox") responses[f.id] = Boolean(v);
      else responses[f.id] = v ?? "";
    }
    try {
      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          responses,
          signer_name: signerName.trim() || undefined,
          client_phone: clientPhone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submit failed");
      setDone(`Thank you. Your reference is ${data.reference}.`);
      setValues({});
      setSignerName("");
      setClientPhone("");
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] text-[#888] text-sm">Loading form…</div>
    );
  }

  if (err && !title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-6">
        <p className="text-red-600 text-sm text-center max-w-md">{err}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-12 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-[#eee] p-8">
        <p className="text-[#FF1493] text-xs tracking-widest uppercase mb-2">Hello Gorgeous Med Spa</p>
        <h1 className="font-serif text-2xl text-[#1a1a1a] mb-6">{title}</h1>

        {done ? (
          <p className="text-emerald-700 text-sm leading-relaxed">{done}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {fields.map((f) => (
              <div key={f.id}>
                {f.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm text-[#333]">
                    <input
                      type="checkbox"
                      required={f.required}
                      checked={Boolean(values[f.id])}
                      onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.checked }))}
                    />
                    {f.label}
                    {f.required ? " *" : ""}
                  </label>
                ) : (
                  <>
                    <label className="block text-xs font-medium text-[#555] mb-1">
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea
                        required={f.required}
                        className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm"
                        rows={4}
                        value={(values[f.id] as string) || ""}
                        onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        required={f.required}
                        className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm"
                        value={(values[f.id] as string) || ""}
                        onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.value }))}
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-[#555] mb-1">Your name (signer)</label>
              <input
                type="text"
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#555] mb-1">Mobile (optional — links to your profile)</label>
              <input
                type="tel"
                className="w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
              />
            </div>

            {err && <p className="text-red-600 text-sm">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
