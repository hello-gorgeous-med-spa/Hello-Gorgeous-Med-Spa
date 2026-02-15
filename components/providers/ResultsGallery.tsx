"use client";

import { useMemo, useState } from "react";

import { BeforeAfterSlider } from "./BeforeAfterSlider";

type ResultItem = {
  id: string;
  title: string;
  description?: string | null;
  before_image_url?: string | null;
  after_image_url?: string | null;
  service_tag?: string | null;
  alt_text?: string | null;
};

const SERVICE_LABELS: Record<string, string> = {
  botox: "Botox",
  lip_filler: "Lip Filler",
  prp: "PRP / PRF",
  hormone_therapy: "Hormone Therapy",
  weight_loss: "Weight Loss",
  microneedling: "Microneedling",
  laser: "Laser",
  other: "Other",
};

export function ResultsGallery({ results }: { results: ResultItem[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Get unique service tags from results
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    results.forEach((r) => {
      if (r.service_tag) tags.add(r.service_tag);
    });
    return Array.from(tags);
  }, [results]);

  // Filter results based on selected tag
  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    return results.filter((r) => r.service_tag === activeFilter);
  }, [results, activeFilter]);

  if (results.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Filter Pills */}
      {availableTags.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-[#E6007E] text-white shadow-lg shadow-pink-500/30"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            }`}
          >
            All Results ({results.length})
          </button>
          {availableTags.map((tag) => {
            const count = results.filter((r) => r.service_tag === tag).length;
            return (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === tag
                    ? "bg-[#E6007E] text-white shadow-lg shadow-pink-500/30"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {SERVICE_LABELS[tag] || tag} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Results Grid */}
      <div className="space-y-10">
        {filteredResults.map((result) => (
          <div key={result.id} className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-semibold">{result.title}</h3>
                <p className="text-sm text-white/60">{result.description}</p>
              </div>
              {result.service_tag && (
                <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em]">
                  {SERVICE_LABELS[result.service_tag] || result.service_tag}
                </span>
              )}
            </div>
            {result.before_image_url && result.after_image_url && (
              <BeforeAfterSlider
                beforeUrl={result.before_image_url}
                afterUrl={result.after_image_url}
                alt={result.alt_text || result.title}
              />
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResults.length === 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-white/60">No results found for this filter.</p>
          <button
            onClick={() => setActiveFilter("all")}
            className="mt-4 text-pink-400 hover:text-pink-300 font-semibold"
          >
            View all results
          </button>
        </div>
      )}
    </div>
  );
}
