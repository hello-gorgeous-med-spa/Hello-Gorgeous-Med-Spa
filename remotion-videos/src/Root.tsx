import { Composition } from "remotion";
import { SemaglutideSpringBreak } from "./compositions/SemaglutideSpringBreak";
import { SolariaCO2Laser } from "./compositions/SolariaCO2Laser";
import { StretchMarkTreatment } from "./compositions/StretchMarkTreatment";
import { InModeTrifecta } from "./compositions/InModeTrifecta";
import { GLP1SkinSolution } from "./compositions/GLP1SkinSolution";
import { StandardVsBurst } from "./compositions/StandardVsBurst";
import { BeforeAfterShowcase } from "./compositions/BeforeAfterShowcase";
import { LipFillerShowcase } from "./compositions/LipFillerShowcase";
import { TreatmentPOV } from "./compositions/TreatmentPOV";
import { TestimonialCard } from "./compositions/TestimonialCard";
import { ServiceHighlight } from "./compositions/ServiceHighlight";
import { GeoTargetedAd } from "./compositions/GeoTargetedAd";
import { ServicePromo, ServicePromoProps } from "./templates/ServicePromo";

const sharedProps = {
  brandColor: "#E91E8C",
  accentColor: "#FF69B4",
  backgroundColor: "#000000",
};

const defaultServiceProps: Omit<ServicePromoProps, "format"> = {
  serviceName: "Service Name",
  headline: "Your Headline Here",
  subheadline: "Optional subheadline",
  price: "$999",
  originalPrice: "$1,500",
  promoLabel: "Special Offer",
  benefits: [
    "Benefit One",
    "Benefit Two",
    "Benefit Three",
    "Benefit Four",
  ],
  clinicName: "Hello Gorgeous Med Spa",
  address: "74 W Washington St",
  city: "Oswego, IL",
  phone: "630-636-6193",
  website: "hellogorgeousmedspa.com",
  brandColor: "#E91E8C",
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== INMODE TRIFECTA — HERO LAUNCH ========== */}
      <Composition
        id="TrifectaRevealVertical"
        component={InModeTrifecta}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brandColor: "#E91E8C", format: "vertical" as const }}
      />
      <Composition
        id="TrifectaRevealSquare"
        component={InModeTrifecta}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "square" as const }}
      />
      <Composition
        id="TrifectaRevealHorizontal"
        component={InModeTrifecta}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "horizontal" as const }}
      />

      {/* ========== GLP-1 SKIN SOLUTION ========== */}
      <Composition
        id="GLP1SolutionVertical"
        component={GLP1SkinSolution}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brandColor: "#E91E8C", format: "vertical" as const }}
      />
      <Composition
        id="GLP1SolutionSquare"
        component={GLP1SkinSolution}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "square" as const }}
      />
      <Composition
        id="GLP1SolutionHorizontal"
        component={GLP1SkinSolution}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "horizontal" as const }}
      />

      {/* ========== BEFORE/AFTER SHOWCASE ========== */}
      <Composition
        id="BeforeAfterVertical"
        component={BeforeAfterShowcase}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeImage: "solaria-ba1.png",
          afterImage: "solaria-ba2.png",
          treatmentName: "Morpheus8 Burst",
          sessions: "2 sessions",
          timeframe: "6 weeks",
          clientName: "Client",
          format: "vertical" as const,
        }}
      />
      <Composition
        id="BeforeAfterSquare"
        component={BeforeAfterShowcase}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          beforeImage: "solaria-ba1.png",
          afterImage: "solaria-ba2.png",
          treatmentName: "Morpheus8 Burst",
          sessions: "2 sessions",
          timeframe: "6 weeks",
          format: "square" as const,
        }}
      />

      {/* ========== LIP FILLER SHOWCASE ========== */}
      {/* Image-only version (works without video; MOV may need conversion to MP4) */}
      <Composition
        id="LipFillerShowcaseVertical"
        component={LipFillerShowcase}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          beforeImage: "jenbefore.png",
          afterImage: "jenlipsafter.png",
          recoveryImage: "jen-recovery.png",
          treatmentName: "Dermal Lip Fillers",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />
      <Composition
        id="LipFillerShowcaseSquare"
        component={LipFillerShowcase}
        durationInFrames={540}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          beforeImage: "jenbefore.png",
          afterImage: "jenlipsafter.png",
          recoveryImage: "jen-recovery.png",
          treatmentName: "Dermal Lip Fillers",
          brandColor: "#E91E8C",
          format: "square" as const,
        }}
      />

      {/* ========== TREATMENT POV ========== */}
      <Composition
        id="TreatmentPOVVertical"
        component={TreatmentPOV}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoSrc: "treatment-footage.mp4",
          treatmentName: "Morpheus8 Burst",
          providerName: "Danielle",
          providerTitle: "FNP-BC",
          hookText: "Getting the deepest RF microneedling available",
          overlays: [
            { text: "Numbing applied — 20 min wait", startFrame: 30, endFrame: 120 },
            { text: "8mm depth — 3 simultaneous levels", startFrame: 150, endFrame: 270 },
            { text: "Collagen stimulation begins immediately", startFrame: 300, endFrame: 420 },
          ],
          format: "vertical" as const,
        }}
      />

      {/* ========== TESTIMONIAL QUOTE CARDS ========== */}
      <Composition
        id="TestimonialVertical"
        component={TestimonialCard}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          quoteText: "I cannot believe the difference after just one treatment. My skin looks ten years younger.",
          clientName: "Sarah M.",
          treatmentType: "Morpheus8 Burst",
          starRating: 5,
          format: "vertical" as const,
        }}
      />
      <Composition
        id="TestimonialSquare"
        component={TestimonialCard}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          quoteText: "I cannot believe the difference after just one treatment. My skin looks ten years younger.",
          clientName: "Sarah M.",
          treatmentType: "Morpheus8 Burst",
          starRating: 5,
          format: "square" as const,
        }}
      />

      {/* ========== SERVICE HIGHLIGHT ========== */}
      <Composition
        id="ServiceHighlightVertical"
        component={ServiceHighlight}
        durationInFrames={720}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "Morpheus8 Burst",
          tagline: "The Deepest RF Microneedling Available",
          howItWorks: [
            "RF energy delivered at 3 depths simultaneously",
            "Penetrates up to 8mm — double the standard",
            "Stimulates collagen and tightens tissue from within",
          ],
          idealFor: ["Loose skin", "Fine lines", "Acne scars", "Body contouring", "Jowls", "Neck laxity"],
          format: "vertical" as const,
        }}
      />

      {/* ========== GEO-TARGETED ADS (6 Cities) ========== */}
      <Composition
        id="GeoAdOswegoSquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Oswego", driveTime: "right here in town", format: "square" as const }}
      />
      <Composition
        id="GeoAdNapervilleSquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Naperville", driveTime: "15 minutes", format: "square" as const }}
      />
      <Composition
        id="GeoAdAuroraSquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Aurora", driveTime: "20 minutes", format: "square" as const }}
      />
      <Composition
        id="GeoAdPlainfieldSquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Plainfield", driveTime: "15 minutes", format: "square" as const }}
      />
      <Composition
        id="GeoAdMontgomerySquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Montgomery", driveTime: "10 minutes", format: "square" as const }}
      />
      <Composition
        id="GeoAdYorkvilleSquare"
        component={GeoTargetedAd}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ cityName: "Yorkville", driveTime: "10 minutes", format: "square" as const }}
      />

      {/* ========== STANDARD VS BURST ========== */}
      <Composition
        id="StandardVsBurstVertical"
        component={StandardVsBurst}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brandColor: "#E91E8C", format: "vertical" as const }}
      />
      <Composition
        id="StandardVsBurstSquare"
        component={StandardVsBurst}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "square" as const }}
      />
      <Composition
        id="StandardVsBurstHorizontal"
        component={StandardVsBurst}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "horizontal" as const }}
      />

      {/* ========== SOLARIA CO2 LASER PROMOS ========== */}
      <Composition
        id="SolariaPromoVertical"
        component={SolariaCO2Laser}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...sharedProps,
          format: "vertical" as const,
        }}
      />
      <Composition
        id="SolariaPromoSquare"
        component={SolariaCO2Laser}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          ...sharedProps,
          format: "square" as const,
        }}
      />
      <Composition
        id="SolariaPromoHorizontal"
        component={SolariaCO2Laser}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          ...sharedProps,
          format: "horizontal" as const,
        }}
      />

      {/* ========== DYNAMIC SERVICE PROMO TEMPLATES ========== */}
      <Composition
        id="ServicePromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          ...defaultServiceProps,
          format: "vertical" as const,
        }}
      />
      <Composition
        id="ServicePromoSquare"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          ...defaultServiceProps,
          format: "square" as const,
        }}
      />
      <Composition
        id="ServicePromoHorizontal"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          ...defaultServiceProps,
          format: "horizontal" as const,
        }}
      />

      {/* ========== BOTOX PROMO ========== */}
      <Composition
        id="BotoxPromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "Botox",
          headline: "Smooth Away Wrinkles",
          subheadline: "FDA-Approved Wrinkle Treatment",
          price: "$10/unit",
          originalPrice: "$14/unit",
          promoLabel: "March Special",
          benefits: [
            "Reduces fine lines & wrinkles",
            "Quick 15-minute treatment",
            "No downtime required",
            "Results last 3-4 months",
          ],
          clinicName: "Hello Gorgeous Med Spa",
          address: "74 W Washington St",
          city: "Oswego, IL",
          phone: "630-636-6193",
          website: "hellogorgeousmedspa.com",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />

      {/* ========== MORPHEUS8 PROMO ========== */}
      <Composition
        id="Morpheus8PromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "Morpheus8",
          headline: "Tighten & Contour",
          subheadline: "RF Microneedling Technology",
          price: "$799",
          originalPrice: "$1,200",
          promoLabel: "VIP Pricing",
          benefits: [
            "Tightens loose skin",
            "Reduces fat & cellulite",
            "Stimulates collagen production",
            "Minimal downtime",
          ],
          clinicName: "Hello Gorgeous Med Spa",
          address: "74 W Washington St",
          city: "Oswego, IL",
          phone: "630-636-6193",
          website: "hellogorgeousmedspa.com",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />

      {/* ========== WEIGHT LOSS PROMO ========== */}
      <Composition
        id="WeightLossPromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "Semaglutide",
          headline: "Medical Weight Loss",
          subheadline: "Physician-Supervised Program",
          price: "$399/month",
          originalPrice: "$599/month",
          promoLabel: "New Patient Special",
          benefits: [
            "FDA-approved medication",
            "Average 15-20% weight loss",
            "Reduces appetite naturally",
            "Weekly injections",
          ],
          clinicName: "Hello Gorgeous Med Spa",
          address: "74 W Washington St",
          city: "Oswego, IL",
          phone: "630-636-6193",
          website: "hellogorgeousmedspa.com",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />

      {/* ========== PRF HAIR RESTORATION PROMO ========== */}
      <Composition
        id="PRFHairPromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "PRF Hair Restoration",
          headline: "Regrow Your Hair",
          subheadline: "Natural Growth Factors",
          price: "$599",
          originalPrice: "$899",
          promoLabel: "Limited Offer",
          benefits: [
            "Uses your own platelets",
            "Stimulates hair follicles",
            "No surgery required",
            "Natural-looking results",
          ],
          clinicName: "Hello Gorgeous Med Spa",
          address: "74 W Washington St",
          city: "Oswego, IL",
          phone: "630-636-6193",
          website: "hellogorgeousmedspa.com",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />

      {/* ========== DERMAL FILLERS PROMO ========== */}
      <Composition
        id="FillersPromoVertical"
        component={ServicePromo}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          serviceName: "Dermal Fillers",
          headline: "Restore Volume",
          subheadline: "Juvederm & Restylane",
          price: "$499/syringe",
          originalPrice: "$699/syringe",
          promoLabel: "Spring Special",
          benefits: [
            "Instant volume restoration",
            "Smooths lines & wrinkles",
            "Enhances lips & cheeks",
            "Results last 12-18 months",
          ],
          clinicName: "Hello Gorgeous Med Spa",
          address: "74 W Washington St",
          city: "Oswego, IL",
          phone: "630-636-6193",
          website: "hellogorgeousmedspa.com",
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />

      {/* ========== SEMAGLUTIDE SPRING BREAK SPECIAL (GMB) ========== */}
      <Composition
        id="SemaglutideSpringBreakVertical"
        component={SemaglutideSpringBreak}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ brandColor: "#E91E8C", format: "vertical" as const }}
      />
      <Composition
        id="SemaglutideSpringBreakSquare"
        component={SemaglutideSpringBreak}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "square" as const }}
      />
      <Composition
        id="SemaglutideSpringBreakHorizontal"
        component={SemaglutideSpringBreak}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ brandColor: "#E91E8C", format: "horizontal" as const }}
      />

      {/* ========== STRETCH MARK TREATMENT PROMO ========== */}
      <Composition
        id="StretchMarkVertical"
        component={StretchMarkTreatment}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          brandColor: "#E91E8C",
          format: "vertical" as const,
        }}
      />
      <Composition
        id="StretchMarkSquare"
        component={StretchMarkTreatment}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          brandColor: "#E91E8C",
          format: "square" as const,
        }}
      />
      <Composition
        id="StretchMarkHorizontal"
        component={StretchMarkTreatment}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          brandColor: "#E91E8C",
          format: "horizontal" as const,
        }}
      />
    </>
  );
};
