import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
  Img,
  Video,
  staticFile,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";
import { GlowOrb } from "../brand/backgrounds";

interface LipFillerShowcaseProps {
  videoSrc?: string;
  beforeImage: string;
  afterImage: string;
  recoveryImage?: string;
  treatmentName?: string;
  brandColor?: string;
  format: VideoFormat;
}

const resolveSrc = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

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

// Scene 1: Hook
const HookScene: React.FC<{ treatmentName: string; brandColor: string; format: VideoFormat }> = ({
  treatmentName,
  brandColor,
  format,
}) => {
  const { width, height } = useVideoConfig();
  const sz = scaledSize(FONT_SIZES.sectionTitle, format);

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <GlowOrb color={brandColor} size={400} x={width * 0.2} y={height * 0.4} />
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: sz * 0.4,
              color: brandColor,
              letterSpacing: 6,
              marginBottom: 16,
            }}
          >
            REAL RESULTS
          </div>
        </AnimatedText>
        <AnimatedText delay={15}>
          <div style={{ fontSize: sz, fontWeight: 900, color: COLORS.white, lineHeight: 1.2 }}>
            This is what
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div
            style={{
              fontSize: sz,
              fontWeight: 900,
              background: GRADIENTS.pinkHot,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {treatmentName}
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: sz, fontWeight: 900, color: COLORS.white }}>looks like.</div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Before image
const BeforeScene: React.FC<{ beforeImage: string; brandColor: string; format: VideoFormat }> = ({
  beforeImage,
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const imgScale = interpolate(frame, [0, 90], [1.05, 1.0], { extrapolateRight: "clamp" });
  const imgW = format === "horizontal" ? 700 : format === "square" ? 600 : 500;
  const imgH = format === "horizontal" ? 450 : format === "square" ? 500 : 600;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 24px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 18,
              color: COLORS.textSecondary,
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
            BEFORE
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div
            style={{
              width: imgW,
              height: imgH,
              borderRadius: 16,
              overflow: "hidden",
              border: "2px solid rgba(255,255,255,0.15)",
              margin: "0 auto",
              transform: `scale(${imgScale})`,
            }}
          >
            <Img
              src={resolveSrc(beforeImage)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Video (treatment footage)
const VideoScene: React.FC<{
  videoSrc: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ videoSrc, brandColor, format }) => {
  return (
    <AbsoluteFill>
      <Video
        src={resolveSrc(videoSrc)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        delayRenderTimeoutInMilliseconds={60000}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 60,
          height: 60,
          borderTop: `3px solid ${brandColor}`,
          borderLeft: `3px solid ${brandColor}`,
          zIndex: 50,
          margin: 16,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          borderTop: `3px solid ${brandColor}`,
          borderRight: `3px solid ${brandColor}`,
          zIndex: 50,
          margin: 16,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 60,
          height: 60,
          borderBottom: `3px solid ${brandColor}`,
          borderLeft: `3px solid ${brandColor}`,
          zIndex: 50,
          margin: 16,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 60,
          height: 60,
          borderBottom: `3px solid ${brandColor}`,
          borderRight: `3px solid ${brandColor}`,
          zIndex: 50,
          margin: 16,
        }}
      />
      <Logo format={format} variant="watermark" />
      <div
        style={{
          position: "absolute",
          bottom: format === "vertical" ? 120 : 80,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 60,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "12px 28px",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(10px)",
            borderRadius: 12,
            border: `1px solid ${brandColor}40`,
          }}
        >
          <span
            style={{
              fontSize: scaledSize(FONT_SIZES.body, format),
              fontWeight: 700,
              color: COLORS.white,
              letterSpacing: 2,
            }}
          >
            LIP FILLER RESULTS
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Recovery moment (optional)
const RecoveryScene: React.FC<{
  recoveryImage: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ recoveryImage, brandColor, format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const imgW = format === "horizontal" ? 700 : format === "square" ? 550 : 480;
  const imgH = format === "horizontal" ? 450 : format === "square" ? 550 : 650;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <Logo format={format} variant="watermark" />
      <div style={{ textAlign: "center", zIndex: 10, opacity }}>
        <div
          style={{
            fontSize: scaledSize(FONT_SIZES.caption, format),
            color: brandColor,
            letterSpacing: 4,
            marginBottom: 16,
          }}
        >
          POST-TREATMENT CARE
        </div>
        <div
          style={{
            width: imgW,
            height: imgH,
            borderRadius: 16,
            overflow: "hidden",
            border: `2px solid ${brandColor}40`,
            margin: "0 auto",
          }}
        >
          <Img
            src={resolveSrc(recoveryImage)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Slider wipe reveal
const SliderRevealScene: React.FC<{
  beforeImage: string;
  afterImage: string;
  brandColor: string;
  format: VideoFormat;
}> = ({ beforeImage, afterImage, brandColor, format }) => {
  const frame = useCurrentFrame();
  const sliderPos = interpolate(frame, [15, 75], [95, 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const imgW = format === "horizontal" ? 800 : format === "square" ? 650 : 550;
  const imgH = format === "horizontal" ? 500 : format === "square" ? 550 : 700;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
      }}
    >
      <Logo format={format} variant="watermark" />
      <div
        style={{
          position: "relative",
          width: imgW,
          height: imgH,
          borderRadius: 16,
          overflow: "hidden",
          zIndex: 10,
        }}
      >
        <Img
          src={resolveSrc(afterImage)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div style={{ position: "absolute", inset: 0, width: `${sliderPos}%`, overflow: "hidden" }}>
          <Img
            src={resolveSrc(beforeImage)}
            style={{ width: imgW, height: imgH, objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: `${sliderPos}%`,
            top: 0,
            bottom: 0,
            width: 4,
            background: brandColor,
            boxShadow: SHADOWS.glow(brandColor, 15),
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            padding: "6px 16px",
            background: "rgba(0,0,0,0.7)",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: 2,
          }}
        >
          BEFORE
        </div>
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            padding: "6px 16px",
            background: `${brandColor}CC`,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.white,
            letterSpacing: 2,
          }}
        >
          AFTER
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: CTA
const CTAScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const pulse = Math.sin(frame * 0.12) * 0.06 + 1;
  const sz = scaledSize(FONT_SIZES.heading, format);
  const btnScale = spring({ frame: frame - 15, fps, from: 0, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill
      style={{
        background: GRADIENTS.darkVertical,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
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
          <div
            style={{
              display: "inline-block",
              padding: "22px 50px",
              background: GRADIENTS.pinkHot,
              borderRadius: 50,
              fontSize: scaledSize(FONT_SIZES.subheading, format),
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: 2,
              boxShadow: SHADOWS.buttonGlow(brandColor),
            }}
          >
            BOOK FREE CONSULTATION
          </div>
        </div>
        <AnimatedText delay={30}>
          <div style={{ fontSize: 22, color: COLORS.white, fontWeight: 600 }}>
            📞 630-636-6193
          </div>
        </AnimatedText>
        <AnimatedText delay={38}>
          <div
            style={{
              fontSize: 18,
              color: brandColor,
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            hellogorgeousmedspa.com
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const LipFillerShowcase: React.FC<LipFillerShowcaseProps> = ({
  videoSrc,
  beforeImage,
  afterImage,
  recoveryImage,
  treatmentName = "Dermal Lip Fillers",
  brandColor = COLORS.hotPink,
  format,
}) => {
  const hasRecovery = Boolean(recoveryImage);
  const hasVideo = Boolean(videoSrc);

  // Frame layout: with video = 990 frames, without = 540 frames
  const videoStart = 180;
  const videoDuration = 450;
  const recoveryStart = hasVideo ? 630 : 180;
  const recoveryDuration = 60;
  const sliderStart = hasVideo
    ? (hasRecovery ? 690 : 630)
    : (hasRecovery ? 240 : 180);
  const sliderDuration = 150;
  const ctaStart = hasVideo
    ? (hasRecovery ? 840 : 780)
    : (hasRecovery ? 390 : 330);
  const ctaDuration = 150;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.black,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Sequence from={0} durationInFrames={90}>
        <HookScene treatmentName={treatmentName} brandColor={brandColor} format={format} />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <BeforeScene beforeImage={beforeImage} brandColor={brandColor} format={format} />
      </Sequence>
      {hasVideo && (
        <Sequence from={videoStart} durationInFrames={videoDuration}>
          <VideoScene videoSrc={videoSrc!} brandColor={brandColor} format={format} />
        </Sequence>
      )}
      {hasRecovery && (
        <Sequence from={recoveryStart} durationInFrames={recoveryDuration}>
          <RecoveryScene
            recoveryImage={recoveryImage!}
            brandColor={brandColor}
            format={format}
          />
        </Sequence>
      )}
      <Sequence from={sliderStart} durationInFrames={sliderDuration}>
        <SliderRevealScene
          beforeImage={beforeImage}
          afterImage={afterImage}
          brandColor={brandColor}
          format={format}
        />
      </Sequence>
      <Sequence from={ctaStart} durationInFrames={ctaDuration}>
        <CTAScene brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
