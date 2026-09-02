import { FACIALS_PEELS_PATH } from "@/lib/facials-peels-marketing";
import { INJECTABLES_PATH } from "@/lib/injectables-marketing";
import { MORPHEUS8_PATH } from "@/lib/morpheus8-marketing";

export const CLINIC_SERVICES_BAND_ID = "clinic-services" as const;

export const CLINIC_SERVICES_PHOTOS = [
  {
    src: "/images/ipl-photofacial/ipl-photofacial-treatment-cheek.png",
    alt: "IPL photofacial treatment at Hello Gorgeous Med Spa in Oswego",
    className: "left-0 top-[6%] z-20 w-[58%] -rotate-[9deg]",
  },
  {
    src: "/images/injectables/hero-lip-injection.png",
    alt: "Lip filler injection at Hello Gorgeous Med Spa",
    className: "right-0 top-0 z-30 w-[50%] rotate-[8deg]",
  },
  {
    src: "/images/botox/slideshow/01.jpg",
    alt: "Injectable treatment in the chair at Hello Gorgeous Med Spa Oswego",
    className: "bottom-0 left-[10%] z-10 w-[46%] -rotate-[5deg]",
  },
] as const;

export const CLINIC_SERVICES_ITEMS = [
  {
    title: "Botox®, Xeomin® & Dysport®",
    href: INJECTABLES_PATH,
    body: "Precision neuromodulators for forehead lines, frown lines, and crow’s feet — planned in the chair, never rushed.",
  },
  {
    title: "Revanesse® Versa™ & dermal fillers",
    href: INJECTABLES_PATH,
    body: "Volume for cheeks, under-eyes, smile lines, and lips. We start conservative and build only if it still looks like you.",
  },
  {
    title: "Morpheus8 Burst",
    href: MORPHEUS8_PATH,
    body: "RF microneedling for texture, mild laxity, and contour on the face and body — our deepest collagen-remodeling device.",
  },
  {
    title: "Microneedling with PRP or AnteAGE®",
    href: "/services/microneedling",
    body: "Collagen induction for pores, acne marks, and uneven texture, with your own PRP or AnteAGE growth factors when it fits.",
  },
  {
    title: "Signature facials & HydraFacial",
    href: FACIALS_PEELS_PATH,
    body: "Medical-grade glow — HydraFacial, the OG Signature, and Gorgeous Glow — for skin that needs a reset, not a day-spa menu.",
  },
] as const;
