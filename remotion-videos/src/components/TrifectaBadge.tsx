import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface TrifectaBadgeProps {
  delay?: number;
  format: VideoFormat;
  brandColor?: string;
  goldColor?: string;
}

export const TrifectaBadge: React.FC<TrifectaBadgeProps> = ({
  delay = 0,
  format,
  brandColor = "#E91E8C",
  goldColor = "#FFD700",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 80 },
  });

  const glowPulse = Math.sin((frame - delay) * 0.08) * 0.3 + 1;

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mainSize = format === "horizontal" ? 28 : format === "square" ? 32 : 36;
  const subSize = format === "horizontal" ? 16 : format === "square" ? 18 : 20;

  if (frame < delay) return null;

  return (
    <div
      style={{
        transform: `scale(${Math.max(scale, 0)})`,
        opacity,
        textAlign: "center",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "20px 50px",
          borderRadius: 20,
          border: `2px solid ${goldColor}80`,
          background: `linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,10,20,0.9))`,
          boxShadow: `0 0 ${30 * glowPulse}px ${goldColor}40, inset 0 0 30px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          style={{
            fontSize: mainSize,
            fontWeight: 800,
            letterSpacing: 4,
            color: "white",
            marginBottom: 8,
          }}
        >
          <span style={{ color: brandColor }}>3</span> TECHNOLOGIES
          <span style={{ color: brandColor, margin: "0 12px" }}>·</span>
          <span style={{ color: brandColor }}>1</span> SPA
          <span style={{ color: brandColor, margin: "0 12px" }}>·</span>
          <span style={{ color: brandColor }}>0</span> SURGERY
        </div>
        <div
          style={{
            fontSize: subSize,
            color: goldColor,
            letterSpacing: 6,
            fontWeight: 600,
          }}
        >
          THE INMODE TRIFECTA
        </div>
      </div>
    </div>
  );
};
