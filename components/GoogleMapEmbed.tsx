"use client";

import { MAPS_EMBED_URL, MAPS_DIRECTIONS_URL } from "@/lib/local-seo";

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
  return (
    <div className={`overflow-hidden rounded-xl border border-black ${className}`}>
      <iframe
        src={MAPS_EMBED_URL}
        width="100%"
        height={typeof height === "number" ? height : height}
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
