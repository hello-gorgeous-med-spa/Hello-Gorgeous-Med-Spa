import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TechBlogPromo } from "@/components/TechBlogPromo";
import { ContourBookLink } from "@/components/marketing/ContourBookLink";
import { QuantumRFVideoEngagement } from "@/components/marketing/QuantumRFVideoEngagement";
import { CHERRY_PAY_URL } from "@/lib/flows";
import { altForVariant } from "@/lib/og/hg-contour-og-constants";
import { pageMetadata, SITE, siteJsonLd } from "@/lib/seo";
import { QuantumRFAssistLoop } from "./QuantumRFAssistLoop";
import { QuantumRFResultsSlideshow, type QuantumSlide } from "./QuantumRFResultsSlideshow";
import { QuantumRFStickyCta } from "./QuantumRFStickyCta";

const PINK = "#E6007E";
const YT_DEMO_1 = "loJOgWGCkK8";
const YT_DEMO_2 = "VSif40VosRc";

/** On-page hero + JSON-LD; same art as `opengraph-image.png` in this folder. */
const QUANTUM_OG_IMAGE = "/images/quantum-rf/og-quantum-rf-social-share.png";

const QUANTUM_OG_ROUTE = new URL("/services/quantum-rf/opengraph-image", SITE.url).toString();

/** Link previews: dynamic `opengraph-image` route + explicit metadata URL for social crawlers. */
const _quantumBaseMeta = pageMetadata({
  title:
    "Hello Gorgeous Contour Lift™ — Quantum RF | Minimally Invasive Contouring | Oswego, IL",
  description:
    "The Hello Gorgeous Contour Lift™ is powered by InMode Quantum RF — a minimally invasive alternative to excisional surgery. Tighten, contour, and refine loose skin. Clinical videos & before/afters. Book a consult or see if you’re a candidate. Hello Gorgeous Med Spa, Oswego, IL. Morpheus8 Burst add-ons, Cherry financing.",
  path: "/services/quantum-rf",
  keywords: [
    "Quantum RF",
    "QuantumRF by InMode",
    "non-surgical lipo alternative",
    "InMode Quantum RF",
    "subdermal radiofrequency",
    "fractionated RF",
    "bipolar RF skin tightening",
    "minimally invasive body contouring",
    "soft tissue contraction",
    "Hello Gorgeous Med Spa",
    "body contouring Oswego",
  ],
});

export const metadata: Metadata = {
  ..._quantumBaseMeta,
  openGraph: {
    ..._quantumBaseMeta.openGraph,
    type: "website",
    siteName: SITE.name,
    images: [
      {
        url: QUANTUM_OG_ROUTE,
        width: 1200,
        height: 630,
        alt: altForVariant("quantumService"),
      },
    ],
  },
  twitter: {
    ..._quantumBaseMeta.twitter,
    card: "summary_large_image",
    images: [QUANTUM_OG_ROUTE],
  },
};

const CLINICAL_RESULT_SLIDES: QuantumSlide[] = [
  {
    src: "/images/quantum-rf/clinical-ba-upper-arm-tightening.png",
    label: "Upper arms",
    alt: "Clinical before and after: Quantum RF non-surgical upper arm skin tightening and contouring, reduced laxity in triceps area, Oswego med spa",
    caption: "Improved triceps contour; representative outcome — not a guarantee of your result.",
  },
  {
    src: "/images/quantum-rf/clinical-ba-jawline-neck-tightening.png",
    label: "Jawline & neck",
    alt: "Before and after Quantum RF jawline and neck skin tightening, reduced jowling and submental laxity, non-surgical lower face contouring",
    caption: "Sharper neck–jaw transition in appropriate candidates. Individual anatomy varies.",
  },
  {
    src: "/images/quantum-rf/clinical-ba-knee-skin-tightening.png",
    label: "Above the knee",
    alt: "Quantum RF clinical before and after: skin tightening and crepe reduction above the knee, non-surgical leg RF treatment",
    caption: "Texture and laxity often improve as collagen remodels. Multiple sessions are not always required.",
  },
  {
    src: "/images/quantum-rf/clinical-ba-lower-face-jawline.png",
    label: "Lower face profile",
    alt: "Before and after Quantum RF lower face and jawline tightening, non-surgical skin contraction for jowling",
    caption: "Defined lower face and jaw when soft tissue and goals align with the procedure.",
  },
  {
    src: "/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png",
    label: "Abdomen",
    alt: "Quantum RF abdomen before and after, non-surgical skin tightening and wrinkle reduction on midsection, post-laxity improvement",
    caption: "Visible smoothing of skin envelope on the abdomen in selected patients.",
  },
  {
    src: "/images/quantum-rf/clinical-ba-profile-jawline-submental.png",
    label: "Submental & profile",
    alt: "Side profile before and after Quantum RF jawline contouring, submental tightening, non-surgical double chin alternative",
    caption: "Profile refinement where subdermal RF is the appropriate tool. Consultation required.",
  },
];

