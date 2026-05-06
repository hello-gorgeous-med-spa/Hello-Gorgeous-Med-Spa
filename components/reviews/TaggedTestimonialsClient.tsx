"use client";

import { useEffect, useMemo, useState } from "react";

type ApiRecord = {
  id: string;
  treatment: string;
  concern: string;
  provider: string;
  device: string;
  approved: boolean;
  beforeAfterPermission: string;
  quote: string;
  source: string;
};

export function TaggedTestimonialsClient() {
  const [filters, setFilters] = useState({
    treatment: "",
    concern: "",
    provider: "",
    device: "",
  });
  const [items, setItems] = useState<ApiRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams({ includeUnapproved: "true" });
    if (filters.treatment) params.set("treatment", filters.treatment);
    if (filters.concern) params.set("concern", filters.concern);
    if (filters.provider) params.set("provider", filters.provider);
    if (filters.device) params.set("device", filters.device);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/public/testimonials?${query}`)
      .then((r) => r.json())
      .then((payload) => {
        if (active) setItems(payload.data ?? []);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [query]);

  const setFilter = (key: keyof typeof filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border-2 border-black bg-white p-4 md:grid-cols-4">
        <input value={filters.treatment} onChange={(e) => setFilter("treatment", e.target.value)} placeholder="treatment" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input value={filters.concern} onChange={(e) => setFilter("concern", e.target.value)} placeholder="concern" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input value={filters.provider} onChange={(e) => setFilter("provider", e.target.value)} placeholder="provider" className="rounded border border-black/20 px-3 py-2 text-sm" />
        <input value={filters.device} onChange={(e) => setFilter("device", e.target.value)} placeholder="device" className="rounded border border-black/20 px-3 py-2 text-sm" />
      </div>

      {loading ? <p className="mt-4 text-sm text-black/60">Loading testimonials...</p> : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-black/15 bg-[#FFF0F7] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E6007E]">
              {item.treatment} · {item.concern} · {item.provider}
            </p>
            <p className="mt-2 text-black/80">{item.quote}</p>
            <p className="mt-2 text-xs text-black/60">
              approved={String(item.approved)} · beforeAfterPermission={item.beforeAfterPermission}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
