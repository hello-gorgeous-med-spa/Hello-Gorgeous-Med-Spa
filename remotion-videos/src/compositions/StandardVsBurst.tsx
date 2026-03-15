import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";
import { TrifectaCTA } from "../components/TrifectaCTA";

type VideoFormat = "vertical" | "square" | "horizontal";

interface StandardVsBurstProps {
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

// Scene 1: Provocative Hook
const HookScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 40 : format === "square" ? 46 : 52;
  const shake = Math.sin(frame * 0.3) * (frame < 20 ? 2 : 0);
  const revealScale = spring({ frame: frame - 5, fps, from: 0.5, to: 1, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color="#FF4444" size={400} x={width * 0.5 - 200} y={height * 0.3} />
      <div style={{ textAlign: "center", zIndex: 10, transform: `translateX(${shake}px) scale(${revealScale})` }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.5, color: "#ff6b6b", letterSpacing: 4, marginBottom: 16 }}>
            ⚠️ TRUTH BOMB ⚠️
          </div>
        </AnimatedText>
        <AnimatedText delay={10}>
          <div style={{ fontSize: sz, fontWeight: 900, color: "white", lineHeight: 1.2 }}>
            Your Morpheus8 provider
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: brandColor, lineHeight: 1.2,
            textShadow: `0 0 30px ${brandColor}`,
          }}>
            isn&apos;t telling you this.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 2: Split Screen Comparison
const ComparisonScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const isVert = format === "vertical";

  const standardBarH = spring({ frame: frame - 30, fps, from: 0, to: 0.4, config: { damping: 15 } });
  const burstBarH = spring({ frame: frame - 40, fps, from: 0, to: 1, config: { damping: 15 } });

  const maxBarHeight = isVert ? 300 : format === "square" ? 250 : 200;
  const colGap = isVert ? 20 : 40;
  const titleSz = format === "horizontal" ? 28 : format === "square" ? 32 : 36;
  const labelSz = format === "horizontal" ? 18 : format === "square" ? 20 : 22;
  const dividerFlash = interpolate(frame, [25, 35], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 40 }}>
      <AnimatedText delay={0} style={{ marginBottom: 30 }}>
        <div style={{ fontSize: titleSz, color: "white", fontWeight: 800, textAlign: "center" }}>
          STANDARD vs. <span style={{ color: brandColor }}>BURST</span>
        </div>
      </AnimatedText>

      <div style={{
        display: "flex",
        flexDirection: isVert ? "row" : "row",
        gap: colGap, alignItems: "flex-end", justifyContent: "center",
        zIndex: 10,
      }}>
        {/* Standard Side */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <AnimatedText delay={20}>
            <div style={{
              width: isVert ? 120 : 140, height: maxBarHeight * standardBarH,
              background: "linear-gradient(180deg, #444, #222)",
              borderRadius: "12px 12px 0 0", margin: "0 auto", marginBottom: 16,
              border: "1px solid #555",
            }} />
          </AnimatedText>
          <div style={{ fontSize: labelSz + 4, color: "#999", fontWeight: 700, marginBottom: 6 }}>
            Standard
          </div>
          <div style={{ fontSize: labelSz, color: "#666" }}>1 depth</div>
          <div style={{
            fontSize: labelSz + 8, color: "#888", fontWeight: 900, marginTop: 10,
          }}>
            4mm
          </div>
        </div>

        {/* VS Divider */}
        <div style={{
          opacity: dividerFlash,
          fontSize: isVert ? 28 : 36, fontWeight: 900,
          color: "#ffffff40", alignSelf: "center",
          marginBottom: maxBarHeight * 0.3,
        }}>
          VS
        </div>

        {/* Burst Side */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <AnimatedText delay={30}>
            <div style={{
              width: isVert ? 120 : 140, height: maxBarHeight * burstBarH,
              background: `linear-gradient(180deg, ${brandColor}, #FF69B4)`,
              borderRadius: "12px 12px 0 0", margin: "0 auto", marginBottom: 16,
              boxShadow: `0 0 30px ${brandColor}50`,
              border: `1px solid ${brandColor}`,
            }} />
          </AnimatedText>
          <div style={{ fontSize: labelSz + 4, color: "white", fontWeight: 800, marginBottom: 6 }}>
            BURST
          </div>
          <div style={{ fontSize: labelSz, color: brandColor }}>3 depths</div>
          <div style={{
            fontSize: labelSz + 8, color: brandColor, fontWeight: 900, marginTop: 10,
            textShadow: `0 0 15px ${brandColor}`,
          }}>
            8mm
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: What This Means
const ImpactScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 32 : format === "square" ? 36 : 40;

  const impacts = [
    { text: "Double the precision", icon: "🎯" },
    { text: "Half the sessions", icon: "⚡" },
    { text: "Dramatically better results", icon: "💎" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.2} y={height * 0.5} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz - 4, color: "#FFD700", letterSpacing: 4, marginBottom: 30 }}>
            WHAT THIS MEANS FOR YOU
          </div>
        </AnimatedText>

        {impacts.map((item, i) => (
          <AnimatedText key={i} delay={15 + i * 18}>
            <div style={{
              fontSize: sz, color: "white", fontWeight: 700,
              marginBottom: 24, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 16,
            }}>
              <span style={{ fontSize: sz + 8 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          </AnimatedText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Who Has What (Competitive)
const CompetitorScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sz = format === "horizontal" ? 20 : format === "square" ? 22 : 24;

  const checkScale = (delay: number) => spring({
    frame: frame - delay, fps, from: 0, to: 1, config: { damping: 8 },
  });

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 40 }}>
      <AnimatedText delay={0}>
        <div style={{ fontSize: sz + 8, color: "white", fontWeight: 800, textAlign: "center", marginBottom: 30 }}>
          WHO HAS WHAT?
        </div>
      </AnimatedText>

      <div style={{ zIndex: 10, width: format === "horizontal" ? 700 : "90%" }}>
        {/* Header */}
        <AnimatedText delay={10}>
          <div style={{
            display: "flex", padding: "12px 20px", borderBottom: `2px solid ${brandColor}40`,
            marginBottom: 8,
          }}>
            <div style={{ flex: 2, fontSize: sz - 2, color: "#ffffff60", fontWeight: 600 }}>Technology</div>
            <div style={{ flex: 1, fontSize: sz - 2, color: "#ffffff40", textAlign: "center" }}>Others</div>
            <div style={{ flex: 1, fontSize: sz - 2, color: brandColor, fontWeight: 700, textAlign: "center" }}>Hello Gorgeous</div>
          </div>
        </AnimatedText>

        {/* Rows */}
        {[
          { tech: "Morpheus8 Burst (8mm)", others: false, hg: true, delay: 20 },
          { tech: "Solaria CO₂ Laser", others: false, hg: true, delay: 30 },
          { tech: "QuantumRF Subdermal", others: false, hg: true, delay: 40 },
          { tech: "NP Prescriptive Authority", others: false, hg: true, delay: 50 },
        ].map((row, i) => (
          <AnimatedText key={i} delay={row.delay}>
            <div style={{
              display: "flex", padding: "14px 20px", alignItems: "center",
              background: i % 2 === 0 ? "#ffffff05" : "transparent", borderRadius: 8,
            }}>
              <div style={{ flex: 2, fontSize: sz, color: "white", fontWeight: 500 }}>{row.tech}</div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{
                  transform: `scale(${Math.max(checkScale(row.delay + 5), 0)})`,
                  display: "inline-block", fontSize: sz + 4,
                  color: "#ff4444",
                }}>✕</span>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{
                  transform: `scale(${Math.max(checkScale(row.delay + 8), 0)})`,
                  display: "inline-block", fontSize: sz + 4,
                  color: "#4ADE80",
                }}>✓</span>
              </div>
            </div>
          </AnimatedText>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: Full Trifecta
const FullPictureScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 34 : format === "square" ? 38 : 44;

  const badgeScale = spring({ frame: frame - 30, fps, from: 0, to: 1, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, #1a0a14 50%, #000 100%)", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.3} y={height * 0.4} />
      <GlowOrb color="#FFD700" size={350} x={width * 0.7} y={height * 0.6} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz * 0.55, color: "#FFD700", letterSpacing: 4, marginBottom: 16 }}>
            THE COMPLETE PACKAGE
          </div>
        </AnimatedText>
        <AnimatedText delay={12}>
          <div style={{ fontSize: sz, fontWeight: 900, color: "white", marginBottom: 8 }}>
            MORPHEUS8 BURST
          </div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <div style={{ fontSize: sz * 0.6, color: "#ffffff50", marginBottom: 16 }}>+</div>
        </AnimatedText>
        <AnimatedText delay={24}>
          <div style={{ fontSize: sz, fontWeight: 900, color: "white", marginBottom: 8 }}>
            SOLARIA CO₂
          </div>
        </AnimatedText>
        <AnimatedText delay={32}>
          <div style={{ fontSize: sz * 0.6, color: "#ffffff50", marginBottom: 16 }}>+</div>
        </AnimatedText>
        <AnimatedText delay={36}>
          <div style={{ fontSize: sz, fontWeight: 900, color: "white", marginBottom: 20 }}>
            QUANTUMRF
          </div>
        </AnimatedText>

        <div style={{ transform: `scale(${Math.max(badgeScale, 0)})` }}>
          <AnimatedText delay={45}>
            <div style={{
              display: "inline-block", padding: "16px 40px",
              background: `linear-gradient(90deg, ${brandColor}30, ${brandColor}50, ${brandColor}30)`,
              borderRadius: 50, border: `2px solid ${brandColor}`,
              fontSize: sz * 0.5, color: "white", fontWeight: 800, letterSpacing: 3,
              boxShadow: `0 0 40px ${brandColor}40`,
            }}>
              THE INMODE TRIFECTA
            </div>
          </AnimatedText>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StandardVsBurst: React.FC<StandardVsBurstProps> = ({ brandColor, format }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: Split Comparison (3-10s) */}
      <Sequence from={90} durationInFrames={210}>
        <ComparisonScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: Impact (10-16s) */}
      <Sequence from={300} durationInFrames={180}>
        <ImpactScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: Competitor Table (16-20s) */}
      <Sequence from={480} durationInFrames={120}>
        <CompetitorScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 5: Full Trifecta (20-24s) */}
      <Sequence from={600} durationInFrames={120}>
        <FullPictureScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 6: CTA (24-30s) */}
      <Sequence from={720} durationInFrames={180}>
        <TrifectaCTA
          delay={0}
          format={format}
          brandColor={brandColor}
          ctaText="BOOK WITH US"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