const QUANTUM_FAQS = [
  {
    question: "What is QuantumRF?",
    answer:
      "QuantumRF is a minimally invasive radiofrequency treatment by InMode that uses a thin cannula placed beneath the skin to deliver controlled RF energy directly to deeper tissue layers. Unlike surface-level treatments, it works at greater depth for more dramatic skin tightening and fat reduction results.",
  },
  {
    question: "How is QuantumRF different from Morpheus8?",
    answer:
      "While Morpheus8 uses microneedles to deliver RF energy through the skin surface, QuantumRF delivers RF energy subdermally (beneath the skin) via a thin cannula. This allows QuantumRF to target deeper fat and tissue for more significant contouring, especially in areas like the jawline, neck, and body.",
  },
  {
    question: "What are the QuantumRF 10 and 25 probes?",
    answer:
      "The QuantumRF 10 is a precision probe ideal for smaller, delicate areas like the jawline, jowls, and under the chin. The QuantumRF 25 is designed for larger treatment areas like the abdomen, arms, thighs, and back, providing efficient coverage for body contouring.",
  },
  {
    question: "What areas can QuantumRF treat?",
    answer:
      "QuantumRF effectively treats the jawline, jowls, neck, under the chin (submental fullness), arms, abdomen, knees, inner and outer thighs, back, and any area with loose skin or small pockets of fat that would benefit from tightening and contouring.",
  },
  {
    question: "How many treatments will I need?",
    answer:
      "Many patients achieve their goals with just one QuantumRF session. Some may benefit from additional treatments depending on the area and desired results. Your provider will create a personalized plan during your consultation.",
  },
  {
    question: "What is the recovery like?",
    answer:
      "QuantumRF requires only local anesthesia. You may experience temporary swelling, bruising, or tenderness that typically resolves within a few days. Most patients return to normal routines within a week. Compression garments may be recommended for body treatments.",
  },
  {
    question: "When will I see results?",
    answer:
      "Early visible improvement begins within weeks as swelling subsides. Full results develop over 3-6 months as collagen production continues and the skin tightens. Results are natural-looking and long-lasting.",
  },
  {
    question: "Is QuantumRF painful?",
    answer:
      "QuantumRF is performed under local anesthesia, so you will be comfortable during the procedure. Some patients describe feeling warmth or pressure. Post-procedure discomfort is typically mild and manageable with over-the-counter pain relievers.",
  },
  {
    question: "How does QuantumRF compare to liposuction?",
    answer:
      "QuantumRF is far less invasive than traditional liposuction with significantly less downtime. While it is not designed for large-volume fat removal, it excels at skin tightening and contouring smaller areas of stubborn fat—often achieving results that liposuction alone cannot (tighter skin).",
  },
  {
    question: "How much does QuantumRF cost?",
    answer:
      "Featured packages include the Neck Quantum RF package at $2,499 (one treatment) with a complimentary Morpheus8 Burst add-on, and the Abdomen Quantum RF package at $3,999 (one treatment) with a complimentary Morpheus8 Burst add-on. Pricing is confirmed at consultation. Cherry financing is available — apply at pay.withcherry.com/hellogorgeous.",
  },
];

function QuantumJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE.url}/services/quantum-rf#procedure`,
    name: "QuantumRF — Subdermal Radiofrequency Contouring",
    alternateName: ["QuantumRF 10", "QuantumRF 25", "InMode Quantum RF", "Subdermal RF body contouring"],
    description:
      "Minimally invasive subdermal radiofrequency to tighten skin, reduce small fat pockets, and rebuild collagen as an alternative to excisional surgery in appropriate candidates.",
    procedureType: "NoninvasiveProcedure",
    bodyLocation: ["Jawline", "Neck", "Abdomen", "Arms", "Thighs", "Back"],
    howPerformed:
      "A thin cannula is placed beneath the skin to deliver controlled radiofrequency energy to deeper tissue for contraction, fat reduction, and collagen remodeling.",
    provider: {
      "@type": "MedicalBusiness",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/book`,
        actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
      },
      result: { "@type": "Reservation", name: "Quantum RF Consultation" },
    },
  };
}

function FAQJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUANTUM_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

function QuantumLaunchOffersJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "InMode Quantum RF — featured body contouring packages",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "Offer",
          name: "Neck Quantum RF Package — includes FREE Morpheus8 Burst",
          description:
            "Neck tightening, fat reduction and skin contraction, local anesthesia, one session. Complimentary Morpheus8 Burst included.",
          price: "2499",
          priceCurrency: "USD",
          url: `${SITE.url}/services/quantum-rf`,
          availability: "https://schema.org/InStock",
          seller: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "Offer",
          name: "Abdomen Quantum RF Package — includes FREE Morpheus8 Burst",
          description:
            "Abdomen contouring, stubborn fat and skin tightening. One session. Complimentary Morpheus8 Burst included.",
          price: "3999",
          priceCurrency: "USD",
          url: `${SITE.url}/services/quantum-rf`,
          availability: "https://schema.org/InStock",
          seller: { "@type": "MedicalBusiness", name: SITE.name, url: SITE.url },
        },
      },
    ],
  };
}

function QuantumVideosJsonLd() {
  const vids = [
    {
      id: YT_DEMO_1,
      name: "Real Quantum RF procedure (clinical video)",
      description:
        "Minimally invasive InMode QuantumRF subdermal treatment video — clinical education for patients at Hello Gorgeous Med Spa, Oswego, IL.",
    },
    {
      id: YT_DEMO_2,
      name: "Quantum RF procedure — additional perspective",
      description:
        "Supplemental InMode Quantum RF procedure view for patients evaluating subdermal radiofrequency contouring and skin tightening in Oswego, Illinois.",
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Quantum RF procedure videos — Hello Gorgeous Med Spa",
    itemListElement: vids.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.name,
        description: v.description,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        isAccessibleForFree: true,
        inLanguage: "en-US",
        publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
      },
    })),
  };
}

function QuantumClinicalPhotoGalleryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Representative InMode Quantum RF clinical before and after — Hello Gorgeous Med Spa",
    description:
      "Side-by-side clinical photography illustrating skin tightening and contouring with QuantumRF (Quantum RF) for arms, face, neck, abdomen, and legs. Oswego, IL.",
    numberOfItems: CLINICAL_RESULT_SLIDES.length,
    itemListElement: CLINICAL_RESULT_SLIDES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "ImageObject",
        name: s.label,
        contentUrl: `${SITE.url}${s.src}`,
        description: s.alt,
        caption: s.caption,
        representativeOfPage: {
          "@type": "WebPage",
          url: `${SITE.url}/services/quantum-rf`,
          name: "Quantum RF — InMode at Hello Gorgeous Med Spa",
        },
        copyrightHolder: { "@type": "Organization", name: SITE.name, url: SITE.url },
        creditText: `Individual results vary; not all patients are candidates. ${SITE.name}, Oswego, IL.`,
      },
    })),
  };
}

function QuantumTechImageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: "What is QuantumRF — InMode technology summary",
    contentUrl: `${SITE.url}${QUANTUM_OG_IMAGE}`,
    description:
      "InMode QuantumRF: innovative minimally invasive technology indicated for soft tissue contraction; fractionated radiofrequency; subdermal bipolar RF; QuantumRF 10 for face and small body zones; QuantumRF 25 for abdomen, thighs, hips, and buttocks; multiple zones in one session when appropriate.",
    caption:
      "Educational product overview. Treatment plans are individualized. Hello Gorgeous Med Spa, Oswego, IL.",
  };
}

const SMS_HREF = `sms:${SITE.phone.replace(/\D/g, "")}`;

const HOW_STEPS: { lead: string; caption: string; src: string; alt: string }[] = [
  {
    lead: "Energy is delivered beneath the skin",
    caption: "Subdermal delivery — not surface energy.",
    src: "/images/trifecta/quantum-rf.png",
    alt: "InMode Quantum RF handpiece for subdermal contouring",
  },
  {
    lead: "Tissue contracts",
    caption: "Immediate thermal response in treated tissue.",
    src: "/images/morpheus8/quantumrf-10-jawline.png",
    alt: "Clinical before and after showing tissue tightening and contouring",
  },
  {
    lead: "Fat is remodeled",
    caption: "Targeted effect alongside skin tightening.",
    src: "/images/morpheus8/quantumrf-25-abdomen-skin.png",
    alt: "Clinical before and after abdomen skin tightening and contouring",
  },
  {
    lead: "Collagen rebuilds over time",
    caption: "Ongoing structural remodeling for months post-procedure.",
    src: "/images/morpheus8/quantumrf-10-face.png",
    alt: "Clinical result illustrating collagen-driven refinement over time",
  },
];

const TREATMENT_AREAS: { label: string; hint: string; icon: "face" | "neck" | "core" | "arm" | "thigh" | "bra" }[] = [
  { label: "Jawline / Jowls", hint: "Lower face", icon: "face" },
  { label: "Neck", hint: "Submental & banding", icon: "neck" },
  { label: "Abdomen", hint: "Core", icon: "core" },
  { label: "Arms", hint: "Upper arms", icon: "arm" },
  { label: "Inner thighs", hint: "Medial contour", icon: "thigh" },
  { label: "Bra line", hint: "Upper back", icon: "bra" },
];

function AreaIcon({ name }: { name: (typeof TREATMENT_AREAS)[number]["icon"] }) {
  const common = "h-7 w-7 shrink-0";
  if (name === "face")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3c-3 0-5.5 2.2-5.5 5.5V12c0 1.2.3 2.2.8 3.1.5.9.7 1.8.6 2.6l-.1.8h8.4l-.1-.8c-.1-.8.1-1.7.6-2.6.5-.9.8-1.9.8-3.1V8.5C17.5 5.2 15 3 12 3z" />
        <path d="M8.5 14.5c.8 1 1.7 1.5 3.5 1.5s2.7-.5 3.5-1.5" />
      </svg>
    );
  if (name === "neck")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M8 4h8M10 4v3c0 1.1.5 2 1.3 2.6M14 4v3c0 1.1-.5 2-1.3 2.6M9.3 9.6C8.4 10.3 8 11.2 8 12.3V20h8v-7.7c0-1.1-.4-2-1.3-2.7" />
      </svg>
    );
  if (name === "core")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M6 8c2-2 4-2.5 6-2.5s4 .5 6 2.5M6 8v10M18 8v10M6 8c-1.5 2-1.5 5 0 7M18 8c1.5 2 1.5 5 0 7" />
        <path d="M8 20h8" />
      </svg>
    );
  if (name === "arm")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M7 4.5C9.5 6 12 5.5 12 5.5s2.5.5 5-1" />
        <path d="M7 4.5L5 20M12 5.5l-1.5 14.5" />
        <path d="M5 20h3" />
      </svg>
    );
  if (name === "thigh")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M9 3l-2 8v9M9 3h6M15 3l2 8v9M7 20h10" />
      </svg>
    );
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 6h14M5 10h14M8 6v3c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5V6" />
      <path d="M8 9v4c0 1.5 1 2.5 2.5 2.5h3c1.5 0 2.5-1 2.5-2.5V9" />
    </svg>
  );
}

export default function QuantumRFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumLaunchOffersJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumVideosJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumClinicalPhotoGalleryJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(QuantumTechImageJsonLd()) }}
      />

      <main className="bg-white pb-24 text-black md:pb-0">
        <QuantumRFVideoEngagement />
        {/* 1. Hero */}
        <section className="relative w-full overflow-hidden text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/morpheus8/quantumrf-25-abdomen.png"
              alt=""
              fill
              className="object-cover object-[50%_28%] sm:object-[50%_32%] md:object-center"
              priority
              sizes="100vw"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-rose-950/70"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"
              aria-hidden
            />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 py-20 md:min-h-[min(100svh,880px)] md:py-20">
            <h1 className="text-center text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:max-w-[20ch] md:text-left md:text-6xl lg:text-7xl">
              The Non-Surgical Alternative to Liposuction &amp; Skin Removal
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium leading-relaxed text-white md:mx-0 md:text-left md:text-xl">
              Tighten loose skin. Sculpt stubborn areas. Restore definition — without surgery.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-semibold text-white md:mx-0 md:text-left md:text-base">
              Introducing Quantum RF — advanced minimally invasive contouring.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-light leading-relaxed text-white/95 md:mx-0 md:max-w-xl md:text-left md:text-base">
              Minimally invasive contouring for patients who want real change without surgery.
            </p>
            <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:max-w-lg sm:flex-row sm:items-stretch sm:gap-5">
              <ContourBookLink
                className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-md px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:opacity-95"
                style={{ backgroundColor: PINK }}
                data-cl-placement="quantum_hero"
              >
                Book Consultation
              </ContourBookLink>
              <Link
                href="/contour-lift/inquiry"
                className="inline-flex min-h-[56px] flex-1 items-center justify-center rounded-md border-2 border-white bg-transparent px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
                data-cl-only
                data-cl-event="contour_lift_candidate_cta_click"
                data-cl-placement="quantum_hero"
              >
                See if I’m a candidate
              </Link>
            </div>
          </div>
        </section>

        {/* 2. Videos + clinical proof — anchor for homepage "Watch procedure" link */}
        <section id="contour-lift-videos" className="border-b-2 border-black bg-black py-10 md:py-14 scroll-mt-20">
          <div className="mx-auto max-w-6xl space-y-12 px-4">
            <div>
              <p
                className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.4em] md:mb-4 md:text-xs"
                style={{ color: PINK }}
              >
                Live procedure demo
              </p>
              <h2 className="mb-5 text-center text-3xl font-bold leading-tight text-white md:mb-6 md:text-5xl">
                Watch a Real Quantum RF Procedure
              </h2>
              <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-white md:text-base">
                Performed subdermally—where real contour change happens. Many patients who were
                counseled toward surgery choose this first.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium text-white/95">
                See how Quantum RF works beneath the skin to tighten tissue and contour treated areas.
              </p>
              <div className="relative mt-8 aspect-video w-full overflow-hidden border-2 border-white shadow-2xl md:mt-9">
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${YT_DEMO_1}?rel=0`}
                  title="InMode Quantum RF procedure — real clinical video at Hello Gorgeous Med Spa, Oswego IL"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="eager"
                />
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-center text-lg font-bold text-white sm:text-2xl">
                Second procedure view
              </h3>
              <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-white/90">
                Additional in-procedure context for the same technology — helpful if you are comparing your candidacy
                to real anatomy.
              </p>
              <div className="relative aspect-video w-full overflow-hidden border-2 border-white/90 shadow-2xl">
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${YT_DEMO_2}?rel=0`}
                  title="InMode Quantum RF — supplemental procedure video for subdermal radiofrequency contouring"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black bg-white py-12 md:py-16" aria-label="Representative results">
          <div className="mx-auto max-w-4xl px-4">
            <p
              className="mb-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.45em] text-black"
              style={{ color: PINK }}
            >
              Results
            </p>
            <h2 className="text-center text-3xl font-bold leading-tight text-black md:text-4xl">
              Representative clinical before &amp; afters
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black">
              A rotating gallery of side-by-side outcomes. Use arrows or dots — keyboard arrows work on desktop.
            </p>
            <div className="mt-8">
              <QuantumRFResultsSlideshow slides={CLINICAL_RESULT_SLIDES} />
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black bg-black py-10 text-white md:py-12" aria-label="InMode technology overview">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold md:text-3xl">What is QuantumRF?</h2>
            <p className="mx-auto mt-2 text-center text-sm text-white/85">
              InMode technology overview — how QuantumRF 10 and QuantumRF 25 are used in practice.
            </p>
            <figure className="mt-6 border-2 border-white/80 bg-white p-1">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
                <Image
                  src={QUANTUM_OG_IMAGE}
                  alt="InMode QuantumRF overview: innovative minimally invasive technology for soft tissue contraction using subdermal fractionated bipolar radiofrequency, QuantumRF 10 for face and small body areas, QuantumRF 25 for abdomen, thighs, hips, and buttocks, polymer-coated handpieces, up to 60mm depth, Hello Gorgeous Med Spa offers Quantum RF in Oswego and Fox Valley, Illinois"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 720px"
                  loading="lazy"
                />
              </div>
              <figcaption className="px-2 py-3 text-center text-xs leading-relaxed text-white/80 sm:text-sm">
                Educational use; device labeling and your candidacy are confirmed in consultation. QuantumRF
                and InMode are trademarks of InMode Ltd.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* 3. What this really is */}
        <section className="border-b-2 border-black py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-black md:text-5xl">
                This Is a Procedure — Not a Facial
              </h2>
              <ul className="mt-8 space-y-0 divide-y-2 divide-black border-2 border-black">
                {[
                  "Works beneath the skin",
                  "Tightens + melts fat + rebuilds collagen",
                  "Minimally invasive with a small entry point",
                ].map((line) => (
                  <li
                    key={line}
                    className="px-4 py-4 text-lg font-bold leading-snug text-black sm:py-5 sm:text-xl md:text-2xl"
                  >
                    {line}
                  </li>
                ))}
              </ul>
              <div
                className="mt-5 border-2 bg-black px-4 py-3 text-sm font-semibold leading-relaxed text-white sm:px-5 sm:text-base"
                style={{ borderColor: PINK, boxShadow: `inset 0 0 0 1px ${PINK}` }}
              >
                Not surface level. Not a facial. Not a temporary tightening treatment.
              </div>
              <div className="mt-8">
                <ContourBookLink
                  className="inline-flex min-h-[48px] items-center justify-center rounded-md px-8 text-sm font-semibold uppercase tracking-widest text-white transition hover:opacity-95"
                  style={{ backgroundColor: PINK }}
                  data-cl-placement="quantum_procedure_block"
                >
                  Book Consultation
                </ContourBookLink>
              </div>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-black shadow-xl">
              <Image
                src="/images/morpheus8/quantumrf-25-abdomen-skin.png"
                alt="Clinical abdomen tightening result with Quantum RF"
                fill
                className="object-cover object-[50%_35%] md:object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* 4. How it works */}
        <section className="border-b-2 border-black bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-black md:text-5xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-black">Four milestones. One procedure.</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
              {HOW_STEPS.map((step, i) => (
                <div key={step.lead} className="border-2 border-black bg-white">
                  <div className="relative aspect-[4/3] w-full border-b-2 border-black">
                    <Image
                      src={step.src}
                      alt={step.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 25vw"
                      loading="lazy"
                    />
                    <div
                      className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-sm font-bold text-white"
                      style={{ backgroundColor: PINK }}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-[0.7rem] font-bold uppercase leading-snug tracking-wide text-black sm:text-xs">
                      Step {i + 1}
                    </h3>
                    <p className="mt-1 text-sm font-bold leading-tight text-black sm:text-base">{step.lead}</p>
                    <p className="mt-1.5 text-xs leading-snug text-black sm:text-sm">{step.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Comparison table */}
        <section className="border-b-2 border-black bg-black py-16 text-white md:py-24">
          <div className="mx-auto max-w-3xl px-3 sm:px-4">
            <h2 className="text-center text-3xl font-bold md:text-5xl">How Quantum RF Compares</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-white sm:text-base">
              Apples-to-apples clarity — in one view.
            </p>
            <div className="mt-8 overflow-x-auto rounded-sm sm:mt-10">
              <table className="w-full min-w-[300px] border-collapse border-2 border-white text-left text-sm sm:min-w-0 sm:text-base">
                <thead>
                  <tr className="bg-white text-black">
                    <th className="border-2 border-white px-3 py-4 text-xs font-bold uppercase tracking-wider sm:px-5 sm:py-5 sm:text-sm">
                      Treatment
                    </th>
                    <th className="border-2 border-white px-3 py-4 text-xs font-bold uppercase tracking-wider sm:px-5 sm:py-5 sm:text-sm">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["RF Microneedling", "Surface tightening"],
                    ["CoolSculpting", "Fat reduction only"],
                    ["Surgery", "Invasive"],
                  ].map(([a, b]) => (
                    <tr key={a} className="bg-black">
                      <td className="border-2 border-white px-3 py-4 font-semibold sm:px-5 sm:py-5">{a}</td>
                      <td className="border-2 border-white px-3 py-4 text-sm text-white sm:px-5 sm:py-5 sm:text-base">
                        {b}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: "rgba(230,0,126,0.25)" }}>
                    <td
                      className="border-2 border-white px-3 py-5 text-sm font-bold sm:px-5 sm:py-6 sm:text-lg"
                      style={{ color: PINK, boxShadow: `inset 0 0 0 2px ${PINK}` }}
                    >
                      Quantum RF
                    </td>
                    <td
                      className="border-2 border-white px-3 py-5 text-sm font-bold text-white sm:px-5 sm:py-6 sm:text-lg"
                      style={{ boxShadow: `inset 0 0 0 2px ${PINK}` }}
                    >
                      Tightens + contours + rebuilds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 text-center text-sm font-light italic leading-relaxed text-white sm:mt-6 sm:text-base">
              This is where non-invasive treatments stop and true transformation begins.
            </p>
            <p className="mt-3 text-center text-xs text-white/70 sm:text-sm">Individual plans vary. Consultation required.</p>
          </div>
        </section>

        {/* 6. Treatment areas */}
        <section className="border-b-2 border-black py-16 md:py-24" id="treatment-areas">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold text-black md:text-5xl">Treatment Areas</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black sm:text-base">
              Designed for the areas where loose skin and lost definition are hardest to treat.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {TREATMENT_AREAS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 border-2 border-black bg-white px-4 py-4 sm:px-5 sm:py-5"
                >
                  <div className="shrink-0" style={{ color: PINK }} aria-hidden>
                    <AreaIcon name={item.icon} />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-black">
                      {item.hint}
                    </p>
                    <p className="text-lg font-bold leading-tight text-black sm:text-xl">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Candidates */}
        <section
          id="candidates"
          className="border-b-2 border-black bg-black py-16 text-white md:py-24"
        >
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-3xl font-bold md:text-5xl">Candidacy</h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-white/90">
              A candid, specialty-level conversation — not a sales pitch.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-2 md:items-stretch md:gap-0">
              <div
                className="p-6 sm:p-8 md:p-9"
                style={{
                  backgroundColor: "rgba(230,0,126,0.12)",
                  boxShadow: `inset 0 0 0 2px ${PINK}, 0 12px 40px rgba(0,0,0,0.35)`,
                }}
              >
                <h3
                  className="text-2xl font-bold uppercase tracking-[0.2em] sm:text-3xl"
                  style={{ color: PINK }}
                >
                  Often ideal
                </h3>
                <p className="mt-1 text-sm font-medium text-white/90">The profile we most often help</p>
                <ul className="mt-6 space-y-3.5 text-base font-medium leading-relaxed text-white sm:text-lg">
                  <li>Loose skin or laxity you want to tighten and refine</li>
                  <li>Post–weight loss or post–bariatric changes</li>
                  <li>GLP-1 / medical weight–loss related laxity (e.g. face, abdomen, arms)</li>
                  <li>Wants a meaningful contour plan without excisional surgery when anatomy allows</li>
                </ul>
              </div>
              <div className="border border-white/30 bg-black/40 p-6 sm:p-8 md:p-8 md:pl-9">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
                  Less commonly ideal
                </h3>
                <p className="mt-1 text-xs text-white/60">A different path may be safer or more complete</p>
                <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-white/85">
                  <li>
                    <span className="text-white/95">Severe excess skin</span> that typically still
                    needs surgery for a full correction
                  </li>
                </ul>
                <p className="mt-4 text-sm text-white/75">
                  If the better answer is the OR, you’ll hear it here — and we’ll help you understand
                  why, clearly and respectfully.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <ContourBookLink
                className="inline-flex min-h-[48px] items-center justify-center rounded-md px-8 text-sm font-semibold uppercase tracking-widest text-white transition hover:opacity-95"
                style={{ backgroundColor: PINK }}
                data-cl-placement="quantum_candidacy"
              >
                Book Consultation
              </ContourBookLink>
            </div>
          </div>
        </section>

        {/* 8. Results timeline */}
        <section className="border-b-2 border-black bg-white py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold text-black md:text-5xl">The Results Arc</h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-sm text-black">Milestones after your procedure</p>
            <div className="relative mt-12">
              <div
                className="absolute left-[10%] right-[10%] top-[2.25rem] hidden h-0.5 md:block"
                style={{ background: `linear-gradient(90deg, black, ${PINK}, black)` }}
                aria-hidden
              />
              <div className="flex flex-col gap-0 md:flex-row md:items-stretch md:justify-between md:gap-2">
                {[
                  { t: "Immediate", d: "Tightening you can feel" },
                  { t: "4–6 weeks", d: "Visible improvement emerges" },
                  { t: "3–6 months", d: "Refinement peaks" },
                ].map((row, i) => (
                  <div
                    key={row.t}
                    className="relative flex-1 border-2 border-black bg-white px-4 py-8 text-center shadow-[6px_6px_0_0_#000] md:min-h-[200px] md:px-3"
                  >
                    <div
                      className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-black text-lg font-bold text-white"
                      style={{ backgroundColor: PINK }}
                    >
                      {i + 1}
                    </div>
                    <p className="mt-4 text-2xl font-bold leading-none tracking-tight text-black sm:text-3xl">
                      {row.t}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-black sm:text-base">{row.d}</p>
                    {i < 2 ? (
                      <div
                        className="my-2 flex justify-center text-2xl text-black md:hidden"
                        aria-hidden
                      >
                        ↓
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <p className="mx-auto mt-8 max-w-lg text-center text-sm font-light leading-relaxed text-black sm:mt-10 sm:text-base">
              Results continue to improve as collagen remodeling progresses.
            </p>
          </div>
        </section>

        {/* 9. Price positioning */}
        <section className="border-b-2 border-black bg-black py-16 text-white md:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Investment in Structure</h2>
            <p className="mt-4 text-sm font-light text-white/90">Positioned for outcomes — not a substitute for the OR when surgery is the answer.</p>
            <p className="mt-8 text-2xl font-light text-white sm:text-3xl">Surgery: $12K–$20K+</p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl" style={{ color: PINK }}>
              Quantum RF: a fraction of that investment
            </p>
            <p className="mt-8 text-base leading-relaxed text-white sm:text-lg">
              This is not a discount treatment. It is an investment in visible, structural change.
            </p>
            <div className="mt-6 text-sm text-white/80">Financing available for qualified applicants.</div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline decoration-white/50 underline-offset-4 transition hover:decoration-white"
              >
                View Cherry financing
              </a>
            </div>
          </div>
        </section>

        {/* 10. Combination */}
        <section className="border-b-2 border-black py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold text-black md:text-5xl">
              Why We Combine Quantum RF + Morpheus8
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-black">Depth plus surface. Structure plus finish.</p>
            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-0">
              <div className="border-2 border-black bg-black p-6 text-white sm:p-8 md:min-h-[220px]">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Quantum RF</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: PINK }}>
                  Deep structural tightening
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">
                  Subdermal work where skin and tissue need meaningful contraction and shaping.
                </p>
              </div>
              <div className="border-2 border-black bg-white p-6 sm:p-8 md:min-h-[220px] md:border-l-0">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-black/60">Morpheus8</p>
                <p className="mt-2 text-2xl font-bold text-black">Surface refinement</p>
                <p className="mt-2 text-sm leading-relaxed text-black/90">
                  Targeted surface remodeling for texture, fine lines, and the quality of the skin envelope.
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-sm font-light italic text-black sm:text-base">
              Together, they create a more complete and more dramatic result.
            </p>
            <p className="mt-3 text-center text-xs text-black sm:text-sm">
              Launch packages may include a complimentary Morpheus8 Burst add-on when clinically appropriate—confirmed at
              consultation.
            </p>
          </div>
        </section>

        {/* 11. Authority */}
        <section className="border-b-2 border-black bg-black py-16 text-white md:py-24">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-4xl sm:leading-tight">
              Why Experience Matters
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-relaxed text-white/95 sm:text-base">
              Advanced technology only matters when paired with judgment, technique, and precision.
            </p>
            <ul className="mt-8 space-y-3 border-t-2 border-white/20 pt-8 text-left text-sm font-medium leading-relaxed text-white sm:space-y-4 sm:text-base md:text-center">
              <li>Elite subdermal delivery is technique-dependent and unforgiving at depth</li>
              <li>We prioritize consistency, safety, and a natural-but-defined outcome profile</li>
              <li>This is performed as a high-acuity medical aesthetic procedure—by design</li>
            </ul>
            <p className="mt-8 text-sm text-white/80">
              Ryan Kent, FNP-BC · Danielle Alcala, RN-S · {SITE.address.addressLocality},{" "}
              {SITE.address.addressRegion}
            </p>
          </div>
        </section>

        {/* 12. Final CTA */}
        <section className="border-b-2 border-black bg-black py-16 text-white md:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-bold leading-tight sm:text-5xl sm:leading-tight">Ready to See What’s Possible?</h2>
            <p className="mx-auto mt-4 text-sm font-light leading-relaxed text-white/90 sm:text-base">
              Find out if you’re a candidate for one of our most advanced contouring procedures.
            </p>
            <p className="mt-1 text-xs text-white/70 sm:text-sm">Limited availability by design — medical evaluation always comes first.</p>
            <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-5">
              <ContourBookLink
                className="inline-flex min-h-[58px] flex-1 items-center justify-center rounded-md px-6 text-sm font-semibold uppercase tracking-[0.2em] text-white sm:max-w-[220px]"
                style={{ backgroundColor: PINK }}
                data-cl-placement="quantum_final_cta"
              >
                Book Consultation
              </ContourBookLink>
              <a
                href={SMS_HREF}
                className="inline-flex min-h-[58px] flex-1 items-center justify-center rounded-md border-2 border-white bg-transparent px-6 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black sm:max-w-[220px]"
                data-sms-click
                data-cl-only
                data-cl-event="contour_lift_sms_click"
                data-cl-placement="quantum_final_cta"
              >
                Text Us
              </a>
            </div>
            <p className="mt-8 text-sm font-medium text-white/85">
              A referral-grade contouring option — for patients who want a candid plan and a real protocol.
            </p>
          </div>
        </section>

        <TechBlogPromo
          title="Guides: Quantum RF, Morpheus8 &amp; InMode"
          subtitle="Deeper context on the technologies we use — for patients who like to read before they book."
          variant="secondary"
        />

        <section className="border-b border-black/10 bg-white py-10 md:py-12">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-sm font-medium uppercase tracking-[0.2em] text-black/50">Additional questions</h2>
            <div className="mt-5 space-y-2">
              {QUANTUM_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border border-black/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left text-xs font-medium text-black/80 sm:px-4 sm:text-sm">
                    {faq.question}
                    <span className="shrink-0 text-black/50 transition group-open:rotate-180" aria-hidden>
                      ▼
                    </span>
                  </summary>
                  <div className="border-t border-black/10 px-3 py-2.5 text-xs leading-relaxed text-black/70 sm:px-4 sm:text-sm">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-sm text-black">Individual results vary. Medical evaluation required.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <Link href="/services/morpheus8" className="underline decoration-black/30 underline-offset-4 hover:decoration-black">
                Morpheus8
              </Link>
              <ContourBookLink
                className="underline decoration-black/30 underline-offset-4 hover:decoration-black"
                data-cl-placement="quantum_page_footer"
              >
                Book
              </ContourBookLink>
            </div>
          </div>
        </section>
      </main>

      <QuantumRFStickyCta />
      <QuantumRFAssistLoop />
    </>
  );
}
