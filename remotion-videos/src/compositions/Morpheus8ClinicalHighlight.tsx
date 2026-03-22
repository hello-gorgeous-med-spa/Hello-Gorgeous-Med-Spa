/**
 * Morpheus8 Clinical Highlight — curated from 87-slide PDF
 * Engaging web video: FDA, mechanism, multi-depth, before/after + Hello Gorgeous branding
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { COLORS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";

const resolveSrc = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

const BRAND = COLORS.hotPink;
const BRAND_LIGHT = COLORS.pink;
const SLIDE_PREFIX = "morpheus8-clinical/slide-";

// Branded title card between clinical slides
const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  duration: number;
  format: VideoFormat;
}> = ({ title, subtitle, duration, format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 15], [0.92, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.sectionTitle, format);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0d0d0d 0%, #1a0a14 50%, #0d0d0d 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${BRAND}, ${BRAND_LIGHT}, ${BRAND})`,
        }}
      />
      <div
        style={{
          textAlign: "center",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            fontSize: sz * 0.6,
            fontWeight: 800,
            color: "white",
            letterSpacing: 2,
            marginBottom: subtitle ? 12 : 0,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: sz * 0.35,
              color: "rgba(255,255,255,0.8)",
              fontWeight: 600,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: scaledSize(FONT_SIZES.caption, format) * 0.8,
          color: BRAND,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Hello Gorgeous Med Spa
      </div>
    </AbsoluteFill>
  );
};

// Clinical slide with Ken Burns + optional HG watermark
const ClinicalSlide: React.FC<{
  slideNum: number;
  duration: number;
  format: VideoFormat;
}> = ({ slideNum, duration, format }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.06], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const src = `${SLIDE_PREFIX}${String(slideNum).padStart(3, "0")}.png`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={resolveSrc(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${scale})`,
          opacity,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 12,
          fontSize: 11,
          color: "rgba(255,255,255,0.5)",
          fontWeight: 600,
        }}
      >
        Hello Gorgeous
      </div>
    </AbsoluteFill>
  );
};

// CTA — Hello Gorgeous branded
const CTAScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sz = scaledSize(FONT_SIZES.heading, format);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0d0d0d 0%, #1a0a14 50%, #0d0d0d 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 12,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div style={{ flex: 1, background: BRAND }} />
        <div style={{ flex: 1, background: BRAND_LIGHT }} />
        <div style={{ flex: 1, background: BRAND }} />
      </div>
      <div style={{ textAlign: "center", zIndex: 10, opacity }}>
        <div
          style={{
            fontSize: sz * 0.8,
            fontWeight: 800,
            color: "white",
            marginBottom: 12,
            letterSpacing: 1,
          }}
        >
          Morpheus8 Burst
        </div>
        <div
          style={{
            fontSize: sz * 0.5,
            fontWeight: 600,
            color: BRAND_LIGHT,
            marginBottom: 16,
          }}
        >
          Deepest FDA-Approved Fractional RF · 8mm
        </div>
        <div
          style={{
            fontSize: sz * 0.6,
            fontWeight: 800,
            color: "white",
            marginBottom: 8,
          }}
        >
          Hello Gorgeous Med Spa
        </div>
        <div
          style={{
            fontSize: sz * 0.38,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          74 W Washington St · Oswego, IL · hellogorgeousmedspa.com · (630) 636-6193
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Curated slide sequence: highlights that engage
// PDF slides: 1 Indications, 3 Depths, 5 Aging, 7 Thermal, 14 Mechanism, 22 Burst, 28 3D, 65+ B&A
const SLIDE_DURATION = 75; // ~2.5 sec per clinical slide
const TITLE_DURATION = 45; // 1.5 sec per title card
const CTA_DURATION = 150; // 5 sec

// Alternating: title → slide → title → slide ...
// Structure: Hook title → slide 1 → "Depths" title → slide 3 → ... → B&A slides → CTA
const SEGMENTS: Array<{ type: "title"; title: string; subtitle?: string } | { type: "slide"; num: number }> = [
  { type: "title", title: "Morpheus8 Burst", subtitle: "The science behind your results" },
  { type: "slide", num: 1 },
  { type: "title", title: "Up to 8mm Depth", subtitle: "The deepest FDA-approved fractional RF" },
  { type: "slide", num: 3 },
  { type: "title", title: "Collagen Remodeling", subtitle: "Break down → Build up" },
  { type: "slide", num: 5 },
  { type: "title", title: "Multi-Depth in One Pulse", subtitle: "Burst technology" },
  { type: "slide", num: 14 },
  { type: "slide", num: 22 },
  { type: "title", title: "3D Smart Frame", subtitle: "Precision energy delivery" },
  { type: "slide", num: 28 },
  { type: "title", title: "Real Results", subtitle: "Before & After" },
  { type: "slide", num: 65 },
  { type: "slide", num: 67 },
  { type: "slide", num: 69 },
  { type: "slide", num: 71 },
];

function calcTotalFrames(): number {
  let total = 0;
  for (const s of SEGMENTS) {
    total += s.type === "title" ? TITLE_DURATION : SLIDE_DURATION;
  }
  return total + CTA_DURATION;
}

const TOTAL_FRAMES = calcTotalFrames();

export interface Morpheus8ClinicalHighlightProps {
  format: VideoFormat;
}

export const Morpheus8ClinicalHighlight: React.FC<Morpheus8ClinicalHighlightProps> = ({
  format,
}) => {
  let from = 0;
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {SEGMENTS.map((seg, i) => {
        const duration = seg.type === "title" ? TITLE_DURATION : SLIDE_DURATION;
        const seq = (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {seg.type === "title" ? (
              <TitleCard
                title={seg.title}
                subtitle={seg.subtitle}
                duration={duration}
                format={format}
              />
            ) : (
              <ClinicalSlide slideNum={seg.num} duration={duration} format={format} />
            )}
          </Sequence>
        );
        from += duration;
        return seq;
      })}
      <Sequence from={from} durationInFrames={CTA_DURATION}>
        <CTAScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES as Morpheus8HighlightFrames };
