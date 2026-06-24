/**
 * Branded Hello Gorgeous flyer art — clubs, vitamin bar, peptide hub thumbnails.
 */

import { peptideTopicHref } from "@/lib/peptides-hub";

const VB = "/images/vitamin-bar";
const PP = "/images/peptides";
const LC = "/images/ladies-club";
const GC = "/images/gentlemens-club";

export type ClubFlyerCard = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  imageAlt: string;
  href: string;
};

export const VITAMIN_BAR_FLYER_IMAGES = {
  b12: `${VB}/b12-methylcobalamin.png`,
  skinnyShot: `${VB}/skinny-shot-lipo-b.png`,
  micLipo: `${VB}/mic-lipo.png`,
  bComplex: `${VB}/vitamin-b-complex.png`,
  biotin: `${VB}/biotin-beauty-shot.png`,
  glutathione: `${VB}/glutathione-glow.png`,
  vitaminC: `${VB}/vitamin-c-immune.png`,
  triImmune: `${VB}/tri-immune-boost.png`,
  vitaminD3: `${VB}/vitamin-d3.png`,
  nadIv: `${VB}/nad-plus-injection-iv.png`,
} as const;

export const PEPTIDE_FLYER_IMAGES = {
  bpc157: `${PP}/bpc-157-flyer.png`,
  tb500: `${PP}/tb-500-flyer.png`,
  ghkCu: `${PP}/ghk-cu-flyer.png`,
  sermorelin: `${PP}/sermorelin-flyer.png`,
  tesamorelin: `${PP}/tesamorelin-flyer.png`,
  nadPlus: `${PP}/nad-plus-energy-flyer.png`,
  cjcIpamorelin: `${PP}/cjc-ipamorelin-flyer.png`,
  pt141SexualHealth: `${LC}/pt-141-sexual-health.png`,
  pt141MenWomen: `${GC}/pt-141.png`,
  tirzepatide: `${PP}/tirzepatide-flyer.png`,
  semaglutide: `${PP}/semaglutide-flyer.png`,
} as const;

export const LADIES_CLUB_GLP1_FLYERS: ClubFlyerCard[] = [
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    tagline: "Medical weight loss",
    image: `${LC}/tirzepatide-weight-loss.png`,
    imageAlt: "Tirzepatide medical weight loss for women — Hello Gorgeous Med Spa Oswego IL",
    href: "/glp-1-weight-loss-oswego",
  },
  {
    id: "semaglutide",
    name: "Semaglutide",
    tagline: "Appetite control & sustainable results",
    image: `${LC}/semaglutide-weight-loss.png`,
    imageAlt: "Semaglutide medical weight loss for women — Hello Gorgeous Med Spa Oswego IL",
    href: "/glp-1-weight-loss-oswego",
  },
];

export const GENTLEMENS_CLUB_GLP1_FLYERS = LADIES_CLUB_GLP1_FLYERS.map((f) => ({
  ...f,
  image: f.id === "tirzepatide" ? `${GC}/tirzepatide-weight-loss.png` : `${GC}/semaglutide-weight-loss.png`,
  imageAlt: f.imageAlt.replace("women", "men"),
}));

