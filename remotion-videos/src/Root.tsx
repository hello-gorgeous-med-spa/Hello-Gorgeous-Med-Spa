import { Composition } from "remotion";
import { SolariaCO2Laser } from "./compositions/SolariaCO2Laser";
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
    </>
  );
};
