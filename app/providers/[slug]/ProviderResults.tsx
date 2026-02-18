"use client";

import { useState, useMemo } from "react";

interface Result {
  id: string;
  before_image_url?: string;
  after_image_url?: string;
  service_tag?: string;
  title?: string;
  description?: string;
}

interface ServiceTag {
  slug: string;
  name: string;
}

interface Props {
  results: Result[];
  serviceTags: ServiceTag[];
  providerName: string;
}

export function ProviderResults({ results, serviceTags, providerName }: Props) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<Result | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);

  const filteredResults = useMemo(() => {
    if (!activeFilter) return results;
    return results.filter((r) => r.service_tag === activeFilter);
  }, [results, activeFilter]);

  const usedTags = useMemo(() => {
    const tags = new Set(results.map((r) => r.service_tag).filter(Boolean));
    return serviceTags.filter((t) => tags.has(t.slug));
  }, [results, serviceTags]);

  return (
    <section className="bg-black py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-4">
          Results by <span className="text-[#E6007E]">{providerName.split(" ")[0]}</span>
        </h2>
        <p className="text-white/60 text-center mb-12">
          Real client transformations. Tap to compare before and after.
        </p>

        {/* Filter Tabs */}
        {usedTags.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                !activeFilter
                  ? "bg-[#E6007E] text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              All
            </button>
            {usedTags.map((tag) => (
              <button
                key={tag.slug}
                onClick={() => setActiveFilter(tag.slug)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  activeFilter === tag.slug
                    ? "bg-[#E6007E] text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredResults.map((result) => (
            <button
              key={result.id}
              onClick={() => setActiveResult(result)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 hover:shadow-xl transition-all duration-300"
            >
              {/* Before/After Split Preview */}
              <div className="absolute inset-0 flex">
                <div className="w-1/2 h-full relative overflow-hidden">
                  {result.before_image_url && (
                    <img
                      src={result.before_image_url}
                      alt="Before"
                      className="absolute inset-0 w-[200%] h-full object-cover"
                    />
                  )}
                </div>
                <div className="w-1/2 h-full relative overflow-hidden">
                  {result.after_image_url && (
                    <img
                      src={result.after_image_url}
                      alt="After"
                      className="absolute inset-0 w-[200%] h-full object-cover object-right"
                    />
                  )}
                </div>
              </div>

              {/* Divider line */}
              <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/50" />

              {/* Labels */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between text-xs text-white font-medium">
                  <span>Before</span>
                  <span>After</span>
                </div>
              </div>

              {/* Service tag */}
              {result.service_tag && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 text-xs font-semibold bg-[#E6007E] text-white rounded capitalize">
                    {result.service_tag.replace(/-/g, " ")}
                  </span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-semibold">Compare</span>
              </div>
            </button>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <p className="text-white/60 text-center py-12">
            No results found for this filter.
          </p>
        )}
      </div>

      {/* Comparison Modal */}
      {activeResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setActiveResult(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#E6007E] transition-colors z-10"
            onClick={() => setActiveResult(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full max-w-2xl aspect-square rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Before Image */}
            {activeResult.before_image_url && (
              <img
                src={activeResult.before_image_url}
                alt="Before"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* After Image with clip */}
            {activeResult.after_image_url && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <img
                  src={activeResult.after_image_url}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {/* Slider */}
            <div
              className="absolute inset-y-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>

            {/* Slider input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 text-white text-sm font-semibold rounded">
              Before
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-[#E6007E] text-white text-sm font-semibold rounded">
              After
            </div>
          </div>

          {/* Caption */}
          {(activeResult.title || activeResult.description) && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center max-w-lg">
              {activeResult.title && (
                <h3 className="text-white text-xl font-semibold">{activeResult.title}</h3>
              )}
              {activeResult.description && (
                <p className="text-white/70 mt-2">{activeResult.description}</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
