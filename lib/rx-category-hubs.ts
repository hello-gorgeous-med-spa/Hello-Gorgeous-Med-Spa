/**
 * REGEN category hubs — EXPLORE nav + landing page data (Hers-style shop taxonomy).
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  LABS_HUB_PATH,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
} from "@/lib/flows";
import { GLP1_PROGRAM } from "@/lib/glp1-program-pricing";
import { GENTLEMENS_CLUB_PATH } from "@/lib/gentlemens-club";
import { REGEN_PREVIEW_FALLBACKS } from "@/lib/regen-brand";

export type RxCategoryHubId =
  | "weight-loss"
  | "labs"
  | "hormones"
  | "peptides"
  | "sexual-health"
  | "testosterone"
  | "hair-skin"
  | "wellness";

export type RxCategoryProduct = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  href: string;
  image: string;
  imageAlt: string;
  badge?: "POPULAR" | "NEW";
  rx?: boolean;
};

export type RxCategoryHub = {
  id: RxCategoryHubId;
  navLabel: string;
  hubPath: string;
  previewImage: string;
  previewAlt: string;
  /** Optional full-width hero visual below headline */
  heroImage?: string;
  heroImageAlt?: string;
  hero: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
  };
  steps: Array<{ title: string; body: string }>;
  products: RxCategoryProduct[];
  trustLine: string;
  faq?: Array<{ q: string; a: string }>;
  /** Storefront / checkout entry — defaults to /rx */
  getStartedPath?: string;
};

const WEIGHT_LOSS_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    description: "Dual GLP-1 + GIP pathway · medical weight loss program",
    priceLabel: `From $${GLP1_PROGRAM.injectable.tirzepatideFromUsd}/mo`,
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/tirzepatide-glp1.png",
    imageAlt: "Compounded tirzepatide — REGEN medical weight loss",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    description: "GLP-1 injection · NP-supervised weight loss",
    priceLabel: `From $${GLP1_PROGRAM.injectable.semaglutideFromUsd}/mo`,
    href: GLP1_INTAKE_PATH,
    image: "/images/shop-rx/semaglutide-glp1.png",
    imageAlt: "Compounded semaglutide — REGEN medical weight loss",
    rx: true,
  },
  {
    id: "glp1-refill",
    name: "GLP-1 Refill",
    description: "Renew semaglutide or tirzepatide · ship to home",
    priceLabel: "Existing patients",
    href: GLP1_REFILL_PATH,
    image: "/images/shop-rx/glp1-refill.png",
    imageAlt: "GLP-1 refill — REGEN home delivery",
    rx: true,
  },
];

const HAIR_SKIN_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "manetain",
    name: "ManeTain Hair Spray",
    description: "Minoxidil 5% leave-in with fluocinolone & retinoic — defend thinning hair",
    priceLabel: "$172.50",
    href: "#faq",
    image: "/images/regen/prod-manetain.png",
    imageAlt: "ManeTain prescription hair spray — RE GEN",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "minoxidil-oral",
    name: "Oral Minoxidil",
    description: "Low-dose systemic hair regrowth support when topicals aren’t enough",
    priceLabel: "from $95/30ct",
    href: "#faq",
    image: "/images/regen/prod-manetain.png",
    imageAlt: "Oral minoxidil — RE GEN hair regrowth",
    rx: true,
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu Cream",
    description: "Copper peptide topical — skin repair, tightening & collagen support",
    priceLabel: "from $125/tube",
    href: "#faq",
    image: "/images/shop-rx/ghk-cu.png",
    imageAlt: "GHK-Cu copper peptide cream — RE GEN",
    rx: false,
  },
  {
    id: "glow",
    name: "Glow Cream",
    description: "Even skin tone — kojic acid, ascorbic acid & hyaluronic acid",
    priceLabel: "$125/30g",
    href: "#faq",
    image: "/images/regen/prod-glow.jpg",
    imageAlt: "Glow brightening cream — RE GEN dermatology",
    rx: true,
  },
  {
    id: "miracle",
    name: "Miracle Cream",
    description: "Extreme repair & brightening — hydroquinone + retinoic blend",
    priceLabel: "$125/30g",
    href: "#faq",
    image: "/images/regen/prod-miracle.jpg",
    imageAlt: "Miracle repair cream — RE GEN",
    rx: true,
  },
  {
    id: "erase",
    name: "Erase Cream",
    description: "Acne-focused Rx — retinoic acid with clindamycin",
    priceLabel: "$125/30g",
    href: "#faq",
    image: "/images/regen/prod-erase.jpg",
    imageAlt: "Erase acne cream — RE GEN",
    rx: true,
  },
];

