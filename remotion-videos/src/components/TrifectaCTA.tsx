import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface TrifectaCTAProps {
  delay?: number;
  format: VideoFormat;
  brandColor?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  ctaText?: string;
}

export const TrifectaCTA: React.FC<TrifectaCTAProps> = ({
  delay = 0,
  format,
  brandColor = "#E91E8C",
  phone = "630-636-6193",
  website = "hellogorgeousmedspa.com",
  address = "74 W Washington St",
  city = "Oswego, IL",
  ctaText = "BOOK FREE CONSULTATION",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const pulse = Math.sin((frame - delay) * 0.12) * 0.06 + 1;

  const logoScale = spring({
    frame: frame - delay,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10 },
  });

  const contentOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonScale = spring({
    frame: frame - delay - 20,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 100 },
  });

  const titleSize = format === "horizontal" ? 44 : format === "square" ? 50 : 56;
  const textSize = format === "horizontal" ? 20 : format === "square" ? 22 : 24;
  const buttonSize = format === "horizontal" ? 24 : format === "square" ? 28 : 30;

  const GlowOrb: React.FC<{ color: string; size: number; x: number; y: number }> = ({
    color, size, x, y,
  }) => {
    const p = Math.sin(frame * 0.04) * 0.3 + 1;
    return (
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: size * p,
          height: size * p,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />
    );
  };

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, #000000 0%, #1a0a14 50%, #000000 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <GlowOrb color={brandColor} size={600} x={width * 0.15} y={height * 0.6} />
      <GlowOrb color="#FF69B4" size={400} x={width * 0.7} y={height * 0.2} />

      <div style={{ textAlign: "center", zIndex: 10, opacity: contentOpacity }}>
        <div style={{ transform: `scale(${Math.max(logoScale, 0)})`, marginBottom: 20 }}>
          <div style={{ fontSize: titleSize, fontWeight: 800, color: "white", letterSpacing: 3 }}>
            HELLO
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 3,
            }}
          >
            GORGEOUS
          </div>
          <div style={{ fontSize: titleSize * 0.3, color: "#ffffff60", marginTop: 8, letterSpacing: 6 }}>
            MED SPA
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: textSize, color: "#ffffff90" }}>
            📍 {address}, {city}
          </span>
        </div>

        <div style={{ marginBottom: 30 }}>
          <span style={{ fontSize: textSize + 2, color: "white", fontWeight: 600 }}>
            📞 {phone}
          </span>
        </div>

        <div
          style={{
            transform: `scale(${Math.max(buttonScale, 0) * pulse})`,
            display: "inline-block",
            padding: "22px 50px",
            background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
            borderRadius: 50,
            fontSize: buttonSize,
            fontWeight: 800,
            color: "white",
            letterSpacing: 2,
            boxShadow: `0 10px 50px ${brandColor}90, 0 0 80px ${brandColor}40`,
            marginBottom: 25,
          }}
        >
          {ctaText}
        </div>

        <div>
          <span style={{ fontSize: textSize, color: brandColor, fontWeight: 600, letterSpacing: 1 }}>
            {website}
          </span>
        </div>
      </div>
    </div>
  );
};
