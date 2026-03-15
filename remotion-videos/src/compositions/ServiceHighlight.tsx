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

interface ServiceHighlightProps {
  serviceName: string;
  tagline: string;
  howItWorks: string[];
  idealFor: string[];
  accentColor?: string;
  brandColor?: string;
  format: VideoFormat;
}

const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({ frame: frame - delay, fps, from: 35, to: 0, config: { damping: 12 } });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

// Scene 1: Service Name Reveal
const RevealScene: React.FC<{
  serviceName: string; tagline: string; accentColor: string; format: VideoFormat;
}> = ({ serviceName, tagline, accentColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.heroTitle, format);
  const nameScale = spring({ frame: frame - 10, fps, from: 0.5, to: 1, config: { damping: 10 } });
  const glowPulse = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={accentColor} size={500} x={width * 0.3} y={height * 0.4} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, transform: `scale(${nameScale})` }}>
        <AnimatedText delay={5}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: COLORS.white,
            textShadow: `0 0 ${40 * glowPulse}px ${accentColor}`,
            letterSpacing: 3, lineHeight: 1.1,
          }}>
            {serviceName.toUpperCase()}
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{
            fontSize: sz * 0.4, color: accentColor, fontWeight: 600,
            marginTop: 16, letterSpacing: 2,
          }}>
            {tagline}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: How It Works
const HowItWorksScene: React.FC<{
  howItWorks: string[]; accentColor: string; format: VideoFormat;
}> = ({ howItWorks, accentColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.body, format);
  const titleSz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={accentColor} size={300} x={width * 0.8} y={height * 0.2} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, maxWidth: format === "horizontal" ? 800 : 550 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: titleSz, fontWeight: 800, color: COLORS.white, marginBottom: 40 }}>
            HOW IT <span style={{ color: accentColor }}>WORKS</span>
          </div>
        </AnimatedText>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {howItWorks.slice(0, 3).map((step, i) => (
            <AnimatedText key={i} delay={15 + i * 18}>
              <div style={{
                display: "flex", alignItems: "center", gap: 18,
                padding: "16px 28px",
                background: `linear-gradient(90deg, ${accentColor}10, transparent)`,
                borderRadius: 14, borderLeft: `4px solid ${accentColor}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: accentColor, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, fontWeight: 800, color: COLORS.white,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: sz, color: COLORS.white, fontWeight: 500, textAlign: "left" }}>
                  {step}
                </span>
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Ideal For
const IdealForScene: React.FC<{
  idealFor: string[]; accentColor: string; format: VideoFormat;
}> = ({ idealFor, accentColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.body, format);
  const titleSz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={accentColor} size={350} x={width * 0.15} y={height * 0.6} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, maxWidth: format === "horizontal" ? 800 : 550 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: titleSz, fontWeight: 800, color: COLORS.white, marginBottom: 40 }}>
            IDEAL <span style={{ color: accentColor }}>FOR</span>
          </div>
        </AnimatedText>

        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12,
        }}>
          {idealFor.map((concern, i) => (
            <AnimatedText key={i} delay={15 + i * 10}>
              <div style={{
                padding: "12px 24px",
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}40`,
                borderRadius: 30,
                fontSize: sz * 0.85, color: COLORS.white, fontWeight: 500,
              }}>
                {concern}
              </div>
            </AnimatedText>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CTAScene: React.FC<{ serviceName: string; accentColor: string; format: VideoFormat }> = ({
  serviceName, accentColor, format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const pulse = Math.sin(frame * 0.12) * 0.06 + 1;
  const sz = scaledSize(FONT_SIZES.subheading, format);
  const btnScale = spring({ frame: frame - 20, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={accentColor} size={500} x={width * 0.3} y={height * 0.5} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz + 4, fontWeight: 800, color: COLORS.white, marginBottom: 8 }}>
            Ready for
          </div>
        </AnimatedText>
        <AnimatedText delay={8}>
          <div style={{ fontSize: sz + 8, fontWeight: 900, color: accentColor, marginBottom: 30 }}>
            {serviceName}?
          </div>
        </AnimatedText>
        <div style={{ transform: `scale(${Math.max(btnScale, 0) * pulse})`, marginBottom: 20 }}>
          <div style={{
            display: "inline-block", padding: "22px 50px",
            background: `linear-gradient(90deg, ${accentColor}, ${COLORS.pink})`,
            borderRadius: 50, fontSize: sz, fontWeight: 800,
            color: COLORS.white, letterSpacing: 2,
            boxShadow: SHADOWS.buttonGlow(accentColor),
          }}>
            BOOK FREE CONSULTATION
          </div>
        </div>
        <AnimatedText delay={30}>
          <div style={{ fontSize: 22, color: COLORS.white, fontWeight: 600 }}>📞 630-636-6193</div>
        </AnimatedText>
        <AnimatedText delay={38}>
          <div style={{ fontSize: 18, color: accentColor, fontWeight: 600, marginTop: 8 }}>hellogorgeousmedspa.com</div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const ServiceHighlight: React.FC<ServiceHighlightProps> = ({
  serviceName, tagline, howItWorks, idealFor,
  accentColor = COLORS.hotPink, brandColor = COLORS.hotPink, format,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={120}>
        <RevealScene serviceName={serviceName} tagline={tagline} accentColor={accentColor} format={format} />
      </Sequence>
      <Sequence from={120} durationInFrames={210}>
        <HowItWorksScene howItWorks={howItWorks} accentColor={accentColor} format={format} />
      </Sequence>
      <Sequence from={330} durationInFrames={180}>
        <IdealForScene idealFor={idealFor} accentColor={accentColor} format={format} />
      </Sequence>
      <Sequence from={510} durationInFrames={210}>
        <CTAScene serviceName={serviceName} accentColor={accentColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
