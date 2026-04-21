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

// Scene 1: Hook — All new Burst 8 technology, Hello Gorgeous Med Spa, Need models for half off
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
            ALL NEW BURST 8 TECHNOLOGY
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz * 0.9, fontWeight: 900, color: COLORS.white, lineHeight: 1.2 }}>
            Hello Gorgeous Med Spa
          </div>
        </AnimatedText>
        <AnimatedText delay={22}>
          <div
            style={{
              fontSize: sz * 0.85,
              fontWeight: 900,
              background: GRADIENTS.pinkHot,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Need Models for Half Off
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: sz * 0.5, color: COLORS.textSecondary, marginTop: 20 }}>
            Inquire today
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Before/After image with sweeping reveal line
const BeforeAfterWipeScene: React.FC<{
  imageSrc: string;
  format: VideoFormat;
}> = ({ imageSrc, format }) => {
  const frame = useCurrentFrame();
  const wipeProgress = interpolate(frame, [15, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 25], [0.95, 1], { extrapolateRight: "clamp" });
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

// Scene 3: Offer — First 20 clients, model + bonus
const OfferScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.heading, format);
  const scale = spring({ frame: frame - 5, fps, from: 0.8, to: 1, config: { damping: 10 } });
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <GlowOrb color={brandColor} size={400} x={0} y={height * 0.3} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, opacity, transform: `scale(${scale})`, maxWidth: 700 }}>
        <div style={{ fontSize: sz * 0.4, color: brandColor, letterSpacing: 6, marginBottom: 16, fontWeight: 800 }}>
          FIRST 20 CLIENTS
        </div>
        <div style={{ fontSize: sz * 0.7, color: COLORS.white, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
          Book at www.hellogorgeousmedspa.com
        </div>
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: `${brandColor}18`,
            border: `2px solid ${brandColor}`,
            borderRadius: 16,
          }}
        >
          <div style={{ fontSize: sz * 0.5, color: brandColor, fontWeight: 800, marginBottom: 8 }}>
            Book while model spots last
          </div>
          <div style={{ fontSize: sz * 0.6, color: COLORS.white, fontWeight: 700 }}>
            FREE CO₂ Solaria Laser Fractional
          </div>
          <div style={{ fontSize: sz * 0.35, color: COLORS.textSecondary, marginTop: 8 }}>
            Use or gift
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA — HURRY, Inquire today
const CTAScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = Math.sin(frame * 0.18) * 0.1 + 1;
  const sz = scaledSize(FONT_SIZES.heading, format);
  const btnScale = spring({ frame: frame - 10, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={0} y={0} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 1.2, fontWeight: 900, color: brandColor, marginBottom: 20, letterSpacing: 4 }}>
            HURRY
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
            First 20 clients who book
          </div>
        </AnimatedText>
        <AnimatedText delay={22}>
          <div style={{ fontSize: sz, fontWeight: 800, color: brandColor, marginBottom: 30 }}>
            Inquire today
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
            www.hellogorgeousmedspa.com
          </div>
        </div>
        <AnimatedText delay={35}>
          <div style={{ fontSize: 20, color: COLORS.textSecondary, fontWeight: 600 }}>
            Half off for models · Free CO₂ laser for qualifying model bookings
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

const images = [
  "morpheus8-burst/m8-scar.png",
  "morpheus8-burst/m8-neck.png",
  "morpheus8-burst/m8-eye.png",
  "morpheus8-burst/m8-acne.png",
  "morpheus8-burst/m8-acne-male.png",
  "morpheus8-burst/m8-forehead.png",
  "morpheus8-burst/m8-face.png",
  "morpheus8-burst/m8-jawline.png",
  "morpheus8-burst/m8-profile.png",
  "morpheus8-burst/m8-front.png",
];

const FRAMES_PER_IMAGE = 90;
const HOOK_DURATION = 90;
const OFFER_DURATION = 120;
const CTA_DURATION = 150;
const IMAGES_DURATION = images.length * FRAMES_PER_IMAGE;

export interface Morpheus8BurstModelCallProps {
  format: VideoFormat;
}

export const Morpheus8BurstModelCall: React.FC<Morpheus8BurstModelCallProps> = ({ format }) => {
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

      <Sequence from={HOOK_DURATION + IMAGES_DURATION} durationInFrames={OFFER_DURATION}>
        <OfferScene format={format} />
      </Sequence>

      <Sequence
        from={HOOK_DURATION + IMAGES_DURATION + OFFER_DURATION}
        durationInFrames={CTA_DURATION}
      >
        <CTAScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
