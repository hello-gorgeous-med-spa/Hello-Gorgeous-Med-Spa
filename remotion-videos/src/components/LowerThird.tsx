import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, BORDERS } from "../brand/theme";

interface LowerThirdProps {
  name: string;
  title: string;
  delay?: number;
  duration?: number;
  brandColor?: string;
  position?: "left" | "center";
}

export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  title,
  delay = 0,
  duration = 90,
  brandColor = COLORS.gold,
  position = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  if (f < 0 || f > duration) return null;

  const slideX = spring({
    frame: f,
    fps,
    from: position === "left" ? -300 : 0,
    to: 0,
    config: { damping: 14 },
  });

  const exitOpacity = interpolate(f, [duration - 15, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = spring({
    frame: f - 5,
    fps,
    from: 0,
    to: 100,
    config: { damping: 12 },
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: position === "left" ? 40 : "50%",
        transform: position === "left"
          ? `translateX(${slideX}px)`
          : `translateX(-50%) translateX(${slideX}px)`,
        opacity: exitOpacity,
        zIndex: 500,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          padding: "14px 28px",
          borderLeft: `4px solid ${brandColor}`,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: 1,
            marginBottom: 4,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 16,
            color: brandColor,
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 8,
            height: 2,
            width: `${Math.min(barWidth, 100)}%`,
            background: `linear-gradient(90deg, ${brandColor}, transparent)`,
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
};
