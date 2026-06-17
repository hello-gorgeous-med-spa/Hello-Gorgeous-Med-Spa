"use client";

import { useId } from "react";

import type { ServiceMenuVideo } from "@/lib/service-menu-types";

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
      <div className={`grid gap-6 ${videos.length > 1 ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
        {videos.map((video) => (
          <div key={video.src} className="overflow-hidden rounded-xl border border-white/10 bg-[#151922]">
            <div className="aspect-video bg-black">
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={video.poster}
                title={video.title}
              >
                <source src={video.src} type="video/mp4" />
              </video>
            </div>
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
