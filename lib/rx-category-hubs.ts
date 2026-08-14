/**
 * REGEN category hubs — EXPLORE nav + landing page data (Hers-style shop taxonomy).
 */

import {
  GLP1_INTAKE_PATH,
  GLP1_REFILL_PATH,
  LABS_HUB_PATH,
  PEPTIDE_REQUEST_PATH,
  RX_PATIENT_CARE_PATH,
  SQUARE_VITAMIN_SHOT_BOOKING_URL,
  VITAMIN_SHOT_FEE_USD,
} from "@/lib/flows";
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

/**
 * Where a card's "from $X" comes from. A card declares a *source*, never a number.
 *
 * Hand-typed prices are how three phantom cards shipped: a "Vitamin D3 Injection ·
 * $148.78/vial" tile pointing at a $1.25 oral capsule, plus Biotin and Glutathione
 * injection cards pointing at capsules. Nothing forced the copy to agree with the
 * product it resolved to. Resolution lives in
 * `lib/regen/catalog/hub-card-facts.ts`.
 */
export type RxCardPriceSource =
  /**
   * Derive from `catalogProductId` via the client pricing helpers — the same numbers
   * the storefront card and product page quote. Requires `catalogProductId`.
   */
  | { source: "catalog" }
  /**
   * Derive from the GLP-1 program dose tiers. The program is priced by tier, not by
   * vial, so a single catalog SKU would badly undercut it.
   */
  | { source: "glp1-program"; compound: Glp1ProgramCompound }
  /** No public starting price: the NP quotes this one at the consult. */
  | { source: "consult" }
  /** Established-patient flow (refills). An audience, not a price. */
  | { source: "existing-patient" };

export type Glp1ProgramCompound = "semaglutide" | "tirzepatide";

export type RxCategoryProduct = {
  id: string;
  name: string;
  /**
   * The marketing angle only. Anything the catalog already knows — price, strength,
   * fill volume — is derived, so it cannot drift out of sync with the SKU.
   */
  description: string;
  price: RxCardPriceSource;
  href: string;
  image: string;
  imageAlt: string;
  badge?: "POPULAR" | "NEW";
  rx?: boolean;
  /** Stable RE GEN catalog id (`p##`) for Add-to-cart ProductCard */
  catalogProductId?: string;
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
  /**
   * In-clinic alternative to a pharmacy-shipped vial — the $25 Vitamin Bar shot.
   * Shown as its own band so the cheap, no-intake path is not buried under
   * products that require a consult first.
   */
  inClinicOption?: {
    eyebrow: string;
    title: string;
    body: string;
    priceLabel: string;
    bookHref: string;
    bookLabel: string;
  };
};

const WEIGHT_LOSS_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    description: "GLP-1 injection · NP-supervised weight loss",
    price: { source: "glp1-program", compound: "semaglutide" },
    href: GLP1_INTAKE_PATH,
    image: "/images/regen/catalog/regen-semaglutide.jpg",
    imageAlt: "Compounded semaglutide — RE GEN medical weight loss",
    badge: "POPULAR",
    rx: true,
    /** Injectable SKU the shop lists. Oral ODT (p102) is staff-only. */
    catalogProductId: "p151",
  },
  {
    id: "tirzepatide",
    name: "Compounded Tirzepatide",
    description: "Dual GLP-1 + GIP pathway · medical weight loss program",
    price: { source: "glp1-program", compound: "tirzepatide" },
    href: GLP1_INTAKE_PATH,
    image: "/images/regen/catalog/regen-tirzepatide.jpg",
    imageAlt: "Compounded tirzepatide — RE GEN medical weight loss",
    rx: true,
    /** Injectable SKU the shop lists. Oral ODT (p130) is staff-only. */
    catalogProductId: "p153",
  },
  {
    id: "glp1-refill",
    name: "GLP-1 Refill",
    description: "Renew semaglutide or tirzepatide · ship to home",
    price: { source: "existing-patient" },
    href: GLP1_REFILL_PATH,
    image: "/images/shop-rx/glp1-refill.png",
    imageAlt: "GLP-1 refill — REGEN home delivery",
    rx: true,
  },
];

