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

interface GeoTargetedAdProps {
  cityName: string;
  driveTime?: string;
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

// Scene 1: City Call-Out
const CityHookScene: React.FC<{
  cityName: string; brandColor: string; format: VideoFormat;
}> = ({ cityName, brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.heroTitle, format);
  const cityScale = spring({ frame: frame - 5, fps, from: 0.3, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.3} y={height * 0.4} />
      <GlowOrb color={COLORS.gold} size={350} x={width * 0.7} y={height * 0.2} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, transform: `scale(${cityScale})` }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.4, color: COLORS.gold, letterSpacing: 6, marginBottom: 12 }}>
            📍 ATTENTION
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: COLORS.white,
            textShadow: `0 0 40px ${brandColor}`,
            letterSpacing: 4, lineHeight: 1.1,
          }}>
            {cityName.toUpperCase()}
          </div>
        </AnimatedText>
        <AnimatedText delay={30}>
          <div style={{ fontSize: sz * 0.35, color: COLORS.textSecondary, marginTop: 20 }}>
            This one&apos;s for you.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Message
const MessageScene: React.FC<{
  cityName: string; driveTime: string; brandColor: string; format: VideoFormat;
}> = ({ cityName, driveTime, brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.subheading, format);

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.5 - 200} y={height * 0.3} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, maxWidth: format === "horizontal" ? 800 : 550 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz + 4, fontWeight: 800, color: COLORS.white, lineHeight: 1.4, marginBottom: 20 }}>
            The most advanced skin & body contouring technology
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{ fontSize: sz + 8, fontWeight: 900, color: brandColor, marginBottom: 16 }}>
            is {driveTime} from you.
          </div>
        </AnimatedText>
        <AnimatedText delay={40}>
          <div style={{
            display: "inline-block", padding: "10px 28px",
            background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}40`,
            borderRadius: 30, fontSize: sz * 0.7, color: COLORS.gold, letterSpacing: 2,
          }}>
            3 Technologies · 1 Spa · 0 Surgery
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Tech summary
const TechSummaryScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.body, format);

  const techs = [
    { name: "Morpheus8 Burst", detail: "Deepest RF at 8mm", color: brandColor },
    { name: "Solaria CO₂", detail: "Gold standard laser", color: COLORS.gold },
    { name: "QuantumRF", detail: "Subdermal contouring", color: "#00BFFF" },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ zIndex: 10, width: "90%", maxWidth: 600 }}>
        <AnimatedText delay={0}>
          <div style={{
            fontSize: scaledSize(FONT_SIZES.heading, format), fontWeight: 800,
            color: COLORS.white, textAlign: "center", marginBottom: 30,
          }}>
            THE INMODE TRIFECTA
          </div>
        </AnimatedText>

        {techs.map((t, i) => {
          const cardScale = spring({ frame: frame - 15 - i * 12, fps, from: 0, to: 1, config: { damping: 10 } });
          return (
            <div key={i} style={{
              transform: `scale(${Math.max(cardScale, 0)})`,
              padding: "16px 24px", marginBottom: 12,
              background: `${t.color}10`, border: `1px solid ${t.color}30`,
              borderRadius: 14, display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{
                width: 6, height: 40, borderRadius: 3, background: t.color,
                boxShadow: `0 0 10px ${t.color}60`,
              }} />
              <div>
                <div style={{ fontSize: sz, fontWeight: 700, color: COLORS.white }}>{t.name}</div>
                <div style={{ fontSize: sz * 0.8, color: t.color }}>{t.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: CTA
const CTAScene: React.FC<{ cityName: string; brandColor: string; format: VideoFormat }> = ({
  cityName, brandColor, format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const pulse = Math.sin(frame * 0.12) * 0.06 + 1;
  const sz = scaledSize(FONT_SIZES.subheading, format);
  const btnScale = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.2} y={height * 0.5} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz + 4, fontWeight: 800, color: COLORS.white, marginBottom: 30 }}>
            Book your free consultation
            <br />at <span style={{ color: brandColor }}>Hello Gorgeous</span>, Oswego
          </div>
        </AnimatedText>
        <div style={{ transform: `scale(${Math.max(btnScale, 0) * pulse})`, marginBottom: 20 }}>
          <div style={{
            display: "inline-block", padding: "22px 50px",
            background: GRADIENTS.pinkHot, borderRadius: 50,
            fontSize: sz, fontWeight: 800, color: COLORS.white, letterSpacing: 2,
            boxShadow: SHADOWS.buttonGlow(brandColor),
          }}>
            BOOK NOW
          </div>
        </div>
        <AnimatedText delay={20}>
          <div style={{ fontSize: 22, color: COLORS.white, fontWeight: 600 }}>📞 630-636-6193</div>
        </AnimatedText>
        <AnimatedText delay={28}>
          <div style={{ fontSize: 16, color: COLORS.textMuted, marginTop: 12 }}>
            Just {cityName === "Oswego" ? "right here in town" : `minutes from ${cityName}`}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const GeoTargetedAd: React.FC<GeoTargetedAdProps> = ({
  cityName, driveTime = "20 minutes",
  brandColor = COLORS.hotPink, format,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={120}>
        <CityHookScene cityName={cityName} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={120} durationInFrames={150}>
        <MessageScene cityName={cityName} driveTime={driveTime} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={270} durationInFrames={150}>
        <TechSummaryScene brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={420} durationInFrames={180}>
        <CTAScene cityName={cityName} brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
