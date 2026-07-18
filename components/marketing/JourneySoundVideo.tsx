"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Autoplay Journey video (muted by browser policy) with a one-tap Unmute control.
 * Sound requires a user gesture — we never force audio without a click.
 */
export function JourneySoundVideo({
  src,
  label,
  poster,
  className = "",
  aspectClassName = "aspect-video",
  objectClassName = "object-contain",
  preload = "metadata",
}: {
  src: string;
  label: string;
  poster?: string;
  className?: string;
  aspectClassName?: string;
  objectClassName?: string;
  preload?: "none" | "metadata" | "auto";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {
      /* autoplay blocked — controls still available via unmute tap which also plays */
    });
  }, [src]);

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      try {
        await v.play();
        setMuted(false);
      } catch {
        /* keep muted if play with sound fails */
      }
    } else {
      v.muted = true;
      setMuted(true);
    }
  }, [muted]);

  return (
    <div className={`relative w-full overflow-hidden bg-black ${aspectClassName} ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        onLoadedData={() => setReady(true)}
        className={`absolute inset-0 h-full w-full ${objectClassName}`}
        aria-label={label}
      />

      <button
        type="button"
        onClick={() => void toggleSound()}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-white backdrop-blur transition hover:border-[#FF2D8E] hover:text-[#FF2D8E] sm:bottom-4 sm:right-4 sm:px-4 sm:text-sm"
        aria-pressed={!muted}
        aria-label={muted ? "Unmute video" : "Mute video"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
          {muted ? (
            <>
              <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
              <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
              <path
                d="M15.5 8.5a5 5 0 010 7M18.5 6a9 9 0 010 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>
        {muted ? "Tap for sound" : "Mute"}
      </button>

      {!ready ? (
        <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
      ) : null}
    </div>
  );
}
