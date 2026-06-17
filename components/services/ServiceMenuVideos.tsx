"use client";

import { useId } from "react";

import type { ServiceMenuVideo } from "@/lib/service-menu-types";

function videoFrameClass(video: ServiceMenuVideo, variant: "hero" | "card") {
  const isPortrait = video.aspect === "portrait";
  if (variant === "hero") {
    return isPortrait
      ? "relative mx-auto aspect-[9/16] w-full max-w-md sm:max-w-lg"
      : "relative aspect-video w-full";
  }
  return isPortrait
    ? "relative mx-auto aspect-[9/16] w-full max-w-xs sm:max-w-sm"
    : "relative aspect-video w-full";
}

export function MenuVideoPlayer({
  video,
  variant = "card",
}: {
  video: ServiceMenuVideo;
  variant?: "hero" | "card";
}) {
  return (
    <div className={videoFrameClass(video, variant)}>
      <video
        className="absolute inset-0 h-full w-full object-contain bg-black"
        controls
        playsInline
        preload="metadata"
        poster={video.poster}
        title={video.title}
      >
        <source src={video.src} type="video/mp4" />
      </video>
    </div>
  );
}

export function ServiceMenuHeroVideo({ video }: { video: ServiceMenuVideo }) {
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
        <MenuVideoPlayer video={video} variant="hero" />
        <div className="border-t border-white/10 px-4 py-3 text-center sm:text-left">
          <p className="text-sm font-bold text-[#FFB8DC]">{video.title}</p>
          {video.description ? (
            <p className="mt-1 text-xs leading-relaxed text-gray-400">{video.description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ServiceMenuVideos({
  videos,
  title = "See Morpheus8 Burst in action",
}: {
  videos: ServiceMenuVideo[];
  title?: string;
}) {
  const titleId = useId();

  if (videos.length === 0) return null;

  return (
    <div className="w-full" aria-labelledby={titleId}>
      <h2 id={titleId} className="text-center font-serif text-xl md:text-2xl text-white mb-2">
        {title}
      </h2>
      <p className="text-center text-sm text-gray-400 mb-8 max-w-xl mx-auto">
        Real procedure footage from Hello Gorgeous Med Spa — Oswego, IL.
      </p>
      <div className={`grid gap-6 ${videos.length > 1 ? "md:grid-cols-2" : "max-w-lg mx-auto"}`}>
        {videos.map((video) => (
          <div key={video.src} className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
            <MenuVideoPlayer video={video} variant="card" />
            <div className="border-t border-white/10 px-4 py-3">
              <p className="text-sm font-bold text-[#FFB8DC]">{video.title}</p>
              {video.description ? (
                <p className="mt-1 text-xs leading-relaxed text-gray-400">{video.description}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