const HORMONE_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "test-cyp",
    name: "Testosterone Cypionate",
    description: "Injectable TRT — grapeseed or MCT carrier · NP-guided dosing",
    priceLabel: "from $75/vial",
    href: "#faq",
    image: "/images/shop-rx/hrt/testosterone-trt.png",
    imageAlt: "Testosterone cypionate — RE GEN hormones",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "test-cream",
    name: "Testosterone Cream",
    description: "Topical TRT — 10% or 20% strengths · daily application",
    priceLabel: "$87.50/tube",
    href: "#faq",
    image: "/images/shop-rx/hrt/testosterone-trt.png",
    imageAlt: "Testosterone cream — RE GEN",
    rx: true,
  },
  {
    id: "clomiphene",
    name: "Clomiphene",
    description: "Stimulate natural testosterone — fertility-friendly option for some men",
    priceLabel: "$112.50/30ct",
    href: "#faq",
    image: "/images/shop-rx/hrt/dhea.png",
    imageAlt: "Clomiphene — RE GEN hormone support",
    rx: true,
  },
  {
    id: "biest",
    name: "Bi-Est Cream",
    description: "Bioidentical estriol / estradiol blend for women’s HRT",
    priceLabel: "$90/tube",
    href: "#faq",
    image: "/images/shop-rx/hrt/estrogen-biest.png",
    imageAlt: "Bi-Est cream — RE GEN women's hormones",
    rx: true,
  },
  {
    id: "progesterone",
    name: "Progesterone",
    description: "Capsules or cream — menopause & cycle support",
    priceLabel: "from $63.75/30ct",
    href: "#faq",
    image: "/images/shop-rx/hrt/dhea.png",
    imageAlt: "Progesterone — RE GEN HRT",
    rx: true,
  },
];

const SEXUAL_HEALTH_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "sildenafil",
    name: "Sildenafil RDT",
    description: "Fast-dissolve ED tablet — discreet, NP-prescribed dosing",
    priceLabel: "from $125/10ct",
    href: "#faq",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "Sildenafil — RE GEN sexual health",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "tadalafil",
    name: "Tadalafil RDT",
    description: "Longer-window ED support — rapid-dissolve format",
    priceLabel: "$125/10ct",
    href: "#faq",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "Tadalafil — RE GEN",
    rx: true,
  },
  {
    id: "maxx-pe",
    name: "MAXX PE",
    description: "Triple-combo performance tablet for men",
    priceLabel: "$150/10ct",
    href: "#faq",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "MAXX PE — RE GEN men's sexual health",
    rx: true,
  },
  {
    id: "scream-cream",
    name: "Scream Cream",
    description: "Topical arousal cream for women — compounded Rx",
    priceLabel: "$125/tube",
    href: "#faq",
    image: "/images/regen/prod-glow.jpg",
    imageAlt: "Scream Cream — RE GEN women's wellness",
    rx: true,
  },
  {
    id: "pt-141",
    name: "PT-141 Injection",
    description: "Peptide arousal support — libido pathway for men & women",
    priceLabel: "$175/vial",
    href: "#faq",
    image: "/images/shop-rx/pt-141.png",
    imageAlt: "PT-141 — RE GEN peptide intimacy",
    rx: true,
  },
];

const PEPTIDE_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "bpc-157",
    name: "BPC-157 Injection",
    description: "Tissue repair & gut support — popular recovery peptide protocol",
    priceLabel: "$175/vial",
    href: "#faq",
    image: "/images/shop-rx/bpc-157.png",
    imageAlt: "BPC-157 peptide — RE GEN",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "nad-100",
    name: "NAD+ Injection",
    description: "100 mg/mL · 10 mL — mitochondrial & cellular energy support",
    priceLabel: "$150/vial",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "NAD+ injection — RE GEN peptides",
    badge: "POPULAR",
    rx: true,
  },
  {
    id: "sermorelin",
    name: "Sermorelin Injection",
    description: "Growth-hormone axis support — nightly injection protocol",
    priceLabel: "from $95/vial",
    href: "#faq",
    image: "/images/shop-rx/sermorelin.png",
    imageAlt: "Sermorelin — RE GEN",
    rx: true,
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    description: "GH secretagogue combo — recovery & body composition",
    priceLabel: "$200/vial",
    href: "#faq",
    image: "/images/shop-rx/tesamorelin.png",
    imageAlt: "CJC Ipamorelin — RE GEN",
    rx: true,
  },
  {
    id: "tb-500",
    name: "TB-500 Injection",
    description: "Mobility & tissue support — often paired with BPC-157",
    priceLabel: "$212.50/vial",
    href: "#faq",
    image: "/images/shop-rx/bpc-157.png",
    imageAlt: "TB-500 peptide — RE GEN",
    rx: true,
  },
  {
    id: "glutathione",
    name: "Glutathione Injection",
    description: "Master antioxidant — glow & detox support",
    priceLabel: "from $66/vial",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "Glutathione — RE GEN wellness",
    rx: false,
  },
];

