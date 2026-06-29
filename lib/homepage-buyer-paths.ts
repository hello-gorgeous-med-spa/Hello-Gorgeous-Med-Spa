import { doorForTrack, type HomepageTrack } from "@/lib/site-two-doors";

export type { HomepageTrack };

export type BuyerPathCategory = {
  id: string;
  track: HomepageTrack;
  title: string;
  summary: string;
  treatments: string[];
  href: string;
  cta: string;
  thumbnailImage: `/${string}`;
  thumbnailAlt: string;
};

export const HOMEPAGE_AESTHETICS_ANCHOR = "aesthetics-tracks";
export const HOMEPAGE_MEDICAL_ANCHOR = "medical-tracks";

export type HomepageTrackForkColumn = {
  track: HomepageTrack;
  anchor: string;
  hubHref: string;
  posterImage: `/${string}`;
  posterAlt: string;
  /** Short line overlaid on the poster image */
  imageHeadline: string;
  title: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  microLabel: string;
  microDetail: string;
  accent: "blue" | "pink";
  /** Tailwind object-position class for poster focal point */
  imagePosition?: string;
};

const aestheticsDoor = doorForTrack("aesthetics");
const medicalDoor = doorForTrack("medical");

export const HOMEPAGE_TRACK_FORK: HomepageTrackForkColumn[] = [
  {
    track: "aesthetics",
    anchor: HOMEPAGE_AESTHETICS_ANCHOR,
    hubHref: aestheticsDoor.hubHref,
    posterImage: "/images/homepage-buyer-paths/injectables.png",
    posterAlt: "Medical aesthetics — injectables, Morpheus8 and skin treatments at Hello Gorgeous Oswego",
    imageHeadline: "Injectables · skin · body",
    title: "Aesthetics track",
    description: aestheticsDoor.description,
    tags: ["Botox & fillers", "Morpheus8", "Solaria CO₂", "HydraFacial", "Body RF"],
    ctaLabel: aestheticsDoor.hubCta,
    microLabel: aestheticsDoor.microLabel,
    microDetail: aestheticsDoor.microDetail,
    accent: aestheticsDoor.accent,
    imagePosition: "object-center",
  },
  {
    track: "medical",
    anchor: HOMEPAGE_MEDICAL_ANCHOR,
    hubHref: medicalDoor.hubHref,
    posterImage: "/images/homepage-buyer-paths/weight-loss-hormones.png",
    posterAlt: "Medical programs — GLP-1 weight loss, hormones, peptides and Hello Gorgeous RX telehealth",
    imageHeadline: "GLP-1 · peptides · hormones",
    title: "Hello Gorgeous RX track",
    description: medicalDoor.description,
    tags: ["GLP-1 programs", "Hello Gorgeous RX™", "BPC-157 & peptides", "HRT / TRT", "My RX portal"],
    ctaLabel: medicalDoor.hubCta,
    microLabel: medicalDoor.microLabel,
    microDetail: medicalDoor.microDetail,
    accent: medicalDoor.accent,
    imagePosition: "object-cover object-center",
  },
];

export const HOMEPAGE_BUYER_PATHS: BuyerPathCategory[] = [
  {
    id: "injectables",
    track: "aesthetics",
    title: "Injectables",
    summary: "Neuromodulators, fillers, and under-eye rejuvenation with NP oversight.",
    treatments: ["Botox", "Dysport", "Jeuveau", "Lip filler", "Facial balancing", "PRF under-eye"],
    href: "/services/injectables",
    cta: "Explore Injectables",
    thumbnailImage: "/images/homepage-buyer-paths/injectables.png",
    thumbnailAlt: "Injectables — Botox, Dysport, Jeuveau and filler at Hello Gorgeous Med Spa",
  },
  {
    id: "skin-laser",
    track: "aesthetics",
    title: "Skin + Laser",
    summary: "Resurfacing, tightening, and glow — from clinical lasers to HydraFacial.",
    treatments: ["Solaria CO₂", "IPL", "Microneedling", "Morpheus8", "Chemical peels", "HydraFacial"],
    href: "/solaria-co2-oswego",
    cta: "Explore Skin Treatments",
    thumbnailImage: "/images/homepage-buyer-paths/skin-laser.png",
    thumbnailAlt: "Skin and laser treatments — Solaria CO₂, IPL, microneedling and Morpheus8",
  },
  {
    id: "body",
    track: "aesthetics",
    title: "Body Contouring",
    summary: "Non-surgical contouring and skin tightening for stomach, thighs, arms, and more.",
    treatments: ["Quantum RF", "Morpheus8 Body", "Burst", "Skin tightening", "Cellulite improvement"],
    href: "/body-contouring-oswego-il",
    cta: "Explore Body Treatments",
    thumbnailImage: "/images/homepage-buyer-paths/body-contouring.png",
    thumbnailAlt: "Body contouring — Quantum RF, Morpheus8 Body and skin tightening",
  },
  {
    id: "wellness-programs",
    track: "medical",
    title: "Weight Loss + Hormones",
    summary: "Medical weight loss and hormone optimization with labs and follow-up built in.",
    treatments: ["GLP-1 weight loss", "HRT", "TRT", "BioTE", "Semaglutide", "Tirzepatide"],
    href: "/glp-1-weight-loss-oswego",
    cta: "Explore Wellness Programs",
    thumbnailImage: "/images/homepage-buyer-paths/weight-loss-hormones.png",
    thumbnailAlt: "Weight loss and hormones — GLP-1, HRT, TRT and BioTE at Hello Gorgeous",
  },
  {
    id: "hello-gorgeous-rx",
    track: "medical",
    title: "Hello Gorgeous RX™",
    summary:
      "NP-led peptide protocols — pre-pay $49 consult (Square), then HIPAA video telehealth on Fresha with Ryan Kent, FNP-BC.",
    treatments: ["BPC-157", "TB-500", "Recovery Blend", "Sermorelin", "NAD+", "22+ peptides"],
    href: "/hello-gorgeous-rx/start-here",
    cta: "Start peptide request",
    thumbnailImage: "/images/homepage-buyer-paths/hello-gorgeous-rx.png",
    thumbnailAlt:
      "Hello Gorgeous RX — peptides and prescriptions, personalized wellness with NP oversight",
  },
  {
    id: "iv-wellness",
    track: "medical",
    title: "IV Therapy + Wellness",
    summary: "IV drips, vitamin injections, and recovery support in our Oswego clinic.",
    treatments: ["IV therapy", "Vitamin injections", "NAD+", "Glutathione", "Wellness support"],
    href: "/iv-therapy",
    cta: "Explore Wellness Services",
    thumbnailImage: "/images/homepage-buyer-paths/iv-wellness.png",
    thumbnailAlt: "IV therapy and wellness — drips, vitamin injections, NAD+ and glutathione",
  },
];

export function homepageBuyerPathsForTrack(track: HomepageTrack): BuyerPathCategory[] {
  return HOMEPAGE_BUYER_PATHS.filter((p) => p.track === track);
}
