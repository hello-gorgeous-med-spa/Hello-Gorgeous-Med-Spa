"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  ATELIER_INTRO_POSTER,
  ATELIER_INTRO_SESSION_KEY,
  ATELIER_INTRO_VIDEO,
} from "@/lib/homepage-atelier";

export function HomepageIntroReel() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);

  const dismiss = useCallback(() => {
    setLeaving(true);
    try {
      window.sessionStorage.setItem(ATELIER_INTRO_SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setShow(false), 520);
  }, []);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATELIER_INTRO_SESSION_KEY) === "1") {
        setShow(false);
        return;
      }
    } catch {
      /* first visit */
    }

    const video = videoRef.current;
    if (!video) return;

    const playMuted = () => {
      video.muted = true;
      video.defaultMuted = true;
      setMuted(true);
      void video.play().catch(() => {
        /* user can tap */
      });
    };

    video.muted = false;
    video.play().then(() => setMuted(false)).catch(playMuted);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      role="dialog"
      aria-label="Hello Gorgeous Medical Spa intro"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        src={ATELIER_INTRO_VIDEO}
        poster={ATELIER_INTRO_POSTER}
        playsInline
        autoPlay
        preload="auto"
        onEnded={dismiss}
      />
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-4">
        <button
          type="button"
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            const next = !muted;
            video.muted = next;
            video.defaultMuted = next;
            setMuted(next);
            if (!next) void video.play().catch(() => undefined);
          }}
          className="rounded-full border border-white/40 bg-black/50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full border border-white/40 bg-black/50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