export const CLUB_PEPTIDE_FLYERS: ClubFlyerCard[] = [
  {
    id: "bpc-157",
    name: "BPC-157",
    tagline: "Healing & recovery",
    image: PEPTIDE_FLYER_IMAGES.bpc157,
    imageAlt: "BPC-157 peptide therapy — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("bpc-157"),
  },
  {
    id: "tb-500",
    name: "TB-500",
    tagline: "Recovery & repair",
    image: PEPTIDE_FLYER_IMAGES.tb500,
    imageAlt: "TB-500 peptide therapy — Hello Gorgeous Med Spa Oswego IL",
    href: "/peptides",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    tagline: "Skin & anti-aging",
    image: PEPTIDE_FLYER_IMAGES.ghkCu,
    imageAlt: "GHK-Cu copper peptide — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("ghk-cu-injectable"),
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    tagline: "Growth hormone support",
    image: PEPTIDE_FLYER_IMAGES.sermorelin,
    imageAlt: "Sermorelin peptide therapy — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("sermorelin"),
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    tagline: "Body composition",
    image: PEPTIDE_FLYER_IMAGES.tesamorelin,
    imageAlt: "Tesamorelin peptide therapy — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("tesamorelin"),
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    tagline: "Recovery · sleep · lean muscle",
    image: PEPTIDE_FLYER_IMAGES.cjcIpamorelin,
    imageAlt: "CJC-1295 and Ipamorelin — Hello Gorgeous Med Spa Oswego IL",
    href: "/peptides",
  },
  {
    id: "nad-plus",
    name: "NAD+",
    tagline: "Energy & longevity",
    image: PEPTIDE_FLYER_IMAGES.nadPlus,
    imageAlt: "NAD+ peptide therapy — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("nad-plus"),
  },
  {
    id: "pt-141",
    name: "PT-141",
    tagline: "Sexual health & libido",
    image: PEPTIDE_FLYER_IMAGES.pt141SexualHealth,
    imageAlt: "PT-141 intimacy support — Hello Gorgeous Med Spa Oswego IL",
    href: peptideTopicHref("pt-141"),
  },
];

/** Peptide flyer grid — PT-141 art differs by club. */
export function clubPeptideFlyers(club: "ladies" | "gentlemens"): ClubFlyerCard[] {
  return CLUB_PEPTIDE_FLYERS.map((flyer) =>
    flyer.id === "pt-141" && club === "gentlemens"
      ? {
          ...flyer,
          image: PEPTIDE_FLYER_IMAGES.pt141MenWomen,
          imageAlt:
            "PT-141 peptide therapy for men's intimacy and libido — Hello Gorgeous Med Spa Oswego IL",
        }
      : flyer,
  );
}

export const CLUB_VITAMIN_FLYERS: ClubFlyerCard[] = [
  {
    id: "b12",
    name: "B12 Methylcobalamin",
    tagline: "Energy & metabolism",
    image: VITAMIN_BAR_FLYER_IMAGES.b12,
    imageAlt: "B12 methylcobalamin shot — Hello Gorgeous Vitamin Bar Oswego IL",
    href: "/iv-shots",
  },
  {
    id: "skinny-shot",
    name: "Skinny Shot",
    tagline: "Lipo-B + B12",
    image: VITAMIN_BAR_FLYER_IMAGES.skinnyShot,
    imageAlt: "Skinny Shot lipotropic injection — Hello Gorgeous Vitamin Bar",
    href: "/iv-shots",
  },
  {
    id: "biotin",
    name: "Biotin Beauty Shot",
    tagline: "Hair, skin & nails",
    image: VITAMIN_BAR_FLYER_IMAGES.biotin,
    imageAlt: "Biotin beauty shot — Hello Gorgeous Vitamin Bar",
    href: "/iv-shots",
  },
  {
    id: "glutathione",
    name: "Glutathione",
    tagline: "Glow / brighten",
    image: VITAMIN_BAR_FLYER_IMAGES.glutathione,
    imageAlt: "Glutathione glow shot — Hello Gorgeous Vitamin Bar",
    href: "/iv-shots",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C",
    tagline: "Immune support",
    image: VITAMIN_BAR_FLYER_IMAGES.vitaminC,
    imageAlt: "Vitamin C immune support shot — Hello Gorgeous Vitamin Bar",
    href: "/iv-shots",
  },
  {
    id: "tri-immune",
    name: "Tri-Immune Boost",
    tagline: "Glutathione + C + zinc",
    image: VITAMIN_BAR_FLYER_IMAGES.triImmune,
    imageAlt: "Tri-Immune Boost — Hello Gorgeous Vitamin Bar",
    href: "/iv-shots",
  },
  {
    id: "nad-iv",
    name: "NAD+ IV & Injection",
    tagline: "Cellular energy & recovery",
    image: VITAMIN_BAR_FLYER_IMAGES.nadIv,
    imageAlt: "NAD+ IV and injection — Hello Gorgeous Med Spa Oswego IL",
    href: "/nad-plus-injections-oswego",
  },
];
