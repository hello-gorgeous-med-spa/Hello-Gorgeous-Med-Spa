/**
 * Minimal sample: same primitives as real campaigns. Duplicate this file to start a new Reel.
 * 6s @ 30fps — hook → value prop → CTA + disclaimer.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { VideoFormat } from "../brand/theme";
import { Scene, KenBurnsBackground } from "../components/Scene";
import { TextBlock, BrandSpan } from "../components/TextBlock";
import { CTA, DisclaimerBar } from "../components/CTA";
import { BrandFrame } from "../components/BrandFrame";

export const HG_REEL_TEMPLATE_FRAMES = 180;

const HOOK = 60;
const VALUE = 60;
const CTA_LEN = 60;

export const HGReelTemplateSample: React.FC<{ format: VideoFormat }> = ({ format }) => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={HOOK}>
        <Scene
          format={format}
          background={
            <KenBurnsBackground
              src="images/morpheus8/quantumrf-10-jawline.png"
              alt="Clinical Quantum RF"
              panTo={0}
              sequenceFrames={HOOK}
              zoomEnd={1.08}
            />
          }
          overlay="bottomHeavy"
          placement="bottom"
          padding={{ x: 32, bottom: 48 }}
        >
          <TextBlock
            format={format}
            showAccentBar
            baseSize={54}
            lines={[
              {
                delay: 0,
                role: "hero",
                emphasize: true,
                content: (
                  <>
                    This is <BrandSpan>not a facial</BrandSpan>. It&apos;s contour.
                  </>
                ),
              },
            ]}
          />
        </Scene>
      </Sequence>

      <Sequence from={HOOK} durationInFrames={VALUE}>
        <Scene
          format={format}
          background={
            <KenBurnsBackground
              src="images/quantum-rf/clinical-ba-jawline-neck-tightening.png"
              alt="Jawline contour"
              panTo={1}
              sequenceFrames={VALUE}
              zoomEnd={1.06}
            />
          }
          overlay="gradient"
          placement="center"
          padding={{ x: 32, y: 32 }}
        >
          <BrandFrame format={format} maxWidth={800} kicker="Hello Gorgeous" paddingX={0}>
            <TextBlock
              format={format}
              showAccentBar
              align="center"
              baseSize={38}
              lines={[
                {
                  delay: 4,
                  role: "title",
                  content: (
                    <>
                      <BrandSpan>Contour Lift™</BrandSpan> · Quantum RF
                    </>
                  ),
                },
                { delay: 20, role: "body", content: "Minimally invasive. Works beneath the skin." },
              ]}
            />
          </BrandFrame>
        </Scene>
      </Sequence>

      <Sequence from={HOOK + VALUE} durationInFrames={CTA_LEN}>
        <Scene
          format={format}
          background={
            <KenBurnsBackground
              src="images/quantum-rf/clinical-ba-profile-jawline-submental.png"
              alt="Profile contour"
              panTo={0}
              sequenceFrames={CTA_LEN}
              zoomEnd={1.05}
            />
          }
          overlay="bottomHeavy"
          placement="top"
          padding={{ top: 100, x: 28 }}
          footer={<DisclaimerBar format={format} />}
        >
          <CTA
            format={format}
            baseSize={42}
            lines={[
              { delay: 0, role: "hero", content: "Book a consultation" },
              { delay: 14, role: "support", content: "We’ll match the plan to your goals." },
            ]}
            urlOrDetail={{ text: "hellogorgeousmedspa.com/services/quantum-rf", delay: 32 }}
            pill={{ text: "Hello Gorgeous", delayFrames: 40 }}
          />
        </Scene>
      </Sequence>
    </AbsoluteFill>
  );
};
