"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ActionVideo = {
  src: string;
  clip: string;
};

const ACTION_VIDEOS: ActionVideo[] = [
  { src: "/videos/quantum-rf/ryan-quantum-rf-action-1.mp4", clip: "01" },
  { src: "/videos/quantum-rf/ryan-quantum-rf-action-2.mp4", clip: "02" },
  { src: "/videos/quantum-rf/ryan-quantum-rf-action-3.mp4", clip: "03" },
];

export function QuantumRFRyanActionSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = useMemo(() => ACTION_VIDEOS[activeIndex], [activeIndex]);

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4">

        {/* Header row */}
        <div className="flex items-end justify-between border-b border-black/10 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6007E]">
              Live procedure · Quantum RF
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-black">
              Ryan Kent, FNP-BC — in clinic
            </h2>
          </div>
          <Link
            href="/services/quantum-rf"
            className="text-[11px] font-semibold text-black/50 underline-offset-2 hover:text-[#E6007E] transition-colors"
          >
            Full procedure page →
          </Link>
        </div>

        {/* Video */}
        <div className="mt-5 overflow-hidden rounded-lg bg-black shadow-[0_4px_24px_rgba(0,0,0,0.10)]">
          <video
            key={activeVideo.src}
            controls
            playsInline
            preload="metadata"
            className="w-full h-auto block"
            poster="/images/quantum-rf/ryan-quantum-rf-action-poster.png"
          >
            <source src={activeVideo.src} type="video/mp4" />
          </video>
        </div>

        {/* Clip selector + nav */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {ACTION_VIDEOS.map((video, idx) => (
              <button
                key={video.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Clip ${video.clip}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeIndex
                    ? "w-8 bg-[#E6007E]"
                    : "w-4 bg-black/20 hover:bg-black/40"
                }`}
              />
            ))}
            <span className="ml-2 text-xs font-medium text-black/40">
              Clip {activeVideo.clip} / 0{ACTION_VIDEOS.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? ACTION_VIDEOS.length - 1 : i - 1))
              }
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/15 text-black/50 transition hover:border-black/40 hover:text-black"
              aria-label="Previous clip"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i === ACTION_VIDEOS.length - 1 ? 0 : i + 1))
              }
              className="flex h-7 w-7 items-center justify-center rounded-full border border-black/15 text-black/50 transition hover:border-black/40 hover:text-black"
              aria-label="Next clip"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-4 text-[11px] leading-relaxed text-black/40">
          Clinical footage from Hello Gorgeous Med Spa, Oswego, IL. Performed by Ryan Kent, FNP-BC.{" "}
          Individual candidacy and results vary.{" "}
          <Link href="/services/quantum-rf" className="underline underline-offset-2 hover:text-[#E6007E] transition-colors">
            Learn more about Quantum RF →
          </Link>
        </p>

      </div>
    </section>
  );
}
