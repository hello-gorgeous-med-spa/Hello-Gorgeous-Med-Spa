import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { GlowOrb } from "../brand/backgrounds";

interface TestimonialCardProps {
  quoteText: string;
  clientName: string;
  treatmentType: string;
  starRating?: number;
  clientPhoto?: string;
  brandColor?: string;
  format: VideoFormat;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quoteText, clientName, treatmentType, starRating = 5,
  brandColor = COLORS.gold, format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const words = quoteText.split(" ");
  const quoteSize = scaledSize(
    words.length > 20 ? FONT_SIZES.body : FONT_SIZES.subheading,
    format
  );
  const nameSize = scaledSize(FONT_SIZES.body, format);

  // Stars animation
  const StarRow: React.FC = () => (
    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 30 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starScale = spring({
          frame: frame - 10 - i * 6,
          fps,
          from: 0,
          to: i < starRating ? 1 : 0.3,
          config: { damping: 8, stiffness: 120 },
        });
        return (
          <span
            key={i}
            style={{
              fontSize: scaledSize(36, format),
              transform: `scale(${Math.max(starScale, 0)})`,
              display: "inline-block",
              filter: i < starRating ? "none" : "grayscale(1)",
            }}
          >
            ⭐
          </span>
        );
      })}
    </div>
  );

  // Word-by-word quote reveal
  const QuoteReveal: React.FC = () => (
    <div style={{
      fontSize: quoteSize, fontWeight: 500, color: COLORS.white,
      lineHeight: 1.6, textAlign: "center", maxWidth: format === "horizontal" ? 800 : 550,
      margin: "0 auto",
      fontStyle: "italic",
    }}>
      <span style={{ fontSize: quoteSize * 1.5, color: brandColor, fontWeight: 700 }}>&ldquo;</span>
      {words.map((word, i) => {
        const wordDelay = 40 + i * 3;
        const wordOpacity = interpolate(frame - wordDelay, [0, 6], [0, 1], {
          extrapolateLeft: "clamp", extrapolateRight: "clamp",
        });
        return (
          <span key={i} style={{ opacity: wordOpacity }}>
            {word}{" "}
          </span>
        );
      })}
      <span style={{ fontSize: quoteSize * 1.5, color: brandColor, fontWeight: 700 }}>&rdquo;</span>
    </div>
  );

  // Client info
  const nameDelay = 40 + words.length * 3 + 15;
  const nameOpacity = interpolate(frame - nameDelay, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const nameSlide = spring({
    frame: frame - nameDelay, fps, from: 20, to: 0, config: { damping: 12 },
  });

  return (
    <AbsoluteFill style={{
      background: GRADIENTS.warmDark,
      fontFamily: "system-ui, -apple-system, sans-serif",
      justifyContent: "center", alignItems: "center", padding: 60,
    }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.15} y={height * 0.3} />
      <GlowOrb color={COLORS.gold} size={300} x={width * 0.75} y={height * 0.6} />

      <Logo format={format} variant="watermark" />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <StarRow />
        <QuoteReveal />

        <div style={{
          opacity: nameOpacity,
          transform: `translateY(${nameSlide}px)`,
          marginTop: 40,
        }}>
          <div style={{
            width: 60, height: 2,
            background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)`,
            margin: "0 auto 20px",
          }} />
          <div style={{ fontSize: nameSize, fontWeight: 700, color: COLORS.white, letterSpacing: 1 }}>
            — {clientName}
          </div>
          <div style={{ fontSize: nameSize * 0.75, color: brandColor, marginTop: 8, letterSpacing: 2 }}>
            {treatmentType}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
