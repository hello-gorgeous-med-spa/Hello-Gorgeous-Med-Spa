import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";
import { ExclusivityBanner } from "../components/ExclusivityBanner";
import { TrifectaCTA } from "../components/TrifectaCTA";

type VideoFormat = "vertical" | "square" | "horizontal";

interface GLP1SkinSolutionProps {
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
  color, size, x, y,
}) => {
  const frame = useCurrentFrame();
  const p = Math.sin(frame * 0.05) * 0.3 + 1;
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size * p, height: size * p, borderRadius: "50%",
      background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`,
      filter: "blur(40px)",
    }} />
  );
};

// Scene 1: Emotional Hook
const HookScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 36 : format === "square" ? 42 : 48;

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.15} y={height * 0.3} />
      <div style={{ textAlign: "center", zIndex: 10, maxWidth: format === "horizontal" ? 900 : 600 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz, fontWeight: 800, color: "white", lineHeight: 1.3, marginBottom: 20 }}>
            Lost <span style={{ color: "#4ADE80" }}>40+ lbs</span> on Semaglutide?
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{ fontSize: sz * 0.65, color: "#4ADE80", fontWeight: 700, marginBottom: 20 }}>
            Congratulations.
          </div>
        </AnimatedText>
        <AnimatedText delay={50}>
          <div style={{ fontSize: sz * 0.7, color: "#ffffff90", lineHeight: 1.4 }}>
            But what about the <span style={{ color: brandColor, fontWeight: 700 }}>loose skin</span>?
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: The Struggle
const StruggleScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 30 : format === "square" ? 34 : 38;

  const struggles = [
    { text: "Creams won't fix it.", icon: "✕" },
    { text: "Exercise won't fix it.", icon: "✕" },
    { text: "Time won't fix it.", icon: "✕" },
  ];

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, #0a0505 100%)", justifyContent: "center", alignItems: "center", padding: 60 }}>
      <GlowOrb color="#FF4444" size={300} x={width * 0.7} y={height * 0.2} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        {struggles.map((s, i) => (
          <AnimatedText key={i} delay={i * 20}>
            <div style={{
              fontSize: sz, color: "#ff6b6b", fontWeight: 600,
              marginBottom: 25, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 15,
            }}>
              <span style={{ color: "#ff4444", fontSize: sz * 1.2 }}>{s.icon}</span>
              {s.text}
            </div>
          </AnimatedText>
        ))}
        <AnimatedText delay={70}>
          <div style={{
            fontSize: sz + 4, color: "white", fontWeight: 800, marginTop: 30,
          }}>
            You need <span style={{ color: brandColor }}>medical-grade</span> technology.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: The Solution Intro
const SolutionScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 42 : format === "square" ? 48 : 56;
  const revealScale = spring({ frame: frame - 15, fps, from: 0.5, to: 1, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, #1a0a14 50%, #000 100%)", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.3} y={height * 0.4} />
      <GlowOrb color="#FFD700" size={350} x={width * 0.7} y={height * 0.2} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: 20, color: "#FFD700", letterSpacing: 6, marginBottom: 20 }}>
            THE SOLUTION
          </div>
        </AnimatedText>
        <div style={{ transform: `scale(${Math.max(revealScale, 0)})` }}>
          <AnimatedText delay={15}>
            <div style={{
              fontSize: sz, fontWeight: 900, color: "white",
              textShadow: `0 0 40px ${brandColor}`, marginBottom: 10,
            }}>
              THE INMODE
            </div>
          </AnimatedText>
          <AnimatedText delay={25}>
            <div style={{
              fontSize: sz * 1.1, fontWeight: 900,
              background: `linear-gradient(90deg, ${brandColor}, #FF69B4, #FFD700)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              TRIFECTA
            </div>
          </AnimatedText>
        </div>
        <AnimatedText delay={45}>
          <div style={{ fontSize: sz * 0.4, color: "#ffffff70", marginTop: 25, letterSpacing: 2 }}>
            Tighten · Resurface · Contour
          </div>
        </AnimatedText>
        <AnimatedText delay={55}>
          <div style={{ fontSize: sz * 0.38, color: "#ffffff50", marginTop: 12 }}>
            All without surgery
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Three Technology Cards
const TechCardsScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isVert = format === "vertical";
  const cardWidth = format === "horizontal" ? 280 : format === "square" ? 250 : 280;

  const techs = [
    { name: "MORPHEUS8\nBURST", action: "TIGHTEN", detail: "Deep tissue at 8mm", color: brandColor, icon: "🔬" },
    { name: "SOLARIA\nCO₂", action: "RESURFACE", detail: "Gold standard laser", color: "#FFD700", icon: "✨" },
    { name: "QUANTUM\nRF", action: "CONTOUR", detail: "Subdermal sculpting", color: "#00BFFF", icon: "💎" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 40 }}>
      <AnimatedText delay={0} style={{ marginBottom: 30 }}>
        <div style={{ fontSize: format === "horizontal" ? 28 : 32, color: "white", fontWeight: 700, textAlign: "center" }}>
          HOW IT WORKS
        </div>
      </AnimatedText>

      <div style={{
        display: "flex",
        flexDirection: isVert ? "column" : "row",
        gap: isVert ? 16 : 20,
        alignItems: "center",
        zIndex: 10,
      }}>
        {techs.map((tech, i) => {
          const cardScale = spring({
            frame: frame - 15 - i * 12,
            fps,
            from: 0, to: 1,
            config: { damping: 10 },
          });
          return (
            <div
              key={i}
              style={{
                transform: `scale(${Math.max(cardScale, 0)})`,
                width: isVert ? "90%" : cardWidth,
                padding: isVert ? "16px 24px" : "24px",
                background: `linear-gradient(135deg, ${tech.color}15, ${tech.color}08)`,
                border: `2px solid ${tech.color}40`,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{tech.icon}</div>
              <div style={{
                fontSize: isVert ? 18 : 16, color: tech.color, fontWeight: 800,
                letterSpacing: 2, marginBottom: 6, whiteSpace: "pre-line",
              }}>
                {tech.name}
              </div>
              <div style={{
                fontSize: isVert ? 22 : 20, color: "white", fontWeight: 700, marginBottom: 6,
              }}>
                {tech.action}
              </div>
              <div style={{ fontSize: isVert ? 14 : 13, color: "#ffffff60" }}>
                {tech.detail}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Only Here
const OnlyHereScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #000 0%, #0a0510 50%, #000 100%)",
      justifyContent: "center", alignItems: "center", padding: 50,
    }}>
      <GlowOrb color="#FFD700" size={400} x={width * 0.5 - 200} y={height * 0.3} />
      <div style={{ zIndex: 10 }}>
        <ExclusivityBanner delay={0} format={format} brandColor={brandColor} />
      </div>
    </AbsoluteFill>
  );
};

export const GLP1SkinSolution: React.FC<GLP1SkinSolutionProps> = ({ brandColor, format }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Scene 1: Hook (0-4s) */}
      <Sequence from={0} durationInFrames={120}>
        <HookScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: The Struggle (4-10s) */}
      <Sequence from={120} durationInFrames={180}>
        <StruggleScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: The Solution (10-16s) */}
      <Sequence from={300} durationInFrames={180}>
        <SolutionScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: Tech Cards (16-22s) */}
      <Sequence from={480} durationInFrames={180}>
        <TechCardsScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 5: Only Here (22-26s) */}
      <Sequence from={660} durationInFrames={120}>
        <OnlyHereScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 6: CTA (26-30s) */}
      <Sequence from={780} durationInFrames={120}>
        <TrifectaCTA delay={0} format={format} brandColor={brandColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
