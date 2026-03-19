import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { GlowOrb } from "../brand/backgrounds";

const brandColor = "#FF2D8E";

const resolveSrc = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({ frame: frame - delay, fps, from: 30, to: 0, config: { damping: 12 } });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

// Scene 1: Hook — VIP Model Program, Only 20 spots
const HookScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.sectionTitle, format);

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={450} x={width * 0.2} y={height * 0.4} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.35, color: brandColor, letterSpacing: 8, marginBottom: 12, fontWeight: 800 }}>
            VIP MODEL PROGRAM
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz * 1.1, fontWeight: 900, color: COLORS.white, lineHeight: 1.2 }}>
            Only 20 Spots
          </div>
        </AnimatedText>
        <AnimatedText delay={22}>
          <div
            style={{
              fontSize: sz,
              fontWeight: 900,
              background: GRADIENTS.pinkHot,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Up to 50% OFF
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: sz * 0.5, color: COLORS.textSecondary, marginTop: 20 }}>
            Morpheus8 Burst · Solaria CO₂ · Quantum RF
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Before/After image with sweeping reveal line (side-by-side composites)
const BeforeAfterWipeScene: React.FC<{
  imageSrc: string;
  format: VideoFormat;
}> = ({ imageSrc, format }) => {
  const frame = useCurrentFrame();
  const wipeProgress = interpolate(frame, [15, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 30], [0.95, 1], { extrapolateRight: "clamp" });
  const imgW = format === "horizontal" ? 900 : format === "square" ? 700 : 600;
  const imgH = format === "horizontal" ? 550 : format === "square" ? 600 : 750;

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <Logo format={format} variant="watermark" />
      <div
        style={{
          position: "relative",
          width: imgW,
          height: imgH,
          borderRadius: 20,
          overflow: "hidden",
          zIndex: 10,
          border: `3px solid ${brandColor}40`,
          boxShadow: SHADOWS.glow(brandColor, 25),
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={resolveSrc(imageSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Sweeping line — before → after (left to right) */}
        <div
          style={{
            position: "absolute",
            left: `${wipeProgress * 100}%`,
            top: 0,
            bottom: 0,
            width: 8,
            background: `linear-gradient(180deg, transparent, ${brandColor}, ${brandColor}, transparent)`,
            boxShadow: SHADOWS.glow(brandColor, 25),
            zIndex: 5,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            padding: "8px 20px",
            background: "rgba(0,0,0,0.85)",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 800,
            color: brandColor,
            letterSpacing: 3,
          }}
        >
          REAL RESULTS
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Pricing tiers flash
const PricingScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.heading, format);
  const scale = spring({ frame: frame - 5, fps, from: 0.8, to: 1, config: { damping: 10 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  const tiers = [
    { name: "Morpheus8 Burst", tag: "Collagen Rebuild", retail: 1400, vip: 799 },
    { name: "Solaria CO₂", tag: "Skin Resurfacing", retail: 1600, vip: 899 },
    { name: "Morpheus8 + CO₂", tag: "Total Skin Rebuild", retail: 3000, vip: 1499, popular: true },
    { name: "The Trifecta", tag: "All 3 Technologies", retail: 4500, vip: 1999 },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <GlowOrb color={brandColor} size={400} x={0} y={height * 0.3} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, opacity, transform: `scale(${scale})` }}>
        <div style={{ fontSize: sz * 0.4, color: brandColor, letterSpacing: 6, marginBottom: 20, fontWeight: 800 }}>
          VIP MODEL PRICING
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: format === "horizontal" ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
            gap: 16,
            maxWidth: format === "horizontal" ? 1600 : 700,
            margin: "0 auto",
          }}
        >
          {tiers.map((t, i) => (
            <div
              key={t.name}
              style={{
                padding: 20,
                background: t.popular ? `${brandColor}20` : "rgba(255,255,255,0.05)",
                border: `2px solid ${t.popular ? brandColor : "rgba(255,255,255,0.2)"}`,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              {t.popular && (
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: brandColor,
                    marginBottom: 8,
                    letterSpacing: 2,
                  }}
                >
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 }}>{t.tag}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.white, marginBottom: 8 }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: COLORS.textMuted, textDecoration: "line-through" }}>
                  ${t.retail}
                </span>
                <span style={{ fontSize: 24, fontWeight: 900, color: brandColor }}>${t.vip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA — Buy Now
const CTAScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.15) * 0.08 + 1;
  const sz = scaledSize(FONT_SIZES.heading, format);
  const btnScale = spring({ frame: frame - 10, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={0} y={0} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
            Only 20 clients selected.
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz, fontWeight: 800, color: brandColor, marginBottom: 30 }}>
            Secure your spot.
          </div>
        </AnimatedText>
        <div style={{ transform: `scale(${Math.max(btnScale, 0) * pulse})`, marginBottom: 24 }}>
          <div
            style={{
              display: "inline-block",
              padding: "24px 56px",
              background: GRADIENTS.pinkHot,
              borderRadius: 50,
              fontSize: scaledSize(FONT_SIZES.subheading, format),
              fontWeight: 900,
              color: COLORS.white,
              letterSpacing: 3,
              boxShadow: SHADOWS.buttonGlow(brandColor),
            }}
          >
            BUY NOW
          </div>
        </div>
        <AnimatedText delay={25}>
          <div style={{ fontSize: 20, color: COLORS.white, fontWeight: 600 }}>
            DM &quot;MODEL&quot; on Instagram
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: 18, color: brandColor, fontWeight: 600, marginTop: 8 }}>
            hellogorgeousmedspa.com
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const images = [
  "vip-model/m8-jawline.png",
  "vip-model/m8-forehead.png",
  "vip-model/solaria-face.png",
  "vip-model/solaria-pigment.png",
];

const FRAMES_PER_IMAGE = 120;
const HOOK_DURATION = 90;
const PRICING_DURATION = 150;
const CTA_DURATION = 120;
const IMAGES_DURATION = images.length * FRAMES_PER_IMAGE;

export interface VIPModelProgramProps {
  format: VideoFormat;
}

export const VIPModelProgram: React.FC<VIPModelProgramProps> = ({ format }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
        <HookScene format={format} />
      </Sequence>

      {images.map((img, i) => (
        <Sequence
          key={img}
          from={HOOK_DURATION + i * FRAMES_PER_IMAGE}
          durationInFrames={FRAMES_PER_IMAGE}
        >
          <BeforeAfterWipeScene imageSrc={img} format={format} />
        </Sequence>
      ))}

      <Sequence from={HOOK_DURATION + IMAGES_DURATION} durationInFrames={PRICING_DURATION}>
        <PricingScene format={format} />
      </Sequence>

      <Sequence
        from={HOOK_DURATION + IMAGES_DURATION + PRICING_DURATION}
        durationInFrames={CTA_DURATION}
      >
        <CTAScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
