"use client";

import Link from "next/link";
import type { BannerContent } from "@/lib/cms-readers";

/** Renders only when banner is enabled and has content. Used on homepage; content from CMS. Skips welcome-style duplicates. */
export function HomepageBanner({ banner }: { banner: BannerContent | null }) {
  if (!banner?.enabled) return null;
  const headline = banner.headline?.trim();
  const subheadline = banner.subheadline?.trim();
  const ctaText = banner.cta_text?.trim();
  const ctaUrl = banner.cta_url?.trim();
  if (!headline && !subheadline && !ctaText) return null;
  if (headline?.toLowerCase().includes("welcome")) return null;

  return (
    <section className="relative bg-gradient-to-r from-pink-900/40 via-fuchsia-900/30 to-pink-900/40 border-y border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
        <div className="flex-1">
          {headline && <h2 className="text-xl md:text-2xl font-bold text-white">{headline}</h2>}
          {subheadline && <p className="mt-1 text-gray-300">{subheadline}</p>}
        </div>
        {ctaText && ctaUrl && (
          <Link
            href={ctaUrl}
            className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-50 transition-colors"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