const HAIR_SKIN_GOAL_HREF = "/rx?goal=skin-and-hair";

/**
 * Every hair & skin card resolves to a SKU the client shop deliberately hides (derm
 * creams and hair-loss protocols stay staff-only), so each one routes to the category
 * intake and quotes nothing. `{ source: "consult" }` is that decision written down:
 * the invariant checker fails a `catalog`-sourced card whose SKU is hidden, so a
 * product dropping out of the shop can no longer silently strand a price.
 */
const HAIR_SKIN_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "p58",
    name: "GHK-Cu Cream",
    description: "Copper peptide topical — collagen support, skin repair, and firmness",
    price: { source: "consult" },
    href: `${HAIR_SKIN_GOAL_HREF}&product=p58`,
    image: "/images/regen/catalog/ghk-cu.png",
    imageAlt: "GHK-Cu copper peptide cream — RE GEN hair and skin",
    badge: "POPULAR",
    rx: false,
    catalogProductId: "p58",
  },
  {
    id: "manetain",
    name: "ManeTain Hair Spray",
    description: "Prescription leave-in for thinning hair — minoxidil with supportive actives",
    price: { source: "consult" },
    href: HAIR_SKIN_GOAL_HREF,
    image: "/images/regen/prod-manetain.png",
    imageAlt: "ManeTain prescription hair spray — RE GEN",
    rx: true,
    catalogProductId: "p22",
  },
  {
    id: "minoxidil-oral",
    name: "Oral Minoxidil",
    description: "Low-dose systemic hair regrowth support when topicals aren’t enough",
    price: { source: "consult" },
    href: HAIR_SKIN_GOAL_HREF,
    image: "/images/regen/prod-manetain.png",
    imageAlt: "Oral minoxidil — RE GEN hair regrowth",
    rx: true,
    catalogProductId: "p81",
  },
  {
    id: "glow",
    name: "Glow Cream",
    description: "Even skin tone — kojic acid, ascorbic acid & hyaluronic acid",
    price: { source: "consult" },
    href: HAIR_SKIN_GOAL_HREF,
    image: "/images/regen/prod-glow.jpg",
    imageAlt: "Glow brightening cream — RE GEN dermatology",
    rx: true,
    catalogProductId: "p57",
  },
  {
    id: "miracle",
    name: "Miracle Cream",
    description: "Repair & brightening — hydroquinone with a retinoic blend",
    price: { source: "consult" },
    href: HAIR_SKIN_GOAL_HREF,
    image: "/images/regen/prod-miracle.jpg",
    imageAlt: "Miracle repair cream — RE GEN",
    rx: true,
    catalogProductId: "p150",
  },
  {
    id: "erase",
    name: "Erase Cream",
    description: "Acne-focused Rx — retinoic acid with clindamycin",
    price: { source: "consult" },
    href: HAIR_SKIN_GOAL_HREF,
    image: "/images/regen/prod-erase.jpg",
    imageAlt: "Erase acne cream — RE GEN",
    rx: true,
  },
];

