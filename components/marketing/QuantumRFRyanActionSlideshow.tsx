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
    <section className="border-y border-black/10 bg-white py-8 md:py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E6007E]">Quantum RF in clinic</p>
            <h2 className="mt-1 text-xl font-bold text-black md:text-2xl">Ryan in Action</h2>
            <p className="mt-1 text-sm text-black/65">
              Real treatment footage showing live Quantum RF technique.
            </p>
          </div>
          <Link
            href="/services/quantum-rf"
            className="inline-flex items-center justify-center rounded-full border border-black/20 px-4 py-2 text-xs font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
          >
            Quantum RF details
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-black/10 bg-black shadow-sm">
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

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-black">{activeVideo.label}</p>
            <p className="text-xs text-black/60">{activeVideo.note}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="rounded-md border border-black/20 px-3 py-1.5 text-xs font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-md border border-black/20 px-3 py-1.5 text-xs font-semibold text-black transition hover:border-[#E6007E] hover:text-[#E6007E]"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {ACTION_VIDEOS.map((video, idx) => (
            <button
              key={video.src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`rounded-md border px-3 py-2 text-left text-xs transition ${
                idx === activeIndex
                  ? "border-[#E6007E] bg-[#FFF0F7] text-black"
                  : "border-black/15 bg-white text-black/75 hover:border-black/35"
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
