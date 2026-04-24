/**
 * Contour Lift™ / Quantum RF — social video aligned with /services/quantum-rf
 * Uses static assets from remotion-videos/public/images (copied from site public).
 */
import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  Sequence,
  spring,
  useVideoConfig,
} from "remotion";
import { COLORS, GRADIENTS, SHADOWS, scaledSize, FONT_SIZES, type VideoFormat } from "../brand/theme";
import { Logo } from "../brand/Logo";

export const QUANTUM_CONTOUR_FRAMES = 900;

const brandColor = "#E6007E";

const res = (p: string) => staticFile(p);

const AnimatedLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const y = spring({ frame: frame - delay, fps, from: 24, to: 0, config: { damping: 15 } });
  return <div style={{ opacity: o, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
};

/** Dark gradient for text on photos */
const Overlay = ({ strong = false }: { strong?: boolean }) => (
  <AbsoluteFill
    style={{
      background: strong
        ? "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.92) 100%)"
        : "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.75) 100%)",
      pointerEvents: "none",
    }}
  />
);

const FullBleedPhoto: React.FC<{
  src: string;
  KenBurns?: boolean;
  alt: string;
}> = ({ src, KenBurns = true, alt }) => {
  const f = useCurrentFrame();
  const s = KenBurns ? interpolate(f, [0, 100], [1, 1.06], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img
        src={res(src)}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${s})`,
          transformOrigin: "50% 40%",
        }}
      />
    </AbsoluteFill>
  );
};

// 0–150: Hero — same promise as the website H1
const HeroScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.sectionTitle, format);
  return (
    <AbsoluteFill>
      <FullBleedPhoto
        src="images/quantum-rf/clinical-ba-profile-jawline-submental.png"
        alt="Quantum RF profile contouring"
      />
      <Overlay strong />
      <Logo format={format} variant="watermark" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: format === "horizontal" ? 40 : 36,
          paddingBottom: 44,
        }}
      >
        <p style={{ fontSize: t * 0.22, color: brandColor, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>
          HELLO GORGEOUS · CONTOUR LIFT ™
        </p>
        <AnimatedLine delay={4}>
          <h1
            style={{
              fontSize: t * 0.72,
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.08,
              margin: 0,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            The non-surgical alternative to lipo &amp; skin removal
          </h1>
        </AnimatedLine>
        <AnimatedLine delay={20}>
          <p style={{ fontSize: t * 0.32, color: "rgba(255,255,255,0.9)", marginTop: 14, lineHeight: 1.35, maxWidth: 920 }}>
            Quantum RF: minimally invasive contouring — tighten loose skin, sculpt stubborn areas, without surgery.
          </p>
        </AnimatedLine>
        <p style={{ fontSize: scaledSize(12, format), color: "rgba(255,255,255,0.45)", marginTop: 16 }}>
          Representative image. Results vary; not all patients are candidates.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// 150–300: Who it’s for (matches “Often ideal” + weight-loss skin on site)
const AudienceScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.heading, format);
  return (
    <AbsoluteFill>
      <FullBleedPhoto src="images/quantum-rf/clinical-ba-abdomen-skin-tightening.png" alt="Abdomen tightening" />
      <Overlay />
      <Logo format={format} variant="watermark" />
      <div style={{ position: "absolute", inset: 0, padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: brandColor, fontSize: t * 0.28, fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>WHO IT&apos;S FOR</p>
        <AnimatedLine delay={0}>
          <p style={{ fontSize: t * 0.58, fontWeight: 800, color: "#fff", lineHeight: 1.2, textShadow: "0 2px 16px #000" }}>
            Loose skin after weight loss — or on GLP-1 — and you want contour without a massive scar?
          </p>
        </AnimatedLine>
        <AnimatedLine delay={16}>
          <p style={{ fontSize: t * 0.36, color: "rgba(255,255,255,0.92)", marginTop: 18, lineHeight: 1.45, maxWidth: 880 }}>
            If laxity, jowling, belly skin, or arms won&apos;t “snap back,” this is the specialty conversation — not
            a facial, not surface RF only.
          </p>
        </AnimatedLine>
      </div>
    </AbsoluteFill>
  );
};

// 300–450: Why surgery isn’t the only answer (technology + depth)
const TechBridgeScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.subheading, format);
  return (
    <AbsoluteFill>
      <FullBleedPhoto src="images/morpheus8/quantumrf-25-abdomen-skin.png" alt="Subdermal body contour" />
      <Overlay strong />
      <Logo format={format} variant="watermark" />
      <div style={{ position: "absolute", inset: 0, padding: 40, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ color: brandColor, fontSize: t * 0.35, fontWeight: 800, marginBottom: 10 }}>ADVANCED SUBDERMAL RF</p>
        <AnimatedLine delay={0}>
          <p style={{ fontSize: t * 0.55, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
            You don’t always need the OR to get meaningful tightening and contour.
          </p>
        </AnimatedLine>
        <AnimatedLine delay={18}>
          <p style={{ fontSize: t * 0.4, color: "rgba(255,255,255,0.9)", marginTop: 16, lineHeight: 1.45 }}>
            Quantum RF delivers energy beneath the skin — where lax fat and tissue live — not just on the surface. That’s
            why it’s a different class than “non-invasive only” treatments.
          </p>
        </AnimatedLine>
      </div>
    </AbsoluteFill>
  );
};

// 450–600: InMode + device (trust) — split layout on horizontal
const DeviceScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.body, format);
  const isWide = format === "horizontal";
  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Logo format={format} variant="watermark" />
      <div
        style={{
          display: "flex",
          flexDirection: isWide ? "row" : "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ flex: isWide ? "0 0 48%" : "0 0 45%", position: "relative", minHeight: isWide ? "100%" : "42%" }}>
          <Img
            src={res("images/blog/michelle-solaria-equipment-2026/inmode-quantum-rf.png")}
            alt="InMode QuantumRF"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div
          style={{
            flex: 1,
            padding: 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "linear-gradient(180deg, #0d0d0d, #0a0a0a)",
            borderLeft: isWide ? `2px solid ${brandColor}40` : "none",
          }}
        >
          <p style={{ color: brandColor, fontWeight: 800, fontSize: t * 0.65, marginBottom: 8 }}>WHAT IS QUANTUM RF?</p>
          <p style={{ color: "#fff", fontSize: t * 0.85, lineHeight: 1.4, fontWeight: 600 }}>
            InMode technology — minimally invasive, fractionated radiofrequency to meaningful depth, with handpieces
            matched to <span style={{ color: brandColor }}>face &amp; small areas</span> vs{" "}
            <span style={{ color: brandColor }}>larger body zones</span>.
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: t * 0.7, marginTop: 12, lineHeight: 1.35 }}>
            Educational overview. Candidacy &amp; labeling confirmed in consultation.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 600–750: “What is QuantumRF” graphic from site + results reminder
const EduGraphicScene: React.FC<{ format: VideoFormat }> = ({ format }) => {
  const t = scaledSize(FONT_SIZES.caption, format);
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", padding: format === "square" ? 20 : 28 }}>
      <Logo format={format} variant="watermark" />
      <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <p
          style={{
            color: brandColor,
            fontWeight: 800,
            fontSize: t * 1.4,
            marginBottom: 10,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          HOW IT FITS YOUR PLAN
        </p>
        <div
          style={{
            opacity: o,
            maxWidth: format === "horizontal" ? 1100 : 900,
            width: "100%",
            border: `2px solid ${brandColor}55`,
            borderRadius: 8,
            overflow: "hidden",
            background: "#111",
            boxShadow: SHADOWS.glow(brandColor, 20),
          }}
        >
          <Img
            src={res("images/quantum-rf/og-quantum-rf-social-share.png")}
            alt="QuantumRF by InMode overview"
            style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
          />
        </div>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: t * 0.9, textAlign: "center", marginTop: 10 }}>
          Same education as hellogorgeousmedspa.com — QuantumRF 10 &amp; 25, tailored to you.
        </p>
      </div>
    </AbsoluteFill>
  );
};

// 750–900: CTA
const FinalScene: React.FC<{
  format: VideoFormat;
  phone: string;
  website: string;
  address: string;
}> = ({ format, phone, website, address }) => {
  const f = useCurrentFrame();
  const t = scaledSize(FONT_SIZES.sectionTitle, format);
  const pulse = 0.97 + 0.03 * Math.sin(f * 0.1);
  return (
    <AbsoluteFill>
      <FullBleedPhoto src="images/quantum-rf/clinical-ba-jawline-neck-tightening.png" KenBurns={false} alt="Jawline results" />
      <Overlay strong />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 32,
        }}
      >
        <Logo format={format} variant="watermark" />
        <p style={{ color: brandColor, fontSize: t * 0.28, fontWeight: 800, letterSpacing: 2 }}>OSWEGO, IL — FOX VALLEY</p>
        <h2 style={{ color: "#fff", fontSize: t * 0.65, fontWeight: 900, margin: "10px 0 6px", lineHeight: 1.15 }}>
          See if you&apos;re a candidate
        </h2>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: t * 0.38, maxWidth: 700 }}>Book a consultation for Contour Lift™ / Quantum RF</p>
        <p style={{ color: "#fff", fontSize: t * 0.55, fontWeight: 800, marginTop: 18 }}>{website}</p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: t * 0.35, marginTop: 6 }}>{phone}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: t * 0.3, marginTop: 8 }}>{address}</p>
        <div
          style={{
            marginTop: 20,
            padding: "12px 28px",
            borderRadius: 999,
            background: GRADIENTS.pinkHot,
            color: "#fff",
            fontWeight: 800,
            fontSize: t * 0.32,
            transform: `scale(${pulse})`,
            boxShadow: SHADOWS.buttonGlow(brandColor),
          }}
        >
          /services/quantum-rf
        </div>
        <p style={{ fontSize: scaledSize(11, format), color: "rgba(255,255,255,0.35)", marginTop: 16, maxWidth: 640 }}>
          Individual results may vary. Medical evaluation required. QuantumRF and InMode are trademarks of InMode Ltd.
        </p>
      </div>
    </AbsoluteFill>
  );
};

export type QuantumContourLiftProps = {
  format: VideoFormat;
  phone?: string;
  website?: string;
  city?: string;
  outroTagline?: string;
};

const defaultPhone = "630-636-6193";
const defaultWebsite = "hellogorgeousmedspa.com";
const defaultCity = "74 W Washington St · Oswego, IL";
const defaultTagline = "Where science meets self-confidence.";

export const QuantumContourLift: React.FC<QuantumContourLiftProps> = ({
  format,
  phone = defaultPhone,
  website = defaultWebsite,
  city = defaultCity,
  outroTagline: _outro = defaultTagline,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={150}>
        <HeroScene format={format} />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <AudienceScene format={format} />
      </Sequence>
      <Sequence from={300} durationInFrames={150}>
        <TechBridgeScene format={format} />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <DeviceScene format={format} />
      </Sequence>
      <Sequence from={600} durationInFrames={150}>
        <EduGraphicScene format={format} />
      </Sequence>
      <Sequence from={750} durationInFrames={150}>
        <FinalScene format={format} phone={phone} website={website} address={city} />
      </Sequence>
    </AbsoluteFill>
  );
};
