import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, type VideoFormat, scaledSize, FONT_SIZES } from "../brand/theme";

interface CTABannerProps {
  delay?: number;
  format: VideoFormat;
  phone?: string;
  website?: string;
  ctaText?: string;
  brandColor?: string;
  variant?: "full" | "compact" | "bookingOnly";
}

export const CTABanner: React.FC<CTABannerProps> = ({
  delay = 0,
  format,
  phone = "630-636-6193",
  website = "hellogorgeousmedspa.com",
  ctaText = "BOOK FREE CONSULTATION",
  brandColor = COLORS.hotPink,
  variant = "full",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - delay;

  const pulse = Math.sin(f * 0.12) * 0.06 + 1;

  const buttonScale = spring({
    frame: f - 5,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 100 },
  });

  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const slideUp = spring({
    frame: f,
    fps,
    from: 30,
    to: 0,
    config: { damping: 12 },
  });

  const btnSize = scaledSize(FONT_SIZES.subheading, format);
  const textSize = scaledSize(FONT_SIZES.body, format);

  if (f < 0) return null;

  if (variant === "bookingOnly") {
    return (
      <div style={{ opacity, transform: `translateY(${slideUp}px)`, textAlign: "center", zIndex: 20 }}>
        <div
          style={{
            display: "inline-block",
            transform: `scale(${Math.max(buttonScale, 0) * pulse})`,
            padding: "20px 44px",
            background: GRADIENTS.pinkHot,
            borderRadius: 50,
            fontSize: btnSize,
            fontWeight: 800,
            color: COLORS.white,
            letterSpacing: 2,
            boxShadow: SHADOWS.buttonGlow(brandColor),
          }}
        >
          {ctaText}
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity, transform: `translateY(${slideUp}px)`, textAlign: "center", zIndex: 20 }}>
      {variant === "full" && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: textSize - 2, color: COLORS.textSecondary }}>
            📍 74 W Washington St, Oswego, IL
          </span>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: textSize, color: COLORS.white, fontWeight: 600 }}>
          📞 {phone}
        </span>
      </div>

      <div
        style={{
          display: "inline-block",
          transform: `scale(${Math.max(buttonScale, 0) * pulse})`,
          padding: "22px 50px",
          background: GRADIENTS.pinkHot,
          borderRadius: 50,
          fontSize: btnSize,
          fontWeight: 800,
          color: COLORS.white,
          letterSpacing: 2,
          boxShadow: SHADOWS.buttonGlow(brandColor),
          marginBottom: 20,
        }}
      >
        {ctaText}
      </div>

      <div>
        <span style={{ fontSize: textSize - 2, color: brandColor, fontWeight: 600, letterSpacing: 1 }}>
          {website}
        </span>
      </div>
    </div>
  );
};
