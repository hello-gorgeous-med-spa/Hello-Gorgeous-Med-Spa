"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabase/client";

export default function AiConciergeAnalyticsPage() {
  const [calls, setCalls] = useState(0);
  const [bookings, setBookings] = useState(0);
  const [xfer, setXfer] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      const iso = since.toISOString();

      const { count: c } = await supabase
        .from("ai_concierge_calls")
        .select("*", { count: "exact", head: true })
        .gte("started_at", iso);
      const { count: b } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .gte("created_at", iso);
      const { count: x } = await supabase
        .from("ai_concierge_calls")
        .select("*", { count: "exact", head: true })
        .gte("started_at", iso)
        .eq("action_taken", "transferred");

      setCalls(c ?? 0);
      setBookings(b ?? 0);
      setXfer(x ?? 0);
      setLoading(false);
    })();
  }, []);

  const conv =
    calls > 0 ? `${Math.round((bookings / calls) * 100)}%` : "—";

  return (
    <>
      <h2 className="text-lg font-semibold mb-2">Last 30 days (approximate)</h2>
      {loading ? (
        <p className="text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Calls logged" value={String(calls)} />
          <Stat label="Booking rows created" value={String(bookings)} />
          <Stat label="Transfers (Sarah→Dial)" value={String(xfer)} />
          <Stat label="Booking / calls" value={conv} />
        </div>
      )}
      <p className="text-xs text-black/60 mt-4">
        Tune prompts & tooling based on transfer vs booking ratio; Claude billed separately via Anthropic console.
      </p>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 p-4 bg-white">
      <div className="text-xs text-black/55">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
