"use client";

import { useEffect, useState, type ReactNode } from "react";

type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox";
  required?: boolean;
};

type Props = {
  formSlug: string;
  /** e.g. hub intake vs public /forms/... */
  variant?: "default" | "intake";
  aboveFold?: ReactNode;
  belowTitle?: ReactNode;
};

export function PublicHgForm({ formSlug, variant = "default", aboveFold, belowTitle }: Props) {
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
    if (!formSlug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/public/forms/by-slug/${encodeURIComponent(formSlug)}`);
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
  }, [formSlug]);

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
          slug: formSlug,
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
      <div
        className={variant === "intake" ? "min-h-[40vh] flex items-center justify-center text-[#888] text-sm" : "min-h-screen flex items-center justify-center bg-[#fafafa] text-[#888] text-sm"}
      >
        Loading form…
      </div>
    );
  }

  if (err && !title) {
    return (
      <div
        className={variant === "intake" ? "min-h-[40vh] flex items-center justify-center px-6" : "min-h-screen flex items-center justify-center bg-[#fafafa] px-6"}
      >
        <p className="text-red-600 text-sm text-center max-w-md">{err}</p>
      </div>
    );
  }

  const wrapClass =
    variant === "intake"
      ? "min-h-screen bg-[#0E0E0E] text-white py-10 px-4"
      : "min-h-screen bg-[#fafafa] py-12 px-4";
  const cardClass =
    variant === "intake"
      ? "max-w-lg mx-auto bg-[#1a1a1a] rounded-xl border border-white/10 p-8"
      : "max-w-lg mx-auto bg-white rounded-xl shadow-sm border border-[#eee] p-8";
  const labelColor = variant === "intake" ? "text-white/80" : "text-[#555]";
  const inputClass =
    variant === "intake"
      ? "w-full border border-white/20 bg-[#0E0E0E] text-white rounded-lg px-3 py-2 text-sm"
      : "w-full border border-[#ddd] rounded-lg px-3 py-2 text-sm";

  return (
    <div className={wrapClass}>
      {aboveFold}
      <div className={cardClass}>
        <p className="text-[#FF1493] text-xs tracking-widest uppercase mb-2">Hello Gorgeous Med Spa</p>
        <h1
          className={
            variant === "intake" ? "font-serif text-2xl text-white mb-2" : "font-serif text-2xl text-[#1a1a1a] mb-2"
          }
        >
          {title}
        </h1>
        {belowTitle}
        {done ? (
          <p
            className={
              variant === "intake" ? "text-emerald-400 text-sm leading-relaxed mt-4" : "text-emerald-700 text-sm leading-relaxed mt-4"
            }
          >
            {done}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {fields.length === 0 && (
              <p
                className={
                  variant === "intake" ? "text-sm text-white/60" : "text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3"
                }
              >
                The clinical body of this form is not loaded yet. Add the verbatim InMode + legal sections to
                the Hub template; until then, sign below to test the pipeline.
              </p>
            )}
            {fields.map((f) => (
              <div key={f.id}>
                {f.type === "checkbox" ? (
                  <label className={`flex items-center gap-2 text-sm ${labelColor}`}>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      required={f.required}
                      checked={Boolean(values[f.id])}
                      onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.checked }))}
                    />
                    {f.label}
                    {f.required ? " *" : ""}
                  </label>
                ) : (
                  <>
                    <label className={`block text-xs font-medium ${labelColor} mb-1`}>
                      {f.label}
                      {f.required ? " *" : ""}
                    </label>
                    {f.type === "textarea" ? (
                      <textarea
                        required={f.required}
                        className={inputClass}
                        rows={4}
                        value={(values[f.id] as string) || ""}
                        onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.value }))}
                      />
                    ) : (
                      <input
                        type="text"
                        required={f.required}
                        className={inputClass}
                        value={(values[f.id] as string) || ""}
                        onChange={(e) => setValues((s) => ({ ...s, [f.id]: e.target.value }))}
                      />
                    )}
                  </>
                )}
              </div>
            ))}

            <div>
              <label className={`block text-xs font-medium ${labelColor} mb-1`}>Your name (signer)</label>
              <input
                type="text"
                className={inputClass}
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={`block text-xs font-medium ${labelColor} mb-1`}>
                Mobile number <span className="text-white/50">(links to your chart — we match Fresha first)</span>
              </label>
              <input
                type="tel"
                className={inputClass}
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>

            {err && <p className="text-red-400 text-sm">{err}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full min-h-[44px] bg-[#FF1493] hover:bg-pink-600 text-white py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {busy ? "Submitting…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
