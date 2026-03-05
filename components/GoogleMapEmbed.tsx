"use client";

import { getMapsEmbedUrl, MAPS_DIRECTIONS_URL } from "@/lib/local-seo";

interface GoogleMapEmbedProps {
  className?: string;
  height?: string | number;
  /** Use loading="lazy" for below-fold. Omit for above-fold (e.g. footer). */
  loading?: "lazy" | "eager";
  /** Show Get Directions button below map */
  showDirectionsButton?: boolean;
}

export function GoogleMapEmbed({
  className = "",
  height = 300,
  loading = "lazy",
  showDirectionsButton = true,
}: GoogleMapEmbedProps) {
  const embedUrl = getMapsEmbedUrl();
  const numHeight = typeof height === "number" ? height : 300;

  if (!embedUrl) {
    return (
      <div className={`overflow-hidden rounded-xl border border-black bg-black/20 ${className}`}>
        <a
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-3 text-white hover:text-[#FF2D8E] transition-colors"
          style={{ minHeight: Math.max(numHeight, 200), padding: 24 }}
        >
          <span className="text-4xl" aria-hidden>📍</span>
          <span className="font-semibold text-center">View on Google Maps</span>
          <span className="text-sm text-white/80 text-center">74 W. Washington St, Oswego, IL 60543</span>
        </a>
        {showDirectionsButton && (
          <a
            href={MAPS_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#FF2D8E] hover:text-pink-300 transition-colors"
          >
            <span>📍</span> Get Directions
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-black ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height={numHeight}
        style={{ border: 0, minHeight: 280 }}
        allowFullScreen
        loading={loading}
        referrerPolicy="no-referrer-when-downgrade"
        title="Hello Gorgeous Med Spa - 74 W Washington Street, Oswego, IL"
      />
      {showDirectionsButton && (
        <a
          href={MAPS_DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#FF2D8E] hover:text-pink-300 transition-colors"
        >
          <span>📍</span> Get Directions
        </a>
      )}
    </div>
  );
}
