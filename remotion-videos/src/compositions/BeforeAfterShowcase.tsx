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

interface BeforeAfterShowcaseProps {
  beforeImage: string;
  afterImage: string;
  treatmentName: string;
  sessions?: string;
  timeframe?: string;
  clientName?: string;
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

const resolveSrc = (src: string) => src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

// Scene 1: Hook
const HookScene: React.FC<{ treatmentName: string; brandColor: string; format: VideoFormat }> = ({
  treatmentName, brandColor, format,
}) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.sectionTitle, format);

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.2} y={height * 0.4} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.4, color: brandColor, letterSpacing: 6, marginBottom: 16 }}>
            REAL RESULTS
          </div>
        </AnimatedText>
        <AnimatedText delay={15}>
          <div style={{ fontSize: sz, fontWeight: 900, color: COLORS.white, lineHeight: 1.2 }}>
            This is what
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{
            fontSize: sz, fontWeight: 900,
            background: GRADIENTS.pinkHot,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            {treatmentName}
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: sz, fontWeight: 900, color: COLORS.white }}>
            looks like.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Before image reveal
const BeforeScene: React.FC<{ beforeImage: string; brandColor: string; format: VideoFormat }> = ({
  beforeImage, brandColor, format,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const imgScale = interpolate(frame, [0, 90], [1.05, 1.0], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.heading, format);
  const imgW = format === "horizontal" ? 700 : format === "square" ? 600 : 500;
  const imgH = format === "horizontal" ? 450 : format === "square" ? 500 : 600;

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{
            display: "inline-block", padding: "8px 24px", background: "rgba(255,255,255,0.1)",
            borderRadius: 8, fontSize: 18, color: COLORS.textSecondary, letterSpacing: 3, marginBottom: 20,
          }}>
            BEFORE
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div style={{
            width: imgW, height: imgH, borderRadius: 16, overflow: "hidden",
            border: `2px solid rgba(255,255,255,0.15)`, margin: "0 auto",
            transform: `scale(${imgScale})`,
          }}>
            <Img src={resolveSrc(beforeImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Slider wipe reveal
const SliderRevealScene: React.FC<{
  beforeImage: string; afterImage: string; brandColor: string; format: VideoFormat;
}> = ({ beforeImage, afterImage, brandColor, format }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sliderPos = interpolate(frame, [15, 75], [95, 30], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const imgW = format === "horizontal" ? 800 : format === "square" ? 650 : 550;
  const imgH = format === "horizontal" ? 500 : format === "square" ? 550 : 700;

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 30 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ position: "relative", width: imgW, height: imgH, borderRadius: 16, overflow: "hidden", zIndex: 10 }}>
        <Img src={resolveSrc(afterImage)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, width: `${sliderPos}%`, overflow: "hidden" }}>
          <Img src={resolveSrc(beforeImage)} style={{ width: imgW, height: imgH, objectFit: "cover" }} />
        </div>
        <div style={{
          position: "absolute", left: `${sliderPos}%`, top: 0, bottom: 0, width: 4,
          background: brandColor, boxShadow: SHADOWS.glow(brandColor, 15), zIndex: 10,
        }} />
        <div style={{
          position: "absolute", top: 16, left: 16, padding: "6px 16px",
          background: "rgba(0,0,0,0.7)", borderRadius: 8, fontSize: 14,
          fontWeight: 700, color: COLORS.white, letterSpacing: 2,
        }}>BEFORE</div>
        <div style={{
          position: "absolute", top: 16, right: 16, padding: "6px 16px",
          background: `${brandColor}CC`, borderRadius: 8, fontSize: 14,
          fontWeight: 700, color: COLORS.white, letterSpacing: 2,
        }}>AFTER</div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Details overlay
const DetailsScene: React.FC<{
  afterImage: string; treatmentName: string; sessions?: string;
  timeframe?: string; clientName?: string; brandColor: string; format: VideoFormat;
}> = ({ afterImage, treatmentName, sessions, timeframe, clientName, brandColor, format }) => {
  const sz = scaledSize(FONT_SIZES.subheading, format);

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 40 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        {clientName && (
          <AnimatedText delay={0}>
            <div style={{ fontSize: sz * 0.7, color: COLORS.textSecondary, marginBottom: 12 }}>
              {clientName}&apos;s transformation
            </div>
          </AnimatedText>
        )}
        <AnimatedText delay={10}>
          <div style={{ fontSize: sz, fontWeight: 800, color: COLORS.white, marginBottom: 20 }}>
            <span style={{ color: brandColor }}>{treatmentName}</span>
          </div>
        </AnimatedText>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
          {sessions && (
            <AnimatedText delay={25}>
              <div style={{
                padding: "12px 24px", background: `${brandColor}15`, border: `1px solid ${brandColor}40`,
                borderRadius: 12, textAlign: "center",
              }}>
                <div style={{ fontSize: 14, color: COLORS.textMuted, letterSpacing: 2 }}>SESSIONS</div>
                <div style={{ fontSize: sz * 0.8, color: COLORS.white, fontWeight: 700 }}>{sessions}</div>
              </div>
            </AnimatedText>
          )}
          {timeframe && (
            <AnimatedText delay={35}>
              <div style={{
                padding: "12px 24px", background: `${brandColor}15`, border: `1px solid ${brandColor}40`,
                borderRadius: 12, textAlign: "center",
              }}>
                <div style={{ fontSize: 14, color: COLORS.textMuted, letterSpacing: 2 }}>TIMEFRAME</div>
                <div style={{ fontSize: sz * 0.8, color: COLORS.white, fontWeight: 700 }}>{timeframe}</div>
              </div>
            </AnimatedText>
          )}
        </div>
        <AnimatedText delay={50}>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginTop: 30, maxWidth: 400, margin: "30px auto 0" }}>
            Results may vary. Individual results depend on treatment plan.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: CTA
const CTAScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const pulse = Math.sin(frame * 0.12) * 0.06 + 1;
  const sz = scaledSize(FONT_SIZES.heading, format);
  const btnScale = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.2} y={height * 0.5} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz, fontWeight: 800, color: COLORS.white, marginBottom: 10 }}>
            See what&apos;s possible
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div style={{ fontSize: sz, fontWeight: 800, color: brandColor, marginBottom: 30 }}>
            for you.
          </div>
        </AnimatedText>
        <div style={{ transform: `scale(${Math.max(btnScale, 0) * pulse})`, marginBottom: 20 }}>
          <div style={{
            display: "inline-block", padding: "22px 50px",
            background: GRADIENTS.pinkHot, borderRadius: 50,
            fontSize: scaledSize(FONT_SIZES.subheading, format), fontWeight: 800,
            color: COLORS.white, letterSpacing: 2,
            boxShadow: SHADOWS.buttonGlow(brandColor),
          }}>
            BOOK FREE CONSULTATION
          </div>
        </div>
        <AnimatedText delay={30}>
          <div style={{ fontSize: 22, color: COLORS.white, fontWeight: 600 }}>📞 630-636-6193</div>
        </AnimatedText>
        <AnimatedText delay={38}>
          <div style={{ fontSize: 18, color: brandColor, fontWeight: 600, marginTop: 8 }}>hellogorgeousmedspa.com</div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const BeforeAfterShowcase: React.FC<BeforeAfterShowcaseProps> = ({
  beforeImage, afterImage, treatmentName, sessions, timeframe, clientName,
  brandColor = COLORS.hotPink, format,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={90}>
        <HookScene treatmentName={treatmentName} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <BeforeScene beforeImage={beforeImage} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={180} durationInFrames={150}>
        <SliderRevealScene beforeImage={beforeImage} afterImage={afterImage} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={330} durationInFrames={120}>
        <DetailsScene afterImage={afterImage} treatmentName={treatmentName} sessions={sessions} timeframe={timeframe} clientName={clientName} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <CTAScene brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
