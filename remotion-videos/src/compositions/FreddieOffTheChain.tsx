import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";

// Mexican flag colors — use only on CTA
const GREEN = "#008C45";
const WHITE = "#FFFFFF";
const RED = "#CE2B37";

const resolveSrc = (src: string) =>
  src.startsWith("http") || src.startsWith("data:") ? src : staticFile(src);

// Mexican flag bar — ONLY on final CTA per creative brief
const MexicanFlagBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 12,
      display: "flex",
      flexDirection: "row",
    }}
  >
    <div style={{ flex: 1, background: GREEN }} />
    <div style={{ flex: 1, background: WHITE }} />
    <div style={{ flex: 1, background: RED }} />
  </div>
);

// Full-bleed image with Ken Burns (slow zoom) — no boxes, edge to edge
const FullBleedKenBurns: React.FC<{
  imageSrc: string;
  duration: number;
  textOverlay?: React.ReactNode;
}> = ({ imageSrc, duration, textOverlay }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const scale = interpolate(frame, [0, duration], [1, 1.12], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <Img
        src={resolveSrc(imageSrc)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      {textOverlay && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 20px 32px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            color: WHITE,
            opacity,
            textAlign: "center",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            fontSize: scaledSize(FONT_SIZES.heading, "vertical") * 0.4,
            fontWeight: 700,
            letterSpacing: 1,
            lineHeight: 1.3,
          }}
        >
          {textOverlay}
        </div>
      )}
    </AbsoluteFill>
  );
};

// 0–3s: HOOK — Full-bleed steak taco + scroll-stop text
const HookScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.sectionTitle, format);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FullBleedKenBurns imageSrc="freddies/steak-tacos.png" duration={90} />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          left: 0,
          right: 0,
          padding: "0 24px",
          opacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: sz * 0.6,
            fontWeight: 800,
            color: WHITE,
            textShadow: "0 2px 12px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.6)",
            lineHeight: 1.2,
          }}
        >
          This taco changed downtown Oswego.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3–8s: MONA'S STORY — Ribbon cutting, Ken Burns, emotional beat
const MonaStoryScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <FullBleedKenBurns imageSrc="freddies/ribbon-cutting.png" duration={150} />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "40px 24px 50px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          opacity,
        }}
      >
        <div
          style={{
            fontSize: sz * 0.5,
            fontWeight: 800,
            color: WHITE,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            lineHeight: 1.4,
            marginBottom: 8,
          }}
        >
          Mona lost her son Freddie in 2017.
        </div>
        <div
          style={{
            fontSize: sz * 0.42,
            color: "rgba(255,255,255,0.95)",
            textShadow: "0 2px 6px rgba(0,0,0,0.9)",
            lineHeight: 1.4,
          }}
        >
          He always said her cooking was &quot;off the chain.&quot; So she built this.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8–16s: FOOD MONTAGE — Quick cuts, full-bleed, 1–2 sec each
const FoodMontageScene: React.FC<{
  imageSrc: string;
  format: VideoFormat;
  label?: string;
  duration: number;
}> = ({ imageSrc, format, label, duration }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, duration], [1, 1.08], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={resolveSrc(imageSrc)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 20,
            right: 20,
            padding: "8px 16px",
            background: "rgba(0,0,0,0.5)",
            color: WHITE,
            fontSize: scaledSize(FONT_SIZES.caption, format),
            fontWeight: 700,
            textAlign: "center",
            opacity: labelOpacity,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};