const WELLNESS_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "b12",
    name: "B12 Methylcobalamin",
    description: "Energy & metabolism — injectable wellness staple",
    priceLabel: "from $72.75/vial",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "B12 injection — RE GEN daily wellness",
    badge: "POPULAR",
    rx: false,
  },
  {
    id: "nad-wellness",
    name: "NAD+ Injection",
    description: "10-week supply protocol — longevity & focus support",
    priceLabel: "$150",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "NAD+ — RE GEN daily wellness",
    rx: true,
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 Injection",
    description: "Immune & bone support — especially in Midwest winters",
    priceLabel: "$148.78/vial",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "Vitamin D3 injection — RE GEN",
    rx: false,
  },
  {
    id: "biotin",
    name: "Biotin Injection",
    description: "Hair, skin & nail support — injectable biotin protocols",
    priceLabel: "from $82.65/vial",
    href: "#faq",
    image: "/images/regen/prod-manetain.png",
    imageAlt: "Biotin injection — RE GEN",
    rx: false,
  },
  {
    id: "glutathione-wellness",
    name: "Glutathione Injection",
    description: "Antioxidant & skin-brightening wellness shot supply",
    priceLabel: "from $66/vial",
    href: "#faq",
    image: "/images/shop-rx/nad-plus.png",
    imageAlt: "Glutathione — RE GEN",
    rx: false,
  },
  {
    id: "ldn",
    name: "Low-Dose Naltrexone",
    description: "LDN capsules — metabolic & inflammation support when appropriate",
    priceLabel: "from $68.75/30ct",
    href: "#faq",
    image: "/images/shop-rx/hrt/dhea.png",
    imageAlt: "LDN — RE GEN wellness Rx",
    rx: true,
  },
];

const PEPTIDE_FAQ = [
  {
    q: "Are RE GEN peptides prescription?",
    a: "Most injectable peptide protocols are prescription-only. Ryan Kent, FNP-BC reviews your health history before approving any protocol. We do not sell research-grade or gray-market peptides.",
  },
  {
    q: "What peptides are most popular at Hello Gorgeous?",
    a: "BPC-157 for recovery, NAD+ for energy, sermorelin and CJC/ipamorelin for GH-axis support, and glutathione for antioxidant wellness — your provider tailors dosing to your goals.",
  },
  {
    q: "Do I need labs before starting peptides?",
    a: "Often yes for GH-axis and longevity protocols. Your NP will recommend baseline labs when appropriate and recheck on a schedule that matches your protocol.",
  },
  {
    q: "How does ordering work?",
    a: "Pay first at RE GEN, complete your post-payment health intake, book telehealth when required, and your vials ship after NP approval — flat $30 shipping.",
  },
  {
    q: "Can I read more before I buy?",
    a: "Yes — visit our education hub at /peptides for peptide explainers, or call 630-636-6193 to talk with our Oswego team.",
  },
] as const;

const WELLNESS_FAQ = [
  {
    q: "What is RE GEN daily wellness?",
    a: "Injectable B12, NAD+, vitamin D3, biotin, glutathione, and related wellness Rx — ordered online with NP review, shipped to your door across Illinois.",
  },
  {
    q: "Can I still visit the Vitamin Bar in Oswego?",
    a: "Yes! In-clinic drive-thru wellness shots and IV therapy remain available at Hello Gorgeous Med Spa. RE GEN daily wellness is for at-home injectable supplies when that fits your life better.",
  },
  {
    q: "Are vitamin injections safe?",
    a: "When prescribed appropriately and sourced from licensed pharmacies, injectable wellness protocols have a strong safety profile. Your provider screens your history and medications first.",
  },
  {
    q: "How often do I inject?",
    a: "It depends on the product — B12 and D3 are often weekly; NAD+ and glutathione vary. Your NP sets a simple schedule after reviewing your intake.",
  },
  {
    q: "Is NAD+ a peptide or a vitamin?",
    a: "NAD+ is a cellular cofactor used in both peptide and wellness protocols. On RE GEN it is offered as an injectable supply with NP oversight — not as an unregulated supplement.",
  },
] as const;

