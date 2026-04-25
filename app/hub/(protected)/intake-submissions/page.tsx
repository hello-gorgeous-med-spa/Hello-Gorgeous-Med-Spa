"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  submitted_at: string;
  signer_name: string | null;
  client_phone: string | null;
  responses_json: unknown;
  hg_form_templates: { title: string | null; slug: string | null } | null;
};

export default function IntakeSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Row[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const r = await fetch("/api/hub/forms/submissions?limit=50", { credentials: "include" });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Load failed");
        if (on) setSubmissions(j.submissions || []);
      } catch (e) {
        if (on) setErr(e instanceof Error ? e.message : "Error");
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10">
      <p className="text-sm text-black/60 mb-2">
        <Link href="/hub" className="text-pink-600 hover:underline">
          ← Command Center
        </Link>
      </p>
      <h1 className="text-2xl font-bold">Intake &amp; consent submissions</h1>
      <p className="text-sm text-black/60 mt-1">
        Live feed (newest first). Patched from public forms API — same rows patients submit from{" "}
        <code className="text-xs bg-black/5 px-1">hub.hellogorgeousmedspa.com/intake</code>
      </p>

      {loading && <p className="text-sm text-black/50 mt-6">Loading…</p>}
      {err && <p className="text-red-600 text-sm mt-4">{err}</p>}

      {!loading && !err && (
        <ul className="mt-6 space-y-2">
          {submissions.map((s) => (
            <li key={s.id} className="border rounded-lg p-3 text-sm">
              <div className="font-medium">
                {s.hg_form_templates?.title || s.hg_form_templates?.slug || "Form"}
              </div>
              <div className="text-black/70">
                {s.signer_name || "—"} · {s.client_phone || "—"} ·{" "}
                {new Date(s.submitted_at).toLocaleString()}
              </div>
              <div className="text-xs text-black/40 mt-1 break-all">id: {s.id}</div>
            </li>
          ))}
          {!submissions.length && <li className="text-black/50">No submissions yet.</li>}
        </ul>
      )}
    </main>
  );
}
