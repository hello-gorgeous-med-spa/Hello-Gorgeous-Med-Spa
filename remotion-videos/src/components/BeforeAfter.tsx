import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { COLORS, SHADOWS } from "../brand/theme";

type TransitionStyle = "slider" | "splitReveal" | "fade";

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  delay?: number;
  transition?: TransitionStyle;
  brandColor?: string;
  beforeLabel?: string;
  afterLabel?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeImage,
  afterImage,
  delay = 0,
  transition = "slider",
  brandColor = COLORS.hotPink,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  width = 500,
  height = 600,
  borderRadius = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const resolveSrc = (src: string) => src.startsWith("http") ? src : staticFile(src);

  if (transition === "slider") {
    // Animated slider wipe: starts showing Before, wipes to reveal After
    const sliderPos = interpolate(f, [20, 60], [95, 35], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <div style={{ opacity, position: "relative", width, height, borderRadius, overflow: "hidden" }}>
        {/* After (bottom layer) */}
        <Img
          src={resolveSrc(afterImage)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Before (top, clipped) */}
        <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 0)`, width: `${sliderPos}%`, overflow: "hidden" }}>
          <Img
            src={resolveSrc(beforeImage)}
            style={{ width, height, objectFit: "cover" }}
          />
        </div>
        {/* Slider line */}
        <div
          style={{
            position: "absolute",
            left: `${sliderPos}%`,
            top: 0,
            bottom: 0,
            width: 4,
            background: brandColor,
            boxShadow: SHADOWS.glow(brandColor, 15),
            zIndex: 10,
          }}
        />
        {/* Labels */}
        <div style={{
          position: "absolute", top: 16, left: 16, padding: "6px 14px",
          background: "rgba(0,0,0,0.6)", borderRadius: 8, fontSize: 14,
          fontWeight: 700, color: COLORS.white, letterSpacing: 2, zIndex: 20,
        }}>{beforeLabel}</div>
        <div style={{
          position: "absolute", top: 16, right: 16, padding: "6px 14px",
          background: `${brandColor}CC`, borderRadius: 8, fontSize: 14,
          fontWeight: 700, color: COLORS.white, letterSpacing: 2, zIndex: 20,
        }}>{afterLabel}</div>
      </div>
    );
  }

  if (transition === "splitReveal") {
    const splitGap = spring({ frame: f - 15, fps, from: 0, to: 12, config: { damping: 12 } });

    return (
      <div style={{ opacity, display: "flex", gap: splitGap, borderRadius, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative", borderRadius, overflow: "hidden" }}>
          <Img src={resolveSrc(beforeImage)} style={{ width: width / 2, height, objectFit: "cover" }} />
          <div style={{
            position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center",
            fontSize: 14, fontWeight: 700, color: COLORS.white, letterSpacing: 2,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}>{beforeLabel}</div>
        </div>
        <div style={{ flex: 1, position: "relative", borderRadius, overflow: "hidden" }}>
          <Img src={resolveSrc(afterImage)} style={{ width: width / 2, height, objectFit: "cover" }} />
          <div style={{
            position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center",
            fontSize: 14, fontWeight: 700, color: brandColor, letterSpacing: 2,
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}>{afterLabel}</div>
        </div>
      </div>
    );
  }

  // Fade transition
  const fadeProgress = interpolate(f, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ opacity, position: "relative", width, height, borderRadius, overflow: "hidden" }}>
      <Img
        src={resolveSrc(beforeImage)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1 - fadeProgress }}
      />
      <Img
        src={resolveSrc(afterImage)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: fadeProgress }}
      />
    </div>
  );
};
