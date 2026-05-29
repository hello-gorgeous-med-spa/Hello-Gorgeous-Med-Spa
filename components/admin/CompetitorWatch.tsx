"use client";

import { Fragment, useEffect, useState } from "react";

interface PlaceRow {
  name: string;
  rating: number | null;
  reviews: number;
  isUs: boolean;
}
interface CityCompetition {
  city: string;
  query: string;
  ourRank: number | null;
  ourRating: number | null;
  ourReviews: number | null;
  places: PlaceRow[];
  error?: string;
}
interface Resp {
  ok: boolean;
  connected: boolean;
  reason?: string;
  generatedAt?: string;
  cities: CityCompetition[];
}

function rankBadge(rank: number | null): { label: string; cls: string } {
  if (rank == null) return { label: "Not in top 10", cls: "bg-red-100 text-red-700" };
  if (rank === 1) return { label: "#1 🥇", cls: "bg-green-100 text-green-700" };
  if (rank <= 3) return { label: `#${rank} · top 3`, cls: "bg-amber-100 text-amber-700" };
  return { label: `#${rank}`, cls: "bg-orange-100 text-orange-700" };
}

export function CompetitorWatch() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/local-dominance/competitors")
      .then((r) => r.json())
      .then((d: Resp) => setData(d))
      .catch(() => setData({ ok: false, connected: false, reason: "Failed to load.", cities: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="rounded-2xl border-2 border-black bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-black text-black">Competitor Watch</h2>
        <span className="text-xs text-black/50">Live Google Places · &quot;med spa [city] IL&quot;</span>
      </div>
      <p className="mt-1 text-sm text-black/70">
        Who Google ranks in each city, their rating &amp; review count, and where you sit. Click a city for the top 5.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-black/60">Loading live competitor data…</p>
      ) : !data?.connected ? (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Places API not available here.</p>
          <p className="mt-1">{data?.reason ?? "Set GOOGLE_PLACES_API_KEY in this environment."}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {data.cities.map((c) => {
            const badge = rankBadge(c.ourRank);
            return (
              <Fragment key={c.city}>
                <button
                  onClick={() => setOpen(open === c.city ? null : c.city)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-left hover:bg-pink-50"
                >
                  <span className="font-bold text-black">{c.city}</span>
                  <span className="flex items-center gap-3 text-sm">
                    {c.ourRating != null ? (
                      <span className="text-black/60">
                        You: {c.ourRating}★ ({c.ourReviews})
                      </span>
                    ) : null}
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.cls}`}>{badge.label}</span>
                  </span>
                </button>
                {open === c.city ? (
                  <div className="rounded-xl border border-black/10 bg-pink-50/40 px-4 py-3">
                    {c.error ? (
                      <p className="text-xs text-red-600">{c.error}</p>
                    ) : (
                      <ol className="space-y-1 text-sm">
                        {c.places.map((p, i) => (
                          <li
                            key={p.name + i}
                            className={`flex justify-between gap-3 ${p.isUs ? "font-bold text-[#E6007E]" : "text-black/80"}`}
                          >
                            <span className="truncate">
                              {i + 1}. {p.name} {p.isUs ? "← YOU" : ""}
                            </span>
                            <span className="shrink-0">
                              {p.rating ?? "—"}★ ({p.reviews})
                            </span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                ) : null}
              </Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
}
