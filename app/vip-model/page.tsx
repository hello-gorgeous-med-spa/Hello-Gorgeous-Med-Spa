import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/seo";
import { CTA } from "@/components/CTA";
import {
  VIP_500_OFF_CAMPAIGN,
  VIP_500_OFF_COPY,
  VIP_500_OFF_USD,
} from "@/lib/campaigns/vip-500-off-fall-2026";

const PAGE_URL = `${SITE.url}${VIP_500_OFF_CAMPAIGN.path}`;

export const metadata: Metadata = {
  title: `$500 Off Any Area · Sept & Oct | VIP Model Spots Filled | Hello Gorgeous`,
  description:
    "All 20 VIP model spots are filled. $500 off any treatment area when purchased in September or October. 0% financing through Cherry for qualified clients. Consult required. Oswego, IL.",
  keywords: [
    "Morpheus8 $500 off Oswego",
    "Solaria CO2 special",
    "Cherry financing med spa",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
  ],
  openGraph: {
    title: `$500 off any area · September & October`,
    description:
      "VIP model spots are filled. $500 off any area if purchased this September or October. 0% financing with Cherry.",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

const areas = [
  {
    id: "morpheus8",
    tag: "Collagen rebuild",
    name: "Morpheus8 Burst",
    note: "Face, neck, or body — any mapped area",
    href: "/services/morpheus8",
  },
  {
    id: "solaria",
    tag: "Resurfacing",
    name: "Solaria CO₂",
    note: "Full face or a targeted zone",
    href: "/services/solaria-co2",
  },
  {
    id: "quantum",
    tag: "Contour",
    name: "Quantum RF",
    note: "Neck, abdomen, or a quoted body area",
    href: "/services/quantum-rf",
  },
];

const beforeAfterImages = [
  { src: "/images/vip-model/m8-jawline.png", alt: "Morpheus8 jawline and neck before and after" },
  { src: "/images/vip-model/m8-forehead.png", alt: "Morpheus8 Burst forehead wrinkles before and after" },
  { src: "/images/vip-model/m8-front.png", alt: "Morpheus8 full face before and after" },
  { src: "/images/vip-model/solaria-face.png", alt: "Solaria CO2 laser skin resurfacing before and after" },
  { src: "/images/vip-model/solaria-pigment.png", alt: "Solaria pigmentation before and after 1 treatment" },
  { src: "/images/vip-model/solaria-pigment2.png", alt: "Solaria CO2 laser results before and after" },
];

function OfferButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${className}`}>
      <CTA href={VIP_500_OFF_CAMPAIGN.bookHref} variant="gradient" className="px-10 py-4 text-lg font-bold">
        {VIP_500_OFF_COPY.bookLabel}
      </CTA>
      <a
        href={VIP_500_OFF_CAMPAIGN.cherryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-full border-2 border-white px-10 py-4 text-lg font-bold text-white hover:bg-white hover:text-black"
      >
        {VIP_500_OFF_COPY.cherryLabel}
      </a>
    </div>
  );
}

export default function VIPModelPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-[#FF2D8E] text-white py-2 px-4 text-center text-sm font-bold uppercase tracking-wider">
        {VIP_500_OFF_COPY.banner}
      </div>

      <section className="relative overflow-hidden px-4 pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FF2D8E]/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#FF2D8E] font-semibold uppercase tracking-widest text-sm mb-4">
            {VIP_500_OFF_COPY.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {VIP_500_OFF_COPY.headline}
            <span className="block mt-2 text-white/90">when you purchase this fall</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {VIP_500_OFF_COPY.subhead}
          </p>
          <p className="text-5xl md:text-6xl font-black text-[#FF2D8E] mb-8">${VIP_500_OFF_USD} off</p>
          <OfferButtons />
          <p className="mt-6 text-sm text-white/60">{VIP_500_OFF_COPY.offerNote}</p>
          <p className="mt-3 text-sm text-white/50">
            0% APR options through Cherry for qualified clients. Approval, term, and rate are not guaranteed.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Any area. Same $500 off.</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            Purchase a mapped treatment area in September or October and the ${VIP_500_OFF_USD} comes off that area.
            Morpheus8 Burst, Solaria CO₂, or Quantum RF.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {areas.map((area) => (
              <div key={area.id} className="rounded-2xl border-2 border-[#FF2D8E] bg-black p-6 md:p-8">
                <p className="text-[#FF2D8E] font-semibold uppercase tracking-wider text-sm mb-2">{area.tag}</p>
                <h3 className="text-2xl font-bold mb-2">{area.name}</h3>
                <p className="text-white/70 text-sm mb-4">{area.note}</p>
                <p className="text-3xl font-black text-[#FF2D8E] mb-6">${VIP_500_OFF_USD} off</p>
                <Link href={area.href} className="text-[#FF2D8E] text-sm font-semibold hover:underline">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
          <OfferButtons />
        </div>
      </section>

      <section className="px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Real results. Real transformations.</h2>
          <p className="text-white/70 text-center max-w-2xl mx-auto mb-12">
            This is what medical-grade skin technology looks like. Individual results vary.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {beforeAfterImages.map((img) => (
              <div
                key={img.src}
                className="rounded-2xl overflow-hidden border-2 border-[#FF2D8E]/30 shadow-xl shadow-[#FF2D8E]/10"
              >
                <div className="relative aspect-[9/16] md:aspect-square">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:py-20 bg-[#FF2D8E]/10 border-y-2 border-[#FF2D8E]/40">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Pay over time with Cherry</h2>
          <p className="text-white/90 mb-6">
            0% financing is available through Cherry for qualified clients. Apply in minutes — then book your consult
            and lock the ${VIP_500_OFF_USD} off if you purchase in September or October.
          </p>
          <OfferButtons />
          <p className="mt-6 text-sm text-white/60">
            <a
              href={VIP_500_OFF_CAMPAIGN.cherryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF2D8E] font-semibold hover:underline break-all"
            >
              pay.withcherry.com/hellogorgeous
            </a>
          </p>
        </div>
      </section>

      <section className="px-4 py-16 md:py-24 border-t border-white/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[#FF2D8E] font-bold uppercase tracking-widest text-sm mb-4">Thank you</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The 20 VIP model spots are fulfilled.</h2>
          <p className="text-white/70 mb-8">
            This $500-off-any-area offer is how we keep the door open for September and October purchases. Consult
            required. Call {SITE.phone}.
          </p>
          <OfferButtons />
          <p className="mt-8 text-sm text-white/50">
            Hello Gorgeous Med Spa · 74 W Washington St · Oswego, IL · {SITE.phone}
          </p>
          <Link
            href="/vip-model/terms"
            className="mt-4 inline-block text-[#FF2D8E] font-semibold hover:underline underline-offset-2"
          >
            Original program terms →
          </Link>
        </div>
      </section>
    </div>
  );
}
