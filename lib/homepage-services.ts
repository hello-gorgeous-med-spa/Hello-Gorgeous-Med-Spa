/** Single source of truth for homepage service cards — used by ServicesSection and JSON-LD (ItemList, offers). */

export type HomepageServiceCard = {
  title: string;
  description: string;
  link: string;
  items: string[];
  image: string;
  imageAlt: string;
  badge?: string;
  imageContain?: boolean;
};

export const homepageServicesRow1: HomepageServiceCard[] = [
  {
    title: "Morpheus8 RF",
    description:
      "The deepest RF microneedling available. Face & body contouring, skin tightening, and fat reduction with Burst + Quantum technology.",
    link: "/services/morpheus8",
    items: ["Face Tightening", "Body Contouring", "Acne Scars", "Fat Reduction"],
    image: "/images/homepage-services/morpheus8-burst-verified-provider.png",
    imageAlt:
      "Morpheus8 Burst verified InMode provider performing RF microneedling for skin tightening at Hello Gorgeous Med Spa Oswego IL",
    badge: "NEW",
  },
  {
    title: "Injectables",
    description:
      "Precision Botox®, dermal fillers, and lip enhancement delivered with medical expertise and artistic vision.",
    link: "/injectables",
    items: ["Botox & Dysport", "Dermal Fillers", "Lip Enhancement", "Kybella"],
    image: "/images/homepage-services/botox-cosmetic-authentic-vial.png",
    imageAlt:
      "Authentic Botox Cosmetic onabotulinumtoxinA packaging — FDA-approved neurotoxin at Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Medical Weight Loss",
    description:
      "Physician-supervised GLP-1 therapies including Semaglutide and Tirzepatide for lasting results.",
    link: "/rx/metabolic",
    items: ["Semaglutide", "Tirzepatide", "B12 Injections", "Lipo-C"],
    image: "/images/homepage-services/compounded-tirzepatide-weight-loss.png",
    imageAlt:
      "Compounded Tirzepatide for medical weight loss — Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
  },
  {
    title: "Hormone Optimization",
    description:
      "Bio-identical hormone therapy for men and women. Restore balance, energy, and vitality.",
    link: "/rx/hormones",
    items: ["TRT for Men", "HRT for Women", "BioTE Pellets", "Thyroid Support"],
    image: "/images/homepage-services/biote-certified-provider-seal.png",
    imageAlt: "Biote Trusted Certified Provider seal — hormone optimization at Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
    imageContain: true,
  },
  {
    title: "Solaria CO₂",
    description:
      "Fractional CO₂ laser resurfacing for wrinkles, scars, sun damage, and body stretch marks — gold-standard skin renewal.",
    link: "/services/solaria-co2",
    items: ["Face & Neck", "Body Resurfacing", "Stretch Marks", "Texture & Tone"],
    image: "/images/solaria/solaria-workstation.png",
    imageAlt:
      "InMode Solaria CO₂ fractional laser workstation for skin resurfacing at Hello Gorgeous Med Spa Oswego IL",
    badge: "NEW",
  },
];

