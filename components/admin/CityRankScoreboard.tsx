"use client";

import { Fragment, useEffect, useState } from "react";

interface CityRank {
  city: string;
  queryCount: number;
  bestPosition: number | null;
  avgPosition: number | null;
  impressions: number;
  clicks: number;
  topQueries: Array<{ query: string; position: number; impressions: number; clicks: number }>;
}

interface RankResponse {
  ok: boolean;
  connected: boolean;
  reason?: string;
  property?: string;
  window?: { startDate: string; endDate: string };
  cities: CityRank[];
}

function positionColor(pos: number | null): string {
  if (pos == null) return "text-black/40";
  if (pos <= 3) return "text-green-600";
  if (pos <= 10) return "text-amber-600";
  return "text-red-600";
}

function positionLabel(pos: number | null): string {
  if (pos == null) return "—";
  if (pos <= 3) return `#${pos} · Map/Top`;
  if (pos <= 10) return `#${pos} · Page 1`;
  if (pos <= 20) return `#${pos} · Page 2`;
  return `#${pos}`;
}

export function CityRankScoreboard() {
  const [data, setData] = useState<RankResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/local-dominance/rank-tracker")
      .then((r) => r.json())
      .then((d: RankResponse) => setData(d))
      .catch(() => setData({ ok: false, connected: false, reason: "Failed to load.", cities: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border-2 border-black bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-black text-black">City Rank Scoreboard</h2>
        {data?.window ? (
          <span className="text-xs text-black/50">
            Last 28 days · Google Search
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-black/70">
        Real Google ranking data per target city. Lower position = higher on the page (1 is the top).
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-black/60">Loading live rankings…</p>
      ) : !data?.connected ? (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Search Console not connected yet.</p>
          <p className="mt-1">{data?.reason ?? "Connect Google Search Console to see live rankings."}</p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5 text-black/70">
              <tr>
                <th className="px-3 py-2 font-semibold">City</th>
                <th className="px-3 py-2 font-semibold">Avg position</th>
                <th className="px-3 py-2 font-semibold">Best</th>
                <th className="px-3 py-2 font-semibold">Keywords</th>
                <th className="px-3 py-2 font-semibold">Impressions</th>
                <th className="px-3 py-2 font-semibold">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {data.cities.map((c) => (
                <Fragment key={c.city}>
                  <tr
                    className="cursor-pointer border-t border-black/10 hover:bg-pink-50"
                    onClick={() => setExpanded(expanded === c.city ? null : c.city)}
                  >
                    <td className="px-3 py-2 font-bold text-black">{c.city}</td>
                    <td className={`px-3 py-2 font-semibold ${positionColor(c.avgPosition)}`}>
                      {positionLabel(c.avgPosition)}
                    </td>
                    <td className={`px-3 py-2 ${positionColor(c.bestPosition)}`}>
                      {c.bestPosition != null ? `#${c.bestPosition}` : "—"}
                    </td>
                    <td className="px-3 py-2 text-black/80">{c.queryCount}</td>
                    <td className="px-3 py-2 text-black/80">{c.impressions.toLocaleString()}</td>
                    <td className="px-3 py-2 text-black/80">{c.clicks.toLocaleString()}</td>
                  </tr>
                  {expanded === c.city && c.topQueries.length > 0 ? (
                    <tr className="border-t border-black/10 bg-pink-50/50">
                      <td colSpan={6} className="px-3 py-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black/60">
                          Top queries for {c.city}
                        </p>
                        <ul className="space-y-1">
                          {c.topQueries.map((q) => (
                            <li key={q.query} className="flex justify-between gap-4 text-xs">
                              <span className="truncate text-black/80">{q.query}</span>
                              <span className={`shrink-0 font-semibold ${positionColor(q.position)}`}>
                                #{q.position} · {q.impressions.toLocaleString()} impr · {q.clicks} clicks
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
