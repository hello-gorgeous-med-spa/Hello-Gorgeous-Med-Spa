import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";

const WHITE = "#FFFFFF";
const resolveSrc = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

// Slide scene: full-bleed image with Ken Burns (slow zoom) — same as Freddie
const SlideScene: React.FC<{
  imageSrc: string;
  duration: number;
  format: VideoFormat;
}> = ({ imageSrc, duration, format }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={resolveSrc(imageSrc)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          transform: `scale(${scale})`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

// CTA slide — title card style, same as Freddie's CTA
const CTAScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
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
        <div style={{ flex: 1, background: "#E91E8C" }} />
        <div style={{ flex: 1, background: "#FF69B4" }} />
        <div style={{ flex: 1, background: "#E91E8C" }} />
      </div>
      <div style={{ textAlign: "center", zIndex: 10, opacity }}>
        <div
          style={{
            fontSize: sz * 0.7,
            fontWeight: 800,
            color: WHITE,
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
            color: "rgba(255,255,255,0.95)",
            marginBottom: 8,
          }}
        >
          Deepest FDA-Approved Fractional RF
        </div>
        <div
          style={{
            fontSize: sz * 0.45,
            fontWeight: 700,
            color: WHITE,
            marginBottom: 8,
          }}
        >
          Hello Gorgeous Med Spa
        </div>
        <div
          style={{
            fontSize: sz * 0.35,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          74 W Washington St · Oswego, IL · hellogorgeousmedspa.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Slide list: 87 slides from the clinical PDF (morpheus8-clinical/slide-001.png ... slide-087.png)
const SLIDE_DURATION = 60; // ~2 sec per slide at 30fps
const SLIDE_PREFIX = "morpheus8-clinical/slide-"; // pdftoppm outputs slide-01.png, slide-02.png, etc.
const NUM_SLIDES = 87;

function buildSlidePaths(): string[] {
  const paths: string[] = [];
  for (let i = 1; i <= NUM_SLIDES; i++) {
    // pdf-to-slides script outputs slide-001.png through slide-087.png
    paths.push(`${SLIDE_PREFIX}${String(i).padStart(3, "0")}.png`);
  }
  return paths;
}

const SLIDE_PATHS = buildSlidePaths();
const CTA_DURATION = 120; // 4s
const TOTAL_FRAMES = SLIDE_PATHS.length * SLIDE_DURATION + CTA_DURATION; // 5340

export interface Morpheus8BurstClinicalProps {
  format: VideoFormat;
  /** Optional: override slide paths. Must be in public/ or absolute URLs. */
  slides?: string[];
}

export const Morpheus8BurstClinical: React.FC<Morpheus8BurstClinicalProps> = ({
  format,
  slides = SLIDE_PATHS,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {slides.map((slideSrc, i) => (
        <Sequence
          key={slideSrc}
          from={i * SLIDE_DURATION}
          durationInFrames={SLIDE_DURATION}
        >
          <SlideScene
            imageSrc={slideSrc}
            duration={SLIDE_DURATION}
            format={format}
          />
        </Sequence>
      ))}
      <Sequence from={slides.length * SLIDE_DURATION} durationInFrames={CTA_DURATION}>
        <CTAScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES };
