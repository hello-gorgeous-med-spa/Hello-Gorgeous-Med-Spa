"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Autoplay Journey video (muted by browser policy) with Tap to play / Tap for sound.
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
  /** Hide the sound control for known silent clips (e.g. motion graphics). */
  hasAudio = true,
}: {
  src: string;
  label: string;
  poster?: string;
  className?: string;
  aspectClassName?: string;
  objectClassName?: string;
  preload?: "none" | "metadata" | "auto";
  hasAudio?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const tryPlay = useCallback(async (withSound: boolean) => {
    const v = videoRef.current;
    if (!v) return false;
    v.muted = !withSound;
    v.defaultMuted = !withSound;
    if (withSound) v.volume = 1;
    try {
      await v.play();
      setMuted(!withSound);
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    setMuted(true);
    setReady(false);
    setPlaying(false);
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 1;
    void tryPlay(false);
  }, [src, tryPlay]);

  // Retry muted autoplay when the clip scrolls into view (mobile Safari often blocks early play).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const v = videoRef.current;
        if (!v || !v.paused) return;
        void tryPlay(false);
      },
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [src, tryPlay]);

  const onPrimaryTap = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // First tap: start playback (muted). Second tap via sound button unmutes.
      await tryPlay(false);
      return;
    }
    if (hasAudio && muted) {
      await tryPlay(true);
    }
  }, [hasAudio, muted, tryPlay]);

  const toggleSound = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      const ok = await tryPlay(true);
      if (!ok) {
        // Some browsers require play() from the same gesture after unmute fails once.
        v.muted = false;
        v.defaultMuted = false;
        v.volume = 1;
        try {
          await v.play();
          setMuted(false);
          setPlaying(true);
        } catch {
          /* still blocked */
        }
      }
    } else {
      v.muted = true;
      v.defaultMuted = true;
      setMuted(true);
    }
  }, [muted, tryPlay]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full overflow-hidden bg-black ${aspectClassName} ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload={preload}
        onLoadedData={() => {
          setReady(true);
          void tryPlay(false);
        }}
        onCanPlay={() => {
          setReady(true);
          if (videoRef.current?.paused) void tryPlay(false);
        }}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={() => void onPrimaryTap()}
        className={`absolute inset-0 h-full w-full cursor-pointer ${objectClassName}`}
        aria-label={label}
      />

      {!playing ? (
        <button
          type="button"
          onClick={() => void onPrimaryTap()}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/35"
          aria-label="Play video"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/75 px-5 py-3 text-sm font-extrabold uppercase tracking-wide text-white backdrop-blur">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
            Tap to play
          </span>
        </button>
      ) : null}

      {hasAudio && playing ? (
        <button
          type="button"
          onClick={() => void toggleSound()}
          className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-3.5 py-2 text-xs font-extrabold uppercase tracking-wide text-white backdrop-blur transition hover:border-[#FF2D8E] hover:text-[#FF2D8E] sm:bottom-4 sm:right-4 sm:px-4 sm:text-sm"
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
      ) : null}

      {!ready ? (
        <div className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
      ) : null}
    </div>
  );
}