const PAY_FIRST_STEPS = [
  {
    title: "Pay to secure your order",
    body: "Checkout online — your medication is reserved while we review your chart.",
  },
  {
    title: "Complete health intake",
    body: "Medical history, allergies, and goals so Ryan Kent, FNP-BC can review safely.",
  },
  {
    title: "Telehealth if required",
    body: "Book a quick video visit when your protocol needs NP clearance before ship.",
  },
  {
    title: "Ships after approval",
    body: "Nothing dispensed without clinical sign-off. Flat $30 shipping · tracking included.",
  },
];

const WEIGHT_LOSS_FAQ = [
  {
    q: "Are compounded GLP-1 medications FDA-approved?",
    a: "Compounded semaglutide and tirzepatide are prepared by a licensed US pharmacy for an individual patient when medically appropriate — they are not FDA-approved brand products. Your NP reviews candidacy, dosing, and follow-up before anything ships.",
  },
  {
    q: "How does RE GEN weight loss work?",
    a: "Pay first to secure your order, complete your health intake, book telehealth when required, and your NP approves your protocol before pharmacy dispatch. Ryan Kent, FNP-BC supervises every Illinois plan.",
  },
  {
    q: "Semaglutide vs tirzepatide — which is right for me?",
    a: "Both are GLP-1-class therapies with different mechanisms and titration schedules. Your provider reviews your history, goals, tolerability, and access — not marketing hype — to recommend a fit.",
  },
  {
    q: "How much does shipping cost?",
    a: "Flat $30 per RE GEN order, tracked to your door after NP approval.",
  },
  {
    q: "Can existing patients refill?",
    a: "Yes — established Hello Gorgeous GLP-1 patients can use our refill intake for home delivery when clinically appropriate.",
  },
] as const;

const HAIR_SKIN_FAQ = [
  {
    q: "Are RE GEN hair and skin products prescription?",
    a: "Yes — these are compounded prescription-strength formulas, not OTC cosmeceuticals. Ryan Kent, FNP-BC reviews your goals, health history, and contraindications before prescribing.",
  },
  {
    q: "How long until I see results?",
    a: "Skin actives often show visible change in 6–12 weeks with consistent use. Hair treatments typically need 3–6 months — hair growth cycles are slow; we set realistic expectations up front.",
  },
  {
    q: "Can I combine hair and skin products?",
    a: "Often, yes — your provider builds a simple AM/PM routine and tells you how to layer actives safely. We avoid stacking conflicting retinoids or irritants without guidance.",
  },
  {
    q: "What is ManeTain?",
    a: "ManeTain is our prescription leave-in hair spray with minoxidil 5% plus supportive actives — designed for thinning hair defense and regrowth support under NP supervision.",
  },
  {
    q: "Do I need telehealth before my order ships?",
    a: "Yes for new protocols. RE GEN is pay-first: you secure your order, complete intake, then book a telehealth visit when required. Nothing ships without NP approval.",
  },
  {
    q: "Who compounds these medications?",
    a: "Licensed US compounding pharmacies partner with Hello Gorgeous Med Spa — 503A/503B facilities, not gray-market research chemicals.",
  },
  {
    q: "Can women use these hair treatments?",
    a: "Many protocols are appropriate for women with thinning hair — pregnancy and breastfeeding are important screens. Your intake captures this before prescribing.",
  },
] as const;

