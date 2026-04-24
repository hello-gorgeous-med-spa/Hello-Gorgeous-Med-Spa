/**
 * Contour Lift™ powered by Quantum RF — short-form social (Reels, feed, web)
 * Copy is marketing-appropriate; add legal-approved claims before major spend.
 */
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { GlowOrb } from "../brand/backgrounds";

export const QUANTUM_CONTOUR_FRAMES = 900; // 30s @ 30fps

const brandColor = "#E6007E";
const BORD = `1px solid ${brandColor}50`;

const AnimatedLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({ frame: frame - delay, fps, from: 28, to: 0, config: { damping: 14 } });
  return <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

const HookScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const { width, height } = useVideoConfig();
  const t = scaledSize(FONT_SIZES.sectionTitle, format);
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COLORS.black} 0%, #120810 50%, ${COLORS.black} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 48,
      }}
    >
      <GlowOrb color={brandColor} size={format === "horizontal" ? 360 : 420} x={width * 0.15} y={height * 0.35} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 4, maxWidth: format === "horizontal" ? 1100 : 900 }}>
        <AnimatedLine delay={0}>
          <div
            style={{
              fontSize: t * 0.32,
              color: brandColor,
              letterSpacing: 6,
              fontWeight: 800,
              marginBottom: 10,
            }}
          >
            HELLO GORGEOUS
          </div>
        </AnimatedLine>
        <AnimatedLine delay={10}>
          <div style={{ fontSize: t * 0.9, fontWeight: 900, color: COLORS.white, lineHeight: 1.15 }}>
            Contour Lift
            <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: t * 0.45 }}> ™</span>
          </div>
        </AnimatedLine>
        <AnimatedLine delay={22}>
          <div
            style={{
              fontSize: t * 0.55,
              fontWeight: 800,
              background: GRADIENTS.pinkHot,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            powered by Quantum RF
          </div>
        </AnimatedLine>
        <AnimatedLine delay={38}>
          <div style={{ fontSize: t * 0.4, color: COLORS.textSecondary, marginTop: 18, lineHeight: 1.4 }}>
            Face, neck &amp; body — contour where it matters to you
          </div>
        </AnimatedLine>
      </div>
    </AbsoluteFill>
  );
};

const ZonesScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const t = scaledSize(FONT_SIZES.heading, format);
  const items =
    format === "horizontal"
      ? ["Jawline · Neck", "Abdomen · Flanks", "Thighs · Arms", "Custom zones"]
      : ["Jawline & neck", "Abdomen & flanks", "Thighs & arms", "Your plan, your zones"];
  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        padding: 44,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo format={format} variant="watermark" />
      <div style={{ zIndex: 2, width: "100%", maxWidth: 920 }}>
        <div
          style={{
            fontSize: t * 0.5,
            color: brandColor,
            fontWeight: 800,
            marginBottom: 20,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          TREATMENT ZONES
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: format === "horizontal" ? "1fr 1fr" : "1fr",
            gap: 16,
          }}
        >
          {items.map((label, i) => {
            const d = 8 + i * 5;
            const o = interpolate(frame - d, [0, 12], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div
                key={label}
                style={{
                  opacity: o,
                  border: BORD,
                  borderRadius: 16,
                  padding: "18px 22px",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: SHADOWS.glow(brandColor, 16),
                }}
              >
                <div style={{ fontSize: t * 0.42, color: COLORS.white, fontWeight: 700 }}>{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TrustScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.subheading, format);
  const lines = [
    "Minimally invasive — we’ll walk you through what to expect",
    "Candidacy matters: consultation first",
    "Results vary. Not everyone is a candidate — and that’s OK",
  ];
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #0a0a0a 0%, #140a10 100%)`,
        padding: 48,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Logo format={format} variant="watermark" />
      <div style={{ maxWidth: 900, zIndex: 2 }}>
        <div
          style={{
            fontSize: t * 0.45,
            color: brandColor,
            fontWeight: 800,
            marginBottom: 24,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          THE EXPERIENCE
        </div>
        {lines.map((text, i) => (
          <AnimatedLine key={text} delay={i * 10}>
            <div
              style={{
                fontSize: t * 0.4,
                color: COLORS.textPrimary,
                lineHeight: 1.45,
                marginBottom: 16,
                paddingLeft: 8,
                borderLeft: `4px solid ${brandColor}`,
              }}
            >
              {text}
            </div>
          </AnimatedLine>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC<{ format: VideoFormat; phone: string; website: string; city: string }> = ({
  format,
  phone,
  website,
  city,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = scaledSize(FONT_SIZES.sectionTitle, format);
  const pulse = 0.9 + 0.1 * Math.sin(frame * 0.12);
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, #2a1020 0%, ${COLORS.black} 60%)`,
        justifyContent: "center",
        alignItems: "center",
        padding: 44,
      }}
    >
      <GlowOrb color={brandColor} size={500} x={width * 0.5 - 120} y={height * 0.25} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 3 }}>
        <AnimatedLine delay={0}>
          <div style={{ fontSize: t * 0.5, color: brandColor, fontWeight: 800, letterSpacing: 3, marginBottom: 8 }}>
            START WITH A CONSULTATION
          </div>
        </AnimatedLine>
        <AnimatedLine delay={12}>
          <div style={{ fontSize: t * 0.7, color: COLORS.white, fontWeight: 900, lineHeight: 1.2 }}>
            {website}
          </div>
        </AnimatedLine>
        <AnimatedLine delay={26}>
          <div style={{ fontSize: t * 0.4, color: COLORS.textSecondary, marginTop: 14 }}>{phone}</div>
        </AnimatedLine>
        <AnimatedLine delay={38}>
          <div
            style={{
              display: "inline-block",
              marginTop: 28,
              padding: "16px 36px",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${COLORS.hotPink}, ${COLORS.pink})`,
              color: COLORS.white,
              fontWeight: 800,
              fontSize: t * 0.38,
              transform: `scale(${pulse})`,
              boxShadow: SHADOWS.buttonGlow(brandColor),
            }}
          >
            Link in bio — Contour Lift
          </div>
        </AnimatedLine>
        <AnimatedLine delay={52}>
          <div style={{ fontSize: t * 0.28, color: COLORS.textMuted, marginTop: 20 }}>{city}</div>
        </AnimatedLine>
        <div style={{ fontSize: scaledSize(14, format), color: "rgba(255,255,255,0.35)", marginTop: 28, maxWidth: 700 }}>
          Individual results may vary. Medical evaluation required.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const OutroScene: React.FC<{ format: VideoFormat; tagline: string }> = ({ format, tagline }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const t = scaledSize(FONT_SIZES.heading, format);
  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        opacity: o,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <Logo format={format} variant="compact" />
        <p style={{ fontSize: t * 0.35, color: COLORS.textSecondary, marginTop: 20, maxWidth: 800 }}>{tagline}</p>
        <p style={{ fontSize: t * 0.28, color: brandColor, fontWeight: 700, marginTop: 12 }}>Oswego, IL</p>
      </div>
    </AbsoluteFill>
  );
};

export type QuantumContourLiftProps = {
  format: VideoFormat;
  phone?: string;
  website?: string;
  city?: string;
  outroTagline?: string;
};

const defaultPhone = "630-636-6193";
const defaultWebsite = "hellogorgeousmedspa.com";
const defaultCity = "74 W Washington St · Oswego, IL";
const defaultTagline = "Where science meets self-confidence.";

export const QuantumContourLift: React.FC<QuantumContourLiftProps> = ({
  format,
  phone = defaultPhone,
  website = defaultWebsite,
  city = defaultCity,
  outroTagline = defaultTagline,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={150}>
        <HookScene format={format} />
      </Sequence>
      <Sequence from={150} durationInFrames={210}>
        <ZonesScene format={format} />
      </Sequence>
      <Sequence from={360} durationInFrames={240}>
        <TrustScene format={format} />
      </Sequence>
      <Sequence from={600} durationInFrames={210}>
        <CTAScene format={format} phone={phone} website={website} city={city} />
      </Sequence>
      <Sequence from={810} durationInFrames={90}>
        <OutroScene format={format} tagline={outroTagline} />
      </Sequence>
    </AbsoluteFill>
  );
};
