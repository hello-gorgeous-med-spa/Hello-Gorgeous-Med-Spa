"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatUsd,
  type CcOverviewPayload,
  type CcOverviewRange,
} from "@/lib/command-center";

const PINK = "#FF2D8E";
const PINK_300 = "#FF92CC";
const PINK_100 = "#FFE0F0";

function formatApptTime(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/Chicago",
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type Props = {
  visible: boolean;
};

export default function CommandCenterOverview({ visible }: Props) {
  const [range, setRange] = useState<CcOverviewRange>("week");
  const [data, setData] = useState<CcOverviewPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (r: CcOverviewRange) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/command-center/overview?range=${r}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not load overview");
      setData(json as CcOverviewPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) void load(range);
  }, [visible, range, load]);

  const maxWeek = Math.max(1, ...(data?.weeks.map((w) => w.amount) || [1]));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
            Practice overview
          </div>
          <h1
            className="text-[32px] font-extrabold tracking-tight mt-1"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Welcome back.
          </h1>
          <p className="text-[#666] text-sm mt-1">
            Square payments (synced) · Chicago time
            {data?.lastSyncedAt ? (
              <>
                {" "}
                · last sync{" "}
                {new Date(data.lastSyncedAt).toLocaleString("en-US", {
                  timeZone: "America/Chicago",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </>
            ) : null}
          </p>
        </div>
        <div className="inline-flex rounded-full bg-black/[0.06] p-1 self-start">
          {(
            [
              ["today", "Today"],
              ["week", "This week"],
              ["month", "This month"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRange(id)}
              className="px-3.5 py-2 rounded-full text-xs font-bold transition-colors"
              style={{
                background: range === id ? PINK : "transparent",
                color: range === id ? "#fff" : "#444",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {(data?.kpis || []).map((kpi) => (
          <div
            key={kpi.id}
            className="bg-white border border-black/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#888]">
              {kpi.label}
            </div>
            <div
              className="text-[34px] font-extrabold mt-2 leading-none"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              {loading && !data ? "…" : kpi.display}
            </div>
            <div className="text-xs text-[#777] mt-2">{kpi.sub}</div>
          </div>
        ))}
        {!data && loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-black/10 rounded-2xl p-5 h-[120px] animate-pulse"
            />
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-4">
        <div className="bg-white border border-black/10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
            Square revenue
          </div>
          <h2
            className="text-lg font-bold mt-1 mb-4"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Last 8 weeks
          </h2>
          <div className="flex items-end gap-2 h-40">
            {(data?.weeks || []).map((w) => {
              const h = Math.max(4, Math.round((w.amount / maxWeek) * 100));
              const isLatest = w.end === data?.asOf;
              return (
                <div key={w.start} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="text-[10px] font-semibold text-[#888] tabular-nums">
                    {w.amount > 0 ? formatUsd(w.amount).replace(".00", "") : "—"}
                  </div>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${h}%`,
                      background: isLatest ? PINK : PINK_300,
                      minHeight: 4,
                    }}
                    title={`${w.start} → ${w.end}: ${formatUsd(w.amount)}`}
                  />
                  <div className="text-[10px] font-bold text-[#666]">{w.label}</div>
                </div>
              );
            })}
            {!data?.weeks?.length && (
              <div
                className="w-full h-full rounded-xl border-2 border-dashed flex items-center justify-center text-sm text-[#888]"
                style={{ borderColor: PINK_100, background: "#FFF5F9" }}
              >
                No Square payments in cache yet — cron syncs every ~6h
              </div>
            )}
          </div>
        </div>

        <div className="border-2 border-black rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(255,45,142,0.12)]">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: PINK }}>
                Up next
              </div>
              <h2
                className="text-lg font-bold mt-1"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Upcoming appointments
              </h2>
            </div>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
              style={{ background: PINK }}
            >
              {data?.upcoming.length || 0}
            </span>
          </div>
          <ul className="space-y-2.5">
            {(data?.upcoming || []).map((a) => (
              <li
                key={a.id}
                className="rounded-xl bg-[#FFF5F9] border border-black/5 px-3 py-2.5"
              >
                <div className="text-sm font-bold text-black">{a.client}</div>
                <div className="text-xs text-[#666] mt-0.5">
                  {a.service} · {formatApptTime(a.time)}
                </div>
              </li>
            ))}
            {!data?.upcoming?.length && !loading && (
              <li className="text-sm text-[#777] py-6 text-center border-2 border-dashed rounded-xl border-black/10">
                No upcoming appointments in HG calendar
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