export const REGEN_CATEGORY_HUBS: RxCategoryHub[] = [
  {
    id: "weight-loss",
    navLabel: "Weight Loss",
    hubPath: "/rx/weight-loss",
    previewImage: REGEN_PREVIEW_FALLBACKS["weight-loss"],
    previewAlt: "REGEN medical weight loss programs",
    hero: {
      eyebrow: "REGEN · Medical weight loss",
      title: "Weight loss that fits",
      titleAccent: "your life.",
      subtitle:
        "Compounded GLP-1 programs supervised by Ryan Kent, FNP-BC — intake online, telehealth when needed, medication shipped to your door in Illinois.",
    },
    steps: PAY_FIRST_STEPS,
    products: WEIGHT_LOSS_PRODUCTS,
    trustLine: "NP-supervised · Illinois patients · No surprise pharmacy runaround",
    faq: [...WEIGHT_LOSS_FAQ],
    getStartedPath: "/rx",
  },
  {
    id: "labs",
    navLabel: "Labs",
    hubPath: LABS_HUB_PATH,
    previewImage: REGEN_PREVIEW_FALLBACKS.labs,
    previewAlt: "REGEN lab panels — in-house draws Oswego",
    hero: {
      eyebrow: "REGEN · Labs",
      title: "Lab testing,",
      titleAccent: "without the runaround.",
      subtitle: "Cash-pay panels from $199 — drawn in-house at Hello Gorgeous or at Quest/LabCorp.",
    },
    steps: [],
    products: [],
    trustLine: "Access Medical Labs · NP review included",
  },
  {
    id: "hormones",
    navLabel: "Hormones",
    hubPath: "/rx/hormones",
    previewImage: REGEN_PREVIEW_FALLBACKS.hormones,
    previewAlt: "REGEN hormone therapy",
    hero: {
      eyebrow: "RE GEN · Hormones",
      title: "Hormone therapy,",
      titleAccent: "personalized.",
      subtitle:
        "TRT, women's bioidentical HRT, and fertility-friendly options — compounded, lab-guided, and supervised by Ryan Kent, FNP-BC in Oswego.",
    },
    steps: PAY_FIRST_STEPS,
    products: HORMONE_PRODUCTS,
    trustLine: "Lab-guided · Ryan Kent, FNP-BC · Illinois telehealth",
    getStartedPath: "/rx",
    faq: [
      {
        q: "Do I need bloodwork for hormone therapy?",
        a: "Yes — hormone therapy is guided by labs. Your provider orders baseline panels and periodic rechecks to keep you in a safe, effective range.",
      },
      {
        q: "What's the difference between TRT, clomiphene, and HCG?",
        a: "TRT supplies testosterone directly. Clomiphene and HCG stimulate your body to produce more of its own — which can help preserve fertility and testicular function. Your NP helps you choose based on goals and labs.",
      },
      {
        q: "Do you treat women for hormones too?",
        a: "Yes — bioidentical estradiol, estriol, Bi-Est, progesterone, low-dose testosterone, and DHEA for perimenopause, menopause, and hormonal balance.",
      },
      {
        q: "How does RE GEN hormone ordering work?",
        a: "Pay first to secure your protocol, complete your health intake, book telehealth when required, and your medication ships after NP approval — flat $30 shipping.",
      },
      {
        q: "Is testosterone a controlled substance?",
        a: "Yes — testosterone protocols require ongoing monitoring, valid prescription, and identity verification per Illinois and federal rules.",
      },
    ],
  },
  {
    id: "peptides",
    navLabel: "Peptides",
    hubPath: "/rx/peptides",
    previewImage: REGEN_PREVIEW_FALLBACKS.peptides,
    previewAlt: "REGEN peptide therapy",
    hero: {
      eyebrow: "RE GEN · Peptides",
      title: "Peptide protocols",
      titleAccent: "built for you.",
      subtitle:
        "BPC-157, sermorelin, NAD+, and 22+ injectable protocols — pay first, NP review, telehealth when required, then ship across Illinois.",
    },
    steps: PAY_FIRST_STEPS,
    products: PEPTIDE_PRODUCTS,
    trustLine: "Licensed pharmacy · Ryan Kent, FNP-BC · No gray-market peptides",
    getStartedPath: "/rx",
    faq: [...PEPTIDE_FAQ],
  },
  {
    id: "sexual-health",
    navLabel: "Sexual Health",
    hubPath: "/rx/sexual-health",
    previewImage: REGEN_PREVIEW_FALLBACKS["sexual-health"],
    previewAlt: "REGEN sexual wellness",
    hero: {
      eyebrow: "RE GEN · Sexual wellness",
      title: "Sexual health",
      titleAccent: "in your control.",
      subtitle:
        "ED tablets, women's arousal creams, and peptide libido support — discreet, hormone-aware prescribing by Ryan Kent, FNP-BC.",
    },
    steps: PAY_FIRST_STEPS,
    products: SEXUAL_HEALTH_PRODUCTS,
    trustLine: "Discreet shipping · NP-supervised · Illinois patients",
    getStartedPath: "/rx",
    faq: [
      {
        q: "Is RE GEN sexual health care discreet?",
        a: "Yes — telehealth visits are private, packaging is discreet, and our team treats intimacy concerns with clinical professionalism.",
      },
      {
        q: "Can I take ED medication if I use nitrates?",
        a: "No — PDE-5 medications like sildenafil and tadalafil are contraindicated with nitrates. Your intake screens for this; always disclose cardiac medications.",
      },
      {
        q: "Do women have options too?",
        a: "Yes — Scream Cream, hormone balancing, and PT-141 peptide protocols may support arousal and libido when medically appropriate.",
      },
      {
        q: "How fast can I get started?",
        a: "Pay online, complete your intake, and book telehealth when required. Many patients connect with our NP same-day or next business day.",
      },
      {
        q: "Are these compounded medications?",
        a: "Many protocols are compounded by licensed US pharmacies for individual patients. Your NP confirms safety and appropriateness before prescribing.",
      },
    ],
  },
  {
    id: "testosterone",
    navLabel: "Testosterone",
    hubPath: `${GENTLEMENS_CLUB_PATH}/testosterone`,
    previewImage: REGEN_PREVIEW_FALLBACKS.testosterone,
    previewAlt: "REGEN testosterone and TRT",
    hero: {
      eyebrow: "REGEN · Men's health",
      title: "Testosterone &",
      titleAccent: "TRT.",
      subtitle: "Men's hormone optimization — in-person and telehealth options in Oswego.",
    },
    steps: [],
    products: [],
    trustLine: "Gentlemen's Club TRT programs",
  },
  {
    id: "hair-skin",
    navLabel: "Hair & Skin",
    hubPath: "/rx/hair-skin",
    previewImage: REGEN_PREVIEW_FALLBACKS["hair-skin"],
    previewAlt: "RE GEN hair and skin Rx",
    heroImage: "/images/regen/hero-hair-skin.jpg",
    heroImageAlt: "RE GEN prescription hair regrowth and dermatology care",
    hero: {
      eyebrow: "RE GEN · Hair + Skin",
      title: "Keep your hair.",
      titleAccent: "Love your skin.",
      subtitle:
        "Prescription-strength dermatology creams for brightening, acne, and anti-aging — plus ManeTain and minoxidil protocols for thinning hair. NP-reviewed before anything ships.",
    },
    steps: PAY_FIRST_STEPS,
    products: HAIR_SKIN_PRODUCTS,
    trustLine: "Compounded Rx · Ryan Kent, FNP-BC · Shipped after approval",
    getStartedPath: "/rx",
    faq: [...HAIR_SKIN_FAQ],
  },
  {
    id: "wellness",
    navLabel: "Everyday Wellness",
    hubPath: "/rx/wellness",
    previewImage: REGEN_PREVIEW_FALLBACKS.wellness,
    previewAlt: "REGEN daily wellness injectables",
    hero: {
      eyebrow: "RE GEN · Daily wellness",
      title: "Everyday",
      titleAccent: "wellness.",
      subtitle:
        "Injectable B12, NAD+, vitamin D3, biotin, glutathione & more — NP-reviewed RE GEN supplies shipped to your door. In-clinic Vitamin Bar still available in Oswego.",
    },
    steps: PAY_FIRST_STEPS,
    products: WELLNESS_PRODUCTS,
    trustLine: "Injectable wellness · Ryan Kent, FNP-BC · Illinois patients",
    getStartedPath: "/rx",
    faq: [...WELLNESS_FAQ],
  },
];

