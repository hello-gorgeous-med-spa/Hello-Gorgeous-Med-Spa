"use client";

import React from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function MascotVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster?: string;
  title?: string;
}) {
  const [ready, setReady] = React.useState(false);

  // Lazy-load: don't even set <source> until visible.
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setReady(true);
      },
      { rootMargin: "200px 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reduced = prefersReducedMotion();

  return (
    <div ref={containerRef} className="w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="w-full rounded-xl bg-black"
        controls
        muted
        playsInline
        preload={ready && !reduced ? "metadata" : "none"}
        poster={poster}
      >
        {ready ? <source src={src} type="video/mp4" /> : null}
        {title ? <track kind="descriptions" label={title} /> : null}
      </video>
    </div>
  );
}

