"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReviewsStatus {
  ok: boolean;
  enabled?: boolean;
  bulkEmailEnabled?: boolean;
  primaryReviewChannel?: string;
  counts?: {
      pendingTotal: number;
      pendingDue: number;
      sentLast30Days: number;
      sentLast60Days: number;
      smsLast30Days?: number;
      emailLast30Days?: number;
      clicksLast30Days?: number;
      retrying?: number;
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
        click_count?: number;
        first_clicked_at?: string | null;
      }>;
      pending: Array<{
        id: string;
        client_id: string;
        appointment_id: string | null;
        scheduled_for: string;
        source: string | null;
        created_at: string;
        attempts?: number;
        last_error?: string | null;
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
        <strong>Primary:</strong> Square checkout or completed visit → 24-hour wait → SMS + email with a tracked Google review link.
        Failed sends stay in queue and page Danielle. Clicks on that link are counted here. Google does not tell us which patient left which star — new reviews on the listing are the outcome.
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
            Per-visit HG queue OFF — set REVIEW_REQUESTS_ENABLED
          </span>
        )}
        {status?.bulkEmailEnabled === false && (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
            Bulk backlog email OFF
          </span>
        )}
        {status?.bulkEmailEnabled === true && (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800">
            Bulk backlog email ON
          </span>
        )}
      </div>

      {status?.error && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded p-3 text-sm mb-4">
          {status.error}
        </div>
      )}

      {status?.counts && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          <Stat label="Pending (total)" value={status.counts.pendingTotal} />
          <Stat label="Pending due now" value={status.counts.pendingDue} highlight />
          <Stat label="Retrying" value={status.counts.retrying ?? 0} sub="send failed" />
          <Stat label="Sent last 30d" value={status.counts.sentLast30Days} />
          <Stat label="SMS last 30d" value={status.counts.smsLast30Days ?? 0} />
          <Stat label="Email last 30d" value={status.counts.emailLast30Days ?? 0} />
          <Stat label="Link clicks 30d" value={status.counts.clicksLast30Days ?? 0} highlight />
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
                      {row.attempts ? <span className="block text-amber-700">try {row.attempts}</span> : null}
                      {row.last_error ? <span className="block text-red-700 max-w-[140px] truncate" title={row.last_error}>{row.last_error}</span> : null}
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
                      {typeof row.click_count === "number" && row.click_count > 0 ? (
                        <span className="block text-[#E6007E] font-bold">{row.click_count} click{row.click_count === 1 ? "" : "s"}</span>
                      ) : null}
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
          <li><strong>Square 24h (active):</strong> Terminal / payment / order.completed → queue → hourly cron → SMS + email with <code>/r/google-review/…</code>.</li>
          <li><strong>Failures:</strong> if neither SMS nor email lands, the row stays queued, retries up to 8 times, and Danielle gets an alert.</li>
          <li><strong>Clicks:</strong> opening the tracked link counts here, then redirects to the Google write-a-review page.</li>
          <li><strong>Bulk email (default off):</strong> old backlog sender. Do not turn on unless you want a second ask.</li>
          <li>60-day per-client cooldown. Fresha is retired — it does not send review asks anymore.</li>
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
