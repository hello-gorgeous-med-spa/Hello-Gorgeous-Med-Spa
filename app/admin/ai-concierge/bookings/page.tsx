"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

type Row = {
  id: string;
  client_name: string;
  client_phone: string;
  service_requested: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  created_at: string | null;
};

export default function AiConciergeBookingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const { data, error } = await supabase
      .from("booking_requests")
      .select(
        "id, client_name, client_phone, service_requested, preferred_date, preferred_time, status, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setErr(error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("booking_requests").update({ status }).eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await load();
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Booking requests</h2>
      {loading && <p className="text-sm">Loading…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="overflow-x-auto border border-black/10 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-black/5">
            <tr>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Client</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Service</th>
              <th className="text-left p-2">When</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-black/10">
                <td className="p-2 whitespace-nowrap">{r.created_at ? new Date(r.created_at).toLocaleString() : "—"}</td>
                <td className="p-2">{r.client_name}</td>
                <td className="p-2 font-mono text-xs">{r.client_phone}</td>
                <td className="p-2">{r.service_requested}</td>
                <td className="p-2 max-w-[180px]">
                  {[r.preferred_date, r.preferred_time].filter(Boolean).join(" ") || "—"}
                </td>
                <td className="p-2">{r.status}</td>
                <td className="p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border border-black/20 hover:bg-black/5"
                    onClick={() => setStatus(r.id, "booked")}
                  >
                    Booked
                  </button>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded border border-black/20 hover:bg-black/5"
                    onClick={() => setStatus(r.id, "cancelled")}
                  >
                    Cancelled
                  </button>
                  <a className="text-xs px-2 py-1 rounded border border-black/20 text-[#2D63A4]" href={`sms:${r.client_phone}?body=${encodeURIComponent(`Hello from Hello Gorgeous — regarding your ${r.service_requested} request.`)}`}>
                    SMS
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
