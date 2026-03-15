import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface ExclusivityBannerProps {
  delay?: number;
  format: VideoFormat;
  brandColor?: string;
  goldColor?: string;
  cities?: string[];
}

export const ExclusivityBanner: React.FC<ExclusivityBannerProps> = ({
  delay = 0,
  format,
  brandColor = "#E91E8C",
  goldColor = "#FFD700",
  cities = ["Oswego", "Naperville", "Aurora", "Plainfield", "Montgomery", "Yorkville"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    from: 100,
    to: 0,
    config: { damping: 12 },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shimmer = interpolate(
    (frame - delay) % 60,
    [0, 30, 60],
    [-200, 200, -200]
  );

  const mainSize = format === "horizontal" ? 20 : format === "square" ? 22 : 26;
  const citySize = format === "horizontal" ? 14 : format === "square" ? 16 : 18;

  if (frame < delay) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${slideIn}px)`,
        textAlign: "center",
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 30px",
          background: `linear-gradient(90deg, ${brandColor}20, ${brandColor}40, ${brandColor}20)`,
          borderRadius: 50,
          border: `1px solid ${brandColor}60`,
          marginBottom: 16,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: shimmer,
            width: 60,
            height: "100%",
            background: `linear-gradient(90deg, transparent, ${brandColor}30, transparent)`,
          }}
        />
        <span style={{ fontSize: mainSize + 4, color: goldColor }}>⭐</span>
        <span
          style={{
            fontSize: mainSize,
            fontWeight: 800,
            color: "white",
            letterSpacing: 3,
          }}
        >
          ONLY IN THE WESTERN SUBURBS
        </span>
        <span style={{ fontSize: mainSize + 4, color: goldColor }}>⭐</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 8,
          maxWidth: format === "horizontal" ? 700 : 500,
          margin: "0 auto",
        }}
      >
        {cities.map((city, i) => {
          const cityDelay = delay + 10 + i * 5;
          const cityOpacity = interpolate(frame - cityDelay, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <span
              key={city}
              style={{
                opacity: cityOpacity,
                fontSize: citySize,
                color: "#ffffff90",
                padding: "4px 12px",
                borderRadius: 20,
                border: "1px solid #ffffff20",
                letterSpacing: 1,
              }}
            >
              {city}
            </span>
          );
        })}
      </div>
    </div>
  );
};
