"use client";

import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  alt?: string;
  aspectRatio?: "square" | "video" | "portrait";
  className?: string;
};

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  alt,
  aspectRatio = "square",
  className = "",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const aspectClass =
    aspectRatio === "portrait"
      ? "aspect-[9/16]"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-square";

  const handleMove = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setPosition(x);
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  // Global move/end listeners for drag
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );
  const handleGlobalMouseUp = useCallback(() => setIsDragging(false), []);
  const handleGlobalTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        handleMove(e.touches[0].clientX);
      }
    },
    [isDragging, handleMove]
  );
  const handleGlobalTouchEnd = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    window.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
    window.addEventListener("touchend", handleGlobalTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("touchmove", handleGlobalTouchMove);
      window.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp, handleGlobalTouchMove, handleGlobalTouchEnd]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-xl border border-black bg-white shadow-sm select-none touch-none ${aspectClass}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ userSelect: isDragging ? "none" : undefined }}
      >
        {/* After (base layer) */}
        <div className="absolute inset-0">
          <Image
            src={afterUrl}
            alt={alt ? `${alt} - After` : "After"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
          />
        </div>

        {/* Before (clipped) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <Image
            src={beforeUrl}
            alt={alt ? `${alt} - Before` : "Before"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={false}
            style={{ maxWidth: "none", width: "100%" }}
          />
        </div>

        {/* Divider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize z-10"
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.2)",
          }}
          aria-hidden
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-black hover:scale-110 active:scale-95 transition-transform">
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-between px-4 pointer-events-none">
          <span className="px-2.5 py-1 bg-black/60 text-white text-xs font-medium rounded-full">
            Before
          </span>
          <span className="px-2.5 py-1 bg-[#FF2D8E]/90 text-white text-xs font-medium rounded-full">
            After
          </span>
        </div>
      </div>

      {/* Range input for keyboard + click-to-seek */}
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="w-full h-2 accent-pink-500 rounded-full cursor-pointer"
        aria-label="Adjust before and after comparison"
      />
    </div>
  );
}
