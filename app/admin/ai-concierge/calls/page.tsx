"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

type Row = {
  id: string;
  started_at: string | null;
  from_number: string | null;
  duration_seconds: number | null;
  status: string | null;
  action_taken: string | null;
  transcript: string | null;
};

export default function AiConciergeCallsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      const { data, error } = await supabase
        .from("ai_concierge_calls")
        .select("id, started_at, from_number, duration_seconds, status, action_taken, transcript")
        .order("started_at", { ascending: false })
        .limit(100);
      if (error) setErr(error.message);
      setRows((data as Row[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Recent calls</h2>
      {loading && <p className="text-sm">Loading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto border border-black/10 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2">Started</th>
              <th className="text-left p-2">From</th>
              <th className="text-left p-2">Duration</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
              <th className="text-left p-2">Transcript</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-black/10">
                <td className="p-2 whitespace-nowrap">{r.started_at ? new Date(r.started_at).toLocaleString() : "—"}</td>
                <td className="p-2 font-mono text-xs">{r.from_number ?? "—"}</td>
                <td className="p-2">{r.duration_seconds ?? "—"}</td>
                <td className="p-2">{r.status ?? "—"}</td>
                <td className="p-2">{r.action_taken ?? "—"}</td>
                <td className="p-2">
                  <button type="button" className="text-[#2D63A4] underline" onClick={() => setOpen(open === r.id ? null : r.id)}>
                    {open === r.id ? "Hide" : "View"}
                  </button>
                  {open === r.id && (
                    <pre className="mt-2 max-h-48 overflow-auto text-xs bg-black/[0.04] p-2 rounded whitespace-pre-wrap">{r.transcript ?? "—"}</pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