// 16–21s: THE VIBE — Bar, patio, ribbon crowd
const VibeScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1, 1.08], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={resolveSrc("freddies/interior-bar.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "36px 20px 44px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: sz * 0.55,
            fontWeight: 800,
            color: WHITE,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            letterSpacing: 2,
          }}
        >
          Full bar · Indoor & outdoor seating
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 21–26s: THE PROOF — Review quote over beauty shot
const ProofScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1, 1.08], { extrapolateRight: "clamp" });
  const textOpacity = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={resolveSrc("freddies/steak-tacos.png")}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "40px 24px 50px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
          opacity: textOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: sz * 0.45,
            fontWeight: 600,
            color: WHITE,
            fontStyle: "italic",
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            lineHeight: 1.4,
          }}
        >
          &quot;If I could give 10 stars I would.&quot;
        </div>
        <div
          style={{
            fontSize: sz * 0.3,
            color: "rgba(255,255,255,0.9)",
            marginTop: 8,
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          — Google review · ★ 4.4 · 173 reviews
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 26–30s: CTA — Clean, Mexican flag bar ONLY here, no gradient button
const CTAScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const sz = scaledSize(FONT_SIZES.heading, format);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
      }}
    >
      <MexicanFlagBar />
      <div style={{ textAlign: "center", zIndex: 10, opacity }}>
        <div
          style={{
            fontSize: sz * 0.7,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: WHITE,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Freddie&apos;s Off The Chain
        </div>
        <div
          style={{
            fontSize: sz * 0.5,
            fontWeight: 800,
            color: WHITE,
            marginBottom: 12,
            letterSpacing: 2,
          }}
        >
          Open Thu–Sat · 5pm
        </div>
        <div
          style={{
            fontSize: sz * 0.45,
            fontWeight: 700,
            color: WHITE,
            marginBottom: 8,
          }}
        >
          Order at freddiesoffthechain.com
        </div>
        <div
          style={{
            fontSize: sz * 0.35,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          11 S Madison St · Oswego, IL · (815) 927-7722
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Timing per creative brief: 25–30 seconds total
const HOOK_DURATION = 90; // 0–3s
const MONA_STORY_DURATION = 150; // 3–8s
const FOOD_MONTAGE_DURATION = 40; // ~1.3s each × 6 = 8s
const FOOD_SHOTS = [
  { src: "freddies/steak-tacos.png", label: "Steak Tacos" },
  { src: "freddies/shrimp-tacos.png", label: "Shrimp Tacos" },
  { src: "freddies/chicken-platter.png", label: "Tacos, Rice & Beans" },
  { src: "freddies/interior-green.png", label: "Full Bar" },
  { src: "freddies/interior-social.png", label: "Downtown Oswego" },
  { src: "freddies/ribbon-cutting.png", label: "Grand Opening" },
];
const FOOD_MONTAGE_TOTAL = FOOD_SHOTS.length * FOOD_MONTAGE_DURATION; // 240
const VIBE_DURATION = 150; // 16–21s
const PROOF_DURATION = 150; // 21–26s
const CTA_DURATION = 120; // 26–30s

const TOTAL_FRAMES =
  HOOK_DURATION +
  MONA_STORY_DURATION +
  FOOD_MONTAGE_TOTAL +
  VIBE_DURATION +
  PROOF_DURATION +
  CTA_DURATION; // 900 = 30 sec

export interface FreddieOffTheChainProps {
  format: VideoFormat;
}

export const FreddieOffTheChain: React.FC<FreddieOffTheChainProps> = ({ format }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Sequence from={0} durationInFrames={HOOK_DURATION}>
        <HookScene format={format} />
      </Sequence>
      <Sequence from={HOOK_DURATION} durationInFrames={MONA_STORY_DURATION}>
        <MonaStoryScene format={format} />
      </Sequence>

      {FOOD_SHOTS.map((shot, i) => (
        <Sequence
          key={shot.src}
          from={HOOK_DURATION + MONA_STORY_DURATION + i * FOOD_MONTAGE_DURATION}
          durationInFrames={FOOD_MONTAGE_DURATION}
        >
          <FoodMontageScene
            imageSrc={shot.src}
            format={format}
            label={shot.label}
            duration={FOOD_MONTAGE_DURATION}
          />
        </Sequence>
      ))}

      <Sequence
        from={HOOK_DURATION + MONA_STORY_DURATION + FOOD_MONTAGE_TOTAL}
        durationInFrames={VIBE_DURATION}
      >
        <VibeScene format={format} />
      </Sequence>
      <Sequence
        from={
          HOOK_DURATION +
          MONA_STORY_DURATION +
          FOOD_MONTAGE_TOTAL +
          VIBE_DURATION
        }
        durationInFrames={PROOF_DURATION}
      >
        <ProofScene format={format} />
      </Sequence>
      <Sequence
        from={
          HOOK_DURATION +
          MONA_STORY_DURATION +
          FOOD_MONTAGE_TOTAL +
          VIBE_DURATION +
          PROOF_DURATION
        }
        durationInFrames={CTA_DURATION}
      >
        <CTAScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
