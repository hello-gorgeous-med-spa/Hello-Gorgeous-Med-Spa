"use client";

import { useState, useEffect, useRef } from "react";
import { TIKTOK_PROFILE_URL, TIKTOK_FEATURED_VIDEO_ID } from "@/lib/social";

/** Responsive TikTok embed – lazy-loaded, no autoplay. Shows follow CTA when no video ID. */
export function TikTokEmbed() {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setInView(true);
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // No video ID – show follow CTA
  if (!TIKTOK_FEATURED_VIDEO_ID) {
    return (
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white" ref={containerRef}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <span className="text-[#FF2D8E] text-sm font-medium tracking-wide">TIKTOK</span>
            <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-[#FF2D8E]">
              Follow Us on TikTok
            </h2>
            <p className="mt-3 text-black/80 max-w-md">
              Tips, behind-the-scenes, and real results from Hello Gorgeous Med Spa.
            </p>
            <a
              href={TIKTOK_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-[#FF2D8E] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              @daniellealcala12
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Embedded video – lazy load when in view
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-white" ref={containerRef}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="text-[#FF2D8E] text-sm font-medium tracking-wide">TIKTOK</span>
          <h2 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-[#FF2D8E]">
            See Us on TikTok
          </h2>
          <p className="mt-3 text-black/80 max-w-md">
            Tips, behind-the-scenes, and real results from Hello Gorgeous Med Spa.
          </p>
        </div>
        <div className="flex justify-center">
          <div
            className="relative w-full max-w-[325px] mx-auto"
            style={{ aspectRatio: "9/16" }}
          >
            {inView ? (
              <iframe
                src={`https://www.tiktok.com/embed/v2/${TIKTOK_FEATURED_VIDEO_ID}?autoplay=0`}
                title="Hello Gorgeous Med Spa on TikTok"
                className="absolute inset-0 w-full h-full rounded-2xl border-2 border-black/10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                sandbox="allow-presentation allow-same-origin allow-scripts allow-popups"
              />
            ) : (
              <div
                className="absolute inset-0 rounded-2xl border-2 border-black/10 bg-black/5 flex items-center justify-center"
                aria-hidden
              >
                <span className="text-black/40 text-sm">Loading…</span>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 text-center">
          <a
            href={TIKTOK_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#FF2D8E] font-medium hover:underline"
          >
            Follow @daniellealcala12 on TikTok
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