const HORMONE_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "test-cyp",
    name: "Testosterone Cypionate",
    description: "Injectable TRT — lab-guided, with your dose set by the NP",
    price: { source: "catalog" },
    href: "/rx?goal=hormones",
    image: "/regen-site/assets/prod-testosterone-regen.png",
    imageAlt: "Testosterone cypionate — RE GEN hormones",
    badge: "POPULAR",
    rx: true,
    catalogProductId: "p178",
  },
  {
    id: "test-cream",
    name: "Testosterone Cream",
    description: "Topical TRT applied daily — strength set at your consult",
    price: { source: "catalog" },
    href: "/rx?goal=hormones",
    image: "/regen-site/assets/prod-testosterone-regen.png",
    imageAlt: "Testosterone cream — RE GEN",
    rx: true,
    catalogProductId: "p123",
  },
  {
    id: "clomiphene",
    name: "Clomiphene",
    description: "Stimulate natural testosterone — fertility-friendly option for some men",
    price: { source: "catalog" },
    href: "/rx?goal=hormones",
    image: "/regen-site/assets/banner-enclomiphene.jpg",
    imageAlt: "Clomiphene — RE GEN hormone support",
    rx: true,
    catalogProductId: "p27",
  },
  {
    id: "biest",
    name: "Bi-Est Cream",
    description: "Bioidentical estriol / estradiol blend for women’s HRT",
    price: { source: "catalog" },
    href: "/rx?goal=hormones",
    image: "/regen-site/assets/prod-biest-regen.png",
    imageAlt: "Bi-Est cream — RE GEN women's hormones",
    rx: true,
    catalogProductId: "p11",
  },
  {
    id: "progesterone",
    name: "Progesterone",
    description: "Menopause and cycle support — bioidentical progesterone",
    price: { source: "catalog" },
    href: "/rx?goal=hormones",
    image: "/regen-site/assets/prod-progesterone-regen.png",
    imageAlt: "Progesterone — RE GEN HRT",
    rx: true,
    catalogProductId: "p98",
  },
];

const SEXUAL_HEALTH_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "sildenafil",
    name: "Sildenafil RDT",
    description: "Fast-dissolve ED tablet — discreet, NP-prescribed",
    price: { source: "consult" },
    href: "/rx?goal=intimacy",
    image: "/regen-site/assets/prod-sildenafil-regen.png",
    imageAlt: "Sildenafil — RE GEN sexual health",
    badge: "POPULAR",
    rx: true,
    catalogProductId: "p106",
  },
  {
    id: "tadalafil",
    name: "Tadalafil RDT",
    description: "Longer-window ED support — rapid-dissolve format",
    price: { source: "consult" },
    href: "/rx?goal=intimacy",
    image: "/regen-site/assets/prod-tadalafil.jpg",
    imageAlt: "Tadalafil — RE GEN",
    rx: true,
    catalogProductId: "p116",
  },
  {
    id: "maxx-pe",
    name: "MAXX PE",
    description: "Combination performance formula for men",
    price: { source: "consult" },
    href: "/rx?goal=intimacy",
    image: "/regen-site/assets/prod-maxxpe.jpg",
    imageAlt: "MAXX PE — RE GEN men's sexual health",
    rx: true,
    catalogProductId: "p2",
  },
  {
    id: "scream-cream",
    name: "Scream Cream",
    description: "Topical arousal cream for women — compounded Rx",
    price: { source: "consult" },
    href: "/rx?goal=intimacy",
    image: "/regen-site/assets/prod-screamcream-regen.png",
    imageAlt: "Scream Cream — RE GEN women's wellness",
    rx: true,
    catalogProductId: "p144",
  },
  {
    id: "pt-141",
    name: "PT-141 Injection",
    description: "Peptide arousal support — libido pathway for men & women",
    price: { source: "catalog" },
    href: "/rx?goal=intimacy",
    image: "/regen-site/assets/prod-oxytocin-regen.png",
    imageAlt: "PT-141 — RE GEN peptide intimacy",
    rx: true,
    catalogProductId: "p165",
  },
];