export const homepageServicesRow2: HomepageServiceCard[] = [
  {
    title: "IV Therapy",
    description:
      "Hydration, NAD+, Myers Cocktail, immunity-support blends, and custom IV drips for energy, recovery, and glow — administered by licensed providers in Oswego.",
    link: "/services/iv-therapy",
    items: ["Myers Cocktail", "NAD+ Drips", "Immunity IV", "Hydration"],
    image: "/images/homepage-services/iv-therapy-immunity-infusion.png",
    imageAlt:
      "IV immunity infusion therapy — vitamin C, B-complex, zinc — Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Rx Prescription Care",
    description:
      "Hello Gorgeous RX™ — hormone, metabolic, dermatology, and longevity prescriptions with NP oversight and telehealth options.",
    link: "/rx",
    items: ["Virtual consults", "Dermatology RX", "Longevity meds", "Ongoing care"],
    image: "/images/services/hg-full-rx-authority.png",
    imageAlt: "Prescription care and medical provider authority at Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
    imageContain: true,
  },
  {
    title: "Peptide Therapy",
    description:
      "BPC-157, Sermorelin, and targeted peptide protocols for recovery, sleep, metabolism, and anti-aging — individualized plans.",
    link: "/peptides",
    items: ["BPC-157", "Sermorelin", "Recovery", "Anti-aging"],
    image: "/images/services/hg-peptides-rx.png",
    imageAlt: "Peptide therapy prescriptions BPC-157 Sermorelin at Hello Gorgeous Med Spa Oswego IL",
    badge: "RX",
    imageContain: true,
  },
  {
    title: "AnteAGE MD®",
    description:
      "Professional brightening with bone marrow–derived growth factors and tranexamic acid — in-office protocols plus AnteAGE MD® Daily Brightener at home.",
    link: "/services/morpheus8",
    items: ["Age spots", "Hyperpigmentation", "Uneven skin tone", "Microneedling pairing"],
    image: "/images/homepage-services/anteage-md-brightening.png",
    imageAlt:
      "AnteAGE MD brightening before and after — microneedling and growth factor skincare at Hello Gorgeous Med Spa Oswego IL",
    badge: "NEW",
    imageContain: true,
  },
  {
    title: "VAMP™",
    description:
      "Advanced skin revitalization with PDRN and nutrient-rich complexes — hydration, anti-aging support, and barrier care tailored to your plan.",
    link: "/services/morpheus8",
    items: ["Hydration", "Skin revitalization", "Anti-aging nutrients", "Barrier support"],
    image: "/images/homepage-services/vamp-skin-revitalization.png",
    imageAlt:
      "VAMP skin revitalization treatment nutrients — Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Laser Hair Removal",
    description:
      "Professional laser hair removal for face and body — safe for more skin types with personalized settings and membership savings.",
    link: "/services/laser-hair-removal",
    items: ["Face & body", "Brazilian", "Packages", "Memberships"],
    image: "/images/homepage-services/laser-hair-removal-zemits-quidion-lite.png",
    imageAlt:
      "Zemits QuiDion Lite laser hair removal treatment — underarm session at Hello Gorgeous Med Spa Oswego IL",
  },
  {
    title: "IPL Photofacials",
    description:
      "Intense Pulsed Light for sun spots, redness, rosacea, and overall photorejuvenation — brighter, more even skin in Oswego.",
    link: "/services/ipl-photofacial",
    items: ["Brown spots", "Redness", "Rosacea", "Photo rejuvenation"],
    image: "/images/homepage-services/ipl-photofacial-zemits-treatment.png",
    imageAlt:
      "IPL photofacial treatment with professional light handpiece for skin rejuvenation — Hello Gorgeous Med Spa Oswego IL",
  },
  {
    title: "Vitamin Injections",
    description:
      "B12, lipotropic, and wellness injections for energy, metabolism, and immune support — quick in-office visits.",
    link: "/services/vitamin-injections",
    items: ["B12 shots", "Lipo-C", "Energy boost", "Wellness"],
    image: "/images/homepage-services/vitamin-injections-fruit-syringe.png",
    imageAlt:
      "Vitamin injections and wellness shots — clinical syringe with fresh fruit wellness imagery at Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Lash Bar",
    description:
      "Lash extensions, fills, perm, and tint — premium lash artistry for a wide-eyed, polished look.",
    link: "/services/lash-spa",
    items: ["Full set & fills", "Lash perm & tint", "Hybrid & volume", "Brow options"],
    image: "/images/homepage-services/lash-bar-volume-hybrid-classic.png",
    imageAlt:
      "Volume, hybrid, and classic eyelash extension styles — Hello Gorgeous Lash Bar Oswego IL",
    imageContain: true,
  },
  {
    title: "Trigger Point Injections",
    description:
      "Targeted injections for muscle knots and chronic tension — neck, shoulders, back, TMJ-related pain, and headache trigger points. Licensed medical providers in Oswego.",
    link: "/trigger-point-injections-oswego-il",
    items: ["Neck & shoulders", "Back & hips", "TMJ tension", "Headache triggers"],
    image: "/images/homepage-services/trigger-point-injections-body-pain-grid.png",
    imageAlt:
      "Common areas of muscle pain and trigger points — neck, back, shoulders, arms — treated with trigger point injections at Hello Gorgeous Med Spa Oswego Naperville IL",
  },
  {
    title: "Cellulite Treatment",
    description:
      "RF and advanced body technologies to smooth dimples and improve skin texture — Morpheus8 Body and Quantum RF protocols tailored to thighs, buttocks, and abdomen.",
    link: "/cellulite-treatment-oswego-il",
    items: ["Thighs & buttocks", "RF skin tightening", "Texture & dimpling", "Custom body plan"],
    image: "/images/home/morpheus8-body-burst-technology-inmode.png",
    imageAlt:
      "Morpheus8 Body RF microneedling for cellulite and body contouring — InMode at Hello Gorgeous Med Spa Oswego IL",
    imageContain: true,
  },
  {
    title: "Stretch Mark Treatment",
    description:
      "Fractional CO₂ and collagen-stimulating protocols to refine striae on abdomen, hips, breasts, and thighs — ideal after weight change or pregnancy.",
    link: "/stretch-mark-treatment-oswego-il",
    items: ["Abdomen & hips", "Solaria CO₂ body", "Texture blending", "Series plans"],
    image: "/images/solaria-before-after/stretch-mark-comparison.png",
    imageAlt:
      "Stretch mark refinement before and after Solaria CO₂ fractional laser — Hello Gorgeous Med Spa Oswego Naperville IL",
  },
];

export const ALL_HOMEPAGE_SERVICES: HomepageServiceCard[] = [
  ...homepageServicesRow1,
  ...homepageServicesRow2,
];
