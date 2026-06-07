import type { Metadata } from "next";

import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { BestOfOswegoBadge } from "@/components/BestOfOswegoBadge";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata, siteJsonLd, faqJsonLd, breadcrumbJsonLd, SITE } from "@/lib/seo";

// ============================================================
// NON-SURGICAL FACELIFT OSWEGO IL — combined-protocol landing page
// Botox + fillers + PDO threads + RF skin tightening
// ============================================================

export const revalidate = 3600;

const PATH = "/non-surgical-facelift-oswego-il";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Non-Surgical Facelift in Oswego, IL | Botox, Fillers, PDO Threads & RF",
    description:
      "Non-surgical facelift in Oswego, IL — our advanced technique combines Botox, dermal fillers, PDO threads, and skin-tightening to lift, sculpt, and rejuvenate naturally. Minimal downtime. Free consult.",
    path: PATH,
  }),
  keywords: [
    "non surgical facelift Oswego",
    "non-surgical facelift Oswego IL",
    "PDO threads Oswego",
    "liquid facelift Oswego",
    "facelift without surgery Naperville",
    "skin tightening face Oswego",
    "jowls treatment Oswego IL",
    "facial rejuvenation Aurora IL",
    "thread lift near me Oswego",
    "Morpheus8 face Oswego",
  ],
};

const BENEFITS = [
  { title: "Lift sagging skin", body: "Strategic tightening and lifting where gravity and age show first — jowls, jawline, and lower face." },
  { title: "Restore facial volume", body: "Dermal fillers rebuild youthful contours in cheeks, temples, and mid-face without looking overdone." },
  { title: "Smooth wrinkles", body: "Botox softens dynamic lines; fillers address deeper folds — a refreshed look, not frozen." },
  { title: "Stimulate collagen", body: "PDO threads and RF microneedling (Morpheus8 Burst) remodel collagen for firmer, smoother skin over time." },
  { title: "Minimal downtime", body: "No general anesthesia, no operating room — most clients return to normal activity quickly with a plan built for your lifestyle." },
];

const STACK = [
  {
    name: "Botox & neuromodulators",
    role: "Smooth expression lines",
    detail: "Softens forehead, crow's feet, and frown lines so your face looks rested — not stiff.",
    href: "/botox-oswego",
  },
  {
    name: "Dermal fillers",
    role: "Restore volume & contour",
    detail: "Rebuild cheek, jaw, and mid-face structure for a lifted, balanced profile.",
    href: "/dermal-fillers-oswego",
  },
  {
    name: "PDO threads",
    role: "Lift & support tissue",
    detail: "Biostimulatory threads provide an immediate lift and collagen stimulation for longer-lasting firmness.",
    href: PATH,
  },
  {
    name: "Skin tightening (RF)",
    role: "Firm & remodel collagen",
    detail: "Morpheus8 Burst and QuantumRF tighten lax skin on the jawline, neck, and lower face — often combined in a full rejuvenation plan.",
    href: "/morpheus8-burst-oswego-il",
  },
];

const FAQS = [
  {
    question: "What is a non-surgical facelift in Oswego?",
    answer:
      "A non-surgical facelift at Hello Gorgeous Med Spa combines Botox, dermal fillers, PDO threads, and skin-tightening strategies into one customized plan — lifting sagging skin, restoring volume, smoothing wrinkles, and stimulating collagen without surgery or general anesthesia.",
  },
  {
    question: "How is a non-surgical facelift different from surgery?",
    answer:
      "Surgical facelifts remove and reposition skin and tissue under anesthesia with weeks of recovery. Our approach uses injectables, threads, and RF technology to lift, sculpt, and rejuvenate with minimal downtime — ideal when you want meaningful improvement without an operating room.",
  },
  {
    question: "What treatments are included?",
    answer:
      "Your plan may include Botox (or Dysport/Jeuveau), hyaluronic acid fillers, PDO thread lifting, and collagen-stimulating skin tightening such as Morpheus8 Burst or QuantumRF on the face and neck. Not everyone needs every tool — we design the combination at your free consultation.",
  },
  {
    question: "Who is a good candidate?",
    answer:
      "Good candidates have mild to moderate sagging, volume loss, or skin laxity who want a natural refresh — not a dramatic surgical change. We assess your skin, anatomy, and goals in person and recommend an honest combination plan.",
  },
  {
    question: "How long do results last?",
    answer:
      "Botox typically lasts 3–4 months; fillers 6–18 months depending on product and area; PDO threads 12–18+ months as collagen builds; RF tightening improves over a series and can last a year or more with maintenance. We'll outline timelines for your specific plan at consult.",
  },
  {
    question: "Where is Hello Gorgeous located?",
    answer:
      "74 W Washington St, downtown Oswego, IL — serving Naperville, Aurora, Plainfield, Yorkville, and the Fox Valley. Call 630-636-6193 or book online.",
  },
];

export default function NonSurgicalFaceliftOswegoPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Non-Surgical Facelift Oswego IL", url: `${SITE.url}${PATH}` },
  ];

  const procedureJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Non-Surgical Facelift",
    description:
      "Combined Botox, dermal fillers, PDO threads, and RF skin tightening for facial lifting and rejuvenation without surgery.",
    procedureType: "NoninvasiveProcedure",
    bodyLocation: "Face",
    howPerformed:
      "Customized combination of neuromodulators, dermal fillers, PDO threads, and radiofrequency skin tightening under medical provider supervision.",
    preparation: "Free consultation to assess candidacy and design a personalized treatment plan.",
    followup: "Follow-up visits per protocol; touch-ups as recommended.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(procedureJsonLd) }} />

      <main className="bg-white">
        <Section className="relative bg-black text-white py-16 lg:py-22">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a12] to-black opacity-95" />
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <FadeUp>
              <BestOfOswegoBadge className="justify-center mb-4" />
              <p className="uppercase tracking-[0.25em] text-xs text-[#FFB8DC] mb-3">Oswego, IL · Kendall County</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-5">
                Non-Surgical Facelift in{" "}
                <span className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent">
                  Oswego, IL
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/85 font-medium leading-relaxed max-w-3xl mx-auto mb-8">
                Our advanced facelift technique combines Botox, dermal fillers, PDO threads, and skin-tightening
                strategies to lift, sculpt, and rejuvenate the face naturally — without surgery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTA href={BOOKING_URL} variant="gradient">
                  Book Free Consultation
                </CTA>
                <CTA href="tel:6306366193" variant="outline">
                  Call 630-636-6193
                </CTA>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-10">
                What a non-surgical facelift can do
              </h2>
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b, i) => (
                <FadeUp key={b.title} delayMs={i * 40}>
                  <div className="h-full rounded-2xl border-4 border-black bg-white p-5 shadow-[5px_5px_0_0_rgba(230,0,126,0.25)]">
                    <h3 className="font-bold text-[#E6007E] mb-2">▸ {b.title}</h3>
                    <p className="text-sm text-black/80 font-medium leading-relaxed">{b.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-white">
          <div className="max-w-4xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl md:text-3xl font-black text-black text-center mb-4">
                The Hello Gorgeous combination approach
              </h2>
              <p className="text-center text-black/70 font-medium max-w-2xl mx-auto mb-10">
                One size does not fit every face. We layer the right tools — not every tool — for a plan that looks
                like you, lifted.
              </p>
            </FadeUp>
            <div className="space-y-4">
              {STACK.map((t, i) => (
                <FadeUp key={t.name} delayMs={i * 50}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.2)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#E6007E]">{t.role}</p>
                      <h3 className="text-xl font-black text-black mt-1">{t.name}</h3>
                      <p className="mt-2 text-sm text-black/75 font-medium">{t.detail}</p>
                    </div>
                    {t.href !== PATH && (
                      <Link
                        href={t.href}
                        className="shrink-0 text-sm font-bold text-[#E6007E] underline decoration-2 underline-offset-2 hover:no-underline"
                      >
                        Learn more →
                      </Link>
                    )}
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-gradient-to-b from-[#FFF0F7] to-white">
          <div className="max-w-3xl mx-auto">
            <FadeUp>
              <h2 className="text-2xl font-black text-black text-center mb-8">Common questions</h2>
            </FadeUp>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <FadeUp key={f.question} delayMs={i * 35}>
                  <div className="rounded-2xl border-4 border-black bg-white p-6 shadow-[4px_4px_0_0_rgba(230,0,126,0.15)]">
                    <h3 className="font-bold text-[#E6007E] mb-2">▸ {f.question}</h3>
                    <p className="text-black/85 font-medium leading-relaxed">{f.answer}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-4">Lift. Sculpt. Rejuvenate — without surgery.</h2>
            <p className="text-white/90 font-medium mb-8">
              Free consultation · Ryan Kent, FNP-BC on site · 74 W Washington St, Oswego, IL
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href={BOOKING_URL} variant="white">
                Book Free Consultation
              </CTA>
              <CTA href="/compare/quantum-rf-vs-facelift" variant="outline">
                Compare vs surgical facelift
              </CTA>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