const PEPTIDE_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "bpc-157",
    name: "BPC-157 Injection",
    description: "Tissue repair & gut support — popular recovery peptide protocol",
    price: { source: "catalog" },
    href: "/rx?goal=recovery-and-performance",
    image: "/regen-site/assets/prod-bpc157-regen.png",
    imageAlt: "BPC-157 peptide — RE GEN",
    badge: "POPULAR",
    rx: true,
    catalogProductId: "p156",
  },
  {
    id: "nad-100",
    name: "NAD+ Injection",
    description: "Mitochondrial & cellular energy support",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-nad-regen.png",
    imageAlt: "NAD+ injection — RE GEN peptides",
    badge: "POPULAR",
    rx: true,
    catalogProductId: "p149",
  },
  {
    id: "sermorelin",
    name: "Sermorelin Injection",
    description: "Growth-hormone axis support — nightly injection protocol",
    price: { source: "catalog" },
    href: "/rx?goal=recovery-and-performance",
    image: "/regen-site/assets/prod-sermorelin-regen.png",
    imageAlt: "Sermorelin — RE GEN",
    rx: true,
    catalogProductId: "p105",
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 / Ipamorelin",
    description: "GH secretagogue combo — recovery & body composition",
    price: { source: "catalog" },
    href: "/rx?goal=recovery-and-performance",
    image: "/regen-site/assets/prod-cjc-ipamorelin-regen.png",
    imageAlt: "CJC Ipamorelin — RE GEN",
    rx: true,
    catalogProductId: "p23",
  },
  {
    id: "tb-500",
    name: "TB-500 Injection",
    description: "Mobility & tissue support — often paired with BPC-157",
    price: { source: "catalog" },
    href: "/rx?goal=recovery-and-performance",
    image: "/regen-site/assets/prod-tb500-regen.png",
    imageAlt: "TB-500 peptide — RE GEN",
    rx: true,
    catalogProductId: "p195",
  },
  {
    id: "glutathione",
    name: "Glutathione Injection",
    description: "Master antioxidant — glow & detox support",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-glutathione-regen.png",
    imageAlt: "Glutathione — RE GEN wellness",
    rx: false,
    /** The injectable vial on the BoomRx sheet — p59 is the capsule. */
    catalogProductId: "p60",
  },
];

