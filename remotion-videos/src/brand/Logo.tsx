import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { COLORS, GRADIENTS, type VideoFormat, scaledSize, FONT_SIZES } from "./theme";

// Hello Gorgeous wordmark logo
export const Logo: React.FC<{
  format: VideoFormat;
  variant?: "full" | "compact" | "watermark";
  color?: string;
}> = ({ format, variant = "full", color = COLORS.white }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, variant === "watermark" ? 0.85 : 1], {
    extrapolateRight: "clamp",
  });

  if (variant === "watermark") {
    const sz = scaledSize(FONT_SIZES.caption, format);
    return (
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          opacity,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.hotPink,
            boxShadow: `0 0 10px ${COLORS.hotPink}`,
          }}
        />
        <span
          style={{
            fontSize: sz,
            fontWeight: 700,
            color,
            letterSpacing: 1,
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          HELLO GORGEOUS
        </span>
      </div>
    );
  }

  const titleSize = scaledSize(
    variant === "compact" ? FONT_SIZES.heading : FONT_SIZES.heroTitle,
    format
  );

  return (
    <div style={{ textAlign: "center", opacity }}>
      <div
        style={{
          fontSize: titleSize,
          fontWeight: 800,
          color,
          letterSpacing: 4,
          lineHeight: 1.1,
        }}
      >
        HELLO
      </div>
      <div
        style={{
          fontSize: titleSize,
          fontWeight: 800,
          background: GRADIENTS.pinkHot,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: 4,
          lineHeight: 1.1,
        }}
      >
        GORGEOUS
      </div>
      <div
        style={{
          fontSize: titleSize * 0.3,
          color: COLORS.textMuted,
          marginTop: 12,
          letterSpacing: 8,
        }}
      >
        MED SPA
      </div>
    </div>
  );
};
