/**
 * May 4, 2026 — Hello Gorgeous Contour Lift™ / Quantum RF clinical model launch (Reels/Stories)
 * Uses Scene, TextBlock, CTA, BrandFrame, KenBurnsBackground, DisclaimerBar.
 */
import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile } from "remotion";
import { SHADOWS, type VideoFormat } from "../brand/theme";
import { Scene, KenBurnsBackground } from "../components/Scene";
import { TextBlock, BrandSpan } from "../components/TextBlock";
import { CTA, DisclaimerBar } from "../components/CTA";
import { BrandFrame } from "../components/BrandFrame";

export const CONTOUR_MODEL_LAUNCH_FRAMES = 900;
const res = (p: string) => staticFile(p);

export const CONTOUR_MODEL_SCENES = {
  s1: [0, 100] as const,
  s2: [100, 250] as const,
  s3: [250, 400] as const,
  s4: [400, 550] as const,
  s5: [550, 700] as const,
  s6: [700, 900] as const,
} as const;

// --- 0–100: Hook
const ContourS1: React.FC<{ format: VideoFormat }> = ({ format }) => (
  <Scene
    format={format}
    background={
      <KenBurnsBackground
        src="images/quantum-rf/clinical-ba-upper-arm-tightening.png"
        alt="Clinical before and after upper arm"
        panTo={0}
        zoomEnd={1.1}
        sequenceFrames={100}
      />
    }
    overlay="bottomHeavy"
    placement="bottom"
    padding={{ x: 32, bottom: 44, top: 36 }}
  >
    <TextBlock
      format={format}
      showAccentBar
      baseSize={52}
      lines={[
        {
          delay: 2,
          role: "hero",
          emphasize: true,
          content: (
            <>
              Loose skin that
              <br />
              nothing is fixing?
            </>
          ),
        },
      ]}
    />
  </Scene>
);

// --- 100–250: Problem
const ContourS2: React.FC<{ format: VideoFormat }> = ({ format }) => (
  <Scene
    format={format}
    background={
      <KenBurnsBackground
        src="images/quantum-rf/clinical-ba-abdomen-skin-tightening.png"
        alt="Abdominal skin laxity before and after"
        panTo={1}
        zoomEnd={1.08}
        sequenceFrames={150}
      />
    }
    overlay="bottomHeavy"
    placement="bottom"
    padding={{ x: 32, bottom: 48 }}
  >
    <TextBlock
      format={format}
      showAccentBar
      baseSize={44}
      lines={[
        { delay: 0, role: "body", content: "Weight loss. Workouts. Treatments." },
        { delay: 50, role: "body", emphasize: true, content: "Still not tight?" },
      ]}
      footnote="Representative outcomes; your anatomy and plan may differ."
    />
  </Scene>
);

// --- 250–400: Product intro
const ContourS3: React.FC<{ format: VideoFormat }> = ({ format }) => (
  <Scene
    format={format}
    background={
      <AbsoluteFill style={{ background: "#0a0a0a" }}>
        <div style={{ position: "absolute", top: "14%", left: 20, right: 20, bottom: 300 }}>
          <Img
            src={res("images/quantum-rf/og-quantum-rf-social-share.png")}
            alt="InMode QuantumRF overview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: 6,
              border: "1px solid #E6007E44",
              boxShadow: SHADOWS.glow("#E6007E", 24),
            }}
          />
        </div>
      </AbsoluteFill>
    }
    overlay="none"
    placement="bottom"
    padding={{ x: 32, bottom: 44 }}
  >
    <TextBlock
      format={format}
      showAccentBar
      baseSize={40}
      lines={[
        {
          delay: 8,
          role: "title",
          content: (
            <>
              Introducing <BrandSpan glow>Hello Gorgeous Contour Lift™</BrandSpan>
            </>
          ),
        },
        {
          delay: 32,
          role: "body",
          content: (
            <>
              Powered by <BrandSpan>Quantum RF</BrandSpan>
            </>
          ),
        },
      ]}
    />
  </Scene>
);