const WELLNESS_PRODUCTS: RxCategoryProduct[] = [
  {
    id: "b12",
    name: "B12 Methylcobalamin",
    description: "Energy & metabolism — injectable wellness staple",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-b12-regen.png",
    imageAlt: "B12 injection — RE GEN daily wellness",
    badge: "POPULAR",
    rx: false,
    catalogProductId: "p175",
  },
  {
    id: "nad-wellness",
    name: "NAD+ Injection",
    description: "10-week supply protocol — longevity & focus support",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-nad-regen.png",
    imageAlt: "NAD+ — RE GEN daily wellness",
    rx: true,
    catalogProductId: "p149",
  },
  {
    id: "vitamin-d3",
    name: "Vitamin D3 Injection",
    description: "Immune & bone support — especially in Midwest winters",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-vitamind3-regen.png",
    imageAlt: "Vitamin D3 injection — RE GEN",
    rx: false,
    catalogProductId: "p196",
  },
  {
    id: "glutathione-wellness",
    name: "Glutathione Injection",
    description: "Antioxidant & skin-brightening wellness shot supply",
    price: { source: "catalog" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-glutathione-regen.png",
    imageAlt: "Glutathione — RE GEN",
    rx: false,
    /** The injectable vial on the BoomRx sheet — p59 is the capsule. */
    catalogProductId: "p60",
  },
  {
    id: "ldn",
    name: "Low-Dose Naltrexone",
    description: "LDN capsules — metabolic & inflammation support when appropriate",
    price: { source: "consult" },
    href: "/rx?goal=energy-and-longevity",
    image: "/regen-site/assets/prod-ldn.png",
    imageAlt: "LDN — RE GEN wellness Rx",
    rx: true,
    /** Oral capsule — not on the client shop, so this tile quotes nothing and opens intake. */
    catalogProductId: "p83",
  },
];

const PEPTIDE_FAQ = [
  {
    q: "Are RE GEN peptides prescription?",
    a: "Yes — every protocol is dispensed on a prescription after Ryan Kent, FNP-BC reviews your health history, and nothing is filled without that review. Most are compounded for you by licensed US pharmacies rather than sold as FDA-approved brand products, and some compounds clients ask about are still investigational and not FDA-approved. Ryan tells you which category yours falls into before you start.",
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
    a: "Start your intake at RE GEN, reserve your $49 consult, and meet Ryan Kent, FNP-BC. After he approves your protocol you're invoiced for the vials — pick them up in Oswego or ship flat $30.",
  },
  {
    q: "Can I read more before I buy?",
    a: "Yes — visit our education hub at /peptides for peptide explainers, or call 630-636-6193 to talk with our Oswego team.",
  },
] as const;

const WELLNESS_FAQ = [
  {
    q: "What is RE GEN daily wellness?",
    a: "Injectable B12, NAD+, vitamin D3, glutathione, and related wellness Rx — ordered online with NP review, then shipped from the compounding pharmacy directly to your door across Illinois.",
  },
  {
    q: "Should I order a vial or just come in for a shot?",
    a: "Either. Any single vitamin injection at our Oswego Vitamin Bar is $25 and takes about 10 minutes — no intake needed. Ordering a vial online makes sense when you want a full supply to give yourself at home; the pharmacy ships it to you after NP review.",
  },
  {
    q: "Can I still visit the Vitamin Bar in Oswego?",
    a: "Yes! In-clinic drive-thru wellness shots ($25 each) and IV therapy remain available at Hello Gorgeous Med Spa. RE GEN daily wellness is for at-home injectable supplies when that fits your life better.",
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

const CONSULT_FIRST_STEPS = [
  {
    title: "Start your intake",
    body: "Free — your goals, health history, and consent. Nothing is charged to submit it.",
  },
  {
    title: "Reserve your consult · $49",
    body: "Holds your visit with Ryan Kent, FNP-BC. Medication cost is quoted separately.",
  },
  {
    title: "Meet your provider",
    body: "Ryan reviews everything and sets your protocol and dose — by telehealth or in Oswego.",
  },
  {
    title: "Approved, then filled",
    body: "You're invoiced after approval. Pick up in clinic or ship flat $30 with tracking.",
  },
];

const WEIGHT_LOSS_FAQ = [
  {
    q: "Are compounded GLP-1 medications FDA-approved?",
    a: "Compounded semaglutide and tirzepatide are prepared by a licensed US pharmacy for an individual patient when medically appropriate — they are not FDA-approved brand products. Your NP reviews candidacy, dosing, and follow-up before anything ships.",
  },
  {
    q: "How does RE GEN weight loss work?",
    a: "Start with a short intake, reserve your $49 consult, and your NP sets the protocol before anything is filled. You're billed for medication only after approval. Ryan Kent, FNP-BC supervises every Illinois plan.",
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
    q: "What is GHK-Cu?",
    a: "GHK-Cu is a copper peptide used topically for collagen support, skin repair, and firmness. RE GEN offers cream strengths so your NP can match intensity to your goals — not an OTC cosmeceutical guess.",
  },
  {
    q: "What does a biotin injection do for hair and nails?",
    a: "Biotin (vitamin B7) supports keratin pathways tied to hair, skin, and nails. We give biotin as a $25 in-clinic shot at our Oswego Vitamin Bar rather than as a shipped vial. Results vary and timelines are realistic — often months for visible hair change.",
  },
  {
    q: "Can I use GHK-Cu and biotin together?",
    a: "Often, yes — copper peptide cream for skin repair plus a biotin shot for hair and nail support is a common pairing. Your intake and NP review confirm layering and any contraindications before the cream ships; the biotin shot you can simply book.",
  },
  {
    q: "How long until I see results?",
    a: "Skin actives like GHK-Cu often show visible change in 6–12 weeks with consistent use. Hair and nail support (including biotin and minoxidil protocols) typically needs 3–6 months — growth cycles are slow.",
  },
  {
    q: "What is ManeTain?",
    a: "ManeTain is our prescription leave-in hair spray with minoxidil 5% plus supportive actives — available when you want a topical hair-loss protocol alongside or instead of peptide options.",
  },
  {
    q: "Do I need telehealth before my order ships?",
    a: "Yes for new protocols. RE GEN is consult-first: you complete an intake, reserve a $49 visit, and meet your provider. Nothing is filled or invoiced without NP approval.",
  },
  {
    q: "Who compounds these medications?",
    a: "Licensed US compounding pharmacies partner with Hello Gorgeous Med Spa — 503A/503B facilities, not gray-market research chemicals.",
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
    steps: CONSULT_FIRST_STEPS,
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
    steps: CONSULT_FIRST_STEPS,
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
        a: "Start your intake, reserve your $49 consult, and meet your NP. Medication is invoiced after approval — pick up in clinic or ship flat $30.",
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
        "BPC-157, sermorelin, NAD+, and 22+ injectable protocols — start intake, meet your NP, then pick up in Oswego or ship across Illinois.",
    },
    steps: CONSULT_FIRST_STEPS,
    products: PEPTIDE_PRODUCTS,
    trustLine: "Licensed US pharmacies · Ryan Kent, FNP-BC · NP review before every fill",
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
    steps: CONSULT_FIRST_STEPS,
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
    previewAlt: "RE GEN GHK-Cu copper peptide and biotin for hair and skin",
    heroImage: "/images/regen/hero-hair-skin.jpg",
    heroImageAlt: "RE GEN GHK-Cu copper peptide cream and biotin for hair, skin, and nails",
    hero: {
      eyebrow: "RE GEN · Hair + Skin",
      title: "Glow from the",
      titleAccent: "copper peptide.",
      subtitle:
        "GHK-Cu cream for collagen and skin repair — NP-reviewed before anything ships. Prefer a biotin shot for hair, skin, and nails? That is $25 in clinic, no intake needed.",
    },
    steps: CONSULT_FIRST_STEPS,
    products: HAIR_SKIN_PRODUCTS,
    trustLine: "GHK-Cu · Ryan Kent, FNP-BC · Shipped after approval",
    getStartedPath: HAIR_SKIN_GOAL_HREF,
    faq: [...HAIR_SKIN_FAQ],
    inClinicOption: {
      eyebrow: "Or just walk in",
      title: `Biotin shot, $${VITAMIN_SHOT_FEE_USD}`,
      body: "Biotin for hair, skin, and nails is given as an in-clinic injection at our Oswego Vitamin Bar — about ten minutes, no intake and no consult fee.",
      priceLabel: `$${VITAMIN_SHOT_FEE_USD}`,
      bookHref: SQUARE_VITAMIN_SHOT_BOOKING_URL,
      bookLabel: "Book a biotin shot →",
    },
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
        "Injectable B12, NAD+, vitamin D3, glutathione & more — NP-reviewed and shipped from the pharmacy to your door. Or stop into the Oswego Vitamin Bar for any single shot, $25.",
    },
    steps: CONSULT_FIRST_STEPS,
    products: WELLNESS_PRODUCTS,
    trustLine: "Injectable wellness · Ryan Kent, FNP-BC · Illinois patients",
    getStartedPath: "/rx",
    faq: [...WELLNESS_FAQ],
    inClinicOption: {
      eyebrow: "Or just walk in",
      title: "Any vitamin shot, $25",
      body: "Not ready for a full vial? Every single injection at our Oswego Vitamin Bar — B12, B-complex, vitamin D3, biotin, glutathione, MIC/Lipo-B — is one flat price and takes about ten minutes. No intake, no consult fee.",
      priceLabel: `$${VITAMIN_SHOT_FEE_USD}`,
      bookHref: SQUARE_VITAMIN_SHOT_BOOKING_URL,
      bookLabel: "Book a vitamin shot →",
    },
  },
];

export function getRegenCategoryHub(id: RxCategoryHubId): RxCategoryHub | undefined {
  return REGEN_CATEGORY_HUBS.find((c) => c.id === id);
}

/**
 * Store link for a hub product: its RE GEN product page when we stock it, so shoppers
 * land on the protocol they picked instead of a goal grid. Programs that must start
 * with a form (GLP-1 intake, refills) keep their own href.
 */
export function rxCategoryProductHref(product: RxCategoryProduct): string {
  const shopBrowse = !product.href || product.href.startsWith("/rx?");
  if (product.catalogProductId && shopBrowse) {
    return `/rx/product/${product.catalogProductId}`;
  }
  return product.href;
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
  { label: "Protocols", href: "/rx/protocols" },
  { label: "Regen Science Library", href: "/regen-science" },
  { label: "Patient care hub", href: RX_PATIENT_CARE_PATH },
  { label: "Peptide request", href: PEPTIDE_REQUEST_PATH },
  { label: "My RX portal", href: "/portal/rx" },
] as const;
