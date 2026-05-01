"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReviewsStatus {
  ok: boolean;
  enabled?: boolean;
  counts?: {
    pendingTotal: number;
    pendingDue: number;
    sentLast30Days: number;
    sentLast60Days: number;
    clientsInCooldown: number;
  };
  recent?: {
    sent: Array<{
      id: string;
      client_id: string;
      sms_sent: boolean;
      email_sent: boolean;
      source: string | null;
      created_at: string;
    }>;
    pending: Array<{
      id: string;
      client_id: string;
      appointment_id: string | null;
      scheduled_for: string;
      source: string | null;
      created_at: string;
    }>;
  };
  cooldownDays?: number;
  generatedAt?: string;
  error?: string;
}

export default function ReviewsAdminPage() {
  const [status, setStatus] = useState<ReviewsStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/marketing/reviews/status", { cache: "no-store" });
      const data = (await res.json()) as ReviewsStatus;
      setStatus(data);
    } catch (e) {
      setStatus({ ok: false, error: e instanceof Error ? e.message : "Network error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto text-black">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/admin/marketing" className="text-black hover:underline">← Marketing</Link>
        <span className="text-black">/</span>
        <span className="font-semibold">Google review automation</span>
      </div>

      <h1 className="text-xl font-bold mb-1">Google review automation</h1>
      <p className="text-sm text-black/70 mb-4">
        Every paying visit (HG OS appointment marked completed <em>or</em> Square Terminal /
        Square Online checkout) enqueues a review request. SMS + email goes out 24h later via the
        hourly cron. A 60-day per-client cooldown prevents review fatigue.
      </p>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-3 py-1.5 rounded bg-[#E6007E] text-white text-xs font-medium disabled:opacity-50 hover:bg-[#c00069]"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
        <span className="text-xs text-black/50">
          {status?.generatedAt ? `Updated ${new Date(status.generatedAt).toLocaleString()}` : ""}
        </span>
        {status?.enabled === false && (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
            DISABLED — set REVIEW_REQUESTS_ENABLED to re-enable
          </span>
        )}
      </div>

      {status?.error && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3 text-sm mb-4">
          {status.error}
        </div>
      )}

      {status?.counts && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Stat label="Pending (total)" value={status.counts.pendingTotal} />
          <Stat label="Pending due now" value={status.counts.pendingDue} highlight />
          <Stat label="Sent last 30d" value={status.counts.sentLast30Days} />
          <Stat label="Sent last 60d" value={status.counts.sentLast60Days} />
          <Stat
            label={`In cooldown (${status.cooldownDays ?? 60}d)`}
            value={status.counts.clientsInCooldown}
            sub="not eligible"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="border border-black/10 rounded-lg p-4 bg-white">
          <h2 className="text-sm font-semibold mb-3">Pending — next to send</h2>
          {(status?.recent?.pending ?? []).length === 0 ? (
            <p className="text-xs text-black/50">Queue is empty.</p>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-black/5">
                <tr>
                  <th className="text-left p-2">Scheduled</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Client</th>
                </tr>
              </thead>
              <tbody>
                {(status?.recent?.pending ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-black/5">
                    <td className="p-2">{new Date(row.scheduled_for).toLocaleString()}</td>
                    <td className="p-2">
                      <span className="font-mono">{row.source ?? "—"}</span>
                    </td>
                    <td className="p-2 font-mono text-[10px]">{row.client_id.slice(0, 8)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="border border-black/10 rounded-lg p-4 bg-white">
          <h2 className="text-sm font-semibold mb-3">Recently sent</h2>
          {(status?.recent?.sent ?? []).length === 0 ? (
            <p className="text-xs text-black/50">No recent sends.</p>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-black/5">
                <tr>
                  <th className="text-left p-2">Sent</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-left p-2">Channels</th>
                  <th className="text-left p-2">Client</th>
                </tr>
              </thead>
              <tbody>
                {(status?.recent?.sent ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-black/5">
                    <td className="p-2">{new Date(row.created_at).toLocaleString()}</td>
                    <td className="p-2 font-mono">{row.source ?? "—"}</td>
                    <td className="p-2">
                      {row.sms_sent ? <span className="text-green-700 font-bold">SMS</span> : <span className="text-black/40">sms</span>}
                      {" · "}
                      {row.email_sent ? <span className="text-green-700 font-bold">Email</span> : <span className="text-black/40">email</span>}
                    </td>
                    <td className="p-2 font-mono text-[10px]">{row.client_id.slice(0, 8)}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <details className="mt-6 text-xs text-black/60">
        <summary className="cursor-pointer font-semibold">How it works</summary>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Square Terminal / Online payment completes → webhook enqueues a 24h-delayed row in <code>review_requests_pending</code>.</li>
          <li>HG OS appointment marked <em>completed</em> → same enqueue, with the appointment id attached.</li>
          <li>Hourly Vercel cron <code>/api/cron/review-requests</code> drains rows whose <code>scheduled_for</code> has passed, calling <code>/api/reviews/request</code>.</li>
          <li>The send route enforces a 60-day per-client cooldown, then sends SMS (Twilio) + Email (Resend) with your Google review URL.</li>
          <li>Sent rows persist in <code>review_requests_sent</code> for cooldown lookups and reporting.</li>
        </ol>
      </details>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 bg-white ${
        highlight ? "border-[#E6007E] shadow-[2px_2px_0_0_rgba(230,0,126,0.3)]" : "border-black/10"
      }`}
    >
      <div className="text-[11px] uppercase tracking-wider text-black/60">{label}</div>
      <div className="text-2xl font-black">{value.toLocaleString()}</div>
      {sub && <div className="text-[10px] text-black/40 mt-0.5">{sub}</div>}
    </div>
  );
}
