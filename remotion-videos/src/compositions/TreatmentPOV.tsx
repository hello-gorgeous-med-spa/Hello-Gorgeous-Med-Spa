import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
  Video,
  staticFile,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";

interface TextOverlay {
  text: string;
  startFrame: number;
  endFrame: number;
}

interface TreatmentPOVProps {
  videoSrc: string;
  treatmentName: string;
  providerName?: string;
  providerTitle?: string;
  hookText?: string;
  overlays?: TextOverlay[];
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

// Scene 1: Hook intro
const IntroScene: React.FC<{ hookText: string; brandColor: string; format: VideoFormat }> = ({
  hookText, brandColor, format,
}) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ background: COLORS.black, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <div style={{
        position: "absolute", left: width * 0.1, top: height * 0.2,
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${brandColor}40 0%, transparent 70%)`,
        filter: "blur(40px)",
      }} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.5, color: brandColor, letterSpacing: 6, marginBottom: 16 }}>
            POV
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz, fontWeight: 800, color: COLORS.white, lineHeight: 1.3, maxWidth: 600 }}>
            {hookText}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Main video with overlays
const VideoWithOverlays: React.FC<{
  videoSrc: string; overlays: TextOverlay[]; providerName?: string;
  providerTitle?: string; brandColor: string; format: VideoFormat;
}> = ({ videoSrc, overlays, providerName, providerTitle, brandColor, format }) => {
  const frame = useCurrentFrame();
  const sz = scaledSize(FONT_SIZES.body, format);

  const resolveSrc = (src: string) => src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

  return (
    <AbsoluteFill>
      <Video src={resolveSrc(videoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Branded corner accents */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: `3px solid ${brandColor}`, borderLeft: `3px solid ${brandColor}`, zIndex: 50, margin: 16 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: `3px solid ${brandColor}`, borderRight: `3px solid ${brandColor}`, zIndex: 50, margin: 16 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60, borderBottom: `3px solid ${brandColor}`, borderLeft: `3px solid ${brandColor}`, zIndex: 50, margin: 16 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: `3px solid ${brandColor}`, borderRight: `3px solid ${brandColor}`, zIndex: 50, margin: 16 }} />

      <Logo format={format} variant="watermark" />

      {/* Text overlays */}
      {overlays.map((overlay, i) => {
        if (frame < overlay.startFrame || frame > overlay.endFrame) return null;
        const localF = frame - overlay.startFrame;
        const opacity = interpolate(localF, [0, 8], [0, 1], { extrapolateRight: "clamp" })
          * interpolate(frame, [overlay.endFrame - 8, overlay.endFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
          <div key={i} style={{
            position: "absolute", bottom: format === "vertical" ? 200 : 120,
            left: 0, right: 0, textAlign: "center", opacity, zIndex: 60,
          }}>
            <div style={{
              display: "inline-block", padding: "14px 30px",
              background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)",
              borderRadius: 12, border: `1px solid ${brandColor}40`,
            }}>
              <span style={{ fontSize: sz, fontWeight: 700, color: COLORS.white, letterSpacing: 1 }}>
                {overlay.text}
              </span>
            </div>
          </div>
        );
      })}

      {/* Provider lower third */}
      {providerName && (
        <div style={{
          position: "absolute", bottom: format === "vertical" ? 100 : 40, left: 30,
          zIndex: 70,
        }}>
          <div style={{
            background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)",
            borderRadius: 10, padding: "10px 22px", borderLeft: `3px solid ${brandColor}`,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.white }}>{providerName}</div>
            {providerTitle && (
              <div style={{ fontSize: 14, color: brandColor }}>{providerTitle}</div>
            )}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Outro CTA
const OutroScene: React.FC<{ treatmentName: string; brandColor: string; format: VideoFormat }> = ({
  treatmentName, brandColor, format,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.12) * 0.06 + 1;
  const sz = scaledSize(FONT_SIZES.subheading, format);

  return (
    <AbsoluteFill style={{ background: GRADIENTS.darkVertical, justifyContent: "center", alignItems: "center", padding: 50 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz + 4, fontWeight: 800, color: COLORS.white, marginBottom: 10 }}>
            Experience {treatmentName}
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div style={{ fontSize: sz * 0.7, color: COLORS.textSecondary, marginBottom: 30 }}>
            at Hello Gorgeous Med Spa
          </div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <div style={{
            display: "inline-block", transform: `scale(${pulse})`,
            padding: "20px 44px", background: GRADIENTS.pinkHot, borderRadius: 50,
            fontSize: sz, fontWeight: 800, color: COLORS.white, letterSpacing: 2,
            boxShadow: SHADOWS.buttonGlow(brandColor),
          }}>
            BOOK YOUR CONSULTATION
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: 20, color: COLORS.white, fontWeight: 600, marginTop: 20 }}>📞 630-636-6193</div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const TreatmentPOV: React.FC<TreatmentPOVProps> = ({
  videoSrc, treatmentName, providerName, providerTitle,
  hookText = "Getting the deepest RF microneedling available",
  overlays = [], brandColor = COLORS.hotPink, format,
}) => {
  const videoDuration = 900; // 30s at 30fps total
  const introDuration = 90;
  const outroDuration = 150;
  const mainDuration = videoDuration - introDuration - outroDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sequence from={0} durationInFrames={introDuration}>
        <IntroScene hookText={hookText} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={introDuration} durationInFrames={mainDuration}>
        <VideoWithOverlays
          videoSrc={videoSrc} overlays={overlays}
          providerName={providerName} providerTitle={providerTitle}
          brandColor={brandColor} format={format}
        />
      </Sequence>
      <Sequence from={introDuration + mainDuration} durationInFrames={outroDuration}>
        <OutroScene treatmentName={treatmentName} brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