export function getRegenCategoryHub(id: RxCategoryHubId): RxCategoryHub | undefined {
  return REGEN_CATEGORY_HUBS.find((c) => c.id === id);
}

/** Next.js landing pages for storefront "Learn more" deep links */
export const REGEN_CATEGORY_LANDING_PATHS: Partial<Record<string, string>> = {
  "weight-loss": "/rx/weight-loss",
  "hair-skin": "/rx/hair-skin",
  hormones: "/rx/hormones",
  "sexual-health": "/rx/sexual-health",
  "peptide-therapy": "/rx/peptides",
  peptides: "/rx/peptides",
  "vitamin-injections": "/rx/wellness",
  wellness: "/rx/wellness",
  labs: "/labs",
};

export function isRegenHubActive(pathname: string | null, hub: RxCategoryHub): boolean {
  if (!pathname) return false;
  const base = hub.hubPath.split("?")[0]!;
  return pathname === base || pathname.startsWith(`${base}/`);
}

export const REGEN_EXPLORE_FOOTER = [
  { label: "REGEN home", href: "/rx" },
  { label: "Patient care hub", href: RX_PATIENT_CARE_PATH },
  { label: "Peptide request", href: PEPTIDE_REQUEST_PATH },
  { label: "My RX portal", href: "/portal/rx" },
] as const;
