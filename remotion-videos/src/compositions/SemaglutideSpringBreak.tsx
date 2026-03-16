import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";

type VideoFormat = "vertical" | "square" | "horizontal";

interface SemaglutideSpringBreakProps {
  brandColor: string;
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
  const y = spring({ frame: frame - delay, fps, from: 40, to: 0, config: { damping: 12 } });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

const GlowOrb: React.FC<{ color: string; size: number; x: number; y: number }> = ({
  color,
  size,
  x,
  y,
}) => {
  const frame = useCurrentFrame();
  const p = Math.sin(frame * 0.05) * 0.3 + 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size * p,
        height: size * p,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`,
        filter: "blur(40px)",
      }}
    />
  );
};

// Scene 1: Spring Break Hook
const HookScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 44 : format === "square" ? 52 : 58;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0d2137 40%, #0a1628 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <GlowOrb color="#FFD700" size={350} x={width * 0.2} y={height * 0.15} />
      <GlowOrb color={brandColor} size={300} x={width * 0.7} y={height * 0.7} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: 28,
              color: "#FFD700",
              fontWeight: 700,
              letterSpacing: 6,
              marginBottom: 20,
            }}
          >
            ☀️ SPRING BREAK SPECIAL ☀️
          </div>
        </AnimatedText>
        <AnimatedText delay={15}>
          <div
            style={{
              fontSize: sz,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.2,
              marginBottom: 15,
            }}
          >
            Get Beach-Ready
          </div>
        </AnimatedText>
        <AnimatedText delay={30}>
          <div
            style={{
              fontSize: sz * 0.85,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            Semaglutide / Ozempic
          </div>
        </AnimatedText>
        <AnimatedText delay={45}>
          <div style={{ fontSize: sz * 0.5, color: "#ffffff90", marginTop: 20 }}>
            Medical Weight Loss Program
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Price + What's Included
const PriceScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const priceScale = spring({
    frame: frame - 20,
    fps,
    from: 0.5,
    to: 1,
    config: { damping: 8, stiffness: 100 },
  });
  const sz = format === "horizontal" ? 36 : format === "square" ? 40 : 44;
  const priceSz = format === "horizontal" ? 90 : format === "square" ? 100 : 110;

  const includes = [
    { label: "Medical Oversight", icon: "👩‍⚕️" },
    { label: "Screening", icon: "✅" },
    { label: "Medicine Included", icon: "💉" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000 0%, #0a0a14 50%, #000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <GlowOrb color={brandColor} size={450} x={150} y={300} />
      <GlowOrb color="#FFD700" size={250} x={700} y={150} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: priceSz,
              fontWeight: 800,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4, ${brandColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              transform: `scale(${Math.max(priceScale, 0)})`,
              textShadow: `0 0 60px ${brandColor}80`,
            }}
          >
            $299<span style={{ fontSize: priceSz * 0.4 }}>/month</span>
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div
            style={{
              fontSize: sz * 0.7,
              color: "#FFD700",
              fontWeight: 700,
              marginTop: 10,
              letterSpacing: 2,
            }}
          >
            EVERYTHING INCLUDED
          </div>
        </AnimatedText>
        <AnimatedText delay={40}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 30,
              marginTop: 30,
              flexWrap: "wrap",
            }}
          >
            {includes.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 20px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  border: `2px solid ${brandColor}60`,
                }}
              >
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <span style={{ fontSize: sz * 0.65, color: "white", fontWeight: 600 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </AnimatedText>
        <AnimatedText delay={70}>
          <div
            style={{
              marginTop: 35,
              padding: "14px 36px",
              background: `linear-gradient(90deg, #FFD70020, #FFD70040, #FFD70020)`,
              borderRadius: 30,
              border: "2px solid #FFD70080",
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: "#FFD700",
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              🌴 HUGE SPECIAL — LIMITED TIME 🌴
            </span>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: CTA
const CTAScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({
  brandColor,
  format,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame * 0.12) * 0.08 + 1;
  const sz = format === "horizontal" ? 42 : format === "square" ? 48 : 54;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #000 0%, #1a0a14 50%, #000 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
      }}
    >
      <GlowOrb color={brandColor} size={500} x={200} y={400} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div
            style={{
              fontSize: sz,
              fontWeight: 800,
              color: "white",
              marginBottom: 15,
            }}
          >
            Hello Gorgeous
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div
            style={{
              fontSize: sz * 0.6,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
              marginBottom: 30,
            }}
          >
            Med Spa
          </div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <div style={{ fontSize: 24, color: "#ffffff90", marginBottom: 8 }}>
            📍 74 W Washington St • Oswego, IL
          </div>
        </AnimatedText>
        <AnimatedText delay={30}>
          <div style={{ fontSize: 26, color: "white", fontWeight: 600, marginBottom: 35 }}>
            📞 630-636-6193
          </div>
        </AnimatedText>
        <AnimatedText delay={40}>
          <div
            style={{
              transform: `scale(${pulse})`,
              padding: "28px 60px",
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4)`,
              borderRadius: 50,
              fontSize: 34,
              fontWeight: 800,
              color: "white",
              letterSpacing: 2,
              boxShadow: `0 10px 50px ${brandColor}90`,
            }}
          >
            BOOK NOW
          </div>
        </AnimatedText>
        <AnimatedText delay={55}>
          <div style={{ fontSize: 22, color: brandColor, fontWeight: 600, marginTop: 25 }}>
            hellogorgeousmedspa.com
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const SemaglutideSpringBreak: React.FC<SemaglutideSpringBreakProps> = ({
  brandColor,
  format,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Scene 1: Spring Break Hook (0–4s) */}
      <Sequence from={0} durationInFrames={120}>
        <HookScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: Price + What's Included (4–10s) */}
      <Sequence from={120} durationInFrames={180}>
        <PriceScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: CTA (10–15s) */}
      <Sequence from={300} durationInFrames={150}>
        <CTAScene brandColor={brandColor} format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
