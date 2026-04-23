"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

type Slide = { src: string; tab: string; title: string };

const SLIDES: Slide[] = [
  {
    src: "/images/quantum-rf/clinical-ba-lower-face-jawline.png",
    tab: "Jawline",
    title: "Jawline contour",
  },
  {
    src: "/images/quantum-rf/clinical-ba-jawline-neck-tightening.png",
    tab: "Chin & neck",
    title: "Chin & neck",
  },
  {
    src: "/images/quantum-rf/clinical-ba-profile-jawline-submental.png",
    tab: "Lower face",
    title: "Lower face & profile",
  },
  {
    src: "/images/quantum-rf/clinical-ba-upper-arm-tightening.png",
    tab: "Arms",
    title: "Arms",
  },
  {
    src: "/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png",
    tab: "Abdomen",
    title: "Abdomen",
  },
  {
    src: "/images/quantum-rf/clinical-ba-knee-skin-tightening.png",
    tab: "Knees",
    title: "Knees & thighs",
  },
];

function setSlider(clipRef: { current: HTMLDivElement | null }, handleRef: { current: HTMLDivElement | null }, pct: number) {
  const p = Math.max(2, Math.min(98, pct));
  if (clipRef.current) {
    clipRef.current.style.clipPath = `inset(0 0 0 ${p}%)`;
  }
  if (handleRef.current) {
    handleRef.current.style.left = `${p}%`;
  }
}

export function ModelExperienceBeforeAfter() {
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const beforeRef = useRef<HTMLImageElement | null>(null);
  const afterRef = useRef<HTMLImageElement | null>(null);
  const afterWrapRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const s = SLIDES[idx]!;

  const onPointer = useCallback(
    (clientX: number) => {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setSlider(afterWrapRef, handleRef, pct);
    },
    []
  );

  useEffect(() => {
    const b = beforeRef.current;
    const a = afterRef.current;
    if (b) {
      b.style.objectPosition = "left center";
      b.style.width = "200%";
    }
    if (a) {
      a.style.objectPosition = "right center";
      a.style.width = "200%";
      a.style.left = "-100%";
      a.style.position = "absolute";
    }
    setSlider(afterWrapRef, handleRef, 50);
  }, [idx, s.src]);

  useEffect(() => {
    if (!drag) return;
    const up = () => setDrag(false);
    const move = (e: MouseEvent) => onPointer(e.clientX);
    const tmove = (e: TouchEvent) => {
      if (e.touches[0]) onPointer(e.touches[0].clientX);
    };
    window.addEventListener("mouseup", up);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchend", up);
    window.addEventListener("touchmove", tmove, { passive: true });
    return () => {
      window.removeEventListener("mouseup", up);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchend", up);
      window.removeEventListener("touchmove", tmove);
    };
  }, [drag, onPointer]);

  return (
    <div className="cml-ba-wrap">
      <h3 id={titleId} className="sr-only">
        Before and after — drag the handle to compare
      </h3>
      <div
        className="cml-ba-tabs"
        role="tablist"
        aria-label="Treatment area"
        aria-orientation="horizontal"
      >
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            id={`cml-tab-${i}`}
            className={"cml-ba-tab" + (i === idx ? " cml-active" : "")}
            aria-selected={i === idx}
            onClick={() => setIdx(i)}
          >
            {slide.tab}
          </button>
        ))}
      </div>
      <div
        className="cml-ba-stage"
        ref={stageRef}
        role="region"
        aria-labelledby={titleId}
        onClick={(e) => onPointer(e.clientX)}
        onMouseDown={(e) => {
          setDrag(true);
          onPointer(e.clientX);
        }}
        onTouchStart={(e) => {
          setDrag(true);
          if (e.touches[0]) onPointer(e.touches[0].clientX);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            const el = stageRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const current =
              (parseFloat(handleRef.current?.style.left || "50") / 100) * rect.width + rect.left;
            const next = e.key === "ArrowLeft" ? current - rect.width * 0.05 : current + rect.width * 0.05;
            onPointer(next);
          }
        }}
      >
        <img
          ref={beforeRef}
          className="cml-ba-img"
          src={s.src}
          alt={`Representative clinical before and after — ${s.title} (left half of image)`}
          draggable={false}
        />
        <div ref={afterWrapRef} className="cml-ba-after-wrap">
          <img
            ref={afterRef}
            className="cml-ba-img"
            src={s.src}
            alt={`Representative clinical before and after — ${s.title} (right half of image)`}
            draggable={false}
          />
        </div>
        <span className="cml-ba-label cml-before">Before</span>
        <span className="cml-ba-label cml-after">After</span>
        <div ref={handleRef} className="cml-ba-handle" />
      </div>
      <div className="cml-ba-caption">
        <span className="cml-btitle">{s.title}</span>
        <span className="cml-bhint">Individual results vary</span>
      </div>
    </div>
  );
}
