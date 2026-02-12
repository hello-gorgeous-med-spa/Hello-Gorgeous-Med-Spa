"use client";

import { useState, useEffect } from "react";

const LINES = [
  "REAL CLINIC",
  "REAL PROVIDERS",
  "REAL INJECTABLES",
  "REAL RESULTS",
  "REAL PATIENTS",
  "REAL AUTHORITY",
];

const FADE_IN_MS = 600;
const VISIBLE_MS = 2500;
const FADE_OUT_MS = 600;
export function AuthorityIntro() {
  const [opacity, setOpacity] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t1 = setTimeout(() => setOpacity(1), 50);
    const t2 = setTimeout(() => setOpacity(0), FADE_IN_MS + VISIBLE_MS);
    const t3 = setTimeout(() => setDone(true), FADE_IN_MS + VISIBLE_MS + FADE_OUT_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [mounted]);

  if (!mounted || done) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
      style={{
        opacity,
        transition: `opacity ${opacity === 1 ? FADE_IN_MS : FADE_OUT_MS}ms ease-out`,
      }}
      aria-live="polite"
      aria-label="Authority message"
    >
      <div className="text-center px-6">
        <div className="space-y-2 text-white">
          {LINES.map((line) => (
            <p
              key={line}
              className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase"
            >
              {line}
            </p>
          ))}
        </div>
        <p className="mt-6 text-lg md:text-xl text-gray-300 font-medium">
          Medical Experts. Real Results.
        </p>
      </div>
    </div>
  );
}
