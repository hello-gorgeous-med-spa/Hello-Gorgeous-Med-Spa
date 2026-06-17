"use client";

import { useId } from "react";

import { captionsPathForClinicVideo } from "@/lib/inmode-video-captions";
import type { ServiceMenuVideo } from "@/lib/service-menu-types";

export function VideoCard({
  video,
  layout = "default",
}: {
  video: ServiceMenuVideo;
  layout?: "default" | "split";
}) {
  const isPortrait = video.aspect === "portrait";
  const inSplit = layout === "split";
  const captionsSrc = video.captions ?? captionsPathForClinicVideo(video.src);
  const captionsId = useId();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151922] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <div
        className={`relative flex items-center justify-center bg-black ${
          inSplit || !isPortrait
            ? "aspect-video w-full"
            : "min-h-[320px] md:min-h-[360px]"
        }`}
      >
        <video
          className={`${
            inSplit || !isPortrait ? "h-full w-full" : "max-h-[360px] w-auto max-w-full"
          } object-contain`}
          controls
          playsInline
          preload="metadata"
          poster={video.poster}
          title={video.title}
          aria-describedby={captionsSrc ? captionsId : undefined}
        >
          <source src={video.src} type="video/mp4" />
          {captionsSrc ? (
            <track
              kind="captions"
              src={captionsSrc}
              srcLang="en"
              label="English"
              default
            />
          ) : null}
        </video>
        {captionsSrc ? (
          <span id={captionsId} className="sr-only">
            {video.title}. Closed captions available — enable CC in the video player.
          </span>
        ) : null}
      </div>
      <footer className="border-t border-white/10 px-4 py-3.5">
        {video.label ? (
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF2D8E]">{video.label}</p>
        ) : null}
        <p className={`font-bold text-white ${video.label ? "mt-1" : ""} text-sm leading-snug`}>{video.title}</p>
        {video.description ? (
          <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{video.description}</p>
        ) : null}
      </footer>
    </article>
  );
}

export function ServiceMenuVideos({
  videos,
  title = "See it in our Oswego clinic",
  subtitle = "Real procedure footage — watch before your free consultation.",
}: {
  videos: ServiceMenuVideo[];
  title?: string;
  subtitle?: string;
}) {
  const titleId = useId();

  if (videos.length === 0) return null;

  return (
    <div className="w-full" aria-labelledby={titleId}>
      <div className="mb-6 text-center md:mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFB8DC]">InMode · Verified Provider</p>
        <h2 id={titleId} className="mt-2 font-serif text-xl md:text-2xl text-white">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-gray-400">{subtitle}</p>
      </div>

      <div
        className={`grid gap-4 md:gap-5 ${
          videos.length > 1 ? "md:grid-cols-2 md:items-stretch" : "mx-auto max-w-2xl"
        }`}
      >
        {videos.map((video) => (
          <VideoCard key={video.src} video={video} />
        ))}
      </div>
    </div>
  );
}
