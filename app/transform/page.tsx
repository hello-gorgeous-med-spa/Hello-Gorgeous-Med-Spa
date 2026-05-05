import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE } from "@/lib/seo";

const _base = pageMetadata({
  title: "Weight Loss + Skin Tightening Transformation | Hello Gorgeous Med Spa",
  description:
    "A founder-led transformation plan in Oswego, IL: GLP-1 support plus Morpheus8 skin tightening so confidence matches your progress.",
  path: "/transform",
});

const TRANSFORM_OG_IMAGE = `${SITE.url}/images/morpheus8/morpheus8-burst-deep-thighs-skin-tightening-before-after.png?v=transform-og` as const;

export const metadata: Metadata = {
  ..._base,
  openGraph: {
    ..._base.openGraph,
    images: [
      {
        url: TRANSFORM_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Morpheus8 skin tightening for post-weight-loss confidence",
      },
    ],
  },
  twitter: {
    ..._base.twitter,
    images: [TRANSFORM_OG_IMAGE],
  },
};

const PACKAGES = [
  {
    name: "Essential",
    subtitle: "Foundation Transformation",
    price: "$2,397",
    note: "Single payment, financing available",
    items: [
      "3 months Semaglutide GLP-1 support (covered by program)",
      "3 Morpheus8 Burst treatments (1 area)",
      "Monthly check-ins with Ryan Kent, FNP-BC",
      "Treatments scheduled Month 1, 3, and 5",
    ],
  },
  {
    name: "Recommended",
    subtitle: "Premium Transformation",
    price: "$2,797",
    note: "Most selected package",
    items: [
      "3 months Tirzepatide GLP-1 support (covered by program)",
      "3 Morpheus8 DEEP treatments (1 area)",
      "Advanced depth for stronger collagen remodeling",
      "Monthly body composition and progress check-ins",
    ],
  },
  {
    name: "VIP",
    subtitle: "Total Transformation",
    price: "$4,997",
    note: "Single payment, financing available",
    items: [
      "6 months GLP-1 support (provider-guided)",
      "6 Morpheus8 sessions across 2 areas",
      "Bi-weekly provider touchpoints",
      "Medical-grade skincare support plan",
    ],
  },
];

export default function TransformPage() {
  return (
    <main className="bg-black text-white">
      <section className="border-b border-white/10 bg-gradient-to-br from-black via-[#1a0d15] to-black">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E6007E]/35 bg-[#E6007E]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FFB8DC]">
              Limited Spots This Month
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-5xl">
              The Weight Loss is Half the Journey.
              <span className="block bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                Skin Tightening Brings the Confidence Back.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
              This transformation plan combines provider-guided GLP-1 support with Morpheus8 skin tightening so your
              results look as strong as the work you have put in.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#E6007E] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                Book Free Consult
              </a>
              <Link
                href="/blog/weight-loss-skin-tightening-transformation-oswego-il"
                className="rounded-full border-2 border-[#E6007E] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
              >
                Read Full Story
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E6007E]/30 bg-[#140b11] p-6 shadow-[0_30px_80px_rgba(230,0,126,0.18)]">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFB8DC]">Founder message</p>
            <h2 className="mt-2 text-2xl font-bold">A Letter from Dani</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Too many people lose weight and still feel stuck because nobody addresses loose skin and loss of
              elasticity. We designed this program so your confidence can catch up to your progress.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              This is a long-term care plan, not a one-and-done appointment. You get real provider oversight, clear
              timelines, and transparent package pricing.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#E6007E]">Packages</p>
          <h2 className="mt-2 text-3xl font-black">Choose Your Transformation Path</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <article
                key={pkg.name}
                className="rounded-2xl border border-white/10 bg-[#121212] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.35)]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFB8DC]">{pkg.name}</p>
                <h3 className="mt-2 text-xl font-bold">{pkg.subtitle}</h3>
                <p className="mt-3 text-4xl font-black text-[#E6007E]">{pkg.price}</p>
                <p className="mt-1 text-xs text-white/55">{pkg.note}</p>
                <ul className="mt-5 space-y-2 text-sm text-white/80">
                  {pkg.items.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-white/65">
            Financing options available through Cherry and CareCredit. Medical candidacy and package fit are confirmed
            during consultation.
          </p>
        </div>
      </section>

      <section className="bg-black">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-3xl font-black">
            Ready to Feel <span className="text-[#E6007E]">Gorgeous</span> in Your New Body?
          </h2>
          <p className="mt-4 text-white/75">
            Book a free consult and we will build a personalized timeline around your goals, budget, and comfort level.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="https://www.fresha.com/book-now/hello-gorgeous-tallrfb5/services?lid=102610&share=true&pId=95245"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#E6007E] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white"
            >
              Book Online
            </a>
            <a href="tel:6306366193" className="rounded-full border-2 border-[#E6007E] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white">
              Call 630-636-6193
            </a>
          </div>
          <p className="mt-6 text-xs text-white/45">
            Individual results vary. GLP-1 medications and device-based skin tightening require medical evaluation and
            informed consent.
          </p>
        </div>
      </section>
    </main>
  );
}