// --- 400–550: Authority
const ContourS4: React.FC<{ format: VideoFormat }> = ({ format }) => (
  <Scene
    format={format}
    background={
      <KenBurnsBackground
        src="images/morpheus8/quantumrf-10-jawline.png"
        alt="Quantum RF clinical jawline"
        panTo={0}
        zoomEnd={1.06}
        sequenceFrames={150}
      />
    }
    overlay="bottomHeavy"
    placement="top"
    padding={{ x: 32, top: 120 }}
  >
    <TextBlock
      format={format}
      showAccentBar
      baseSize={40}
      lines={[
        { delay: 0, role: "body", content: "Minimally invasive" },
        { delay: 28, role: "body", content: "Works beneath the skin" },
        { delay: 56, role: "body", content: "Performed under medical supervision" },
      ]}
    />
  </Scene>
);

// --- 550–700: Model offer
const ContourS5: React.FC<{ format: VideoFormat }> = ({ format }) => (
  <Scene
    format={format}
    background={
      <KenBurnsBackground
        src="images/quantum-rf/clinical-ba-knee-skin-tightening.png"
        alt="Knee area skin before and after"
        panTo={1}
        zoomEnd={1.1}
        sequenceFrames={150}
      />
    }
    overlay="bottomHeavy"
    placement="center"
    padding={{ x: 32, y: 32, bottom: 32 }}
  >
    <BrandFrame format={format} maxWidth={920} paddingX={0}>
      <TextBlock
        format={format}
        showAccentBar
        align="center"
        baseSize={48}
        lines={[
          { delay: 0, role: "hero", content: "3 model spots available" },
          { delay: 32, role: "accent", content: "May 4 only" },
          { delay: 56, role: "body", content: "Reduced model investment" },
        ]}
        footnote="Limited; selection and terms apply. Not a free service."
      />
    </BrandFrame>
  </Scene>
);

// --- 700–900: CTA + compliance
const ContourS6: React.FC<{ format: VideoFormat; modelPage: string; cityLine: string }> = ({
  format,
  modelPage,
  cityLine,
}) => (
  <Scene
    format={format}
    background={
      <KenBurnsBackground
        src="images/quantum-rf/clinical-ba-jawline-neck-tightening.png"
        alt="Jawline and neck clinical before and after"
        panTo={0}
        zoomEnd={1.05}
        sequenceFrames={200}
      />
    }
    overlay="bottomHeavy"
    placement="top"
    padding={{ x: 32, top: 110 }}
    footer={
      <DisclaimerBar
        format={format}
        primary="Consultation required. Individual results may vary."
        secondary="QuantumRF and InMode are trademarks of InMode Ltd."
      />
    }
  >
    <CTA
      format={format}
      baseSize={46}
      lines={[
        {
          delay: 0,
          role: "hero",
          content: (
            <>
              Message <BrandSpan>MODEL</BrandSpan> to apply
            </>
          ),
        },
        { delay: 32, role: "support", content: "Or visit the Contour Lift model page" },
      ]}
      urlOrDetail={{ text: modelPage, delay: 50 }}
      cityLine={cityLine}
      pill={{ text: "Contour Lift · Quantum RF", delayFrames: 60 }}
    />
  </Scene>
);

export type ContourLiftModelLaunchProps = {
  format: VideoFormat;
  modelPage?: string;
  cityLine?: string;
};

const defaultModelPage = "hellogorgeousmedspa.com/contour-lift/model-experience";
const defaultCity = "74 W. Washington St · Oswego, IL";

export const ContourLiftModelLaunch: React.FC<ContourLiftModelLaunchProps> = ({
  format,
  modelPage = defaultModelPage,
  cityLine = defaultCity,
}) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={100}>
        <ContourS1 format={format} />
      </Sequence>
      <Sequence from={100} durationInFrames={150}>
        <ContourS2 format={format} />
      </Sequence>
      <Sequence from={250} durationInFrames={150}>
        <ContourS3 format={format} />
      </Sequence>
      <Sequence from={400} durationInFrames={150}>
        <ContourS4 format={format} />
      </Sequence>
      <Sequence from={550} durationInFrames={150}>
        <ContourS5 format={format} />
      </Sequence>
      <Sequence from={700} durationInFrames={200}>
        <ContourS6 format={format} modelPage={modelPage} cityLine={cityLine} />
      </Sequence>
    </AbsoluteFill>
  );
};
