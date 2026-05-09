"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ActionVideo = {
  src: string;
  label: string;
  note: string;
};

const ACTION_VIDEOS: ActionVideo[] = [
  {
    src: "/videos/quantum-rf/ryan-quantum-rf-action-1.mp4",
    label: "Ryan in action - Sequence 1",
    note: "Live Quantum RF treatment workflow in clinic.",
  },
  {
    src: "/videos/quantum-rf/ryan-quantum-rf-action-2.mp4",
    label: "Ryan in action - Sequence 2",
    note: "Technique angle showing controlled subdermal pass.",
  },
  {
    src: "/videos/quantum-rf/ryan-quantum-rf-action-3.mp4",
    label: "Ryan in action - Sequence 3",
    note: "Procedure continuation with real-time provider handling.",
  },
];

export function QuantumRFRyanActionSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeVideo = useMemo(() => ACTION_VIDEOS[activeIndex], [activeIndex]);

  const goPrev = () => {
    setActiveIndex((idx) => (idx === 0 ? ACTION_VIDEOS.length - 1 : idx - 1));
  };

  const goNext = () => {
    setActiveIndex((idx) => (idx === ACTION_VIDEOS.length - 1 ? 0 : idx + 1));
  };

  return (
    <section className="border-y-2 border-black bg-zinc-950 py-12 text-white md:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">Quantum RF in clinic</p>
            <h2 className="mt-2 text-2xl font-black md:text-4xl">Ryan in Action - Live Procedure Clips</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/75 md:text-base">
              Real procedural footage from Hello Gorgeous showing Quantum RF treatment flow.
            </p>
          </div>
          <Link
            href="/services/quantum-rf"
            className="inline-flex items-center justify-center rounded-full bg-[#E6007E] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#c9006e]"
          >
            View full Quantum RF page
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-white/20 bg-black">
          <video
            key={activeVideo.src}
            controls
            playsInline
            preload="metadata"
            className="h-auto w-full"
            poster="/images/quantum-rf/ryan-quantum-rf-action-poster.png"
          >
            <source src={activeVideo.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{activeVideo.label}</p>
            <p className="text-xs text-white/70">{activeVideo.note}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#E6007E]"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-[#E6007E]"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {ACTION_VIDEOS.map((video, idx) => (
            <button
              key={video.src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                idx === activeIndex
                  ? "border-[#E6007E] bg-[#E6007E]/20 text-white"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-white/50"
              }`}
            >
              {video.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
