"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hero video frame that paints a prioritized poster first (LCP),
 * then attaches the video source only when near viewport.
 */
export function JourneyVideoFrame({
  src,
  label,
  poster,
  posterSm,
  className = "",
}: {
  src: string;
  label: string;
  poster?: string;
  /** Optional smaller poster for phones (LCP). */
  posterSm?: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const lcpPoster = posterSm || poster;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadVideo(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!loadVideo) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {
      /* autoplay may be blocked — poster remains visible */
    });
  }, [loadVideo]);

  return (
    <div
      ref={rootRef}
      className={`mx-auto w-full overflow-hidden rounded-3xl border border-[#FF2D8E]/35 shadow-[0_20px_60px_rgba(255,45,142,0.22)] ${className}`}
    >
      <div className="relative aspect-video w-full bg-black">
        {lcpPoster ? (
          <Image
            src={lcpPoster}
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 512px"
            className={
              poster && posterSm ? "object-contain lg:hidden" : "object-contain"
            }
            aria-hidden
          />
        ) : null}
        {poster && posterSm ? (
          <Image
            src={poster}
            alt=""
            fill
            sizes="512px"
            className="hidden object-contain lg:block"
            aria-hidden
          />
        ) : null}
        {loadVideo ? (
          <video
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={lcpPoster}
            className="absolute inset-0 h-full w-full object-contain"
            aria-label={label}
          />
        ) : null}
      </div>
    </div>
  );
}
