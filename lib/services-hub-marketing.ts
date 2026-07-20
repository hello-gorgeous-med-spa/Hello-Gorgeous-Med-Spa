/**
 * Services hub lookbook — square editorial creatives from Dani’s campaign set.
 * Layout preserves 1:1 art (no tall stamp-card crops).
 */

import { BROW_JOURNEY_PATH } from "@/lib/brow-journey-marketing";
import { FACIALS_PEELS_PATH } from "@/lib/facials-peels-marketing";
import { FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import { INJECTABLES_PATH } from "@/lib/injectables-marketing";
import { IV_THERAPY_PATH } from "@/lib/iv-therapy-marketing";
import { MORPHEUS8_PATH } from "@/lib/morpheus8-marketing";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { QUANTUM_RF_PATH } from "@/lib/quantum-rf-marketing";
import { SOLARIA_CO2_PATH } from "@/lib/solaria-marketing";

const E = "/images/services-hub/editorial" as const;

export const SERVICES_HUB_PATH = "/services" as const;

export type ServicesLookbookItem = {
  id: string;
  href: string;
  image: string;
  alt: string;
  /** Short label under the art — creatives already carry design type */
  label: string;
  /** Optional line under label */
  note?: string;
  /** large = full-width feature; pair = half; square = grid cell */
  size: "hero" | "feature" | "square";
};

export const SERVICES_LOOKBOOK: readonly ServicesLookbookItem[] = [
  {
    id: "hero-glow",
    href: FACIALS_PEELS_PATH,
    image: `${E}/glow-molecule.jpg`,
    alt: "Radiant skin rejuvenation at Hello Gorgeous Med Spa",
    label: "Skin · Facials & Peels",
    note: "Clinical glow, medical-grade care",
    size: "hero",
  },
  {
    id: "hydra",
    href: FACIALS_PEELS_PATH,
    image: `${E}/hydra-facial.jpg`,
    alt: "Hydra Facial by Hello Gorgeous Med Spa",
    label: "Hydra Facial",
    size: "feature",
  },
  {
    id: "og-facial",
    href: FACIALS_PEELS_PATH,
    image: `${E}/og-signature-facial.jpg`,
    alt: "The OG Signature Facial",
    label: "OG Signature Facial",
    size: "feature",
  },
  {
    id: "gorgeous-glow",
    href: FACIALS_PEELS_PATH,
    image: `${E}/gorgeous-glow-facial.jpg`,
    alt: "The Gorgeous Glow Facial",
    label: "Gorgeous Glow Facial",
    size: "square",
  },
  {
    id: "lips",
    href: INJECTABLES_PATH,
    image: `${E}/lips-editorial.jpg`,
    alt: "Lip filler editorial — Hello Gorgeous",
    label: "Lips · Filler",
    size: "square",
  },
  {
    id: "half-syringe",
    href: INJECTABLES_PATH,
    image: `${E}/half-syringe.jpg`,
    alt: "Half syringe lip filler now available",
    label: "½ Syringe",
    note: "From the injectables menu",
    size: "square",
  },
  {
    id: "lip-injection",
    href: INJECTABLES_PATH,
    image: `${E}/lip-injection.jpg`,
    alt: "Lip injection treatment",
    label: "Lip Filler",
    size: "square",
  },
  {
    id: "masseter",
    href: INJECTABLES_PATH,
    image: `${E}/masseter-botox.jpg`,
    alt: "Masseter Botox",
    label: "Masseter Botox",
    size: "feature",
  },
  {
    id: "lash",
    href: "/services/lash-spa",
    image: `${E}/lash-glow.jpg`,
    alt: "Lash and glow beauty portrait",
    label: "Lashes & Glow",
    size: "square",
  },
  {
    id: "morpheus-body",
    href: MORPHEUS8_PATH,
    image: `${E}/morpheus8-body.jpg`,
    alt: "Morpheus8 Body — improve skin, remodel fat, build collagen",
    label: "Morpheus8 Body",
    note: "RF microneedling for body",
    size: "feature",
  },
  {
    id: "rx-glove",
    href: "/rx",
    image: `${E}/rx-glove.jpg`,
    alt: "Hello Gorgeous Med Spa RX",
    label: "RE GEN · Med Spa RX",
    size: "feature",
  },
  {
    id: "rx-portrait",
    href: "/rx",
    image: `${E}/rx-portrait.jpg`,
    alt: "Hello Gorgeous Med Spa RX portrait",
    label: "Prescription care",
    size: "square",
  },
  {
    id: "peptides",
    href: "/rx",
    image: `${E}/peptide-hotspots.jpg`,
    alt: "Wellness and peptide goals",
    label: "Peptides & Wellness",
    size: "square",
  },
] as const;

/** Extra device links without square creatives yet */
export const SERVICES_HUB_MORE = [
  { label: "Solaria CO₂", href: SOLARIA_CO2_PATH },
  { label: "Quantum RF", href: QUANTUM_RF_PATH },
  { label: "Microblading", href: BROW_JOURNEY_PATH },
  { label: "Weight loss", href: "/services/weight-loss-therapy" },
  { label: "IV & Vitamin Bar", href: IV_THERAPY_PATH },
  { label: "FlowWave", href: FLOWWAVE_PATH },
] as const;

export const SERVICES_HUB_NAV = [
  { href: "#lookbook", label: "Lookbook" },
  { href: "#more", label: "More care" },
  { href: "#catalog", label: "Full catalog" },
  { href: PRIMARY_BOOKING_CTA.href, label: "Book" },
] as const;

export const SERVICES_HUB_MARKETING = {
  path: SERVICES_HUB_PATH,
  bookHref: PRIMARY_BOOKING_CTA.href,
  lookbook: SERVICES_LOOKBOOK,
  more: SERVICES_HUB_MORE,
  nav: SERVICES_HUB_NAV,
} as const;
