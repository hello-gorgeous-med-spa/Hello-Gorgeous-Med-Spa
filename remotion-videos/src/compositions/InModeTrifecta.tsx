import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";
import { TrifectaBadge } from "../components/TrifectaBadge";
import { TrifectaCTA } from "../components/TrifectaCTA";

type VideoFormat = "vertical" | "square" | "horizontal";

interface InModeTrifectaProps {
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

const LaserSweep: React.FC<{ brandColor: string }> = ({ brandColor }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const beamX = interpolate(frame, [0, 50], [-200, width + 200], { extrapolateRight: "clamp" });
  const beamOpacity = interpolate(frame, [0, 10, 40, 50], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <>
      <div style={{
        position: "absolute", left: beamX - 80, top: 0, width: 160, height,
        background: `linear-gradient(90deg, transparent, ${brandColor}60, #FF69B4, ${brandColor}60, transparent)`,
        opacity: beamOpacity, filter: "blur(15px)", zIndex: 100,
      }} />
      <div style={{
        position: "absolute", left: beamX - 2, top: 0, width: 4, height,
        background: `linear-gradient(180deg, transparent 5%, white 50%, transparent 95%)`,
        opacity: beamOpacity * 0.7, boxShadow: `0 0 25px ${brandColor}`, zIndex: 101,
      }} />
    </>
  );
};

// Scene 1: Hook -- "$500K Investment. Your Skin."
const HookScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const mainScale = spring({ frame, fps, from: 0.3, to: 1, config: { damping: 8 } });
  const glowIntensity = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: "clamp" });
  const sz = format === "horizontal" ? 52 : format === "square" ? 60 : 68;

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center" }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.1} y={height * 0.2} />
      <GlowOrb color="#FFD700" size={350} x={width * 0.7} y={height * 0.6} />
      <div style={{ transform: `scale(${mainScale})`, textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: "#FFD700",
            textShadow: `0 0 ${40 * glowIntensity}px #FFD700`,
            letterSpacing: 3, marginBottom: 16,
          }}>
            $500K INVESTMENT
          </div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <div style={{
            fontSize: sz * 0.7, fontWeight: 700, color: "white", letterSpacing: 2,
          }}>
            IN <span style={{ color: brandColor }}>YOUR</span> SKIN
          </div>
        </AnimatedText>
      </div>
      <LaserSweep brandColor={brandColor} />
    </AbsoluteFill>
  );
};

// Scene 2: GLP-1 Problem
const ProblemScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 38 : format === "square" ? 42 : 48;
  const sub = format === "horizontal" ? 26 : format === "square" ? 30 : 34;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #000 0%, #0a0a0a 100%)", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={300} x={width * 0.8} y={height * 0.15} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: sz, fontWeight: 700, color: "white", marginBottom: 30, lineHeight: 1.3 }}>
            Lost weight on <span style={{ color: brandColor }}>Semaglutide</span>?
          </div>
        </AnimatedText>
        <AnimatedText delay={20}>
          <div style={{ fontSize: sub, color: "#ffffff90", lineHeight: 1.5 }}>
            Love the scale...
          </div>
        </AnimatedText>
        <AnimatedText delay={35}>
          <div style={{ fontSize: sub + 4, color: "white", fontWeight: 700, marginTop: 20 }}>
            But not <span style={{ color: brandColor }}>your skin</span>?
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 3: Morpheus8 Burst Reveal
const BurstRevealScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 48 : format === "square" ? 56 : 62;

  const depthBar = spring({ frame: frame - 25, fps, from: 0, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color={brandColor} size={400} x={width * 0.2} y={height * 0.4} />
      <LaserSweep brandColor={brandColor} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: 20, color: "#FFD700", letterSpacing: 6, marginBottom: 16 }}>
            TECHNOLOGY 1
          </div>
        </AnimatedText>
        <AnimatedText delay={8}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: "white",
            textShadow: `0 0 30px ${brandColor}`, marginBottom: 10,
          }}>
            MORPHEUS8 <span style={{ color: brandColor }}>BURST</span>
          </div>
        </AnimatedText>
        <AnimatedText delay={18}>
          <div style={{ fontSize: sz * 0.45, color: "#ffffff80", marginBottom: 30 }}>
            Deepest RF Microneedling Available
          </div>
        </AnimatedText>
        <AnimatedText delay={25}>
          <div style={{ display: "flex", justifyContent: "center", gap: 30, alignItems: "flex-end" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80 * depthBar, background: "#ffffff30",
                borderRadius: 8, marginBottom: 10, transition: "height 0.3s",
              }} />
              <div style={{ color: "#ffffff60", fontSize: 18 }}>Standard</div>
              <div style={{ color: "#ffffff40", fontSize: 16 }}>4mm</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 160 * depthBar,
                background: `linear-gradient(180deg, ${brandColor}, #FF69B4)`,
                borderRadius: 8, marginBottom: 10,
                boxShadow: `0 0 20px ${brandColor}60`,
              }} />
              <div style={{ color: "white", fontSize: 18, fontWeight: 700 }}>BURST</div>
              <div style={{ color: brandColor, fontSize: 16, fontWeight: 700 }}>8mm</div>
            </div>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 4: Solaria CO2 Reveal
const SolariaRevealScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 48 : format === "square" ? 56 : 62;

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color="#FFD700" size={400} x={width * 0.6} y={height * 0.3} />
      <LaserSweep brandColor="#FFD700" />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: 20, color: "#FFD700", letterSpacing: 6, marginBottom: 16 }}>
            TECHNOLOGY 2
          </div>
        </AnimatedText>
        <AnimatedText delay={8}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: "white",
            textShadow: "0 0 30px #FFD700", marginBottom: 10,
          }}>
            SOLARIA <span style={{ color: "#FFD700" }}>CO₂</span>
          </div>
        </AnimatedText>
        <AnimatedText delay={18}>
          <div style={{ fontSize: sz * 0.45, color: "#ffffff80" }}>
            Gold Standard Fractional Laser
          </div>
        </AnimatedText>
        <AnimatedText delay={30}>
          <div style={{
            marginTop: 30, fontSize: 22, color: "#FFD700", fontWeight: 600,
            padding: "10px 30px", border: "1px solid #FFD70060", borderRadius: 30,
            display: "inline-block",
          }}>
            Nobody locally has this.
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 5: QuantumRF Reveal
const QuantumRevealScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const { width, height } = useVideoConfig();
  const sz = format === "horizontal" ? 48 : format === "square" ? 56 : 62;

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 50 }}>
      <GlowOrb color="#00BFFF" size={400} x={width * 0.3} y={height * 0.5} />
      <GlowOrb color={brandColor} size={300} x={width * 0.8} y={height * 0.2} />
      <div style={{ textAlign: "center", zIndex: 10 }}>
        <AnimatedText delay={0}>
          <div style={{ fontSize: 20, color: "#00BFFF", letterSpacing: 6, marginBottom: 16 }}>
            TECHNOLOGY 3
          </div>
        </AnimatedText>
        <AnimatedText delay={8}>
          <div style={{
            fontSize: sz, fontWeight: 900, color: "white",
            textShadow: "0 0 30px #00BFFF", marginBottom: 10,
          }}>
            QUANTUM<span style={{ color: "#00BFFF" }}>RF</span>
          </div>
        </AnimatedText>
        <AnimatedText delay={18}>
          <div style={{ fontSize: sz * 0.45, color: "#ffffff80" }}>
            Subdermal Contouring
          </div>
        </AnimatedText>
        <AnimatedText delay={30}>
          <div style={{
            marginTop: 30, fontSize: 24, fontWeight: 700, color: "white",
          }}>
            Surgical-level results. <span style={{ color: "#00BFFF" }}>No surgery.</span>
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

// Scene 6: Exclusivity + Trifecta Badge
const ExclusivityScene: React.FC<{ brandColor: string; format: VideoFormat }> = ({ brandColor, format }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const glowPulse = Math.sin(frame * 0.06) * 0.15 + 1;

  return (
    <AbsoluteFill style={{ background: "#000", justifyContent: "center", alignItems: "center", padding: 40 }}>
      <GlowOrb color={brandColor} size={500} x={width * 0.5 - 250} y={height * 0.3} />
      <GlowOrb color="#FFD700" size={400} x={width * 0.2} y={height * 0.7} />

      <div style={{ textAlign: "center", zIndex: 10 }}>
        <TrifectaBadge delay={0} format={format} brandColor={brandColor} />

        <AnimatedText delay={30} style={{ marginTop: 40 }}>
          <div style={{
            fontSize: format === "horizontal" ? 24 : 28,
            fontWeight: 700, color: "#FFD700", letterSpacing: 3,
            transform: `scale(${glowPulse})`,
          }}>
            THE ONLY MED SPA
          </div>
        </AnimatedText>
        <AnimatedText delay={40}>
          <div style={{
            fontSize: format === "horizontal" ? 20 : 24,
            color: "#ffffff90", marginTop: 10,
          }}>
            in the Western Chicago Suburbs
          </div>
        </AnimatedText>
        <AnimatedText delay={50}>
          <div style={{
            fontSize: format === "horizontal" ? 18 : 20,
            color: "#ffffff60", marginTop: 20,
            display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap",
          }}>
            {["Oswego", "Naperville", "Aurora", "Plainfield"].map((c) => (
              <span key={c} style={{
                padding: "4px 14px", borderRadius: 20, border: "1px solid #ffffff20",
              }}>{c}</span>
            ))}
          </div>
        </AnimatedText>
      </div>
    </AbsoluteFill>
  );
};

export const InModeTrifecta: React.FC<InModeTrifectaProps> = ({ brandColor, format }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Scene 1: Hook (0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <HookScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 2: GLP-1 Problem (3-8s) */}
      <Sequence from={90} durationInFrames={150}>
        <ProblemScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 3: Morpheus8 Burst (8-12s) */}
      <Sequence from={240} durationInFrames={120}>
        <BurstRevealScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 4: Solaria CO2 (12-16s) */}
      <Sequence from={360} durationInFrames={120}>
        <SolariaRevealScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 5: QuantumRF (16-20s) */}
      <Sequence from={480} durationInFrames={120}>
        <QuantumRevealScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 6: Exclusivity Badge (20-24s) */}
      <Sequence from={600} durationInFrames={120}>
        <ExclusivityScene brandColor={brandColor} format={format} />
      </Sequence>

      {/* Scene 7: CTA (24-30s) */}
      <Sequence from={720} durationInFrames={180}>
        <TrifectaCTA delay={0} format={format} brandColor={brandColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
